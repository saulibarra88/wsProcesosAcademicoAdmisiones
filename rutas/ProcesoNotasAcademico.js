const axios = require('axios');
const cron = require('node-cron');
const pathimage = require('path');
const nomenclatura = require('../config/nomenclatura');
const procesoCupo = require('../modelo/procesocupos');
const procesonotasacademicos = require('../modelo/procesonotasacademicos');
const tools = require('./tools');
const fs = require("fs");
const https = require('https');


module.exports.ProcesoAcademicoCalificaciones = async function  () {
    try {
 
  // var resultado=   await ActualizarNotaExonerados("P0040","ABI");//Numero de periodos a restas , estado de carrera
   var resultado=   await ActualizarActasParcialesCambiosFechas("P0040",2);//Numero de periodos a restas , tipo de acta a actualizar
    } catch (error) {
        console.log(error);
    }
}

async function ActualizarNotaExonerados(periodo,estado) {
    console.log("***********PROCESO INICIALIZADO ACTUALIZACION NOTA EXONERADOS**********")
    try {
          try {
            var listadoCarreras=[];
            var listadoCarreras = await procesonotasacademicos.ObtenerCarrerasMater("OAS_Master",estado);
            if(listadoCarreras.data.length>0){
                for (var obj of listadoCarreras.data) {
                    var ActualizarInformacion = await procesonotasacademicos.ActualizarNotaExonerados(obj.strBaseDatos,periodo);
                }
            }else{
                console.log("No exite carreras Activas")
            }
            console.log("***********PROCESO FINALIZADO ACTUALIZACION NOTA EXONERADOS**********")
          return listadoCarreras;
          } catch (error) {
            console.error(error);
            return 'ERROR';
          }
    } catch (err) {
        console.error(err);
        return 'ERROR';
    }
}

async function ActualizarActasParcialesCambiosFechas(periodo,tipo) {
    console.log("***********PROCESO INICIALIZADO ACTUALIZACION ACTAS FECHAS ACTUALIZADAS**********")
    try {
          try {
            var listadoCarreras=[];
            var listadoCarreras = await procesonotasacademicos.ObtenerCarrerasMater("OAS_Master","ABI");
            if(listadoCarreras.data.length>0){
                for (var obj of listadoCarreras.data) {
                    var ActualizarInformacion = await procesonotasacademicos.ActualizarActasGeneradasAutomaticamenteFechas(obj.strBaseDatos,periodo,tipo);
                }
            }else{
                console.log("No exite carreras Activas")
            }
            console.log("***********PROCESO FINALIZADO ACTUALIZACION ACTAS FECHAS ACTUALIZADAS**********")
          return listadoCarreras;
          } catch (error) {
            console.error(error);
            return 'ERROR';
          }
    } catch (err) {
        console.error(err);
        return 'ERROR';
    }
}