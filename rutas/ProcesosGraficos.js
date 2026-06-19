const express = require('express');
const router = express.Router();

const fs = require('fs');
const axios = require('axios');
const https = require('https');
const tools = require('./tools');
const procesoAcadeicoNotas = require('../rutas/ProcesoNotasAcademico');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const procesoCupo = require('../modelo/procesocupos');
const { Chart } = require('chart.js');
const ChartDataLabels = require('chartjs-plugin-datalabels');
const crypto = require("crypto");
const reportespdfmaker = require("./../reportesmake/reportescarrerasmake");
const sqlmodeloformato = require("./../modeloformato/generalesmodelo.js");
Chart.register(ChartDataLabels);
const PdfPrinter = require('pdfmake');
const { createBaseLayout } = require('../reportesmake/pdf-layout.js');
const funcionesgenerales = require('../rutas/tools.js');

const agent = new https.Agent({
  rejectUnauthorized: false,
  // other options if needed
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});
module.exports.Graficopdf1 = async function (carrera, periodo, nivel, paralelo, codMateria, cedula, idreglamento, nombres, asignatura) {
  try {
    var listado = await ProcesoGraficosParciales1(carrera, periodo, nivel, paralelo, codMateria, cedula, idreglamento);
    var base64 = await generatePDF1(listado, carrera, nombres, asignatura, nivel, paralelo, periodo);
    //var base64 = await reportespdfmaker.pdfmakegeneratePDF1(listado, carrera, nombres, asignatura, nivel, paralelo, periodo);


    return base64
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.Graficopdf2 = async function (carrera, periodo, nivel, paralelo, codMateria, cedula, idreglamento, nombres, asignatura) {
  try {
    var listado = await ProcesoGraficosParciales2(carrera, periodo, nivel, paralelo, codMateria, cedula, idreglamento);
    var base64 = await generatePDF2(listado, carrera, nombres, asignatura, nivel, paralelo, periodo);


    return base64
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.GraficopdfR = async function (carrera, periodo, nivel, paralelo, codMateria, cedula, idreglamento, nombres, asignatura) {
  try {
    var listado = await ProcesoGraficosParcialesR(carrera, periodo, nivel, paralelo, codMateria, cedula, idreglamento);
    var base64 = await generatePDFR(listado, carrera, nombres, asignatura, nivel, paralelo, periodo);


    return base64
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.ReporteNoMatriculado = async function (carrera, periodo1, periodo2, cedula) {
  try {
    var ListaRangoPeriodo = await calcularValoresIntermedios(periodo1, periodo2);
    var listado = await ProcesoReporteNoMatriculado(carrera, periodo1, periodo2);
    //   var base64 = await generarReporteNoMatriculados(listado, ListaRangoPeriodo,carrera,cedula);
    var base64 = await reportespdfmaker.pdfmakegenerarReporteNoMatriculados(listado, ListaRangoPeriodo, carrera, cedula);

    return base64
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.pdfEvaluacionesRecuperacionCarrera = async function (carrera, periodo, cedula) {
  try {

    const listadoInformacion = await sqlmodeloformato.DictadoAsignaturasPeriodo(carrera, periodo);
    var base64 = await reportespdfmaker.pdfmakegenerarReporteEvaluacionesRecuperacionCarrera(listadoInformacion.datos.data, carrera, periodo, cedula)
    return base64
  } catch (error) {
    console.error(error);
    
    return 'ERROR' + error;
  }
}

module.exports.pdfListadoAsignaturasCarreraMovilidad = async function (carrera, periodo, cedula) {
  try {
    var listadoNuevo = []
    const listadoInformacion = await sqlmodeloformato.DictadoAsignaturasPeriodo(carrera, periodo);
    for (var index = 0; index < listadoInformacion.datos.data.length; index++) {
      const datos = listadoInformacion.datos.data[index];
      datos.tipo = 'NORMAL'
      datos.carreramovilidad = ''
      const asignaturaMovilidad = await sqlmodeloformato.ObtenerAsignaturaMovilidadCarrera('OAS_Master', carrera, datos);
      if (asignaturaMovilidad.datos.data.length > 0) {
        datos.tipo = 'MOVILIDAD'
        datos.carreramovilidad = asignaturaMovilidad.datos.data[0].mam_carreramovilidad + ' / PAO :' + asignaturaMovilidad.datos.data[0].mam_nivelmovilidad + ' / PARALELO : ' + asignaturaMovilidad.datos.data[0].mam_paralelomovilidad
      }
      listadoNuevo.push(datos)
    }
    var base64 = await reportespdfmaker.pdfmakegenerarAsignaturasTipoMovilidad(listadoNuevo, carrera, periodo, cedula)
    return base64
  } catch (error) {
    console.error(error);
    
    return 'ERROR' + error;
  }
}

module.exports.pdfPromediosGeneralesAsignaturasCarreras = async function (carrera, periodo, cedula) {
  try {

    const listadoInformacion = await sqlmodeloformato.DictadoAsignaturasPeriodo(carrera, periodo);
    for (var index = 0; index < listadoInformacion.datos.data.length; index++) {
      const element = listadoInformacion.datos.data[index];
      const DatosCalificaciones = await sqlmodeloformato.PromediosGeneralesParcialesPorAsignatura(carrera, periodo, element.strCodNivel, element.strCodParalelo, element.strCodMateria);
      element.promedioParcial1 = DatosCalificaciones.datos.data[0].PromedioGeneral_Parcial1;
      element.promedioParcial2 = DatosCalificaciones.datos.data[0].PromedioGeneral_Parcial2;
      element.promedioGeneral = DatosCalificaciones.datos.data[0].PromedioGeneral_Total;

    }
    var base64 = await reportespdfmaker.pdfmakegenerarPromediosGeneralesAsignaturas(listadoInformacion.datos.data, carrera, periodo, cedula)
    return base64
    //  return listadoInformacion
  } catch (error) {
    console.error(error);
    
    return 'ERROR' + error;
  }
}
async function ProcesoGraficosParciales1(carrera, periodo, nivel, paralelo, CodMateria, cedula, idreglamento) {
  try {
    var listado = [];
    var datos = await procesoAcadeicoNotas.ListadoEquivalenciaRelamentos(idreglamento);
    var calificaciones = await procesoAcadeicoNotas.ProcesoListadoCalificacionesEstudiantedadoDocente(carrera, periodo, nivel, paralelo, CodMateria, cedula, idreglamento);
    for (var index = 0; index < datos.Equivalencias.length; index++) {
      const equivalencia = datos.Equivalencias[index];
      if (equivalencia.eqrencualitativa != 'R' && equivalencia.eqrencualitativa != 'S') {
        equivalencia.contador = 0;
        equivalencia.procentaje = 0;
        var estudiantes = [];
        for (var index1 = 0; index1 < calificaciones.Asignaturas.length; index1++) {
          const element = calificaciones.Asignaturas[index1];

          if (element.Calificacion == null) {
            element.notaparcial = 0;
            estudiantes.push(element);
          } else {
            for (var index2 = 0; index2 < element.Calificacion.length; index2++) {
              if (index2 == 0) {
                const datosNotas = element.Calificacion[0];
                datosNotas.dcParcial1 = datosNotas.dcParcial1 == null ? 0 : datosNotas.dcParcial1;
                if ((Number(datosNotas.dcParcial1) >= Number(equivalencia.eqrenminimo)) && (Number(datosNotas.dcParcial1) <= Number(equivalencia.eqrenmaximo))) {
                  equivalencia.contador = equivalencia.contador + 1;
                  element.notaparcial = datosNotas.dcParcial1;
                  estudiantes.push(element);
                }
              }

            }
          }

        }
        equivalencia.procentaje = ((equivalencia.contador * 100) / Number(calificaciones.Asignaturas.length)).toFixed(2);
        equivalencia.estudiantes = estudiantes;
        var infografico = {
          "Descripcion": equivalencia.eqrennombre,
          "name": Number(equivalencia.procentaje) + "% " + equivalencia.eqrennombre,
          "value": Number(equivalencia.contador),
          "Rango": Number(equivalencia.eqrenminimo) + "-" + Number(equivalencia.eqrenmaximo),
          "ValorPorcentaje": String(equivalencia.procentaje),
          "selectable": true
        }
        listado.push(infografico);

      }
    }
    return listado
  } catch (error) {
    console.error(error);
    
  }

}
async function ProcesoGraficosParciales2(carrera, periodo, nivel, paralelo, CodMateria, cedula, idreglamento) {
  try {
    var listado = [];
    var datos = await procesoAcadeicoNotas.ListadoEquivalenciaRelamentos(idreglamento);
    var calificaciones = await procesoAcadeicoNotas.ProcesoListadoCalificacionesEstudiantedadoDocente(carrera, periodo, nivel, paralelo, CodMateria, cedula, idreglamento);
    for (var index = 0; index < datos.Equivalencias.length; index++) {
      const equivalencia = datos.Equivalencias[index];
      if (equivalencia.eqrencualitativa != 'R' && equivalencia.eqrencualitativa != 'S') {
        equivalencia.contador = 0;
        equivalencia.procentaje = 0;
        var estudiantes = [];
        for (var index1 = 0; index1 < calificaciones.Asignaturas.length; index1++) {
          const element = calificaciones.Asignaturas[index1];
          if (element.Calificacion == null) {
            element.notaparcial = 0;
            estudiantes.push(element);
          } else {
            for (var index2 = 0; index2 < element.Calificacion.length; index2++) {
              if (index2 == 0) {
                const datosNotas = element.Calificacion[0];
                datosNotas.dcParcial2 = datosNotas.dcParcial2 == null ? 0 : datosNotas.dcParcial2;
                if ((Number(datosNotas.dcParcial2) >= Number(equivalencia.eqrenminimo)) && (Number(datosNotas.dcParcial2) <= Number(equivalencia.eqrenmaximo))) {
                  equivalencia.contador = equivalencia.contador + 1;
                  element.notaparcial = datosNotas.dcParcial2;
                  estudiantes.push(element);
                }
              }

            }
          }

        }
        equivalencia.procentaje = ((equivalencia.contador * 100) / Number(calificaciones.Asignaturas.length)).toFixed(2);
        equivalencia.estudiantes = estudiantes;
        var infografico = {
          "Descripcion": equivalencia.eqrennombre,
          "name": Number(equivalencia.procentaje) + "% " + equivalencia.eqrennombre,
          "value": Number(equivalencia.contador),
          "Rango": Number(equivalencia.eqrenminimo) + "-" + Number(equivalencia.eqrenmaximo),
          "ValorPorcentaje": String(equivalencia.procentaje),
          "selectable": true
        }
        listado.push(infografico);

      }
    }
    return listado
  } catch (error) {
    console.error(error);
    
  }

}
async function ProcesoGraficosParcialesR(carrera, periodo, nivel, paralelo, CodMateria, cedula, idreglamento) {
  try {
    var listado = [];
    var datos = await procesoAcadeicoNotas.ListadoEquivalenciaRelamentos(idreglamento);
    var calificaciones = await procesoAcadeicoNotas.ProcesoListadoCalificacionesEstudiantedadoDocente(carrera, periodo, nivel, paralelo, CodMateria, cedula, idreglamento);
    for (var index = 0; index < datos.Equivalencias.length; index++) {
      const equivalencia = datos.Equivalencias[index];
      if (equivalencia.eqrencualitativa != 'R' && equivalencia.eqrencualitativa != 'S') {
        equivalencia.contador = 0;
        equivalencia.procentaje = 0;
        var estudiantes = [];
        for (var index1 = 0; index1 < calificaciones.Asignaturas.length; index1++) {
          const element = calificaciones.Asignaturas[index1];
          if (element.cantidadNota == 2) {

            for (var index2 = 0; index2 < element.Calificacion.length; index2++) {
              if (index2 == 0) {

                const datosNotas = element.Calificacion[1];
                datosNotas.dcParcial2 = datosNotas.dcParcial2 == null ? 0 : datosNotas.dcParcial2;
                if ((Number(datosNotas.dcParcial2) >= Number(equivalencia.eqrenminimo)) && (Number(datosNotas.dcParcial2) <= Number(equivalencia.eqrenmaximo))) {
                  equivalencia.contador = equivalencia.contador + 1;
                  element.notaparcial = datosNotas.dcParcial2;
                  estudiantes.push(element);
                }
              }

            }
          }

        }
        equivalencia.procentaje = ((equivalencia.contador * 100) / Number(calificaciones.Asignaturas.length)).toFixed(2);
        equivalencia.estudiantes = estudiantes;
        var infografico = {
          "Descripcion": equivalencia.eqrennombre,
          "name": Number(equivalencia.procentaje) + "% " + equivalencia.eqrennombre,
          "value": Number(equivalencia.contador),
          "Rango": Number(equivalencia.eqrenminimo) + "-" + Number(equivalencia.eqrenmaximo),
          "ValorPorcentaje": String(equivalencia.procentaje),
          "selectable": true
        }
        listado.push(infografico);

      }
    }
    return listado
  } catch (error) {
    console.error(error);
    
  }

}

async function ProcesoReporteNoMatriculado(carrera, periodo1, periodo2) {
  const pool = await iniciarDinamicoPool(carrera);
  await pool.connect();
  const transaction = await iniciarDinamicoTransaccion(pool);
  await transaction.begin();
  try {
    var listado = [];
    var ListaRangoPeriodo = await calcularValoresIntermedios(periodo1, periodo2);
    var ListadosMatriculas = await procesoCupo.MatriculasCarrerasPeriodo(transaction, carrera, periodo1);
    for (var matricula of ListadosMatriculas.data) {
      var listadoPeriodo = [];
      for (var periodo of ListaRangoPeriodo) {
        var VerificacionMatricula = await procesoCupo.EncontrarEstudianteMatriculadodadoCodigo(transaction, carrera, periodo, matricula.strCodEstud);
        if (VerificacionMatricula.count > 0) {
          var VerificaPeriodos = {
            periodo: periodo,
            matricula: true,
            Nivel: VerificacionMatricula.data[0].strCodNivel,
            descripcion: periodo + " " + "SI MATRICULA",
          }
        } else {
          var VerificaPeriodos = {
            periodo: periodo,
            matricula: false,
            Nivel: null,
            descripcion: periodo + " " + "NO MATRICULA",
          };
        }
        listadoPeriodo.push(VerificaPeriodos)
      }
      matricula.Periodos = listadoPeriodo;
      listado.push(matricula)
    }
    return listado
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    
    return 'ERROR';
  } finally {
    await transaction.commit();
    // Cerrar la conexión
    await pool.close();
  }

}



// Función para generar el gráfico
async function generatePieChart(listado) {
  const width = 600; // width of the canvas
  const height = 400; // height of the canvas
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, plugins: { modern: ['chartjs-plugin-datalabels'] } });
  const labels = listado.map(item => item.Descripcion);
  const values = listado.map(item => item.value);
  const percentages = listado.map(item => item.ValorPorcentaje + '%');
  const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'];
  const borderColors = ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'];
  const borderWidths = [2, 2, 2, 2, 2];
  const chartConfig = {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: borderWidths,

        percentages: percentages
      }]
    },
    options: {
      responsive: true,
      plugins: {
        drawLabelsPlugin: true // Activar el plugin personalizado
      },

    },
    plugins: [drawLabelsPlugin]
  };

  const image = chartJSNodeCanvas.renderToBufferSync(chartConfig);
  return image;
}

// Función para generar el PDF

async function generarReporteNoMatriculados(listado, listadoperiodo, carrera, cedula) {
  var datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
  var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
  var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
  var Cedula = ObtenerPersona.data.listado[0].pid_valor
  var cabeceralistado = "";
  var bodylistado = "";
  var contadot = 0;
  for (let periodo of listadoperiodo) {
    cabeceralistado += `
        <th style="font-size: 10px;text-align: center;">${periodo}</th>
`
  }
  var cabecera = ` <tr>
    <th colspan="12" style="text-align: center; font-size: 10px"> INFORMACIÓN ESTUDIANTES MATRICULADOS. </th>
    </tr>
    <tr>
    <th  style="text-align: center; font-size: 9px"> # </th>
    <th  style="text-align: center; font-size: 9px"> CÓDIGO</th>
    <th  style="text-align: center; font-size: 9px">ESTUDIANTES </th>
    <th  style="text-align: center; font-size: 9px">CÉDULA </th>
    ${cabeceralistado}
    </tr>`
  cabecera = "<thead>" + cabecera + "</thead>"
  for (let estudiantes of listado) {
    periodolistado = "";
    contadot = contadot + 1;
    for (let perrio of estudiantes.Periodos) {
      periodolistado += `<td style="font-size: 8px; text-align: center"> <strong>MATRICULA:</strong> ${perrio.matricula == true ? 'SI' : 'NO'} </br><strong>PERIODO:</strong> ${perrio.periodo} </br><strong>PAO:</strong> ${perrio.Nivel} </br> </td>`
    }
    bodylistado += `<tr >
        <td style="font-size: 8px; text-align: center;color:black"> ${contadot} </td>
        <td style="font-size: 8px; text-align: center;color:black"> ${estudiantes.strCodigo} </td>
        <td style="font-size: 8px; text-align: left;color:black"> ${estudiantes.strApellidos}  ${estudiantes.strNombres}</td>
        <td style="font-size: 8px; text-align: center;color:black"> ${estudiantes.strCedula} </td>
        ${periodolistado}
        </tr>`
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
   
     <style> table { border-collapse: collapse; width: 100%; } th, td { padding: 6px; text-align: left; } .nombre { margin-top: 7em; text-align: center; width: 100%; } hr{ width: 60%; } </style>
    </head>
    <body>
   
      <table border=2>
    ${cabecera}
      <tbody>
         ${bodylistado}
        </tbody>
      </table>
      <br/><br/>
      <div style="font-size: 9px; text-align: center">
</div>
<br/>
      <p style="text-align: center;"> <strong>--------------------------------</strong></p>
      <p style="text-align: center;font-size: 11px;">${strNombres}</p>
    </body>
    </html>
    `;

  const options = {
    format: 'A4',
    orientation: 'landscape',
    timeout: 60000,
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
  var htmlCompleto = tools.headerOcultoHtmlCarreras(datosCarrera.data[0]) + htmlContent + tools.footerOcultoHtml();
  var base64 = await FunciongenerarPDF(htmlCompleto, options)
  return base64

}
function FunciongenerarPDF(htmlCompleto, options) {
  return new Promise((resolve, reject) => {
    pdf.create(htmlCompleto, options).toFile("ReporteNoGenerado.pdf", function (err, res) {
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
function calcularValoresIntermedios(rangoInicio, rangoFin) {
  // Extraer la parte numérica de los rangos
  const numeroInicio = parseInt(rangoInicio.slice(1));
  const numeroFin = parseInt(rangoFin.slice(1));

  // Verificar que el rango inicio sea menor o igual al rango fin
  if (numeroInicio > numeroFin) {
    throw new Error("El rango de inicio debe ser menor o igual al rango de fin.");
  }

  // Generar los valores intermedios
  const valoresIntermedios = [];
  for (let i = numeroInicio; i <= numeroFin; i++) {
    // Formatear el número con ceros a la izquierda
    const valorFormateado = `P${i.toString().padStart(4, '0')}`;
    valoresIntermedios.push(valorFormateado);
  }

  return valoresIntermedios;
}

function verificarOAgregarObjeto(lista, objeto, claveUnica) {
  // Buscar el índice del objeto en la lista basado en la clave única
  const indice = lista.findIndex(elemento => elemento[claveUnica] === objeto[claveUnica]);
  if (indice === -1) {
    return false;
    // Si no se encuentra el objeto en la lista, agregar el objeto
  } else {
    return true;
    // Si se encuentra el objeto en la lista, añadir el atributo "siEsta"
  }
}

const defaultFonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
};
async function generatePDF1(listado, carrera, nombres, asignatura, nivel, paralelo, periodo) {
  try {
    // Obtener datos necesarios
    const chartBuffer = await generatePieChart(listado);
    const datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    const datosPeriodo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);

    // Función auxiliar para valores nulos
    const getValor = (valor, defaultValue = 'SIN REGISTRO') => {
      return valor !== null && valor !== undefined && valor !== '' ? valor : defaultValue;
    };

    // Preparar datos para la tabla
    const tableBody = listado.map((estudiante, index) => {
      const contador = index + 1;

      return [
        { text: contador.toString(), style: 'cellNumber' },
        { text: getValor(estudiante.Descripcion), style: 'cellDescription' },
        { text: getValor(estudiante.Rango), style: 'cellRange' },
        { text: getValor(estudiante.value?.toString()), style: 'cellQuantity' },
        { text: `${getValor(estudiante.ValorPorcentaje?.toString())} %`, style: 'cellPercentage' }
      ];
    });

    // Definir columnas de la tabla
    const tableColumns = [
      { text: 'N°', style: 'tableHeader' },
      { text: 'DESCRIPCIÓN', style: 'tableHeader' },
      { text: 'RANGO', style: 'tableHeader' },
      { text: 'CANTIDAD', style: 'tableHeader' },
      { text: 'PORCENTAJE', style: 'tableHeader' }
    ];

    // Definir widths para cada columna
    const tableWidths = ['8%', '42%', '20%', '15%', '15%'];

    // Contenido principal del PDF
    const content = [
      {
        margin: [0, 0, 0, 15],
        stack: [

          {
            text: [
              { text: 'PROFESOR: ', bold: true },
              { text: `${nombres}` }
            ],
            style: 'infoItem'
          },
          {
            text: [
              { text: 'ASIGNATURA: ', bold: true },
              { text: `${asignatura}` }
            ],
            style: 'infoItem'
          },
          {
            text: [
              { text: 'PAO: ', bold: true },
              { text: `${nivel}` }
            ],
            style: 'infoItem'
          },
          {
            text: [
              { text: 'PARALELO: ', bold: true },
              { text: `${paralelo}` }
            ],
            style: 'infoItem'
          },
          {
            text: [
              { text: 'PERIODO: ', bold: true },
              { text: `${datosPeriodo.data[0].strDescripcion}` }
            ],
            style: 'infoItem'
          },
        ]
      },
      {
        text: ' NIVEL DE CUMPLIMIENTO DE LOS RESULTADOS DE APRENDIZAJES - CICLO 1',
        style: 'tableTitle',
        alignment: 'center',
        margin: [0, 10, 0, 10]
      },
      {
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => '#e2e8f0',
          vLineColor: () => '#e2e8f0',
          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 5,
          paddingBottom: () => 5
        },
        table: {
          headerRows: 1,
          widths: tableWidths,
          body: [
            tableColumns.map(col => ({ text: col.text, style: col.style })),
            ...tableBody
          ]
        }
      },
      {
        margin: [0, 20, 0, 0],
        alignment: 'center',
        stack: [
          {
            image: `data:image/png;base64,${chartBuffer.toString('base64')}`,
            width: 300,
            alignment: 'center',
            margin: [0, 10, 0, 10]
          }
        ]
      },
      {
        margin: [0, 100, 0, 0],
        alignment: 'center',
        stack: [
          { text: '_________________________________________', style: 'signatureLine' },
          { text: nombres, style: 'signatureName' }
        ]
      }
    ];

    // Configurar opciones del layout base
    const layoutOptions = {
      title: 'RESULTADOS DE APRENDIZAJES',
      subtitle: `CARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
      pageMargins: [40, 120, 40, 70],
      pageOrientation: 'portrait'
    };

    // Crear layout base
    const baseLayout = createBaseLayout(layoutOptions);

    // Construir el documento PDF
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        infoItem: {
          fontSize: 10,
          alignment: 'left'
        },
        tableTitle: {
          fontSize: 9,
          bold: true,
          color: '#2c3e50',
          margin: [0, 8, 0, 8],
          alignment: 'center'
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          fillColor: '#eeeeee'
        },
        cellNumber: {
          fontSize: 8,
          alignment: 'center',
          bold: true,
          color: '#4a5568'
        },
        cellDescription: {
          fontSize: 8,
          alignment: 'left',
          bold: true,
          color: '#2d3748'
        },
        cellRange: {
          fontSize: 8,
          alignment: 'center',
          color: '#4a5568'
        },
        cellQuantity: {
          fontSize: 8,
          alignment: 'center',
          bold: true,
          color: '#2c5282'
        },
        cellPercentage: {
          fontSize: 8,
          alignment: 'center',
          bold: true,
          color: '#38a169'
        },
        signatureLine: {
          fontSize: 10,
          margin: [0, 0, 0, 5]
        },
        signatureName: {
          fontSize: 9,
          bold: true,
          margin: [0, 2, 0, 0]
        }
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };

    // Generar el PDF base64 usando la función existente
    const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
    return base64PDF;

  } catch (error) {
    console.error(error);
    
    throw error;
  }
}

async function generatePDF2(listado, carrera, nombres, asignatura, nivel, paralelo, periodo) {
  try {
    // Obtener datos necesarios
    const chartBuffer = await generatePieChart(listado);
    const datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    const datosPeriodo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);

    // Función auxiliar para valores nulos
    const getValor = (valor, defaultValue = 'SIN REGISTRO') => {
      return valor !== null && valor !== undefined && valor !== '' ? valor : defaultValue;
    };

    // Preparar datos para la tabla
    const tableBody = listado.map((estudiante, index) => {
      const contador = index + 1;

      return [
        { text: contador.toString(), style: 'cellNumber' },
        { text: getValor(estudiante.Descripcion), style: 'cellDescription' },
        { text: getValor(estudiante.Rango), style: 'cellRange' },
        { text: getValor(estudiante.value?.toString()), style: 'cellQuantity' },
        { text: `${getValor(estudiante.ValorPorcentaje?.toString())} %`, style: 'cellPercentage' }
      ];
    });

    // Definir columnas de la tabla
    const tableColumns = [
      { text: 'N°', style: 'tableHeader' },
      { text: 'DESCRIPCIÓN', style: 'tableHeader' },
      { text: 'RANGO', style: 'tableHeader' },
      { text: 'CANTIDAD', style: 'tableHeader' },
      { text: 'PORCENTAJE', style: 'tableHeader' }
    ];

    // Definir widths para cada columna
    const tableWidths = ['8%', '42%', '20%', '15%', '15%'];

    // Contenido principal del PDF
    const content = [
      {
        margin: [0, 0, 0, 15],
        stack: [

          {
            text: [
              { text: 'PROFESOR: ', bold: true },
              { text: `${nombres}` }
            ],
            style: 'infoItem'
          },
          {
            text: [
              { text: 'ASIGNATURA: ', bold: true },
              { text: `${asignatura}` }
            ],
            style: 'infoItem'
          },
          {
            text: [
              { text: 'PAO: ', bold: true },
              { text: `${nivel}` }
            ],
            style: 'infoItem'
          },
          {
            text: [
              { text: 'PARALELO: ', bold: true },
              { text: `${paralelo}` }
            ],
            style: 'infoItem'
          },
          {
            text: [
              { text: 'PERIODO: ', bold: true },
              { text: `${datosPeriodo.data[0].strDescripcion}` }
            ],
            style: 'infoItem'
          },
        ]
      },
      {
        text: ' NIVEL DE CUMPLIMIENTO DE LOS RESULTADOS DE APRENDIZAJES - CICLO 2',
        style: 'tableTitle',
        alignment: 'center',
        margin: [0, 10, 0, 10]
      },
      {
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => '#e2e8f0',
          vLineColor: () => '#e2e8f0',
          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 5,
          paddingBottom: () => 5
        },
        table: {
          headerRows: 1,
          widths: tableWidths,
          body: [
            tableColumns.map(col => ({ text: col.text, style: col.style })),
            ...tableBody
          ]
        }
      },
      {
        margin: [0, 20, 0, 0],
        alignment: 'center',
        stack: [
          {
            image: `data:image/png;base64,${chartBuffer.toString('base64')}`,
            width: 300,
            alignment: 'center',
            margin: [0, 10, 0, 10]
          }
        ]
      },
      {
        margin: [0, 100, 0, 0],
        alignment: 'center',
        stack: [
          { text: '_________________________________________', style: 'signatureLine' },
          { text: nombres, style: 'signatureName' }
        ]
      }
    ];

    // Configurar opciones del layout base
    const layoutOptions = {
      title: 'RESULTADOS DE APRENDIZAJES',
      subtitle: `CARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
      pageMargins: [40, 120, 40, 70],
      pageOrientation: 'portrait'
    };

    // Crear layout base
    const baseLayout = createBaseLayout(layoutOptions);

    // Construir el documento PDF
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        infoItem: {
          fontSize: 10,
          alignment: 'left'
        },
        tableTitle: {
          fontSize: 9,
          bold: true,
          color: '#2c3e50',
          margin: [0, 8, 0, 8],
          alignment: 'center'
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          fillColor: '#eeeeee'
        },
        cellNumber: {
          fontSize: 8,
          alignment: 'center',
          bold: true,
          color: '#4a5568'
        },
        cellDescription: {
          fontSize: 8,
          alignment: 'left',
          bold: true,
          color: '#2d3748'
        },
        cellRange: {
          fontSize: 8,
          alignment: 'center',
          color: '#4a5568'
        },
        cellQuantity: {
          fontSize: 8,
          alignment: 'center',
          bold: true,
          color: '#2c5282'
        },
        cellPercentage: {
          fontSize: 8,
          alignment: 'center',
          bold: true,
          color: '#38a169'
        },
        signatureLine: {
          fontSize: 10,
          margin: [0, 0, 0, 5]
        },
        signatureName: {
          fontSize: 9,
          bold: true,
          margin: [0, 2, 0, 0]
        }
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };

    // Generar el PDF base64 usando la función existente
    const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
    return base64PDF;

  } catch (error) {
    console.error(error);
    
    throw error;
  }
}
async function generatePDFR(listado, carrera, nombres, asignatura, nivel, paralelo, periodo) {
  try {
    // Obtener datos necesarios
    const chartBuffer = await generatePieChart(listado);
    const datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    const datosPeriodo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);

    // Función auxiliar para valores nulos
    const getValor = (valor, defaultValue = 'SIN REGISTRO') => {
      return valor !== null && valor !== undefined && valor !== '' ? valor : defaultValue;
    };

    // Preparar datos para la tabla
    const tableBody = listado.map((estudiante, index) => {
      const contador = index + 1;

      return [
        { text: contador.toString(), style: 'cellNumber' },
        { text: getValor(estudiante.Descripcion), style: 'cellDescription' },
        { text: getValor(estudiante.Rango), style: 'cellRange' },
        { text: getValor(estudiante.value?.toString()), style: 'cellQuantity' },
        { text: `${getValor(estudiante.ValorPorcentaje?.toString())} %`, style: 'cellPercentage' }
      ];
    });

    // Definir columnas de la tabla
    const tableColumns = [
      { text: 'N°', style: 'tableHeader' },
      { text: 'DESCRIPCIÓN', style: 'tableHeader' },
      { text: 'RANGO', style: 'tableHeader' },
      { text: 'CANTIDAD', style: 'tableHeader' },
      { text: 'PORCENTAJE', style: 'tableHeader' }
    ];

    // Definir widths para cada columna
    const tableWidths = ['8%', '42%', '20%', '15%', '15%'];

    // Contenido principal del PDF
    const content = [
      {
        margin: [0, 0, 0, 15],
        stack: [

          {
            text: [
              { text: 'PROFESOR: ', bold: true },
              { text: `${nombres}` }
            ],
            style: 'infoItem'
          },
          {
            text: [
              { text: 'ASIGNATURA: ', bold: true },
              { text: `${asignatura}` }
            ],
            style: 'infoItem'
          },
          {
            text: [
              { text: 'PAO: ', bold: true },
              { text: `${nivel}` }
            ],
            style: 'infoItem'
          },
          {
            text: [
              { text: 'PARALELO: ', bold: true },
              { text: `${paralelo}` }
            ],
            style: 'infoItem'
          },
          {
            text: [
              { text: 'PERIODO: ', bold: true },
              { text: `${datosPeriodo.data[0].strDescripcion}` }
            ],
            style: 'infoItem'
          },
        ]
      },
      {
        text: ' NIVEL DE CUMPLIMIENTO DE LOS RESULTADOS DE APRENDIZAJES - RECUPERACIÓN',
        style: 'tableTitle',
        alignment: 'center',
        margin: [0, 10, 0, 10]
      },
      {
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => '#e2e8f0',
          vLineColor: () => '#e2e8f0',
          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 5,
          paddingBottom: () => 5
        },
        table: {
          headerRows: 1,
          widths: tableWidths,
          body: [
            tableColumns.map(col => ({ text: col.text, style: col.style })),
            ...tableBody
          ]
        }
      },
      {
        margin: [0, 20, 0, 0],
        alignment: 'center',
        stack: [
          {
            image: `data:image/png;base64,${chartBuffer.toString('base64')}`,
            width: 300,
            alignment: 'center',
            margin: [0, 10, 0, 10]
          }
        ]
      },
      {
        margin: [0, 100, 0, 0],
        alignment: 'center',
        stack: [
          { text: '_________________________________________', style: 'signatureLine' },
          { text: nombres, style: 'signatureName' }
        ]
      }
    ];

    // Configurar opciones del layout base
    const layoutOptions = {
      title: 'RESULTADOS DE APRENDIZAJES',
      subtitle: `CARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
      pageMargins: [40, 120, 40, 70],
      pageOrientation: 'portrait'
    };

    // Crear layout base
    const baseLayout = createBaseLayout(layoutOptions);

    // Construir el documento PDF
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        infoItem: {
          fontSize: 10,
          alignment: 'left'
        },
        tableTitle: {
          fontSize: 9,
          bold: true,
          color: '#2c3e50',
          margin: [0, 8, 0, 8],
          alignment: 'center'
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          fillColor: '#eeeeee'
        },
        cellNumber: {
          fontSize: 8,
          alignment: 'center',
          bold: true,
          color: '#4a5568'
        },
        cellDescription: {
          fontSize: 8,
          alignment: 'left',
          bold: true,
          color: '#2d3748'
        },
        cellRange: {
          fontSize: 8,
          alignment: 'center',
          color: '#4a5568'
        },
        cellQuantity: {
          fontSize: 8,
          alignment: 'center',
          bold: true,
          color: '#2c5282'
        },
        cellPercentage: {
          fontSize: 8,
          alignment: 'center',
          bold: true,
          color: '#38a169'
        },
        signatureLine: {
          fontSize: 10,
          margin: [0, 0, 0, 5]
        },
        signatureName: {
          fontSize: 9,
          bold: true,
          margin: [0, 2, 0, 0]
        }
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };

    // Generar el PDF base64 usando la función existente
    const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
    return base64PDF;

  } catch (error) {
    console.error(error);
    
    throw error;
  }
}
async function generatePieChart(listado) {
  const width = 600; // width of the canvas
  const height = 400; // height of the canvas
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, plugins: { modern: ['chartjs-plugin-datalabels'] } });
  const labels = listado.map(item => item.Descripcion);
  const values = listado.map(item => item.value);
  const percentages = listado.map(item => item.ValorPorcentaje + '%');
  const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'];
  const borderColors = ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'];
  const borderWidths = [2, 2, 2, 2, 2];
  const chartConfig = {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: borderWidths,

        percentages: percentages
      }]
    },
    options: {
      responsive: true,
      plugins: {
        drawLabelsPlugin: true // Activar el plugin personalizado
      },

    },
    plugins: [drawLabelsPlugin]
  };

  const image = chartJSNodeCanvas.renderToBufferSync(chartConfig);
  return image;
}
const drawLabelsPlugin = {
  id: 'drawLabelsPlugin',
  afterDatasetsDraw: (chart) => {
    const ctx = chart.ctx;
    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);

    ctx.save();

    const labelPositions = [];

    meta.data.forEach((dataPoint, index) => {
      const { x, y } = dataPoint.tooltipPosition();
      const label = `(${dataset.percentages[index]})`;

      // Calcular la posición de la etiqueta
      const angle = (dataPoint.startAngle + dataPoint.endAngle) / 2;
      const radius = dataPoint.outerRadius + 0; // Incrementar el radio para mejor visibilidad
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;
      const labelX = chart.width / 2 + offsetX;
      const labelY = chart.height / 2 + offsetY;

      labelPositions.push({ x: labelX, y: labelY, label, xOriginal: x, yOriginal: y });
    });

    // Ordenar las posiciones de las etiquetas de abajo hacia arriba
    labelPositions.sort((a, b) => b.y - a.y);

    // Ajustar las posiciones para evitar solapamientos
    for (let i = 0; i < labelPositions.length; i++) {
      for (let j = i + 1; j < labelPositions.length; j++) {
        const distance = Math.sqrt(
          Math.pow(labelPositions[i].x - labelPositions[j].x, 2) +
          Math.pow(labelPositions[i].y - labelPositions[j].y, 2)
        );
        if (distance < 50) { // Ajustar la distancia mínima
          labelPositions[j].y += 40; // Desplazar la etiqueta
        }
      }
    }

    // Dibujar las etiquetas y líneas de conexión
    labelPositions.forEach(pos => {
      // Dibujar la línea de conexión
      ctx.beginPath();
      ctx.moveTo(pos.xOriginal, pos.yOriginal);
      ctx.lineTo(pos.x, pos.y);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.stroke();

      // Dibujar la etiqueta
      ctx.font = '12px Arial';
      ctx.textAlign = pos.x > chart.width / 2 ? 'left' : 'right';
      ctx.fillStyle = 'black';
      ctx.fillText(pos.label, pos.x, pos.y);
    });

    ctx.restore();
  }
};

