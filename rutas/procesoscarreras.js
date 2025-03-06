const axios = require('axios');
const cron = require('node-cron');
const pathimage = require('path');
const nomenclatura = require('../config/nomenclatura');
const procesoCupo = require('../modelo/procesocupos');
const procesocarreras = require('../modelo/procesocarrera');
const procesoadministrativo = require('../modelo/procesoadministrativo');
const procesoacademiconotas= require('../rutas/ProcesoNotasAcademico');
const reportescarreras = require('../rutas/reportesCarreras');
const { iniciarDinamicoPool, iniciarDinamicoTransaccion } = require("./../config/execSQLDinamico.helper");
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
module.exports.pdfPerdidaAsignaturasEstudiantes = async function ( carrera,periodo,cedula) {
    try {
        
            var ListadoDocumentos = [];
            var ListadoEstudiantesProceso = [];

            var ListadoAsignaturas = await procesocarreras.AsignaturasDictadosMateriasCarreras(carrera,periodo);
            if(ListadoAsignaturas.count>0){
                for (var asignaturas of ListadoAsignaturas.data) {

                    var datos = await procesocarreras.CalculosEstuidantesPorAsignaturas(carrera,periodo,asignaturas.strCodMateria);
                    var resultado={
                        strCodMateria:asignaturas.strCodMateria,
                        strCodNivel:asignaturas.strCodNivel,
                        strNombre:asignaturas.strNombre,
                        ApruebanDirecto:datos.data[0].ApruebanDirecto==null?0:datos.data[0].ApruebanDirecto,
                        ApruebanExamen:datos.data[0].ApruebanExamen==null?0:datos.data[0].ApruebanExamen,
                        RepruebaDirecta:datos.data[0].RepruebaDirecta==null?0:datos.data[0].RepruebaDirecta,
                        RepruebanExamen:datos.data[0].RepruebanExamen==null?0:datos.data[0].RepruebanExamen,
                        totalAprobados:Number(datos.data[0].ApruebanDirecto==null?0:datos.data[0].ApruebanDirecto)+Number(datos.data[0].ApruebanExamen==null?0:datos.data[0].ApruebanExamen),
                        totalReprobados:Number(datos.data[0].RepruebaDirecta==null?0:datos.data[0].RepruebaDirecta)+Number(datos.data[0].RepruebanExamen==null?0:datos.data[0].RepruebanExamen),
                        total:datos.data[0].total==null?0:datos.data[0].total
                    }
                    ListadoDocumentos.push(resultado)
                }
            }
            var base64=  await  reportescarreras.PdfListadoEstudiantesAsignaturaAprueban(ListadoDocumentos,carrera,cedula,periodo)
         
    return ListadoDocumentos

    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}

module.exports.ProcesoListadoPensumCarreras = async function ( carrera) {
    try {
            var ListadoDocumentos = [];
            var ListadoPensum = await procesocarreras.ListadoPensumCarrera(carrera);
            if(ListadoPensum.count>0){
                        
                ListadoDocumentos= ListadoPensum.data
            }else{
                ListadoDocumentos=[]
            }

            return ListadoDocumentos
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}
module.exports.ProcesoListadoPensumMateriasarreras = async function ( carrera,pensum) {
    try {
            var ListadoDocumentos = [];
            var ListadoPensum = await procesocarreras.ListadoMateriasPensumCarrera(carrera,pensum);
            if(ListadoPensum.count>0){
                        
                ListadoDocumentos= ListadoPensum.data
            }else{
                ListadoDocumentos=[]
            }

            return ListadoDocumentos
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}
module.exports.ProcesoListadoEstuidantesApellidosMaters = async function (apellidos) {
    try {
            var ListadoDocumentos = [];
            var ListadoApellidos = await procesoadministrativo.ObtenerDatosEstudianteApellidos("OAS_Master",apellidos);
            if(ListadoApellidos.count>0){
                        
                ListadoDocumentos= ListadoApellidos.data
            }else{
                ListadoDocumentos=[]
            }

            return ListadoDocumentos
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}

module.exports.ListadoActasFinCicloNoGenerada= async function (carrera,periodo) {
    try {
            var ListadoDocumentos = [];
            var ListadoActas = await procesocarreras.ListadoDocenteActasNoGeneradas(carrera,2,periodo);
            if(ListadoActas.count>0){
                        
                ListadoDocumentos= ListadoActas.data
            }else{
                ListadoDocumentos=[]
            }

            return ListadoDocumentos
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}

module.exports.ReporteExcelActasNoGenradas= async function (carrera,periodo) {
    try {
            var ListadoDocumentos = [];
            var ListadoActas = await procesocarreras.ListadoDocenteActasNoGeneradas(carrera,2,periodo);
            var ListadoActasRecuperacion = await ObtenerListadoActasRecuperacionNoGeneradas(carrera,periodo);
            if(ListadoActas.count>0){
                for (var elementos1 of ListadoActas.data) {
                    ListadoDocumentos.push(elementos1)
                }
                for (var elementos of ListadoActasRecuperacion) {
                    ListadoDocumentos.push(elementos)
                }
                var ReporteActaExcel = await reportescarreras.ExcelListadoActasNoGeneradasCarreras(carrera,periodo,ListadoDocumentos );    
               return ReporteActaExcel
            }else{
                ListadoDocumentos=[]
            }

            return ListadoDocumentos
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}
module.exports.ProcesoActivacionBotonCreacionPerioodo = async function ( carrera,periodo,pensum) {
    try {
            var resultado = await FuncionActivacionBotonCreacionPeriodo(carrera,periodo,pensum);

            return resultado
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}
async function ObtenerListadoActasRecuperacionNoGeneradas(carrera,periodo) {
 
    try {
        var listadoNomina = [];
        var ListadoDictadoMateriasCarrera = await procesocarreras.ListadoDictadoMateriasCarrera(carrera, periodo);
        var ListadoActasGeneradasRecuperacion = await procesocarreras.ListadoActasGeneradasTipo( carrera, periodo,3);
        if (ListadoDictadoMateriasCarrera.count > 0) {
            for (var materia of ListadoDictadoMateriasCarrera.data) {
                var DatosRecuperacion = await procesocarreras.ListadoEstudiantesRecuperacionAsignaturas( carrera, periodo,materia.strCodNivel,materia.strCodParalelo,materia.strCodMateria);
                if (DatosRecuperacion.count > 0) {
                    var blverificaracta=false;
                    for (var actas of ListadoActasGeneradasRecuperacion.data) 
                        {
                            if (actas.strCodMateria== materia.strCodMateria && actas.strCodParalelo== materia.strCodParalelo && actas.strCodNivel== materia.strCodNivel && actas.strCodDocente== materia.strCodDocente) {
                                blverificaracta=true 
                            }
                        }
                        if(!blverificaracta){
                            var elemento ={
                                "strdescripcionacta": "ACTA DE RECUPERACION",
                                "strCedula": materia.strCedula,
                                "strApellidos": materia.strApellidos,
                                "strNombres": materia.strNombres,
                                "strTel":  materia.strTel,
                                "strNombre": materia.strNombre,
                                "strCodNivel": materia.strCodNivel,
                                "strCodParalelo": materia.strCodParalelo,
                                "strCodPeriodo":periodo
                            }
                            listadoNomina.push(elemento)
                        }
                 
                }
            }
            return listadoNomina;
        }
    } catch (err) {
      
        console.error(err);
        return 'ERROR';
    }
}

async function FuncionActivacionBotonCreacionPeriodo(carrera,periodo,pemsum) {
 
    try {
        var listadoNomina = [];
        var VerificacionPeriodo = await procesocarreras.VerificacionPeriodoActivo(carrera, periodo);
        console.log(VerificacionPeriodo)
        var VerificacionPensum = await procesocarreras.VerificacionPensumActivo( carrera, pemsum);
        console.log(VerificacionPensum)
        if (VerificacionPeriodo.count > 0 && VerificacionPensum.count > 0) {
            return { blbotonActivacion: true, mensaje: "Activacion de Boton" }
            }else{
                return { blbotonActivacion: false, mensaje: "No Activacion de Boton" }
            }
          
        
    } catch (err) {
      
        console.error(err);
        return 'ERROR';
    }
}
