
const express = require('express');
const router = express.Router();

const fs = require("fs");

const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");
const sqlmoodle = require('../modeloformato/moodlemodelo');
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



module.exports.ProcesoModleMigracionDatosDictadoCarrera = async function (carrera, periodo) {
    try {

        var resultado = await FuncionProcesoDictadoAsignaturaCarrera(carrera, periodo);
        return sendResponseProcesos(true, resultado, 'OK')
    } catch (error) {
        logger.error('Error ProcesoModleMigracionDatosDictadoCarrera', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}


async function FuncionProcesoDictadoAsignaturaCarrera(dbcarrera, periodo) {
    try {
        var lstResultado = []
        var informacion = await sqlmoodle.ListadoDictadoAsignaturaCarrera(dbcarrera, periodo);
        if (informacion.datos.count > 0) {
            for (var info of informacion.datos.data) {
                var ListadoEstudiante = await sqlmoodle.ListadoEstudianteAsignatura(dbcarrera, periodo, info.strCodNivel, info.strCodParalelo);
                if (ListadoEstudiante.datos.count > 0) {
                    info.lstEstudiantes = ListadoEstudiante.datos.data
                } else {
                    info.lstEstudiantes = []
                }
                lstResultado.push(info)
            }
        }

        return lstResultado
    } catch (error) {
        console.error(error);

    }

}