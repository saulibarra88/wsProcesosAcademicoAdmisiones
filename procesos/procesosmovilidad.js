
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
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const { JSDOM } = require('jsdom');
const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.ProcesoCarrerasDadoFacultadHomologacion = async function (PeriodoDatos,codfacultad) {
    try {
        var resultado = await funcionesmodelomovilidad.CarrerasDadoFacultadHomologacion('OAS_Master',PeriodoDatos,codfacultad);
        return resultado
    } catch (error) {
        console.log(error);
    }
}

module.exports.ProcesoDatosEstudianteCambioCarrera = async function (carrera,codestudiante,nivel) {
    try {
        var resultado = await FuncionDatosEstudianteCambioCarrera(carrera,codestudiante,nivel);
        return resultado
    } catch (error) {
        console.log(error);
    }
}

async function  FuncionDatosEstudianteCambioCarrera(carrera,codestudiante,nivel){
    try {
        var respuesta={};
        var AprobacionNivel = await funcionesmodelomovilidad.ObtenerMateriasAprobadasPorNivelPensum(carrera,codestudiante,nivel); 
       console.log(AprobacionNivel)
        if(AprobacionNivel.count>0){
        respuesta.nivel=nivel;
        respuesta.codestudiante=codestudiante;
        respuesta.pensummaterias=AprobacionNivel.data[0].materiaspensum;
        respuesta.aprobadas=AprobacionNivel.data[0].aprobadas;
        respuesta.noaprobadas=AprobacionNivel.data[0].no_aprobadas;
        if(AprobacionNivel.data[0].materiaspensum==AprobacionNivel.data[0].aprobadas){
            respuesta.aprobacionnivel=true;
        }else{
            respuesta.aprobacionnivel=false;
        }
        
        }
         var PerdidaSegundaMatricula = await funcionesmodelomovilidad.ObtenerMateriasPerdidasSegundaMatriculaCantidad(carrera,codestudiante); 
       
        if(PerdidaSegundaMatricula.count>0){
              if(PerdidaSegundaMatricula.data[0].materiasegundamat==PerdidaSegundaMatricula.data[0].aprobadas){
            respuesta.perdidasegunda=false;
        }else{
            respuesta.perdidasegunda=true;
             var PerdidaSegundaMatriculaDetalle = await funcionesmodelomovilidad.ObtenerMateriasPerdidasSegundaMatriculaDetalle(carrera,codestudiante); 
            respuesta.detallePerdida=PerdidaSegundaMatriculaDetalle.data
        }
        }
       
        return  respuesta ;

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }
      
    }
}