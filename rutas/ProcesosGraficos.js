const express = require('express');
const router = express.Router();
const Request = require("request");
const fs = require('fs');
const axios = require('axios');
const https = require('https');
const puppeteer = require('puppeteer');
const tools = require('./tools');
const pdf = require('html-pdf');
const procesoAcadeicoNotas = require('../rutas/ProcesoNotasAcademico');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const procesoCupo = require('../modelo/procesocupos');
const Chart = require('chart.js');
const ChartDataLabels = require('chartjs-plugin-datalabels');
const crypto = require("crypto");
const { iniciarDinamicoPool, iniciarDinamicoTransaccion } = require("./../config/execSQLDinamico.helper");
Chart.register(ChartDataLabels);

const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});
module.exports.Graficopdf1 = async function (carrera, periodo, nivel, paralelo, codMateria, cedula, idreglamento, nombres, asignatura) {
    try {
        var listado = await ProcesoGraficosParciales1(carrera, periodo, nivel, paralelo, codMateria, cedula, idreglamento);
        var base64 = await generatePDF1(listado, carrera, nombres, asignatura, nivel, paralelo, periodo);


        return base64
    } catch (error) {
        console.log(error);
    }
}
module.exports.Graficopdf2 = async function (carrera, periodo, nivel, paralelo, codMateria, cedula, idreglamento, nombres, asignatura) {
    try {
        var listado = await ProcesoGraficosParciales2(carrera, periodo, nivel, paralelo, codMateria, cedula, idreglamento);
        var base64 = await generatePDF2(listado, carrera, nombres, asignatura, nivel, paralelo, periodo);


        return base64
    } catch (error) {
        console.log(error);
    }
}
module.exports.GraficopdfR = async function (carrera, periodo, nivel, paralelo, codMateria, cedula, idreglamento, nombres, asignatura) {
    try {
        var listado = await ProcesoGraficosParcialesR(carrera, periodo, nivel, paralelo, codMateria, cedula, idreglamento);
        var base64 = await generatePDFR(listado, carrera, nombres, asignatura, nivel, paralelo, periodo);


        return base64
    } catch (error) {
        console.log(error);
    }
}
module.exports.ReporteNoMatriculado = async function (carrera, periodo1, periodo2,cedula) {
    try {
        var ListaRangoPeriodo = await calcularValoresIntermedios(periodo1, periodo2);
        var listado = await ProcesoReporteNoMatriculado(carrera, periodo1, periodo2);
        var base64 = await generarReporteNoMatriculados(listado, ListaRangoPeriodo,carrera,cedula);

        return base64
    } catch (error) {
        console.log(error);
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

                    if(element.Calificacion==null){
                        element.notaparcial=0;
                        estudiantes.push(element);
                      }else{
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
        console.log(error);
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
                    if(element.Calificacion==null){
                        element.notaparcial=0;
                        estudiantes.push(element);
                      }else{
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
        console.log(error);
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
        console.log(error);
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
        await transaction.rollback();
        console.error(err);
        return 'ERROR';
    } finally {
        await transaction.commit();
        // Cerrar la conexión
        await pool.close();
    }

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

    const image = await chartJSNodeCanvas.renderToBuffer(chartConfig);
    return image;
}

// Función para generar el PDF
async function generatePDF1(listado, carrera, nombres, asignatura, nivel, paralelo, periodo) {

    const chartBuffer = await generatePieChart(listado);
    var datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    var periodo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);
    var bodylistado = "";
    var contadot = 0;
    
    for (let estudiantes of listado) {
        contadot = contadot + 1;
        bodylistado += `<tr class="table-row">
            <td class="cell-number"> ${contadot}  </td>
            <td class="cell-description"> ${estudiantes.Descripcion}  </td>
            <td class="cell-range"> ${estudiantes.Rango}  </td>
            <td class="cell-quantity"> ${estudiantes.value}  </td>
            <td class="cell-percentage"> ${estudiantes.ValorPorcentaje} %  </td>
        </tr>`;
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Helvetica', 'Arial', sans-serif;
                    background-color: #ffffff;
                    color: #333333;
                    line-height: 1.3;
                }
                
                /* Encabezado principal */
                .main-header {
                    text-align: center;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #2c3e50;
                }
                
                .university-title {
                    font-size: 12px;
                    font-weight: bold;
                    color: #1a3e60;
                    letter-spacing: 1px;
                    margin-bottom: 3px;
                }
                
                .faculty-title {
                    font-size: 10px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 2px;
                }
                
                .career-title {
                    font-size: 10px;
                    font-weight: bold;
                    color: #34495e;
                    margin-bottom: 2px;
                }
                
                /* Contenedor de información en dos columnas - VERSIÓN CORREGIDA */
                .info-container {
                    background: #f8f9fa;
                    padding: 12px 15px;
                    margin: 10px 0;
                    border-left: 4px solid #3498db;
                    border-radius: 4px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px 20px;
                }
                
                /* Cada item de información */
                .info-item {
                    display: flex;
                    align-items: baseline;
                    font-size: 9px;
                    padding: 3px 0;
                }
                
                .info-label {
                    font-weight: bold;
                    min-width: 75px;
                    color: #2c3e50;
                    font-size: 9px;
                }
                
                .info-value {
                    color: #555;
                    flex: 1;
                    font-size: 9px;
                    font-weight: 500;
                }
                
                /* Tabla mejorada y compacta */
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 12px 0;
                    font-size: 8px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
                }
                
                .data-table th {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 6px 4px;
                    font-weight: bold;
                    text-align: center;
                    border: 1px solid #5a67d8;
                    font-size: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }
                
                .data-table td {
                    padding: 5px 4px;
                    text-align: center;
                    border: 1px solid #e2e8f0;
                    font-size: 8px;
                }
                
                .data-table tbody tr:nth-child(even) {
                    background-color: #f8fafc;
                }
                
                /* Estilos específicos para celdas */
                .cell-number {
                    font-weight: bold;
                    color: #4a5568;
                    text-align: center;
                }
                
                .cell-description {
                    text-align: left;
                    font-weight: 500;
                    color: #2d3748;
                }
                
                .cell-range {
                    text-align: center;
                    color: #4a5568;
                }
                
                .cell-quantity {
                    text-align: center;
                    font-weight: bold;
                    color: #2c5282;
                }
                
                .cell-percentage {
                    text-align: center;
                    font-weight: bold;
                    color: #38a169;
                }
                
                /* Contenedor del gráfico */
                .chart-container {
                    text-align: center;
                    margin: 15px 0 10px 0;
                    padding: 10px;
                    background: #ffffff;
                    border-radius: 6px;
                }
                
                .chart-container img {
                    max-width: 100%;
                    height: auto;
                    max-height: 180px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
                    border-radius: 4px;
                }
                
                /* Firma compacta */
                .signature {
                    text-align: center;
                    margin-top: 15px;
                    padding-top: 12px;
                    border-top: 1px solid #cbd5e0;
                }
                
                .signature-line {
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 4px;
                    font-size: 9px;
                }
                
                .signature-name {
                    font-size: 8px;
                    color: #4a5568;
                    font-style: italic;
                }
                
                /* Título de la tabla */
                .table-title {
                    text-align: center;
                    font-size: 9px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin: 8px 0 6px 0;
                    padding: 5px;
                    background: #ecf0f1;
                    border-radius: 3px;
                }
                
                /* Ajustes para asegurar una sola página */
                @media print {
                    body {
                        background: white;
                    }
                    
                    .chart-container, .signature {
                        page-break-inside: avoid;
                    }
                    
                    .data-table {
                        page-break-inside: auto;
                    }
                    
                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                }
            </style>
        </head>
        <body>
            <div class="page-content">
                <div class="main-header">
                    <div class="university-title">ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO</div>
                    <div class="faculty-title">FACULTAD: ${datosCarrera.data[0].strNombreFacultad}</div>
                    <div class="career-title">CARRERA: ${datosCarrera.data[0].strNombreCarrera}</div>
                </div>
                
                <!-- Información en dos columnas - ESTRUCTURA CORREGIDA -->
                <div class="info-container">
                 <div class="info-item">
                        <div class="info-label">PERIODO:</div>
                        <div class="info-value">${periodo.data[0].strDescripcion}</div>
                    </div>
                      <div class="info-item">
                        <div class="info-label">PROFESOR:</div>
                        <div class="info-value">${nombres}</div>
                    </div>
                       <div class="info-item">
                        <div class="info-label">ASIGNATURA:</div>
                        <div class="info-value">${asignatura}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">PAO:</div>
                        <div class="info-value">${nivel}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">PARALELO:</div>
                        <div class="info-value">${paralelo}</div>
                    </div>
                 
                  
                   
                </div>
                
                <div class="table-title">
                     📊 NIVEL DE CUMPLIMIENTO DE LOS RESULTADOS DE APRENDIZAJES - CICLO 1
                </div>
                
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 8%">N°</th>
                            <th style="width: 42%">DESCRIPCIÓN</th>
                            <th style="width: 20%">RANGO</th>
                            <th style="width: 15%">CANTIDAD</th>
                            <th style="width: 15%">PORCENTAJE</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bodylistado}
                    </tbody>
                </table>
                 <br/>
                <br/>
                <div class="chart-container">
                    <img src="data:image/png;base64,${chartBuffer.toString('base64')}" alt="Gráfico de distribución"/>
                </div>
                   <br/>
                <br/>
                <br/>
                <br/>
                <div class="signature">
                    <div class="signature-line">_________________________________________</div>
                    <div class="signature-name">${nombres}</div>
                </div>
            </div>
        </body>
        </html>
    `;
    
    const options = {
        format: 'A4',
        timeout: 60000,
        border: {
            top: '0.8cm',
            right: '1.2cm',
            bottom: '1.5cm',
            left: '1.2cm'
        },
        header: {
            height: '50px',
            contents: tools.headerHtml()
        },
        footer: {
            height: '25px',
            contents: tools.footerHtml()
        },
    };
    
    var htmlCompleto = tools.headerOcultoHtml() + htmlContent + tools.footerOcultoHtml();
    var base64 = await FunciongenerarPDF(htmlCompleto, options);
    return base64;
}
// Función para generar el PDF
async function generatePDF2(listado, carrera, nombres, asignatura, nivel, paralelo, periodo) {

    const chartBuffer = await generatePieChart(listado);
    var datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    var periodo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);
    var bodylistado = "";
    var contadot = 0;
    
    for (let estudiantes of listado) {
        contadot = contadot + 1;
        bodylistado += `<tr class="table-row">
            <td class="cell-number"> ${contadot}  </td>
            <td class="cell-description"> ${estudiantes.Descripcion}  </td>
            <td class="cell-range"> ${estudiantes.Rango}  </td>
            <td class="cell-quantity"> ${estudiantes.value}  </td>
            <td class="cell-percentage"> ${estudiantes.ValorPorcentaje} %  </td>
        </tr>`;
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Helvetica', 'Arial', sans-serif;
                    background-color: #ffffff;
                    color: #333333;
                    line-height: 1.3;
                }
                
                /* Encabezado principal */
                .main-header {
                    text-align: center;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #2c3e50;
                }
                
                .university-title {
                    font-size: 12px;
                    font-weight: bold;
                    color: #1a3e60;
                    letter-spacing: 1px;
                    margin-bottom: 3px;
                }
                
                .faculty-title {
                    font-size: 10px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 2px;
                }
                
                .career-title {
                    font-size: 10px;
                    font-weight: bold;
                    color: #34495e;
                    margin-bottom: 2px;
                }
                
                /* Contenedor de información en dos columnas - VERSIÓN CORREGIDA */
                .info-container {
                    background: #f8f9fa;
                    padding: 12px 15px;
                    margin: 10px 0;
                    border-left: 4px solid #3498db;
                    border-radius: 4px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px 20px;
                }
                
                /* Cada item de información */
                .info-item {
                    display: flex;
                    align-items: baseline;
                    font-size: 9px;
                    padding: 3px 0;
                }
                
                .info-label {
                    font-weight: bold;
                    min-width: 75px;
                    color: #2c3e50;
                    font-size: 9px;
                }
                
                .info-value {
                    color: #555;
                    flex: 1;
                    font-size: 9px;
                    font-weight: 500;
                }
                
                /* Tabla mejorada y compacta */
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 12px 0;
                    font-size: 8px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
                }
                
                .data-table th {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 6px 4px;
                    font-weight: bold;
                    text-align: center;
                    border: 1px solid #5a67d8;
                    font-size: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }
                
                .data-table td {
                    padding: 5px 4px;
                    text-align: center;
                    border: 1px solid #e2e8f0;
                    font-size: 8px;
                }
                
                .data-table tbody tr:nth-child(even) {
                    background-color: #f8fafc;
                }
                
                /* Estilos específicos para celdas */
                .cell-number {
                    font-weight: bold;
                    color: #4a5568;
                    text-align: center;
                }
                
                .cell-description {
                    text-align: left;
                    font-weight: 500;
                    color: #2d3748;
                }
                
                .cell-range {
                    text-align: center;
                    color: #4a5568;
                }
                
                .cell-quantity {
                    text-align: center;
                    font-weight: bold;
                    color: #2c5282;
                }
                
                .cell-percentage {
                    text-align: center;
                    font-weight: bold;
                    color: #38a169;
                }
                
                /* Contenedor del gráfico */
                .chart-container {
                    text-align: center;
                    margin: 15px 0 10px 0;
                    padding: 10px;
                    background: #ffffff;
                    border-radius: 6px;
                }
                
                .chart-container img {
                    max-width: 100%;
                    height: auto;
                    max-height: 180px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
                    border-radius: 4px;
                }
                
                /* Firma compacta */
                .signature {
                    text-align: center;
                    margin-top: 15px;
                    padding-top: 12px;
                    border-top: 1px solid #cbd5e0;
                }
                
                .signature-line {
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 4px;
                    font-size: 9px;
                }
                
                .signature-name {
                    font-size: 8px;
                    color: #4a5568;
                    font-style: italic;
                }
                
                /* Título de la tabla */
                .table-title {
                    text-align: center;
                    font-size: 9px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin: 8px 0 6px 0;
                    padding: 5px;
                    background: #ecf0f1;
                    border-radius: 3px;
                }
                
                /* Ajustes para asegurar una sola página */
                @media print {
                    body {
                        background: white;
                    }
                    
                    .chart-container, .signature {
                        page-break-inside: avoid;
                    }
                    
                    .data-table {
                        page-break-inside: auto;
                    }
                    
                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                }
            </style>
        </head>
        <body>
            <div class="page-content">
                <div class="main-header">
                    <div class="university-title">ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO</div>
                    <div class="faculty-title">FACULTAD: ${datosCarrera.data[0].strNombreFacultad}</div>
                    <div class="career-title">CARRERA: ${datosCarrera.data[0].strNombreCarrera}</div>
                </div>
                
                <!-- Información en dos columnas - ESTRUCTURA CORREGIDA -->
                <div class="info-container">
                 <div class="info-item">
                        <div class="info-label">PERIODO:</div>
                        <div class="info-value">${periodo.data[0].strDescripcion}</div>
                    </div>
                      <div class="info-item">
                        <div class="info-label">PROFESOR:</div>
                        <div class="info-value">${nombres}</div>
                    </div>
                       <div class="info-item">
                        <div class="info-label">ASIGNATURA:</div>
                        <div class="info-value">${asignatura}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">PAO:</div>
                        <div class="info-value">${nivel}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">PARALELO:</div>
                        <div class="info-value">${paralelo}</div>
                    </div>
                 
                  
                   
                </div>
                
                <div class="table-title">
                    📊 NIVEL DE CUMPLIMIENTO DE LOS RESULTADOS DE APRENDIZAJES - CICLO 2
                </div>
                
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 8%">N°</th>
                            <th style="width: 42%">DESCRIPCIÓN</th>
                            <th style="width: 20%">RANGO</th>
                            <th style="width: 15%">CANTIDAD</th>
                            <th style="width: 15%">PORCENTAJE</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bodylistado}
                    </tbody>
                </table>
                 <br/>
                <br/>
                <div class="chart-container">
                    <img src="data:image/png;base64,${chartBuffer.toString('base64')}" alt="Gráfico de distribución"/>
                </div>
                  <br/>
                <br/>
                <br/>
                <br/>
                <div class="signature">
                    <div class="signature-line">_________________________________________</div>
                    <div class="signature-name">${nombres}</div>
                </div>
            </div>
        </body>
        </html>
    `;
    
    const options = {
        format: 'A4',
        timeout: 60000,
        border: {
            top: '0.8cm',
            right: '1.2cm',
            bottom: '1.5cm',
            left: '1.2cm'
        },
        header: {
            height: '50px',
            contents: tools.headerHtml()
        },
        footer: {
            height: '25px',
            contents: tools.footerHtml()
        },
    };
    
    var htmlCompleto = tools.headerOcultoHtml() + htmlContent + tools.footerOcultoHtml();
    var base64 = await FunciongenerarPDF(htmlCompleto, options);
    return base64;
}
async function generatePDFR(listado, carrera, nombres, asignatura, nivel, paralelo, periodo) {

    const chartBuffer = await generatePieChart(listado);
    var datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    var periodo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);
    var bodylistado = "";
    var contadot = 0;
    
    for (let estudiantes of listado) {
        contadot = contadot + 1;
        bodylistado += `<tr class="table-row">
            <td class="cell-number"> ${contadot}  </td>
            <td class="cell-description"> ${estudiantes.Descripcion}  </td>
            <td class="cell-range"> ${estudiantes.Rango}  </td>
            <td class="cell-quantity"> ${estudiantes.value}  </td>
            <td class="cell-percentage"> ${estudiantes.ValorPorcentaje} %  </td>
        </tr>`;
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Helvetica', 'Arial', sans-serif;
                    background-color: #ffffff;
                    color: #333333;
                    line-height: 1.3;
                }
                
                /* Encabezado principal */
                .main-header {
                    text-align: center;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #2c3e50;
                }
                
                .university-title {
                    font-size: 12px;
                    font-weight: bold;
                    color: #1a3e60;
                    letter-spacing: 1px;
                    margin-bottom: 3px;
                }
                
                .faculty-title {
                    font-size: 10px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 2px;
                }
                
                .career-title {
                    font-size: 10px;
                    font-weight: bold;
                    color: #34495e;
                    margin-bottom: 2px;
                }
                
                /* Contenedor de información en dos columnas - VERSIÓN CORREGIDA */
                .info-container {
                    background: #f8f9fa;
                    padding: 12px 15px;
                    margin: 10px 0;
                    border-left: 4px solid #3498db;
                    border-radius: 4px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px 20px;
                }
                
                /* Cada item de información */
                .info-item {
                    display: flex;
                    align-items: baseline;
                    font-size: 9px;
                    padding: 3px 0;
                }
                
                .info-label {
                    font-weight: bold;
                    min-width: 75px;
                    color: #2c3e50;
                    font-size: 9px;
                }
                
                .info-value {
                    color: #555;
                    flex: 1;
                    font-size: 9px;
                    font-weight: 500;
                }
                
                /* Tabla mejorada y compacta */
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 12px 0;
                    font-size: 8px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
                }
                
                .data-table th {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 6px 4px;
                    font-weight: bold;
                    text-align: center;
                    border: 1px solid #5a67d8;
                    font-size: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }
                
                .data-table td {
                    padding: 5px 4px;
                    text-align: center;
                    border: 1px solid #e2e8f0;
                    font-size: 8px;
                }
                
                .data-table tbody tr:nth-child(even) {
                    background-color: #f8fafc;
                }
                
                /* Estilos específicos para celdas */
                .cell-number {
                    font-weight: bold;
                    color: #4a5568;
                    text-align: center;
                }
                
                .cell-description {
                    text-align: left;
                    font-weight: 500;
                    color: #2d3748;
                }
                
                .cell-range {
                    text-align: center;
                    color: #4a5568;
                }
                
                .cell-quantity {
                    text-align: center;
                    font-weight: bold;
                    color: #2c5282;
                }
                
                .cell-percentage {
                    text-align: center;
                    font-weight: bold;
                    color: #38a169;
                }
                
                /* Contenedor del gráfico */
                .chart-container {
                    text-align: center;
                    margin: 15px 0 10px 0;
                    padding: 10px;
                    background: #ffffff;
                    border-radius: 6px;
                }
                
                .chart-container img {
                    max-width: 100%;
                    height: auto;
                    max-height: 180px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
                    border-radius: 4px;
                }
                
                /* Firma compacta */
                .signature {
                    text-align: center;
                    margin-top: 15px;
                    padding-top: 12px;
                    border-top: 1px solid #cbd5e0;
                }
                
                .signature-line {
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 4px;
                    font-size: 9px;
                }
                
                .signature-name {
                    font-size: 8px;
                    color: #4a5568;
                    font-style: italic;
                }
                
                /* Título de la tabla */
                .table-title {
                    text-align: center;
                    font-size: 9px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin: 8px 0 6px 0;
                    padding: 5px;
                    background: #ecf0f1;
                    border-radius: 3px;
                }
                
                /* Ajustes para asegurar una sola página */
                @media print {
                    body {
                        background: white;
                    }
                    
                    .chart-container, .signature {
                        page-break-inside: avoid;
                    }
                    
                    .data-table {
                        page-break-inside: auto;
                    }
                    
                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                }
            </style>
        </head>
        <body>
            <div class="page-content">
                <div class="main-header">
                    <div class="university-title">ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO</div>
                    <div class="faculty-title">FACULTAD: ${datosCarrera.data[0].strNombreFacultad}</div>
                    <div class="career-title">CARRERA: ${datosCarrera.data[0].strNombreCarrera}</div>
                </div>
                
                <!-- Información en dos columnas - ESTRUCTURA CORREGIDA -->
                <div class="info-container">
                 <div class="info-item">
                        <div class="info-label">PERIODO:</div>
                        <div class="info-value">${periodo.data[0].strDescripcion}</div>
                    </div>
                      <div class="info-item">
                        <div class="info-label">PROFESOR:</div>
                        <div class="info-value">${nombres}</div>
                    </div>
                       <div class="info-item">
                        <div class="info-label">ASIGNATURA:</div>
                        <div class="info-value">${asignatura}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">PAO:</div>
                        <div class="info-value">${nivel}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">PARALELO:</div>
                        <div class="info-value">${paralelo}</div>
                    </div>
                 
                  
                   
                </div>
                
                <div class="table-title">
                    📊 NIVEL DE CUMPLIMIENTO DE LOS RESULTADOS DE APRENDIZAJES - RECUPERACIÓN
                </div>
                
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 8%">N°</th>
                            <th style="width: 42%">DESCRIPCIÓN</th>
                            <th style="width: 20%">RANGO</th>
                            <th style="width: 15%">CANTIDAD</th>
                            <th style="width: 15%">PORCENTAJE</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bodylistado}
                    </tbody>
                </table>
                 <br/>
                <br/>
                <div class="chart-container">
                    <img src="data:image/png;base64,${chartBuffer.toString('base64')}" alt="Gráfico de distribución"/>
                </div>
                 <br/>
                <br/>
                <br/>
                <br/>
                <div class="signature">
                    <div class="signature-line">_________________________________________</div>
                    <div class="signature-name">${nombres}</div>
                </div>
            </div>
        </body>
        </html>
    `;
    
    const options = {
        format: 'A4',
        timeout: 60000,
        border: {
            top: '0.8cm',
            right: '1.2cm',
            bottom: '1.5cm',
            left: '1.2cm'
        },
        header: {
            height: '50px',
            contents: tools.headerHtml()
        },
        footer: {
            height: '25px',
            contents: tools.footerHtml()
        },
    };
    
    var htmlCompleto = tools.headerOcultoHtml() + htmlContent + tools.footerOcultoHtml();
    var base64 = await FunciongenerarPDF(htmlCompleto, options);
    return base64;
}
async function generarReporteNoMatriculados(listado, listadoperiodo,carrera,cedula) {
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
        periodolistado="";
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

