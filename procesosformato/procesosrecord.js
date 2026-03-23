const express = require('express');
const router = express.Router();
const Request = require("request");
const fs = require("fs");
const pdf = require('html-pdf');
const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");

const sqlmodelorecord = require('../modeloformato/recordmodelo');
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


module.exports.ProcesoListadoRecordEstadoPeriodo = async function (carrera, periodo, estado) {
    try {
        var listadoInformacion = []
        var Informacion = await sqlmodelorecord.ListadoSolicitudesRecordEstadoPeriodo(carrera, periodo, estado);
        if (Informacion.modelo) {
            for (let datos of Informacion.datos.data) {
                var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + tools.CedulaSinGuion(datos.strCedulaEstudiante), { httpsAgent: agent });
                var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
                datos.per_email = ObtenerPersona.data.listado[0].per_email;
                datos.per_emailAlternativo = ObtenerPersona.data.listado[0].per_emailAlternativo
                datos.per_telefonoCelular = ObtenerPersona.data.listado[0].per_telefonoCelular
                datos.nombreestudiante = strNombres
                datos.nombreestado = datos.intEstado == 1 ? 'FIRMADO' : 'POR FIRMAR'
                listadoInformacion.push(datos)
            }
            return sendResponseProcesos(true, listadoInformacion, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoRecordEstadoPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }

}

module.exports.ProcesoListadoRecordCedula = async function (carrera, cedula) {
    try {
        var listadoInformacion = []
        var Informacion = await sqlmodelorecord.ListadoSolicitudesRecordCedula(carrera, tools.CedulaConGuion(cedula));
        if (Informacion.modelo) {
            for (let datos of Informacion.datos.data) {
                var PeriodoVigenteDatos = await sqlmodelocupos.ObtenerPeriodoDadoCodigo(datos.strCodPeriodo)
                var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + tools.CedulaSinGuion(datos.strCedulaEstudiante), { httpsAgent: agent });
                var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
                datos.per_email = ObtenerPersona.data.listado[0].per_email;
                datos.per_emailAlternativo = ObtenerPersona.data.listado[0].per_emailAlternativo
                datos.per_telefonoCelular = ObtenerPersona.data.listado[0].per_telefonoCelular
                datos.nombreestudiante = strNombres
                datos.nombreestado = datos.intEstado == 1 ? 'FIRMADO' : 'POR FIRMAR'
                datos.periodoacademico = PeriodoVigenteDatos.data[0].strDescripcion
                listadoInformacion.push(datos)
            }
            return sendResponseProcesos(true, listadoInformacion, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoRecordCedula', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }

}