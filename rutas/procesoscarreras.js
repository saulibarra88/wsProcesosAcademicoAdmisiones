const axios = require('axios');
const cron = require('node-cron');
const pathimage = require('path');
const nomenclatura = require('../config/nomenclatura');
const procesoCupo = require('../modelo/procesocupos');
const procesocarreras = require('../modelo/procesocarrera');
const reportescarreras = require('../rutas/reportesCarreras');
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
      
    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}
module.exports.RevisionDocumentosInvenientesCarreras = async function ( periodo) {
    try {
        
            var ListadoDocumentos = [];
            var ListadoEstudiantesProceso = [];
            var ListadoCarreras = await procesoCupo.ListadoCarreraTodasSinTransaccion('OAS_Master');
            for (var carreras of ListadoCarreras.data) {
                if(carreras.estadoCarrera=='ABI'){
                    var Informacion = await axios.get("https://apisai.espoch.edu.ec/rutaMatricula/getactasnogeneradas/"+ carreras.strBaseDatos+'/'+periodo, { httpsAgent: agent });
                       if(Informacion.data.success){
                         if(Informacion.data.listado){
                         var respuesta={
                             Carrera:carreras.strNombreCarrera,
                             BaseDatos:carreras.strBaseDatos,
                             Cantidad :Informacion.data.listado.length
                         }
                         ListadoDocumentos.push(respuesta)
                         }
                       }
                }
            }
            return ListadoDocumentos;
     
    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}

module.exports.pdfCarerasDocumentosMatriculas = async function ( periodo,cedula) {
    try {
        
            var ListadoDocumentos = [];
            var ListadoEstudiantesProceso = [];
            var ListadoCarreras = await procesoCupo.ListadoCarreraTodasSinTransaccion('OAS_Master');
            for (var carreras of ListadoCarreras.data) {
            
                if(carreras.estadoCarrera=='ABI' && carreras.strCodTipoCarrera=='CAR'){
                    var TotalDocumentosPendiente = await procesocarreras.TotalDocumentoPendientes(carreras.strBaseDatos,periodo);
                    var TotalDocumentosFirmados = await procesocarreras.TotalDocumentoFirmados(carreras.strBaseDatos,periodo);
                    var Matriuclas = await procesocarreras.MatriculasCarrerasPeriodo(carreras.strBaseDatos,periodo);
                    if(Matriuclas.count>0){
                        var respuesta={
                            Carrera:  carreras.strBaseDatos.includes("OAS_Niv")? "NIVELACION "+ carreras.strNombreCarrera:carreras.strNombreCarrera,
                            BaseDatos:  carreras.strBaseDatos,
                            CantidadPendientes :TotalDocumentosPendiente.count>0? TotalDocumentosPendiente.data[0].total:0,
                            CantidadFirmadas :TotalDocumentosFirmados.count>0? TotalDocumentosFirmados.data[0].total:0
                        }
                        ListadoDocumentos.push(respuesta)
                    }     
                }
            }

       var base64=  await  reportescarreras.PdfListadoDocumentosCarreras(tools.ordenarPorCarrera(ListadoDocumentos),cedula,periodo)
            return base64;
     
    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}

module.exports.pdfListadoEstudianteTerceraSegundaMatricula = async function ( carrera,periodo,cedula,tipo) {
    try {
        
            var ListadoDocumentos = [];
            var ListadoEstudiantesProceso = [];
            if(tipo==3){
                var ListadoDocumentos = await procesocarreras.ListadoEstudianteTerceraMatriculas(carrera,periodo);
                var base64=  await  reportescarreras.PdfListadoEstudianteMatriculasTerceraySegunda(ListadoDocumentos.data,carrera,cedula,periodo,tipo)
            return base64;
            }
            if(tipo==2){
                var ListadoDocumentos = await procesocarreras.ListadoEstudianteSegundaMatriculas(carrera,periodo);
                var base64=  await  reportescarreras.PdfListadoEstudianteMatriculasTerceraySegunda(ListadoDocumentos.data,carrera,cedula,periodo,tipo)
                return base64;
            }
            if(tipo==4){

                var MatriculasCareras = await procesocarreras.MatriculasCarrerasPeriodoTodas(carrera,periodo);
           
                if(MatriculasCareras.count>0){
                    for (var matriculas of MatriculasCareras.data) {
                        var CantidadNumerosMatriculas = await procesocarreras.TotalNumerosMatriculasPorEstudiantes(carrera,periodo,matriculas.sintCodigo);
                
                        var resultado={
                            sintCodigo:matriculas.sintCodigo,
                            strCodPeriodo:matriculas.strCodPeriodo,
                            strCodEstud:matriculas.strCodEstud,
                            strCodNivel:matriculas.strCodNivel,
                            strCodEstado:matriculas.strCodNivel,
                            strApellidos:CantidadNumerosMatriculas.data[0].strApellidos,
                            strCedula:CantidadNumerosMatriculas.data[0].strCedula,
                            strNombres:CantidadNumerosMatriculas.data[0].strNombres,
                            cantidadprimera:CantidadNumerosMatriculas.data[0].MateriasPrimeraMatricula,
                            cantidadsegunda:CantidadNumerosMatriculas.data[0].MateriasSegundaMatricula,
                            cantidadtercera:CantidadNumerosMatriculas.data[0].MateriasTerceraMatricula,
                            cantidadtotal:CantidadNumerosMatriculas.data[0].MateriasTotalMatricula,
                        }
                        ListadoDocumentos.push(resultado)
                    }
                    var base64=  await  reportescarreras.PdfListadoEstudianteMatriculasTerceraySegundaGeneral(tools.ordenarPorApellidos(ListadoDocumentos) ,carrera,cedula,periodo)
                    return base64;
                }
                   
               
            }
         
    

      
     
    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}


