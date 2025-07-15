
const express = require('express');
const router = express.Router();
const Request = require("request");
const fs = require("fs");
const pdf = require('html-pdf');
const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");
const funcionesmodelomovilidad = require('../modelo/modelomovilidad');
const funcionestools = require('../rutas/tools');
const funcionesmodelocarrera = require('../modelo/procesocarrera');
const funcionesmodelocupos = require('../modelo/procesocupos');
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

module.exports.ProcesoCarrerasDadoFacultadHomologacion = async function (PeriodoDatos, codfacultad) {
    try {
        var resultado = await funcionesmodelomovilidad.CarrerasDadoFacultadHomologacion('OAS_Master', PeriodoDatos, codfacultad);
        return resultado
    } catch (error) {
        console.log(error);
    }
}

module.exports.ProcesoDatosEstudianteCambioCarrera = async function (carrera, codestudiante, nivel) {
    try {
        var resultado = await FuncionDatosEstudianteCambioCarrera(carrera, codestudiante, nivel);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoDatosConfiguracionesAprobacionSolicitudesCarreras = async function (carreramovilidad, periodo, puntaje) {
    try {
        var resultado = await FuncionDatosConfiguracionesAprobacionSolicitudesCarreras(carreramovilidad, periodo, puntaje);
        return resultado
    } catch (error) {
        console.log(error);
    }
}

module.exports.ProcesoIngresarSolicitudEstuidanteMovilidad = async function (solicitud, listadoDocumentos) {
    try {
        var resultado = await FuncionInsertarSolicitudMovilidadEstudiante(solicitud, listadoDocumentos);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoObtnerFormatoTextoCodigo = async function (codigo) {
    try {
        var resultado = await funcionesmodelomovilidad.ObtnerFormatoTextoDadoCodigo('OAS_Master', codigo);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoListadoTipoInscripcion = async function (codigo) {
    try {
        var resultado = await funcionesmodelomovilidad.ListadoTipoInscripcion('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoTotalesCantidadesSolicitud = async function () {
    try {
        var resultado = await funcionesmodelomovilidad.TotalesCantidadesSolicitud('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoObtnerDocumentoTipo = async function (idSolicitud, tipo) {
    try {
        var resultado = await funcionesmodelomovilidad.ObtnerDocumentosDadoIdSolicitudTipo('OAS_Master', idSolicitud, tipo);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoActualizarEstadoSolicitud = async function (idsolicitud, estado, observacion, perautorizacion) {
    try {
        var resultado = await funcionesmodelomovilidad.ActualziarEstadoSolitiud('OAS_Master', idsolicitud, estado, observacion, perautorizacion);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoListadoSolicitudesMovilidadPorEstado = async function (estado, periodo) {
    try {
        var resultado = await FuncionListadoSolicitudesMovilidadPorEstado(estado, periodo);
        return resultado
    } catch (error) {
        console.log(error);
    }
}

module.exports.ProcesoDatosHomologacionCarreraEstudiante = async function (carrera, cedula, periodo) {
    try {
        var resultado = await FuncionDatosHomologacionCarreraEstudiante(carrera, cedula, periodo);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoObtenerSolicitudesEstudiantes = async function (carrera, cedula, periodo) {
    try {
        var resultado = await FuncionObtenerSolicitudesEstudiantes(carrera, cedula, periodo);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesInsertarSolicitudAprobadaInscripcion = async function (carrera, cedula, periodo) {
    try {
        var resultado = await FuncionObtenerSolicitudesEstudiantes(carrera, cedula, periodo);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesInsertarSolicitudAprobadaInscripcionMovilidadInterna = async function (idsolicitud, idpersona, idCupoAdmision, strRutadocumento, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30) {
    try {
        var resultado = await FuncionInsertarSolicitudAprobadaInscripcionMovilidadInterna(idsolicitud, idpersona, idCupoAdmision, strRutadocumento, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30);
        return resultado
    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
    }
}
module.exports.ProcesInsertarSolicitudAprobadaInscripcionMovilidadExterna = async function (solicitud, idpersona, idCupoAdmision, strRutadocumento, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30, strFoto) {
    try {
        var resultado = await FuncionInsertarSolicitudAprobadaInscripcionMovilidadExterna(solicitud, idpersona, idCupoAdmision, strRutadocumento, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30, strFoto);
        return resultado
    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
    }
}
module.exports.ProcesInsertarCarrerasCuposConfiguraciones = async function (periodo, idUsuario) {
    try {
        var resultado = await FuncionInsertarCuposMigracionPeriodoActual(periodo, idUsuario);
        return resultado
    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
    }
}
module.exports.ProcesListadoCarrerasCuposConfiguraciones = async function (periodo) {
    try {
        var resultado = await FuncionListadoConfiguracionesCarreras(periodo);
        return resultado
    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
    }
}
module.exports.ProcesoActualizarCarreraConfiguracion = async function (objConfiguracion) {
    try {
        var resultado = await funcionesmodelomovilidad.ActulizarCupoCarreraConfiguraciones('SistemaAcademico', objConfiguracion);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoListadoPaises = async function () {
    try {
        var resultado = await funcionesmodelomovilidad.ListadoPaisesMaster('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoListadoProvincias = async function (codPais) {
    try {
        var resultado = await funcionesmodelomovilidad.ListadoProvinciaMaster('OAS_Master', codPais);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoListadoCiudad = async function (codProvincia) {
    try {
        var resultado = await funcionesmodelomovilidad.ListadoCiudadMaster('OAS_Master', codProvincia);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoListadoInstituciones = async function (codciudad) {
    try {
        var resultado = await funcionesmodelomovilidad.ListadoInstitucionesMaster('OAS_Master', codciudad);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoListadoEstadoVida = async function () {
    try {
        var resultado = await funcionesmodelomovilidad.ListadoEstadoVida('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
    }
}

module.exports.ProcesodatosEstudianteMaster = async function (cedula) {
    try {
        var resultado = await funcionesmodelomovilidad.ObtnerEstuidanteMaster('OAS_Master', funcionestools.CedulaConGuion(cedula));
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoListadoTitulosColegios = async function (codigoInstitucion) {
    try {
        var resultado = await funcionesmodelomovilidad.TitulosColegios('OAS_Master', codigoInstitucion);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoListadoGradoEstuidanteTodas = async function (cedula) {
    try {
        var resultado = await funcionesmodelomovilidad.ObtenerGradoEstudianteTodas('OAS_Master', cedula);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoEliminarGradoEstuidante = async function (cedula, codtitulo, codInstitucion) {
    try {
        var resultado = await funcionesmodelomovilidad.EliminarGradoEstudanteMaster('OAS_Master', cedula, codtitulo, codInstitucion);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoActulizarGradoEstuidante = async function (objEstudiante) {

    try {
        var resultado = await funcionesmodelomovilidad.ActualizarGradoEstudanteMaster('OAS_Master', objEstudiante);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoDatosEstuidanteCarrera = async function (dbcarrera, cedula) {

    try {
        var resultado = await funcionesmodelocarrera.ObtenerDatosEstudianteCarrera(dbcarrera, funcionestools.CedulaConGuion(cedula));
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoInsertarEstudianteMaster = async function (objEstudiante) {
    try {
        var resultado = await FuncionInsertarEstuidanteMaster(objEstudiante);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoInsertarGradoEstudianteMaster = async function (objGrado) {
    try {
        var resultado = await FuncionInsertarGradoEstuidanteMaster(objGrado);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoEliminacionInscripcionMovExterna = async function (dbCarrera, cedula, periodo) {
    try {
        var resultado = await FuncionEliminacionInscripcionMovilidadExterna(dbCarrera, cedula, periodo);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoActulizarInscripcionesEstuidante = async function (objEstudiante) {

    try {
        var resultado = await funcionesmodelomovilidad.ActualizarInscripcionesEstudiante('OAS_Master', objEstudiante);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoGenerarExcelSolicitudes = async function (periodo, estado) {

    try {
        var resultado = await FuncionReporteExcelSolicitudes(periodo, estado);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoGenerarPdfSolicitudesAprbadas = async function (periodo) {

    try {
        var resultado = await FuncionReportePdfSolicitudes(periodo);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ProcesoGeneracionCurriculumEstuidante = async function (carrera, cedula, periodo) {

    try {
        var resultado = await FuncionCurriculumEstudiantil(carrera, cedula, periodo);

        return resultado
    } catch (error) {
        console.log(error);
    }
}

async function FuncionDatosEstudianteCambioCarrera(carrera, codestudiante, nivel) {
    try {
        var respuesta = {};
        var AsignaturaHomologadas = [];
        var RecordAcademicoNivel = await funcionesmodelomovilidad.ObtnerRecodAcademicoporNivel(carrera, codestudiante, nivel);
        var banderahomologacion = false
        for (var datosrecord of RecordAcademicoNivel.data) {
            if (datosrecord.Tipo == 2) {
                banderahomologacion = true
            } else {
                AsignaturaHomologadas.push(datosrecord)
            }
        }
        if (banderahomologacion) { //Datos con Homologacion
            console.log('Datos con homologacion')
            var noaprobadas = 0
            var aprobadas = 0
            var datosProcesados = await funcionestools.obtenerUltimosIntentosPorMateria(AsignaturaHomologadas)
            console.log("datosProcesados Homologacion Record ")
            console.log(datosProcesados)
            for (var asig of datosProcesados) {
                if (asig.Equivalencia == 'R' || asig.Equivalencia == 'RVC') {
                    noaprobadas = noaprobadas + 1
                } else {
                    aprobadas = aprobadas + 1
                }
            }
            if (aprobadas == datosProcesados.length) {
                respuesta.aprobacionnivel = true;
            } else {
                respuesta.aprobacionnivel = false;
            }
            respuesta.nivel = nivel;
            respuesta.codestudiante = codestudiante;
            respuesta.pensummaterias = datosProcesados.length;
            respuesta.aprobadas = aprobadas;
            respuesta.noaprobadas = noaprobadas;

        } else {//'Datos SIN homologacion'
            var AprobacionNivel = await funcionesmodelomovilidad.ObtenerMateriasAprobadasPorNivelPensum(carrera, codestudiante, nivel);
            if (AprobacionNivel.count > 0) {
                respuesta.nivel = nivel;
                respuesta.codestudiante = codestudiante;
                respuesta.pensummaterias = AprobacionNivel.data[0].materiaspensum;
                respuesta.aprobadas = AprobacionNivel.data[0].aprobadas;
                respuesta.noaprobadas = AprobacionNivel.data[0].no_aprobadas;
                if (AprobacionNivel.data[0].materiaspensum == AprobacionNivel.data[0].aprobadas) {
                    respuesta.aprobacionnivel = true;
                } else {
                    respuesta.aprobacionnivel = false;
                }
            }
        }

        var PerdidaSegundaMatricula = await funcionesmodelomovilidad.ObtenerMateriasPerdidasSegundaMatriculaCantidad(carrera, codestudiante);

        if (PerdidaSegundaMatricula.count > 0) {
            if (PerdidaSegundaMatricula.data[0].materiasegundamat == PerdidaSegundaMatricula.data[0].aprobadas) {
                respuesta.perdidasegunda = false;
            } else {
                respuesta.perdidasegunda = true;
                var PerdidaSegundaMatriculaDetalle = await funcionesmodelomovilidad.ObtenerMateriasPerdidasSegundaMatriculaDetalle(carrera, codestudiante);
                respuesta.detallePerdida = PerdidaSegundaMatriculaDetalle.data
            }
        }
        console.log("respuesta")
        console.log(respuesta)
        return respuesta;

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

async function FuncionDatosConfiguracionesAprobacionSolicitudesCarreras(carreramovilidad, periodo, puntaje) {
    try {
        var respuesta = {};
        var DatosConfiguraciones = await funcionesmodelomovilidad.ObtenerConfifuracionCupoMovilidadCarreraPeriodo("SistemaAcademico", carreramovilidad, periodo);
        var DatosSolicitudesAprobadasInterna = await funcionesmodelomovilidad.ObtenerSolicitudAprobadasCarrerasMovilidad("OAS_Master", carreramovilidad, periodo, 'MOVIN');
        var DatosSolicitudesAprobadasExterna = await funcionesmodelomovilidad.ObtenerSolicitudAprobadasCarrerasMovilidad("OAS_Master", carreramovilidad, periodo, 'MOVEX');
        var DatosSolicitudesAprobadasTraspaso = await funcionesmodelomovilidad.ObtenerSolicitudAprobadasCarrerasMovilidad("OAS_Master", carreramovilidad, periodo, 'MOVTP');
        if (DatosConfiguraciones.count > 0) {
            respuesta.configuracionesCupos = DatosConfiguraciones.data[0];
            if (await funcionestools.estaVigenteFechaMovilidad(DatosConfiguraciones.data[0].mc_fecha_inicio, DatosConfiguraciones.data[0].mc_fecha_fin)) {
                respuesta.fechavigente = true;
                if (DatosConfiguraciones.data[0].mc_puntaje_minimo_carrera == 0) {
                    respuesta.permitirsolicitudmoviInterna = false;
                    respuesta.permitirsolicitudmoviExterna = false;
                    respuesta.permitirsolicitudmoviTraspaso = false;
                    respuesta.mensaje = 'Control de puntaje , no tiene puntaje la crrera';
                } else {
                    if (DatosConfiguraciones.data[0].mc_cupos_movi_interna == 0) {
                        respuesta.permitirsolicitudmoviInterna = false;
                    } else {
                        if (DatosSolicitudesAprobadasInterna.count <= DatosConfiguraciones.data[0].mc_cupos_movi_interna && Number(puntaje) >= DatosConfiguraciones.data[0].mc_puntaje_minimo_carrera) {
                            respuesta.permitirsolicitudmoviInterna = true;
                        } else {
                            respuesta.permitirsolicitudmoviInterna = false;
                        }
                    }
                    if (DatosConfiguraciones.data[0].mc_cupos_movi_externa == 0) {
                        respuesta.permitirsolicitudmoviExterna = false;
                    } else {
                        if (DatosSolicitudesAprobadasExterna.count <= DatosConfiguraciones.data[0].mc_cupos_movi_externa && Number(puntaje) >= DatosConfiguraciones.data[0].mc_puntaje_minimo_carrera) {
                            respuesta.permitirsolicitudmoviExterna = true;
                        } else {
                            respuesta.permitirsolicitudmoviExterna = false;
                        }
                    }
                    if (DatosConfiguraciones.data[0].mc_cupos_movi_externa == 0) {
                        respuesta.permitirsolicitudmoviTraspaso = false;
                    } else {
                        if (DatosSolicitudesAprobadasTraspaso.count <= DatosConfiguraciones.data[0].mc_cupos_movi_traspaso && Number(puntaje) >= DatosConfiguraciones.data[0].mc_puntaje_minimo_carrera) {
                            respuesta.permitirsolicitudmoviTraspaso = true;
                        } else {
                            respuesta.permitirsolicitudmoviTraspaso = false;
                        }
                    }
                    respuesta.mensaje = 'Controles varios';
                }
            } else {
                respuesta.fechavigente = false;
                respuesta.permitirsolicitudmoviInterna = false;
                respuesta.permitirsolicitudmoviExterna = false;
                respuesta.permitirsolicitudmoviTraspaso = false;
                respuesta.mensaje = 'Control de fecha , fechas no permitidas';
            }
        } else {
            respuesta.configuracionesCupos = null;
        }
        respuesta.SolicitudesAprobadasInterna = DatosSolicitudesAprobadasInterna.count;
        respuesta.SolicitudesAprobadasExterna = DatosSolicitudesAprobadasExterna.count;
        respuesta.SolicitudesAprobadasTraspaso = DatosSolicitudesAprobadasTraspaso.count;
        return respuesta;

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

async function FuncionInsertarSolicitudMovilidadEstudiante(solicitud, listadoDocumentos) {
    try {
        var respuesta = {};
        var Ingresosolicitud = await funcionesmodelomovilidad.InsertarSolicitudEstudiante("OAS_Master", solicitud);
        console.log(Ingresosolicitud)
        if (Ingresosolicitud.count > 0) {
            for (var documento of listadoDocumentos) {
                documento.msd_idsolicitud = Ingresosolicitud.data[0].cm_id
                var IngresoDocumento = await funcionesmodelomovilidad.InsertarDocumentosMovilidad("OAS_Master", documento);
            }

        }
        return respuesta;

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

async function FuncionListadoSolicitudesMovilidadPorEstado(estado, periodo) {
    try {
        var respuesta = {};
        var listado = [];
        var listadoDocumentos = await funcionesmodelomovilidad.ListadoSolicitudesMovilidadPorEstado('OAS_Master', estado, periodo);
        if (listadoDocumentos.count > 0) {
            for (var solicitudes of listadoDocumentos.data) {
                var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/" + solicitudes.cm_identificacion, { httpsAgent: agent });
                solicitudes.nombreestudiante =
                    solicitudes.nombreestudiante = ObtenerPersona.data.listado[0].per_nombres
                solicitudes.correoestudiante = ObtenerPersona.data.listado[0].per_email
                solicitudes.celularstudiante = ObtenerPersona.data.listado[0].per_telefonoCelular
                solicitudes.apellidoestudiante = ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
                listado.push()
            }

        }
        return listadoDocumentos;

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

async function FuncionDatosHomologacionCarreraEstudiante(carrera, cedula, periodo) {
    try {
        var respuesta = {};
        var DatosHomologacion = await funcionesmodelomovilidad.ObenterHomologacionCarrera('OAS_Master', carrera, periodo);
        if (DatosHomologacion.count > 0) {
            var DatoEstudianteCarrea = await funcionesmodelocarrera.ObtenerDatosEstudianteCarrera(DatosHomologacion.data[0].hmbdbasecar, cedula);
            var DatoEstudianteNivelacion = await funcionesmodelocarrera.ObtenerDatosEstudianteCarrera(DatosHomologacion.data[0].hmbdbaseniv, cedula);
            var DatoCarreraNivelacion = await funcionesmodelomovilidad.ObenterDatosCarrera('OAS_Master', DatosHomologacion.data[0].hmbdbaseniv);
            var DatoCarrera = await funcionesmodelomovilidad.ObenterDatosCarrera('OAS_Master', DatosHomologacion.data[0].hmbdbasecar);
            respuesta.dbCarrera = DatosHomologacion.data[0].hmbdbasecar
            respuesta.NombreCarrera = DatoCarrera.data[0].strNombre
            respuesta.CodigoCarrera = DatoCarrera.data[0].strCodigo
            if (DatoEstudianteCarrea.count > 0) {
                respuesta.CodigoEstudianteCarrera = DatoEstudianteCarrea.data[0].strCodigo
                respuesta.NombresEstudiantCarrera = DatoEstudianteCarrea.data[0].strApellidos + ' ' + DatoEstudianteCarrea.data[0].strNombres
            } else {
                respuesta.CodigoEstudianteCarrera = 0
                respuesta.NombresEstudiantCarrera = ''
            }

            if (DatoEstudianteNivelacion.count > 0) {
                respuesta.dbNivelacion = DatosHomologacion.data[0].hmbdbaseniv
                respuesta.NombreNivelaciom = DatoCarreraNivelacion.data[0].strNombre
                respuesta.CodigoNivelacion = DatoCarreraNivelacion.data[0].strCodigo
                respuesta.CodigoEstudianteNivelacion = DatoEstudianteNivelacion.data[0].strCodigo
                respuesta.NombresEstudiantNivelacion = DatoEstudianteNivelacion.data[0].strApellidos + ' ' + DatoEstudianteNivelacion.data[0].strNombres
            } else {
                respuesta.dbNivelacion = DatosHomologacion.data[0].hmbdbaseniv
                respuesta.NombreNivelaciom = DatoCarreraNivelacion.data[0].strNombre
                respuesta.CodigoNivelacion = DatoCarreraNivelacion.data[0].strCodigo
                respuesta.CodigoEstudianteNivelacion = 0
                respuesta.NombresEstudiantNivelacion = '';
            }
        }

        return respuesta;

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}
async function FuncionObtenerSolicitudesEstudiantes(carrera, cedula, periodo) {
    try {
        var respuesta = {};
        var impedimentogeneracionsol = false;
        var actulizarsolgenerada = false;
        var DatosSolicitudesUltima = await funcionesmodelomovilidad.ObtenerSolictudesEstuidantePeriodosUltima('OAS_Master', carrera, cedula, periodo);
        var DatosSolicitudes = await funcionesmodelomovilidad.ObtenerSolictudesEstuidantePeriodos('OAS_Master', carrera, cedula, periodo);
        if (DatosSolicitudesUltima.count > 0) {

            if (DatosSolicitudesUltima.data[0].cm_idtipo_estado == 'GEN' || DatosSolicitudesUltima.data[0].cm_idtipo_estado == 'DEV' || DatosSolicitudesUltima.data[0].cm_idtipo_estado == 'APRO') {
                impedimentogeneracionsol = true;
            }
            if (DatosSolicitudesUltima.data[0].cm_idtipo_estado == 'DEV') {
                actulizarsolgenerada = true;
            }
            respuesta.utilmasolicitud = DatosSolicitudesUltima.data[0]
            respuesta.impedimentogeneracionsol = impedimentogeneracionsol
            respuesta.actulizarsolgenerada = actulizarsolgenerada
            respuesta.listadosolicitudes = DatosSolicitudes.data
        } else {
            respuesta.utilmasolicitud = null
            respuesta.impedimentogeneracionsol = false
            respuesta.actulizarsolgenerada = false
            respuesta.listadosolicitudes = []
        }

        return respuesta;

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

async function FuncionInsertarSolicitudAprobadaInscripcionMovilidadInterna(idsolicitud, idpersona, idCupoAdmision, strRutadocumento, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30) {
    try {
        var respuesta = {};
        var DatosSolicitud = await funcionesmodelomovilidad.ObtenerSolictudDadoId('OAS_Master', idsolicitud);

        if (DatosSolicitud.count > 0) {
            var DatosCarreraActual = await funcionesmodelomovilidad.ObenterDatosCarrera('OAS_Master', DatosSolicitud.data[0].cm_dbcarrera_actual);
            var DatosCarreraMovilidad = await funcionesmodelomovilidad.ObenterDatosCarrera('OAS_Master', DatosSolicitud.data[0].cm_dbcarrera_movilidad);

            var actualizarprocesocupocarreraactual = await FuncionProcesoCupoCarreraActual(DatosSolicitud.data[0], idpersona, idCupoAdmision, strRutadocumento, DatosCarreraActual.data[0].carrera_unica);
            if (actualizarprocesocupocarreraactual.blProceso) {
                var actualizarprocesocupocarreramovilidad = await FuncionProcesoCupoCarreraMovilidad(DatosSolicitud.data[0], idpersona, idCupoAdmision, strRutadocumento, DatosCarreraMovilidad.data[0].carrera_unica, 3);
                if (actualizarprocesocupocarreramovilidad.blProceso) {
                    var ActualizarSolicitud = await funcionesmodelomovilidad.ActualziarEstadoSolitiud('OAS_Master', idsolicitud, 'APRO', 'SLLICITUD APROBADA', idpersona);
                    var IngresoInscripcionCarrera = await FuncionInscripcionEstuidanteCarreraInterna(DatosSolicitud.data[0], DatosCarreraMovilidad.data[0], strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30)

                }
            }
        }
        return { blProceso: true, mensaje: "OK" }
    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }
    }
}
async function FuncionInsertarSolicitudAprobadaInscripcionMovilidadExterna(solicitud, idpersona, idCupoAdmision, strRutadocumento, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30, strFoto) {
    try {
        var respuesta = {};
        var InsertarSolicitud = await funcionesmodelomovilidad.InsertarSolicitudEstudiante('OAS_Master', solicitud);
        console.log(InsertarSolicitud)
        if (InsertarSolicitud.count > 0) {
            var DatosCarreraMovilidad = await funcionesmodelomovilidad.ObenterDatosCarrera('OAS_Master', solicitud.cm_dbcarrera_movilidad);

            var actualizarprocesocupocarreramovilidad = await FuncionProcesoCupoCarreraMovilidad(solicitud, idpersona, idCupoAdmision, strRutadocumento, DatosCarreraMovilidad.data[0].carrera_unica, 2);
            if (actualizarprocesocupocarreramovilidad.blProceso) {
                var ActualizarSolicitud = await funcionesmodelomovilidad.ActualziarEstadoSolitiud('OAS_Master', InsertarSolicitud.data[0].cm_id, 'APRO', 'APROBACION DIRECTA DESDE DECANATO ACADEMICO', idpersona);
                var IngresoInscripcionCarrera = await FuncionInscripcionEstuidanteCarreraExterna(solicitud, DatosCarreraMovilidad.data[0], strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30, strFoto)

            }

        }
        return { blProceso: true, mensaje: "OK" }
    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }
    }
}
async function FuncionProcesoCupoCarreraActual(solicitud, idpersona, idCupoAdmision, strRutadocumento, codigocarreraunico) {
    try {
        var respuesta = {};
        var VerificarCupoCarreraActual = await axios.get(process.env.DNS_SERVICIOS_CUPOS + "wsservicioscupos/procesonivelacion/ObtenerCupoEstuidanteCarrera/" + solicitud.cm_identificacion + '/' + solicitud.cm_dbcarrera_actual, content, { httpsAgent: agent });
        console.log("VerificarCupoCarreraActual.data")
        console.log(VerificarCupoCarreraActual.data)
        if (VerificarCupoCarreraActual.data.success) {
            if (VerificarCupoCarreraActual.data.informacion.length > 0) {
                var content = {
                    idCupo: VerificarCupoCarreraActual.data.informacion[0].c_id,
                    estado: 3,//Inactivo
                    strObservacion: 'DESACTIVACION CUPO POR CAMBIO DE CARRERRA PROCESO INSCRIPION NUEVO',
                    strRuta: "",
                    dbcarrera: solicitud.cm_dbcarrera_actual,
                    dbnivelacion: VerificarCupoCarreraActual.data.informacion[0].c_dbnivelacion,
                    matriculacarrera: true,
                    dc_per_id: idpersona
                }
                console.log('Insertar Detalle')
                console.log(content)
                var IngresarDetalleCupo = await axios.post(process.env.DNS_SERVICIOS_CUPOS + "wsservicioscupos/procesonivelacion/IngresoDetalleCupo/", content, { httpsAgent: agent });
                var content = {
                    idCupo: VerificarCupoCarreraActual.data.informacion[0].c_id,
                    estado: 1,
                    vigencia: 0,
                    strObservacion: "DESACTIVACION CARRERA DESDE PROCESO INSCRIPION NUEVO",
                }
                console.log('Cambio carrera')
                console.log(content)
                var IngresarCupoCarrera = await axios.post(process.env.DNS_SERVICIOS_CUPOS + "wsservicioscupos/procesonivelacion/CambiarEstadoCupoDadoId/", content, { httpsAgent: agent });

            } else {
                var content = {
                    "cupo": {
                        "c_identificacion": solicitud.cm_identificacion,
                        "c_perid": solicitud.cm_perid,
                        "c_idtipo": 3,//CAMBIO INTERNO
                        "c_dbcarrera": solicitud.cm_dbcarrera_actual,
                        "matriculacarrera": true,
                        "c_cus_id": 0,
                        "c_ofa_id": 0,
                        "c_periodo": solicitud.cm_periodo,
                        "c_cupo_admision": idCupoAdmision,
                        "c_id_anterior": 0,
                        "c_observacion": 'ACTIVACION CARRERA DESDE PROCESO INSCRIPION NUEVO',
                        "c_codcarreraunico": codigocarreraunico
                    },
                    "detalle": {
                        "dc_per_id": solicitud.cm_perid,
                        "dc_idestado": 3,//DESACTIVACION CUPO
                        "dc_observacion": "CREACION CUPO DESDE PROCESO INSCRIPION NUEVO",
                        "dc_periodo": solicitud.cm_periodo,
                        "dc_rutaarchivo": strRutadocumento,
                        "dc_cupo_admision": idCupoAdmision
                    }
                }
                console.log('Creacion Cupo')
                console.log(content)
                var IngresarCupoCarrera = await axios.post(process.env.DNS_SERVICIOS_CUPOS + "wsservicioscupos/procesonivelacion/IngresoCupoEstudiante/", content, { httpsAgent: agent });
                var VerificarCupoCarreraActual = await axios.get(process.env.DNS_SERVICIOS_CUPOS + "wsservicioscupos/procesonivelacion/ObtenerCupoEstuidanteCarrera/" + solicitud.cm_identificacion + '/' + solicitud.cm_dbcarrera_actual, content, { httpsAgent: agent });
                console.log('Obtener Cupo')
                console.log(VerificarCupoCarreraActual.data)
                var content = {
                    idCupo: VerificarCupoCarreraActual.data.informacion[0].c_id,
                    estado: 1,
                    vigencia: 0,
                    strObservacion: "DESACTIVACION CARRERA DESDE PROCESO INSCRIPION NUEVO",
                }
                var IngresarCupoCarrera = await axios.post(process.env.DNS_SERVICIOS_CUPOS + "wsservicioscupos/procesonivelacion/CambiarEstadoCupoDadoId/", content, { httpsAgent: agent });
            }
        }

        return { blProceso: true, mensaje: "OK" }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

async function FuncionProcesoCupoCarreraMovilidad(solicitud, idpersona, idCupoAdmision, strRutadocumento, codigocarreraunico, idtipo) {
    try {
        console.log('Proceso Movilidad ')
        var respuesta = {};
        var VerificarCupoCarreraActual = await axios.get(process.env.DNS_SERVICIOS_CUPOS + "wsservicioscupos/procesonivelacion/ObtenerCupoEstuidanteCarrera/" + solicitud.cm_identificacion + '/' + solicitud.cm_dbcarrera_movilidad, content, { httpsAgent: agent });
        console.log("VerificarCupoCarreraActual.data")
        console.log(VerificarCupoCarreraActual.data)
        if (VerificarCupoCarreraActual.data.success) {
            if (VerificarCupoCarreraActual.data.informacion.length > 0) {
                var content = {
                    idCupo: VerificarCupoCarreraActual.data.informacion[0].c_id,
                    estado: 1,//Activacion
                    strObservacion: 'ACTIVACION CUPO POR CAMBIO DE CARRERRA PROCESO INSCRIPION NUEVO',
                    strRuta: "",
                    dbcarrera: solicitud.cm_dbcarrera_movilidad,
                    dbnivelacion: VerificarCupoCarreraActual.data.informacion[0].c_dbnivelacion,
                    matriculacarrera: true,
                    dc_per_id: idpersona
                }
                console.log('Insertar Detalle')
                console.log(content)
                var IngresarDetalleCupo = await axios.post(process.env.DNS_SERVICIOS_CUPOS + "wsservicioscupos/procesonivelacion/IngresoDetalleCupo/", content, { httpsAgent: agent });

            } else {
                var content = {
                    "cupo": {
                        "c_identificacion": solicitud.cm_identificacion,
                        "c_perid": solicitud.cm_perid,
                        "c_idtipo": idtipo,//3 CAMBIO INTERNO//2 CAMBIO EXTERNO
                        "c_dbcarrera": solicitud.cm_dbcarrera_movilidad,
                        "matriculacarrera": true,
                        "c_cus_id": 0,
                        "c_ofa_id": 0,
                        "c_periodo": solicitud.cm_periodo,
                        "c_cupo_admision": idCupoAdmision,
                        "c_id_anterior": 0,
                        "c_observacion": 'ACTIVACION CARRERA DESDE PROCESO INSCRIPION NUEVO',
                        "c_codcarreraunico": codigocarreraunico
                    },
                    "detalle": {
                        "dc_per_id": solicitud.cm_perid,
                        "dc_idestado": 1,//ACTIVACION CUPO
                        "dc_observacion": "CREACION CUPO DESDE PROCESO INSCRIPION NUEVO",
                        "dc_periodo": solicitud.cm_periodo,
                        "dc_rutaarchivo": strRutadocumento,
                        "dc_cupo_admision": idCupoAdmision
                    }
                }
                console.log('Creacion Cupo')
                console.log(content)
                var IngresarCupoCarrera = await axios.post(process.env.DNS_SERVICIOS_CUPOS + "wsservicioscupos/procesonivelacion/IngresoCupoEstudiante/", content, { httpsAgent: agent });
            }
        }

        return { blProceso: true, mensaje: "OK" }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

async function FuncionInscripcionEstuidanteCarreraInterna(solicitud, datosCarreraMovilidad, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30) {
    try {
        var respuesta = {};
        var ObnterDatosInscripcionCarreraEstuidante = await funcionesmodelomovilidad.ObtenerInscripcionEstuidante('OAS_Master', funcionestools.CedulaConGuion(solicitud.cm_identificacion), datosCarreraMovilidad.strCodigo);
        if (ObnterDatosInscripcionCarreraEstuidante.count == 0) {
            var InsertarInscripcionEstuidante = await funcionesmodelomovilidad.InsertarInscripcionEstuidante('OAS_Master', funcionestools.CedulaConGuion(solicitud.cm_identificacion), datosCarreraMovilidad.strCodigo, solicitud.cm_periodo, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30);
        }
        var DatoEstudianteCarreaMovilidad = await funcionesmodelocarrera.ObtenerDatosEstudianteCarrera(solicitud.cm_dbcarrera_movilidad, funcionestools.CedulaConGuion(solicitud.cm_identificacion));
        var DatoEstudianteCarreActual = await funcionesmodelocarrera.ObtenerDatosEstudianteCarrera(solicitud.cm_dbcarrera_actual, funcionestools.CedulaConGuion(solicitud.cm_identificacion));
        console.log("DatoEstudianteCarreActual")
        console.log(DatoEstudianteCarreActual)
        if (DatoEstudianteCarreaMovilidad.count == 0) {
            var CodigoSiguienteEstuidante = await funcionesmodelomovilidad.ObtenerCodigoSiguienteEstuidante(solicitud.cm_dbcarrera_movilidad);
            var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/" + solicitud.cm_identificacion, { httpsAgent: agent });

            var objEstuidante = {
                strCodigo: 0,
                strCedula: funcionestools.CedulaConGuion(solicitud.cm_identificacion),
                strNombres: ObtenerPersona.data.listado[0].per_nombres,
                strApellidos: ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido,
                strCedulaMil: ObtenerPersona.data.listado[0].per_telefonoCelular,
                dtFechaNac: ObtenerPersona.data.listado[0].per_fechaNacimiento,
                strEmail: ObtenerPersona.data.listado[0].per_email,
                strNacionalidad: ObtenerPersona.data.listado[0].nac_nombre,
                strDocumentacion: ObtenerPersona.data.listado[0].dir_callePrincipal,
                strCodSexo: ObtenerPersona.data.listado[0].gen_nombre == 'MASCULINO' ? 'MAS' : 'FEM',
                strCodTit: DatoEstudianteCarreActual.data[0].strCodTit,
                strCodInt: DatoEstudianteCarreActual.data[0].strCodInt,
                strFormaIns: strFormaInscripcion,
            }
            var CodigoSiguienteEstuidante = await funcionesmodelomovilidad.ObtenerCodigoSiguienteEstuidante(solicitud.cm_dbcarrera_movilidad);
            objEstuidante.strCodigo = CodigoSiguienteEstuidante.data[0].siguientecodigodisponible
            var InsertarEstuidanteCarrera = await funcionesmodelomovilidad.InsertarEstudianteCarrera(solicitud.cm_dbcarrera_movilidad, objEstuidante);
        }
        return { blProceso: true, mensaje: "OK" }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}
async function FuncionInscripcionEstuidanteCarreraExterna(solicitud, datosCarreraMovilidad, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30, strFoto) {
    try {
        var respuesta = {};
        var ObnterDatosInscripcionCarreraEstuidante = await funcionesmodelomovilidad.ObtenerInscripcionEstuidante('OAS_Master', funcionestools.CedulaConGuion(solicitud.cm_identificacion), datosCarreraMovilidad.strCodigo);
        if (ObnterDatosInscripcionCarreraEstuidante.count == 0) {
            var InsertarInscripcionEstuidante = await funcionesmodelomovilidad.InsertarInscripcionEstuidante('OAS_Master', funcionestools.CedulaConGuion(solicitud.cm_identificacion), datosCarreraMovilidad.strCodigo, solicitud.cm_periodo, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30);
        }
        var DatoEstudianteCarreaMovilidad = await funcionesmodelocarrera.ObtenerDatosEstudianteCarrera(solicitud.cm_dbcarrera_movilidad, funcionestools.CedulaConGuion(solicitud.cm_identificacion));
        console.log("DatoEstudianteCarreActual")
        console.log(DatoEstudianteCarreaMovilidad)
        if (DatoEstudianteCarreaMovilidad.count == 0) {
            var CodigoSiguienteEstuidante = await funcionesmodelomovilidad.ObtenerCodigoSiguienteEstuidante(solicitud.cm_dbcarrera_movilidad);
            var DatosGradoEstuidantes = await funcionesmodelomovilidad.ObtenerGradoEstudianteTodas('OAS_Master', funcionestools.CedulaConGuion(solicitud.cm_identificacion));
            var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/" + solicitud.cm_identificacion, { httpsAgent: agent });
            var objEstuidante = {
                strCodigo: 0,
                strCedula: funcionestools.CedulaConGuion(solicitud.cm_identificacion),
                strNombres: ObtenerPersona.data.listado[0].per_nombres,
                strApellidos: ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido,
                strCedulaMil: ObtenerPersona.data.listado[0].per_telefonoCelular,
                dtFechaNac: ObtenerPersona.data.listado[0].per_fechaNacimiento,
                strEmail: ObtenerPersona.data.listado[0].per_email,
                strNacionalidad: ObtenerPersona.data.listado[0].nac_nombre,
                strDocumentacion: ObtenerPersona.data.listado[0].dir_callePrincipal,
                strCodSexo: ObtenerPersona.data.listado[0].gen_nombre == 'MASCULINO' ? 'MAS' : 'FEM',
                strCodTit: DatosGradoEstuidantes.data[0].codigotitulo,
                strCodInt: DatosGradoEstuidantes.data[0].codigoinstitucion,
                strFormaIns: strFormaInscripcion,
            }
            console.log("objEstuidante")
            console.log(objEstuidante)
            var CodigoSiguienteEstuidante = await funcionesmodelomovilidad.ObtenerCodigoSiguienteEstuidante(solicitud.cm_dbcarrera_movilidad);
            objEstuidante.strCodigo = CodigoSiguienteEstuidante.data[0].siguientecodigodisponible
            var InsertarEstuidanteCarrera = await funcionesmodelomovilidad.InsertarEstudianteCarrera(solicitud.cm_dbcarrera_movilidad, objEstuidante);
            var InsertarFotoEstuidanteCarrera = await funcionesmodelomovilidad.InsertarFotoEstudianteCarrera(solicitud.cm_dbcarrera_movilidad, objEstuidante.strCodigo, solicitud.cm_periodo, strFoto);
        }
        return { blProceso: true, mensaje: "OK" }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}
async function FuncionInsertarCuposMigracionPeriodoActual(periodo, idUsuario) {
    try {
        var respuesta = {};
        var PeriodoVigenteDatos = await funcionesmodelocupos.ObtenerPeriodoVigenteMaster('OAS_Master')
        var listadoCarreras = await funcionesmodelocarrera.ListadoHomologacionesCarreraPeriodo('OAS_Master', periodo)
        for (var carreras of listadoCarreras.data) {
            var DatosCarrera = await funcionesmodelomovilidad.ObenterDatosCarrera('OAS_Master', carreras.hmbdbasecar);
            var objDatos = {
                mc_strdescripcon: PeriodoVigenteDatos.data[0].strDescripcion,
                mc_strobservacion: PeriodoVigenteDatos.data[0].strDescripcion,
                mc_periodo: periodo,
                mc_dbcarrera: carreras.hmbdbasecar,
                mc_nombre_carrera: DatosCarrera.data[0].strNombre,
                mc_cusid_carrera: carreras.hmbdbaseinsc,
                mc_urldocumento: null,
                mc_puntaje_minimo_carrera: 0,
                mc_cupos_adminisiones: 0,
                mc_cupos_movi_interna: 0,
                mc_cupos_movi_externa: 0,
                mc_cupos_movi_traspaso: 0,
                mc_perid_registro: idUsuario,
                mc_fecha_inicio: null,
                mc_fecha_fin: null,
            }

            var DatosCarreraConfig = await funcionesmodelomovilidad.ObtenerCupoCarreraConfiguraciones('SistemaAcademico', carreras.hmbdbasecar, periodo)
            if (DatosCarreraConfig.count == 0) {
                var listadoCarreras = await funcionesmodelomovilidad.InsertarCuposCarreraConfiguracion('SistemaAcademico', objDatos)
            }

        }
        return { blProceso: true, mensaje: "OK" }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}
async function FuncionListadoConfiguracionesCarreras(periodo) {
    try {
        var respuesta = [];
        var listadoCarreras = await funcionesmodelomovilidad.ListadoCupoCarreraConfiguracionesPeriodo('SistemaAcademico', periodo)
        for (var carreras of listadoCarreras.data) {

            var vigencia = funcionestools.FechaVigenteInicioFin(carreras.mc_fecha_inicio, carreras.mc_fecha_fin);
            var fechaincioformato = funcionestools.formatearFechaISO(carreras.mc_fecha_inicio);
            var fechafinformato = funcionestools.formatearFechaISO(carreras.mc_fecha_fin);
            carreras.vigencia = vigencia
            carreras.fechaincioformato = fechaincioformato
            carreras.fechafinformato = fechafinformato
            carreras.mc_fecha_fin = fechafinformato
            carreras.mc_fecha_inicio = fechaincioformato
            respuesta.push(carreras)
        }
        return respuesta
    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

async function FuncionInsertarEstuidanteMaster(objEstuidante) {
    try {
        var ObnterDatosEstuidanteMaster = await funcionesmodelomovilidad.ObtnerEstuidanteMaster('OAS_Master', objEstuidante.strCedula)
        if (ObnterDatosEstuidanteMaster.count == 0) {
            var ObnterDatosEstuidanteMaster = await funcionesmodelomovilidad.IngresarEstudianteMaster('OAS_Master', objEstuidante)
        }
        return { blProceso: true, mensaje: "OK" }
    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

async function FuncionInsertarGradoEstuidanteMaster(objGradoEstuidante) {
    try {
        var ObnterDatos = await funcionesmodelomovilidad.ObtenerGradoEstudiante('OAS_Master', objGradoEstuidante)
        if (ObnterDatos.count == 0) {
            var ObnterDatosEstuidanteMaster = await funcionesmodelomovilidad.InsertarGradoEstudiante('OAS_Master', objGradoEstuidante)
        }
        return { blProceso: true, mensaje: "OK" }
    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

async function FuncionEliminacionInscripcionMovilidadExterna(dbCarrera, cedula, periodo) {
    try {

        var EliminarEstudiante = await funcionesmodelomovilidad.EliminarEstuidanteCarrera(dbCarrera, funcionestools.CedulaConGuion(cedula))
        var EliminarInscricpncion = await funcionesmodelomovilidad.EliminarInscripcionSolicitudEstuidante('OAS_Master', funcionestools.CedulaConGuion(cedula), cedula, periodo)
        var EliminarCupos = await funcionesmodelomovilidad.EliminarCupoInscripcionEstuidante('OAS_Cupos_Institucionales', funcionestools.CedulaConGuion(cedula), periodo)
        return { blProceso: true, mensaje: "OK" }
    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

async function FuncionReporteExcelSolicitudes(periodo, estado) {
    console.log(periodo, estado)
    try {
        var Base64 = ''
        var respuesta = {};
        var listado = [];
        var listadoDocumentos = await funcionesmodelomovilidad.ListadoSolicitudesMovilidadPorEstado('OAS_Master', estado, periodo);
        if (listadoDocumentos.count > 0) {
            for (var solicitudes of listadoDocumentos.data) {
                var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/" + solicitudes.cm_identificacion, { httpsAgent: agent });
                solicitudes.nombreestudiante =
                    solicitudes.nombreestudiante = ObtenerPersona.data.listado[0].per_nombres
                solicitudes.correoestudiante = ObtenerPersona.data.listado[0].per_email
                solicitudes.celularstudiante = ObtenerPersona.data.listado[0].per_telefonoCelular
                solicitudes.apellidoestudiante = ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
                listado.push(solicitudes)
            }
            Base64 = await funcionesreportemovilidad.ExcelExcelListadoSolicitudes(listado, periodo)
        }

        return Base64;
    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}


async function FuncionReportePdfSolicitudes(periodo) {
    try {
        var Base64 = ''
        var respuesta = {};

        var listadoCarreras = await funcionesmodelomovilidad.CarrerasSlicitudesMovilidad('OAS_Master', periodo, 'APRO');
        if (listadoCarreras.count > 0) {

            for (var carreras of listadoCarreras.data) {
                var listadoSolicitudes = await funcionesmodelomovilidad.ListadoEstuidanteCarreraSolicitudes('OAS_Master', periodo, 'APRO', carreras.cm_dbcarrera_movilidad);
                var listado = [];
                for (var solicitudes of listadoSolicitudes.data) {
                    var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/" + solicitudes.cm_identificacion, { httpsAgent: agent });
                    solicitudes.nombreestudiante =
                        solicitudes.nombreestudiante = ObtenerPersona.data.listado[0].per_nombres
                    solicitudes.correoestudiante = ObtenerPersona.data.listado[0].per_email
                    solicitudes.celularstudiante = ObtenerPersona.data.listado[0].per_telefonoCelular
                    solicitudes.apellidoestudiante = ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
                    listado.push(solicitudes)
                }
                carreras.ListaEstuidantes = listado
            }
            Base64 = await funcionesreportemovilidad.PdfListadoSolicitudesAprobadasCarreras(listadoCarreras.data, periodo)
        }

        return Base64;
    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}


async function FuncionCurriculumEstudiantil(carrera, cedula, periodo) {
    try {
        var Base64 = ''
        var respuesta = {};
        var listado = []
        var listadoBecas = []
        var foto = ''
        var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/" + funcionestools.CedulaSinGuion(cedula), { httpsAgent: agent });
        var ObtenerFoto = await axios.get("https://apigestioncupos.espoch.edu.ec/wsservicioscupos/procesosdinardap/ObtenerFotoPersona/" + funcionestools.CedulaSinGuion(cedula), { httpsAgent: agent });
        var DatosTitulacion = await axios.get("https://apisustentacion.espoch.edu.ec/rutagrado/seguimientoTitulacion/" + carrera + '/' + cedula, { httpsAgent: agent });
        var DatosBecas = await axios.get("https://swbecas.espoch.edu.ec/rutaBecasUsuario/getGestionSrvBecasFicha/1/" + funcionestools.CedulaSinGuion(cedula) + '/5/5', { httpsAgent: agent });
        var datosCarrera = await funcionesmodelocupos.ObtenerDatosBase(carrera);
        console.log(DatosBecas.data)
        var Titulacion = {}
        var datosEstuidante = await funcionesmodelocupos.ObtenerDatosEstudianteCarrera(carrera, cedula);
        if (ObtenerFoto.data.success && ObtenerFoto.data.Informacion.blProceso) {
            foto = 'data:image/jpeg;base64,' + ObtenerFoto.data.Informacion.Datos.valor
        } else {
            foto = 'data:image/png;base64,' + await funcionestools.FotoPorDefecto();
        }

        if (DatosTitulacion.data.success) {
            if (DatosTitulacion.data.informacion.tipo == 'OASIS') {
                Titulacion.proceso = true;
                Titulacion.nombreproyecto = DatosTitulacion.data.informacion.proyecto.nombreproyecto;
                Titulacion.formagrado = DatosTitulacion.data.informacion.proyecto.formagrado;
                Titulacion.estado = DatosTitulacion.data.informacion.proyecto.estado;
                Titulacion.resolucion = '';
            } else {
                Titulacion.proceso = true;
                Titulacion.nombreproyecto = DatosTitulacion.data.informacion.proyecto.Tema;
                Titulacion.formagrado = DatosTitulacion.data.informacion.proyecto.Modalidad;
                Titulacion.estado = DatosTitulacion.data.informacion.proyecto.estado;
                Titulacion.resolucion = DatosTitulacion.data.informacion.proyecto.resolucionaprobacion;
            }
        } else {
            Titulacion.proceso = false;
            Titulacion.mensaje = DatosTitulacion.data.mensaje;
        }
        if (DatosBecas.data.resultado) {
            listadoBecas = DatosBecas.data.resBecas
        }

        var RecordAcademicoNivel = await funcionesmodelomovilidad.ObtnerRecodAcademicoporNivel(carrera, datosEstuidante.data[0].strCodigo, 15);
        var VerificarHomologacion = RecordAcademicoNivel.data.find(item => item.Tipo === 2) !== undefined
        var ListadoNiveles = await funcionesmodelomovilidad.ObtenerNivelesMallaDadoPeriodo(carrera, periodo);
        if (VerificarHomologacion) {//Proceso Con Homologacion Carreras
            console.log('Carrera homologada')
            if (ListadoNiveles.count > 0) {
                for (var objniveles of ListadoNiveles.data) {
                    var listadoAsignaturas = [];
                    var MallaAsignatura = await funcionesmodelomovilidad.MallCarreraASignaturasporNivelPeriodo(carrera, periodo, objniveles.strCodNivel);
                    for (var datosasignatura of MallaAsignatura.data) {
                        var objtoEncontrado = await funcionestools.EncontraObjetodentroListadoRecordAcademico(datosasignatura.strCodMateria, RecordAcademicoNivel.data, 'CodigoMateriaNueva')

                        if (objtoEncontrado != null) {
                            if (objtoEncontrado.Equivalencia == 'A' || objtoEncontrado.Equivalencia == 'E' || objtoEncontrado.Equivalencia == 'H' || objtoEncontrado.Equivalencia == 'RC' || objtoEncontrado.Equivalencia == 'AVC' || objtoEncontrado.Equivalencia == 'C') {
                                datosasignatura.estadoasignatura = 'APROBADA'
                            } else {
                                datosasignatura.estadoasignatura = 'POR APROBAR'
                            }
                        } else {
                            datosasignatura.estadoasignatura = 'POR APROBAR'
                        }
                        listadoAsignaturas.push(datosasignatura)

                    }
                    objniveles.listadoasignaturas = listadoAsignaturas
                    listado.push(objniveles)
                }

            }
        } else {//Proceso sin Homologacion Carreras
            console.log('Carrera no Hmologada')
            if (ListadoNiveles.count > 0) {
                for (var objniveles of ListadoNiveles.data) {
                    var listadoAsignaturas = [];
                    var MallaAsignatura = await funcionesmodelomovilidad.MallCarreraASignaturasporNivelPeriodo(carrera, periodo, objniveles.strCodNivel);
                    for (var datosasignatura of MallaAsignatura.data) {
                        var objtoEncontrado = await funcionestools.EncontraObjetodentroListadoRecordAcademico(datosasignatura.strCodMateria, RecordAcademicoNivel.data, 'CodigoMateriaAnterior')

                        if (objtoEncontrado != null) {
                            if (objtoEncontrado.Equivalencia == 'A' || objtoEncontrado.Equivalencia == 'E' || objtoEncontrado.Equivalencia == 'H' || objtoEncontrado.Equivalencia == 'RC' || objtoEncontrado.Equivalencia == 'AVC' || objtoEncontrado.Equivalencia == 'C') {
                                datosasignatura.estadoasignatura = 'APROBADA'
                            } else {
                                datosasignatura.estadoasignatura = 'POR APROBAR'
                            }
                        } else {
                            datosasignatura.estadoasignatura = 'POR APROBAR'
                        }
                        listadoAsignaturas.push(datosasignatura)

                    }
                    objniveles.listadoasignaturas = listadoAsignaturas
                    listado.push(objniveles)
                }

            }
        }

        Base64 = await funcionesreportemovilidad.PdfCurriculumEstuidantil(cedula, ObtenerPersona.data.listado[0], datosCarrera.data[0], listado, foto, Titulacion, listadoBecas)

        return Base64;
        // return listado;
    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

