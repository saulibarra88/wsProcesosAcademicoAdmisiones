const express = require('express');
const router = express.Router();

const fs = require("fs");

const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");

const sqlmodelocentralizada = require('../modelo/centralizada');
const sqlmodelomovilidad = require('../modelo/modelomovilidad');
const sqlmodelocupos = require('../modelo/procesocupos');

const tools = require('../rutas/tools');
const { sendResponseProcesos } = require('../herramientas/responseservice');
const logger = require('./../herramientas/logger');

const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});


module.exports.ProcesoActualizacionDatosPersonaCentral = async function (datos) {
    try {
        var resultado = await sqlmodelocentralizada.ActualizarDatosPersonaCentral(datos);
        var resultado2 = await sqlmodelocentralizada.ActualizarDatosPersonaCentralDireccion(datos);
        return resultado
    } catch (error) {
        console.error(error);
        
            return 'ERROR';
    }
}