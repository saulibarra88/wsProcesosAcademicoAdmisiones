
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
const tools = require('../rutas/tools');
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
module.exports.ProcesoVerificarEstudianteGraduado = async function (cedula) {
    try {
        var DatosGradoMaster = await procesocarreras.VerificacionGradoMaster("OAS_Master", tools.CedulaConGuion(cedula));
        if (DatosGradoMaster.count > 0) {
            var InscripcionesTodasMaster = await procesocarreras.InscripcionesTodasMaster("OAS_Master", tools.CedulaConGuion(cedula));
            if (InscripcionesTodasMaster.count > 0) {
                for (var info of InscripcionesTodasMaster.data) {
                    var DatosGradoCarrera = await procesocarreras.ObtenerDatosGraduadoCarrera(info.strBaseDatos, tools.CedulaConGuion(cedula));
                    if (DatosGradoCarrera.count > 0) {
                        info.DatosGraduado = DatosGradoCarrera.data[0]
                        info.graduado = true;
                        info.egresado = true;
                        return info
                    }
                    return { graduado: false, egresado: false }
                }
            }
        }else{
            return { graduado: false, egresado: false }
        }

    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}
async function FuncionRegistroRetiroSinmatricula(datos) {
    try {
        var lstResultado = []
        var obtenerRetirosinMatriculaEstudiante = await procesocarreras.ObternerDatosRetirosinMatricula(datos.str_carrera, datos.rsm_strCodEstud);
        if (obtenerRetirosinMatriculaEstudiante.count == 0) {
            var IngresoEstudiante = await procesocarreras.IngresarRetiroSinMatricula(datos.str_carrera, datos);
        } else {
            return { blProceso: true, blRetiro: false, mensaje: "Ya existe un retiro sin matricula del Estudiante con codigo : " + datos.rsm_strCodEstud }
        }

        return lstResultado
    } catch (error) {
        console.log(error);
    }

}