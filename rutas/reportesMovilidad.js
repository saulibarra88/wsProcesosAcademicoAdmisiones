const express = require('express');
const router = express.Router();
const Request = require("request");
const fs = require("fs");
const pdf = require('html-pdf');
const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const tools = require('./tools');
const crypto = require("crypto");
const procesoCupo = require('../modelo/procesocupos');
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
    console.log(error);
  }
}
module.exports.PdfListadoSolicitudesAprobadasCarreras = async function (listado, periodo) {
  try {
    var resultado = await ProcesoPdfListadoEstudiantesSolicitudes(listado, periodo);
    return resultado
  } catch (error) {
    console.log(error);
  }
}
module.exports.PdfCurriculumEstuidantil = async function (cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas) {
  try {
    var resultado = await ProcesoPdfCurriculumEstudiantil(cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas);
    return resultado
  } catch (error) {
    console.log(error);
  }
}
module.exports.PdfCurriculumEstuidantilConsultor = async function (cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas, codigo) {
  try {
    var resultado = await ProcesoPdfCurriculumEstudiantilConsultor(cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas, codigo);
    return resultado
  } catch (error) {
    console.log(error);
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
    const headers = ['No', 'CEDULA', 'NOMBRES', 'APELLIDOS', 'PERIODO', 'CARRERA ACTUAL', 'CARRERA MOVILIDAD', 'MOVILIDAD', 'PUNTAJE', 'ESTADO'];
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
async function ProcesoPdfListadoEstudiantesSolicitudes(listado, periodo) {
  try {
    var periodoinfo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
    var datos = "";

    listado.forEach(carrera => {
      datos += `<br/><div style="font-size: 14px; text-align: left" >CARRERA:  ${carrera.cm_nombrecarrera_movilidad}</div>`;
      datos += `
      <table border=2>
        <thead>
          <tr>
            <th style="font-size: 10px;text-align: center;font-family: serif;">#</th>
            <th style="font-size: 10px;text-align: center;font-family: serif;">CEDULA</th>
            <th style="font-size: 10px;text-align: center;font-family: serif;">NOMBRES ESTUIDANTES</th>
            <th style="font-size: 10px;text-align: center;font-family: serif;">PUNTAJE</th>
            <th style="font-size: 10px;text-align: center;font-family: serif;">CARRERA ACTUAL</th>
            <th style="font-size: 10px;text-align: center;font-family: serif;">CARRERA MOVILIDAD</th>
            <th style="font-size: 10px;text-align: center;font-family: serif;">TIPO</th>
          </tr>
        </thead>
        <tbody>
    `;
      var contadot = 0;
      carrera.ListaEstuidantes.forEach(estudiante => {
        contadot = contadot + 1;
        datos += `
        <tr>
          <td style="font-size: 10px; text-align: left;font-family: serif;">${contadot}</td>
          <td style="font-size: 10px; text-align: left;font-family: serif;">${estudiante.cm_identificacion}</td>
          <td style="font-size: 10px; text-align: left;font-family: serif;">${estudiante.nombreestudiante} ${estudiante.apellidoestudiante}</td>
          <td style="font-size: 10px; text-align: center;font-family: serif;">${estudiante.cm_puntaje}</td>
          <td style="font-size: 10px; text-align: left;font-family: serif;">${estudiante.cm_nombrecarrera_actual}</td>
          <td style="font-size: 10px; text-align: left;font-family: serif;">${estudiante.cm_nombrecarrera_movilidad}</td>
          <td style="font-size: 10px; text-align: left;font-family: serif;">${estudiante.mts_strdescripcion}</td>
        </tr>
      `;
      });

      datos += `</tbody></table>`;
    });

    datos += `</body></html>`;


    const htmlContent = `
              <!DOCTYPE html>
              <html lang="es">
              <head>
                <style> table { border-collapse: collapse; width: 100%; } th, td { padding: 6px; text-align: left;font-size: 11px; } .nombre { margin-top: 7em; text-align: center; width: 100%; } hr{ width: 60%; } </style>
              </head>
              <body>
              <p style='text-align: center;font-size: 11px;font-family: serif;'> <strong>ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO</strong> </p>
              <p style='text-align: center;font-size: 11px;font-family: serif;'> <strong>DECANATO ACADEMICO INSTITUCIONAL</strong> </p>
              <p style='text-align: center;font-size: 11px;font-family: serif;'> <strong>NÓMINA DE ESTUIDANTES CON MOVILIDAD </strong> </p>
              <p style='text-align: center;font-size: 11px;font-family: serif;'> <strong>PERIODO:   ${periodoinfo.data[0].strDescripcion}  </strong> </p><br/>
                     ${datos}
            
                <br/><br/>
                <p style="text-align: center;font-family: serif;"> <strong>----------------------------------------</strong></p>
                <p style="text-align: center;font-size: 11px;font-family: serif;"> GENERADO POR:</p>
                <p style="text-align: center;font-size: 11px;font-family: serif;">DECANATO ACADEMICO</p>
              </body>
              </html>
              `;

    var htmlCompleto = tools.headerOcultoHtml() + htmlContent + tools.footerOcultoHtml();
    const options = {
      format: 'A4',
      border: {
        top: '1.0cm', // Margen superior
        right: '1.5cm', // Margen derecho
        bottom: '2.0cm', // Margen inferior
        left: '1.5cm' // Margen izquierdo
      },
      header: {
        height: '60px',
        contents: tools.headerHtml()
      },
      footer: {
        height: '30px',
        contents: tools.footerHtml()
      },

    };
    var base64 = await generarPDF(htmlCompleto, options)
    return base64
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}

async function ProcesoPdfCurriculumEstudiantil(cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas) {
  try {
    var bodylistadoAsignaturas = "";
    var bodylistadoBecas = "";
    var datos = "";
    var datosTitulacion = "";
    var datosBecas = "";
    var contadot = 0;
    var contadotBecas = 0;

    listado.forEach(objnivel => {
      datos += `<br/> <div class="section-title"> PAO:  ${objnivel.strDescripcion}</div>`;
      datos += `
      <table>
        <thead>
          <tr>
                                <th style="text-align: center;" >#</th>
                                <th style="text-align: center;" >CÓDIGO</th>
                                <th style="text-align: center;">NOMBRES</th>
                                <th style="text-align: center;">NIVEL</th>
                                <th style="text-align: center;">CRÉDITOS</th>
                                <th style="text-align: center;">ARÉA</th>
                                <th style="text-align: center;">TIPO</th>
                                <th style="text-align: center;">ESTADO</th>
                            </tr>
        </thead>
        <tbody>
    `;
      var contadot = 0;
      objnivel.listadoasignaturas.forEach(ojbAsignaturas => {
        contadot = contadot + 1;
        const estado = ojbAsignaturas.estadoasignatura?.toUpperCase() === 'APROBADA' ? 'Aprobada' : 'Por aprobar';
        datos += `
        <tr>
          <td style="font-size: 10px; text-align: center"> ${contadot} </td>
                            <td style="text-align: left;font-size:12px;font-family: 'Arial'"> ${ojbAsignaturas.strCodMateria} </td>
                             <td style="text-align: left;font-size:12px;font-family: 'Arial'"> ${ojbAsignaturas.nombreasignatura} </td>
                            <td style="text-align: center;font-size:12px;font-family: 'Arial'"> ${ojbAsignaturas.strCodNivel} </td>
                            <td style="text-align: center;font-size:12px;font-family: 'Arial'"> ${ojbAsignaturas.fltCreditos} </td>
                            <td style="text-align: center;font-size:12px;font-family: 'Arial'"> ${ojbAsignaturas.nombrearea} </td>
                              <td style="text-align: center;font-size:12px;font-family: 'Arial'"> ${ojbAsignaturas.nombretipo} </td>
                            <td  style="text-align: center;font-size:12px;font-family: 'Arial'" class="${estado === 'Aprobada' ? 'aprobada' : 'por-aprobar'}"> ${ojbAsignaturas.estadoasignatura} </td>
        </tr>
      `;
      });
      datos += `</tbody></table>`;
    });


    for (let objBecas of listadoBecas) {
      contadotBecas = contadotBecas + 1;
      bodylistadoBecas += `<tr >
                              <td style="font-size: 10px; text-align: center">
                              ${contadotBecas}
                            </td>
                            <td style="font-size: 11px; text-align: left">
                              ${objBecas.nombCarrera}   
                              
                            </td>
                             <td style="font-size: 11px; text-align: left">
                              ${objBecas.nombFacultad}
                              
                            </td>
                            <td style="font-size: 11px; text-align: center">
                              ${objBecas.strNombre}  
                            </td>
                            <td style="font-size: 11px; text-align: center">
                              ${objBecas.periodoDetalle}  
                            </td>
                            <td style="font-size: 11px; text-align: center">
                             ${(objBecas.detEstado || '').toUpperCase()} 
                            </td>

                           </tr>`
    }


    if (listadoBecas.length > 0) {
      datosBecas += `
    <div class="data-section">
      <div class="section-title">BECAS ESTUDIANTIL</div>
     <div class="table-container">
               <table>
                       <thead>
                               <tr>
                                <th style="text-align: center;" >#</th>
                                <th style="text-align: center;" >FACULTAD</th>
                                <th style="text-align: center;">CARRERA</th>
                                <th style="text-align: center;">BECA</th>
                                <th style="text-align: center;">PERíODO</th>
                                <th style="text-align: center;">ESTADO</th>
                            </tr>
                        </thead>
                        <tbody>
                         ${bodylistadoBecas}
                       </tbody> 
        </table>
    </div>
    </div>
  `;
    } else {
      datosTitulacion += `
    <div class="data-section">
      <div class="section-title">BECAS ESTUDIANTIL</div>
  
      <div class="data-row">
        <span class="data-label">ESTADO:</span>
         <span>El estudiante no registra información en becas</span>
      </div>

    </div>
  `;
    }
    if (objTitulacion.proceso) {
      datosTitulacion += `
    <div class="data-section">
      <div class="section-title">PROYECTO TITULACIÓN</div>
    
      <div class="data-row">
        <span class="data-label">PROYECTO:</span>
         <span>${objTitulacion.nombreproyecto}.</span>
      </div>
        <div class="data-row">
        <span class="data-label">TIPO PROYECTO:</span>
        <span>${(objTitulacion.formagrado || '').toUpperCase()}.</span>
      </div>
        <div class="data-row">
        <span class="data-label">RESOLUCIÓN:</span>
        <span>${objTitulacion.resolucion}.</span>
      </div>
       <div class="data-row">
        <span class="data-label">ESTADO:</span>
        <span>${objTitulacion.estado}.</span>
      </div>
    </div>
  `;
    } else {
      datosTitulacion += `
    <div class="data-section">
      <div class="section-title">PROYECTO TITULACIÓN</div>
      <div class="data-row">
        <span class="data-label">TÍTULO:</span>
        <span>${objTitulacion.mensaje}.</span>
      </div>
      <div class="data-row">
        <span class="data-label">ESTADO:</span>
        <span>NINGUNO.</span>
      </div>
    </div>
  `;
    }
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
        <title>Datos Académicos</title>
        <style>
 @font-face {
      font-family: 'Arial';
      src: local('Arial'), url('/font/arial.ttf') format('truetype');
      font-weight: normal;
    }
    @font-face {
      font-family: 'Arial';
      src: local('Arial Bold'), url('/font/arialbd.ttf') format('truetype');
      font-weight: bold;
    }

            /* Estilos generales optimizados para PDF */
         body {
                font-family: 'TikTok Display', sans-serif;
                margin: 0;
                padding: 0;
                color: #333;
                line-height: 1.5;
                font-size: 12px;

            }
          
            /* Contenedor principal */
            .container {
                width: 100%;
                max-width: 100%;
                padding: 20px;
                box-sizing: border-box;
            }
            
            /* Encabezado */
            .header {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #2c3e50;
                padding-bottom: 10px;
            }
            
            .logo {
                width: 80px;
                height: 80px;
                margin-right: 20px;
                background-color: #f5f5f5;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #ddd;
            }
            
            .university-info {
                flex-grow: 1;
            }
            
            .university-name {
                font-size: 18px;
                font-weight: bold;
                color: #2c3e50;
                margin: 0;
            }
            
            .document-title {
                font-size: 16px;
                color: #2c3e50;
                margin: 5px 0 0 0;
            }
            
         .photo-image {
                position: absolute;
                width: 100%;
                height: 100%;
                object-fit: cover;
                top: 0;
                left: 0;
            }
            
            .photo-section {
                margin-bottom: 8mm;
                overflow: hidden; /* Clearfix */
            }
            
            .data-section {
                margin-bottom: 6mm;
            }
            
            .section-title {
                background-color: #f0f0f0;
                padding: 2mm 4mm;
                font-weight: bold;
                border-left: 3mm solid #2c3e50;
                margin-bottom: 4mm;
                font-size: 13pt;
                color: #2c3e50;
            }
            
            .data-row {
                margin-bottom: 3mm;
            }
            
            .data-label {
                font-weight: bold;
                display: inline-block;
                width: 50mm;
                color: #555;
            }
            
           .photo-container {
                width: 120px;       /* Ancho fijo */
            height: 150px;      /* Alto fijo para proporción 4:5 */
                border: 1px solid #999;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10mm;
                background-color: #f9f9f9;
                position: relative;
                overflow: hidden;
                float: left;           /* Para mejor alineación */
            }
            
            .photo-text {
                font-weight: bold;
                color: #666;
                font-size: 11pt;
                z-index: 1;
            }
            
            /* Secciones de datos */
            .data-section {
                margin-bottom: 25px;
            }
            
            .section-title {
                background-color: #f0f0f0;
                padding: 6px 12px;
                font-weight: bold;
                border-left: 4px solid #D31A2B;
                margin-bottom: 12px;
                font-size: 13px;
                color: #2c3e50;
            }
              .section-title-personales {
                background-color: #f0f0f0;
                padding: 10px 12px;
                font-weight: bold;
                border-left: 4px solid #D31A2B;
                  margin-left: 0mm;
                margin-bottom: 12px;
                font-size: 13px;
                color: #2c3e50;
            }
            .data-row {
                display: flex;
                margin-bottom: 2px;
                page-break-inside: avoid;
            }
            
            .data-label {
                font-weight: bold;
                min-width: 180px;
                color: #555;
            }
            /* Tabla de asignaturas */
              .table-container {
                margin-bottom: 10mm;
                overflow-x: visible;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 5mm;
                page-break-inside: auto;
            }
            thead {
                display: table-header-group;
            }
            
            tbody {
                display: table-row-group;
            }
            
            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            
            th, td {
                border: 1px solid #ddd;
               padding: 2mm 1mm;
                text-align: left;
                font-size: 9pt;
            }
            
            th {
                background-color: #2c3e50;
                color: white;
                font-weight: bold;
                position: sticky;
                top: 0;
            }
            /* Estado de aprobación */
            .aprobada {
                color: #27ae60;
                font-weight: bold;
            }
            
            .por-aprobar {
                color: #e67e22;
                font-weight: bold;
            }
            
            /* Pie de página */
            .footer {
                margin-top: 30px;
                padding-top: 10px;
                border-top: 1px solid #ddd;
                font-size: 10px;
                color: #777;
                text-align: center;
            }
                 .lienzo{
              position: relative;
                height:170px;
          }  
          
          .izquierda{
              position:absolute;
              top:20px;
              left:0px;
          }
          
          .derecha{
              position:absolute;
              left:180px;
          }
           
           
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Encabezado profesional -->
            <div class="header">
              
                <div class="university-info">
                    <h1 style="text-align: center;" class="university-name">ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO</h1>
                    <h2 class="document-title">HISTORIAL ACADÉMICO</h2>
                </div>
            </div>
            
            <!-- Sección de foto -->
                <div class="lienzo">
                  <div class="izquierda" >
                          <div class="photo-container">
                              <span class="photo-text">FOTO</span>
                              <!-- Para usar una imagen real: -->
                              <img class="photo-image" src="${foto}" > 
                          </div>
                  </div>
    
                <div class="derecha"> 
                    <div class="section-title-personales">DATOS PERSONALES</div>
                    <div class="data-row">
                    <span class="data-label">NOMBRES COMPLETOS:</span>
                    <span>${persona.per_primerApellido} ${persona.per_segundoApellido} ${persona.per_nombres}</span>
                     </div>
                   <div class="data-row">
                    <span class="data-label">CÉDULA:</span>
                    <span>${cedula}</span>
                    </div>
                    <div class="data-row">
                    <span class="data-label">NACIONALIDAD</span>
                    <span>${persona.nac_nombre}</span>
                    </div>
                   <div class="data-row">
                    <span class="data-label">GÉNERO</span>
                    <span>${persona.gen_nombre}</span>
                    </div>
                   <div class="data-row">
                    <span class="data-label">CORREO</span>
                    <span>${persona.per_email}</span>
                    </div>
                     <div class="data-row">
                    <span class="data-label">PROCEDENCIA</span>
                    <span>${persona.procedencia}</span>
                    </div>
                </div>
                </div>
                </div>
            
            <!-- Datos académicos -->
            <div class="data-section">
                <div class="section-title">DATOS ACADÉMICOS</div>
                <div class="data-row">
                    <span class="data-label">FACULTAD:</span>
                    <span>${carrera.strNombreFacultad}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">CARRERA:</span>
                  <span>${carrera.strNombreCarrera}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">SEDE:</span>
                 <span>${carrera.strSede}</span>
                </div>
            </div>
            
            <!-- Asignaturas Mallas-->
            <div class="data-section">
                <div class="section-title">ASIGNATURAS MALLA CARRERA</div>
                <div class="table-container">
                  ${datos}
                </div>
            </div>
              <!-- Proyecto de Becas -->
         
                  ${datosBecas}
            <!-- Proyecto de titulación -->
             ${datosTitulacion}
            
            <!-- Pie de página profesional -->
            <div class="footer">
                <p>Documento generado  el ${new Date().toLocaleDateString()} - Sistema Académico</p>
            </div>
        </div>
    </body>
    </html>
    `;

    var htmlCompleto = tools.headerOcultoHtml() + htmlContent + tools.footerOcultoHtml();
    const options = {
      format: 'A4',
      orientation: 'portrait',
      type: 'pdf',
      border: {
        top: '1.0cm', // Margen superior
        right: '1.5cm', // Margen derecho
        bottom: '2.0cm', // Margen inferior
        left: '1.5cm' // Margen izquierdo
      },
      header: {
        height: '50px',
        contents: tools.headerHtml()
      },
      footer: {
        height: '30px',
        contents: tools.footerHtml()
      },

    };
    var base64 = await generarPDF(htmlCompleto, options)
    return base64
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}

async function ProcesoPdfCurriculumEstudiantilConsultor(cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas, codigo) {
  try {
    // Configuración de fuentes
    const fontConfig = {
      arial: {
        normal: path.join(__dirname, '../public/font/arial.ttf'),
        bold: path.join(__dirname, '../public/font/arialbd.ttf'),
        italics: path.join(__dirname, '../public/font/ariali.ttf'),
        bolditalics: path.join(__dirname, '../public/font/arialbi.ttf')
      }
    };

    // Generar contenido de las tablas
    const { datosAsignaturas, datosBecas, datosTitulacion } = await generarContenidoTablas(
      listado, listadoBecas, objTitulacion
    );

    // Generar el HTML completo
    const htmlContent = generarHtmlCompleto(
      cedula, persona, carrera, foto, codigo, 
      datosAsignaturas, datosBecas, datosTitulacion
    );

    // Configuración de opciones para PDF
    const options = {
      format: 'A4',
      orientation: 'portrait',
      type: 'pdf',
      localUrlAccess: true,
      base: 'file://' + path.join(__dirname, '../public/'),
      border: {
        top: '1.0cm',
        right: '1.5cm',
        bottom: '2.0cm',
        left: '1.5cm'
      },
      header: {
        height: '50px',
        contents: tools.headerHtml()
      },
      footer: {
        height: '30px',
        contents: tools.footerHtml()
      },
      // Configuración de fuentes para el PDF
      "font-family": {
        "Arial": {
       "normal": path.join(__dirname, '../public/font/arial.ttf'),
      "bold": path.join(__dirname, '../public/font/arialbd.ttf'),
      "italics": path.join(__dirname, '../public/font/ariali.ttf'),
      "bolditalics": path.join(__dirname, '../public/font/arialbi.ttf')
        }
      },
        "font": {
    "Arial": {
      "normal": path.join(__dirname, '../public/font/arial.ttf'),
      "bold": path.join(__dirname, '../public/font/arialbd.ttf'),
      "italics": path.join(__dirname, '../public/font/ariali.ttf'),
      "bolditalics": path.join(__dirname, '../public/font/arialbi.ttf')
    },
    
  },
  "font-aliases": {
    "AriaIMT": "Arial",
    "AriaINarrow-Bold": "Arial"
  }
    };
console.log( path.join(__dirname, '../public/font/arial.ttf'))
    const htmlCompleto = tools.headerOcultoHtml() + htmlContent + tools.footerOcultoHtml();
    const base64 = await generarPDF(htmlCompleto, options);
    return base64;
  } catch (error) {
    console.error('Error en ProcesoPdfCurriculumEstudiantilConsultor:', error);
    return 'ERROR';
  }
}

// Funciones auxiliares
async function generarContenidoTablas(listado, listadoBecas, objTitulacion) {
  let datosAsignaturas = "";
  let datosBecas = "";
  let datosTitulacion = "";
  let bodylistadoBecas = "";
  let contadotBecas = 0;

  // Generar tabla de asignaturas
  listado.forEach(objnivel => {
    datosAsignaturas += `<br/><div class="section-title"> PAO: ${objnivel.strDescripcion}</div>`;
    datosAsignaturas += `
      <table>
        <thead>
          <tr>
            <th style="text-align: center;font-family: 'Arial'">#</th>
            <th style="text-align: center;font-family: 'Arial'">HOMOL.</th>
            <th style="text-align: center;font-family: 'Arial'">CÓDIGO</th>
            <th style="text-align: center;font-family: 'Arial'">NOMBRES</th>
            <th style="text-align: center;font-family: 'Arial'">NIVEL</th>
            <th style="text-align: center;font-family: 'Arial'">TIPO</th>
            <th style="text-align: center;font-family: 'Arial'">ESTADO</th>
          </tr>
        </thead>
        <tbody>
    `;

    let contadot = 0;
    objnivel.listadoasignaturas.forEach(ojbAsignaturas => {
      contadot++;
      const estado = ojbAsignaturas.Estado?.toUpperCase() === 'APROBADA' ? 'Aprobada' : 'Por aprobar';
      datosAsignaturas += `
        <tr>
          <td style="font-size: 10px; text-align: center;font-family: 'Arial'">${contadot}</td>
          <td style="text-align: center;font-size:12px;font-family: 'Arial'">${ojbAsignaturas.CodigoMateriaNueva}</td>
          <td style="text-align: left;font-size:12px;font-family: 'Arial'">${ojbAsignaturas.CodigoMateria}</td>
          <td style="text-align: left;font-size:12px;font-family: 'Arial'">${ojbAsignaturas.NombreMateria}</td>
          <td style="text-align: center;font-size:12px;font-family: 'Arial'">${objnivel.strCodNivel}</td>
          <td style="text-align: center;font-size:11px;font-family: 'Arial'">${ojbAsignaturas.nombretipo}</td>
          <td style="text-align: center;font-size:11px;font-family: 'Arial'" class="${estado === 'Aprobada' ? 'aprobada' : 'por-aprobar'}">${ojbAsignaturas.Estado}</td>
        </tr>
      `;
    });
    datosAsignaturas += `</tbody></table>`;
  });

  // Generar tabla de becas
  for (let objBecas of listadoBecas) {
    contadotBecas++;
    bodylistadoBecas += `
      <tr>
        <td style="font-size: 10px; text-align: center;font-family: 'Arial'">${contadotBecas}</td>
        <td style="font-size: 11px; text-align: left;font-family: 'Arial'">${objBecas.nombCarrera}</td>
        <td style="font-size: 11px; text-align: left;font-family: 'Arial'">${objBecas.nombFacultad}</td>
        <td style="font-size: 11px; text-align: center;font-family: 'Arial'">${objBecas.strNombre}</td>
        <td style="font-size: 11px; text-align: center;font-family: 'Arial'">${objBecas.periodoDetalle}</td>
        <td style="font-size: 11px; text-align: center;font-family: 'Arial'">${(objBecas.detEstado || '').toUpperCase()}</td>
      </tr>
    `;
  }

  if (listadoBecas.length > 0) {
    datosBecas = `
      <div class="data-section">
        <div class="section-title">BECAS ESTUDIANTIL</div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th style="text-align: center;font-family: 'Arial'">#</th>
                <th style="text-align: center;font-family: 'Arial'">FACULTAD</th>
                <th style="text-align: center;font-family: 'Arial'">CARRERA</th>
                <th style="text-align: center;font-family: 'Arial'">BECA</th>
                <th style="text-align: center;font-family: 'Arial'">PERÍODO</th>
                <th style="text-align: center;font-family: 'Arial'">ESTADO</th>
              </tr>
            </thead>
            <tbody>${bodylistadoBecas}</tbody>
          </table>
        </div>
      </div>
    `;
  } else {
    datosTitulacion = `
      <div class="data-section">
        <div class="section-title">BECAS ESTUDIANTIL</div>
        <div class="data-row">
          <span class="data-label">ESTADO:</span>
          <span>El estudiante no registra información en becas</span>
        </div>
      </div>
    `;
  }

  // Generar sección de titulación
  if (objTitulacion.proceso) {
    datosTitulacion += `
      <div class="data-section">
        <div class="section-title">PROYECTO TITULACIÓN</div>
        <div class="data-row">
          <span class="data-label">PROYECTO:</span>
          <span>${objTitulacion.nombreproyecto}.</span>
        </div>
        <div class="data-row">
          <span class="data-label">TIPO PROYECTO:</span>
          <span>${(objTitulacion.formagrado || '').toUpperCase()}.</span>
        </div>
        <div class="data-row">
          <span class="data-label">RESOLUCIÓN:</span>
          <span>${objTitulacion.resolucion}.</span>
        </div>
        <div class="data-row">
          <span class="data-label">ESTADO:</span>
          <span>${objTitulacion.estado}.</span>
        </div>
      </div>
    `;
  } else {
    datosTitulacion += `
      <div class="data-section">
        <div class="section-title">PROYECTO TITULACIÓN</div>
        <div class="data-row">
          <span class="data-label">TÍTULO:</span>
          <span>${objTitulacion.mensaje}.</span>
        </div>
        <div class="data-row">
          <span class="data-label">ESTADO:</span>
          <span>NINGUNO.</span>
        </div>
      </div>
    `;
  }

  return { datosAsignaturas, datosBecas, datosTitulacion };
}

function generarHtmlCompleto(cedula, persona, carrera, foto, codigo, datosAsignaturas, datosBecas, datosTitulacion) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Datos Académicos</title>
      <style>
        /* Estilos optimizados para PDF con fuentes embebidas */
        @font-face {
          font-family: 'Arial';
          src: url('/font/arial.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Arial';
          src: url('/font/arialbd.ttf') format('truetype');
          font-weight: bold;
          font-style: normal;
        }
        @font-face {
          font-family: 'Arial';
          src: url('/font/ariali.ttf') format('truetype');
          font-weight: normal;
          font-style: italic;
        }
        @font-face {
          font-family: 'Arial';
          src: url('/font/arialbi.ttf') format('truetype');
          font-weight: bold;
          font-style: italic;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
          line-height: 1.5;
          font-size: 12px;
        }
        
        /* Resto de tus estilos CSS... */
        .container {
          width: 100%;
          max-width: 100%;
          padding: 20px;
          box-sizing: border-box;
        }
        
        /* Encabezado */
            .header {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #2c3e50;
                padding-bottom: 10px;
            }
            
            .logo {
                width: 80px;
                height: 80px;
                margin-right: 20px;
                background-color: #f5f5f5;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #ddd;
            }
            
            .university-info {
                flex-grow: 1;
            }
            
            .university-name {
                font-size: 18px;
                font-weight: bold;
                color: #2c3e50;
                margin: 0;
            }
            
            .document-title {
                font-size: 16px;
                color: #2c3e50;
                margin: 5px 0 0 0;
            }
            
         .photo-image {
                position: absolute;
                width: 100%;
                height: 100%;
                object-fit: cover;
                top: 0;
                left: 0;
            }
            
            .photo-section {
                margin-bottom: 8mm;
                overflow: hidden; /* Clearfix */
            }
            
            .data-section {
                margin-bottom: 6mm;
            }
            
            .section-title {
                background-color: #f0f0f0;
                padding: 2mm 4mm;
                font-weight: bold;
                border-left: 3mm solid #2c3e50;
                margin-bottom: 4mm;
                font-size: 13pt;
                color: #2c3e50;
            }
            
            .data-row {
                margin-bottom: 3mm;
            }
            
            .data-label {
                font-weight: bold;
                display: inline-block;
                width: 50mm;
                color: #555;
            }
            
           .photo-container {
                width: 120px;       /* Ancho fijo */
                 height: 150px;      /* Alto fijo para proporción 4:5 */
                border: 1px solid #999;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10mm;
                background-color: #f9f9f9;
                position: relative;
                overflow: hidden;
                float: left;           /* Para mejor alineación */
            }
            
            .photo-text {
                font-weight: bold;
                color: #666;
                font-size: 11pt;
                z-index: 1;
            }
            
            /* Secciones de datos */
            .data-section {
            margin-bottom: 20px;
            }
            
            .section-title {
                background-color: #f0f0f0;
                padding: 6px 12px;
                font-weight: bold;
                border-left: 4px solid #D31A2B;
                margin-bottom: 12px;
                font-size: 13px;
                color: #2c3e50;
            }
              .section-title-personales {
                background-color: #f0f0f0;
                padding: 10px 12px;
                font-weight: bold;
                border-left: 4px solid #D31A2B;
                  margin-left: 0mm;
                margin-bottom: 12px;
                font-size: 13px;
                color: #2c3e50;
            }
            .data-row {
                display: flex;
                margin-bottom: 3px;
                page-break-inside: avoid;
            }
            
            .data-label {
                font-weight: bold;
                min-width: 180px;
                color: #555;
            }
            /* Tabla de asignaturas */
              .table-container {
                margin-bottom: 10mm;
                overflow-x: visible;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 5mm;
                page-break-inside: auto;
            }
            thead {
                display: table-header-group;
            }
            
            tbody {
                display: table-row-group;
            }
            
            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            
            th, td {
                border: 1px solid #ddd;
                padding: 2mm 1mm;
                text-align: left;
                font-size: 9pt;
            }
            
            th {
                background-color: #2c3e50;
                color: white;
                font-weight: bold;
                position: sticky;
                top: 0;
            }
            /* Estado de aprobación */
            .aprobada {
                color: #27ae60;
                font-weight: bold;
            }
            
            .por-aprobar {
                color: #e67e22;
                font-weight: bold;
            }
            
            /* Pie de página */
            .footer {
                margin-top: 30px;
                padding-top: 10px;
                border-top: 1px solid #ddd;
                font-size: 10px;
                color: #777;
                text-align: center;
            }
                 .lienzo{
              position: relative;
              height:170px;
          }  
          
          .izquierda{
              position:absolute;
              top:20px;
              left:0px;
          }
          
          .derecha{
              position:absolute;
              left:180px;
          }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Encabezado profesional -->
        <div class="header">
          <div class="university-info">
            <h1 style="text-align: center;" class="university-name">ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO</h1>
            <h2 class="document-title">HISTORIAL ACADÉMICO</h2>
          </div>
        </div>
        
        <!-- Sección de foto y datos personales -->
        <div class="lienzo">
          <div class="izquierda">
            <div class="photo-container">
              <span class="photo-text">FOTO</span>
              <img class="photo-image" src="${foto}">
            </div>
          </div>
          
          <div class="derecha"> 
            <div class="section-title-personales">DATOS PERSONALES</div>
            <div class="data-row">
              <span class="data-label">NOMBRES COMPLETOS:</span>
              <span>${persona.per_primerApellido} ${persona.per_segundoApellido} ${persona.per_nombres}</span>
            </div>
            <div class="data-row">
              <span class="data-label">CÉDULA:</span>
              <span>${cedula}</span>
            </div>
            <div class="data-row">
              <span class="data-label">NACIONALIDAD</span>
              <span>${persona.nac_nombre}</span>
            </div>
            <div class="data-row">
              <span class="data-label">GÉNERO</span>
              <span>${persona.gen_nombre}</span>
            </div>
            <div class="data-row">
              <span class="data-label">CORREO</span>
              <span>${persona.per_email}</span>
            </div>
            <div class="data-row">
              <span class="data-label">PROCEDENCIA</span>
              <span>${persona.procedencia}</span>
            </div>
          </div>
        </div>
        
        <!-- Datos académicos -->
        <div class="data-section">
          <div class="section-title">DATOS ACADÉMICOS</div>
          <div class="data-row">
            <span class="data-label">FACULTAD:</span>
            <span>${carrera.strNombreFacultad}</span>
          </div>
          <div class="data-row">
            <span class="data-label">CARRERA:</span>
            <span>${carrera.strNombreCarrera}</span>
          </div>
          <div class="data-row">
            <span class="data-label">SEDE:</span>
            <span>${carrera.strSede}</span>
          </div>
          <div class="data-row">
            <span class="data-label">CÓDIGO ESTUDIANTE:</span>
            <span>${codigo}</span>
          </div>
        </div>
        
        <!-- Asignaturas Mallas-->
        <div class="data-section">
          <div class="section-title">ASIGNATURAS MALLA CARRERA</div>
          <div class="table-container">
            ${datosAsignaturas}
          </div>
        </div>
        
        <!-- Proyecto de Becas -->
        ${datosBecas}
        
        <!-- Proyecto de titulación -->
        ${datosTitulacion}
        
        <!-- Pie de página profesional -->
        <div class="footer">
          <p>Documento generado el ${new Date().toLocaleDateString()} - Sistema Académico</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generarPDF(htmlCompleto, options) {
  return new Promise((resolve, reject) => {
    pdf.create(htmlCompleto, options).toFile("ReporteInformacion.pdf", function (err, res) {
      if (err) {
        reject(err);
      } else {
        fs.readFile(res.filename, (err, data) => {
          if (err) {
            reject(err);
          } else {
            const base64Data = Buffer.from(data).toString('base64');
            // Eliminar el archivo PDF generado (opcional)
               fs.unlink(res.filename, (err) => {
                 if (err) {
                   console.error('Error al eliminar el archivo PDF:', err);
                 } else {
                   console.log('Archivo PDF eliminado.');
                 }
               });
   
            // Resolver la promesa con base64Data
            resolve(base64Data);
          }
        });
      }
    });
  });
}