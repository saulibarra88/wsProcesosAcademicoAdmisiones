const { createBaseLayout } = require('./pdf-layout.js');
const axios = require('axios');
const procesoCupo = require('../modelo/procesocupos');     
const funcionesgenerales = require('../rutas/tools.js');     
const https = require('https');
const crypto = require("crypto");

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

module.exports.pdfmakeProcesoPdfListadosAspiranteAdmisiones = async function (listado, strBaseCarrera, cedula) {
    try {
        var datosCarrera = await procesoCupo.ObtenerDatosBase(strBaseCarrera);
        var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
        var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido;
        
        const tableBody = listado.map((estudiantes, index) => {
            const contadot = index + 1;
            return [
                { text: contadot.toString(), style: 'tableCellCenter' },
                { 
                    stack: [
                        { text: [{ text: 'CÉDULA: ', bold: true }, estudiantes.perId.perCedula] },
                        { text: [{ text: 'CELULAR: ', bold: true }, estudiantes.perId.perCelular || ''] },
                        { text: [{ text: 'CORREO: ', bold: true }, estudiantes.perId.perEmailAlternativo || ''] }
                    ], style: 'tableCellLeft' 
                },
                { 
                    stack: [
                        { text: [{ text: 'ASPIRANTE: ', bold: true }, `${estudiantes.perId.perApellidos} ${estudiantes.perId.perNombres}`] },
                        { text: [{ text: 'EXAMEN: ', bold: true }, estudiantes.aspRendirExamen == false ? 'NO RENDIR EXAMEN' : 'RENDIR EXAMEN'] }
                    ], style: 'tableCellLeft'
                },
                { 
                    stack: [
                        { text: [{ text: 'ADMISIONES: ', bold: true }, estudiantes.Periodo.perNombre] },
                        { text: [{ text: 'ACADEMICO: ', bold: true }, estudiantes.PeriodoAcademico.strDescripcion] }
                    ], style: 'tableCellLeft'
                },
                { 
                    stack: [
                        { text: [{ text: 'SEDE : ', bold: true }, estudiantes.Sede.sedNombre] },
                        { text: [{ text: 'DETALLE : ', bold: true }, estudiantes.Sede.sedDescripcion] },
                        { text: [{ text: 'AREA : ', bold: true }, estudiantes.camCodigo] },
                        { text: [{ text: 'AREA CONOCIMIENTO : ', bold: true }, estudiantes.camNombre.toUpperCase()] },
                    ], style: 'tableCellLeft'
                },
                { 
                    stack: [
                        { text: [{ text: 'INSCRIPCIÓN : ', bold: true }, estudiantes.aspFechaInscripcion.substring(0, 10) || ''] }
                    ], style: 'tableCellLeft'
                }
            ];
        });

        const tableColumns = [
            { text: 'N°', style: 'tableHeader' },
            { text: 'DATOS', style: 'tableHeader' },
            { text: 'APELLIDOS Y NOMBRES', style: 'tableHeader' },
            { text: 'PERIODO', style: 'tableHeader' },
            { text: 'SEDE_INSTITUCION', style: 'tableHeader' },
            { text: 'FECHA_REG', style: 'tableHeader' }
        ];

        const tableWidths = ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'];

        const content = [
            {
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => '#000000',
                    vLineColor: () => '#000000',
                    paddingLeft: () => 4,
                    paddingRight: () => 4,
                    paddingTop: () => 4,
                    paddingBottom: () => 4
                },
                table: {
                    headerRows: 2,
                    widths: tableWidths,
                    body: [
                        [ { text: 'INFORMACIÓN.', colSpan: 6, style: 'tableHeaderCenter' }, {}, {}, {}, {}, {} ],
                        tableColumns,
                        ...tableBody
                    ]
                }
            },
            {
                margin: [0, 40, 0, 0],
                alignment: 'center',
                stack: [
                    { text: '----------------------------------------', style: 'signatureLine' },
                    { text: 'GENERADO POR:', style: 'signatureLabel' },
                    { text: strNombres, style: 'signatureName' }
                ]
            }
        ];

        const layoutOptions = {
            title: 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO',
            subtitle: `FACULTAD: ${datosCarrera.data[0].strNombreFacultad}\nCARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
            pageMargins: [40, 120, 40, 70],
            pageOrientation: 'landscape'
        };

        const baseLayout = createBaseLayout(layoutOptions);
        
        const docDefinition = {
            ...baseLayout,
            content: content,
            styles: {
                ...baseLayout.styles,
                tableHeader: { bold: true, fontSize: 8, alignment: 'center', fillColor: '#eeeeee' },
                tableHeaderCenter: { bold: true, fontSize: 8, alignment: 'center', fillColor: '#eeeeee' },
                tableCellCenter: { fontSize: 7, alignment: 'center' },
                tableCellLeft: { fontSize: 7, alignment: 'left' },
                signatureLine: { fontSize: 10, margin: [0, 0, 0, 5] },
                signatureLabel: { fontSize: 9, margin: [0, 5, 0, 2] },
                signatureName: { fontSize: 9, bold: true, margin: [0, 2, 0, 0] }
            }
        };

        const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
        return base64PDF;

    } catch (error) {
        console.error(error);
        return 'ERROR';
    }
}

module.exports.pdfmakeProcesoPdfListadosEstudiantesAdmisiones = async function (listado, strBaseCarrera, cedula) {
    try {
        var datosCarrera = await procesoCupo.ObtenerDatosBase(strBaseCarrera);
        var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
        var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido;
        
        const tableBody = listado.map((estudiantes, index) => {
            const contadot = index + 1;
            return [
                { text: contadot.toString(), style: 'tableCellCenter' },
                { 
                    stack: [
                        { text: [{ text: 'CÉDULA: ', bold: true }, estudiantes.AspirantePostulacion.Persona.perCedula] },
                        { text: [{ text: 'CELULAR: ', bold: true }, estudiantes.AspirantePostulacion.Persona.perCelular || ''] },
                        { text: [{ text: 'CORREO: ', bold: true }, estudiantes.AspirantePostulacion.Persona.perEmailAlternativo || ''] }
                    ], style: 'tableCellLeft' 
                },
                { 
                    text: `${estudiantes.AspirantePostulacion.Persona.perApellidos} ${estudiantes.AspirantePostulacion.Persona.perNombres}`, style: 'tableCellLeft'
                },
                { 
                    stack: [
                        { text: [
                            { text: 'MATRICULA: ', bold: true }, 
                            { text: estudiantes.habilitarMatricula == true ? 'HABILITADA' : 'NO HABILITADA', color: estudiantes.habilitarMatricula == true ? 'green' : 'orange' }
                        ] },
                        { text: [{ text: 'FECHA: ', bold: true }, estudiantes.minsFecha == '' ? 'NO REGISTRO' : estudiantes.minsFecha] },
                        { text: [{ text: 'INGRESA A : ', bold: true }, estudiantes.minsCarrera == false ? 'NIVELACIÓN' : 'CARRERA'] }
                    ], style: 'tableCellLeft'
                },
                { 
                    stack: [
                        { text: `${estudiantes.AspirantePostulacion.Fase.croNombre} POSTULACIÓN` },
                        { text: [{ text: 'NOTA: ', bold: true }, estudiantes.acuNota || ''] }
                    ], style: 'tableCellLeft'
                },
                { 
                    stack: [
                        { text: [{ text: 'CARRERA : ', bold: true }, estudiantes.AspirantePostulacion.Carrera.carNombre] },
                        { text: [{ text: 'SEDE : ', bold: true }, estudiantes.AspirantePostulacion.Carrera.Sede.sedNombre] }
                    ], style: 'tableCellLeft'
                },
                { 
                    stack: [
                        { text: estudiantes.Estado.estDescripcion, bold: true, color: estudiantes.Estado.estDescripcion == 'ACEPTADO' ? 'green' : 'orange' },
                        { text: [{ text: 'CONFIRMACIÓN : ', bold: true }, estudiantes.acuFechaConfirmacion || ''] }
                    ], style: 'tableCellLeft'
                }
            ];
        });

        const tableColumns = [
            { text: 'N°', style: 'tableHeader' },
            { text: 'DATOS', style: 'tableHeader' },
            { text: 'APELLIDOS Y NOMBRES', style: 'tableHeader' },
            { text: 'HABILITAR MAT. ADMISIONES', style: 'tableHeader' },
            { text: 'FASE', style: 'tableHeader' },
            { text: 'CARRERA', style: 'tableHeader' },
            { text: 'ASIGNACIÓN CUPO', style: 'tableHeader' }
        ];

        const tableWidths = ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'];

        const content = [
            {
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => '#000000',
                    vLineColor: () => '#000000',
                    paddingLeft: () => 4,
                    paddingRight: () => 4,
                    paddingTop: () => 4,
                    paddingBottom: () => 4
                },
                table: {
                    headerRows: 2,
                    widths: tableWidths,
                    body: [
                        [ { text: 'INFORMACIÓN.', colSpan: 7, style: 'tableHeaderCenter' }, {}, {}, {}, {}, {}, {} ],
                        tableColumns,
                        ...tableBody
                    ]
                }
            },
            {
                margin: [0, 40, 0, 0],
                alignment: 'center',
                stack: [
                    { text: '----------------------------------------', style: 'signatureLine' },
                    { text: 'GENERADO POR:', style: 'signatureLabel' },
                    { text: strNombres, style: 'signatureName' }
                ]
            }
        ];

        const layoutOptions = {
            title: 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO',
            subtitle: `FACULTAD: ${datosCarrera.data[0].strNombreFacultad}\nCARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
            pageMargins: [40, 120, 40, 70],
            pageOrientation: 'landscape'
        };

        const baseLayout = createBaseLayout(layoutOptions);
        
        const docDefinition = {
            ...baseLayout,
            content: content,
            styles: {
                ...baseLayout.styles,
                tableHeader: { bold: true, fontSize: 8, alignment: 'center', fillColor: '#eeeeee' },
                tableHeaderCenter: { bold: true, fontSize: 8, alignment: 'center', fillColor: '#eeeeee' },
                tableCellCenter: { fontSize: 7, alignment: 'center' },
                tableCellLeft: { fontSize: 7, alignment: 'left' },
                signatureLine: { fontSize: 10, margin: [0, 0, 0, 5] },
                signatureLabel: { fontSize: 9, margin: [0, 5, 0, 2] },
                signatureName: { fontSize: 9, bold: true, margin: [0, 2, 0, 0] }
            }
        };

        const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
        return base64PDF;

    } catch (error) {
        console.error(error);
        return 'ERROR';
    }
}
