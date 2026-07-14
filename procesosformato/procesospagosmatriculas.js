
const express = require('express');
const router = express.Router();

const fs = require("fs");

const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");
const sqlpagosmatriculas = require('../modeloformato/pagosmatriculasmodelo');
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
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.ProcesosEstudiante60AsignaturasMatricula = async function (codigo, periodo, cedula) {
    try {
        const datosCarrera = await sqlpagosmatriculas.ObtenerMasterDatosCarreraCodigo('OAS_Master', codigo);
        console.log(datosCarrera.datos.data[0].strBaseDatos)
        if (datosCarrera.datos.count > 0) {
            var informacion = await sqlpagosmatriculas.ObtenerDatosEstuidante60CreditoAsignaturasMatricula(datosCarrera.datos.data[0].strBaseDatos,codigo, periodo, cedula);
            return sendResponseProcesos(true, informacion.datos.data, 'OK')
        } else {
            return sendResponseProcesos(false, [], 'Carrera no encontrada')
        }

    } catch (error) {
        logger.error('Error ProcesosEstudiante60AsignaturasMatricula', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesosDatosMatriculaPago = async function (codigo, periodo, cedula) {
    try {
        const Proceso = await FuncionProcesoDatosMatriculaPago(codigo, periodo, cedula);
      return sendResponseProcesos(true, Proceso.datos, 'OK')

    } catch (error) {
        logger.error('Error ProcesosDatosMatriculaPago', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

async function FuncionProcesoDatosMatriculaPago(codigo, periodo, cedula) {
    try {
        var InformacionMatricula = []
        var lstResultadoGeneral = {}
         const datosCarrera = await sqlpagosmatriculas.ObtenerMasterDatosCarreraCodigo('OAS_Master', codigo);
          if (datosCarrera.datos.count > 0) {
            var informacionMatricula = await sqlpagosmatriculas.ObtenerDatosMatriculaEstudiantePago(datosCarrera.datos.data[0].strBaseDatos, periodo, cedula);
            var informacionColegio = await sqlpagosmatriculas.ObtenerDatosColegioEstudiante('OAS_Master',cedula);
            InformacionMatricula.push(informacionMatricula.datos.data)
            InformacionMatricula.push(informacionColegio.datos.data[0])
             return sendResponseProcesos(true, InformacionMatricula, 'OK')
        } else {
            return sendResponseProcesos(false, [], 'Carrera no encontrada')
        }
        return lstResultadoGeneral
    } catch (error) {
        console.error(error);

    }

}





