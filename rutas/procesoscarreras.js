const axios = require('axios');
const cron = require('node-cron');
const pathimage = require('path');
const nomenclatura = require('../config/nomenclatura');
const procesoCupo = require('../modelo/procesocupos');
const procesocarreras = require('../modelo/procesocarrera');
const tools = require('./tools');
const fs = require("fs");
const https = require('https');
const crypto = require("crypto");

const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.DocumentosMatriculasPeriosdos = async function (strBaseCarrera, periodo) {
    try {
        try {
            var ListadoDocumentos = [];
            var ListadoEstudiantesProceso = [];
            var datosDocumentos = await procesocarreras.ObtenerDocumentosMatriculas(strBaseCarrera,periodo);
            var TotalDocumentosPendiente = await procesocarreras.TotalDocumentoPendientes(strBaseCarrera,periodo);
            var TotalDocumentosFirmados = await procesocarreras.TotalDocumentoFirmados(strBaseCarrera,periodo);
            if (datosDocumentos.count > 0) {
            for (var info of datosDocumentos.data) {
            //    var DatosMatricula = await procesocarreras.ObtenerDatosMatriculasActas(strBaseCarrera,periodo,info.idbandeja);
            //    info.matricula=DatosMatricula.data[0]
               if(info.estado==2){
                info.estadodescripcion='PENDIENTE FIRMAR'
                
               }
               if(info.estado==1){
                info.estadodescripcion='PENDIENTE FIRMAR'
               }
               if(info.estado==3){
                info.estadodescripcion='ACTA FIRMADA'
               }
               ListadoDocumentos.push(info)
            }
         var respuesta ={
            TotalPendientes:TotalDocumentosPendiente.count>0? TotalDocumentosPendiente.data[0].total:0,
            TotalFirmados:TotalDocumentosPendiente.count>0?TotalDocumentosFirmados.data[0].total:0,
            Listado:ListadoDocumentos,
         }
         
            }
         
            return respuesta;
        } catch (error) {
            console.error(error);
            return 'ERROR';
        }
    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}