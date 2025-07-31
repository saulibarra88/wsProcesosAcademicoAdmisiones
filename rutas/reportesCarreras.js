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
  module.exports.ExcelReporteMaticulasCarrerasIndividual = async function (carrera, periodo,listado) {
    try {
        var resultado = await ProcesoExcelMatriculasCarrerasIndividual(carrera, periodo,listado);
        return resultado
    } catch (error) {
        console.log(error);
    }
  }
  module.exports.ExcelReporteMaticulasCarrerasInstitucional = async function ( periodo,listado) {
    try {
        var resultado = await ProcesoExcelMatriculasCarrerasInstitucional(periodo,listado);
        return resultado
    } catch (error) {
        console.log(error);
    }
  }
    module.exports.ExcelReporteMaticulasNivelacionInstitucional = async function ( periodo,listado) {
    try {
        var resultado = await ProcesoExcelMatriculasNivelacionInstitucional(periodo,listado);
        return resultado
    } catch (error) {
        console.log(error);
    }
  }
  module.exports.ExcelReporteMaticulasAdmisionesInstitucional = async function ( periodo,listado) {
    try {
        var resultado = await ProcesoExcelMatriculasAdminisionesInstitucional(periodo,listado);
        return resultado
    } catch (error) {
        console.log(error);
    }
  }
    module.exports.ExcelReporteFinanciero = async function ( listado) {
    try {
        var resultado = await ProcesoFinancieroExcel(listado);
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
                            <td style="font-size: 9px; text-align: left">
                              ${carreras.strCodMateria}   
                              
                            </td>
                             <td style="font-size: 10px; text-align: left">
                              ${carreras.strNombre}
                              
                            </td>
                            <td style="font-size: 9px; text-align: center">
                              ${carreras.strCodNivel}  
                            </td>
                            <td style="font-size: 9px; text-align: center">
                              ${carreras.cantidadtotal}  
                            </td>
                            <td style="font-size: 9px; text-align: center">
                              ${carreras.cantidadprimera}  
                            </td>
                               <td style="font-size: 9px; text-align: center">
                              ${carreras.cantidadsegunda}  
                            </td>
                               <td style="font-size: 9px; text-align: center">
                              ${carreras.cantidadtercera}  
                            </td>
                               <td style="font-size: 9px; text-align: center">
                              ${carreras.repitencia}  
                            </td>
                               <td style="font-size: 9px; text-align: center">
                              ${carreras.Aprueban}  
                            </td>
                              <td style="font-size: 9px; text-align: center">
                              ${carreras.Reprueban}  
                            </td>
                              </td>
                              <td style="font-size: 9px; text-align: center">
                              ${carreras.retiros}  
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
            
            <p style='text-align: center;font-size: 11px'> <strong>LISTADO DE ASIGNATURAS POR CARRERAS INFORMACIÓN MATRÍCULAS</strong> </p>
            <p style='text-align: center;font-size: 11px'> <strong>PERIODO:   ${periodoinfo.data[0].strDescripcion}  </strong> </p><br/>
  
              <table border=2>
              <thead>
              <tr>
                     <th colspan="12" style="text-align: center; font-size: 10px">
                         INFORMACIÓN ASIGNATURAS.
                     </th>
                 </tr>
                <tr>
                  <th style="font-size: 9px;text-align: center;">N°</th>
                  <th style="font-size: 9px;text-align: center;">CÓDIGO</th>
                  <th style="font-size: 9px;text-align: center;">ASIGNATURA</th>
                  <th style="font-size: 9px;text-align: center;">PAO</th>
                  <th style="font-size: 9px;text-align: center;">MATRICULADOS</th>
                  <th style="font-size: 9px;text-align: center;">PRIMERA</th>
                  <th style="font-size: 9px;text-align: center;">SEGUNDA</th>
                  <th style="font-size: 9px;text-align: center;">TERCERA</th>
                  <th style="font-size: 9px;text-align: center;">REPITEN</th>
                  <th  style="font-size: 9px;text-align: center;">APRUEBAN </th>
                  <th  style="font-size: 9px;text-align: center;">REPRUEBAN </th>
                  <th  style="font-size: 9px;text-align: center;">RETIROS </th>
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
                orientation: 'landscape', // Establecer orientación horizontal
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
        pdf.create(htmlCompleto, options).toFile("ReporteEstudiantesASignaturasPerdidas.pdf", function (err, res) {
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
  //   const fs = require('fs');
  // fs.writeFileSync('ListadoActaNoGeneradas.xlsx', buffer);
    return base64;
        
        } catch (error) {
            console.error(error);
            return 'ERROR';
        }
    }
    async function ProcesoExcelMatriculasCarrerasIndividual(carrera, periodo,listado) {
      try {
                var datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
                
                var periodoinfo =await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
                var respuesta=[]
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Listado_Matriculas');
        // Crear un header superior que combine las primeras 18 columnas
    
        worksheet.mergeCells('A1:X1');
        const headerespoch = worksheet.getCell('A1');
        headerespoch.value = 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO'; // Texto del header
        headerespoch.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
        headerespoch.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
        worksheet.mergeCells('A2:X2');
        const headerCell0 = worksheet.getCell('A2');
        headerCell0.value = 'FACULTAD: '+ datosCarrera.data[0].strNombreFacultad; // Texto del header
        headerCell0.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
        headerCell0.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
        worksheet.mergeCells('A3:X3');
        const headercarrera = worksheet.getCell('A3');
        headercarrera.value = 'CARRERA: '+ datosCarrera.data[0].strNombreCarrera; // Texto del header
        headercarrera.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
        headercarrera.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
        worksheet.mergeCells('A4:X4');
        const headerperiodo = worksheet.getCell('A4');
        headerperiodo.value = 'PERIODO: '+  periodoinfo.data[0].strDescripcion + "("+periodo+")" ; // Texto del header
        headerperiodo.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
        headerperiodo.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
        // Crear un header superior que combine las primeras 18 columnas
        worksheet.mergeCells('A5:X5'); // Combina de A1 a Q1 (18 columnas)
        const headerCell = worksheet.getCell('A5');
        headerCell.value = 'LISTADO DE ESTUDIANTES '; // Texto del header
        headerCell.font = { name: 'Arial', size: 11, bold: false }; // Tamaño y fuente Arial
        headerCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
        headerCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '9cccfc' }, // Color de fondo
        };
      
  
  
// FILA 1: Agrupaciones principales
worksheet.mergeCells('A7:F8'); // DATOS ESTUDIANTES
const headerdatos = worksheet.getCell('A7');
headerdatos.value = 'DATOS ESTUDIANTES';
headerdatos.alignment = { vertical: 'middle', horizontal: 'center' };

worksheet.mergeCells('G7:K8'); // DATOS GEOGRAFICOS
const headerdatosg = worksheet.getCell('G7');
headerdatosg.value = 'DATOS GEOGRAFICOS';
headerdatosg.alignment = { vertical: 'middle', horizontal: 'center' };

worksheet.mergeCells('L7:T7'); // MATRÍCULA
const headerdatosM = worksheet.getCell('L7');
headerdatosM.value = 'MATRICULA';
headerdatosM.alignment = { vertical: 'middle', horizontal: 'center' };

worksheet.mergeCells('U7:V8'); // GRATUIDAD
const headerdatosGR = worksheet.getCell('U7');
headerdatosGR.value = 'GRATUIDAD';
headerdatosGR.alignment = { vertical: 'middle', horizontal: 'center' };

worksheet.mergeCells('W7:W9'); // REPETIDOR
const headerdatosR = worksheet.getCell('W7');
headerdatosR.value = 'REPETIDOR';
headerdatosR.alignment = { vertical: 'middle', horizontal: 'center' };


worksheet.mergeCells('X7:X9'); // TIPO_ESTUDIANTE
const headerdatosTE= worksheet.getCell('X7');
headerdatosTE.value = 'TIPO_ESTUDIANTE';
headerdatosTE.alignment = { vertical: 'middle', horizontal: 'center' };

worksheet.mergeCells('Y7:Y9'); // ESTADO_ESTUDIANTE
const headerdatosAP= worksheet.getCell('Y7');
headerdatosAP.value = 'ESTADO';
headerdatosAP.alignment = { vertical: 'middle', horizontal: 'center' };
worksheet.mergeCells('Z7:AB8'); // OTROS_DATOS
const headerdatosOT= worksheet.getCell('Z7');
headerdatosOT.value = 'OTROS DATOS';
headerdatosOT.alignment = { vertical: 'middle', horizontal: 'center' };
// FILA 2: Subniveles de MATRÍCULA
worksheet.mergeCells('L8:L9');
const headerdatosPAO= worksheet.getCell('L8');
headerdatosPAO.value = 'PAO';
worksheet.mergeCells('M8:M9');
const headerdatosEM= worksheet.getCell('M8');
worksheet.mergeCells('N8:N9');
headerdatosEM.value = 'ESTADO_MATRICULA';
const headerdatosINS= worksheet.getCell('N8');
headerdatosINS.value = 'INSCRIPCION';
worksheet.mergeCells('O8:P8');
const headerdatosPRI= worksheet.getCell('O8');
headerdatosPRI.value = 'PRIMERA';

worksheet.mergeCells('Q8:R8');
const headerdatosSE= worksheet.getCell('Q8');
headerdatosSE.value = 'SEGUNDA';


worksheet.mergeCells('S8:T8');
const headerdatosTERC= worksheet.getCell('S8');
headerdatosTERC.value = 'TERCERA';
const headerdatosNu= worksheet.getCell('A9');
headerdatosNu.value = 'N°';
const headerdatosApe= worksheet.getCell('B9');
headerdatosApe.value = 'APELLIDOS';
const headerdatosNo= worksheet.getCell('C9');
headerdatosNo.value = 'NOMBRES';
const headerdatosCE= worksheet.getCell('D9');
headerdatosCE.value = 'CEDULA';
const headerdatosCO= worksheet.getCell('E9');
headerdatosCO.value = 'CODIGO';
const headerdatosSEX= worksheet.getCell('F9');
headerdatosSEX.value = 'SEXO';
const headerdatosNA= worksheet.getCell('G9');
headerdatosNA.value = 'NACIONALIDAD';
const headerdatosPRO= worksheet.getCell('H9');
headerdatosPRO.value = 'PROVINCIA';
const headerdatosCANT= worksheet.getCell('I9');
headerdatosCANT.value = 'CANTON';
const headerdatosPARR= worksheet.getCell('J9');
headerdatosPARR.value = 'PARROQUIA';
const headerdatosDIRE= worksheet.getCell('K9');
headerdatosDIRE.value = 'DIRECCION';
const headerdatosSI= worksheet.getCell('O9');
headerdatosSI.value = 'SI/NO';
const headerdatosCAN= worksheet.getCell('P9');
headerdatosCAN.value = 'CANTIDAD';
const headerdatosSIN= worksheet.getCell('Q9');
headerdatosSIN.value = 'SI/NO';
const headerdatosCA1= worksheet.getCell('R9');
headerdatosCA1.value = 'CANTIDAD';
const headerdatosSI1= worksheet.getCell('S9');
headerdatosSI1.value = 'SI/NO';
const headerdatosCA2= worksheet.getCell('T9');
headerdatosCA2.value = 'CANTIDAD';
const headerdatosGRATU= worksheet.getCell('U9');
headerdatosGRATU.value = 'SI/NO';
const headerdatosVAL= worksheet.getCell('V9');
headerdatosVAL.value = 'VALOR';
const headerdatosCORR= worksheet.getCell('Z9');
headerdatosCORR.value = 'CORREO';
const headerdatosTELR= worksheet.getCell('AA9');
headerdatosTELR.value = 'CELULAR';
const headerdatosNAC= worksheet.getCell('AB9');
headerdatosNAC.value = 'FECHA_NACIMIENTO';
    
    // FILA 3: Encabezados base (N° - VALOR)
const headers = [
  'N°', 'APELLIDOS', 'NOMBRES', 'CEDULA', 'CODIGO', 'SEXO',
  'NACIONALIDAD', 'PROVINCIA', 'CANTON', 'PARROQUIA', 'DIRECCION',
  'PAO', 'ESTADO_MATRICULA', 'INSCRIPCION',
  '', '', '', '', '', '', // espacios ocupados por combinación
  'SI/NO', 'VALOR',
  'REPETIDOR', 'TIPO_ESTUDIANTE'
];
// Estilos generales para las primeras 3 filas
for (let row = 7; row <= 9; row++) {
  worksheet.getRow(row).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });
}
    
      // Agregar datos y aplicar bordes a cada celda
      listado.forEach((row, index) => {
        const rowData = [
          index + 1,
          row.per_primerApellido,
          row.per_nombres,
          row.strCedula,
          row.strCodEstud,
          row.sexo,
          row.nac_nombre,
          row.provincia,
          row.canton,
          row.parroquia,
          row.dir_callePrincipal,
          row.descripcionnivel,
          row.descripcionestado,
          row.descripcioninscripcion,
          row.primera,
          row.cantidadprimera,
          row.segunda,
          row.cantidadsegunda,
          row.tercera,
          row.cantidadtercera,
          row.gratuidad,
          row.valorpago,
          row.repetidor,
          row.regular,
          row.aprobacion,
          row.per_email,
          row.per_telefonoCelular,
          row.per_fechaNacimiento,
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
  const fs = require('fs');
     fs.writeFileSync('ListadoMatriculasCarreraIndividual'+periodo+'.xlsx', buffer);
      return base64;
          
          } catch (error) {
              console.error(error);
              return 'ERROR';
          }
      }


      async function ProcesoExcelMatriculasCarrerasInstitucional(periodo,listado) {
        try {
               
                  
                  var periodoinfo =await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
                  var respuesta=[]
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Listado_Matriculas');
          // Crear un header superior que combine las primeras 18 columnas
      
          worksheet.mergeCells('A1:X1');
          const headerespoch = worksheet.getCell('A1');
          headerespoch.value = 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO'; // Texto del header
          headerespoch.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
          headerespoch.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
          worksheet.mergeCells('A2:X2');
          const headerCell0 = worksheet.getCell('A2');
          headerCell0.value = 'INFORMACIÓN ACADEMICA INSTITUCIONAL CARRERAS'; // Texto del header
          headerCell0.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
          headerCell0.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
          worksheet.mergeCells('A3:X3');
          const headerperiodo = worksheet.getCell('A3');
          headerperiodo.value = 'PERIODO: '+  periodoinfo.data[0].strDescripcion + "("+periodo+")" ; // Texto del header
          headerperiodo.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
          headerperiodo.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
          // Crear un header superior que combine las primeras 18 columnas
          worksheet.mergeCells('A5:X5'); // Combina de A1 a Q1 (18 columnas)
          const headerCell = worksheet.getCell('A5');
          headerCell.value = 'LISTADO DE ESTUDIANTES MATRICULADOS'; // Texto del header
          headerCell.font = { name: 'Arial', size: 11, bold: false }; // Tamaño y fuente Arial
          headerCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
          headerCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '9cccfc' }, // Color de fondo
          };
        
    
    
  // FILA 1: Agrupaciones principales
  worksheet.mergeCells('A7:C8'); // DATOS INSTITUCIONAL
  const headerdatosINST = worksheet.getCell('A7');
  headerdatosINST.value = 'DATOS INSTITUCIONALES';
  headerdatosINST.alignment = { vertical: 'middle', horizontal: 'center' };


  worksheet.mergeCells('D7:I8'); // DATOS ESTUDIANTES
  const headerdatos = worksheet.getCell('D7');
  headerdatos.value = 'DATOS ESTUDIANTES';
  headerdatos.alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.mergeCells('J7:N8'); // DATOS GEOGRAFICOS
  const headerdatosg = worksheet.getCell('J7');
  headerdatosg.value = 'DATOS GEOGRAFICOS';
  headerdatosg.alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.mergeCells('O7:W7'); // MATRÍCULA
  const headerdatosM = worksheet.getCell('O7');
  headerdatosM.value = 'MATRICULA';
  headerdatosM.alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.mergeCells('X7:Y8'); // GRATUIDAD
  const headerdatosGR = worksheet.getCell('X7');
  headerdatosGR.value = 'GRATUIDAD';
  headerdatosGR.alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.mergeCells('Z7:Z9'); // REPETIDOR
  const headerdatosR = worksheet.getCell('Z7');
  headerdatosR.value = 'REPETIDOR';
  headerdatosR.alignment = { vertical: 'middle', horizontal: 'center' };
  
  
  worksheet.mergeCells('AA7:AA9'); // TIPO_ESTUDIANTE
  const headerdatosTE= worksheet.getCell('AA7');
  headerdatosTE.value = 'TIPO_ESTUDIANTE';
  headerdatosTE.alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.mergeCells('AB7:AB9'); // ESTADO_ESTUDIANTE
  const headerdatosAP= worksheet.getCell('AB7');
  headerdatosAP.value = 'ESTADO';
  headerdatosAP.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.mergeCells('AC7:AE8'); // OTROS_DATOS
  const headerdatosOT= worksheet.getCell('AC7');
  headerdatosOT.value = 'OTROS DATOS';
  headerdatosOT.alignment = { vertical: 'middle', horizontal: 'center' };
  // FILA 2: Subniveles de MATRÍCULA
  worksheet.mergeCells('O8:O9');
  const headerdatosPAO= worksheet.getCell('O8');
  headerdatosPAO.value = 'PAO';

  worksheet.mergeCells('P8:P9');
  const headerdatosEM= worksheet.getCell('P8');
  headerdatosEM.value = 'ESTADO_MATRICULA';

  worksheet.mergeCells('Q8:Q9');
  const headerdatosINS= worksheet.getCell('Q8');
  headerdatosINS.value = 'INSCRIPCION';

  worksheet.mergeCells('R8:S8');
  const headerdatosPRI= worksheet.getCell('R8');
  headerdatosPRI.value = 'PRIMERA';
  
  worksheet.mergeCells('T8:U8');
  const headerdatosSE= worksheet.getCell('T8');
  headerdatosSE.value = 'SEGUNDA';
  
  
  worksheet.mergeCells('V8:W8');
  const headerdatosTERC= worksheet.getCell('V8');
  headerdatosTERC.value = 'TERCERA';
  const headerdatosNu= worksheet.getCell('D9');
  headerdatosNu.value = 'N°';
  const headerdatosApe= worksheet.getCell('E9');
  headerdatosApe.value = 'APELLIDOS';
  const headerdatosNo= worksheet.getCell('F9');
  headerdatosNo.value = 'NOMBRES';
  const headerdatosCE= worksheet.getCell('G9');
  headerdatosCE.value = 'CEDULA';
  const headerdatosCO= worksheet.getCell('H9');
  headerdatosCO.value = 'CODIGO';
  const headerdatosSEX= worksheet.getCell('I9');
  headerdatosSEX.value = 'SEXO';
  const headerdatosNA= worksheet.getCell('J9');
  headerdatosNA.value = 'NACIONALIDAD';
  const headerdatosPRO= worksheet.getCell('K9');
  headerdatosPRO.value = 'PROVINCIA';
  const headerdatosCANT= worksheet.getCell('L9');
  headerdatosCANT.value = 'CANTON';
  const headerdatosPARR= worksheet.getCell('M9');
  headerdatosPARR.value = 'PARROQUIA';
  const headerdatosDIRE= worksheet.getCell('N9');
  headerdatosDIRE.value = 'DIRECCION';
  const headerdatosSI= worksheet.getCell('R9');
  headerdatosSI.value = 'SI/NO';
  const headerdatosCAN= worksheet.getCell('S9');
  headerdatosCAN.value = 'CANTIDAD';
  const headerdatosSIN= worksheet.getCell('T9');
  headerdatosSIN.value = 'SI/NO';
  const headerdatosCA1= worksheet.getCell('U9');
  headerdatosCA1.value = 'CANTIDAD';
  const headerdatosSI1= worksheet.getCell('V9');
  headerdatosSI1.value = 'SI/NO';
  const headerdatosCA2= worksheet.getCell('W9');
  headerdatosCA2.value = 'CANTIDAD';
  const headerdatosGRATU= worksheet.getCell('X9');
  headerdatosGRATU.value = 'SI/NO';
  const headerdatosVAL= worksheet.getCell('Y9');
  headerdatosVAL.value = 'VALOR';
  const headerdatosCORR= worksheet.getCell('AC9');
  headerdatosCORR.value = 'CORREO';
  const headerdatosTELR= worksheet.getCell('AD9');
  headerdatosTELR.value = 'CELULAR';
  const headerdatosNAC= worksheet.getCell('AE9');
  headerdatosNAC.value = 'FECHA_NACIMIENTO';
  const headerdatosSEDE= worksheet.getCell('A9');
  headerdatosSEDE.value = 'SEDE';
  const headerdatosFACULTAD= worksheet.getCell('B9');
  headerdatosFACULTAD.value = 'FACULTAD';
  const headerdatosCARRERA= worksheet.getCell('C9');
  headerdatosCARRERA.value = 'CARRERA';
      
      // FILA 3: Encabezados base (N° - VALOR)
  const headers = [
    'N°', 'APELLIDOS', 'NOMBRES', 'CEDULA', 'CODIGO', 'SEXO',
    'NACIONALIDAD', 'PROVINCIA', 'CANTON', 'PARROQUIA', 'DIRECCION',
    'PAO', 'ESTADO_MATRICULA', 'INSCRIPCION',
    '', '', '', '', '', '', // espacios ocupados por combinación
    'SI/NO', 'VALOR',
    'REPETIDOR', 'TIPO_ESTUDIANTE'
  ];
  // Estilos generales para las primeras 3 filas
  for (let row = 7; row <= 9; row++) {
    worksheet.getRow(row).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  }
      
        // Agregar datos y aplicar bordes a cada celda
        listado.forEach((row, index) => {
          const rowData = [
            row.sede,
            row.facultad,
            row.carrera,
            index + 1,
            row.per_primerApellido,
            row.per_nombres,
            row.strCedula,
            row.strCodEstud,
            row.sexo,
            row.nac_nombre,
            row.provincia,
            row.canton,
            row.parroquia,
            row.dir_callePrincipal,
            row.descripcionnivel,
            row.descripcionestado,
            row.descripcioninscripcion,
            row.primera,
            row.cantidadprimera,
            row.segunda,
            row.cantidadsegunda,
            row.tercera,
            row.cantidadtercera,
            row.gratuidad,
            row.valorpago,
            row.repetidor,
            row.regular,
            row.aprobacion,
            row.per_email,
            row.per_telefonoCelular,
            row.per_fechaNacimiento,
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
    /*  const fs = require('fs');
       fs.writeFileSync('ListadoMatriculasInstitucionalCarreras'+periodo+'.xlsx', buffer);*/
        return base64;
            
            } catch (error) {
                console.error(error);
                return 'ERROR';
            }
        }
   async function ProcesoExcelMatriculasNivelacionInstitucional(periodo,listado) {
        try {
               
                  
                  var periodoinfo =await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
                  var respuesta=[]
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Listado_Matriculas');
          // Crear un header superior que combine las primeras 18 columnas
      
          worksheet.mergeCells('A1:X1');
          const headerespoch = worksheet.getCell('A1');
          headerespoch.value = 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO'; // Texto del header
          headerespoch.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
          headerespoch.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
          worksheet.mergeCells('A2:X2');
          const headerCell0 = worksheet.getCell('A2');
          headerCell0.value = 'INFORMACIÓN ACADEMICA INSTITUCIONAL NIVELACION'; // Texto del header
          headerCell0.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
          headerCell0.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
          worksheet.mergeCells('A3:X3');
          const headerperiodo = worksheet.getCell('A3');
          headerperiodo.value = 'PERIODO: '+  periodoinfo.data[0].strDescripcion + "("+periodo+")" ; // Texto del header
          headerperiodo.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
          headerperiodo.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
          // Crear un header superior que combine las primeras 18 columnas
          worksheet.mergeCells('A5:X5'); // Combina de A1 a Q1 (18 columnas)
          const headerCell = worksheet.getCell('A5');
          headerCell.value = 'LISTADO DE ESTUDIANTES MATRICULADOS'; // Texto del header
          headerCell.font = { name: 'Arial', size: 11, bold: false }; // Tamaño y fuente Arial
          headerCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
          headerCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '9cccfc' }, // Color de fondo
          };
        
    
    
  // FILA 1: Agrupaciones principales
  worksheet.mergeCells('A7:C8'); // DATOS INSTITUCIONAL
  const headerdatosINST = worksheet.getCell('A7');
  headerdatosINST.value = 'DATOS INSTITUCIONALES';
  headerdatosINST.alignment = { vertical: 'middle', horizontal: 'center' };


  worksheet.mergeCells('D7:I8'); // DATOS ESTUDIANTES
  const headerdatos = worksheet.getCell('D7');
  headerdatos.value = 'DATOS ESTUDIANTES';
  headerdatos.alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.mergeCells('J7:N8'); // DATOS GEOGRAFICOS
  const headerdatosg = worksheet.getCell('J7');
  headerdatosg.value = 'DATOS GEOGRAFICOS';
  headerdatosg.alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.mergeCells('O7:W7'); // MATRÍCULA
  const headerdatosM = worksheet.getCell('O7');
  headerdatosM.value = 'MATRICULA';
  headerdatosM.alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.mergeCells('X7:Y8'); // GRATUIDAD
  const headerdatosGR = worksheet.getCell('X7');
  headerdatosGR.value = 'GRATUIDAD';
  headerdatosGR.alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.mergeCells('Z7:Z9'); // REPETIDOR
  const headerdatosR = worksheet.getCell('Z7');
  headerdatosR.value = 'REPETIDOR';
  headerdatosR.alignment = { vertical: 'middle', horizontal: 'center' };
  
  
  worksheet.mergeCells('AA7:AA9'); // TIPO_ESTUDIANTE
  const headerdatosTE= worksheet.getCell('AA7');
  headerdatosTE.value = 'TIPO_ESTUDIANTE';
  headerdatosTE.alignment = { vertical: 'middle', horizontal: 'center' };
  
  worksheet.mergeCells('AB7:AB9'); // ESTADO_ESTUDIANTE
  const headerdatosAP= worksheet.getCell('AB7');
  headerdatosAP.value = 'ESTADO';
  headerdatosAP.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.mergeCells('AC7:AE8'); // OTROS_DATOS
  const headerdatosOT= worksheet.getCell('AC7');
  headerdatosOT.value = 'OTROS DATOS';
  headerdatosOT.alignment = { vertical: 'middle', horizontal: 'center' };
  // FILA 2: Subniveles de MATRÍCULA
  worksheet.mergeCells('O8:O9');
  const headerdatosPAO= worksheet.getCell('O8');
  headerdatosPAO.value = 'PAO';

  worksheet.mergeCells('P8:P9');
  const headerdatosEM= worksheet.getCell('P8');
  headerdatosEM.value = 'ESTADO_MATRICULA';

  worksheet.mergeCells('Q8:Q9');
  const headerdatosINS= worksheet.getCell('Q8');
  headerdatosINS.value = 'INSCRIPCION';

  worksheet.mergeCells('R8:S8');
  const headerdatosPRI= worksheet.getCell('R8');
  headerdatosPRI.value = 'PRIMERA';
  
  worksheet.mergeCells('T8:U8');
  const headerdatosSE= worksheet.getCell('T8');
  headerdatosSE.value = 'SEGUNDA';
  
  
  worksheet.mergeCells('V8:W8');
  const headerdatosTERC= worksheet.getCell('V8');
  headerdatosTERC.value = 'TERCERA';
  const headerdatosNu= worksheet.getCell('D9');
  headerdatosNu.value = 'N°';
  const headerdatosApe= worksheet.getCell('E9');
  headerdatosApe.value = 'APELLIDOS';
  const headerdatosNo= worksheet.getCell('F9');
  headerdatosNo.value = 'NOMBRES';
  const headerdatosCE= worksheet.getCell('G9');
  headerdatosCE.value = 'CEDULA';
  const headerdatosCO= worksheet.getCell('H9');
  headerdatosCO.value = 'CODIGO';
  const headerdatosSEX= worksheet.getCell('I9');
  headerdatosSEX.value = 'SEXO';
  const headerdatosNA= worksheet.getCell('J9');
  headerdatosNA.value = 'NACIONALIDAD';
  const headerdatosPRO= worksheet.getCell('K9');
  headerdatosPRO.value = 'PROVINCIA';
  const headerdatosCANT= worksheet.getCell('L9');
  headerdatosCANT.value = 'CANTON';
  const headerdatosPARR= worksheet.getCell('M9');
  headerdatosPARR.value = 'PARROQUIA';
  const headerdatosDIRE= worksheet.getCell('N9');
  headerdatosDIRE.value = 'DIRECCION';
  const headerdatosSI= worksheet.getCell('R9');
  headerdatosSI.value = 'SI/NO';
  const headerdatosCAN= worksheet.getCell('S9');
  headerdatosCAN.value = 'CANTIDAD';
  const headerdatosSIN= worksheet.getCell('T9');
  headerdatosSIN.value = 'SI/NO';
  const headerdatosCA1= worksheet.getCell('U9');
  headerdatosCA1.value = 'CANTIDAD';
  const headerdatosSI1= worksheet.getCell('V9');
  headerdatosSI1.value = 'SI/NO';
  const headerdatosCA2= worksheet.getCell('W9');
  headerdatosCA2.value = 'CANTIDAD';
  const headerdatosGRATU= worksheet.getCell('X9');
  headerdatosGRATU.value = 'SI/NO';
  const headerdatosVAL= worksheet.getCell('Y9');
  headerdatosVAL.value = 'VALOR';
  const headerdatosCORR= worksheet.getCell('AC9');
  headerdatosCORR.value = 'CORREO';
  const headerdatosTELR= worksheet.getCell('AD9');
  headerdatosTELR.value = 'CELULAR';
  const headerdatosNAC= worksheet.getCell('AE9');
  headerdatosNAC.value = 'FECHA_NACIMIENTO';
  const headerdatosSEDE= worksheet.getCell('A9');
  headerdatosSEDE.value = 'SEDE';
  const headerdatosFACULTAD= worksheet.getCell('B9');
  headerdatosFACULTAD.value = 'FACULTAD';
  const headerdatosCARRERA= worksheet.getCell('C9');
  headerdatosCARRERA.value = 'CARRERA';
      
      // FILA 3: Encabezados base (N° - VALOR)
  const headers = [
    'N°', 'APELLIDOS', 'NOMBRES', 'CEDULA', 'CODIGO', 'SEXO',
    'NACIONALIDAD', 'PROVINCIA', 'CANTON', 'PARROQUIA', 'DIRECCION',
    'PAO', 'ESTADO_MATRICULA', 'INSCRIPCION',
    '', '', '', '', '', '', // espacios ocupados por combinación
    'SI/NO', 'VALOR',
    'REPETIDOR', 'TIPO_ESTUDIANTE'
  ];
  // Estilos generales para las primeras 3 filas
  for (let row = 7; row <= 9; row++) {
    worksheet.getRow(row).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  }
      
        // Agregar datos y aplicar bordes a cada celda
        listado.forEach((row, index) => {
          const rowData = [
            row.sede,
            row.facultad,
            row.carrera,
            index + 1,
            row.per_primerApellido,
            row.per_nombres,
            row.strCedula,
            row.strCodEstud,
            row.sexo,
            row.nac_nombre,
            row.provincia,
            row.canton,
            row.parroquia,
            row.dir_callePrincipal,
            row.descripcionnivel,
            row.descripcionestado,
            row.descripcioninscripcion,
            row.primera,
            row.cantidadprimera,
            row.segunda,
            row.cantidadsegunda,
            row.tercera,
            row.cantidadtercera,
            row.gratuidad,
            row.valorpago,
            row.repetidor,
            row.regular,
            row.aprobacion,
            row.per_email,
            row.per_telefonoCelular,
            row.per_fechaNacimiento,
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
     // const fs = require('fs');
     //  fs.writeFileSync('ListadoMatriculasInstitucionalNivelacion'+periodo+'.xlsx', buffer);
        return base64;
            
            } catch (error) {
                console.error(error);
                return 'ERROR';
            }
        }
        async function ProcesoExcelMatriculasAdminisionesInstitucional(periodo,listado) {
          try {
                 
                    var periodoinfo =await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
                    var respuesta=[]
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Listado_Matriculas');
            // Crear un header superior que combine las primeras 18 columnas
        
            worksheet.mergeCells('A1:X1');
            const headerespoch = worksheet.getCell('A1');
            headerespoch.value = 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO'; // Texto del header
            headerespoch.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
            headerespoch.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
            worksheet.mergeCells('A2:X2');
            const headerCell0 = worksheet.getCell('A2');
            headerCell0.value = 'INFORMACIÓN ACADEMICA INSTITUCIONAL'; // Texto del header
            headerCell0.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
            headerCell0.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
            worksheet.mergeCells('A3:X3');
            const headerperiodo = worksheet.getCell('A3');
            headerperiodo.value = 'PERIODO: '+  periodoinfo.data[0].strDescripcion + "("+periodo+")" ; // Texto del header
            headerperiodo.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
            headerperiodo.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
            // Crear un header superior que combine las primeras 18 columnas
            worksheet.mergeCells('A5:X5'); // Combina de A1 a Q1 (18 columnas)
            const headerCell = worksheet.getCell('A5');
            headerCell.value = 'LISTADO PROCESO ADMISIONES'; // Texto del header
            headerCell.font = { name: 'Arial', size: 11, bold: false }; // Tamaño y fuente Arial
            headerCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
            headerCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '9cccfc' }, // Color de fondo
            };
          
      
      
    // FILA 1: Agrupaciones principales
    worksheet.mergeCells('A7:C8'); // DATOS INSTITUCIONAL
    const headerdatosINST = worksheet.getCell('A7');
    headerdatosINST.value = 'DATOS INSTITUCIONALES';
    headerdatosINST.alignment = { vertical: 'middle', horizontal: 'center' };
  
  
    worksheet.mergeCells('D7:I8'); // DATOS ESTUDIANTES
    const headerdatos = worksheet.getCell('D7');
    headerdatos.value = 'DATOS ESTUDIANTES';
    headerdatos.alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('J7:N8'); // DATOS GEOGRAFICOS
    const headerdatosg = worksheet.getCell('J7');
    headerdatosg.value = 'DATOS GEOGRAFICOS';
    headerdatosg.alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('O7:W7'); // MATRÍCULA
    const headerdatosM = worksheet.getCell('O7');
    headerdatosM.value = 'MATRICULA';
    headerdatosM.alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('X7:Y8'); // GRATUIDAD
    const headerdatosGR = worksheet.getCell('X7');
    headerdatosGR.value = 'GRATUIDAD';
    headerdatosGR.alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('Z7:Z9'); // REPETIDOR
    const headerdatosR = worksheet.getCell('Z7');
    headerdatosR.value = 'REPETIDOR';
    headerdatosR.alignment = { vertical: 'middle', horizontal: 'center' };
    
    
    worksheet.mergeCells('AA7:AA9'); // TIPO_ESTUDIANTE
    const headerdatosTE= worksheet.getCell('AA7');
    headerdatosTE.value = 'TIPO_ESTUDIANTE';
    headerdatosTE.alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('AB7:AB9'); // ESTADO_ESTUDIANTE
    const headerdatosAP= worksheet.getCell('AB7');
    headerdatosAP.value = 'ESTADO';
    headerdatosAP.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('AC7:AE8'); // OTROS_DATOS
    const headerdatosOT= worksheet.getCell('AC7');
    headerdatosOT.value = 'OTROS DATOS';
    headerdatosOT.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('AF7:AL8'); // DATOS_SENECYTS
    const headerdatosSNE= worksheet.getCell('AF7');
    headerdatosSNE.value = 'DATOS_SENECYT';
    headerdatosSNE.alignment = { vertical: 'middle', horizontal: 'center' };

    // FILA 2: Subniveles de MATRÍCULA
    worksheet.mergeCells('O8:O9');
    const headerdatosPAO= worksheet.getCell('O8');
    headerdatosPAO.value = 'PAO';
  
    worksheet.mergeCells('P8:P9');
    const headerdatosEM= worksheet.getCell('P8');
    headerdatosEM.value = 'ESTADO_MATRICULA';
  
    worksheet.mergeCells('Q8:Q9');
    const headerdatosINS= worksheet.getCell('Q8');
    headerdatosINS.value = 'INSCRIPCION';
  
    worksheet.mergeCells('R8:S8');
    const headerdatosPRI= worksheet.getCell('R8');
    headerdatosPRI.value = 'PRIMERA';
    
    worksheet.mergeCells('T8:U8');
    const headerdatosSE= worksheet.getCell('T8');
    headerdatosSE.value = 'SEGUNDA';
    
    
    worksheet.mergeCells('V8:W8');
    const headerdatosTERC= worksheet.getCell('V8');
    headerdatosTERC.value = 'TERCERA';
    const headerdatosNu= worksheet.getCell('D9');
    headerdatosNu.value = 'N°';
    const headerdatosApe= worksheet.getCell('E9');
    headerdatosApe.value = 'APELLIDOS';
    const headerdatosNo= worksheet.getCell('F9');
    headerdatosNo.value = 'NOMBRES';
    const headerdatosCE= worksheet.getCell('G9');
    headerdatosCE.value = 'CEDULA';
    const headerdatosCO= worksheet.getCell('H9');
    headerdatosCO.value = 'CODIGO';
    const headerdatosSEX= worksheet.getCell('I9');
    headerdatosSEX.value = 'SEXO';
    const headerdatosNA= worksheet.getCell('J9');
    headerdatosNA.value = 'NACIONALIDAD';
    const headerdatosPRO= worksheet.getCell('K9');
    headerdatosPRO.value = 'PROVINCIA';
    const headerdatosCANT= worksheet.getCell('L9');
    headerdatosCANT.value = 'CANTON';
    const headerdatosPARR= worksheet.getCell('M9');
    headerdatosPARR.value = 'PARROQUIA';
    const headerdatosDIRE= worksheet.getCell('N9');
    headerdatosDIRE.value = 'DIRECCION';
    const headerdatosSI= worksheet.getCell('R9');
    headerdatosSI.value = 'SI/NO';
    const headerdatosCAN= worksheet.getCell('S9');
    headerdatosCAN.value = 'CANTIDAD';
    const headerdatosSIN= worksheet.getCell('T9');
    headerdatosSIN.value = 'SI/NO';
    const headerdatosCA1= worksheet.getCell('U9');
    headerdatosCA1.value = 'CANTIDAD';
    const headerdatosSI1= worksheet.getCell('V9');
    headerdatosSI1.value = 'SI/NO';
    const headerdatosCA2= worksheet.getCell('W9');
    headerdatosCA2.value = 'CANTIDAD';
    const headerdatosGRATU= worksheet.getCell('X9');
    headerdatosGRATU.value = 'SI/NO';
    const headerdatosVAL= worksheet.getCell('Y9');
    headerdatosVAL.value = 'VALOR';
    const headerdatosCORR= worksheet.getCell('AC9');
    headerdatosCORR.value = 'CORREO';
    const headerdatosTELR= worksheet.getCell('AD9');
    headerdatosTELR.value = 'CELULAR';
    const headerdatosNAC= worksheet.getCell('AE9');
    headerdatosNAC.value = 'FECHA_NACIMIENTO';
    const headerdatosSEDE= worksheet.getCell('A9');
    headerdatosSEDE.value = 'SEDE';
    const headerdatosFACULTAD= worksheet.getCell('B9');
    headerdatosFACULTAD.value = 'FACULTAD';
    const headerdatosCARRERA= worksheet.getCell('C9');
    headerdatosCARRERA.value = 'CARRERA';
    const headerdatosOFA= worksheet.getCell('AF9');
    headerdatosOFA.value = 'OFA_ID';
    const headerdatosCUID= worksheet.getCell('AG9');
    headerdatosCUID.value = 'CUIS_ID';
    const headerdatosMODALIDAD= worksheet.getCell('AH9');
    headerdatosMODALIDAD.value = 'MODALIDAD';
    const headerdatosJORNADA= worksheet.getCell('AI9');
    headerdatosJORNADA.value = 'JORNADA';
    const headerdatosTIPO= worksheet.getCell('AJ9');
    headerdatosTIPO.value = 'TIPO CUPO';
    const headerdatosPERIODO= worksheet.getCell('AK9');
    headerdatosPERIODO.value = 'PERIODO';
    const headerdatosESTA= worksheet.getCell('AL9');
    headerdatosESTA.value = 'ESTADO MATRICULA';
        // FILA 3: Encabezados base (N° - VALOR)
    const headers = [
      'N°', 'APELLIDOS', 'NOMBRES', 'CEDULA', 'CODIGO', 'SEXO',
      'NACIONALIDAD', 'PROVINCIA', 'CANTON', 'PARROQUIA', 'DIRECCION',
      'PAO', 'ESTADO_MATRICULA', 'INSCRIPCION',
      '', '', '', '', '', '', // espacios ocupados por combinación
      'SI/NO', 'VALOR',
      'REPETIDOR', 'TIPO_ESTUDIANTE'
    ];
    // Estilos generales para las primeras 3 filas
    for (let row = 7; row <= 9; row++) {
      worksheet.getRow(row).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }
        
          // Agregar datos y aplicar bordes a cada celda
          listado.forEach((row, index) => {
            const rowData = [
              row.sede,
              row.facultad,
              row.carrera,
              index + 1,
              row.per_primerApellido,
              row.per_nombres,
              row.strCedula,
              row.strCodEstud,
              row.sexo,
              row.nac_nombre,
              row.provincia,
              row.canton,
              row.parroquia,
              row.dir_callePrincipal,
              row.strCodNivel,
              row.descripcionestado,
              row.descripcioninscripcion,
              row.primera,
              row.cantidadprimera,
              row.segunda,
              row.cantidadsegunda,
              row.tercera,
              row.cantidadtercera,
              row.gratuidad,
              row.valorpago,
              row.repetidor,
              row.regular,
              row.aprobacion,
              row.per_email,
              row.per_telefonoCelular,
              row.per_fechaNacimiento,
              row.dc_ofaid,
              row.dc_cusid,
              row.dc_modalidad,
              row.dc_jornada,
              row.dc_tipocupo,
              row.dc_cupo_aceptado,
              row.dc_estado_matricula,
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
      /*  const fs = require('fs');
         fs.writeFileSync('ListadoMatriculasAdmisionesInstitucional'+periodo+'.xlsx', buffer);*/
          return base64;
              
              } catch (error) {
                  console.error(error);
                  return 'ERROR';
              }
          }


            async function ProcesoFinancieroExcel(listado) {
    try {
              var respuesta=[]
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Listado');
      // Crear un header superior que combine las primeras 18 columnas
  
      worksheet.mergeCells('A1:I1');
      const headerespoch = worksheet.getCell('A1');
      headerespoch.value = 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO'; // Texto del header
      headerespoch.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
      headerespoch.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
  worksheet.mergeCells('A2:I2');
      const headerespoch2 = worksheet.getCell('A2');
      headerespoch2.value = 'INFORMACION CLIENTES'; // Texto del header
      headerespoch2.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
      headerespoch2.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
      // Crear un header superior que combine las primeras 18 columnas
      worksheet.mergeCells('A3:I3'); // Combina de A1 a Q1 (18 columnas)
      const headerCell = worksheet.getCell('A3');
      headerCell.value = 'LISTADO INFORMACIÓN FINANCIERA'; // Texto del header
      headerCell.font = { name: 'Arial', size: 11, bold: false }; // Tamaño y fuente Arial
      headerCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
      headerCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '9cccfc' }, // Color de fondo
      };
    


  
  
    // Encabezados de tabla
    const headers = ['No', 'DOCUMENTO', 'TIPO','NOMBRES', 'CORREO_PRINCIPAL', 'CORREO_SECUNDARIO','DIRECCION','FACTURA','FECHA'];
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
        row.stridentificacioncomprador,
        row.strtipoidentificacioncomprador,
        row.strrazonsocialcomprador,
        row.per_email,
        row.per_emailAlternativo,
        row.dir_callePrincipal,
        row.strestablecimiento+'-'+ row.strpuntoemision+'-'+row.intsecuencial,
           row.dtfechaemision
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
 //  fs.writeFileSync('InformacionFinanciero.xlsx', buffer);
    return base64;
        
        } catch (error) {
            console.error(error);
            return 'ERROR';
        }
    }
