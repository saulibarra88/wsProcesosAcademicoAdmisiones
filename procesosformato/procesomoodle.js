
const express = require('express');
const router = express.Router();

const fs = require("fs");

const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");
const sqlmoodle = require('../modeloformato/moodlemodelo');
const sqlcupos = require('../modelo/procesocupos');
const modeloreconocimiento = require('../modelo/modeloreconocimiento');
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

module.exports.ProcesoMigrarReconocimientosExcel = async function (iduser) {
    const { execMaster } = require('../config/execSQLMaster.helper');
    try {
        const filePath = 'D:\\Respaldo Saul\\Documentos\\FORMATO_INGRRESO_RECONOCIMIENTO_MIGRADO.xlsx';
        if (!fs.existsSync(filePath)) {
            return sendResponseProcesos(false, [], 'El archivo excel migrado no existe en la ruta.');
        }

        // 1. Leer el archivo Excel
        const workbook = xlsx.readFile(filePath, { cellDates: true, dateNF: 'dd/mm/yyyy' });
        const sheet = workbook.Sheets['Hoja1'];
        if (!sheet) {
            return sendResponseProcesos(false, [], 'No se encontró la hoja "Hoja1" en el archivo Excel.');
        }

        const rows = xlsx.utils.sheet_to_json(sheet, { raw: false });
        if (rows.length === 0) {
            return sendResponseProcesos(false, [], 'La hoja de cálculo está vacía.');
        }

        // 2. Preparar lista de cédulas únicas para búsqueda masiva
        const uniqueCedulas = new Set();
        rows.forEach(r => {
            const c = String(r.CEDULA || '').trim();
            if (c) {
                uniqueCedulas.add(c);
                uniqueCedulas.add(c.replace(/-/g, ''));
                if (!c.includes('-') && c.length > 1) {
                    uniqueCedulas.add(c.slice(0, -1) + '-' + c.slice(-1));
                }
            }
        });

        const cedulaList = Array.from(uniqueCedulas);
        if (cedulaList.length === 0) {
            return sendResponseProcesos(false, [], 'No se encontraron cédulas válidas en el archivo Excel.');
        }

        // Construir consulta masiva IN
        const sqlInClause = cedulaList.map(c => `'${c.replace(/'/g, "''")}'`).join(',');

        // 3. Buscar estudiantes en OAS_Master.dbo.Estudiantes
        const studentCache = {};
        const query = `SELECT strCedula, strNombres, strApellidos FROM [OAS_Master].[dbo].[Estudiantes] WHERE strCedula IN (${sqlInClause})`;
        const res = await execMaster('OAS_Master', query, 'OK', 'OK');
        const students = res.data || res;
        if (students && students.length > 0) {
            students.forEach(st => {
                const key = String(st.strCedula).trim();
                studentCache[key] = {
                    strCedula: key,
                    nombreCompleto: `${st.strNombres} ${st.strApellidos}`.trim()
                };
                studentCache[key.replace(/-/g, '')] = studentCache[key];
            });
        }

        // 4. Procesar e insertar registros en OAS_Master.dbo.tb_reconocimiento_estudiante
        let insertadosCount = 0;
        let omitidosCount = 0;
        const erroresLog = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cedula = String(row.CEDULA || '').trim();
            if (!cedula) continue;

            // Buscar estudiante en caché
            const student = studentCache[cedula] || studentCache[cedula.replace(/-/g, '')];
            if (!student) {
                omitidosCount++;
                erroresLog.push({
                    fila: i + 2,
                    cedula,
                    error: 'Estudiante no registrado en la tabla Estudiantes de OAS_Master (FK inválida)'
                });
                continue;
            }

            // Normalizar fecha de otorgamiento a YYYY-MM-DD
            let fechaOtorgamiento = null;
            const rawFecha = String(row.FECHA_RECONOCIMIENTO || '').trim();
            if (rawFecha) {
                const parts = rawFecha.split('/');
                if (parts.length === 3) {
                    fechaOtorgamiento = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                }
            }

            if (!fechaOtorgamiento) {
                omitidosCount++;
                erroresLog.push({
                    fila: i + 2,
                    cedula,
                    error: `Fecha de otorgamiento inválida o vacía: ${rawFecha}`
                });
                continue;
            }

            const payload = {
                tr_idtipo: parseInt(row.TIPO_RECONOCIMIENTO, 10),
                tr_idnivel: parseInt(row.NIVEL_RECONOCIMIENTO, 10),
                tr_cedula: student.strCedula || cedula,
                tr_nombre: String(row.NOMBRE_RECONOCIMIENTO || '').trim(),
                tr_institucion: String(row.INSTITUCION_OTORGANTE || '').trim(),
                tr_titulo: String(row.TITULO_MENCION_OTORGADA || '').trim(),
                tr_fecha_otorgamiento: fechaOtorgamiento,
                tr_fecha_vencimiento: null,
                tr_descripcion: String(row.DESCRIPCION || '').trim(),
                tr_url: null,
                tr_pais: String(row.PAIS || 'ECUADOR').trim(),
                tr_iduser: iduser || 0,
                tr_idestudiante: 0,
                tr_estado: 1
            };

            const insertResult = await modeloreconocimiento.InsertarReconocimientoEstudiante('OAS_Master', payload);
            if (insertResult && (insertResult.message === 'OK' || insertResult.count > 0)) {
                insertadosCount++;
            } else {
                omitidosCount++;
                erroresLog.push({
                    fila: i + 2,
                    cedula,
                    error: `Error base de datos: ${insertResult.message}`
                });
            }
        }

        return sendResponseProcesos(true, {
            totalLeidos: rows.length,
            insertados: insertadosCount,
            omitidos: omitidosCount,
            errores: erroresLog
        }, 'OK');

    } catch (error) {
        logger.error('Error en ProcesoMigrarReconocimientosExcel', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message);
    }
};