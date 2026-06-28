
const express = require('express');
const router = express.Router();

const fs = require("fs");

const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");
const sqlmoodle = require('../modeloformato/moodlemodelo');
const sqlcupos = require('../modelo/procesocupos');
const logger = require('../herramientas/logger');
const { sendResponseProcesos } = require('../herramientas/responseservice');

const xlsx = require('xlsx');
const tools = require('../rutas/tools');
const ExcelJS = require('exceljs');
const { JSDOM } = require('jsdom');
const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.ProcesoModleCarreraHomologacion = async function (dbcarrera, periodo) {
    try {

        var informacion = await sqlmoodle.ObnterCarreraHomologacion('OAS_Master', dbcarrera, periodo);
        return sendResponseProcesos(true, informacion.datos.data, 'OK')
    } catch (error) {
        logger.error('Error ProcesoModleMigracionDatosDictadoCarrera', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoModleMigracionDatosDictadoCarrera = async function (carrera, periodo) {
    try {

        var resultado = await FuncionProcesoDictadoAsignaturaCarrera(carrera, periodo);
        return sendResponseProcesos(true, resultado, 'OK')
    } catch (error) {
        logger.error('Error ProcesoModleMigracionDatosDictadoCarrera', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoRetirosEstudiantesCarrera = async function (listado) {
    try {

        var resultado = await FuncionProcesoRetirosEstudianteCarrera(listado);
        return sendResponseProcesos(true, resultado, 'OK')
    } catch (error) {
        logger.error('Error FuncionProcesoRetirosEstudianteCarrera', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
async function FuncionProcesoDictadoAsignaturaCarrera(dbcarrera, periodo) {
    try {
        var lstResultado = []
        var lstResultadoGeneral = {}
        var informacion = await sqlmoodle.ListadoDictadoAsignaturaCarrera(dbcarrera, periodo);
        var DatosCarrera = await sqlmoodle.ObternDatosCarreraFacultad('OAS_Master', dbcarrera);
        if (informacion.datos.count > 0) {
            for (var info of informacion.datos.data) {

                var ListadoEstudiante = await sqlmoodle.ListadoEstudianteAsignatura(dbcarrera, periodo, info.strCodNivel, info.strCodParalelo, info.strCodMateria);
                if (ListadoEstudiante.datos.count > 0) {
                    info.lstEstudiantes = ListadoEstudiante.datos.data
                } else {
                    info.lstEstudiantes = []
                }
                lstResultado.push(info)
            }
        }
        lstResultadoGeneral.lstResultado = lstResultado
        lstResultadoGeneral.Carrera = DatosCarrera.datos.data[0]
        return lstResultadoGeneral
    } catch (error) {
        console.error(error);

    }

}

async function FuncionProcesoRetirosEstudianteCarrera(listado) {
    try {
        var lstResultado = []
        var lstResultadoGeneral = {}

        for (var info of listado) {
            var DatosCarrera = await sqlmoodle.ObternDatosCarreraFacultad('OAS_Master', info.dbcarrera);
            var DatosEstudiantes = await sqlmoodle.ObtenerDatosEstudianteCarrera(info.dbcarrera, info.cedula);

            var ListadoEstudianteRetiro = await sqlmoodle.RetiroEstudiantePeriodoCarrera(info.dbcarrera, info.periodo, info.cedula);
            if (ListadoEstudianteRetiro.datos.count > 0) {
                var asignaturas1 = ''
                for (var asignatura of ListadoEstudianteRetiro.datos.data) {
                    asignaturas1 = asignaturas1 + asignatura.strNombre + '(' + asignatura.strCodigo + ')' + '/'
                }
                info.RetiroAsignaturaDescripcion = asignaturas1
                info.RetiroAsignatura = true
            } else {
                info.RetiroAsignaturaDescripcion = '',
                    info.RetiroAsignatura = false

            }
            info.Carrera = DatosCarrera.datos.data[0].nombrecarrera
            info.Estudiante = DatosEstudiantes.datos.data[0].strNombres + ' ' + DatosEstudiantes.datos.data[0].strApellidos
            lstResultado.push(info)
        }

        return lstResultado
    } catch (error) {
        console.error(error);

    }

}