
const express = require('express');
const router = express.Router();
const Request = require("request");
const fs = require("fs");
const pdf = require('html-pdf');
const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");
const procesoCupo = require('../modelo/procesocupos');
const procesocarreras = require('../modelo/procesocarrera');
const procesoacademico = require('../rutas/ProcesoNotasAcademico');
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const { JSDOM } = require('jsdom');
const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.ProcesoRegistroRetiroSinmatricula = async function (datos) {
    try {
        var resultado = await FuncionRegistroRetiroSinmatricula(datos);
        return resultado
    } catch (error) {
        console.log(error);
    }
}

async function FuncionRegistroRetiroSinmatricula(datos) {
    try {
        var lstResultado = []
        var obtenerRetirosinMatriculaEstudiante = await procesocarreras.ObternerDatosRetirosinMatricula(datos.str_carrera,datos.rsm_strCodEstud);
        if(obtenerRetirosinMatriculaEstudiante.count==0){
            var IngresoEstudiante = await procesocarreras.IngresarRetiroSinMatricula(datos.str_carrera,datos);
        }else{
            return { blProceso: true, blRetiro: false, mensaje: "Ya existe un retiro sin matricula del Estudiante con codigo : "+datos.rsm_strCodEstud}
        }
      
        return lstResultado
    } catch (error) {
        console.log(error);
    }

}