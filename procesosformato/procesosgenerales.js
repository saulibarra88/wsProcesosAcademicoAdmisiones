const express = require('express');
const router = express.Router();
const Request = require("request");
const fs = require("fs");
const pdf = require('html-pdf');
const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");

const sqlmodelogenerales = require('../modeloformato/generalesmodelo');
const sqlmodelomovilidad = require('../modelo/modelomovilidad');
const { sendResponseProcesos } = require('../herramientas/responseservice');
const logger = require('./../herramientas/logger');

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

module.exports.ProcesoVerificarRutasMatriculasAlmacenamiento = async function (carrera, periodo) {
    try {
        var ListadoDocumentos = [];
        var ListadoDocumentosDatos = await sqlmodelogenerales.ListadoDocumentosfirmadosLegalizados(carrera, periodo);
        var DatosCarrera = await sqlmodelomovilidad.ObenterDatosCarrera('OAS_Master', carrera);
        if (ListadoDocumentosDatos.modelo) {
            for (var documentos of ListadoDocumentosDatos.datos.data) {
                if (documentos.ruta == null ||documentos.ruta == 'undefined') {
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