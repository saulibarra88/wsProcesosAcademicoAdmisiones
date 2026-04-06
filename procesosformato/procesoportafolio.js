const express = require('express');
const router = express.Router();
const Request = require("request");
const fs = require("fs");
const pdf = require('html-pdf');
const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");

const sqlportafolio = require('../modeloformato/protafoliomodelo');
const { sendResponseProcesos } = require('../herramientas/responseservice');
const tools= require('../rutas/tools');
const logger = require('./../herramientas/logger');

const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});


module.exports.ProcesoMatriculasTodasEstudianteCarrera= async function (carrera,cedula) {
    try {
       
        var Informacion = await sqlportafolio.EncontrarEstudianteMatriculaTodas(carrera, tools.CedulaConGuion(cedula) );
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoMatriculasTodasEstudianteCarrera', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoEncontrarSolicitudesterceraTodas= async function (carrera,cedula) {
    try {
       
        var Informacion = await sqlportafolio.EncontrarSolicitudesTercerasTodas(carrera, tools.CedulaConGuion(cedula) );
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoEncontrarSolicitudesterceraTodas', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoEncontrarSolicitudesValidacionesTodas= async function (carrera,cedula) {
    try {
       
        var Informacion = await sqlportafolio.EncontrarSolicitudesValidacionTodas(carrera, tools.CedulaConGuion(cedula) );
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoEncontrarSolicitudesValidacionesTodas', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoEncontrarSolicitudesMovilidadesTodas= async function (carrera,cedula) {
    try {
       
        var Informacion = await sqlportafolio.EncontrarSolicitudesMovilidadesTodas(carrera, cedula );
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoEncontrarSolicitudesMovilidadesTodas', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoEncontrarSolicitudesRetirosTodos= async function (carrera,cedula) {
    try {
       
        var Informacion = await sqlportafolio.EncontrarSolicitudesRetirosTodos(carrera, tools.CedulaConGuion(cedula) );
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoEncontrarSolicitudesRetirosTodos', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}