const express = require('express');
const router = express.Router();

const fs = require("fs");

const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");

const sqlmodelogenerales = require('../modeloformato/generalesmodelo');
const funcionesgenerales = require('../rutas/tools');
const sqlmodelomovilidad = require('../modelo/modelomovilidad');
const { sendResponseProcesos } = require('../herramientas/responseservice');
const logger = require('./../herramientas/logger');
const funcionesmodelomovilidadconfiguraciones = require('../modelo/modelomovilidadconfiguraciones');


const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});


module.exports.ProcesoListadoCarrerasDadoFacultad = async function (codigofacultad) {
    try {

        var Informacion = await sqlmodelogenerales.ListadoCarrerasDadoFacultad('OAS_Master', codigofacultad);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoCarrerasDadoFacultad', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoDocenteDictadoAsignatura = async function (carrera,cedula) {
    try {

        var Informacion = await sqlmodelogenerales.DocenteDictadoAsignaturas(carrera, funcionesgenerales.CedulaConGuion(cedula));
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoDocenteDictadoAsignatura', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoDictadoAsignaturaPeriodo = async function (carrera,periodo) {
    try {

        var Informacion = await sqlmodelogenerales.DictadoAsignaturasPeriodo(carrera, periodo);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoDictadoAsignaturaPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoVerificarRutasMatriculasAlmacenamiento = async function (carrera, periodo) {
    try {
        var ListadoDocumentos = [];
        var ListadoDocumentosDatos = await sqlmodelogenerales.ListadoDocumentosfirmadosLegalizados(carrera, periodo);
        var DatosCarrera = await sqlmodelomovilidad.ObenterDatosCarrera('OAS_Master', carrera);
        if (ListadoDocumentosDatos.modelo) {
            for (var documentos of ListadoDocumentosDatos.datos.data) {
                if (documentos.ruta == null || documentos.ruta == 'undefined') {
                    var ruta = periodo + '/ActasMatriculas/' + DatosCarrera.data[0].strNombre.replace('.', 'R') + '/' + documentos.iddocumento + '.pdf'
                    var ActualizarRuta = await sqlmodelogenerales.ActualizarDocumentosfirmadosLegalizadosRuta(carrera, periodo, documentos.iddocumento, ruta);
                    ListadoDocumentos.push(documentos)
                }
            }
        }
        return sendResponseProcesos(true, [], 'OK')
    } catch (error) {
        logger.error('Error ProcesoVerificarRutasMatriculasAlmacenamiento', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoEstadisticasMatriculasPeriodo = async function (carrera, periodo) {
    try {

        var Informacion = await sqlmodelogenerales.EstadisticasMatriculasPeriodo(carrera, periodo);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoEstadisticasMatriculasPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoTotalDefinitivaCarrera = async function (periodo) {
    try {
        var ListadoCarreras = await funcionesmodelomovilidadconfiguraciones.ListadosTodasCarrerasAcademica('OAS_Master');
        contadortotalNivelacion=0
        contadortotalGeneral=0
        contadortotalNivel=0
        if (ListadoCarreras.count > 0) {
            for (var carreras of ListadoCarreras.data) {
                let contiene = carreras.strBaseDatos.includes("OAS_Niv");
                var InformacionGeneral = await sqlmodelogenerales.TotalMatriculaDefinitvaCarrera(carreras.strBaseDatos, periodo);
                contadortotalGeneral=contadortotalGeneral+InformacionGeneral.datos.data[0].TotalDEF

                console.log(carreras.strBaseDatos)
                if(contiene==true){
                var Informacion = await sqlmodelogenerales.TotalMatriculaDefinitvaCarrera(carreras.strBaseDatos, periodo);
                contadortotalNivelacion=contadortotalNivelacion+Informacion.datos.data[0].TotalDEF
                }else{
                var Informacion = await sqlmodelogenerales.TotalMatriculaDefinitvaCarrera(carreras.strBaseDatos, periodo);
                contadortotalNivel=contadortotalNivel+Informacion.datos.data[0].TotalDEF_Nivel1

                }
            }
        }
        var resultado={
            contadortotalGeneral:contadortotalGeneral,
            contadortotalNivelacion:contadortotalNivelacion,
            contadortotalNivel:contadortotalNivel,
        }
        console.log(resultado)
          return sendResponseProcesos(true, resultado, 'OK')
      
    } catch (error) {
        logger.error('Error ProcesoTotalDefinitivaCarrera', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoListadoCarrerasMovilidadesPeriodo = async function (periodo) {
    try {

        var Informacion = await sqlmodelogenerales.ListadoCarrerasMovilidadesPeriodo('OAS_Master', periodo);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoCarrerasMovilidadesPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoListadoCarrerasHomologacionesPeriodo = async function (periodo) {
    try {

        var Informacion = await sqlmodelogenerales.ListadoCarrerasHomologacionPeriodo('OAS_Master', periodo);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoCarrerasHomologacionesPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoClonacionCarreraMovilidadPeriodo = async function (periodonuevo,periodoanterior) {
    try {

        var Informacion = await sqlmodelogenerales.ClonarCarrerasMoviliadPeriodo('OAS_Master', periodonuevo,periodoanterior);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoCarrerasHomologacionesPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoClonacionCarreraHomologacionGeneralPeriodo = async function (periodonuevo,periodoanterior) {
    try {

        var Informacion = await sqlmodelogenerales.ClonarCarrerasHomologacionGeneralPeriodo('OAS_Master', periodonuevo,periodoanterior);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ClonarCarrerasHomologacionGeneralPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoIngresoCarrerasMovilidad = async function (listado) {
    console.log(listado)
    try {
         for (var carreras of listado) {
        var VerificacionDatos = await sqlmodelogenerales.ObtenerModilidadCarreraPeriodoBase('OAS_Master', carreras.msca_periodo,carreras.msca_dbcarreraactual,carreras.msca_dbcarreramovilidad,carreras.msca_tipo);
         console.log(VerificacionDatos)
        if(VerificacionDatos.datos.count==0){
                var IngresoDatos = await sqlmodelogenerales.IngresarMoviliadCarrera('OAS_Master', carreras);
            }
         }
      
          return sendResponseProcesos(true, [], 'OK')
    } catch (error) {
        logger.error('Error ProcesoIngresoCarrerasMovilidad', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
    }

    module.exports.ProcesoActualizacionDatosHomologacionesCarreras = async function (objDatos) {
    try {

        var Informacion = await sqlmodelogenerales.ActualizarDatosHomologacionesCarrera('OAS_Master', objDatos);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoActualizacionDatosHomologacionesCarreras', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
