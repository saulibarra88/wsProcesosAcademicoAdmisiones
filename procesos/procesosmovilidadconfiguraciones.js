
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
const funcionesmodelomovilidadconfiguraciones = require('../modelo/modelomovilidadconfiguraciones');
const funcionestools = require('../rutas/tools');
const funcionesmodelocarrera = require('../modelo/procesocarrera');
const funcionesmodelocupos = require('../modelo/procesocupos');
const funcionesmodelonotasacademicas = require('../modelo/procesonotasacademicos');
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const { JSDOM } = require('jsdom');
const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});


module.exports.ProcesoListadoFacultadesAdministracion = async function () {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ListadoFacultadesAdministracion('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoListadoFacultadesActivas = async function () {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ListadoFacultadesActivas('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}

module.exports.ProcesoListadoEscuelaAdministracion = async function (facultad) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ListadoEscuelaAdministracion('OAS_Master', facultad);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.Proceso = async function (facultad) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ListadoEscuelaAdministracion('OAS_Master', facultad);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoPropuestaCodigoPensumCarrera = async function (carrera) {
    try {
        respuesta = {};
        var UltimoPensumCarrera = await funcionesmodelocarrera.EncontrarUltimoPesumCarrera(carrera);
        var reglamento = await funcionesmodelocarrera.ReglamentoActivoMaster('SistemaAcademico');
        if (UltimoPensumCarrera.count > 0) {
            var valores = funcionestools.codigopesumultimo(UltimoPensumCarrera.data[0].strCodigo)
            respuesta.codigo = valores.codigo;
            respuesta.descripcion = valores.descripcion;
            respuesta.idreglamentoactivo = reglamento.data[0].reg_id;
            respuesta.codigoanterior = UltimoPensumCarrera.data[0].strCodigo;
        } else {
            const currentYear = new Date().getFullYear();
            respuesta.codigo = currentYear + '1';
            respuesta.descripcion = 'MALLA CURRICULAR ' + currentYear + '1';
            respuesta.idreglamentoactivo = reglamento.data[0].reg_id;
            respuesta.codigoanterior = '';
        }

        return respuesta
    } catch (err) {
        console.log(err);
        return 'ERROR: ' + err;
    }
}

module.exports.ProcesoInsertarFacultad = async function (facultad) {
    try {
        var resultado = await funcionesmodelomovilidad.InsertarFacultad('OAS_Master', facultad);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoObtenerInformacionAcademicaEstudiante = async function (cedula) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ObtenerInformacionAcademicaEstudiante('OAS_Master', cedula);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoActualizarFacultad = async function (facultad) {
    try {
        var resultado = await funcionesmodelomovilidad.ActualizarFacultad('OAS_Master', facultad);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoCambiarEstadoFacultad = async function (codigo, estado) {
    try {
        var resultado = await funcionesmodelomovilidad.CambiarEstadoFacultad('OAS_Master', codigo, estado);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoInsertarEscuela = async function (Escuela) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.InsertarEscuela('OAS_Master', Escuela);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoActualizarEscuela = async function (Escuela) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ActualizarEscuela('OAS_Master', Escuela);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoCambiarEstadoEscuela = async function (codigo, facultad, estado) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.CambiarEstadoEscuela('OAS_Master', codigo, facultad, estado);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoInsertarCarrera = async function (carrera) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.InsertarCarrera('OAS_Master', carrera);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoActualizarCarrera = async function (carrera) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ActualizarCarrera('OAS_Master', carrera);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoCambiarEstadoCarrera = async function (codigo, escuela, estado) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.CambiarEstadoCarrera('OAS_Master', codigo, escuela, estado);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoListadoCarreraaAdministracion = async function (escuela) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ListadoCarrerasAdministracion('OAS_Master', escuela);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}

module.exports.ProcesoListadoSede = async function () {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ListadoSedes('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}

module.exports.ProcesoCodigoSeguridadCarrera = async function (escuela) {
    try {
        var datoscodigo = await funcionesmodelomovilidadconfiguraciones.ObtnerCodigoSeguridadCarrera('OAS_Master', escuela);

        if (datoscodigo.count == 0) {
            return await funcionestools.generarCodigo8Digitos();

        } else {
            return datoscodigo.data[0].strNumSeguridad;
        }

    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoInsertarPais = async function (strCodigo, strNombre) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.InsertarPais('OAS_Master', strCodigo, strNombre);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoActualizarPais = async function (strCodigo, strNombre) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ActualizarPais('OAS_Master', strCodigo, strNombre);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoInsertarProvincia = async function (strCodigo, strNombre, strCodPais) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.InsertarProvincia('OAS_Master', strCodigo, strNombre, strCodPais);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoActualizarProvincia = async function (strCodigo, strNombre, strCodPais) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ActulizarProvincia('OAS_Master', strCodigo, strNombre, strCodPais);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}

module.exports.ProcesoInsertarCiudad = async function (strCodigo, strNombre, strCodProv) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.InsertarCiudad('OAS_Master', strCodigo, strNombre, strCodProv);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoActualizarCiudad = async function (strCodigo, strNombre, strCodProv) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ActulizarCiudad('OAS_Master', strCodigo, strNombre, strCodProv);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}

module.exports.ProcesoListadoTiposInstituciones = async function () {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ListadoTiposInstituciones('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoListadoInstitucionesTodas = async function () {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ListadoInstitucionesMasterTodas('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}

module.exports.ProcesoInsertarInstituciones = async function (strCodigo, strNombre, strCodCiudad, strCodTipo) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.InsertarInstitucion('OAS_Master', strCodigo, strNombre, strCodCiudad, strCodTipo);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoActualizarInstituciones = async function (strCodigo, strNombre, strCodCiudad, strCodTipo) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ActulizarInstituciones('OAS_Master', strCodigo, strNombre, strCodCiudad, strCodTipo);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoListadoTitulosMaster = async function () {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ListadoTitulosMaster('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}

module.exports.ProcesoInsertarTitulo = async function (strCodigo, strNombre, blnProfesional) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.InsertarTitulo('OAS_Master', strCodigo, strNombre, blnProfesional);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoActualizarTitulo = async function (strCodigo, strNombre, blnProfesional) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ActulizarTitulo('OAS_Master', strCodigo, strNombre, blnProfesional);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoObteberDatosInstitucion = async function () {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ObtenerDatosInstitucion('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoActualizarDatosInstitucion = async function (objDatos) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ActualizarDatosInstitucion('OAS_Master', objDatos);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}

module.exports.ProcesoObtenerNuevoCodigoPeriodoRemedial = async function () {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ObtenerNuevoCodigoPeriodoRemedial('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoObtenerNuevoCodigoPeriodoOrdinario = async function () {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ObtenerNuevoCodigoPeriodoOrdinario('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoObtenerFechasCalificacionesSistemaAcademico = async function () {
    try {
        var Datos={}
        var ParametrosCarreras = await funcionesmodelomovilidadconfiguraciones.ListadoFechaCalificacionesSistemaAcademico('SistemaAcademico');
        if (ParametrosCarreras.count > 0) {
            for (var paramentros of ParametrosCarreras.data) {
                if (paramentros.strCodigo == 'FP1') {
                    Datos.FP1codigo = paramentros.strCodigo
                    Datos.FP1Fecha = paramentros.strValor
                }
                if (paramentros.strCodigo == 'FP2') {
                    Datos.FP2codigo = paramentros.strCodigo
                    Datos.FP2Fecha = paramentros.strValor
                }
                if (paramentros.strCodigo == 'FPR') {
                    Datos.FPRcodigo = paramentros.strCodigo
                    Datos.FPRFecha = paramentros.strValor
                }
                Datos.idreglamento=paramentros.idreglamento
                Datos.reglamento=paramentros.reg_nombre
            }
        }
        return Datos
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoInsertarNuevoPeriodoAcademico = async function (objPeriodo) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.InsertarPeridoAcademicoMaster('OAS_Master', objPeriodo);
        return resultado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}
module.exports.ProcesoActualizarPeriodosCarreras = async function (objPeriodo, listadoCarrera, tipo) {
    console.log(tipo)

    try {
        if (tipo == 0) {
            var ListadoCarreras = await funcionesmodelomovilidadconfiguraciones.ListadosTodasCarrerasAcademica('OAS_Master');
            if (ListadoCarreras.count > 0) {
                for (var carreras of ListadoCarreras.data) {
                    var ActualizarCarrera = await funcionesmodelomovilidadconfiguraciones.ActualizarPeridoAcademicoCarrera(carreras.strBaseDatos, objPeriodo);
                }
            }
        }
        if (tipo == 1) {
            if (listadoCarrera.length > 0) {
                for (var carreras of listadoCarrera) {
                    var ActualizarCarrera = await funcionesmodelomovilidadconfiguraciones.ActualizarPeridoAcademicoCarrera(carreras.strBaseDatos, objPeriodo);
                }
            }
        }
        if (tipo == 2) {
            console.log('Aqui')
            var ActualizarCarrera = await funcionesmodelomovilidadconfiguraciones.ActualizarPeridoAcademicoCarrera('OAS_Master', objPeriodo);
        }

        return 'OK'
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}

module.exports.ProcesoListarFechasCalificacionesCarreras = async function () {

    try {
        var listado = [];
        var ListadoCarreras = await funcionesmodelomovilidadconfiguraciones.ListadosTodasCarrerasAcademica('OAS_Master');
        if (ListadoCarreras.count > 0) {
            for (var carreras of ListadoCarreras.data) {
                var ParametrosCarreras = await funcionesmodelomovilidadconfiguraciones.ListadoParametroCarreraCalificaciones(carreras.strBaseDatos);
                if (ParametrosCarreras.count > 0) {
                    carreras.FN1codigo = ParametrosCarreras.data[0].strCodigo
                    carreras.FN1Fecha = ParametrosCarreras.data[0].strValor
                    carreras.FN2codigo = ParametrosCarreras.data[1].strCodigo
                    carreras.FN2Fecha = ParametrosCarreras.data[1].strValor
                    carreras.FN3codigo = ParametrosCarreras.data[2].strCodigo
                    carreras.FN3Fecha = ParametrosCarreras.data[2].strValor
                    carreras.FNPcodigo = ParametrosCarreras.data[3].strCodigo
                    carreras.FNPFecha = ParametrosCarreras.data[3].strValor
                    carreras.FNScodigo = ParametrosCarreras.data[4].strCodigo
                    carreras.FNSFecha = ParametrosCarreras.data[4].strValor
                    carreras.FP1codigo = ParametrosCarreras.data[5].strCodigo
                    carreras.FP1Fecha = ParametrosCarreras.data[5].strValor
                    carreras.FP2codigo = ParametrosCarreras.data[6].strCodigo
                    carreras.FP2Fecha = ParametrosCarreras.data[6].strValor
                    carreras.FPRcodigo = ParametrosCarreras.data[7].strCodigo
                    carreras.FPRFecha = ParametrosCarreras.data[7].strValor
                    listado.push(carreras);

                }
            }
        }



        return listado
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}

module.exports.ProcesoActualizarFechasCalificacionesCarreras = async function (objFechas, listadoCarrera, tipo) {
    try {
        if (tipo == 0) {
            var ListadoCarreras = await funcionesmodelomovilidadconfiguraciones.ListadosTodasCarrerasAcademica('OAS_Master');
            if (ListadoCarreras.count > 0) {
                for (var carreras of ListadoCarreras.data) {
                   var ActualizarFecha1 = await funcionesmodelomovilidadconfiguraciones.ActualizarFechasCalificacionesCarrera(carreras.strBaseDatos, objFechas.strCodigoParcial1,objFechas.strFechaParcial1);
                  var ActualizarFecha2 = await funcionesmodelomovilidadconfiguraciones.ActualizarFechasCalificacionesCarrera(carreras.strBaseDatos, objFechas.strCodigoParcial2,objFechas.strFechaParcial2);
            var ActualizarFecha3 = await funcionesmodelomovilidadconfiguraciones.ActualizarFechasCalificacionesCarrera(carreras.strBaseDatos, objFechas.strCodigoRecuperación,objFechas.strFechaRecuperacion);
                }
            }
        }
        if (tipo == 1) {
            if (listadoCarrera.length > 0) {
                for (var carreras of listadoCarrera) {
                     var ActualizarFecha1 = await funcionesmodelomovilidadconfiguraciones.ActualizarFechasCalificacionesCarrera(carreras.strBaseDatos, objFechas.strCodigoParcial1,objFechas.strFechaParcial1);
                  var ActualizarFecha2 = await funcionesmodelomovilidadconfiguraciones.ActualizarFechasCalificacionesCarrera(carreras.strBaseDatos, objFechas.strCodigoParcial2,objFechas.strFechaParcial2);
            var ActualizarFecha3 = await funcionesmodelomovilidadconfiguraciones.ActualizarFechasCalificacionesCarrera(carreras.strBaseDatos, objFechas.strCodigoRecuperación,objFechas.strFechaRecuperacion);
                }
            }
        }
        if (tipo == 2) {
            var ActualizarFecha1 = await funcionesmodelomovilidadconfiguraciones.ActualizarFechasCalificacionesAcademico('SistemaAcademico', objFechas.strCodigoParcial1,objFechas.strFechaParcial1,objFechas.idreglamento);
            var ActualizarFecha2 = await funcionesmodelomovilidadconfiguraciones.ActualizarFechasCalificacionesAcademico('SistemaAcademico', objFechas.strCodigoParcial2,objFechas.strFechaParcial2,objFechas.idreglamento);
            var ActualizarFecha3 = await funcionesmodelomovilidadconfiguraciones.ActualizarFechasCalificacionesAcademico('SistemaAcademico', objFechas.strCodigoRecuperación,objFechas.strFechaRecuperacion,objFechas.idreglamento);
        }

        return 'OK'
    } catch (error) {
        console.log(error);
        return 'ERROR: ' + error;
    }
}