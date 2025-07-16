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
   
    };
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
          <td style="font-size: 8px; text-align: center;font-family: 'Arial'">${contadot}</td>
          <td style="text-align: center;font-size:8px;font-family: 'Arial'">${ojbAsignaturas.CodigoMateriaNueva}</td>
          <td style="text-align: left;font-size:8px;font-family: 'Arial'">${ojbAsignaturas.CodigoMateria}</td>
          <td style="text-align: left;font-size:8px;font-family: 'Arial'">${ojbAsignaturas.NombreMateria}</td>
          <td style="text-align: center;font-size:8px;font-family: 'Arial'">${objnivel.strCodNivel}</td>
          <td style="text-align: center;font-size:8px;font-family: 'Arial'">${ojbAsignaturas.nombretipo}</td>
          <td style="text-align: center;font-size:8px;font-family: 'Arial'" class="${estado === 'Aprobada' ? 'aprobada' : 'por-aprobar'}">${ojbAsignaturas.Estado}</td>
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
        <td style="font-size: 8px; text-align: center;font-family: 'Arial'">${contadotBecas}</td>
        <td style="font-size: 8px; text-align: left;font-family: 'Arial'">${objBecas.nombCarrera}</td>
        <td style="font-size: 8px; text-align: left;font-family: 'Arial'">${objBecas.nombFacultad}</td>
        <td style="font-size: 8px; text-align: center;font-family: 'Arial'">${objBecas.strNombre}</td>
        <td style="font-size: 8px; text-align: center;font-family: 'Arial'">${objBecas.periodoDetalle}</td>
        <td style="font-size: 8px; text-align: center;font-family: 'Arial'">${(objBecas.detEstado || '').toUpperCase()}</td>
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
  const arialNormalBase64 = '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A2QDdgOIA5YDxAPOA9gD4gPsA/YEAAQOBBwEJgQwBD4ETARWBGAEngTcBRoFKAAJAUIAKAFDABgBRAAeAUUAPQFGAD0BSQAyAUsAOAFMADQBTgA2ABEAuf+nALr/pwC7/6cAvP+nAL3/pwC+/6cAv/+nAN7/ywDf/8sA4P/LAOH/ywDi/8sA4//LAOT/ywDl/8sA5v/LAOf/ywAJAUIAMAFDADEBRAAmAUUAQgFGAEIBSQA6AUsAQAFMADwBTgA+AAkBQgAwAUMAMQFEACYBRQBCAUYAQgFJADoBSwBAAUwAPAFOAD4ACQFCADABQwAxAUQAJgFFAEIBRgBCAUkAOgFLAEABTAA8AU4APgAJAUIAMAFDADEBRAAmAUUAQgFGAEIBSQA6AUsAQAFMADwBTgA+AAkBQgAwAUMAMQFEACYBRQBCAUYAQgFJADoBSwBAAUwAPAFOAD4ACQFCADABQwAxAUQAJgFFAEIBRgBCAUkAOgFLAEABTAA8AU4APgAJAUIAMAFDADEBRAAmAUUAQgFGAEIBSQA6AUsAQAFMADwBTgA+AAkBQgAkAUMAJAFEACYBRQA4AUYAOAFJAC4BSwA2AUwAMgFOADQACQFCACQBQwAkAUQAJgFFADgBRgA4AUkALgFLADYBTAAyAU4ANAAJAUIAJAFDACQBRAAmAUUAOAFGADgBSQAuAUsANgFMADIBTgA0AAkBQgAkAUMAJAFEACYBRQA4AUYAOAFJAC4BSwA2AUwAMgFOADQACQFCACQBQwAkAUQAJgFFADgBRgA4AUkALgFLADYBTAAyAU4ANAAJAUIAJAFDACQBRAAmAUUAOAFGADgBSQAuAUsANgFMADIBTgA0AAoBOwBVAUIATgFDAEkBRABSAUUAYwFGAGMBSQBYAUsAYwFMAF4BTgBeAAQCTgAgAlcAOgJZADoCWwA6AAQCTgAeAlcAMAJZADACWwAwAAQCTgA0AlcAJAJZACQCWwAkAAQCTgA2AlcANgJZADYCWwA2AAQCTgA2AlcANgJZADYCWwA2AAMCV//8Aln//AJb//wABAJOADoCVwA2AlkANgJbADYABAJOACYCVwAwAlkAMAJbADAABAJOABwCVwAyAlkAMgJbADIAAwJXAFACWQBQAlsAUAALATIAJAGlACQBpgAkAacAJAGoACQBqQAkAaoAJAGrACQBrAAk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AAMTaAAAE0oAAhNiAAITYgACE2IAAhNiAAITYgACE2IAAhNiAAITYgACE2IAAhNiAAITYgACE2IAAhNiAAITYgACE2IAAhNcAAITXAACE1wAAhNcAAITXAACE1wAAhNcAAITXAACE2IAAhNiAAITYgACE2IAAhNiAAITYgACE2IAAhNiAdcSjBKSEpgX6hfqEowSkhKeF+oX6hKMEpISnhfqF+oSjBKSEp4X6hfqEqQSkhKeF+oX6hKMEpISnhfqF+oSjBKSEp4X6hfqEowSkhKeF+oX6hKMEpISnhfqF+oSjBKSEp4X6hfqEqQSkhKeF+oX6hKMEpISnhfqF+oSjBKSEp4X6hfqEowSkhKeF+oX6hKMEpISnhfqF+oSjBKSEp4X6hfqEqQSkhKYF+oX6hKMEpISnhfqF+oSjBKSEp4X6hfqEowSkhKeF+oX6hKMEpISnhfqF+oSjBKSEp4X6hfqEqoX6hKwF+oX6hKqF+oSthfqF+oSvBfqEsIX6hfqEsgX6hLOF+oX6hLIF+oS1BfqF+oSyBfqEtQX6hfqEsgX6hLOF+oX6hLIF+oS1BfqF+oSyBfqEtQX6hfqEsgX6hLUF+oX6hLaF+oS5hLgF+oS7BfqEvIS4BfqEtoX6hL4EuAX6hL+F+oS5hLgF+oS/hfqEuYS4BfqEwQX6hMKEuAX6hMQExYTHBfqF+oTEBMWEyIX6hfqExATFhMiF+oX6hMQExYTIhfqF+oTEBMWExwX6hfqExATFhMiF+oX6hMQExYTIhfqF+oTEBMWEyIX6hfqEygTFhMiF+oX6hMQExYTIhfqF+oTEBMWEyIX6hfqExATFhMiF+oX6hMQExYTIhfqF+oTEBMWEyIX6hfqExATFhMiF+oX6hMoExYTHBfqF+oTEBMWEyIX6hfqExATFhMiF+oX6hMQExYTIhfqF+oTEBMWEyIX6hfqExATFhMuF+oX6hMQExYTLhfqF+oX6hfqExwX6hfqExATFhMiF+oX6hM0F+oTOhfqF+oTQBfqE0YX6hfqE0AX6hNMF+oX6hNAF+oTTBfqF+oTQBfqE0wX6hfqE1IX6hNGF+oX6hNAF+oTTBfqF+oTQBfqE0wX6hfqE1gX6hNkE14X6hNqF+oTZBNeF+oTWBfqE3ATXhfqE2oX6hNkE14X6hN2E3wTghfqF+oTdhN8E4gX6hfqE3YTfBOIF+oX6hN2E3wTiBfqF+oTdhN8E4gX6hfqE3YTfBOIF+oX6hN2E3wTjhfqF+oTdhN8E4gX6hfqE5QTfBOCF+oX6hN2E3wTiBfqF+oTdhN8E4gX6hfqE3YTfBOIF+oX6hN2E3wTiBfqF+oTdhN8E4gX6hfqE5oX6hOgF+oX6hOaF+oTphfqF+oSvBfqE6wX6hfqE7IX6hOsF+oX6hO4F+oTxBO+E8oTuBfqE9ATvhPKE7gX6hPEE74TyhPWF+oTxBO+E8oTuBfqE8QTvhPKE9YX6hPEE74TyhPcF+oT4hO+E8oT1hfqE8QTvhPKE+gX6hPuF+oX6hP0F+oT7hfqF+oT+hfqFAAX6hfqFAYX6hQMF+oX6hP6F+oUEhfqF+oT+hfqFBIX6hfqFBgX6hQAF+oX6hP6F+oUEhfqF+oUGBfqFAAX6hfqFB4X6hQkF+oX6hQYF+oUABfqF+oT+hfqFBIX6hfqFCoUNhLOFDAUPBQqFDYS1BQwFDwUKhQ2EtQUMBQ8FCoUNhLUFDAUPBQqFDYS1BQwFDwUQhQ2EtQUMBQ8FCoUNhLUFDAUPBQqFDYS1BQwFDwUKhQ2EtQUMBQ8FCoUNhLUFDAUPBQqFDYS1BQwFDwUKhQ2FEgUMBQ8FCoUNhRIFDAUPBRCFDYSzhQwFDwUKhQ2EtQUMBQ8FCoUNhLUFDAUPBQqF+oSzhfqF+oUKhfqEtQX6hfqFEIX6hLOF+oX6hQqF+oS1BfqF+oUKhfqEtQX6hfqFCoX6hLUF+oX6hQqFDYS1BQwFDwUKhQ2EtQUMBQ8FCoUNhLUFDAUPBQqFDYUSBQwFDwUKhQ2FEgUMBQ8F+oX6hLOF+oX6hQqF+oSzhfqF+oUKhfqEtQX6hfqFCoUNhLUFDAUPBQqFDYUSBQwFDwUKhQ2FEgUMBQ8FCoUNhRIFDAUPBROF+oUVBfqF+oUWhfqFGAX6hfqFFoX6hRgF+oX6hQqF+oSzhfqF+oUZhfqFGwX6hfqFGYX6hRyF+oX6hRmF+oUchfqF+oUeBfqFGwX6hfqFGYX6hRyF+oX6hR4F+oUbBfqF+oUZhfqFHIX6hfqFHgX6hRsF+oX6hR+F+oUhBfqF+oUfhfqFIoX6hfqFH4X6hSQF+oX6hR+F+oUihfqF+oUfhfqFJYX6hfqFH4X6hSEF+oX6hR+F+oUihfqF+oUnBfqFIQX6hfqFH4X6hSKF+oX6hScF+oUhBfqF+oUnBfqFIoX6hfqFKIX6hNkF+oX6hSoF+oUtBSuF+oUqBfqFLoUrhfqFKgX6hS0FK4X6hTAF+oUtBSuF+oUwBfqFLQUrhfqFMAX6hS0FK4X6hTGFMwU0hfqFNgUxhTMFN4X6hTYFMYUzBTeF+oU2BTGFMwU3hfqFNgUxhTMFN4X6hTYFMYUzBTeF+oU2BTkFMwU0hfqFNgUxhTMFN4X6hTYFMYUzBTeF+oU2BTGF+oU0hfqF+oUxhfqFN4X6hfqFOQX6hTSF+oX6hTGF+oU3hfqF+oUxhfqFN4X6hfqFMYX6hTeF+oX6hTGFMwU3hfqFNgUxhTMFN4X6hTYFMYUzBTeF+oU2BTGFMwU6hfqFNgUxhTMFN4X6hTYFMYUzBTeF+oU2BTGFMwU6hfqFNgUxhfqFPAX6hfqFPYX6hT8F+oX6hT2F+oVAhfqF+oU9hfqFQIX6hfqFPYX6hUCF+oX6hT2F+oVAhfqF+oVCBfqFQ4X6hfqFRQX6hUaF+oX6hUUF+oVIBfqF+oVFBfqFSAX6hfqFRQX6hUgF+oX6hUUF+oVIBfqF+oVJhfqFRoX6hfqFRQX6hUgF+oX6hUUF+oVIBfqF+oVFBfqFSAX6hfqFRQX6hUgF+oX6hUsF+oVMhfqF+oVLBfqFTgX6hfqFSwX6hU4F+oX6hUsF+oVOBfqF+oVPhfqFTIX6hfqFUQTfBVKF+oX6hVQFVYVXBfqF+oVUBVWFWIX6hfqFVAVVhViF+oX6hVQFVYVYhfqF+oVaBVWFWIX6hfqFVAVVhViF+oX6hVQFVYVYhfqF+oVUBVWFWIX6hfqFVAVVhViF+oX6hVQFVYVYhfqF+oVUBVWFWIX6hfqFWgVVhViF+oX6hVQFVYVYhfqF+oVUBVWFWIX6hfqFVAVVhViF+oX6hVQFVYVYhfqF+oVUBVWFWIX6hfqFVAVVhViF+oX6hVoFVYVXBfqF+oVUBVWFWIX6hfqFVAVVhViF+oX6hVQFVYVYhfqF+oVUBVWFWIX6hfqFVAVVhViF+oX6hVQFVYVYhfqF+oVbhfqFXQX6hfqFW4X6hV6F+oX6hWAF+oVhhfqF+oVjBfqFZIX6hfqFYwX6hWYF+oX6hWMF+oVmBfqF+oVjBfqFZIX6hfqFYwX6hWYF+oX6hWMF+oVmBfqF+oVjBfqFZgX6hfqFZ4X6hWqFaQVsBWeF+oVqhWkFbAVthfqFaoVpBWwFbYX6hWqFaQVsBW8F+oVwhWkFbAVyBXOFdQX6hfqFcgVzhXaF+oX6hXIFc4V2hfqF+oVyBXOFdoX6hfqFcgVzhXaF+oX6hXIFc4V2hfqF+oVyBXOFdoX6hfqFeAVzhXaF+oX6hXIFc4V2hfqF+oVyBXOFdoX6hfqFcgVzhXaF+oX6hXIFc4V2hfqF+oVyBXOFdoX6hfqFcgVzhXaF+oX6hXgFc4V1BfqF+oVyBXOFdoX6hfqFcgVzhXaF+oX6hXIFc4V2hfqF+oVyBXOFdoX6hfqFcgVzhXmF+oX6hXIFc4V5hfqF+oX6hfqFdQX6hfqFcgVzhXaF+oX6hXsF+oV8hfqF+oV+BfqFf4X6hfqFfgX6hYEF+oX6hX4F+oWBBfqF+oV+BfqFgQX6hfqFfgX6hYEF+oX6hX4F+oWBBfqF+oV+BfqFgQX6hfqFgoX6hYWFhAX6hYcF+oWFhYQF+oWChfqFiIWEBfqFhwX6hYWFhAX6hYoFi4WNBfqF+oWKBYuFjoX6hfqFigWLhY0F+oX6hYoFi4WNBfqF+oWKBYuFjQX6hfqFigWLhY0F+oX6hYoFi4WNBfqF+oWKBYuFkAX6hfqFigWLhY0F+oX6hZGFi4WNBfqF+oWKBYuFjQX6hfqFigWLhY0F+oX6hYoFi4WNBfqF+oWKBYuFjQX6hfqFigWLhY0F+oX6hZMF+oWUhfqF+oWTBfqFlgX6hfqFkwX6hZSF+oX6hZeF+oWZBfqF+oWahfqFmQX6hfqFl4X6hZkF+oX6hYoF+oWdhZwFnwWKBfqFoIWcBZ8FigX6hZ2FnAWfBZGF+oWdhZwFnwWKBfqFnYWcBZ8FkYX6hZ2FnAWfBNAF+oWiBZwFnwWRhfqFnYWcBZ8Fo4X6haUF+oX6haaF+oWlBfqF+oWChfqFqAX6hfqFgoX6hamF+oX6hYKF+oWoBfqF+oWChfqFqYX6hfqFhwX6hagF+oX6hYKF+oWphfqF+oWHBfqFqAX6hfqFqwX6hayF+oX6hYcF+oWoBfqF+oWChfqFqYX6hfqFrgWxBbKFr4W0Ba4FsQW1ha+FtAWuBbEFtYWvhbQFrgWxBbWFr4W0Ba4FsQW1ha+FtAW3BbEFtYWvhbQFrgWxBbWFr4W0Ba4FsQW1ha+FtAWuBbEFtYWvhbQFrgWxBbWFr4W0Ba4FsQW1ha+FtAWuBbEFuIWvhbQFrgWxBbiFr4W0BbcFsQWyha+FtAWuBbEFtYWvhbQFrgWxBbWFr4W0Ba4F+oWyhfqF+oWuBfqFtYX6hfqFtwX6hbKF+oX6ha4F+oW1hfqF+oWuBfqFtYX6hfqFrgX6hbWF+oX6ha4FsQW1ha+FtAWuBbEFtYWvhbQFrgWxBbWFr4W0Ba4FsQW4ha+FtAWuBbEFuIWvhbQF+oX6hbKF+oX6hfqF+oWyhfqF+oX6hfqFtYX6hfqFrgWxBbWFr4W0Ba4FsQW4ha+FtAWuBbEFuIWvhbQFrgWxBbiFr4W0BboF+oW7hfqF+oWXhfqFmQX6hfqFZ4X6hWqF+oX6hb0F+oW+hfqF+oWKBfqFwAX6hfqFigX6hcGF+oX6hYoF+oXBhfqF+oWRhfqFwAX6hfqFigX6hcGF+oX6hZGF+oXABfqF+oWKBfqFwYX6hfqFkYX6hcAF+oX6hcMF+oXEhfqF+oXDBfqFxgX6hfqFwwX6hceF+oX6hcMF+oXGBfqF+oXDBfqFyQX6hfqFwwX6hcSF+oX6hcMF+oXGBfqF+oXKhfqFxIX6hfqFwwX6hcYF+oX6hcqF+oXEhfqF+oXKhfqFxgX6hfqFzAX6hc8FzYXQhcwF+oXPBc2F0IXMBfqFzwXNhdCF0gX6hc8FzYXQhcwF+oXThc2F0IXSBfqFzwXNhdCF0gX6hc8FzYXQhdUF1oXYBfqF2YXVBdaF2wX6hdmF1QXWhdsF+oXZhdUF1oXbBfqF2YXVBdaF2wX6hdmF1QXWhdsF+oXZhdyF1oXYBfqF2YXVBdaF2wX6hdmF1QXWhdsF+oXZhXIF+oVkhfqF+oVyBfqFZgX6hfqFeAX6hWSF+oX6hXIF+oVmBfqF+oVyBfqFZgX6hfqFcgX6hWYF+oX6hdUF1oXbBfqF2YXVBdaF2wX6hdmF1QXWhdsF+oXZhdUF1oXeBfqF2YXVBdaF2wX6hdmF1QXWhdsF+oXZhdUF1oXeBfqF2YXfhfqF4QX6hfqF4oX6heQF+oX6heKF+oXlhfqF+oXihfqF5YX6hfqF4oX6heWF+oX6heKF+oXlhfqF+oXnBfqF6IX6hfqF6gX6heuF+oX6heoF+oXtBfqF+oXqBfqF7QX6hfqF6gX6he0F+oX6heoF+oXtBfqF+oXuhfqF64X6hfqF6gX6he0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AKEAoQALAKIAogAPAKMAowAKAKQAqwAMAKwAtgANALcAtwAGALgAuAAKALkAvwAOAMAAyAAQAMkAzgARAM8A1gAQANcA3AASAN0A3QATAN4A5wAUAOgA7AAVAO0A7QAHARkBGQAWAdUB2QAWAfgB+AAHAqcCpwAKAqsCrAAKAAIARAAEAB4AGwAgACYAAgBIAE4AAgBjAGQAAQB+AKAAAgCjAKMAAgCsALYAAwC4ALgAAgC5AL8ABADAANYABQDXANwABgDdAN0ABwDeAOcACADoAOwACQDuAQoAHAEMATEAHQEyATIADAEzATkAHQFAAUAAIQFQAVAAIQFUAVQAIQFeAWEAIQFjAWoAIQFrAY0AHQGOAY4AIQGQAZAAHQGRAZgAIQGZAaMAEwGlAawAFQGtAcMAHgHEAckAFwHKAcoAGAHLAdQAFwHVAdkAGQHbAfUAHQH2AfcADAH6AfsADwH8AfwAGwH/Af8AIQJDAkMACgJFAkYADgJHAkcAIgJIAkkAEAJKAkoAIAJNAk0AEAJOAk4AEQJSAlIAIgJTAlMAFAJUAlUAEAJWAlYADgJXAlcAHwJZAlkAHwJbAlsAHwJcAmIADgJjAmMADQJkAmQAGgJlAmUADQJmAmYAGgJnAmcAEAJoAmsAEgJsAmwAEAKJAokADgKKAooAFAKhAqEAIQKnAqcAAgKrAqwAAgKtAq0AFgKuAq4ACwACADIABAAeAAEAIAAmAA0ASABOAA0AYwBkAAIAfgCgAA0AowCjAA0ArAC2ABIAuAC4AA0AuQC/AA4AwADWABMA1wDcAAMA3QDdAAQA3gDnAAUA6ADsAAYA7gEKABEBCwELABYBDAExAAgBMgEyAAcBMwE5AAgBOgE/ABYBQAFAABUBQQFPABYBUAFQABUBUQFTABYBVAFUABUBVQFcABYBXgFhABUBYwFqABUBawGNAAgBjgGOABUBjwGPABYBkAGQAAgBkQGYABUBmQGjAAoBpAGkABYBpQGsAAsBrQHDABQBxAHJAAwBygHKAA8BywHUAAwB1QHZABAB2wH1AAgB9gH3AAcB+QH5ABYB+gH7AAkB/AH8AAEB/wH/ABUCoQKhABUCpwKnAA0CqwKsAA0AAgAgAO4BCAAGAQkBCgABAQsBCwAHARQBFAAHARUBFQAFARoBMAABATEBMQAHATIBMgACATMBOQAMAToBPgAGAUABQAAMAVIBVAAEAVcBVwAFAV4BZwAGAWkBagAGAWsBjAAHAY0BjQABAY4BjwAHAZABkAAIAZEBmAAJAZkBowAKAaQBpAADAaUBrAALAa0BtQAMAbYBuwANAbwBwwAMAcQByQAOAcoBygAPAcsB1AAOAdsB9QAMAf8B/wAMAqECoQAMAAIAMQDuAQoAEwELAQsAFwEMATEAFQEyATIAAwEzATkAFQE6AT8AFwFBAU8AFwFRAVMAFwFVAVwAFwFrAY0AFQGPAY8AFwGQAZAAFQGZAaMAFgGkAaQAFwGlAawACgHEAckAEAHKAcoAEgHLAdQAEAHVAdkAEQHbAfUAFQH2AfcAAwH5AfkAFwH6AfsABgJDAkMADQJFAkYADgJHAkcAAgJIAkkABwJKAkoAFAJNAk0ABwJOAk4ADwJSAlIAAgJTAlMACQJUAlUABwJWAlYADgJXAlcAAQJZAlkAAQJbAlsAAQJcAmIADgJjAmMABAJkAmQABQJlAmUABAJmAmYABQJnAmcABwJoAmsACAJsAmwABwKJAokADgKKAooACQKtAq0ACwKuAq4ADAACABUABAAeAAEAYwBkAAIArAC2AA0AuQC/AAMA1wDcAAQA3gDnAAUA6ADsAA4A7gEKAAYBDAExAAgBMgEyAAcBMwE5AAgBawGNAAgBkAGQAAgBmQGjAAkBpQGsAAoBxAHJAAsBygHKAAwBywHUAAsB2wH1AAgB9gH3AAcB/AH8AAEAAgAAAAIALQAEAB4AAQAgACYAFABIAE4AFABjAGQAAgB+AKAAFACjAKMAFACsALYAFQC4ALgAFAC5AL8AAwDXANwABADdAN0ABQDeAOcABgDuAQoABwEMATEADAEyATIACgEzATkADAFrAY0ADAGQAZAADAGZAaMAEAGlAawAEgHEAckAEwHKAcoAFgHLAdQAEwHbAfUADAH2AfcACgH8AfwAAQJDAkMACAJFAkYACwJIAkkADQJNAk0ADQJOAk4ADgJPAk8ADwJTAlMAEQJUAlUADQJWAlYACwJXAlcACQJZAlkACQJbAlsACQJcAmIACwJnAmcADQJsAmwADQKJAokACwKKAooAEQKnAqcAFAKrAqwAFAABAAAACgGyCMAAAkRGTFQADmxhdG4AMAAEAAAAAP//AAwAAAALABYAIQAsADcASwBWAGEAbAB3AIIAOgAJQVpFIABYQ0FUIAB4Q1JUIACYS0FaIAC4TU9MIADYTkxEIAD4Uk9NIAEYVEFUIAE4VFJLIAFYAAD//wAMAAEADAAXACIALQA4AEwAVwBiAG0AeACDAAD//wANAAIADQAYACMALgA5AEIATQBYAGMAbgB5AIQAAP//AA0AAwAOABkAJAAvADoAQwBOAFkAZABvAHoAhQAA//8ADQAEAA8AGgAlADAAOwBEAE8AWgBlAHAAewCGAAD//wANAAUAEAAbACYAMQA8AEUAUABbAGYAcQB8AIcAAP//AA0ABgARABwAJwAyAD0ARgBRAFwAZwByAH0AiAAA//8ADQAHABIAHQAoADMAPgBHAFIAXQBoAHMAfgCJAAD//wANAAgAEwAeACkANAA/AEgAUwBeAGkAdAB/AIoAAP//AA0ACQAUAB8AKgA1AEAASQBUAF8AagB1AIAAiwAA//8ADQAKABUAIAArADYAQQBKAFUAYABrAHYAgQCMAI1hYWx0A1BhYWx0A1hhYWx0A2BhYWx0A2hhYWx0A3BhYWx0A3hhYWx0A4BhYWx0A4hhYWx0A5BhYWx0A5hhYWx0A6BjYXNlA6hjYXNlA65jYXNlA7RjYXNlA7pjYXNlA8BjYXNlA8ZjYXNlA8xjYXNlA9JjYXNlA9hjYXNlA95jYXNlA+RjY21wA+pjY21wA/JjY21wA/xjY21wBARjY21wBAxjY21wBBRjY21wBBxjY21wBCRjY21wBCxjY21wBDRjY21wBDxkbm9tBERkbm9tBEpkbm9tBFBkbm9tBFZkbm9tBFxkbm9tBGJkbm9tBGhkbm9tBG5kbm9tBHRkbm9tBHpkbm9tBIBmcmFjBIZmcmFjBJBmcmFjBJpmcmFjBKRmcmFjBK5mcmFjBLhmcmFjBMJmcmFjBMxmcmFjBNZmcmFjBOBmcmFjBOpsaWdhBPRsaWdhBPpsaWdhBQBsaWdhBQZsaWdhBQxsaWdhBRJsaWdhBRhsaWdhBR5saWdhBSRsaWdhBSpsaWdhBTBsb2NsBTZsb2NsBTxsb2NsBUJsb2NsBUhsb2NsBU5sb2NsBVRsb2NsBVpsb2NsBWBsb2NsBWZudW1yBWxudW1yBXJudW1yBXhudW1yBX5udW1yBYRudW1yBYpudW1yBZBudW1yBZZudW1yBZxudW1yBaJudW1yBahvbnVtBa5vbnVtBbRvbnVtBbpvbnVtBcBvbnVtBcZvbnVtBcxvbnVtBdJvbnVtBdhvbnVtBd5vbnVtBeRvbnVtBepvcmRuBfBvcmRuBfhvcmRuBgBvcmRuBghvcmRuBhBvcmRuBhhvcmRuBiBvcmRuBihvcmRuBjBvcmRuBjhvcmRuBkBzYWx0BkhzYWx0Bk5zYWx0BlRzYWx0BlpzYWx0BmBzYWx0BmZzYWx0BmxzYWx0BnJzYWx0BnhzYWx0Bn5zYWx0BoRzdWJzBopzdWJzBpBzdWJzBpZzdWJzBpxzdWJzBqJzdWJzBqhzdWJzBq5zdWJzBrRzdWJzBrpzdWJzBsBzdWJzBsZzdXBzBsxzdXBzBtJzdXBzBthzdXBzBt5zdXBzBuRzdXBzBupzdXBzBvBzdXBzBvZzdXBzBvxzdXBzBwJzdXBzBwgAAAACAAAAAQAAAAIAAAABAAAAAgAAAAEAAAACAAAAAQAAAAIAAAABAAAAAgAAAAEAAAACAAAAAQAAAAIAAAABAAAAAgAAAAEAAAACAAAAAQAAAAIAAAABAAAAAQAYAAAAAQAYAAAAAQAYAAAAAQAYAAAAAQAYAAAAAQAYAAAAAQAYAAAAAQAYAAAAAQAYAAAAAQAYAAAAAQAYAAAAAgACAAMAAAADAAIAAwAEAAAAAgACAAMAAAACAAIAAwAAAAIAAgADAAAAAgACAAMAAAACAAIAAwAAAAIAAgADAAAAAgACAAMAAAACAAIAAwAAAAIAAgADAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAQARAAAAAwASABMAFAAAAAMAEgATABQAAAADABIAEwAUAAAAAwASABMAFAAAAAMAEgATABQAAAADABIAEwAUAAAAAwASABMAFAAAAAMAEgATABQAAAADABIAEwAUAAAAAwASABMAFAAAAAMAEgATABQAAAABABkAAAABABkAAAABABkAAAABABkAAAABABkAAAABABkAAAABABkAAAABABkAAAABABkAAAABABkAAAABABkAAAABAA0AAAABAAYAAAABAAwAAAABAAkAAAABAAgAAAABAAUAAAABAAcAAAABAAoAAAABAAsAAAABABAAAAABABAAAAABABAAAAABABAAAAABABAAAAABABAAAAABABAAAAABABAAAAABABAAAAABABAAAAABABAAAAABABcAAAABABcAAAABABcAAAABABcAAAABABcAAAABABcAAAABABcAAAABABcAAAABABcAAAABABcAAAABABcAAAACABUAFgAAAAIAFQAWAAAAAgAVABYAAAACABUAFgAAAAIAFQAWAAAAAgAVABYAAAACABUAFgAAAAIAFQAWAAAAAgAVABYAAAACABUAFgAAAAIAFQAWAAAAAQAaAAAAAQAaAAAAAQAaAAAAAQAaAAAAAQAaAAAAAQAaAAAAAQAaAAAAAQAaAAAAAQAaAAAAAQAaAAAAAQAaAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAOAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPAAAAAQAPABwAOgBCAEoAWABiAGoAcgB8AIQAjACUAJwApACsALQAvADEAMwA1ADcAOQA7gD4AQABCAEQARgBIAABAAAAAQOiAAMAAAABBDAABgAAAAQA3gDwAQQBFgAGAAAAAgEaASwABAAAAAEBNAAEAAAAAQHCAAYAAAACAfACBAABAAAAAQIOAAEAAAABAhQAAQAAAAECGgABAAAAAQIYAAEAAAABAhYAAQAAAAECFAABAAAAAQISAAEAAAABAhAAAQAAAAECDgABAAAAAQIMAAEAAAABAgoAAQAAAAECCAABAAAAAQIGAAYAAAACAgQCFgAGAAAAAgIeAjAABAAAAAECOAABAAAAAQJEAAEAAAABAkIABAAAAAECcgABAAAAAQKEAAEAAAABA/YAAwAAAAEESAABBFAAAQAAABsAAwAAAAEENgACBE4EPgABAAAAGwADAAEESgABBEoAAAABAAAAGwADAAEEVAABBDgAAAABAAAAGwADAAAAAQQmAAEEUgABAAAAGwADAAEEQAABBBQAAAABAAAAGwABBEQABAAOADAAUgB0AAQACgAQABYAHAMAAAICuwL/AAICvAMCAAICwwMBAAICxQAEAAoAEAAWABwC/AACArsC+wACArwC/gACAsMC/QACAsUABAAKABAAFgAcAwgAAgLVAwcAAgLWAwoAAgLcAwkAAgLeAAQACgAQABYAHAMEAAIC1QMDAAIC1gMGAAIC3AMFAAIC3gABA7oABAAOABgAIgAsAAEABAH4AAIAYwABAAQA7QACAGMAAQAEAfkAAgFPAAEABAHaAAIBTwADAAEDkAABA5YAAQOQAAEAAAAbAAMAAQOIAAEDggABA4gAAQAAABsAAgN6AAQAswC9AaABqQACA2wABACzAL0BoAGpAAEDagAIAAEDZAAIAAEDXgAIAAEDWAAIAAEDUgAIAAEDUgAWAAEDTAA0AAEDRgAqAAEDQAAgAAEDRP/sAAEDNAAqAAMAAQM+AAEDRAAAAAEAAAAbAAMAAQM8AAEDMgAAAAEAAAAbAAMAAQMKAAEDNAAAAAEAAAAbAAMAAQL4AAEDKgAAAAEAAAAbAAEDIAABAAgAAQAEArQAAwFrAk0AAQLSAAwAAgJOABkC0wLUAtUC1gLXAtgC2QLaAtsC3ALdAt4C3wLgAuEC6wLsAwMDBAMFAwYDBwMIAwkDCgABAtQAAQAIAAIABgAMAfYAAgE/AfcAAgFVAAICwAAdAdsB3AHdAd4B3wHgAeEB4gHjAeQB5QHmAecB6AHpAeoB6wHsAe0B7gHvAfAB8QHyAfMB9AH1AgsCDAACApYASAH6AfsAswC9AdwB3QHeAd8B4AHhAeIB4wHkAeUB5gHnAegB6QHqAesB7AHtAe4B7wHwAfEB8gHzAfQB9QFQAfsBoAGpAgwCIQIiAiMCJAIlAiYCJwIoAikCKgJVAj8C0wLUAtUC1gLXAtgC2QLaAtsC3ALdAt4C3wLgAuEC6wLsAwMDBAMFAwYDBwMIAwkDCgABAmoADAAeACQAKgA2AEQAUABcAGgAdACAAIwAmAACAfoB2wACAUABRwAFAhcCNQIrAiECDQAGAhgCNgIsAiICDgILAAUCGQI3Ai0CIwIPAAUCGgI4Ai4CJAIQAAUCGwI5Ai8CJQIRAAUCHAI6AjACJgISAAUCHQI7AjECJwITAAUCHgI8AjICKAIUAAUCHwI9AjMCKQIVAAUCIAI+AjQCKgIWAAIB3AAqAfoB+wH6AUABUAH7AiECIgIjAiQCJQImAicCKAIpAioCVQLTAtQC1QLWAtcC2ALZAtoC2wLcAt0C3gLfAuAC4QLrAuwDAwMEAwUDBgMHAwgDCQMKAAEAAgE/AU8AAgACArkCvQAAAr8CyAAF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AxwANgMcADYDHAA2AxwANgMcADYDHAA2AxwANgMcADYDHAA2AxwANgMcADYDHAA2AxwANgMcADYDHAA2AxwANgMcADYDHAA2BBQANgKlAC0CpwAtAxwANgLDAC0CwwAtAsMALQLDAC0CwwAtAsMALQLDAC0CwwAtApgAFwKYABcCmAAXApgAFwKYABcCmAAXApgAFwKYABcCmAAXApgAFwKYABcCzwAtAwkANgJ4ACQCeAAkAngAJAJ4ACQCeAAkAngAJAJ4ACQC6QA+AukAPgLpAD4C6QA+AukAPgLpAD4C6QA+AukAPgLpAD4C6QA+AukAPgLpAD4C6QA+AukAPgLpAD4C6QA+AukAPgLpAD4C6QA+AukAPgLpAD4C6QA+AukAPgLnAA0EYQAwBGEAMARhADAEYQAwBGEAMAKu/84Civ/lAor/5QKK/+UCiv/lAor/5QKK/+UCiv/lAor/5QKK/+UCiv/lAmkAIQJpACECaQAhAmkAIQJpACECxQAtAigAGAIoABgCKAAYAigAGAIoABgCKAAYAigAGAIoABgCKAAYAigAGAIoABgCKAAYAigAGAIoABgCKAAYAigAGAIoABgCKAAYAigAGAIoABgCKAAYAigAGAIoABgCKAAYAigAGAIoABgCKAAYAz8AGAM/ABgCcQAhAfQAHQH0AB0B9AAdAfQAHQH0AB0B9AAdAfQAHQJxAB0CYAAbAnEAHQJxAB0CcQAdAnEAHQR4AB0CFwAdAhcAHQIXAB0CFwAdAhcAHQIXAB0CFwAdAhcAHQIXAB0CFwAdAhcAHQIXAB0CFwAdAhcAHQIXAB0CFwAdAhcAHQIXAB0CFwAdAhcAHQIXAB0CFwAdAhcAHQIXABwBigANAnUAFQJ1ABUCdQAVAnUAFQJ1ABUCdQAVAnUAFQJdACECXf/3Al0AIQJd//4CXQAhARkAIQEZACEBGQAhARn/8gEZ/+wBGf/9ARn/9gEZ//YBGQAhARkAGwEZ/+cBGQAhARn/6AEZAAsBGQACARn/9QEZ/6ABGf+gARn/oAJEACECRAAhAkQAIQEZACEBGQAhARkAIQEZABYBoQAhARkAGwIyACEBGf/NAXr/8QOBACEDgQAhAl0AIQJdACECXQAhAl0AIQJdACECXQAhAl0AIQJdACEDdgAhAl0AIQJdACECWAAdAlgAHQJYAB0CWAAdAlgAHQJYAB0CWAAdAlgAHQJYAB0CWAAdAlgAHQJYAB0CWAAdAlgAHQJYAB0CWAAdAlgAHQJYAB0CWAAdAlgAHQJYAB0CWAAdAlgAHQJYAB0CWAAdAlgAHQJYAB0CWAAdAlgAHQJYAB0CWAAdAlgAHQJYAB0CWAAdA4AAHQJxABECcQARAnEAHgGjACEBowAhAaMAIQGjABYBowAhAaMAGwGjACEBo//NAeoAAwHqAAMB6gADAeoAAwHqAAMB6gADAeoAAwHqAAMB6gADAeoAAwHqAAMCvwAhAZUADQGfABIBlQANAZUADQGVAA0BlQANAZUADQGVAA0CWAArAlgAKwJYACsCWAArAlgAKwJYACsCWAArAlgAKwJYACsCdAArAnQAKwJ0ACsCdAArAnQAKwJ0ACsCWAArAlgAKwJYACsCWAArAlgAKwJYACsCWAArAlgAKwIdAAEDaAAIA2gACANoAAgDaAAIA2gACAIl/8kCHQABAh0AAQIdAAECHQABAh0AAQIdAAECHQABAh0AAQIdAAECHQABAgcAGgIHABoCBwAaAgcAGgIHABoCMgAhAnEAHQJxAB0CcQAdAnEAHQJxAB0CcQAdAnEAHQJxAB0CcQAdAnEAHQJxAB0CcQAdAnEAHQJxAB0CcQAdAnEAHQJxAB0CcQAdAnEAHQJxAB0CcQAdAnEAHQJxAB0CcQAdAnEAHQJxAB0CcQAdAqQADQKjAA0CxQAtAjIAIQFXAB8BggAlAvn/yQJmAA0DOAApAlgADgJ2AA4CWAAmAlgATAJZACgCWAAMAlgAEgJYAB8CWAAkAlgAMgJYABECWAAOAlgATwJYAEACWAAbAlgAQQJYADYCWAAEAlgADwJYACICWAAqAlgAKAJYABECWAAUAXwACgF8ABsBfAAWAXwABgF8//cBfAAKAXwADAF8AA8BfAAAAXwADAF8AAoBfAAbAXwAFgF8AAYBfP/3AXwACgF8AAwBfAAPAXwAAAF8AAwBfAAgAXwAMQF8ACwBfAAcAXwADQF8ACABfAAiAXwAJQF8ABYBfAAiAXwAIAF8ADEBfAAsAXwAHAF8AA0BfAAgAXwAIgF8ACUBfAAWAXwAIgDS/1gDygAxA8oAMQPKABwBxwAxAVwAEQEQACYCDABSARAAGAEQABgDLwAYARAAGAEQ//gCWAAwARAAGAHeAB4B3v/vAecARAEMAEQBEAAYAV3/1gH0//YBLAA0AbEAIQGx/+8BjABFAYz/7wGOAGEBjgAEA+j//gH0//4CWAA8A+j//gG+ADsBvgA7Ab4AOwIuAD0CJgAYAUAAPQE4ABgB7wAYAe8ANwHvAEEBEAA3ARAAQQEQABgCWAAAAGQAAAEQAAABHgAAAMgAAAAAAAACWAAsAlgASAJY/+gCWAAvAlgACwJYABoCWAAVAlj/8wJYABECWAAlAlgAGwJYABQCWAA0Alj//AJYABUEsAAfAlgAHgJYAA4CWAAWAlgAFAJYABUCWAAGAlgAygJYAFMCWAA4AlgAOAJYAE4CWAA4AlgAMAJYADACWAAnAlgANgJYACUCWAAlAlgAJQJYADQCWAA6AlgAPgJYABwCWAALAlgALgM4ACkDOAApAlgAFgJmAA0CWAAFAlgADgJYAA4DxAAxBVUAMQJYAC4CkgAbA7AAKgK+ABMCiAAsAlUAGQMvADIDLwA7A7wALAFxADUBLQAjAS0AJAFyACcCWAA2AXIAFwR0AC0DfgA6AlgAIwEMAEQB5wBEAAD+0wAA/ygAAP7EAAD/TQAA/xYAAP9/AAD+yQAA/tkAAP7PAAD/GwAA/tIAAP7oAAD/PgAA/toAAP7FAAD/MAAA/30AAP74AAD+lQAA/vMAAP7VAAD+ogAA/pAAAP6qAAD+xwAA/vMAAP7iAAD/NwAA/tMAAP9dAAD/HwAA/tkAAP7lAAD+5AAA/ysAAP7hAAD+9wAA/0oAAP7JAAD+3gAA/z4BLABeASwAXAEsABQBLP/wASwARwEsAK4BLAB5ASwAOQEsAHoBLABYASwAvwEsAHkBLP/7ASwABQEsAAEBLP/1ASz//wEsAFQBLP/wASwAQgEsABQBLP/OASwARwEs//4BLACrAAD+0/7T/tP+0/7J/sn+yf7J/uP+4/7j/uP+2f7Z/tn+2QAAAAAAbgBuAG4AbgCeAKoAtgDCANIA3gDqAPYBAgEOAR4BKgE2AUIBTgFaAWYBcgF+AYoBlgH8AkwCwgLOAxIDHgNyA7gDxAPQBJIFegWGBZIFyAXYBiYGMgY6BkYGUgZiBpIGngaqBrYHXAgwCDwISAhYCGQIcAh8CIgIlAigCKwIuAjECNAI3AjyCQgJdAmACaoJ+AoEChAKHAooCjQKQApsCrgKxArQCtwK9gsCCw4LGgsmCzILSAtUC2ALbAt4C4QLkAvcC+gMDgwaDEoMVgx2DNoM5gzyDP4NEA0cDSwNOA1oDZgNpA3MDdgN5A3wDfwOCA4UDlQOZA5wDnwOvg7KDtYO4g7uDv4PCg8WDyIPLg86D1APZg9yD34PihAEEBAQHBAoEDQQQBBMEFgQZBB6EJARABFiEW4RehGQEaYRvBIGEkASfhLMExITHhMqEzYTQhNOE1oTZhO8E8gT3hPqFAAU8hT+FQoVFhUiFTIV2hYuFlIWhBaQFxwXKBc0F0AXdheCF44XmhemF7IXvhfKF9YYIBgsGDgYRBhQGFwYaBh0GIAYlhkAGQwZGBkuGVAZfhmKGZYZohmuGd4aBhoSGh4aKho2GkIaThpaGmYachqeGqoathrCGs4a4hteG2obdhuCG5IbnhuqG7YbwhvOG9ob6hv2HAIcDhwaHCYcMhw+HEocVhxiHG4dNh1CHgQeEB76HwYfdh+6H8Yf0iCUIYAhjCGYIgAiXCLMI0QjUCNcI2wjuiPGI9Ij3iU4JUQlUCVgJWwleCWEJZAlnCWoJbQlwCXMJdgl5CX6JhAmjiaaJuonJCfGJ9In3ifqJ/YoAigOKE4ouCjEKNAo3CjoKQIpDikaKSYpMik+KVQpYClwKXwpiCmUKaAp/CoIKhQqPCpIKnYqgiqsKsYq0ir4KwQrFisiKzIrPitoK9Ar3CwsLDgsRCxQLFwsaCx0LNos6iz2LQItRC1QLVwtaC10LYQtkC2cLagttC3ALdYt7C34LgQuEC6OLpoupi6yLr4uyi7WLuIu7i8ELxovhi/oL/QwADAWMCwwQjDWMTwxjjH+MkYyUjJeMmoydjKCMo4ymjLwMvwzEjMeMzQ0JDQwNDw0SDRUNGQ05DU2NaQ2CDbYNuQ29jcCNw43YjduN3o3hjeSN543qje2N8I4KDg0OEA4TDhYOGQ4cDh8OIg4njk8OUg5VDlqOYw5uDnEOdA53DnoOhQ6ODpEOlA6XDpoOnQ6gDqMOpg6pDrOOto65jryOv47EjuUO6A7rDu4O8g71DvgO+w7+DwEPBA8IDwsPDg8RDxQPFw8aDx0PIA8jDyYPKQ9ej2GPkg+VD6gPqw+uD7MPz4/ej+YP7g/8kAcQExAikC0QOxBSEF+QdJCMEJQQrJDEkMyQ1JDlEO+Q/hEVESKRN5FPEVcRb5GHEYkRixGNEY8RkRGTEZURlxGZEZsRqBGyEcCR2hHnEgqSHpImEkGSVZJZkl2SYZJ2EnoSfhKCEoYSihKOEpISlhKaEp4SohKmEqoSrhKyErYSupLVkwGTBZMPExOTGhMlEy2TNxNBE0sTVRNqk3AThJOak52TpJOwE7STvJPDE9eT65P1E/4UBZQNFBQUGxQiFCkUMBQyFDQUNxQ6FD+URRRIFEsUThRZFGKUbBRsFGwUbBRsFGwUbBR+lJkUshTKFOEVDBUmFTgVURVllXSVjBWeFa2VwJYWFiyWQJZOlmEWdhaHlouWkBacFqCWqBa3FsKWzBbSFtgW4BboFvyXERcilyuXPZdQF1iXZxd1l3uXg5eKF6AXr5fVGAWYDZgjGFqYgRiNGKkYyhjvmPqZDJkTGR4ZKRk5GU2ZbxmAmYmZkJmamaQZq5mzmboZw5nJGdKZ3BnoGfiaCBoQmiWaMJo9GkgaUppZmmMabhqFmpOan5qoGrCatxq/msYazRrSmtsa45rsGvebBxsVmx0bMJs6m0YbUBtbm2cbb5t3m4MbjpuVG50bpRuvm7obvJu/G8Gb2Rvbm94b4JvjG+Wb6Bvqm+0b75vyHAGcEZwnHEccWpxwnIicrRy9HM0c4p0CnRYdKZ09nVnAAEAAAMLAFMACgBQAAUAAgAkADUAiwAAAJwNFgAEAAEAAAAcAVYAAQAAAAAAAABCAAAAAQAAAAAAAQALAEIAAQAAAAAAAgAMAE0AAQAAAAAAAwAhAFkAAQAAAAAABAAYAHoAAQAAAAAABQANAJIAAQAAAAAABgAWAJ8AAQAAAAAACAAMALUAAQAAAAAACQAMAMEAAQAAAAAACwAZAM0AAQAAAAAADAAZAOYAAQAAAAAADQCQAP8AAQAAAAAADgAaAY8AAwABBAkAAACEAakAAwABBAkAAQAiAi0AAwABBAkAAgAMAk8AAwABBAkAAwBCAlsAAwABBAkABAAwAp0AAwABBAkABQAaAs0AAwABBAkABgAsAucAAwABBAkACAAYAxMAAwABBAkACQAYAysAAwABBAkACwAyA0MAAwABBAkADAAyA3UAAwABBAkADQEgA6cAAwABBAkADgA0BMcAAwABBAkAEAAWBPsAAwABBAkAEQAYBRFDb3B5cmlnaHQgMjAxNiBUaGUgTnVuaXRvIFByb2plY3QgQXV0aG9ycyAoY29udGFjdEBzYW5zb3h5Z2VuLmNvbSlOdW5pdG8gU2Fuc0JsYWNrIEl0YWxpYzIuMDAxO1VLV047TnVuaXRvU2Fucy1CbGFja0l0YWxpY051bml0byBTYW5zIEJsYWNrIEl0YWxpY1ZlcnNpb24gMi4wMDFOdW5pdG9TYW5zLUJsYWNrSXRhbGljVmVybm9uIEFkYW1zVmVybm9uIEFkYW1zaHR0cDovL3d3dy5zYW5zb3h5Z2VuLmNvbWh0dHA6Ly93d3cuc2Fuc294eWdlbi5jb21UaGlzIEZvbnQgU29mdHdhcmUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIFNJTCBPcGVuIEZvbnQgTGljZW5zZSwgVmVyc2lvbiAxLjEuIFRoaXMgbGljZW5zZSBpcyBhdmFpbGFibGUgd2l0aCBhIEZBUSBhdDogaHR0cDovL3NjcmlwdHMuc2lsLm9yZy9PRkxodHRwOi8vc2NyaXB0cy5zaWwub3JnL09GTABDAG8AcAB5AHIAaQBnAGgAdAAgADIAMAAxADYAIABUAGgAZQAgAE4AdQBuAGkAdABvACAAUAByAG8AagBlAGMAdAAgAEEAdQB0AGgAbwByAHMAIAAoAGMAbwBuAHQAYQBjAHQAQABzAGEAbgBzAG8AeAB5AGcAZQBuAC4AYwBvAG0AKQBOAHUAbgBpAHQAbwAgAFMAYQBuAHMAIABCAGwAYQBjAGsASQB0AGEAbABpAGMAMgAuADAAMAAxADsAVQBLAFcATgA7AE4AdQBuAGkAdABvAFMAYQBuAHMALQBCAGwAYQBjAGsASQB0AGEAbABpAGMATgB1AG4AaQB0AG8AIABTAGEAbgBzACAAQgBsAGEAYwBrACAASQB0AGEAbABpAGMAVgBlAHIAcwBpAG8AbgAgADIALgAwADAAMQBOAHUAbgBpAHQAbwBTAGEAbgBzAC0AQgBsAGEAYwBrAEkAdABhAGwAaQBjAFYAZQByAG4AbwBuACAAQQBkAGEAbQBzAFYAZQByAG4AbwBuACAAQQBkAGEAbQBzAGgAdAB0AHAAOgAvAC8AdwB3AHcALgBzAGEAbgBzAG8AeAB5AGcAZQBuAC4AYwBvAG0AaAB0AHQAcAA6AC8ALwB3AHcAdwAuAHMAYQBuAHMAbwB4AHkAZwBlAG4ALgBjAG8AbQBUAGgAaQBzACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAGkAcwAgAGwAaQBjAGUAbgBzAGUAZAAgAHUAbgBkAGUAcgAgAHQAaABlACAAUwBJAEwAIABPAHAAZQBuACAARgBvAG4AdAAgAEwAaQBjAGUAbgBzAGUALAAgAFYAZQByAHMAaQBvAG4AIAAxAC4AMQAuACAAVABoAGkAcwAgAGwAaQBjAGUAbgBzAGUAIABpAHMAIABhAHYAYQBpAGwAYQBiAGwAZQAgAHcAaQB0AGgAIABhACAARgBBAFEAIABhAHQAOgAgAGgAdAB0AHAAOgAvAC8AcwBjAHIAaQBwAHQAcwAuAHMAaQBsAC4AbwByAGcALwBPAEYATABoAHQAdABwADoALwAvAHMAYwByAGkAcAB0AHMALgBzAGkAbAAuAG8AcgBnAC8ATwBGAEwATgB1AG4AaQB0AG8AIABTAGEAbgBzAEIAbABhAGMAawAgAEkAdABhAGwAaQBjAAACAAD/+3WB/7UAMgAAAAAAAAAAAAAAAAAAAAAAAAAAAwsAAAECAAIAAwAkAMkBAwEEAQUBBgEHAQgAxwEJAQoBCwEMAQ0BDgBiAQ8ArQEQAREBEgETAGMBFACuAJABFQAlACYA/QD/AGQBFgEXARgAJwEZAOkBGgEbARwBHQEeACgAZQEfASABIQEiAMgBIwEkASUBJgEnASgAygEpASoAywErASwBLQEuAS8BMAExACkAKgD4ATIBMwE0ATUBNgArATcBOAE5AToALADMATsAzQE8AM4BPQD6AT4AzwE/AUABQQFCAUMALQFEAC4BRQAvAUYBRwFIAUkBSgFLAUwBTQDiADABTgAxAU8BUAFRAVIBUwFUAVUBVgFXAGYAMgDQAVgA0QFZAVoBWwFcAV0BXgBnAV8BYAFhANMBYgFjAWQBZQFmAWcBaAFpAWoBawFsAW0BbgCRAW8ArwFwAXEBcgCwADMA7QA0ADUBcwF0AXUBdgF3AXgBeQA2AXoBewDkAXwA+wF9AX4BfwGAAYEBggGDADcBhAGFAYYBhwGIAYkAOADUAYoA1QGLAGgBjADWAY0BjgGPAZABkQGSAZMBlAGVAZYBlwGYAZkBmgGbADkAOgGcAZ0BngGfADsAPADrAaAAuwGhAaIBowGkAaUBpgA9AacA5gGoAakBqgBEAGkBqwGsAa0BrgGvAbABsQBrAbIBswG0AbUBtgG3AGwBuAG5AGoBugG7AbwBvQBuAb4AbQCgAb8ARQBGAP4BAABvAcABwQHCAEcA6gHDAQEBxAHFAcYASABwAccByAHJAHIBygHLAcwBzQHOAc8AcwHQAdEAcQHSAdMB1AHVAdYB1wHYAdkASQBKAPkB2gHbAdwB3QHeAEsB3wHgAeEB4gBMANcAdAHjAHYB5AB3AeUB5gHnAHUB6AHpAeoB6wHsAE0B7QHuAE4B7wHwAE8B8QHyAfMB9AH1AfYB9wDjAFAB+ABRAfkB+gH7AfwB/QH+Af8CAAIBAHgAUgB5AgIAewIDAgQCBQIGAgcCCAB8AgkCCgILAHoCDAINAg4CDwIQAhECEgITAhQCFQIWAhcCGAChAhkAfQIaAhsCHACxAFMA7gBUAFUCHQIeAh8CIAIhAiICIwBWAiQCJQDlAiYA/AInAigCKQIqAisAiQBXAiwCLQIuAi8CMAIxAjIAWAB+AjMAgAI0AIECNQB/AjYCNwI4AjkCOgI7AjwCPQI+Aj8CQAJBAkICQwJEAFkAWgJFAkYCRwJIAFsAXADsAkkAugJKAksCTAJNAk4CTwBdAlAA5wJRAlICUwJUAlUCVgJXAlgCWQJaAlsCXAJdAl4CXwJgAmECYgJjAmQCZQJmAmcCaAJpAmoCawJsAm0CbgDAAMECbwJwAJ0AngJxAnICcwJ0AJsAEwAUABUAFgAXABgAGQAaABsAHAJ1AnYCdwJ4AnkCegJ7AnwCfQJ+An8CgAKBAoICgwKEAoUChgKHAogCiQKKAosCjAKNAo4CjwKQApECkgKTApQClQKWApcCmAKZApoCmwKcAp0CngKfAqACoQKiAqMCpAKlAqYCpwKoALwA9AD1APYADQA/AMMAhwAdAA8AqwAEAKMABgARACIAogAFAAoAHgASAEICqQBeAGAAPgBAAAsADACzALICqgKrABACrAKtAKkAqgC+AL8AxQC0ALUAtgC3AMQCrgKvArACsQKyArMCtACEArUAvQAHArYCtwCmAPcCuAK5AroCuwK8Ar0CvgK/AsACwQCFAsIAlgLDAsQADgDvAPAAuAAgAI8AIQAfAJUAlACTAKcAYQCkAJICxQCcAsYCxwCaAJkApQLIAJgACADGALkCyQAjAAkAiACGAIsAigCMAIMAXwDoAIICygDCAssCzABBAs0CzgLPAtAC0QLSAtMC1ALVAtYC1wLYAtkC2gLbAtwC3QLeAt8C4ALhAuIC4wLkAuUC5gLnAugC6QLqAusC7ALtAu4C7wLwAvEC8gLzAvQC9QL2AvcC+AL5AvoC+wL8Av0C/gL/AwADAQMCAI0A2wDhAN4A2ACOANwAQwDfANoA4ADdANkDAwMEAwUDBgMHAwgDCQMKAwsDDAMNAw4DDwMQAxEDEgMTBE5VTEwGQWJyZXZlB3VuaTFFQUUHdW5pMUVCNgd1bmkxRUIwB3VuaTFFQjIHdW5pMUVCNAd1bmkxRUE0B3VuaTFFQUMHdW5pMUVBNgd1bmkxRUE4B3VuaTFFQUEHdW5pMDIwMAd1bmkxRUEwB3VuaTFFQTIHdW5pMDIwMgdBbWFjcm9uB0FvZ29uZWsKQXJpbmdhY3V0ZQdBRWFjdXRlB3VuaTFFMDgLQ2NpcmN1bWZsZXgKQ2RvdGFjY2VudAd1bmkwMUM0BkRjYXJvbgZEY3JvYXQHdW5pMUUwQwd1bmkxRTBFB3VuaTAxQzUGRWJyZXZlBkVjYXJvbgd1bmkwMjI4B3VuaTFFMUMHdW5pMUVCRQd1bmkxRUM2B3VuaTFFQzAHdW5pMUVDMgd1bmkxRUM0B3VuaTAyMDQKRWRvdGFjY2VudAd1bmkxRUI4B3VuaTFFQkEHdW5pMDIwNgdFbWFjcm9uB3VuaTFFMTYHdW5pMUUxNAdFb2dvbmVrB3VuaTFFQkMGR2Nhcm9uC0djaXJjdW1mbGV4DEdjb21tYWFjY2VudApHZG90YWNjZW50B3VuaTFFMjAESGJhcgd1bmkxRTJBC0hjaXJjdW1mbGV4B3VuaTFFMjQGSWJyZXZlB3VuaTAyMDgHdW5pMUUyRQd1bmkxRUNBB3VuaTFFQzgHdW5pMDIwQQdJbWFjcm9uB0lvZ29uZWsGSXRpbGRlC0pjaXJjdW1mbGV4DEtjb21tYWFjY2VudAd1bmkwMUM3BkxhY3V0ZQZMY2Fyb24MTGNvbW1hYWNjZW50BExkb3QHdW5pMUUzNgd1bmkwMUM4B3VuaTFFM0EHdW5pMUU0Mgd1bmkwMUNBBk5hY3V0ZQZOY2Fyb24MTmNvbW1hYWNjZW50B3VuaTFFNDQHdW5pMUU0NgNFbmcHdW5pMDFDQgd1bmkxRTQ4Bk9icmV2ZQd1bmkxRUQwB3VuaTFFRDgHdW5pMUVEMgd1bmkxRUQ0B3VuaTFFRDYHdW5pMDIwQwd1bmkwMjJBB3VuaTAyMzAHdW5pMUVDQwd1bmkxRUNFBU9ob3JuB3VuaTFFREEHdW5pMUVFMgd1bmkxRURDB3VuaTFFREUHdW5pMUVFMA1PaHVuZ2FydW1sYXV0B3VuaTAyMEUHT21hY3Jvbgd1bmkxRTUyB3VuaTFFNTAHdW5pMDFFQQtPc2xhc2hhY3V0ZQd1bmkxRTRDB3VuaTFFNEUHdW5pMDIyQwZSYWN1dGUGUmNhcm9uDFJjb21tYWFjY2VudAd1bmkwMjEwB3VuaTFFNUEHdW5pMDIxMgd1bmkxRTVFBlNhY3V0ZQd1bmkxRTY0B3VuaTFFNjYLU2NpcmN1bWZsZXgMU2NvbW1hYWNjZW50B3VuaTFFNjAHdW5pMUU2Mgd1bmkxRTY4B3VuaTFFOUUHdW5pMDE4RgRUYmFyBlRjYXJvbgd1bmkwMTYyB3VuaTAyMUEHdW5pMUU2Qwd1bmkxRTZFBlVicmV2ZQd1bmkwMjE0B3VuaTFFRTQHdW5pMUVFNgVVaG9ybgd1bmkxRUU4B3VuaTFFRjAHdW5pMUVFQQd1bmkxRUVDB3VuaTFFRUUNVWh1bmdhcnVtbGF1dAd1bmkwMjE2B1VtYWNyb24HdW5pMUU3QQdVb2dvbmVrBVVyaW5nBlV0aWxkZQd1bmkxRTc4BldhY3V0ZQtXY2lyY3VtZmxleAlXZGllcmVzaXMGV2dyYXZlC1ljaXJjdW1mbGV4B3VuaTFFOEUHdW5pMUVGNAZZZ3JhdmUHdW5pMUVGNgd1bmkwMjMyB3VuaTFFRjgGWmFjdXRlClpkb3RhY2NlbnQHdW5pMUU5MhBJYWN1dGVfSi5sb2NsTkxEBmFicmV2ZQd1bmkxRUFGB3VuaTFFQjcHdW5pMUVCMQd1bmkxRUIzB3VuaTFFQjUHdW5pMDFDRQd1bmkxRUE1B3VuaTFFQUQHdW5pMUVBNwd1bmkxRUE5B3VuaTFFQUIHdW5pMDIwMQd1bmkwMjI3B3VuaTFFQTEHdW5pMUVBMwd1bmkwMjAzB2FtYWNyb24HYW9nb25lawphcmluZ2FjdXRlB2FlYWN1dGUHdW5pMUUwOQtjY2lyY3VtZmxleApjZG90YWNjZW50BmRjYXJvbgd1bmkxRTBEB3VuaTFFMEYHdW5pMDFDNgZlYnJldmUGZWNhcm9uB3VuaTFFMUQHdW5pMUVCRgd1bmkxRUM3B3VuaTFFQzEHdW5pMUVDMwd1bmkxRUM1B3VuaTAyMDUKZWRvdGFjY2VudAd1bmkxRUI5B3VuaTFFQkIHdW5pMDIwNwdlbWFjcm9uB3VuaTFFMTcHdW5pMUUxNQdlb2dvbmVrB3VuaTFFQkQHdW5pMDI1OQZnY2Fyb24LZ2NpcmN1bWZsZXgMZ2NvbW1hYWNjZW50Cmdkb3RhY2NlbnQHdW5pMUUyMQRoYmFyB3VuaTFFMkILaGNpcmN1bWZsZXgHdW5pMUUyNQZpYnJldmUHdW5pMDIwOQd1bmkxRTJGCWkubG9jbFRSSwd1bmkxRUNCB3VuaTFFQzkHdW5pMDIwQgdpbWFjcm9uB2lvZ29uZWsGaXRpbGRlB3VuaTAyMzcLamNpcmN1bWZsZXgMa2NvbW1hYWNjZW50DGtncmVlbmxhbmRpYwZsYWN1dGUGbGNhcm9uDGxjb21tYWFjY2VudARsZG90B3VuaTFFMzcHdW5pMDFDOQd1bmkxRTNCB3VuaTFFNDMGbmFjdXRlC25hcG9zdHJvcGhlBm5jYXJvbgxuY29tbWFhY2NlbnQHdW5pMUU0NQd1bmkxRTQ3A2VuZwd1bmkwMUNDB3VuaTFFNDkGb2JyZXZlB3VuaTFFRDEHdW5pMUVEOQd1bmkxRUQzB3VuaTFFRDUHdW5pMUVENwd1bmkwMjBEB3VuaTAyMkIHdW5pMDIzMQd1bmkxRUNEB3VuaTFFQ0YFb2hvcm4HdW5pMUVEQgd1bmkxRUUzB3VuaTFFREQHdW5pMUVERgd1bmkxRUUxDW9odW5nYXJ1bWxhdXQHdW5pMDIwRgdvbWFjcm9uB3VuaTFFNTMHdW5pMUU1MQd1bmkwMUVCC29zbGFzaGFjdXRlB3VuaTFFNEQHdW5pMUU0Rgd1bmkwMjJEBnJhY3V0ZQZyY2Fyb24McmNvbW1hYWNjZW50B3VuaTAyMTEHdW5pMUU1Qgd1bmkwMjEzB3VuaTFFNUYGc2FjdXRlB3VuaTFFNjUHdW5pMUU2NwtzY2lyY3VtZmxleAxzY29tbWFhY2NlbnQHdW5pMUU2MQd1bmkxRTYzB3VuaTFFNjkEdGJhcgZ0Y2Fyb24HdW5pMDE2Mwd1bmkwMjFCB3VuaTFFOTcHdW5pMUU2RAd1bmkxRTZGBnVicmV2ZQd1bmkwMjE1B3VuaTFFRTUHdW5pMUVFNwV1aG9ybgd1bmkxRUU5B3VuaTFFRjEHdW5pMUVFQgd1bmkxRUVEB3VuaTFFRUYNdWh1bmdhcnVtbGF1dAd1bmkwMjE3B3VtYWNyb24HdW5pMUU3Qgd1b2dvbmVrBXVyaW5nBnV0aWxkZQd1bmkxRTc5BndhY3V0ZQt3Y2lyY3VtZmxleAl3ZGllcmVzaXMGd2dyYXZlC3ljaXJjdW1mbGV4B3VuaTFFOEYHdW5pMUVGNQZ5Z3JhdmUHdW5pMUVGNwd1bmkwMjMzB3VuaTFFRjkGemFjdXRlCnpkb3RhY2NlbnQHdW5pMUU5MxBpYWN1dGVfai5sb2NsTkxEBmEuc3MwMQthYWN1dGUuc3MwMQthYnJldmUuc3MwMQx1bmkxRUFGLnNzMDEMdW5pMUVCNy5zczAxDHVuaTFFQjEuc3MwMQx1bmkxRUIzLnNzMDEMdW5pMUVCNS5zczAxDHVuaTAxQ0Uuc3MwMRBhY2lyY3VtZmxleC5zczAxDHVuaTFFQTUuc3MwMQx1bmkxRUFELnNzMDEMdW5pMUVBNy5zczAxDHVuaTFFQTkuc3MwMQx1bmkxRUFCLnNzMDEMdW5pMDIwMS5zczAxDmFkaWVyZXNpcy5zczAxDHVuaTAyMjcuc3MwMQx1bmkxRUExLnNzMDELYWdyYXZlLnNzMDEMdW5pMUVBMy5zczAxDHVuaTAyMDMuc3MwMQxhbWFjcm9uLnNzMDEMYW9nb25lay5zczAxCmFyaW5nLnNzMDEPYXJpbmdhY3V0ZS5zczAxC2F0aWxkZS5zczAxC0lfSi5sb2NsTkxEC2lfai5sb2NsTkxEB3VuaTAzOTQFU2lnbWEHdW5pMDNBOQd1bmkwM0JDCG9uZS5zczAxDW9uZS50b3NmLnNzMDEJemVyby50b3NmCG9uZS50b3NmCHR3by50b3NmCnRocmVlLnRvc2YJZm91ci50b3NmCWZpdmUudG9zZghzaXgudG9zZgpzZXZlbi50b3NmCmVpZ2h0LnRvc2YJbmluZS50b3NmB3VuaTIwODAHdW5pMjA4MQd1bmkyMDgyB3VuaTIwODMHdW5pMjA4NAd1bmkyMDg1B3VuaTIwODYHdW5pMjA4Nwd1bmkyMDg4B3VuaTIwODkJemVyby5kbm9tCG9uZS5kbm9tCHR3by5kbm9tCnRocmVlLmRub20JZm91ci5kbm9tCWZpdmUuZG5vbQhzaXguZG5vbQpzZXZlbi5kbm9tCmVpZ2h0LmRub20JbmluZS5kbm9tCXplcm8ubnVtcghvbmUubnVtcgh0d28ubnVtcgp0aHJlZS5udW1yCWZvdXIubnVtcglmaXZlLm51bXIIc2l4Lm51bXIKc2V2ZW4ubnVtcgplaWdodC5udW1yCW5pbmUubnVtcgd1bmkyMDcwB3VuaTAwQjkHdW5pMDBCMgd1bmkwMEIzB3VuaTIwNzQHdW5pMjA3NQd1bmkyMDc2B3VuaTIwNzcHdW5pMjA3OAd1bmkyMDc5FnBlcmlvZGNlbnRlcmVkLmxvY2xDQVQKZmlndXJlZGFzaAd1bmkyMDE1B3VuaTIwMTAHdW5pMDBBRAd1bmkyMDA3B3VuaTIwMEEHdW5pMjAwOAd1bmkwMEEwB3VuaTIwMDkHdW5pMjAwQgd1bmkyMEI1DWNvbG9ubW9uZXRhcnkEZG9uZwRFdXJvB3VuaTIwQjIHdW5pMjBBRARsaXJhB3VuaTIwQkEHdW5pMjBCQwd1bmkyMEE2BnBlc2V0YQd1bmkyMEIxB3VuaTIwQkQHdW5pMjBCOQd1bmkyMEE5B3VuaTIyMTkHdW5pMjIxNQhlbXB0eXNldAd1bmkyMTI2B3VuaTIyMDYHdW5pMDBCNQd1bmlGOEZGB3VuaTIxMTMHdW5pMjExNgllc3RpbWF0ZWQGbWludXRlBnNlY29uZAd1bmkwMzA4B3VuaTAzMDcJZ3JhdmVjb21iCWFjdXRlY29tYgd1bmkwMzBCDWNhcm9uY29tYi5hbHQHdW5pMDMwMgd1bmkwMzBDB3VuaTAzMDYHdW5pMDMwQQl0aWxkZWNvbWIHdW5pMDMwNA1ob29rYWJvdmVjb21iB3VuaTAzMEYHdW5pMDMxMQd1bmkwMzEyB3VuaTAzMUIMZG90YmVsb3djb21iB3VuaTAzMjQHdW5pMDMyNgd1bmkwMzI3B3VuaTAzMjgHdW5pMDMyRQd1bmkwMzMxB3VuaTAzMzULdW5pMDMyNi5hbHQMdW5pMDMwOC5jYXNlDHVuaTAzMDcuY2FzZQ5ncmF2ZWNvbWIuY2FzZQ5hY3V0ZWNvbWIuY2FzZQx1bmkwMzBCLmNhc2UMdW5pMDMwMi5jYXNlDHVuaTAzMEMuY2FzZQx1bmkwMzA2LmNhc2UMdW5pMDMwQS5jYXNlDnRpbGRlY29tYi5jYXNlDHVuaTAzMDQuY2FzZRJob29rYWJvdmVjb21iLmNhc2UMdW5pMDMwRi5jYXNlDHVuaTAzMTEuY2FzZQx1bmkwMzEyLmNhc2UHdW5pMDJCQwd1bmkwMkJCB3VuaTAyQzkHdW5pMDJDQgd1bmkwMkJGB3VuaTAyQkUHdW5pMDJDQQd1bmkwMkNDB3VuaTAyQzgMdW5pMDJCRi5jYXNlDHVuaTAyQkUuY2FzZQljYXJvbi5hbHQLdW5pMDMwNjAzMDELdW5pMDMwNjAzMDALdW5pMDMwNjAzMDkLdW5pMDMwNjAzMDMLdW5pMDMwMjAzMDELdW5pMDMwMjAzMDALdW5pMDMwMjAzMDkLdW5pMDMwMjAzMDMQdW5pMDMwNjAzMDEuY2FzZRB1bmkwMzA2MDMwMC5jYXNlEHVuaTAzMDYwMzA5LmNhc2UQdW5pMDMwNjAzMDMuY2FzZRB1bmkwMzAyMDMwMS5jYXNlEHVuaTAzMDIwMzAwLmNhc2UQdW5pMDMwMjAzMDkuY2FzZRB1bmkwMzAyMDMwMy5jYXNlAAABAAH//wAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsACwAIMAgwLBAAACwQHsAAD/TAQ//u0Cy//3AsEB+P/4/0QEP/7tALAAsACDAIMBpwAAAsEB7AAA/0wEP/7tAav/+wLBAfj/+P9MBD/+7QCwALAAgwCDAsEBGgLBAewAAP9MBD/+7QLGARUCwQH4//j/RAQ//u2wACwgsABVWEVZICBLuAAOUUuwBlNaWLA0G7AoWWBmIIpVWLACJWG5CAAIAGNjI2IbISGwAFmwAEMjRLIAAQBDYEItsAEssCBgZi2wAiwgZCCwwFCwBCZasigBCkNFY0WwBkVYIbADJVlSW1ghIyEbilggsFBQWCGwQFkbILA4UFghsDhZWSCxAQpDRWNFYWSwKFBYIbEBCkNFY0UgsDBQWCGwMFkbILDAUFggZiCKimEgsApQWGAbILAgUFghsApgGyCwNlBYIbA2YBtgWVlZG7ABK1lZI7AAUFhlWVktsAMsIEUgsAQlYWQgsAVDUFiwBSNCsAYjQhshIVmwAWAt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';
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
          
        src: url(data:font/truetype;charset=utf-8;base64,${arialNormalBase64}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Arial';
          src: url(data:font/truetype;charset=utf-8;base64,${arialNormalBase64}) format('truetype');
          font-weight: bold;
          font-style: normal;
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
                font-size: 10px;
                color: #2c3e50;
            }
              .section-title-personales {
                background-color: #f0f0f0;
                padding: 10px 12px;
                font-weight: bold;
                border-left: 4px solid #D31A2B;
                  margin-left: 0mm;
                margin-bottom: 12px;
                font-size: 10px;
                color: #2c3e50;
            }
            .data-row {
                display: flex;
                margin-bottom: 3px;
                page-break-inside: avoid;
                font-size: 10px;
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
              <span >${persona.per_primerApellido} ${persona.per_segundoApellido} ${persona.per_nombres}</span>
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