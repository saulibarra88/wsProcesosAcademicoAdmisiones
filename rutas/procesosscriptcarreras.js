const express = require('express');
const router = express.Router();
const Request = require("request");
const fs = require('fs');
const axios = require('axios');
const https = require('https');
const puppeteer = require('puppeteer');
const tools = require('./tools');
const pdf = require('html-pdf');
const procesoAcadeicoNotas = require('../rutas/ProcesoNotasAcademico');
const procesoCupo = require('../modelo/procesocupos');
const Chart = require('chart.js');
const crypto = require("crypto");
const { iniciarDinamicoPool, iniciarDinamicoTransaccion } = require("./../config/execSQLDinamico.helper");const tools = require('./tools');
const fs = require("fs");
const https = require('https');
const crypto = require("crypto");

const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.DocumentosMatriculasPeriosdos = async function (carrera, periodo) {
    try {
        var resultado = await FuncionActivacionBotonCrearPeriodo(carrera,periodo,pensum);
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }
      
    }
}

async function  FuncionActivacionBotonCrearPeriodo(periodo){
    try {
        var resultado = await FuncionListarConfiguracionesActivasPeriodo(carrera,periodo,pensum);
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }
      
    }
}
