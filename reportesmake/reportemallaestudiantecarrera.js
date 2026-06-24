// reporteNotas.js (CommonJS)
const PdfPrinter = require('pdfmake');
const { createBaseLayout } = require('./pdf-layout.js');
const axios = require('axios');
const procesoCupo = require('../modelo/procesocupos');
const funcionesgenerales = require('../rutas/tools.js');
const https = require('https');
const crypto = require("crypto");
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { Console } = require('winston/lib/winston/transports/index.js');
// Configuración del agente HTTPS
const agent = new https.Agent({
    rejectUnauthorized: false,
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,

});
const defaultFonts = {
    Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
    },
};
module.exports.PdfCurriculumEstuidantilCarrera = async function (cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas, codigo) {
    try {
        var resultado = await ProcesoPdfCurriculumEstudiantilCarrera(cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas, codigo);
        return resultado;
    } catch (error) {
        console.error(error);
        
        throw error;
    }
}

const Utils = {
    getValor: (valor, defaultValue = 'SIN REGISTRO') => {
        return valor !== null && valor !== undefined && valor !== '' ? valor : defaultValue;
    },

    formatearNombreCompleto: (persona) => {
        if (!persona?.listado?.[0]) return 'SIN REGISTRO';
        const { per_nombres, per_primerApellido, per_segundoApellido } = persona.listado[0];
        const nombres = [per_nombres, per_primerApellido, per_segundoApellido]
            .filter(Boolean)
            .join(' ');
        return nombres.trim() || 'SIN REGISTRO';
    },
};

async function ProcesoPdfCurriculumEstudiantilCarrera(cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas, codigo) {

    try {
        // 1. Extraer información básica
        const strNombres = Utils.formatearNombreCompleto(persona);
        const strCarrera = carrera?.nombreCarrera || carrera?.strNombreCarrera || 'SIN CARRERA';

        // 2. Las materias ya vienen agrupadas por nivel
        const materiasPorNivel = listado;

        // 3. Generar contenido del PDF
        const content = await generarContenidoPDFDatosEstudiante({
            materiasPorNivel,
            listadoBecas,
            objTitulacion,
            carrera,
            cedula,
            strNombres,
            foto,
            persona
        });
        // 4. Configurar y generar PDF
        const layoutOptions = {
            title: 'HISTORIAL ACADÉMICO DEL ESTUDIANTE',
            subtitle: `DATOS ACADÉMICOS CARRERA`,
            pageMargins: [20, 120, 20, 70],
          pageOrientation: 'portrait'
        };

        const baseLayout = createBaseLayout(layoutOptions);
        content.push(crearFirmaPDF(strNombres));
        const docDefinition = {
            ...baseLayout,
            content,
            styles: { ...baseLayout.styles, ...obtenerEstilosPDF() }
        };
        return await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
    } catch (error) {
        console.error(error);
        
        throw error;
    }
}


function crearInfoEstudiante(fotoBase64, persona, cedula, carrera) {
    const nombresCompletos = persona ?
        `${persona.per_nombres || ''} ${persona.per_primerApellido || ''} ${persona.per_segundoApellido || ''}`.trim() :
        'SIN REGISTRO';
    return {
        alignment: 'center',
        margin: [0, 0, 0, 15],
        columns: [
            {
                width: 100,
                image: fotoBase64,
                width: 60,
                height: 80,
                alignment: 'left'
            },
            {
                width: '*',
                alignment: 'left',
                margin: [20, 5, 0, 0],
                stack: [

                    {
                        text: [
                            { text: 'FACULTAD: ', bold: true, fontSize: 9 },
                            { text: carrera?.strNombreFacultad || 'SIN REGISTRO', fontSize: 9 }
                        ],
                        margin: [0, 0, 0, 5]
                    },
                   
                    {
                        text: [
                            { text: 'CEDULA: ', bold: true, fontSize: 9 },
                            { text: cedula || 'SIN REGISTRO', fontSize: 9 }
                        ],
                        margin: [0, 0, 0, 5]
                    },

                    {
                        text: [
                            { text: 'CORREO INSTITUCIONAL: ', bold: true, fontSize: 9 },
                            { text: persona?.per_email || 'SIN REGISTRO', fontSize: 9 }
                        ],
                        margin: [0, 0, 0, 5]
                    },
                ]
            },
             {
                width: '*',
                alignment: 'left',
                margin: [10, 5, 0, 0],
                stack: [
                    {
                        text: [
                            { text: 'CARRERA: ', bold: true, fontSize: 9 },
                            { text: carrera?.strNombreCarrera || 'SIN REGISTRO', fontSize: 9 }
                        ],
                        margin: [0, 0, 0, 5]
                    },

                    {
                        text: [
                            { text: 'NOMBRES: ', bold: true, fontSize: 9 },
                            { text: nombresCompletos || 'SIN REGISTRO', fontSize: 9 }
                        ],
                        margin: [0, 0, 0, 5]
                    },
                    {
                        text: [
                            { text: 'CORREO PERSONAL: ', bold: true, fontSize: 9 },
                            { text: persona?.per_emailAlternativo || 'SIN REGISTRO', fontSize: 9, fillColor: '#eeeeee' }
                        ],
                        margin: [0, 0, 0, 0]
                    },
                ]
            }
        ]
    };
}


async function generarContenidoPDFDatosEstudiante({ materiasPorNivel, listadoBecas, objTitulacion, carrera, cedula, strNombres, foto, persona }) {
    const content = [];
    content.push(crearInfoEstudiante(foto, persona, cedula, carrera));
    for (const nivel of materiasPorNivel) {
   

        // Título del nivel con información de progreso
        const porcentajeAprobacion = (nivel.asignaturasAprobadas / nivel.totalAsignaturas) * 100;
        const estadoColor = porcentajeAprobacion >= 70 ? '#28a745' : porcentajeAprobacion >= 40 ? '#ffc107' : '#dc3545';
        
        content.push({
            text: `NIVEL: ${nivel.codNivel} - Progreso: ${nivel.asignaturasAprobadas}/${nivel.totalAsignaturas} (${porcentajeAprobacion.toFixed(1)}%)`,
            style: 'nivelTitle',
            fontSize: 11,
            margin: [0, 0, 0, 8],
            bold: true,
            color: estadoColor
        });

        // Generar tabla para este nivel
        const tablaNivel = await generarTablaMallasPorNivel(nivel);
        content.push(tablaNivel);
    }

    // Sección de Becas
    content.push({
        text: 'BECAS ESTUDIANTIL',
        style: 'sectionTitle',
        margin: [0, 25, 0, 10],
        fontSize: 12,
        bold: true,
        color: '#0066cc'
    });

    if (listadoBecas && listadoBecas.length > 0) {
        const tablaBecas = await generarTablaBecas(listadoBecas);
        content.push(tablaBecas);
    } else {
        content.push({
            text: 'El estudiante no registra información en becas',
            style: 'tableCellLeft',
            margin: [0, 5, 0, 15],
            italics: true,
            color: '#999'
        });
    }

    // Sección de Proyecto de Titulación
    content.push({
        text: 'PROYECTO TITULACIÓN',
        style: 'sectionTitle',
        margin: [0, 25, 0, 10],
        fontSize: 12,
        bold: true,
        color: '#0066cc'
    });

    const contenidoTitulacion = await generarContenidoTitulacion(objTitulacion);
    content.push(contenidoTitulacion);

    return content;
}

async function generarTablaMallasPorNivel(nivelAgrupado) {
    const { Nivel: nombreNivel, codNivel, asignaturas, totalAsignaturas, asignaturasAprobadas } = nivelAgrupado;
    
    const tableColumns = [
        { text: '#', style: 'tableHeader' },
        { text: 'TIPO', style: 'tableHeader' },
        { text: 'HOMOL.', style: 'tableHeader',alignment: 'center' },
        { text: 'ASIGNATURAS HOMO', style: 'tableHeader',alignment: 'center' },
        { text: 'CÓD. ANTERIOR', style: 'tableHeader',alignment: 'center' },
        { text: 'ASIGNATURAS ANTERIOR', style: 'tableHeader',alignment: 'center' },
        { text: 'NIVEL', style: 'tableHeader' },
        { text: 'TIPO', style: 'tableHeader' },
        { text: 'ESTADO', style: 'tableHeader' },
        { text: 'APRUEBA', style: 'tableHeader' }
    ];

    const tableWidths = ['auto', 'auto','auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto','auto'];

    const tableBody = asignaturas.map((asignatura, index) => {
        const contador = index + 1;
        const estadoOriginal = asignatura.estadoasignatura || 'SIN ESTADO';
        const esAprobada = estadoOriginal.toUpperCase() === 'APROBADA';

        const tipoMateria = asignatura.Tipo === 1 ? 'SIN HOMOLOGAR' : 
                           asignatura.Tipo === 2 ? 'HOMOLOGADA' : 
                           asignatura.nombretipo || asignatura.tipoMateria || '-';

        return [
            { text: contador.toString(), style: 'tableCellCenter' },
            { text: Utils.getValor(asignatura.tipoasignatura || asignatura.tipoasignatura, '-'), style: 'tableCellCenter' },
            { text: Utils.getValor(asignatura.CodigoMateriaActual || asignatura.codigoHomologacion, '-'), style: 'tableCellCenter' },
            { text: Utils.getValor(asignatura.NombreMateriaActual || asignatura.NombreMateria || asignatura.nombreMateria, '-'), style: 'tableCellLeft' },
            { text: Utils.getValor(asignatura.CodigoMateriaAnterior || asignatura.CodigoMateria || asignatura.codigoMateria, '-'), style: 'tableCellLeft' },
            { text: Utils.getValor(asignatura.NombreMateriaAnterior || asignatura.NombreMateria || asignatura.nombreMateria, '-'), style: 'tableCellLeft' },
            { text: `${codNivel}`, style: 'tableCellCenter' },
            { text: tipoMateria, style: 'tableCellCenter' },
            {
                text: estadoOriginal,
                style: 'tableCellCenter',
                color: esAprobada ? '#28a745' : '#dc3545',
                bold: esAprobada
            },
             { text: Utils.getValor(asignatura.periodoacodigoprobacion || asignatura.periodoacodigoprobacion, '-'), style: 'tableCellCenter' },
        ];
    });

    // CORREGIDO: Fila de resumen del nivel con 8 columnas
    const porcentajeAprobacion = totalAsignaturas > 0 
        ? (asignaturasAprobadas / totalAsignaturas) * 100 
        : 0;
    
    const resumenNivel = [
        { text: '', colSpan: 2, style: 'tableCellRight', border: [false, false, false, false] }, // Columna 1-2
        {}, // Placeholder para colSpan
        { text: '', style: 'tableCellRight' }, // Columna 3
            { text: '' }, // Columna 8
        { text: '' }, // Columna 9,
        { text: '' }, // Columna 10,
        { text: 'RESUMEN:', style: 'tableCellRight', bold: true, alignment: 'right' }, // Columna 4
        { text: `Aprobadas: ${asignaturasAprobadas}/${totalAsignaturas}`, style: 'tableCellCenter', bold: true, color: '#0066cc' }, // Columna 5
        { text: `${porcentajeAprobacion.toFixed(1)}%`, style: 'tableCellCenter', bold: true, color: porcentajeAprobacion >= 70 ? '#28a745' : '#ffc107' }, // Columna 6
        { text: '', style: 'tableCellCenter' }, // Columna 7
    
    ];

    return {
        layout: 'lightHorizontalLines',
        table: {
            headerRows: 1,
            widths: tableWidths,
            body: [tableColumns, ...tableBody, resumenNivel]
        },
        margin: [0, 0, 0, 10]
    };
}
async function generarTablaBecas(listadoBecas) {
    const tableColumns = [
        { text: '#', style: 'tableHeader' },
        { text: 'FACULTAD', style: 'tableHeader' },
        { text: 'CARRERA', style: 'tableHeader' },
        { text: 'BECA', style: 'tableHeader' },
        { text: 'PERÍODO', style: 'tableHeader' },
        { text: 'ESTADO', style: 'tableHeader' }
    ];

    const tableWidths = ['auto', '*', '*', 'auto', 'auto', 'auto'];

    const tableBody = listadoBecas.map((beca, index) => {
        const contador = index + 1;
        const estadoBeca = (beca.detEstado || beca.estado || '').toUpperCase();
        const esActivo = estadoBeca === 'ACTIVO';

        return [
            { text: contador.toString(), style: 'tableCellCenter' },
            { text: Utils.getValor(beca.nombFacultad || beca.facultad), style: 'tableCellLeft' },
            { text: Utils.getValor(beca.nombCarrera || beca.carrera), style: 'tableCellLeft' },
            { text: Utils.getValor(beca.strNombre || beca.nombreBeca), style: 'tableCellCenter' },
            { text: Utils.getValor(beca.periodoDetalle || beca.periodo), style: 'tableCellCenter' },
            {
                text: estadoBeca || 'SIN ESTADO',
                style: 'tableCellCenter',
                color: esActivo ? '#28a745' : '#6c757d'
            }
        ];
    });

    return {
        layout: 'lightHorizontalLines',
        table: {
            headerRows: 1,
            widths: tableWidths,
            body: [tableColumns, ...tableBody]
        },
        margin: [0, 5, 0, 5]
    };
}

async function generarContenidoTitulacion(objTitulacion) {
    const content = [];

    if (!objTitulacion) {
        content.push({
            text: 'No hay información de titulación disponible',
            style: 'tableCellLeft',
            margin: [0, 5, 0, 10],
            italics: true,
            color: '#999'
        });
        return content;
    }

    if (objTitulacion.proceso === true || objTitulacion.proceso === 1) {
        // Formato con tabla para datos de titulación activa
        const tableBody = [
            [
                { text: 'PROYECTO:', style: 'tableHeader', fillColor: '#f0f0f0', alignment: 'left' },
                { text: objTitulacion.nombreproyecto || objTitulacion.proyecto || 'SIN PROYECTO', style: 'tableCellLeft' }
            ],
            [
                { text: 'TIPO PROYECTO:', style: 'tableHeader', fillColor: '#f0f0f0', alignment: 'left' },
                { text: (objTitulacion.formagrado || objTitulacion.tipo || '').toUpperCase() || 'SIN TIPO', style: 'tableCellLeft' }
            ],
            [
                { text: 'RESOLUCIÓN:', style: 'tableHeader', fillColor: '#f0f0f0', alignment: 'left' },
                { text: objTitulacion.resolucion || 'SIN RESOLUCIÓN', style: 'tableCellLeft' }
            ],
            [
                { text: 'ESTADO:', style: 'tableHeader', fillColor: '#f0f0f0', alignment: 'left' },
                { text: objTitulacion.estado || 'EN PROCESO', style: 'tableCellLeft' }
            ]
        ];

        content.push({
            layout: 'noBorders',
            table: {
                widths: ['30%', '*'],
                body: tableBody
            },
            margin: [0, 0, 0, 5]
        });
    } else {
        // Formato cuando no hay proceso de titulación activo
        const mensaje = objTitulacion.mensaje || 'El estudiante no tiene proceso de titulación activo';
        content.push({
            stack: [
                { text: `INFORMACIÓN: ${mensaje}`, style: 'tableCellLeft', margin: [0, 5, 0, 5] },
                { text: 'ESTADO: NINGUNO', style: 'tableCellLeft', margin: [0, 0, 0, 5] }
            ]
        });
    }

    return content;
}

function crearFirmaPDF(nombreCompleto) {
    return {
        margin: [0, 40, 0, 0],
        alignment: 'center',
        stack: [
            { text: '_________________________________________', style: 'signatureLine' },
            { text: 'FIRMA DE AUTORZACIÓN', style: 'signatureName', margin: [0, 5, 0, 0] },
            { text: 'ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO', style: 'signatureLabel', margin: [0, 2, 0, 0] }
        ]
    };
}

function obtenerEstilosPDF() {
    return {
        nivelTitle: {
            fontSize: 11,
            bold: true,
            alignment: 'left',
            margin: [0, 15, 0, 5],
            fillColor: '#f0f0f0'
        },
        tableHeader: {
            bold: true,
            fontSize: 8,
            alignment: 'center',
            fillColor: '#eeeeee'
        },
        tableCellCenter: {
            fontSize: 7,
            alignment: 'center'
        },
        tableCellLeft: {
            fontSize: 7,
            alignment: 'left'
        },
        subtituloLeft: {
            fontSize: 11,
            alignment: 'left'
        },
        signatureLine: {
            fontSize: 10,
            margin: [0, 0, 0, 5]
        },
        signatureLabel: {
            fontSize: 9,
            margin: [0, 5, 0, 2]
        },
        signatureName: {
            fontSize: 9,
            bold: true,
            margin: [0, 2, 0, 0]
        }
    };
}