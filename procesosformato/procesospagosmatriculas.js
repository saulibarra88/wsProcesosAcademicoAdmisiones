
const express = require('express');
const router = express.Router();

const fs = require("fs");

const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");
const sqlpagosmatriculas = require('../modeloformato/pagosmatriculas');
const sqlprocesoCupo = require('../modelo/procesocupos');

const sqlcupos = require('../modelo/procesocupos');
const logger = require('../herramientas/logger');
const { sendResponseProcesos } = require('../herramientas/responseservice');

const xlsx = require('xlsx');
const tools = require('../rutas/tools');
const ExcelJS = require('exceljs');
const { JSDOM } = require('jsdom');
const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.ProcesosEstudiante60AsignaturasMatricula = async function (codigo, periodo, cedula) {
    try {
        const datosCarrera = await sqlpagosmatriculas.ObtenerMasterDatosCarreraCodigo('OAS_Master', codigo);
        if (datosCarrera.datos.count > 0) {
            var informacion = await sqlpagosmatriculas.ObtenerDatosEstuidante60CreditoAsignaturasMatricula(datosCarrera.datos.data[0].strBaseDatos, periodo, cedula);
            return sendResponseProcesos(true, informacion.datos.data, 'OK')
        } else {
            return sendResponseProcesos(false, [], 'Carrera no encontrada')
        }

    } catch (error) {
        logger.error('Error ProcesoModleMigracionDatosDictadoCarrera', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}





