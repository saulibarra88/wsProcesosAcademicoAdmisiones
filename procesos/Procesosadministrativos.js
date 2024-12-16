const axios = require('axios');
const cron = require('node-cron');
const pathimage = require('path');
const nomenclatura = require('../config/nomenclatura');
const VariablesGlobales = require('../rutas/VariablesGlobales');
const tools = require('../rutas/tools');
const modeloNivelacion = require('../modelo/procesonivelacion');
const procesoCupo = require('../modelo/procesocupos');
const modeloadministrativo = require('../modelo/procesoadministrativo');
const fs = require("fs");
const https = require('https');




module.exports.ListarConfiguracionesActivasPeriodo = async function (periodo) {
    try {
        var resultado = await FuncionListarConfiguracionesActivasPeriodo(periodo);//Buscar estudiantes matriculasdos definitivos para insertar el cupo
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }
      
    }
}
module.exports.ListarConfiguracionesHomoCarrerasHistoral = async function (bdcarrera) {
    try {
        var resultado = await FuncionListarConfiguracionesHomoCarrerasHistoral(bdcarrera);//Buscar estudiantes matriculasdos definitivos para insertar el cupo
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }
      
    }
}
module.exports.ProcesoObtenerCarreraVigenteHomologacion = async function (bdcarrera,periodo) {
    try {
        var resultado = await FuncionoObtenerCarreraVigenteHomologacion(bdcarrera,periodo);//Buscar estudiantes matriculasdos definitivos para insertar el cupo
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }
      
    }
}
module.exports.InsertarHomologacionFechas = async function (CarrerasListado,datos) {
    try {
        var resultado = await FuncionIngresarHomologacionesFechas(CarrerasListado,datos);//Buscar estudiantes matriculasdos definitivos para insertar el cupo
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }
      
    }
}
async function FuncionListarConfiguracionesActivasPeriodo(periodo) {
    try {
        
            var ListadoEstudiantes = [];
            var ListadoInformacion = await modeloadministrativo.ListarConfigHomologacionesFecha("SistemaAcademico",periodo);
            return ListadoInformacion.data;
        } catch (err) {
            console.error(err);
            return 'ERROR';
        }
}
async function FuncionIngresarHomologacionesFechas(CarrerasListado,datos) {
    try {
        
          
            if(CarrerasListado.length>0){
                for (var carrera of CarrerasListado) {
                    var homologacion={
                        chf_fechainicio:datos.chf_fechainicio,
                        chf_horainicio:datos.chf_horainicio,
                        chf_fechafin:datos.chf_fechafin,
                        chf_horafin:datos.chf_horafin,
                        chf_periodo:datos.chf_periodo,
                        chf_proceso:datos.chf_proceso,
                        chf_ruta:datos.chf_ruta,
                        chf_bdcarrera:carrera.chf_bdcarrera,
                        chf_codigocarrera:carrera.chf_codigocarrera,
                        chf_carrera:carrera.chf_carrera,
                        chf_peridregistro:datos.chf_peridregistro,
                        chf_regid:datos.chf_regid,
                        chf_resolucion:datos.chf_resolucion,
                    }
                   

                    var ObtenerDatosHomologacion = await modeloadministrativo.ActualizarEstadoHomologacionFechas("SistemaAcademico",carrera.chf_bdcarrera,0,datos.chf_periodo);
                    var IngresoHomologacion = await modeloadministrativo.InsertarHomologacionesFechas("SistemaAcademico",homologacion);
                }
            }
           
            return 'OK';
        } catch (err) {
            console.error(err);
            return 'ERROR';
        }
}
async function FuncionListarConfiguracionesHomoCarrerasHistoral(bdcarrera) {
    try {
        
            var ListadoEstudiantes = [];
            var ListadoInformacion = await modeloadministrativo.ListarConfigHomologacionesCarrerasHistorial("SistemaAcademico",bdcarrera);
            return ListadoInformacion.data;
        } catch (err) {
            console.error(err);
            return 'ERROR';
        }
}
async function FuncionoObtenerCarreraVigenteHomologacion(bdcarrera,periodo) {
    try {
            var Datos = await modeloadministrativo.ObtenerCarreraHomologacionVigente("SistemaAcademico",bdcarrera,periodo);
            if(Datos.count>0){
                var fecha=Datos.data[0].chf_fechafin+ ' '+Datos.data[0].chf_horafin;
                console.log(fecha)
                if(tools.EsVigente(fecha)){
                    return {dato:Datos.data[0],vigencia:true};
                }else{
                    return {dato:Datos.data[0],vigencia:false};
                }
            }else{
                return {dato:null,vigencia:false};
            }
          
        } catch (err) {
            console.error(err);
            return 'ERROR';
        }
}
