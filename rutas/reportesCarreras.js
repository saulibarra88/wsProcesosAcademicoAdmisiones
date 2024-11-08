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
const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});
module.exports.PdfListadoEstudiantesEstadoCupo = async function (listado,cedulaUsuario,periodo,estado) {
  try {
      var resultado = await ProcesoPdfListadoEstudiantesCuposEstados(listado,cedulaUsuario,periodo,estado);
      return resultado
  } catch (error) {
      console.log(error);
  }
}
module.exports.ExcelListadoEstudiantesCuposEstados = async function (listado) {
  try {
      var resultado = await ProcesoExcelListadoEstudiantesCuposEstados(listado);
      return resultado
  } catch (error) {
      console.log(error);
  }
}
module.exports.PdfListadoDocumentosCarreras = async function (listado,cedulaUsuario,periodo) {
    try {
        var resultado = await ProcesoPdfListadoDocumentosCarreras(listado,cedulaUsuario,periodo);
        return resultado
    } catch (error) {
        console.log(error);
    }
  }

  module.exports.PdfListadoEstudianteMatriculasTerceraySegunda = async function (listado,carrera,cedulaUsuario,periodo,tipo) {
    try {
        var resultado = await ProcesoPdfTerceraSegundaMatriculaCarrera(listado,carrera,cedulaUsuario,periodo,tipo);
        return resultado
    } catch (error) {
        console.log(error);
    }
  }
  module.exports.PdfListadoEstudianteMatriculasTerceraySegundaGeneral = async function (listado,carrera,cedulaUsuario,periodo) {
    try {
        var resultado = await ProcesoPdfTerceraSegundaMatriculaCarreraGeneral(listado,carrera,cedulaUsuario,periodo);
        return resultado
    } catch (error) {
        console.log(error);
    }
  }
  module.exports.PdfListadoEstudiantesAsignaturaAprueban = async function (listado,carrera,cedulaUsuario,periodo) {
    try {
        var resultado = await ProcesoPdfEstudianteAsignaturaAprueban(listado,carrera,cedulaUsuario,periodo);
        return resultado
    } catch (error) {
        console.log(error);
    }
  }
async function ProcesoPdfListadoDocumentosCarreras(listado, cedula,periodo) {
    try {
        try {
      
            var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
            var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
            var Cedula = ObtenerPersona.data.listado[0].pid_valor
            var periodoinfo =await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
            var bodylistado = "";
            var contadot = 0;
            for (let carreras of listado) {
                contadot = contadot + 1;
                bodylistado += `<tr >
                              <td style="font-size: 10px; text-align: center">
                              ${contadot}
                            </td>
                            <td style="font-size: 11px; text-align: left">
                              ${carreras.Carrera}
                              
                            </td>
                            <td style="font-size: 11px; text-align: center">
                              ${carreras.CantidadPendientes}  
                            </td>
                            <td style="font-size: 11px; text-align: center">
                              ${carreras.CantidadFirmadas}  
                            </td>
  
  </tr>`
            }
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <style> table { border-collapse: collapse; width: 100%; } th, td { padding: 6px; text-align: left; } .nombre { margin-top: 7em; text-align: center; width: 100%; } hr{ width: 60%; } </style>
            </head>
            <body>
            <p style='text-align: center;font-size: 11px'> <strong>ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO</strong> </p>
            <p style='text-align: center;font-size: 11px'> <strong>INFORMACIÓN DE DOCUMENTOS LEGALIZADOS MATRICULAS</strong> </p>
            <p style='text-align: center;font-size: 11px'> <strong>PERIODO:   ${periodoinfo.data[0].strDescripcion}  </strong> </p><br/>
  
              <table border=2>
              <thead>
              <tr>
                     <th colspan="12" style="text-align: center; font-size: 10px">
                         INFORMACIÓN.
                     </th>
                 </tr>
                <tr>
                  <th style="font-size: 10px;text-align: center;">N°</th>
                  <th style="font-size: 10px;text-align: center;">CARRERA</th>
                  <th  style="font-size: 10px;text-align: center;">DOC. PEDIENTES </th>
                  <th style="font-size: 10px;text-align: center;">DOC. FIRMADOS</th>
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

async function ProcesoPdfTerceraSegundaMatriculaCarrera(listado, carrera,cedula,periodo,tipo) {
    try {
        try {
      
            var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
            var datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
            var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
            var Cedula = ObtenerPersona.data.listado[0].pid_valor
            var periodoinfo =await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
            var bodylistado = "";
            var contadot = 0;
            var titulo=''
            if(tipo==3){
              titulo='ESTUDIANTES CON TERCERAS MATRÍCULAS'
            }
            if(tipo==2){
              titulo='ESTUDIANTES CON SEGUNDAS MATRÍCULAS'
            }
            for (let carreras of listado) {
                contadot = contadot + 1;
                                          bodylistado += `<tr >
                              <td style="font-size: 10px; text-align: center">
                              ${contadot}
                            </td>
                            <td style="font-size: 11px; text-align: left">
                              ${carreras.strApellidos}    ${carreras.strNombres}
                              
                            </td>
                             <td style="font-size: 11px; text-align: left">
                              ${carreras.strCedula}
                              
                            </td>
                            <td style="font-size: 11px; text-align: center">
                              ${carreras.strCodNivel}  
                            </td>
                            <td style="font-size: 11px; text-align: center">
                              ${carreras.CantidadMaterias}  
                            </td>
  
                           </tr>`
            }
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <style> table { border-collapse: collapse; width: 100%; } th, td { padding: 6px; text-align: left; } .nombre { margin-top: 7em; text-align: center; width: 100%; } hr{ width: 60%; } </style>
            </head>
            <body>
            
            <p style='text-align: center;font-size: 11px'> <strong>${titulo}</strong> </p>
            <p style='text-align: center;font-size: 11px'> <strong>PERIODO:   ${periodoinfo.data[0].strDescripcion}  </strong> </p><br/>
  
              <table border=2>
              <thead>
              <tr>
                     <th colspan="12" style="text-align: center; font-size: 10px">
                         INFORMACIÓN.
                     </th>
                 </tr>
                <tr>
                  <th style="font-size: 10px;text-align: center;">N°</th>
                  <th style="font-size: 10px;text-align: center;">ESTUDIANTES</th>
                  <th style="font-size: 10px;text-align: center;">CÉDULA</th>
                  <th style="font-size: 10px;text-align: center;">NIVEL</th>
                  <th  style="font-size: 10px;text-align: center;">CANTIDAD ASIGNATURAS</th>
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
  
            var htmlCompleto = tools.headerOcultoHtmlCarreras(datosCarrera.data[0]) + htmlContent + tools.footerOcultoHtml();
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
                    contents: tools.headerHtmlCarreras(datosCarrera.data[0])
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
  async function ProcesoPdfTerceraSegundaMatriculaCarreraGeneral(listado, carrera,cedula,periodo) {
    try {
        try {
      
            var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
            var datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
            var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
            var Cedula = ObtenerPersona.data.listado[0].pid_valor
            var periodoinfo =await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
            var bodylistado = "";
            var contadot = 0;
            var titulo=''
           
            for (let carreras of listado) {
                contadot = contadot + 1;
                                          bodylistado += `<tr >
                              <td style="font-size: 10px; text-align: center">
                              ${contadot}
                            </td>
                            <td style="font-size: 11px; text-align: left">
                              ${carreras.strApellidos}    ${carreras.strNombres}
                              
                            </td>
                             <td style="font-size: 11px; text-align: left">
                              ${carreras.strCedula}
                              
                            </td>
                            <td style="font-size: 11px; text-align: center">
                              ${carreras.strCodNivel}  
                            </td>
                            <td style="font-size: 11px; text-align: center">
                              ${carreras.cantidadprimera}  
                            </td>
     <td style="font-size: 11px; text-align: center">
                              ${carreras.cantidadsegunda}  
                            </td>
                               <td style="font-size: 11px; text-align: center">
                              ${carreras.cantidadtercera}  
                            </td>
                              <td style="font-size: 11px; text-align: center">
                              ${carreras.cantidadtotal}  
                            </td>
                           </tr>`
            }
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <style> table { border-collapse: collapse; width: 100%; } th, td { padding: 6px; text-align: left; } .nombre { margin-top: 7em; text-align: center; width: 100%; } hr{ width: 60%; } </style>
            </head>
            <body>
            
            <p style='text-align: center;font-size: 11px'> <strong>LISTADO DE ESTUDIANTE ASIGNATURAS CON MATRÍCULAS</strong> </p>
            <p style='text-align: center;font-size: 11px'> <strong>PERIODO:   ${periodoinfo.data[0].strDescripcion}  </strong> </p><br/>
  
              <table border=2>
              <thead>
              <tr>
                     <th colspan="12" style="text-align: center; font-size: 10px">
                         INFORMACIÓN MATRÍCULAS ASIGNATURAS.
                     </th>
                 </tr>
                <tr>
                  <th style="font-size: 10px;text-align: center;">N°</th>
                  <th style="font-size: 10px;text-align: center;">ESTUDIANTES</th>
                  <th style="font-size: 10px;text-align: center;">CÉDULA</th>
                  <th style="font-size: 10px;text-align: center;">NIVEL</th>
                  <th  style="font-size: 10px;text-align: center;">1RA</th>
                  <th  style="font-size: 10px;text-align: center;">2DA </th>
                  <th  style="font-size: 10px;text-align: center;">3RA </th>
                  <th  style="font-size: 10px;text-align: center;">TOTAL</th>
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
  
            var htmlCompleto = tools.headerOcultoHtmlCarreras(datosCarrera.data[0]) + htmlContent + tools.footerOcultoHtml();
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
                    contents: tools.headerHtmlCarreras(datosCarrera.data[0])
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
  async function ProcesoPdfEstudianteAsignaturaAprueban(listado, carrera,cedula,periodo) {
    try {
        try {
      console.log(listado, carrera,cedula,periodo)
            var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
            var datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
            var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
            var Cedula = ObtenerPersona.data.listado[0].pid_valor
            var periodoinfo =await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
            var bodylistado = "";
            var contadot = 0;
            var titulo=''
           
            for (let carreras of listado) {
                contadot = contadot + 1;
                                          bodylistado += `<tr >
                              <td style="font-size: 10px; text-align: center">
                              ${contadot}
                            </td>
                            <td style="font-size: 11px; text-align: left">
                              ${carreras.strCodMateria}   
                              
                            </td>
                             <td style="font-size: 11px; text-align: left">
                              ${carreras.strNombre}
                              
                            </td>
                            <td style="font-size: 11px; text-align: center">
                              ${carreras.strCodNivel}  
                            </td>
                          

                               <td style="font-size: 11px; text-align: center">
                              ${carreras.totalAprobados}  
                            </td>
                              <td style="font-size: 11px; text-align: center">
                              ${carreras.totalReprobados}  
                            </td>
                             <td style="font-size: 11px; text-align: center">
                              ${carreras.total}  
                            </td>
                           </tr>`
            }
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <style> table { border-collapse: collapse; width: 100%; } th, td { padding: 6px; text-align: left; } .nombre { margin-top: 7em; text-align: center; width: 100%; } hr{ width: 60%; } </style>
            </head>
            <body>
            
            <p style='text-align: center;font-size: 11px'> <strong>LISTADO DE ESTUDIANTE APROBADOS Y REPROBADOS </strong> </p>
            <p style='text-align: center;font-size: 11px'> <strong>PERIODO:   ${periodoinfo.data[0].strDescripcion}  </strong> </p><br/>
  
              <table border=2>
              <thead>
              <tr>
                     <th colspan="12" style="text-align: center; font-size: 10px">
                         INFORMACIÓN ASIGNATURAS.
                     </th>
                 </tr>
                <tr>
                  <th style="font-size: 10px;text-align: center;">N°</th>
                  <th style="font-size: 10px;text-align: center;">CODIGO</th>
                  <th style="font-size: 10px;text-align: center;">ASIGNATURA</th>
                  <th style="font-size: 10px;text-align: center;">NIVEL</th>
                  <th  style="font-size: 10px;text-align: center;">APRUEBAN </th>
                  <th  style="font-size: 10px;text-align: center;">REPRUEBAN </th>
                  <th  style="font-size: 10px;text-align: center;">TOTAL</th>
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
  
            var htmlCompleto = tools.headerOcultoHtmlCarreras(datosCarrera.data[0]) + htmlContent + tools.footerOcultoHtml();
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
                    contents: tools.headerHtmlCarreras(datosCarrera.data[0])
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
  async function ProcesoPdfListadoEstudiantesCuposEstados(listado, cedula,periodo,estado) {
    try {
        try {
      
            var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
            var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
            var Cedula = ObtenerPersona.data.listado[0].pid_valor
            var periodoinfo =await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
            var bodylistado = "";
            var contadot = 0;
            for (let carreras of listado) {
                contadot = contadot + 1;
                bodylistado += `<tr >
                              <td style="font-size: 10px; text-align: center">
                              ${contadot}
                            </td>
                            <td style="font-size: 10px; text-align: left">
                              ${carreras.identificacion}
                              
                            </td>
                            <td style="font-size: 10px; text-align: center">
                              ${carreras.Estudiante.strNombres}   ${carreras.Estudiante.strApellidos} 
                            </td>
                            <td style="font-size: 10px; text-align: center">
                              ${carreras.Carrera.strNombreCarrera}  
                            </td>
                              <td style="font-size: 10px; text-align: center">
                              ${carreras.dcupobservacion}  
                            </td>
                              <td style="font-size: 10px; text-align: center">
                              ${carreras.Estado.estnombre}  
                            </td>
  
  </tr>`
            }
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <style> table { border-collapse: collapse; width: 100%; } th, td { padding: 6px; text-align: left;font-size: 11px; } .nombre { margin-top: 7em; text-align: center; width: 100%; } hr{ width: 60%; } </style>
            </head>
            <body>
            <p style='text-align: center;font-size: 11px'> <strong>ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO</strong> </p>
            <p style='text-align: center;font-size: 11px'> <strong>INFORMACIÓN ESTUDIANTE CUPOS</strong> </p>
            <p style='text-align: center;font-size: 11px'> <strong>ESTADO CUPO ACADÉMICO:   ${estado.estnombre}  </strong> </p>
            <p style='text-align: center;font-size: 11px'> <strong>PERIODO:   ${periodoinfo.data[0].strDescripcion}  </strong> </p><br/>
  
              <table border=2>
              <thead>
              <tr>
                     <th colspan="12" style="text-align: center; font-size: 10px">
                         INFORMACIÓN.
                     </th>
                 </tr>
                <tr>
                  <th style="font-size: 10px;text-align: center;">N°</th>
                  <th style="font-size: 10px;text-align: center;">CEDULA EST.</th>
                  <th  style="font-size: 10px;text-align: center;">NOMBRES Y APELLIDOS </th>
                  <th style="font-size: 10px;text-align: center;">CARRERA</th>
                  
                  <th style="font-size: 10px;text-align: center;">DESCRIPCIÓN</th>
                  <th style="font-size: 10px;text-align: center;">CUPO</th>
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
  async function ProcesoExcelListadoEstudiantesCuposEstados(listado) {
    try {
        try {
          var bodylistado = "";
          var contadot = 0;
          for (let carreras of listado) {
            contadot = contadot + 1;
            bodylistado += `<tr >
                          <td style="font-size: 10px; text-align: center">
                          ${contadot}
                        </td>
                        <td style="font-size: 10px; text-align: left">
                          ${carreras.Estudiante.pid_valor}
                          
                        </td>
                        <td style="font-size: 10px; text-align: center">
                          ${carreras.Estudiante.per_nombres}   ${carreras.Estudiante.per_primerApellido}  ${carreras.Estudiante.per_segundoApellido} 
                        </td>
                        <td style="font-size: 10px; text-align: center">
                          ${carreras.Carrera.strNombreCarrera}  
                        </td>
                          <td style="font-size: 10px; text-align: center">
                          ${carreras.dcupobservacion}  
                        </td>
                          <td style="font-size: 10px; text-align: center">
                          ${carreras.Estado.estnombre}  
                        </td>

</tr>`
        }
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <style> table { border-collapse: collapse; width: 100%; } th, td { padding: 6px; text-align: left;font-size: 11px; } .nombre { margin-top: 7em; text-align: center; width: 100%; } hr{ width: 60%; } </style>
        </head>
        <body>
        <p style='text-align: center;font-size: 11px'> <strong>ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO</strong> </p>
        <p style='text-align: center;font-size: 11px'> <strong>INFORMACIÓN ESTUDIANTE CUPOS</strong> </p>
       
          <table border=2>
          <thead>
          <tr>
                 <th colspan="12" style="text-align: center; font-size: 10px">
                     INFORMACIÓN.
                 </th>
             </tr>
            <tr>
              <th style="font-size: 10px;text-align: center;">N°</th>
              <th style="font-size: 10px;text-align: center;">CEDULA EST.</th>
              <th  style="font-size: 10px;text-align: center;">NOMBRES Y APELLIDOS </th>
              <th style="font-size: 10px;text-align: center;">CARRERA</th>
              
              <th style="font-size: 10px;text-align: center;">DESCRIPCIÓN</th>
              <th style="font-size: 10px;text-align: center;">CUPO</th>
            </tr>
          </thead>

          <tbody>
             ${bodylistado}
            </tbody>
          </table>
          <br/><br/>
          <p style="text-align: center;"> <strong>----------------------------------------</strong></p>
          <p style="text-align: center;font-size: 11px;"> GENERADO POR:</p>
       
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
  const tempFilePath = 'ReporteExcelEstdoCupo.xlsx';
  // Escribe el libro de trabajo en un archivo Excel
  xlsx.writeFile(wb, tempFilePath);
  // Leer el archivo y convertirlo a base64
  const fileData = fs.readFileSync(tempFilePath, { encoding: 'base64' });
  
  // Eliminar el archivo temporal
  //fs.unlinkSync(tempFilePath);
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
        pdf.create(htmlCompleto, options).toFile("ReporteEstadoCupo.pdf", function (err, res) {
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
                   /*    fs.unlink(res.filename, (err) => {
                            if (err) {
                                console.error('Error al eliminar el archivo PDF:', err);
                            } else {
                                console.log('Archivo PDF eliminado.');
                            }
                        });*/

                        // Resolver la promesa con base64Data
                        resolve(base64Data);
                    }
                });
            }
        });
    });
}