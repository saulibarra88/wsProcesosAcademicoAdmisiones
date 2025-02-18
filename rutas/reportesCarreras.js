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
const ExcelJS  = require('exceljs');
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

  module.exports.ExcelListadoEstudiantesAsignaturDocente = async function (carrera, periodo,nivel,paralelo,CodMateria, cedula) {
    try {
        var resultado = await ProcesoExcelListadoEstudiantesAginaturaDocente(carrera, periodo,nivel,paralelo,CodMateria, cedula);
        return resultado
    } catch (error) {
        console.log(error);
    }
  }

  module.exports.ExcelListadoActasNoGeneradasCarreras = async function (carrera, periodo,listado) {
    try {
        var resultado = await ProcesoExcelActasNoGeneradasCarreras(carrera, periodo,listado);
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

async function ProcesoExcelListadoEstudiantesAginaturaDocente(carrera, periodo,nivel,paralelo,CodMateria, cedula) {
  try {
    var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + tools.CedulaSinGuion(cedula), { httpsAgent: agent });
            var datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
            var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
            var DatosAsignaturas =await procesoCupo.AsignaturasDatos(carrera,CodMateria)
            
            var periodoinfo =await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
            var respuesta=[]
     respuesta= await procesoacademico.ListadoEstudiantesAsignaturaDocente(carrera, periodo,nivel,paralelo,CodMateria, cedula)
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Listado de estudiantes');
    // Crear un header superior que combine las primeras 18 columnas

    worksheet.mergeCells('A1:G1');
    const headerespoch = worksheet.getCell('A1');
    headerespoch.value = 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO'; // Texto del header
    headerespoch.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
    headerespoch.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
    worksheet.mergeCells('A2:G2');
    const headerCell0 = worksheet.getCell('A2');
    headerCell0.value = 'FACULTAD: '+ datosCarrera.data[0].strNombreFacultad; // Texto del header
    headerCell0.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
    headerCell0.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
    worksheet.mergeCells('A3:G3');
    const headercarrera = worksheet.getCell('A3');
    headercarrera.value = 'CARRERA: '+ datosCarrera.data[0].strNombreCarrera; // Texto del header
    headercarrera.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
    headercarrera.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
    // Crear un header superior que combine las primeras 18 columnas
    worksheet.mergeCells('A4:G4'); // Combina de A1 a Q1 (18 columnas)
    const headerCell = worksheet.getCell('A4');
    headerCell.value = 'LISTADO DE ESTUDIANTES MATRICULADOS'; // Texto del header
    headerCell.font = { name: 'Arial', size: 11, bold: false }; // Tamaño y fuente Arial
    headerCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
    headerCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '9cccfc' }, // Color de fondo
    };
  
    // PAO
    worksheet.mergeCells('A5:B5'); 
    const headerCell2 = worksheet.getCell('A5');
    headerCell2.value = 'PAO:';
    headerCell2.font = { name: 'Arial', size: 9, bold: true };
    headerCell2.alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.mergeCells('C5:F5'); 
    const headerpao = worksheet.getCell('C5');
    headerpao.value = nivel;
    headerpao.font = { name: 'Arial', size: 9, bold: false };
    headerpao.alignment = { vertical: 'middle', horizontal: 'left' };
      
    // NIVEL
      worksheet.mergeCells('A6:B6'); 
      const headerCellNivel = worksheet.getCell('A6');
      headerCellNivel.value = 'PARALELO:';
      headerCellNivel.font = { name: 'Arial', size: 9, bold: true };
      headerCellNivel.alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.mergeCells('C6:G6'); 
      const headerNivel = worksheet.getCell('C6');
      headerNivel.value =paralelo;
      headerNivel.font = { name: 'Arial', size: 9, bold: false };
      headerNivel.alignment = { vertical: 'middle', horizontal: 'left' };
      // CEDULA
      worksheet.mergeCells('A7:B7'); 
      const headerCellCedula = worksheet.getCell('A7');
      headerCellCedula.value = 'CÉDULA:';
      headerCellCedula.font = { name: 'Arial', size: 9, bold: true };
      headerCellCedula.alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.mergeCells('C7:G7'); 
      const headerCedula = worksheet.getCell('C7');
      headerCedula.value = cedula;
      headerCedula.font = { name: 'Arial', size: 9, bold: false };
      headerCedula.alignment = { vertical: 'middle', horizontal: 'left' };
      // ASIGNATURA
          worksheet.mergeCells('A8:B8'); 
          const headerCellAsignatura = worksheet.getCell('A8');
          headerCellAsignatura.value = 'ASIGNATURA:';
          headerCellAsignatura.font = { name: 'Arial', size: 9, bold: true };
          headerCellAsignatura.alignment = { vertical: 'middle', horizontal: 'left' };
          worksheet.mergeCells('C8:G8'); 
          const headerAsig = worksheet.getCell('C8');
          headerAsig.value = DatosAsignaturas.data[0].strNombre;
          headerAsig.font = { name: 'Arial', size: 9, bold: false };
          headerAsig.alignment = { vertical: 'middle', horizontal: 'left' };
         // DOCENTE
         worksheet.mergeCells('A9:B9'); 
         const headerCellDocente = worksheet.getCell('A9');
         headerCellDocente.value = 'DOCENTE:';
         headerCellDocente.font = { name: 'Arial', size: 9, bold: true };
         headerCellDocente.alignment = { vertical: 'middle', horizontal: 'left' };
         worksheet.mergeCells('C9:G9'); 
         const headerDocente = worksheet.getCell('C9');
         headerDocente.value = strNombres;
         headerDocente.font = { name: 'Arial', size: 9, bold: false };
         headerDocente.alignment = { vertical: 'middle', horizontal: 'left' };
            // PERIODO
            worksheet.mergeCells('A10:B10'); 
            const headerCellPeriodo = worksheet.getCell('A10');
            headerCellPeriodo.value = 'PERIODO:';
            headerCellPeriodo.font = { name: 'Arial', size: 9, bold: true };
            headerCellPeriodo.alignment = { vertical: 'middle', horizontal: 'left' };
            worksheet.mergeCells('C10:G10'); 
            const headerPeriodo = worksheet.getCell('C10');
            headerPeriodo.value = periodoinfo.data[0].strDescripcion + "("+periodo+")";
            headerPeriodo.font = { name: 'Arial', size: 9, bold: false };
            headerPeriodo.alignment = { vertical: 'middle', horizontal: 'left' };
    // Obtener datos y agregar filas


  // Encabezados de tabla
  const headers = ['No', 'Código', 'Cédula', 'Apellidos','Nombres', 'Matrícula', 'No Matrícula'];
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
  respuesta.Datos.forEach((row, index) => {
    const rowData = [
      index + 1,
      row.strCodEstud,
      row.strCedula,
      row.strApellidos,
      row.strNombres,
      row.sintCodigo,
      row.bytNumMat,
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

  async function ProcesoExcelActasNoGeneradasCarreras(carrera, periodo,listado) {
    try {
              var datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
              
              var periodoinfo =await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
              var respuesta=[]
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Listado Actas');
      // Crear un header superior que combine las primeras 18 columnas
  
      worksheet.mergeCells('A1:H1');
      const headerespoch = worksheet.getCell('A1');
      headerespoch.value = 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO'; // Texto del header
      headerespoch.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
      headerespoch.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
      worksheet.mergeCells('A2:H2');
      const headerCell0 = worksheet.getCell('A2');
      headerCell0.value = 'FACULTAD: '+ datosCarrera.data[0].strNombreFacultad; // Texto del header
      headerCell0.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
      headerCell0.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
      worksheet.mergeCells('A3:H3');
      const headercarrera = worksheet.getCell('A3');
      headercarrera.value = 'CARRERA: '+ datosCarrera.data[0].strNombreCarrera; // Texto del header
      headercarrera.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
      headercarrera.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
      worksheet.mergeCells('A4:H4');
      const headerperiodo = worksheet.getCell('A4');
      headerperiodo.value = 'PERIODO: '+  periodoinfo.data[0].strDescripcion + "("+periodo+")" ; // Texto del header
      headerperiodo.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
      headerperiodo.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
      // Crear un header superior que combine las primeras 18 columnas
      worksheet.mergeCells('A5:H5'); // Combina de A1 a Q1 (18 columnas)
      const headerCell = worksheet.getCell('A5');
      headerCell.value = 'LISTADO DE ACTAS NO GENERADAS'; // Texto del header
      headerCell.font = { name: 'Arial', size: 11, bold: false }; // Tamaño y fuente Arial
      headerCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
      headerCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '9cccfc' }, // Color de fondo
      };
    


  
  
    // Encabezados de tabla
    const headers = ['No', 'Cédula', 'Apellidos','Nombres', 'Asignatura', 'Nivel','Paralelo','Acta'];
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
        row.strCedula,
        row.strApellidos,
        row.strNombres,
        row.strNombre,
        row.strCodNivel,
        row.strCodParalelo,
        row.strdescripcionacta
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
  
   // Retornar la cadena Base64
   const buffer = await workbook.xlsx.writeBuffer();
  const base64 = buffer.toString('base64');
  
  
  // Guardar archivo Excel
   //  const fs = require('fs');
  //   fs.writeFileSync('ListadoActaNoGeneradas.xlsx', buffer);
    return base64;
        
        } catch (error) {
            console.error(error);
            return 'ERROR';
        }
    }

