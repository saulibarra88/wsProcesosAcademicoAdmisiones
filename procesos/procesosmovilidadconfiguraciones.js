
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
    }
}
module.exports.ProcesoListadoFacultadesActivas = async function () {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ListadoFacultadesActivas('OAS_Master');
        return resultado
    } catch (error) {
        console.log(error);
    }
}

module.exports.ProcesoListadoEscuelaAdministracion = async function (facultad) {
    try {
        var resultado = await funcionesmodelomovilidadconfiguraciones.ListadoEscuelaAdministracion('OAS_Master',facultad);
        return resultado
    } catch (error) {
        console.log(error);
    }
}