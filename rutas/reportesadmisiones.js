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
const xlsx = require('xlsx');
const { JSDOM } = require('jsdom');

module.exports.PdfListadosEstudiantesAdmisiones = async function (listado, strBaseCarrera, cedulaUsuario) {
    try {
        var resultado = await ProcesoPdfListadosEstudiantesAdmisiones(listado, strBaseCarrera, cedulaUsuario);
        return resultado
    } catch (error) {
        console.log(error);
    }
}
module.exports.ExcelListadosEstudiantesAdmisiones = async function (listado, strBaseCarrera, cedulaUsuario) {
    try {
        var resultado = await ProcesoExcelListadosEstudiantesAdmisiones(listado, strBaseCarrera, cedulaUsuario);
        return resultado
    } catch (error) {
        console.log(error);
    }
}

const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});




async function ProcesoPdfListadosEstudiantesAdmisiones(listado, strBaseCarrera, cedula) {
    try {
        try {
            var datosCarrera = await procesoCupo.ObtenerDatosBase(strBaseCarrera);
            var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
            var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
            var Cedula = ObtenerPersona.data.listado[0].pid_valor
            var bodylistado = "";
            var contadot = 0;
            for (let estudiantes of listado) {
                contadot = contadot + 1;
                bodylistado += `<tr >
    <td style="font-size: 10px; text-align: center">
     ${contadot}
   </td>
   <td style="font-size: 11px; text-align: center">
     <strong>CÉDULA: </strong>  ${estudiantes.AspirantePostulacion.Persona.perCedula}<br/>
     <strong>CELULAR: </strong>  ${estudiantes.AspirantePostulacion.Persona.perCelular}<br/>
     <strong>CORREO: </strong>  ${estudiantes.AspirantePostulacion.Persona.perEmailAlternativo}
   </td>
   <td style="font-size: 11px; text-align: center">
     ${estudiantes.AspirantePostulacion.Persona.perApellidos}   ${estudiantes.AspirantePostulacion.Persona.perNombres}
   </td>
   <td style="font-size: 11px; text-align: center">
     <strong>MATRICULA: </strong>  <span [ngStyle]="{'color':estudiantes.habilitarMatricula==true?'green':'orange'}">${estudiantes.habilitarMatricula == true ? 'HABILITADA' : 'NO HABILITADA'} </span>  <br/>
     <strong> FECHA:</strong>  ${estudiantes.minsFecha == '' ? 'NO REGISTRO' : estudiantes.minsFecha} <br/>
     <strong> INGRESA A :</strong>  ${estudiantes.minsCarrera == false ? 'NIVELACIÓN' : 'CARRERA'} 
    </td>
   <td style="font-size: 11px; text-align: center">
    ${estudiantes.AspirantePostulacion.Fase.croNombre} POSTULACIÓN<br/>
    NOTA: <strong>${estudiantes.acuNota}</strong> 
   </td>

   <td style="font-size: 11px; text-align: center">
   <strong>CARRERA :</strong>  ${estudiantes.AspirantePostulacion.Carrera.carNombre}<br/>
   <strong>SEDE :</strong>   ${estudiantes.AspirantePostulacion.Carrera.Sede.sedNombre}
   </td>

   <td style="font-size: 11px; text-align: center; width: 200px;"  >
     <strong style="'color':estudiantes.Estado.estDescripcion=='ACEPTADO'?'green':'orange'}">${estudiantes.Estado.estDescripcion}</strong>  <br/>
     <strong >CONFIRMACIÓN :</strong>  ${estudiantes.acuFechaConfirmacion}  
   </td>

 </tr>`

            }


            const htmlContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
             
              <style>
            
                table {
                  border-collapse: collapse;
                  width: 100%;
                }
                th, td {
            
                  padding: 6px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                }
                .nombre {
                  margin-top: 7em;
                  text-align: center;
                  width: 100%;
                }
                hr{
                  width: 60%;
                }
              </style>
            </head>
            <body>
            <p style='text-align: center;font-size: 11px'> <strong>ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO</strong>  </p><p style='text-align: center;font-size: 10px'> <strong>FACULTAD: ${datosCarrera.data[0].strNombreFacultad}</strong> </p><p style='text-align: center;font-size: 10px'><strong>CARRERA: ${datosCarrera.data[0].strNombreCarrera}</strong> </p>

              <table border=2>
              <thead>
              <tr>
                     <th colspan="12" style="text-align: center; font-size: 10px">
                         INFORMACIÓN.
                     </th>
                 </tr>
                <tr>
                  <th style="font-size: 10px;text-align: center;">N°</th>
                  <th style="font-size: 10px;text-align: center;">DATOS</th>
                  <th  style="font-size: 10px;text-align: center;">APELLIDOS Y NOMBRES</th>
                  <th style="font-size: 10px;text-align: center;">HABILITAR MAT. ADMISIONES</th>
                  <th  style="font-size: 10px;text-align: center;">FASE</th>
                  <th style="font-size: 10px;text-align: center;">CARRERA</th>
                  <th  style="font-size: 10px;text-align: center;">ASIGNACIÓN CUPO</th>
                </tr>
              </thead>

              <tbody>
                 ${bodylistado}
                </tbody>
              </table>
              <br/><br/>
              <p style="text-align: center;"> <strong>----------------------------------------</strong></p>
              <p style="text-align: center;font-size: 11px;"> GENERADO POR:</p>
              <p style="text-align: center;font-size: 11px;">${strNombres}</p>
            </body>
            </html>
            `;

            var htmlCompleto = tools.headerOcultoHtml() + htmlContent + tools.footerOcultoHtml();
            const options = {
                format: 'A4',
                orientation: 'landscape',
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
    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}
async function ProcesoExcelListadosEstudiantesAdmisiones(listado, strBaseCarrera, cedula) {
    try {
        try {
            var datosCarrera = await procesoCupo.ObtenerDatosBase(strBaseCarrera);
            var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
            var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
            var Cedula = ObtenerPersona.data.listado[0].pid_valor
            var bodylistado = "";
            var contadot = 0;
            for (let estudiantes of listado) {
                contadot = contadot + 1;
                bodylistado += `<tr >
    <td style="font-size: 10px; text-align: center">
     ${contadot}
   </td>
   <td style="font-size: 11px; text-align: center">
     <strong>CÉDULA: </strong>  ${estudiantes.AspirantePostulacion.Persona.perCedula}<br/>
     <strong>CELULAR: </strong>  ${estudiantes.AspirantePostulacion.Persona.perCelular}<br/>
     <strong>CORREO: </strong>  ${estudiantes.AspirantePostulacion.Persona.perEmailAlternativo}
   </td>
   <td style="font-size: 11px; text-align: center">
     ${estudiantes.AspirantePostulacion.Persona.perApellidos}   ${estudiantes.AspirantePostulacion.Persona.perNombres}
   </td>
   <td style="font-size: 11px; text-align: center">
     <strong>MATRICULA: </strong>  <span [ngStyle]="{'color':estudiantes.habilitarMatricula==true?'green':'orange'}">${estudiantes.habilitarMatricula == true ? 'HABILITADA' : 'NO HABILITADA'} </span>  <br/>
     <strong> FECHA:</strong>  ${estudiantes.minsFecha == '' ? 'NO REGISTRO' : estudiantes.minsFecha} <br/>
     <strong> INGRESA A :</strong>  ${estudiantes.minsCarrera == false ? 'NIVELACIÓN' : 'CARRERA'} 
    </td>
   <td style="font-size: 11px; text-align: center">
    ${estudiantes.AspirantePostulacion.Fase.croNombre} POSTULACIÓN<br/>
    NOTA: <strong>${estudiantes.acuNota}</strong> 
   </td>

   <td style="font-size: 11px; text-align: center">
   <strong>CARRERA :</strong>  ${estudiantes.AspirantePostulacion.Carrera.carNombre}<br/>
   <strong>SEDE :</strong>   ${estudiantes.AspirantePostulacion.Carrera.Sede.sedNombre}
   </td>

   <td style="font-size: 11px; text-align: center; width: 200px;"  >
     <strong style="'color':estudiantes.Estado.estDescripcion=='ACEPTADO'?'green':'orange'}">${estudiantes.Estado.estDescripcion}</strong>  <br/>
     <strong >CONFIRMACIÓN :</strong>  ${estudiantes.acuFechaConfirmacion}  
   </td>

 </tr>`

            }


            const htmlContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
             
              <style>
            
                table {
                  border-collapse: collapse;
                  width: 100%;
                }
                th, td {
            
                  padding: 6px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                }
                .nombre {
                  margin-top: 7em;
                  text-align: center;
                  width: 100%;
                }
                hr{
                  width: 60%;
                }
              </style>
            </head>
            <body>
            <p style='text-align: center;font-size: 11px'> <strong>ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO</strong>  </p><p style='text-align: center;font-size: 10px'> <strong>FACULTAD: ${datosCarrera.data[0].strNombreFacultad}</strong> </p><p style='text-align: center;font-size: 10px'><strong>CARRERA: ${datosCarrera.data[0].strNombreCarrera}</strong> </p>

              <table border=2>
              <thead>
              <tr>
                     <th colspan="12" style="text-align: center; font-size: 10px">
                         INFORMACIÓN.
                     </th>
                 </tr>
                <tr>
                  <th style="font-size: 10px;text-align: center;">N°</th>
                  <th style="font-size: 10px;text-align: center;">DATOS</th>
                  <th  style="font-size: 10px;text-align: center;">APELLIDOS Y NOMBRES</th>
                  <th style="font-size: 10px;text-align: center;">HABILITAR MAT. ADMISIONES</th>
                  <th  style="font-size: 10px;text-align: center;">FASE</th>
                  <th style="font-size: 10px;text-align: center;">CARRERA</th>
                  <th  style="font-size: 10px;text-align: center;">ASIGNACIÓN CUPO</th>
                </tr>
              </thead>

              <tbody>
                 ${bodylistado}
                </tbody>
              </table>
              <br/><br/>
              <p style="text-align: center;"> <strong>----------------------------------------</strong></p>
              <p style="text-align: center;font-size: 11px;"> GENERADO POR:</p>
              <p style="text-align: center;font-size: 11px;">${strNombres}</p>
            </body>
            </html>
            `;
// Pie de página HTML
const footer = `
    <footer>
        <p>Pie de página</p>
        <p>Información del pie de página aquí...</p>
    </footer>
</body>
</html>
`;
const header = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte</title>
    <style>
        /* Estilos CSS para el encabezado y pie de página */
        header {
            text-align: center;
            padding: 20px;
            background-color: #f2f2f2;
        }
        footer {
            text-align: center;
            padding: 10px;
            position: absolute;
            bottom: 0;
            width: 100%;
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <header>
        <h1>Encabezado</h1>
        <p>Información del encabezado aquí...</p>
    </header>
`;
            var htmlCompleto = header + htmlContent + footer;
         
// Crea un DOM a partir del contenido HTML
const dom = new JSDOM(htmlCompleto);

// Obtiene la tabla del DOM
const table = dom.window.document.querySelector('table');


// Crea un array para almacenar los datos de la tabla
const data = [];

// Itera sobre las filas de la tabla y guarda los datos en el array
table.querySelectorAll('tr').forEach(row => {
    const rowData = [];
    row.querySelectorAll('td, th').forEach(cell => {
        rowData.push(cell.textContent.trim());
    });
    data.push(rowData);
});

// Crea un libro de trabajo de Excel
const wb = xlsx.utils.book_new();

// Crea una hoja de trabajo y agrega los datos
const ws = xlsx.utils.aoa_to_sheet(data);

// Añadir encabezado a la hoja

ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }]; 

ws['A1'] = { v: 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO', t: 's', s: { font: { bold: true }, alignment: { horizontal: "center" } } };


xlsx.utils.book_append_sheet(wb, ws, 'Hoja1');
const tempFilePath = 'temp.xlsx';
// Escribe el libro de trabajo en un archivo Excel
xlsx.writeFile(wb, tempFilePath);
// Leer el archivo y convertirlo a base64
const fileData = fs.readFileSync(tempFilePath, { encoding: 'base64' });

// Eliminar el archivo temporal
fs.unlinkSync(tempFilePath);
return fileData;
            return null
        } catch (error) {
            console.error(error);
            return 'ERROR';
        }
    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}

function generarPDF(htmlCompleto, options) {
    return new Promise((resolve, reject) => {
        pdf.create(htmlCompleto, options).toFile("reportes.pdf", function (err, res) {
            if (err) {
                reject(err);
            } else {
                fs.readFile(res.filename, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        // Convertir a base64
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