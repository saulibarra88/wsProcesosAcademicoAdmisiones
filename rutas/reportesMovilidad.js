const express = require('express');
const router = express.Router();

const fs = require("fs");
const reportesMovilidadMake = require('../reportesmake/reportesmovilidadmake.js');
const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const tools = require('./tools');
const crypto = require("crypto");
const procesoCupo = require('../modelo/procesocupos');
const funcionesmodelomovilidad = require('../modelo/modelomovilidad');
const procesoacademico = require('../rutas/ProcesoNotasAcademico');
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const { JSDOM } = require('jsdom');
const path = require('path');
const agent = new https.Agent({
  rejectUnauthorized: false,
  // other options if needed
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});
module.exports.ExcelExcelListadoSolicitudes = async function (listado, periodo) {
  try {
    var resultado = await ProcesoExcelListadoSolicitudes(listado, periodo);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.PdfListadoSolicitudesAprobadasCarreras = async function (listado, periodo) {
  try {
    var resultado = await reportesMovilidadMake.pdfmakeProcesoPdfListadoEstudiantesSolicitudes(listado, periodo);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.PdfCertificadoMovilidadEstuidante = async function (solicitud, objpersona, objperiodo) {
  try {
    var resultado = await reportesMovilidadMake.pdfmakeProcesoPdfCertificadoMovilidadEstudiante(solicitud, objpersona, objperiodo);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.PdfCurriculumEstuidantil = async function (cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas) {
  try {
    var resultado = await reportesMovilidadMake.pdfmakeProcesoPdfCurriculumEstudiantil(cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.PdfCurriculumEstuidantilConsultor = async function (cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas, codigo) {
  try {
    var resultado = await reportesMovilidadMake.pdfmakeProcesoPdfCurriculumEstudiantilConsultor(cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas, codigo);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}

module.exports.PdfSolcitudesAprobadasCarreraPeriodo = async function (listado, periodo,strCarrera,strNombre) {
  try {
    var resultado = await reportesMovilidadMake.pdfmakeProcesoPdfSolcitudesAprobadasCarreraPeriodo(listado, periodo,strCarrera,strNombre);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}
async function ProcesoExcelListadoSolicitudes(listado, periodo) {
  try {
    var periodoinfo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Listado de estudiantes');
    // Crear un header superior que combine las primeras 18 columnas

    worksheet.mergeCells('A1:J1');
    const headerespoch = worksheet.getCell('A1');
    headerespoch.value = 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO'; // Texto del header
    headerespoch.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
    headerespoch.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
    worksheet.mergeCells('A2:J2');
    const header2 = worksheet.getCell('A2');
    header2.value = 'INFORMACIÓN DE PROCESOS MOVILIDADES'; // Texto del header
    header2.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
    header2.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
    worksheet.mergeCells('A3:J3');
    const header3 = worksheet.getCell('A3');
    header3.value = 'PERIODO ACADEMICO ' + periodoinfo.data[0].strDescripcion + "(" + periodo + ")"; // Texto del header
    header3.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
    header3.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
    // Crear un header superior que combine las primeras 18 columnas
    worksheet.mergeCells('A4:J4'); // Combina de A1 a Q1 (18 columnas)
    const headerCell = worksheet.getCell('A4');
    headerCell.value = 'LISTADO DE SOLICITUDES '; // Texto del header
    headerCell.font = { name: 'Arial', size: 11, bold: false }; // Tamaño y fuente Arial
    headerCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
    headerCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '9cccfc' }, // Color de fondo
    };

    // Encabezados de tabla
    const headers = ['No', 'CEDULA', 'NOMBRES', 'APELLIDOS', 'PERIODO', 'CARRERA ACTUAL', 'CARRERA MOVILIDAD', 'MOVILIDAD', 'PUNTAJE', 'TIPO_PUNTAJE', 'TERCERA_MATRICULA', 'ESTADO'];
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
    listado.forEach((row, index) => {
      const rowData = [
        index + 1,
        row.cm_identificacion,
        row.nombreestudiante,
        row.apellidoestudiante,
        row.cm_periodo,
        row.cm_nombrecarrera_actual,
        row.cm_nombrecarrera_movilidad,
        row.mts_strdescripcion,
        row.cm_puntaje,
        row.puntajedescripcion,
        row.terceramatricula,
        row.mte_strdescripcion,
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

    //  const fs = require('fs');
    //  fs.writeFileSync('ListadoEstudiantes.xlsx', buffer);
    return base64;

  } catch (error) {
    console.error(error);
    
    return 'ERROR';
  }
}