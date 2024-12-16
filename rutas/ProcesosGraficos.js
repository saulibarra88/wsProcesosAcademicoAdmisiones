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
                    for (var index2 = 0; index2 < element.Calificacion.length; index2++) {
                        if (index2 == 0) {
                            const datosNotas = element.Calificacion[0];
                            datosNotas.dcParcial2 = datosNotas.dcParcial2 == null ? 0 : datosNotas.dcParcial2;
                            if ((Number(datosNotas.dcParcial2) >= Number(equivalencia.eqrenminimo)) && (Number(datosNotas.dcParcial2) <= Number(equivalencia.eqrenmaximo))) {
                                equivalencia.contador = equivalencia.contador + 1;
                                element.notaparcial = datosNotas.dcParcial1;
                                estudiantes.push(element);
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
        bodylistado += `<tr >
            <td style="font-size: 9px; text-align: center"> ${contadot} </td>
            <td style="font-size: 9px; text-align: center"> ${estudiantes.Descripcion} </td>
            <td style="font-size: 9px; text-align: center"> ${estudiantes.Rango} </td>
            <td style="font-size: 9px; text-align: center"> ${estudiantes.value} </td>
            <td style="font-size: 9px; text-align: center"> ${estudiantes.ValorPorcentaje} % </td>
            </tr>`
    }

    const htmlContent = `
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                <style> table { border-collapse: collapse; width: 100%; } th, td { padding: 5px; text-align: left; } th { background-color: #f2f2f2; } .nombre { margin-top: 7em; text-align: center; width: 100%; } hr{ width: 60%; } </style>
                    </head>
                    <body>
                    <p style='text-align: center;font-size: 11px'> <strong>ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO</strong>  </p><p style='text-align: center;font-size: 10px'> <strong>FACULTAD: ${datosCarrera.data[0].strNombreFacultad}</strong> </p><p style='text-align: center;font-size: 10px'><strong>CARRERA: ${datosCarrera.data[0].strNombreCarrera}</strong> </p>
                <p style='font-size: 9px'> <strong>PAO :</strong> ${nivel}</p>
                <p style='font-size: 9px'> <strong>PARALELO :</strong> ${paralelo}</p>
                <p style='font-size: 9px'> <strong>ASIGNARURA :</strong> ${asignatura}</p>
                <p style='font-size: 9px'> <strong>PROFESOR :</strong>${nombres} </p>
                <p style='font-size: 9px'> <strong>PERIODO :</strong> ${periodo.data[0].strDescripcion}</p>
                    <table border=2>
                    <thead>
                    <tr>
                            <th colspan="12" style="text-align: center; font-size: 9px"> INFORMACIÓN CICLO 1. </th>
                        </tr>
                        <tr>
                        <th style="font-size: 9px;text-align: center;">N°</th>
                        <th style="font-size: 9px;text-align: center;">DESCRIPCION</th>
                        <th  style="font-size: 9px;text-align: center;">RANGO</th>
                        <th  style="font-size: 9px;text-align: center;">CANTIDAD</th>
                        <th style="font-size: 9px;text-align: center;">PORCENTAJE</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bodylistado}
                        </tbody>
                    </table>
                    <br/><br/>
                    <div style="font-size: 11px; text-align: center">
                    <img src="data:image/png;base64,${chartBuffer.toString('base64')}" style="width: 300px;"/> <br/><br/><br/>
                </div>
              
                    <p style="text-align: center;"> <strong>----------------------------------------</strong></p>
                    <p style="text-align: center;font-size: 9px;"> ${nombres}</p>
                    </body>
                    </html>
                    `;
    const options = {
        format: 'A4',
        timeout: 60000,
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
    var htmlCompleto = tools.headerOcultoHtml() + htmlContent + tools.footerOcultoHtml();
    var base64 = await FunciongenerarPDF(htmlCompleto, options)
    return base64
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
        bodylistado += `<tr >
            <td style="font-size: 9px; text-align: center"> ${contadot} </td>
            <td style="font-size: 9px; text-align: center"> ${estudiantes.Descripcion} </td>
            <td style="font-size: 9px; text-align: center"> ${estudiantes.Rango} </td>
            <td style="font-size: 9px; text-align: center"> ${estudiantes.value} </td>
            <td style="font-size: 9px; text-align: center"> ${estudiantes.ValorPorcentaje} % </td>
            </tr>`
                }

                const htmlContent = `
                <!DOCTYPE html>
                <html lang="es">
                <head>
            <style> table { border-collapse: collapse; width: 100%; } th, td { padding: 5px; text-align: left; } th { background-color: #f2f2f2; } .nombre { margin-top: 7em; text-align: center; width: 100%; } hr{ width: 60%; } </style>
                </head>
                <body>
                <p style='text-align: center;font-size: 11px'> <strong>ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO</strong>  </p><p style='text-align: center;font-size: 10px'> <strong>FACULTAD: ${datosCarrera.data[0].strNombreFacultad}</strong> </p><p style='text-align: center;font-size: 10px'><strong>CARRERA: ${datosCarrera.data[0].strNombreCarrera}</strong> </p>
            <p style='font-size: 9px'> <strong>PAO :</strong> ${nivel}</p>
            <p style='font-size: 9px'> <strong>PARALELO :</strong> ${paralelo}</p>
            <p style='font-size: 9px'> <strong>ASIGNARURA :</strong> ${asignatura}</p>
            <p style='font-size: 9px'> <strong>PROFESOR :</strong>${nombres} </p>
            <p style='font-size: 9px'> <strong>PERIODO :</strong> ${periodo.data[0].strDescripcion}</p>
        
                <table border=2>
                <thead>
                <tr>
                        <th colspan="12" style="text-align: center; font-size: 9px"> INFORMACIÓN CICLO 2. </th>
                    </tr>
                    <tr>
                    <th style="font-size: 9px;text-align: center;">N°</th>
                    <th style="font-size: 9px;text-align: center;">DESCRIPCION</th>
                    <th  style="font-size: 9px;text-align: center;">RANGO</th>
                    <th  style="font-size: 9px;text-align: center;">CANTIDAD</th>
                    <th style="font-size: 9px;text-align: center;">PORCENTAJE</th>
                    </tr>
                </thead>
                <tbody>
                    ${bodylistado}
                    </tbody>
                </table>
                <br/><br/>
                <div style="font-size: 9px; text-align: center">
                <img src="data:image/png;base64,${chartBuffer.toString('base64')}" style="width: 300px;"/> <br/><br/><br/>
            </div>
            <br/>
                <p style="text-align: center;"> <strong>----------------------------------------</strong></p>
                <p style="text-align: center;font-size: 9px;"> ${nombres}</p>
                </body>
                </html>
                `;
    const options = {
        format: 'A4',
        timeout: 60000,
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
    var htmlCompleto = tools.headerOcultoHtml() + htmlContent + tools.footerOcultoHtml();
    var base64 = await FunciongenerarPDF(htmlCompleto, options)
    return base64
}
async function generatePDFR(listado, carrera, nombres, asignatura, nivel, paralelo, periodo) {
    const chartBuffer = await generatePieChart(listado);
    var datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    var periodo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);
    var bodylistado = "";
    var contadot = 0;
    for (let estudiantes of listado) {
        contadot = contadot + 1;
        bodylistado += `<tr >
        <td style="font-size: 10px; text-align: center"> ${contadot} </td>
        <td style="font-size: 11px; text-align: center"> ${estudiantes.Descripcion} </td>
        <td style="font-size: 11px; text-align: center"> ${estudiantes.Rango} </td>
        <td style="font-size: 11px; text-align: center"> ${estudiantes.value} </td>
        <td style="font-size: 11px; text-align: center"> ${estudiantes.ValorPorcentaje} % </td>
        </tr>`
    }

    const htmlContent = `
                <!DOCTYPE html>
                <html lang="es">
                <head>
            <style> table { border-collapse: collapse; width: 100%; } th, td { padding: 5px; text-align: left; } th { background-color: #f2f2f2; } .nombre { margin-top: 7em; text-align: center; width: 100%; } hr{ width: 60%; } </style>
                </head>
                <body>
                <p style='text-align: center;font-size: 11px'> <strong>ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO</strong>  </p><p style='text-align: center;font-size: 10px'> <strong>FACULTAD: ${datosCarrera.data[0].strNombreFacultad}</strong> </p><p style='text-align: center;font-size: 10px'><strong>CARRERA: ${datosCarrera.data[0].strNombreCarrera}</strong> </p>
            <p style='font-size: 9px'> <strong>PAO :</strong> ${nivel}</p>
            <p style='font-size: 9px'> <strong>PARALELO :</strong> ${paralelo}</p>
            <p style='font-size: 9px'> <strong>ASIGNARURA :</strong> ${asignatura}</p>
            <p style='font-size: 9px'> <strong>PROFESOR :</strong>${nombres} </p>
            <p style='font-size: 9px'> <strong>PERIODO :</strong> ${periodo.data[0].strDescripcion}</p>
            <p>CICLO 2 </p>
                <table border=2>
                <thead>
                <tr>
                        <th colspan="12" style="text-align: center; font-size: 9px"> INFORMACIÓN RECUPERACIÓN. </th>
                    </tr>
                    <tr>
                    <th style="font-size: 9px;text-align: center;">N°</th>
                    <th style="font-size: 9px;text-align: center;">DESCRIPCION</th>
                    <th  style="font-size: 9px;text-align: center;">RANGO</th>
                    <th  style="font-size: 9px;text-align: center;">CANTIDAD</th>
                    <th style="font-size: 9px;text-align: center;">PORCENTAJE</th>
                    </tr>
                </thead>
                <tbody>
         ${bodylistado}
                    </tbody>
                </table>
                <br/><br/>
                <div style="font-size: 9px; text-align: center">
                <img src="data:image/png;base64,${chartBuffer.toString('base64')}" style="width: 300px;"/> <br/><br/><br/>
            </div>
            <br/>
                <p style="text-align: center;"> <strong>----------------------------------------</strong></p>
                <p style="text-align: center;font-size: 9px;"> ${nombres}</p>
                </body>
                </html>
                `;
    const options = {
        format: 'A4',
        timeout: 60000,
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
    var htmlCompleto = tools.headerOcultoHtml() + htmlContent + tools.footerOcultoHtml();
    var base64 = await FunciongenerarPDF(htmlCompleto, options)
    return base64
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
    <th  style="text-align: center; font-size: 10px"> # </th>
    <th  style="text-align: center; font-size: 10px"> CÓDIGO</th>
    <th  style="text-align: center; font-size: 10px">ESTUDIANTES </th>
    <th  style="text-align: center; font-size: 10px">CÉDULA </th>
    ${cabeceralistado}
    </tr>`
    cabecera = "<thead>" + cabecera + "</thead>"        
    for (let estudiantes of listado) {
        periodolistado="";
        contadot = contadot + 1;
        for (let perrio of estudiantes.Periodos) {
            periodolistado += `<td style="font-size: 9px; text-align: center"> <strong>MATRICULA:</strong> ${perrio.matricula == true ? 'SI' : 'NO'} </br><strong>PERIODO:</strong> ${perrio.periodo} </br><strong>PAO:</strong> ${perrio.Nivel} </br> </td>`
        }
        bodylistado += `<tr >
        <td style="font-size: 9px; text-align: center;color:black"> ${contadot} </td>
        <td style="font-size: 9px; text-align: center;color:black"> ${estudiantes.strCodigo} </td>
        <td style="font-size: 9px; text-align: center;color:black"> ${estudiantes.strApellidos}  ${estudiantes.strNombres}</td>
        <td style="font-size: 9px; text-align: center;color:black"> ${estudiantes.strCedula} </td>
        ${periodolistado}
        </tr>`
    }

const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
   
 <style> table { border-collapse: collapse; width: 100%; } th, td { padding: 6px; text-align: left; } th { background-color: #f2f2f2; } .nombre { margin-top: 7em; text-align: center; width: 100%; } hr{ width: 60%; } </style>
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

