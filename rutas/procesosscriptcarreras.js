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
const procesoCarrera = require('../modelo/procesocarrera');
const Chart = require('chart.js');
const crypto = require("crypto");
const { iniciarDinamicoPool, iniciarDinamicoTransaccion } = require("./../config/execSQLDinamico.helper");


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

module.exports.ProcesoActualizacionNotasRecuperacion = async function (carrera, periodo) {
    try {
        var resultado = await FuncionCalifacionesRecuperacion();
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


async function FuncionCalifacionesRecuperacion() {
  
    try {
        var ListadoEstudiantes = [];
        var ListadoEstudiantesResultado = [];
     
      //  var ListadoRegistro = await procesoCarrera.SentenciaNotas1("SistemaAcademico"); 
        var ListadoRegistro = await procesoCarrera.ListadoLogRecuperacionTabla("SistemaAcademico"); 

       if (ListadoRegistro.count > 0) {
        for (var informacion of ListadoRegistro.data) {
         /*   console.log(informacion.autdescripcionproceso)
            var formatocalificaciones = await tools.FormatoCalificacionesRecuperacion(informacion.autdescripcionproceso);    
           let f = 0;
            console.log(formatocalificaciones)*/
        // var Actualizacion = await procesoCarrera.ActualizacionCalifacionRecuperacion(formatocalificaciones.database,formatocalificaciones.enrollment,formatocalificaciones.grade,formatocalificaciones.subject); 
       
        if(informacion.nota!=='undefined' || informacion.nota!=='null'|| informacion.nota!=='NaN.00')
            if(informacion.bd!=='OAS_TelecomunicacionesR'){
                var Actualizacion = await procesoCarrera.ActualizacionCalifacionRecuperacion(informacion.bd,informacion.matricula,informacion.nota,informacion.materia); 
            }
        }
        }
        return 'OK';
    } catch (err) {
       
        console.error(err);
        return 'ERROR';
    } 
}
