const express = require('express');
const router = express.Router();

const fs = require("fs");

const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");
const funcionesmodelomovilidad = require('../modelo/modelomovilidad');
const funcionestools = require('../rutas/tools');
const funcionesmodelocarrera = require('../modelo/procesocarrera');
const funcionesmodelocupos = require('../modelo/procesocupos');
const sqlreconomiento = require('../modelo/modeloreconocimiento');
const reportepdfmakecurriculuestudiante = require('../reportesmake/reportecurriculuestuidante');
const funcionesmodelonotasacademicas = require('../modelo/procesonotasacademicos');
const funcionesreportemovilidad = require('../rutas/reportesMovilidad');
require('dotenv').config()
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const { JSDOM } = require('jsdom');
const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.ProcesoGeneracionCurriculumEstuidanteConsultor = async function (carrera, cedula) {

    try {

        var resultado = await FuncionCurriculumEstudiantilConsultor(carrera, cedula);
        return resultado
    } catch (error) {
        console.error(error);
        
    }
}

async function FuncionCurriculumEstudiantilConsultor(carrera, cedula) {
    try {
        const baseUrl = "https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/";
        const photoUrl = `https://apigestioncupos.espoch.edu.ec/wsservicioscupos/procesosdinardap/ObtenerFotoPersona/`;
        const graduationUrl = `https://apisustentacion.espoch.edu.ec/rutagrado/seguimientoTitulacion/${carrera}/${cedula}`;
        const scholarshipsUrl = `https://swbecas.espoch.edu.ec/rutaBecasUsuario/getGestionSrvBecasFicha/1/${funcionestools.CedulaSinGuion(cedula)}/5/5`;

        // Obtener datos en paralelo con manejo de errores
        const [ personaResponse, fotoResponse, titulacionResponse, becasResponse ] = await Promise.allSettled([ axios.get(baseUrl + funcionestools.CedulaSinGuion(cedula), { httpsAgent: agent }), axios.get(photoUrl + funcionestools.CedulaSinGuion(cedula), { httpsAgent: agent }), axios.get(graduationUrl, { httpsAgent: agent }), axios.get(scholarshipsUrl, { httpsAgent: agent }) ]);

        // Validar respuestas críticas
        if (personaResponse.status === 'rejected' || !personaResponse.value?.data?.listado?.[0]) {
            return { blProceso: false, mensaje: "No se pudo obtener los datos del estudiante" };
        }
        const [datosCarrera, datosEstudianteUltima] = await Promise.all([ funcionesmodelocupos.ObtenerDatosBase(carrera), funcionesmodelomovilidad.ObtenerUltimoPeriodMatriculaEstuidante(carrera, cedula) ]);
      console.log(cedula)
        var datosreconocimiento=await sqlreconomiento.ListarReconocimientosEstudianteCurriculum('OAS_Master',cedula)
        console.log(datosreconocimiento)
        // Procesar datos
        const foto = await processStudentPhoto(fotoResponse.status === 'fulfilled' ? fotoResponse.value : null);
        const titulacion = processGraduationData(titulacionResponse.status === 'fulfilled' ? titulacionResponse.value : null);
        const listadoBecas = becasResponse.status === 'fulfilled' && becasResponse.value?.data?.resultado ? becasResponse.value.data.resBecas : [];
        // Obtener récord académico
        const recordAcademicoNivel = await funcionesmodelomovilidad.ObtnerRecodAcademicoporNivel( carrera, datosEstudianteUltima.data[0].strCodigo, 15 );

        // Verificar si hay homologaciones
        const tieneHomologacion = recordAcademicoNivel.data.some(item => item.Tipo === 2);
        
        // Procesar según corresponda
        const informacionListado = tieneHomologacion
            ? await procesarConHomologacion(recordAcademicoNivel.data, carrera, datosEstudianteUltima.data[0], cedula)
            : await procesarSinHomologacion(recordAcademicoNivel.data, carrera, datosEstudianteUltima.data[0], cedula, titulacion);

        // Generar PDF
     // const pdfBase64 = await funcionesreportemovilidad.PdfCurriculumEstuidantilConsultor( cedula, personaResponse.value.data.listado[0], datosCarrera.data[0], informacionListado, foto, titulacion, listadoBecas, datosEstudianteUltima.data[0].strCodigo );
       const ListadoFiltrados = filtrarItinerarioPorNiveles(informacionListado);
     const pdfBase64 = await reportepdfmakecurriculuestudiante.PdfCurriculumEstuidantilConsultor( cedula, personaResponse.value.data.listado[0], datosCarrera.data[0], ListadoFiltrados, foto, titulacion, listadoBecas, datosEstudianteUltima.data[0].strCodigo, datosreconocimiento?.data || [] );
        return pdfBase64;
        
    } catch (error) {
        console.error(error);
        
        return { blProceso: false, mensaje: `Error: ${error.message}` };
    }
}

async function procesarConHomologacion(recordAcademicoNivel, carrera, datosEstudiante, cedula) {
    try {
        // Procesar homologaciones
        const asignaturasProcesadas = await procesarAsignaturasHomologadas(recordAcademicoNivel);
        const { asignaturasAprobadas, asignaturasProcesadasLista } = await procesarAsignaturasAprobadasSinHomologar(asignaturasProcesadas);
        
        // Obtener niveles de la malla actual
        const nivelesMalla = await funcionesmodelomovilidad.ObtenerNivelesMallaDadoPeriodo(carrera, datosEstudiante.strCodPeriodo);
        
        const listadoAsignaturaProcesada = [];
        
        // Procesar cada nivel
        for (const nivel of nivelesMalla.data) {
            const mallaAsignaturas = await funcionesmodelomovilidad.MallCarreraASignaturasporNivelPeriodo(
                carrera, 
                datosEstudiante.strCodPeriodo, 
                nivel.strCodNivel
            );
            
            if (mallaAsignaturas.count > 0) {
                for (const asignaturaMalla of mallaAsignaturas.data) {
                    const asignaturaProcesada = await procesarAsignaturaMalla(
                        asignaturaMalla,
                        nivel,
                        asignaturasProcesadas.homologadas,
                        asignaturasAprobadas,
                        cedula,
                        datosEstudiante,
                        carrera
                    );
                    
                    if (asignaturaProcesada) {
                        listadoAsignaturaProcesada.push(asignaturaProcesada);
                    }
                }
            }
        }
        
        // Filtrar asignaturas que no necesita aprobar
        return await procesarAsignaturasNoNecesitaAprobar(carrera, datosEstudiante.strCodigo, listadoAsignaturaProcesada, nivelesMalla.data);
        
    } catch (error) {
        console.error(error);
        
        throw error;
    }
}

async function procesarSinHomologacion(recordAcademicoNivel, carrera, datosEstudiante, cedula, titulacion) {
    try {
        // Filtrar asignaturas aprobadas
        const asignaturasAprobadas = recordAcademicoNivel.filter(asignatura => 
            ['A', 'E', 'H', 'RC', 'AVC', 'C'].includes(asignatura.Equivalencia)
        );
        
        // Si el estudiante ha terminado, mostrar todo el récord académico
        if (titulacion.estado === 'TERMINADO') {
            const nivelesAgrupados = agruparAsignaturasPorNivel(asignaturasAprobadas);
            return nivelesAgrupados.map(nivel => ({
                ...nivel,
                listadoasignaturas: asignaturasAprobadas.filter(a => a.Nivel === nivel.strDescripcion)
            }));
        }
        
        // Procesar malla curricular actual
        const nivelesMalla = await funcionesmodelomovilidad.ObtenerNivelesMallaDadoPeriodo(carrera, datosEstudiante.strCodPeriodo);
        const listadoAsignaturaProcesada = [];
        
        for (const nivel of nivelesMalla.data) {
            const mallaAsignaturas = await funcionesmodelomovilidad.MallCarreraASignaturasporNivelPeriodo(
                carrera, 
                datosEstudiante.strCodPeriodo, 
                nivel.strCodNivel
            );
            
            if (mallaAsignaturas.count > 0) {
                for (const asignaturaMalla of mallaAsignaturas.data) {
                    const asignaturaAprobada = asignaturasAprobadas.find(a => 
                        a.CodigoMateriaAnterior === asignaturaMalla.strCodMateria
                    );
                    
                    const asignaturaProcesada = {
                        Cedula: cedula,
                        Tipo: 2,
                        Periodo: "",
                        FechaMatricula: "",
                        Nivel: nivel.strDescripcion,
                        codNivel: nivel.strCodNivel,
                        CodigoMateriaAnterior: asignaturaMalla.strCodMateria,
                        NombreMateriaAnterior: asignaturaMalla.nombreasignatura,
                        nombrearea: asignaturaMalla.nombrearea,
                        nombretipo: asignaturaMalla.nombretipo,
                        CodigoMateriaNueva: '',
                        estadoasignatura: asignaturaAprobada ? 'APROBADA' : 'POR APROBAR'
                    };
                    
                    if (asignaturaAprobada) {
                        Object.assign(asignaturaProcesada, {
                            nombrehomologacion: asignaturaAprobada.nombrehomologacion,
                            CodigoMateriaNueva: asignaturaAprobada.CodigoMateriaNueva || ''
                        });
                    }
                    
                    listadoAsignaturaProcesada.push(asignaturaProcesada);
                }
            }
        }
        
        // Filtrar asignaturas que no necesita aprobar
        return await procesarAsignaturasNoNecesitaAprobar(carrera, datosEstudiante.strCodigo, listadoAsignaturaProcesada, nivelesMalla.data);
        
    } catch (error) {
        console.error(error);
        
        throw error;
    }
}

async function procesarAsignaturasHomologadas(registrosAcademicos) {
    const homologadas = [];
    const noHomologadas = [];
    
    for (const registro of registrosAcademicos) {
        if (registro.Tipo === 2) {
            homologadas.push(registro);
        } else {
            registro.nombretipo = 'OBLIGATORIA';
            registro.nombrearea = '';
            registro.CodigoMateriaNueva = registro.Tipo === 1 ? '' : registro.CodigoMateriaNueva;
            noHomologadas.push(registro);
        }
    }
    
    // Ordenar por código de materia
    const ordenarPorCodigo = (arr) => [...arr].sort((a, b) => 
        (a.CodigoMateriaAnterior || '').localeCompare(b.CodigoMateriaAnterior || '')
    );
    
    return {
        homologadas: ordenarPorCodigo(homologadas),
        noHomologadas: ordenarPorCodigo(noHomologadas)
    };
}

async function procesarAsignaturasAprobadasSinHomologar(asignaturasProcesadas) {
    const asignaturasAprobadas = [];
    const asignaturasProcesadasLista = [];
    
    // Ordenar por fecha
    const noHomologadasOrdenadas = ordenarPorFecha(asignaturasProcesadas.noHomologadas);
    
    for (const asignatura of noHomologadasOrdenadas) {
        const yaProcesada = asignaturasAprobadas.some(a => 
            a.CodigoMateriaAnterior === asignatura.CodigoMateriaAnterior
        );
        
        if (!yaProcesada && ['A', 'E', 'H', 'RC', 'AVC', 'C'].includes(asignatura.Equivalencia)) {
            asignatura.estadoasignatura = 'APROBADA';
            asignaturasAprobadas.push(asignatura);
            asignaturasProcesadasLista.push(asignatura);
        }
    }
    
    return { asignaturasAprobadas, asignaturasProcesadasLista };
}

async function procesarAsignaturaMalla(asignaturaMalla, nivel, homologadas, asignaturasAprobadas, cedula, datosEstudiante, carrera) {
    const asignaturaBase = {
        Cedula: cedula,
        Tipo: 2,
        Apellidos: datosEstudiante.strCodPeriodo,
        Nombres: datosEstudiante.strCodPeriodo,
        Periodo: "",
        FechaMatricula: "",
        Nivel: nivel.strDescripcion,
        codNivel: nivel.strCodNivel,
        CodigoMateriaAnterior: asignaturaMalla.strCodMateria,
        NombreMateriaAnterior: asignaturaMalla.nombreasignatura,
        nombrearea: asignaturaMalla.nombrearea,
        nombretipo: asignaturaMalla.nombretipo,
        CodigoMateriaNueva: '',
    };

    const codMallaTrim = (asignaturaMalla.strCodMateria || '').trim();
    
    // 1. Buscar en homologaciones (directo)
    const homologacion = homologadas.find(h => 
        (h.CodigoMateriaNueva || '').trim() === codMallaTrim
    );
    
    if (homologacion && ['A', 'E', 'H', 'RC', 'AVC', 'C'].includes(homologacion.Equivalencia)) {
        return {
            ...asignaturaBase,
            estadoasignatura: 'APROBADA',
            CodigoMateriaAnterior: homologacion.CodigoMateriaAnterior,
            NombreMateriaAnterior: homologacion.NombreMateriaAnterior,
            nombrehomologacion: homologacion.nombrehomologacion,
            CodigoMateriaNueva: homologacion.CodigoMateriaNueva
        };
    }
    
    // 2. Buscar en asignaturas aprobadas sin homologar (directo)
    const asignaturaAprobada = asignaturasAprobadas.find(a => 
        (a.CodigoMateriaAnterior || '').trim() === codMallaTrim
    );
    
    if (asignaturaAprobada && ['A', 'E', 'H', 'RC', 'AVC', 'C'].includes(asignaturaAprobada.Equivalencia)) {
        return {
            ...asignaturaBase,
            estadoasignatura: 'APROBADA',
            CodigoMateriaAnterior: asignaturaAprobada.CodigoMateriaAnterior,
            NombreMateriaAnterior: asignaturaAprobada.NombreMateriaAnterior,
            nombrehomologacion: asignaturaAprobada.nombrehomologacion,
            CodigoMateriaNueva: ''
        };
    }

    // 3. Buscar homologaciones recursivas sin homologar (múltiples / cadena)
    const asignaturaRecSin = await buscarAsignaturaAprobadaSiHomologacionesRecursivaSinHomologacion(carrera, asignaturaMalla, asignaturasAprobadas);
    if (asignaturaRecSin) {
        return {
            ...asignaturaBase,
            estadoasignatura: 'APROBADA',
            CodigoMateriaAnterior: asignaturaRecSin.asignaturafiltrada.codigos_concatenados,
            NombreMateriaAnterior: asignaturaRecSin.asignaturafiltrada.nombres_concatenados,
            nombrehomologacion: asignaturaRecSin.nombrehomologacion,
            CodigoMateriaNueva: asignaturaMalla.strCodMateria
        };
    }

    // 4. Buscar homologaciones recursivas con homologar (múltiples / cadena)
    const asignaturaRecCon = await buscarAsignaturaAprobadaSiHomologacionesRecursivaHomologacion(carrera, asignaturaMalla, homologadas);
    if (asignaturaRecCon) {
        return {
            ...asignaturaBase,
            estadoasignatura: 'APROBADA',
            CodigoMateriaAnterior: asignaturaRecCon.asignaturafiltrada.codigos_concatenados,
            NombreMateriaAnterior: asignaturaRecCon.asignaturafiltrada.nombres_concatenados,
            nombrehomologacion: asignaturaRecCon.nombrehomologacion,
            CodigoMateriaNueva: asignaturaMalla.strCodMateria
        };
    }

    // 5. Buscar homologación especial
    const asignaturaEsp = buscarAsignaturaAprobadaHomologacionEspecial(asignaturaMalla, homologadas);
    if (asignaturaEsp) {
        return {
            ...asignaturaBase,
            estadoasignatura: 'APROBADA',
            CodigoMateriaAnterior: asignaturaEsp.CodigoMateriaNueva,
            NombreMateriaAnterior: asignaturaEsp.NombreMateriaNueva,
            NombreMateriaActual: asignaturaEsp.NombreMateriaAnterior,
            CodigoMateriaActual: asignaturaEsp.CodigoMateriaAnterior,
            nombrehomologacion: asignaturaEsp.nombrehomologacion,
            CodigoMateriaNueva: asignaturaEsp.CodigoMateriaAnterior
        };
    }
    
    // Por defecto, pendiente
    return {
        ...asignaturaBase,
        estadoasignatura: 'POR APROBAR',
        CodigoMateriaNueva: ''
    };
}

async function buscarAsignaturaAprobadaSiHomologacionesRecursivaSinHomologacion(carrera, asignaturaMalla, asignaturasAprobadas) {
    const asignaturashomologacionesrecursiva = await funcionesmodelomovilidad.ObtenerHomologacionesUnoaUnoRecursiva('SistemaAcademico', carrera, asignaturaMalla.strCodMateria);
    if (asignaturashomologacionesrecursiva && asignaturashomologacionesrecursiva.count > 0) {
        const data = asignaturashomologacionesrecursiva.data;
        for (const item of data) {
            const match = asignaturasAprobadas.find(
                a => (a.CodigoMateriaAnterior || '').trim() === (item.materia_actual || '').trim() ||
                     (a.CodigoMateriaAnterior || '').trim() === (item.materia_anterior || '').trim()
            );
            if (match) {
                return {
                    ...match,
                    asignaturafiltrada: item
                };
            }
        }
    }
    return null;
}

async function buscarAsignaturaAprobadaSiHomologacionesRecursivaHomologacion(carrera, asignaturaMalla, homologadas) {
    const asignaturashomologacionesrecursiva = await funcionesmodelomovilidad.ObtenerHomologacionesUnoaUnoRecursiva('SistemaAcademico', carrera, asignaturaMalla.strCodMateria);
    if (asignaturashomologacionesrecursiva && asignaturashomologacionesrecursiva.count > 0) {
        const data = asignaturashomologacionesrecursiva.data;
        for (const item of data) {
            const match = homologadas.find(
                h => (h.CodigoMateriaAnterior || '').trim() === (item.materia_actual || '').trim() ||
                     (h.CodigoMateriaAnterior || '').trim() === (item.materia_anterior || '').trim()
            );
            if (match) {
                return {
                    ...match,
                    asignaturafiltrada: item
                };
            }
        }
    }
    return null;
}

function buscarAsignaturaAprobadaHomologacionEspecial(asignaturaMalla, homologadas) {
    const match = homologadas.find(
        h => (h.CodigoMateriaAnterior || '').trim() === (asignaturaMalla.strCodMateria || '').trim()
    );
    return match || null;
}

async function procesarAsignaturasNoNecesitaAprobar(carrera, codigoEstudiante, listadoAsignaturaProcesada, nivelesMalla) {
    try {
        const asignaturasNoAprobar = await funcionesmodelomovilidad.ListadoASignaturasqNotieneqAprobar(carrera, codigoEstudiante);
        
        let asignaturasFinales = listadoAsignaturaProcesada;
        if (asignaturasNoAprobar && asignaturasNoAprobar.count > 0) {
            const codigosNoAprobar = new Set(
                asignaturasNoAprobar.data
                    .filter(item => item && item.strCodMat)
                    .map(item => item.strCodMat.toString().trim().toUpperCase())
            );
            
            asignaturasFinales = listadoAsignaturaProcesada.filter(item => {
                if (!item || !item.CodigoMateriaAnterior) return false;
                const codigoNormalizado = item.CodigoMateriaAnterior.toString().trim().toUpperCase();
                
                // Si la materia está en el listado de exclusión pero ya fue APROBADA, se conserva.
                // Si está en el listado de exclusión y está POR APROBAR, se descarta.
                if (codigosNoAprobar.has(codigoNormalizado)) {
                    return item.estadoasignatura === 'APROBADA';
                }
                return true;
            });
        }
        
        // Agrupar por nivel
        return nivelesMalla.map(nivel => ({
            ...nivel,
            listadoasignaturas: asignaturasFinales.filter(a => a.Nivel === nivel.strDescripcion)
        }));
        
    } catch (error) {
        console.error(error);
        
        throw new Error('No se pudo obtener el listado de asignaturas por nivel');
    }
}

async function processStudentPhoto(photoData) {
    if (photoData?.data?.success && photoData.data.Informacion?.blProceso) {
        return `data:image/jpeg;base64,${photoData.data.Informacion.Datos.valor}`;
    }
    return `data:image/png;base64,${await funcionestools.FotoPorDefecto()}`;
}

function processGraduationData(graduationData) {
    if (!graduationData?.data?.success) {
        return {
            proceso: false,
            mensaje: graduationData?.data?.mensaje || "No hay datos de titulación"
        };
    }
    
    const info = graduationData.data.informacion;
    const isOasis = info.tipo === 'OASIS';
    
    return {
        proceso: true,
        nombreproyecto: isOasis ? info.proyecto.nombreproyecto : info.proyecto.Tema,
        formagrado: isOasis ? info.proyecto.formagrado : info.proyecto.Modalidad,
        estado: info.proyecto.estado,
        resolucion: isOasis ? '' : info.proyecto.resolucionaprobacion
    };
}

function agruparAsignaturasPorNivel(asignaturas) {
    const nivelesMap = new Map();
    
    for (const asignatura of asignaturas) {
        if (!nivelesMap.has(asignatura.Nivel)) {
            nivelesMap.set(asignatura.Nivel, {
                strDescripcion: asignatura.Nivel,
                strCodNivel: asignatura.codNivel || '',
                listadoasignaturas: []
            });
        }
        nivelesMap.get(asignatura.Nivel).listadoasignaturas.push(asignatura);
    }
    
    return Array.from(nivelesMap.values());
}

function ordenarPorFecha(listado) {
    return [...listado].sort((a, b) => {
        const fechaA = new Date(a.Fecha || a.fecha_matricula || 0);
        const fechaB = new Date(b.Fecha || b.fecha_matricula || 0);
        return fechaB - fechaA; // Más reciente primero
    });
}


function filtrarItinerarioPorNiveles(niveles) {
  if (!Array.isArray(niveles)) {
    throw new Error('El parámetro debe ser un arreglo de niveles');
  }

  return niveles.map(nivel => {
    // Verificar que el nivel tenga listadoasignaturas
    if (!nivel.listadoasignaturas || !Array.isArray(nivel.listadoasignaturas)) {
      return { ...nivel, listadoasignaturas: [] };
    }

    // Filtrar las asignaturas que NO contengan 'ITINERARIO' en nombretipo
    const asignaturasFiltradas = nivel.listadoasignaturas.filter(asignatura => {
      if (!asignatura.nombretipo) {
        return true; // Conservar asignaturas sin nombretipo
      }
      const nombretipo = asignatura.nombretipo.toUpperCase();
      return !nombretipo.includes('PADRES');
    });

    // Retornar el nivel con las asignaturas filtradas
    return {
      ...nivel,
      listadoasignaturas: asignaturasFiltradas
    };
  });
}

