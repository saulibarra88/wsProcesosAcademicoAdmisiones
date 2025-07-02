
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
          return 'ERROR: ' +err;
    }
}
module.exports.ProcesoListadoFacultadesActivas = async function () {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ListadoFacultadesActivas('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
          return 'ERROR: ' +err;
    }
}

module.exports.ProcesoListadoEscuelaAdministracion = async function (facultad) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ListadoEscuelaAdministracion('OAS_Master', facultad);
        return resultado
    } catch (error) {
        console.log(error);
          return 'ERROR: ' +err;
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
        return 'ERROR: ' +err;
    }
}