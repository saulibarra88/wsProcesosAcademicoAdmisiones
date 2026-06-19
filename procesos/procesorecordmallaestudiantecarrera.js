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
const reportepdfmakecurriculuestudiante = require('../reportesmake/reportemallaestudiantecarrera');
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

module.exports.ProcesoGeneracionCurriculumEstuidanteCarrera = async function (carrera, cedula) {

    try {

        var resultado = await FuncionCurriculumEstudiantilCarrera(carrera, cedula);
        return resultado
    } catch (error) {
        console.error(error);
        
    }
}

async function FuncionCurriculumEstudiantilCarrera(carrera, cedula) {
    try {
        const baseUrl = "https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/";
        const photoUrl = `https://apigestioncupos.espoch.edu.ec/wsservicioscupos/procesosdinardap/ObtenerFotoPersona/`;
        const graduationUrl = `https://apisustentacion.espoch.edu.ec/rutagrado/seguimientoTitulacion/${carrera}/${cedula}`;
        const scholarshipsUrl = `https://swbecas.espoch.edu.ec/rutaBecasUsuario/getGestionSrvBecasFicha/1/${funcionestools.CedulaSinGuion(cedula)}/5/5`;

        // Obtener datos en paralelo con manejo de errores
        const [personaResponse, fotoResponse, titulacionResponse, becasResponse] = await Promise.allSettled([
            axios.get(baseUrl + funcionestools.CedulaSinGuion(cedula), { httpsAgent: agent }),
            axios.get(photoUrl + funcionestools.CedulaSinGuion(cedula), { httpsAgent: agent }),
            axios.get(graduationUrl, { httpsAgent: agent }),
            axios.get(scholarshipsUrl, { httpsAgent: agent })
        ]);

        // Validar respuestas críticas
        if (personaResponse.status === 'rejected' || !personaResponse.value?.data?.listado?.[0]) {
            return { blProceso: false, mensaje: "No se pudo obtener los datos del estudiante" };
        }

        const [datosCarrera, datosEstudianteUltima] = await Promise.all([
            funcionesmodelocupos.ObtenerDatosBase(carrera),
            funcionesmodelomovilidad.ObtenerUltimoPeriodMatriculaEstuidante(carrera, cedula)
        ]);

        // Obtener malla y récord académico
        const [MallaMatriculaUltima, recordAcademicoNivel] = await Promise.all([
            funcionesmodelomovilidad.ObtnerMallaDadoPeriodoCarrera(carrera, datosEstudianteUltima.data[0].strCodPeriodo),
            funcionesmodelomovilidad.ObtnerRecodAcademicoporNivel(carrera, datosEstudianteUltima.data[0].strCodigo, 15)
        ]);

        // Procesar datos complementarios
        const foto = await processStudentPhoto(fotoResponse.status === 'fulfilled' ? fotoResponse.value : null);
        const titulacion = processGraduationData(titulacionResponse.status === 'fulfilled' ? titulacionResponse.value : null);
        const listadoBecas = becasResponse.status === 'fulfilled' && becasResponse.value?.data?.resultado ? becasResponse.value.data.resBecas : [];
        const mallaFiltrada = MallaMatriculaUltima.data.filter(asignatura => asignatura.strCodTipo?.toUpperCase() !== 'PITI');
        // Procesar currículo mostrando la malla con asignaturas aprobadas
        const curriculumProcesado = await procesarCurriculumConMallaCompleta(mallaFiltrada, recordAcademicoNivel, carrera, datosEstudianteUltima.data[0], cedula, titulacion);
        // Generar PDF
        console.log(curriculumProcesado[0].asignaturas[0])
        const pdfBase64 = await reportepdfmakecurriculuestudiante.PdfCurriculumEstuidantilCarrera(cedula, personaResponse.value.data.listado[0], datosCarrera.data[0], curriculumProcesado, foto, titulacion, listadoBecas, datosEstudianteUltima.data[0].strCodigo);

        return pdfBase64;
    } catch (error) {
        console.error(error);
        
        return { blProceso: false, mensaje: `Error: ${error.message}` };
    }
}


async function procesarCurriculumConMallaCompleta(mallaFiltrada, recordAcademicoNivel, carrera, datosEstudiante, cedula, titulacion) {
    try {
        // Filtrar asignaturas aprobadas del récord académico
        const asignaturasAprobadas = obtenerAsignaturasAprobadas(recordAcademicoNivel.data);

        // Verificar si hay homologaciones
        const tieneHomologacion = recordAcademicoNivel.data.some(item => item.Tipo === 2);

        // Para cada nivel de la malla, marcar las asignaturas aprobadas
        const ListadoAsignaturasTodasMallasAprobadasNoParobadas = await procesarAsignaturasNivel(mallaFiltrada, asignaturasAprobadas, cedula, carrera)
        // Filtrar itinerarios si es necesario

        // Procesar asignaturas que no necesita aprobar
        const listadoCompleto = await procesarAsignaturasNoNecesitaAprobarV2(carrera, datosEstudiante.strCodigo, ListadoAsignaturasTodasMallasAprobadasNoParobadas);
        const nivelesMalla = agruparMallaPorNiveles(listadoCompleto);
        return nivelesMalla
    } catch (error) {
        console.error(error);
        
        throw error;
    }
}

/**
 * Agrupa la malla curricular por niveles
 */

function agruparMallaPorNiveles(mallaData) {
    const nivelesMap = new Map();

    for (const asignatura of mallaData) {
        const nivelDescripcion = asignatura.Nivel || 'Nivel Sin Especificar';
        const codigoNivel = asignatura.codNivel || '';

        if (!nivelesMap.has(nivelDescripcion)) {
            nivelesMap.set(nivelDescripcion, {
                Nivel: nivelDescripcion,
                codNivel: codigoNivel,
                orden: parseInt(codigoNivel) || 999,
                totalAsignaturas: 0,
                asignaturasAprobadas: 0,
                asignaturas: []
            });
        }

        const nivel = nivelesMap.get(nivelDescripcion);
        nivel.asignaturas.push(asignatura);
        nivel.totalAsignaturas++;

        if (asignatura.estadoasignatura === 'APROBADA') {
            nivel.asignaturasAprobadas++;
        }
    }

    // Convertir a array y ordenar por nivel
    return Array.from(nivelesMap.values())
        .sort((a, b) => a.orden - b.orden);
}
/**
 * Obtiene todas las asignaturas aprobadas del récord académico
 */
function obtenerAsignaturasAprobadas(recordAcademico) {
    const estadosAprobados = ['A', 'E', 'H', 'RC', 'AVC', 'C'];

    const listadoaprobadosinHomologacion = [];
    const listadoconHomologacion = [];

    for (const asignatura of recordAcademico) {
        // Verificar si está aprobada
        if (!estadosAprobados.includes(asignatura.Equivalencia)) continue;

        const codigoMateria = asignatura.CodigoMateriaAnterior || asignatura.CodigoMateria;

        if (asignatura.Tipo === 1) {
            // Verificar si ya existe en el array
            const yaExiste = listadoaprobadosinHomologacion.some(
                item => (item.CodigoMateriaAnterior || item.CodigoMateria) === codigoMateria
            );
            if (!yaExiste) {
                listadoaprobadosinHomologacion.push(asignatura);
            }
        } else if (asignatura.Tipo === 2) {
            const yaExiste = listadoconHomologacion.some(
                item => (item.CodigoMateriaAnterior || item.CodigoMateria) === codigoMateria
            );
            if (!yaExiste) {
                listadoconHomologacion.push(asignatura);
            }
        }
    }

    return {
        listadoaprobadosinHomologacion,
        listadoconHomologacion,
        tieneHomologaciones: () => listadoconHomologacion.length > 0,
        totalAprobadas: () => listadoaprobadosinHomologacion.length + listadoconHomologacion.length,
        obtenerTodas: () => [...listadoaprobadosinHomologacion, ...listadoconHomologacion]
    };
}

/**
 * Procesa las asignaturas de un nivel, marcando cuáles están aprobadas
 */
async function procesarAsignaturasNivel(asignaturasMalla, asignaturasAprobadasMap, cedula, carrera) {
    const asignaturasProcesadas = [];
    for (const asignaturaMalla of asignaturasMalla) {
        const asignaturaProcesada = {
            Cedula: cedula,
            Tipo: 0,
            Periodo: "",
            FechaMatricula: "",
            Nivel: asignaturaMalla.strDescripcion || asignaturaMalla.strCodNivel,
            codNivel: asignaturaMalla.strCodNivel,
            CodigoMateriaAnterior: '',
            NombreMateriaAnterior: '',
            CodigoMateriaActual: asignaturaMalla.strCodMateria,
            NombreMateriaActual: asignaturaMalla.strNombre,
            estadoasignatura: 'POR APROBAR',
            tipoasignatura: asignaturaMalla.strCodTipo == 'ITI' ? 'INTINERARIO' : 'NORMAL',
            periodoadescripcionprobacion: '',
            periodoacodigoprobacion: '',

        };
        const asignaturaAprobada = buscarAsignaturaAprobadaHomologacion(asignaturaMalla, asignaturasAprobadasMap);
        if (asignaturaAprobada != null) {
            var peridoaprobacion = await funcionestools.extraerCodigoYDescripcion(asignaturaAprobada.Periodo)
            asignaturaProcesada.Tipo = 2
            asignaturaProcesada.estadoasignatura = 'APROBADA';
            asignaturaProcesada.NombreMateriaActual = asignaturaAprobada.NombreMateriaNueva;
            asignaturaProcesada.CodigoMateriaActual = asignaturaAprobada.CodigoMateriaNueva;
            asignaturaProcesada.CodigoMateriaAnterior = asignaturaAprobada.CodigoMateriaAnterior;
            asignaturaProcesada.NombreMateriaAnterior = asignaturaAprobada.NombreMateriaAnterior;
            asignaturaProcesada.periodoadescripcionprobacion = peridoaprobacion.descripcion;
            asignaturaProcesada.periodoacodigoprobacion = peridoaprobacion.codigo;

        } else {
            const asignaturaAprobada2 = buscarAsignaturaAprobadaSinHomologacion(asignaturaMalla, asignaturasAprobadasMap);

            if (asignaturaAprobada2 != null) {
                var peridoaprobacion2 = await funcionestools.extraerCodigoYDescripcion(asignaturaAprobada2.Periodo)
                asignaturaProcesada.Tipo = 1
                asignaturaProcesada.estadoasignatura = 'APROBADA';
                asignaturaProcesada.CodigoMateriaAnterior = '';
                asignaturaProcesada.NombreMateriaAnterior = '';
                asignaturaProcesada.NombreMateriaActual = asignaturaAprobada2.NombreMateriaAnterior;
                asignaturaProcesada.CodigoMateriaActual = asignaturaAprobada2.CodigoMateriaAnterior;
                asignaturaProcesada.periodoadescripcionprobacion = peridoaprobacion2.descripcion;
                asignaturaProcesada.periodoacodigoprobacion = peridoaprobacion2.codigo;
            } else {
                const asignaturaAprobada3 = await buscarAsignaturaAprobadaSiHomologacionesRecursivaSinHomologacion(carrera, asignaturaMalla, asignaturasAprobadasMap);
                if (asignaturaAprobada3 != null) {
                    var peridoaprobacion3 = await funcionestools.extraerCodigoYDescripcion(asignaturaAprobada3.Periodo)

                    asignaturaProcesada.Tipo = 2
                    asignaturaProcesada.estadoasignatura = 'APROBADA';
                    asignaturaProcesada.CodigoMateriaAnterior = asignaturaAprobada3.asignaturafiltrada.codigos_concatenados;
                    asignaturaProcesada.NombreMateriaAnterior = asignaturaAprobada3.asignaturafiltrada.nombres_concatenados;
                    asignaturaProcesada.NombreMateriaActual = asignaturaMalla.strNombre;
                    asignaturaProcesada.CodigoMateriaActual = asignaturaMalla.strCodMateria;
                    asignaturaProcesada.periodoadescripcionprobacion = peridoaprobacion3.descripcion;
                    asignaturaProcesada.periodoacodigoprobacion = peridoaprobacion3.codigo;
                } else {
                    const asignaturaAprobada4 = await buscarAsignaturaAprobadaSiHomologacionesRecursivaHomologacion(carrera, asignaturaMalla, asignaturasAprobadasMap);
                    if (asignaturaAprobada4 != null) {
                        var peridoaprobacion4 = await funcionestools.extraerCodigoYDescripcion(asignaturaAprobada4.Periodo)

                        asignaturaProcesada.Tipo = 2
                        asignaturaProcesada.estadoasignatura = 'APROBADA';
                        asignaturaProcesada.CodigoMateriaAnterior = asignaturaAprobada4.asignaturafiltrada.codigos_concatenados;
                        asignaturaProcesada.NombreMateriaAnterior = asignaturaAprobada4.asignaturafiltrada.nombres_concatenados;
                        asignaturaProcesada.NombreMateriaActual = asignaturaMalla.strNombre;
                        asignaturaProcesada.CodigoMateriaActual = asignaturaMalla.strCodMateria;
                        asignaturaProcesada.periodoadescripcionprobacion = peridoaprobacion4.descripcion;
                        asignaturaProcesada.periodoacodigoprobacion = peridoaprobacion4.codigo;
                    } else {
                        const asignaturaAprobada5 = await buscarAsignaturaAprobadaHomologacionEspecial(asignaturaMalla, asignaturasAprobadasMap);
                        if (asignaturaAprobada5 != null) {
                            var peridoaprobacion5 = await funcionestools.extraerCodigoYDescripcion(asignaturaAprobada5.Periodo)

                            asignaturaProcesada.Tipo = 2
                            asignaturaProcesada.estadoasignatura = 'APROBADA';
                            asignaturaProcesada.CodigoMateriaAnterior = asignaturaAprobada5.CodigoMateriaNueva;
                            asignaturaProcesada.NombreMateriaAnterior = asignaturaAprobada5.NombreMateriaNueva;
                            asignaturaProcesada.NombreMateriaActual = asignaturaAprobada5.NombreMateriaAnterior;
                            asignaturaProcesada.CodigoMateriaActual = asignaturaAprobada5.CodigoMateriaAnterior;
                            asignaturaProcesada.periodoadescripcionprobacion = peridoaprobacion5.descripcion;
                            asignaturaProcesada.periodoacodigoprobacion = peridoaprobacion5.codigo;
                        }
                    }
                }
            }
        }

        asignaturasProcesadas.push(asignaturaProcesada);

    }
    return asignaturasProcesadas;
}

/**
 * Busca si una asignatura de la malla está aprobada en el récord académico
 */
function buscarAsignaturaAprobada(asignaturaMalla, asignaturasAprobadasMap, recordAcademico, tieneHomologacion) {
    const codigoMateria = asignaturaMalla.strCodMateria;

    // Buscar directamente por código
    if (asignaturasAprobadasMap.has(codigoMateria)) {
        return asignaturasAprobadasMap.get(codigoMateria);
    }

    // Si tiene homologaciones, buscar por código nuevo
    if (tieneHomologacion) {
        const homologacion = recordAcademico.find(r =>
            r.Tipo === 2 && r.CodigoMateriaNueva === codigoMateria
        );

        if (homologacion && asignaturasAprobadasMap.has(homologacion.CodigoMateriaAnterior)) {
            return homologacion;
        }
    }

    // Buscar por coincidencia de nombre (como fallback)
    for (const [_, asignaturaAprobada] of asignaturasAprobadasMap) {
        if (asignaturaAprobada.NombreMateriaAnterior === asignaturaMalla.nombreasignatura) {
            return asignaturaAprobada;
        }
    }

    return null;
}
function buscarAsignaturaAprobadaHomologacion(asignaturaMalla, asignaturasAprobadasMap) {
    // Buscar por coincidencia de codigo (como fallback)
    const asignaturaEncontrada = asignaturasAprobadasMap.listadoconHomologacion.find(
        asignatura => asignatura.CodigoMateriaNueva === asignaturaMalla.strCodMateria
    );

    return asignaturaEncontrada ? asignaturaEncontrada : null;
}
function buscarAsignaturaAprobadaSinHomologacion(asignaturaMalla, asignaturasAprobadasMap) {
    // Buscar por coincidencia de nombre (como fallback)
    const asignaturaEncontrada = asignaturasAprobadasMap.listadoaprobadosinHomologacion.find(
        asignatura => asignatura.CodigoMateriaAnterior === asignaturaMalla.strCodMateria
    );
    return asignaturaEncontrada ? asignaturaEncontrada : null;
}
async function buscarAsignaturaAprobadaSiHomologacionesRecursivaSinHomologacion(carrera, asignaturaMalla, asignaturasAprobadasMap) {
    // Buscar por coincidencia de nombre (como fallback)
    var asignaturashomologacionesrecursiva = await funcionesmodelomovilidad.ObtenerHomologacionesUnoaUnoRecursiva('SistemaAcademico', carrera, asignaturaMalla.strCodMateria);
    if (asignaturashomologacionesrecursiva.count > 0) {
        const asignaturashomologacionesrecursivaFiltrada = asignaturashomologacionesrecursiva.data;
        // const asignaturashomologacionesrecursivaFiltrada = asignaturashomologacionesrecursiva.data.filter( asignatura => asignatura.nivel > 0 );
        for (const asignaturaFiltrada of asignaturashomologacionesrecursivaFiltrada) {
            for (const asignaturaFiltrada of asignaturashomologacionesrecursivaFiltrada) {
                const asignaturaEncontrada = asignaturasAprobadasMap.listadoaprobadosinHomologacion.find(
                    asignatura => asignatura.CodigoMateriaAnterior === asignaturaFiltrada.materia_actual ||
                        asignatura.CodigoMateriaAnterior === asignaturaFiltrada.materia_anterior
                );

                if (asignaturaEncontrada) {
                    return {
                        ...asignaturaEncontrada,
                        asignaturafiltrada: asignaturaFiltrada
                    }; // Termina y retorna la primera coincidencia
                }
            }

            return null; // No se encontró ninguna coincidencia

        }


    }
}
async function buscarAsignaturaAprobadaSiHomologacionesRecursivaHomologacion(carrera, asignaturaMalla, asignaturasAprobadasMap) {
    // Buscar por coincidencia de nombre (como fallback)
    var asignaturashomologacionesrecursiva = await funcionesmodelomovilidad.ObtenerHomologacionesUnoaUnoRecursiva('SistemaAcademico', carrera, asignaturaMalla.strCodMateria);
    if (asignaturashomologacionesrecursiva.count > 0) {
        const asignaturashomologacionesrecursivaFiltrada = asignaturashomologacionesrecursiva.data;
        // const asignaturashomologacionesrecursivaFiltrada = asignaturashomologacionesrecursiva.data.filter( asignatura => asignatura.nivel > 0 );
        for (const asignaturaFiltrada of asignaturashomologacionesrecursivaFiltrada) {
            for (const asignaturaFiltrada of asignaturashomologacionesrecursivaFiltrada) {
                const asignaturaEncontrada = asignaturasAprobadasMap.listadoconHomologacion.find(
                    asignatura => asignatura.CodigoMateriaAnterior === asignaturaFiltrada.materia_actual ||
                        asignatura.CodigoMateriaAnterior === asignaturaFiltrada.materia_anterior
                );

                if (asignaturaEncontrada) {
                    return {
                        ...asignaturaEncontrada,
                        asignaturafiltrada: asignaturaFiltrada
                    }; // Termina y retorna la primera coincidencia
                }
            }

            return null; // No se encontró ninguna coincidencia

        }


    }
}

function buscarAsignaturaAprobadaHomologacionEspecial(asignaturaMalla, asignaturasAprobadasMap) {
    // Buscar por coincidencia de codigo (como fallback)
    const asignaturaEncontrada = asignaturasAprobadasMap.listadoconHomologacion.find(
        asignatura => asignatura.CodigoMateriaAnterior === asignaturaMalla.strCodMateria
    );

    return asignaturaEncontrada ? asignaturaEncontrada : null;
}
/**
 * Versión actualizada para procesar asignaturas que no necesita aprobar
 */
async function procesarAsignaturasNoNecesitaAprobarV2(carrera, codigoEstudiante, ListadoAsignaturasTodasMallasAprobadasNoParobadas) {
    try {
        const asignaturasNoAprobar = await funcionesmodelomovilidad.ListadoASignaturasqNotieneqAprobar(carrera, codigoEstudiante);

        // Si no hay asignaturas que no necesita aprobar, retornar el listado original
        if (asignaturasNoAprobar.count === 0) {
            return ListadoAsignaturasTodasMallasAprobadasNoParobadas;
        }

        // Convertir asignaturasNoAprobar a un Set para búsqueda eficiente
        const codigosAsignaturasNoAprobar = new Set(
            asignaturasNoAprobar.data.map(asignatura => asignatura.strCodMat)
        );

        // Recorrer el listado principal y marcar las coincidencias
        const listadoActualizado = ListadoAsignaturasTodasMallasAprobadasNoParobadas.map(asignatura => {
            // Verificar si el código de la asignatura está en el listado de no aprobar
            if (codigosAsignaturasNoAprobar.has(asignatura.strCodMat)) {
                listadoActualizado[index] = {
                    ...listadoActualizado[index],
                    estadoasignatura: 'APROBADA'
                };
            }
            return asignatura;
        });

        return listadoActualizado;

    } catch (error) {
        console.error(error);
        
        // Retornar el listado original en caso de error
        return ListadoAsignaturasTodasMallasAprobadasNoParobadas;
    }
}

/**
 * Función auxiliar para filtrar itinerarios por niveles
 */
function filtrarItinerarioPorNiveles(niveles) {
    if (!Array.isArray(niveles)) {
        throw new Error('El parámetro debe ser un arreglo de niveles');
    }

    return niveles.map(nivel => {
        if (!nivel.listadoasignaturas || !Array.isArray(nivel.listadoasignaturas)) {
            return { ...nivel, listadoasignaturas: [] };
        }

        // Filtrar asignaturas que contengan 'PADRES' en nombretipo
        const asignaturasFiltradas = nivel.listadoasignaturas.filter(asignatura => {
            if (!asignatura.nombretipo) return true;
            const nombretipo = asignatura.nombretipo.toUpperCase();
            return !nombretipo.includes('PADRES');
        });

        return {
            ...nivel,
            listadoasignaturas: asignaturasFiltradas
        };
    });
}

// Funciones auxiliares existentes (se mantienen igual)
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