const axios = require('axios');
const cron = require('node-cron');
const pathimage = require('path');
const nomenclatura = require('../config/nomenclatura');
const modeloprocesoCupo = require('../modelo/procesocupos');
const modeloprocesocarreras = require('../modelo/procesocarrera');
const procesoadministrativo = require('../modelo/procesoadministrativo');
const procesoacademiconotas = require('../rutas/ProcesoNotasAcademico');
const reportescarreras = require('../rutas/reportesCarreras');
const reportesExcelcarreras = require('../procesos/reportesexcelcarreras');
const { iniciarDinamicoPool, iniciarDinamicoTransaccion } = require("./../config/execSQLDinamico.helper");
const { iniciarMasterTransaccion, iniciarMasterPool } = require("./../config/execSQLMaster.helper");
const tools = require('./tools');
const fs = require("fs");
const https = require('https');
const crypto = require("crypto");
const { console } = require('inspector');

const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.DocumentosMatriculasPeriosdos = async function (strBaseCarrera, periodo) {
    try {

        var ListadoDocumentos = [];
        var ListadoEstudiantesProceso = [];
        var datosDocumentos = await modeloprocesocarreras.ObtenerDocumentosMatriculas(strBaseCarrera, periodo);
        var TotalDocumentosPendiente = await modeloprocesocarreras.TotalDocumentoPendientes(strBaseCarrera, periodo);
        var TotalDocumentosFirmados = await modeloprocesocarreras.TotalDocumentoFirmados(strBaseCarrera, periodo);
        if (datosDocumentos.count > 0) {
            for (var info of datosDocumentos.data) {
                //    var DatosMatricula = await procesocarreras.ObtenerDatosMatriculasActas(strBaseCarrera,periodo,info.idbandeja);
                //    info.matricula=DatosMatricula.data[0]
                if (info.estado == 2) {
                    info.estadodescripcion = 'PENDIENTE FIRMAR'

                }
                if (info.estado == 1) {
                    info.estadodescripcion = 'PENDIENTE FIRMAR'
                }
                if (info.estado == 3) {
                    info.estadodescripcion = 'ACTA FIRMADA'
                }
                ListadoDocumentos.push(info)
            }
            var respuesta = {
                TotalPendientes: TotalDocumentosPendiente.count > 0 ? TotalDocumentosPendiente.data[0].total : 0,
                TotalFirmados: TotalDocumentosPendiente.count > 0 ? TotalDocumentosFirmados.data[0].total : 0,
                Listado: ListadoDocumentos,
            }

        }

        return respuesta;

    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}
module.exports.RevisionDocumentosInvenientesCarreras = async function (periodo) {
    try {

        var ListadoDocumentos = [];
        var ListadoEstudiantesProceso = [];
        var ListadoCarreras = await modeloprocesoCupo.ListadoCarreraTodasSinTransaccion('OAS_Master');
        for (var carreras of ListadoCarreras.data) {
            if (carreras.estadoCarrera == 'ABI') {
                var Informacion = await axios.get("https://apisai.espoch.edu.ec/rutaMatricula/getactasnogeneradas/" + carreras.strBaseDatos + '/' + periodo, { httpsAgent: agent });
                if (Informacion.data.success) {
                    if (Informacion.data.listado) {
                        var respuesta = {
                            Carrera: carreras.strNombreCarrera,
                            BaseDatos: carreras.strBaseDatos,
                            Cantidad: Informacion.data.listado.length
                        }
                        ListadoDocumentos.push(respuesta)
                    }
                }
            }
        }
        return ListadoDocumentos;

    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}

module.exports.pdfCarerasDocumentosMatriculas = async function (periodo, cedula) {
    try {

        var ListadoDocumentos = [];
        var ListadoEstudiantesProceso = [];
        var ListadoCarreras = await modeloprocesoCupo.ListadoCarreraTodasSinTransaccion('OAS_Master');
        for (var carreras of ListadoCarreras.data) {

            if (carreras.estadoCarrera == 'ABI' && carreras.strCodTipoCarrera == 'CAR') {
                var TotalDocumentosPendiente = await modeloprocesocarreras.TotalDocumentoPendientes(carreras.strBaseDatos, periodo);
                var TotalDocumentosFirmados = await modeloprocesocarreras.TotalDocumentoFirmados(carreras.strBaseDatos, periodo);
                var Matriuclas = await modeloprocesocarreras.MatriculasCarrerasPeriodo(carreras.strBaseDatos, periodo);
                if (Matriuclas.count > 0) {
                    var respuesta = {
                        Carrera: carreras.strBaseDatos.includes("OAS_Niv") ? "NIVELACION " + carreras.strNombreCarrera : carreras.strNombreCarrera,
                        BaseDatos: carreras.strBaseDatos,
                        CantidadPendientes: TotalDocumentosPendiente.count > 0 ? TotalDocumentosPendiente.data[0].total : 0,
                        CantidadFirmadas: TotalDocumentosFirmados.count > 0 ? TotalDocumentosFirmados.data[0].total : 0
                    }
                    ListadoDocumentos.push(respuesta)
                }
            }
        }

        var base64 = await reportescarreras.PdfListadoDocumentosCarreras(tools.ordenarPorCarrera(ListadoDocumentos), cedula, periodo)
        return base64;

    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}

module.exports.pdfListadoEstudianteTerceraSegundaMatricula = async function (carrera, periodo, cedula, tipo) {
    try {

        var ListadoDocumentos = [];
        var ListadoEstudiantesProceso = [];
        if (tipo == 3) {
            var ListadoDocumentos = await modeloprocesocarreras.ListadoEstudianteTerceraMatriculas(carrera, periodo);
            var base64 = await modeloprocesocarreras.PdfListadoEstudianteMatriculasTerceraySegunda(ListadoDocumentos.data, carrera, cedula, periodo, tipo)
            return base64;
        }
        if (tipo == 2) {
            var ListadoDocumentos = await modeloprocesocarreras.ListadoEstudianteSegundaMatriculas(carrera, periodo);
            var base64 = await modeloprocesocarreras.PdfListadoEstudianteMatriculasTerceraySegunda(ListadoDocumentos.data, carrera, cedula, periodo, tipo)
            return base64;
        }
        if (tipo == 4) {

            var MatriculasCareras = await modeloprocesocarreras.MatriculasCarrerasPeriodoTodas(carrera, periodo);

            if (MatriculasCareras.count > 0) {
                for (var matriculas of MatriculasCareras.data) {
                    var CantidadNumerosMatriculas = await modeloprocesocarreras.TotalNumerosMatriculasPorEstudiantes(carrera, periodo, matriculas.sintCodigo);

                    var resultado = {
                        sintCodigo: matriculas.sintCodigo,
                        strCodPeriodo: matriculas.strCodPeriodo,
                        strCodEstud: matriculas.strCodEstud,
                        strCodNivel: matriculas.strCodNivel,
                        strCodEstado: matriculas.strCodNivel,
                        strApellidos: CantidadNumerosMatriculas.data[0].strApellidos,
                        strCedula: CantidadNumerosMatriculas.data[0].strCedula,
                        strNombres: CantidadNumerosMatriculas.data[0].strNombres,
                        cantidadprimera: CantidadNumerosMatriculas.data[0].MateriasPrimeraMatricula,
                        cantidadsegunda: CantidadNumerosMatriculas.data[0].MateriasSegundaMatricula,
                        cantidadtercera: CantidadNumerosMatriculas.data[0].MateriasTerceraMatricula,
                        cantidadtotal: CantidadNumerosMatriculas.data[0].MateriasTotalMatricula,
                    }
                    ListadoDocumentos.push(resultado)
                }
                var base64 = await reportescarreras.PdfListadoEstudianteMatriculasTerceraySegundaGeneral(tools.ordenarPorApellidos(ListadoDocumentos), carrera, cedula, periodo)
                return base64;
            }


        }





    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}
module.exports.pdfPerdidaAsignaturasEstudiantes = async function (carrera, periodo, cedula) {
    try {

        var ListadoDocumentos = [];
        var ListadoEstudiantesProceso = [];

        var ListadoAsignaturas = await modeloprocesocarreras.AsignaturasDictadosMateriasCarreras(carrera, periodo);
        if (ListadoAsignaturas.count > 0) {
            for (var asignaturas of ListadoAsignaturas.data) {
var Repitencia=0;
                var CantidadMatriculadosAsignatura = await modeloprocesocarreras.AsignaturasMatriculadaPeriodoCantidad(carrera, periodo, asignaturas.strCodMateria);
                var datos = await modeloprocesocarreras.CalculosEstuidantesPorAsignaturas(carrera, periodo, asignaturas.strCodMateria);
                var datosRetiros = await modeloprocesocarreras.RetirosAsignaturasNormalesCarrerasListado(carrera, periodo, asignaturas.strCodMateria);
                if (CantidadMatriculadosAsignatura.data[0].Segunda > 0 || CantidadMatriculadosAsignatura.data[0].Tercera) {
                    Repitencia = Number(CantidadMatriculadosAsignatura.data[0].Segunda) + Number(CantidadMatriculadosAsignatura.data[0].Tercera)
                }
                var resultado = {
                    cantidadprimera: CantidadMatriculadosAsignatura.data[0].Primera == null ? 0 : CantidadMatriculadosAsignatura.data[0].Primera,
                    cantidadsegunda: CantidadMatriculadosAsignatura.data[0].Segunda == null ? 0 : CantidadMatriculadosAsignatura.data[0].Segunda,
                    cantidadtercera: CantidadMatriculadosAsignatura.data[0].Tercera == null ? 0 : CantidadMatriculadosAsignatura.data[0].Tercera,
                    cantidadtotal: CantidadMatriculadosAsignatura.data[0].Tercera == null ? 0 : CantidadMatriculadosAsignatura.data[0].Total,
                    retiros: datosRetiros.count,
                    repitencia: Repitencia,
                    strCodMateria: asignaturas.strCodMateria,
                    strCodMateria: asignaturas.strCodMateria,
                    strCodNivel: asignaturas.strCodNivel,
                    strNombre: asignaturas.strNombre,
                    Aprueban: datos.data[0].Aprueba == null ? 0 : datos.data[0].Aprueba,
                    Reprueban: datos.data[0].Reprueba == null ? 0 : datos.data[0].Reprueba,
                    Total: datos.data[0].Total == null ? 0 : datos.data[0].Total

                }
                ListadoDocumentos.push(resultado)
            }
        }
        var base64 = await reportescarreras.PdfListadoEstudiantesAsignaturaAprueban(ListadoDocumentos, carrera, cedula, periodo)

        return base64

    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}

module.exports.ProcesoListadoPensumCarreras = async function (carrera) {
    try {
        var ListadoDocumentos = [];
        var ListadoPensum = await modeloprocesocarreras.ListadoPensumCarrera(carrera);
        if (ListadoPensum.count > 0) {

            ListadoDocumentos = ListadoPensum.data
        } else {
            ListadoDocumentos = []
        }

        return ListadoDocumentos
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}
module.exports.ProcesoListadoPensumCarreras = async function (carrera) {
    try {
        var ListadoDocumentos = [];
        var ListadoPensum = await modeloprocesocarreras.ListadoPensumCarrera(carrera);
        if (ListadoPensum.count > 0) {

            ListadoDocumentos = ListadoPensum.data
        } else {
            ListadoDocumentos = []
        }

        return ListadoDocumentos
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}
module.exports.ProcesoListadoPeriodosCarreras = async function (carrera) {
    try {
        var ListadoDocumentos = [];
        var ListadoPensum = await modeloprocesocarreras.ListadoPeriodosCarrera(carrera);
        if (ListadoPensum.count > 0) {

            ListadoDocumentos = ListadoPensum.data
        } else {
            ListadoDocumentos = []
        }

        return ListadoDocumentos
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}
module.exports.ProcesoPeriodosVigenteCarreras = async function (carrera) {
    try {
        var ListadoDocumentos = [];
        var ListadoPensum = await modeloprocesocarreras.VigentePeriodosCarrera(carrera);

        return ListadoPensum.data[0]
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}
module.exports.ProcesoListadoPensumMateriasarreras = async function (carrera, pensum) {
    try {
        var ListadoDocumentos = [];
        var ListadoPensum = await modeloprocesocarreras.ListadoMateriasPensumCarrera(carrera, pensum);
        if (ListadoPensum.count > 0) {

            ListadoDocumentos = ListadoPensum.data
        } else {
            ListadoDocumentos = []
        }

        return ListadoDocumentos
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}
module.exports.ProcesoListadoEstuidantesApellidosMaters = async function (apellidos) {
    try {
        var ListadoDocumentos = [];
        var ListadoApellidos = await procesoadministrativo.ObtenerDatosEstudianteApellidos("OAS_Master", apellidos);
        if (ListadoApellidos.count > 0) {

            ListadoDocumentos = ListadoApellidos.data
        } else {
            ListadoDocumentos = []
        }

        return ListadoDocumentos
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}

module.exports.ListadoActasFinCicloNoGenerada = async function (carrera, periodo) {
    try {
        var ListadoDocumentos = [];
        var ListadoActas = await modeloprocesocarreras.ListadoDocenteActasNoGeneradas(carrera, 2, periodo);
        if (ListadoActas.count > 0) {

            ListadoDocumentos = ListadoActas.data
        } else {
            ListadoDocumentos = []
        }

        return ListadoDocumentos
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}

module.exports.ReporteExcelActasNoGenradas = async function (carrera, periodo) {
    try {
        var ListadoDocumentos = [];
        var ListadoActas = await modeloprocesocarreras.ListadoDocenteActasNoGeneradas(carrera, 2, periodo);
        var ListadoActasRecuperacion = await ObtenerListadoActasRecuperacionNoGeneradas(carrera, periodo);
        if (ListadoActas.count > 0) {
            for (var elementos1 of ListadoActas.data) {
                ListadoDocumentos.push(elementos1)
            }
            for (var elementos of ListadoActasRecuperacion) {
                ListadoDocumentos.push(elementos)
            }
            var ReporteActaExcel = await reportescarreras.ExcelListadoActasNoGeneradasCarreras(carrera, periodo, ListadoDocumentos);
            return ReporteActaExcel
        } else {
            ListadoDocumentos = []
        }

        return ListadoDocumentos
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}
module.exports.ProcesoActivacionBotonCreacionPerioodo = async function (carrera, periodo, pensum) {
    try {
        var resultado = await FuncionActivacionBotonCreacionPeriodo(carrera, periodo, pensum);

        return resultado
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}

module.exports.ProcesoListadoMatriculasFirmadasPorNivel = async function (carrera, periodo, nivel) {
    try {
        var resultado = await modeloprocesocarreras.ListadoMatriculasFirmadasPorNivel(carrera, periodo, nivel);

        return resultado.data
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}

module.exports.ProcesoListadoEstuidantesMatriculados = async function (carrera, periodo) {
    try {
        var ListadoDocumentos = [];
        var ListadoDocumentos = await modeloprocesocarreras.MatriculasCarrerasPeriodoAcademicos(carrera, periodo);

        return ListadoDocumentos.data
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}





