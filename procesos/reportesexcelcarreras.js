
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
const ExcelJS = require('exceljs');
const { JSDOM } = require('jsdom');
const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.ProcesoExcelListadoEstudiantesRetirosInstitucional = async function (periodo, cedula) {
    try {
        var resultado = await FuncionExcelListadoEstudiantesRetirosInstitucional(periodo, cedula);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
async function FuncionExcelListadoEstudiantesRetirosInstitucional(periodo, cedula) {
    try {
        var lstResultado = []
        var ListadoCarreras = await procesocarreras.ListadoCarreraNivelacion("OAS_Master", "UNA");
        for (var carreras of ListadoCarreras.data) {

            var ListadoRetirosTipos = await procesocarreras.TiposRetirosEstudiantesCarrerasListado(carreras.strBaseDatos, periodo);
            var ListadoRetirosNormales = await procesocarreras.RetirosEstudiantesNormalesCarrerasListado(carreras.strBaseDatos, periodo);
            if (ListadoRetirosTipos.count > 0) {
                for (var retiros of ListadoRetirosTipos.data) {
                    var datos = {
                        sintCodMatricula: retiros.sintCodigo[0],
                        strCodPeriodo: retiros.strCodPeriodo[0],
                        dtFechaAprob: retiros.dtFechaAprob,
                        dtFechaAsentado: retiros.dtFechaAsentado,
                        strdescripcion: retiros.strdescripcion,
                        strnombreTipo: retiros.strnombre,
                        strCedula: retiros.strCedula,
                        strNombres: retiros.strNombres,
                        strApellidos: retiros.strApellidos,
                        strCarrera: carreras.strNombreCarrera,
                        strFacultad: carreras.strNombreFacultad,
                        strSede: carreras.strSede,
                        strNivel: retiros.strCodNivel,
                        strtipo: "PROCESOS CUPOS"
                    }

                    lstResultado.push(datos);
                }
            }
            if (ListadoRetirosNormales.count > 0) {
                for (var retirosnormales of ListadoRetirosNormales.data) {
                    var datosNormales = {
                        sintCodMatricula: retirosnormales.sintCodMatricula,
                        strCodPeriodo: retirosnormales.strCodPeriodo,
                        dtFechaAprob: retirosnormales.dtFechaAprob,
                        dtFechaAsentado: retirosnormales.dtFechaAsentado,
                        strdescripcion: retirosnormales.strResolucion,
                        strnombreTipo: "",
                        strCedula: retirosnormales.strCedula,
                        strNombres: retirosnormales.strNombres,
                        strApellidos: retirosnormales.strApellidos,
                        strCarrera: carreras.strNombreCarrera,
                        strFacultad: carreras.strNombreFacultad,
                        strSede: carreras.strSede,
                        strNivel: retirosnormales.strCodNivel,
                        strtipo: "PROCESOS NORMAL"
                    }
                    lstResultado.push(datosNormales);
                }
            }
        }
        var resultado = await ProcesoRetirosInstitucional(periodo, cedula, lstResultado);
        return resultado
    } catch (error) {
        console.log(error);
    }

}


async function ProcesoRetirosInstitucional(periodo, cedula, lstResultado) {
    try {

        var periodoinfo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
        var respuesta = []
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Listado de estudiantes');
        // Crear un header superior que combine las primeras 18 columnas

        worksheet.mergeCells('A1:L1');
        const headerespoch = worksheet.getCell('A1');
        headerespoch.value = 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO'; // Texto del header
        headerespoch.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
        headerespoch.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado

        //
        worksheet.mergeCells('A2:L2');
        const headerperiodo = worksheet.getCell('A2');
        headerperiodo.value = 'INFORMACIÓN DE RETIROS INSTITUCIONALES NIVELACIÓN'; // Texto del header
        headerperiodo.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
        headerperiodo.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
       
        worksheet.mergeCells('A3:L3');
        const headerperiodo1 = worksheet.getCell('A3');
        headerperiodo1.value = periodoinfo.data[0].strDescripcion + "(" + periodo + ")"; // Texto del header
        headerperiodo1.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
        headerperiodo1.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado

        // Crear un header superior que combine las primeras 18 columnas
        worksheet.mergeCells('A4:L4'); // Combina de A1 a Q1 (18 columnas)
        const headerCell = worksheet.getCell('A4');
        headerCell.value = 'LISTADO DE ESTUDIANTES RETIRADOS NIVELACIÓN'; // Texto del header
        headerCell.font = { name: 'Arial', size: 11, bold: false }; // Tamaño y fuente Arial
        headerCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
        headerCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '9cccfc' }, // Color de fondo
        };

        // Encabezados de tabla
        const headers = ['No', 'Periodo', 'Cédula', 'Apellidos', 'Nombres','Nivel', 'Tipo','Retiro', 'Carrera', 'Facultad','Sede', 'Fecha'];
        worksheet.addRow(headers).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // Agregar datos y aplicar bordes a cada celda
        lstResultado.forEach((row, index) => {
            const rowData = [
                index + 1,
                row.strCodPeriodo,
                row.strCedula,
                row.strApellidos,
                row.strNombres,
                row.strNivel,
                row.strtipo,
                row.strnombreTipo,
                row.strCarrera,
                row.strFacultad,
                row.strSede,
                row.dtFechaAsentado,
            ];
            const excelRow = worksheet.addRow(rowData);

            excelRow.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });


        // Ajustar tamaño de las columnas
        worksheet.columns.forEach((column) => {
            column.width = 20;
        });

        // Guardar archivo Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const base64 = buffer.toString('base64');

        // Retornar la cadena Base64
        //Almacenar el archivo fisico
        const fs = require('fs');
        fs.writeFileSync('ReporteDatosRetiros.xlsx', buffer);
        return base64;

    } catch (error) {
        console.error(error);
        return 'ERROR';
    }
}