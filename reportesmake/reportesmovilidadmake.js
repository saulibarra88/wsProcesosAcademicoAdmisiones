const PdfPrinter = require('pdfmake');
const { createBaseLayout } = require('./pdf-layout.js');
const axios = require('axios');
const procesoCupo = require('../modelo/procesocupos');     
const funcionesgenerales = require('../rutas/tools.js');     
const funcionesmodelomovilidad = require('../modelo/modelomovilidad');
const tools = require('../rutas/tools.js');
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

module.exports.pdfmakeProcesoPdfListadoEstudiantesSolicitudes = async function (listado, periodo) {
  try {
    const periodoinfo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);
    
    let inttotal = 0;
    const content = [];
    
    content.push({
      margin: [0, 0, 0, 10],
      alignment: 'center',
      stack: [
        { text: 'DECANATO ACADÉMICO INSTITUCIONAL', style: 'subtitleCenter' },
        { text: 'NÓMINA DE ESTUDIANTES CON MOVILIDAD', style: 'subtitleCenter' },
        { text: `PERÍODO: ${periodoinfo.data[0].strDescripcion}`, style: 'subtitleCenter' }
      ]
    });
    
    listado.forEach(carrera => {
      content.push({
        text: `CARRERA : ${carrera.cm_nombrecarrera_movilidad}  (MOVILIDADES # ${carrera.ListaEstuidantes.length})`,
        style: 'carreraHeader',
        margin: [0, 10, 0, 5]
      });
      
      const tableBody = [];
      tableBody.push([
        { text: 'No', style: 'tableHeader' },
        { text: 'CEDULA', style: 'tableHeader' },
        { text: 'NOMBRES ESTUDIANTES', style: 'tableHeader' },
        { text: 'PUNTAJE', style: 'tableHeader' },
        { text: 'CARRERA ACTUAL', style: 'tableHeader' },
        { text: 'CARRERA MOVILIDAD', style: 'tableHeader' },
        { text: 'TIPO', style: 'tableHeader' }
      ]);
      
      let contadot = 0;
      carrera.ListaEstuidantes.forEach(estudiante => {
        contadot++;
        inttotal++;
        tableBody.push([
          { text: contadot.toString(), style: 'tableCellCenter' },
          { text: estudiante.cm_identificacion || '', style: 'tableCellLeft' },
          { text: `${estudiante.nombreestudiante} ${estudiante.apellidoestudiante}`, style: 'tableCellLeft' },
          { text: estudiante.cm_puntaje?.toString() || '', style: 'tableCellCenter' },
          { text: estudiante.cm_nombrecarrera_actual || '', style: 'tableCellLeft' },
          { text: estudiante.cm_nombrecarrera_movilidad || '', style: 'tableCellLeft' },
          { text: estudiante.mts_strdescripcion || '', style: 'tableCellLeft' }
        ]);
      });
      
      content.push({
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
          headerRows: 1,
          widths: ['auto', 'auto', '*', 'auto', '*', '*', 'auto'],
          body: tableBody
        }
      });
    });
    
    content.push({
      text: `TOTAL DE MOVILIDADES # : ${inttotal}`,
      style: 'carreraHeader',
      margin: [0, 10, 0, 0]
    });
    
    content.push({
      margin: [0, 40, 0, 0],
      alignment: 'center',
      stack: [
        { text: '----------------------------------------', style: 'signatureLine' },
        { text: 'GENERADO POR:', style: 'signatureLabel' },
        { text: 'DECANATO ACADÉMICO', style: 'signatureName' }
      ]
    });
    
    const layoutOptions = {
      title: 'ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO',
      subtitle: '',
      pageMargins: [40, 60, 40, 40],
      pageOrientation: 'portrait'
    };
    
    const baseLayout = createBaseLayout(layoutOptions);
    
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        subtitleCenter: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        carreraHeader: {
          fontSize: 10,
          bold: true,
          alignment: 'left'
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          fillColor: '#eeeeee'
        },
        tableCellCenter: {
          fontSize: 8,
          alignment: 'center'
        },
        tableCellLeft: {
          fontSize: 8,
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
      }
    };
    
    const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
    return base64PDF;
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}

module.exports.pdfmakeProcesoPdfSolcitudesAprobadasCarreraPeriodo = async function (listado, periodo, strCarrera, strNombre) {
  try {
    const periodoinfo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);
    
    const content = [];
    
    content.push({
      margin: [0, 0, 0, 10],
      alignment: 'center',
      stack: [
        { text: 'INFORMACIÓN DE ESTUDIANTES MOVILIDAD ACADÉMICA', style: 'subtitleCenter' },
        { text: `PERIODO ACADÉMICO: ${periodoinfo.data[0].strDescripcion}`, style: 'subtitleCenter' },
        { text: `CARRERA: ${strCarrera}`, style: 'subtitleCenter' }
      ]
    });
    
    const tableBody = [];
    tableBody.push([
      { text: 'INFORMACIÓN.', colSpan: 6, style: 'tableHeaderTitle' },
      {}, {}, {}, {}, {}
    ]);
    tableBody.push([
      { text: 'N°', style: 'tableHeader' },
      { text: 'CÉDULA', style: 'tableHeader' },
      { text: 'ESTUDIANTES', style: 'tableHeader' },
      { text: 'PUNTAJES', style: 'tableHeader' },
      { text: 'MOVILIDAD', style: 'tableHeader' },
      { text: 'PROCEDENCIAS', style: 'tableHeader' }
    ]);
    
    let contadot = 0;
    listado.forEach(carreras => {
      contadot++;
      tableBody.push([
        { text: contadot.toString(), style: 'tableCellCenter' },
        { text: carreras.cm_identificacion || '', style: 'tableCellCenter' },
        { text: `${carreras.nombreestudiante} ${carreras.apellidoestudiante}`, style: 'tableCellLeft' },
        { text: carreras.cm_puntaje?.toString() || '', style: 'tableCellCenter' },
        { text: carreras.movilidad || '', style: 'tableCellCenter' },
        { text: carreras.carreraActualNombre || '', style: 'tableCellLeft' }
      ]);
    });
    
    content.push({
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
        widths: ['auto', 'auto', '*', 'auto', 'auto', '*'],
        body: tableBody
      }
    });
    
    content.push({
      margin: [0, 40, 0, 0],
      alignment: 'center',
      stack: [
        { text: '----------------------------------------', style: 'signatureLine' },
        { text: 'GENERADO POR:', style: 'signatureLabel' },
        { text: strNombre, style: 'signatureName' }
      ]
    });
    
    const layoutOptions = {
      title: 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO',
      subtitle: '',
      pageMargins: [40, 60, 40, 40],
      pageOrientation: 'portrait'
    };
    
    const baseLayout = createBaseLayout(layoutOptions);
    
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        subtitleCenter: {
          fontSize: 9,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        tableHeaderTitle: {
          bold: true,
          fontSize: 10,
          alignment: 'center',
          fillColor: '#eeeeee'
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          fillColor: '#eeeeee'
        },
        tableCellCenter: {
          fontSize: 8,
          alignment: 'center'
        },
        tableCellLeft: {
          fontSize: 8,
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
      }
    };
    
    const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
    return base64PDF;
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}

module.exports.pdfmakeProcesoPdfCertificadoMovilidadEstudiante = async function (objsolicitud, objpersona, objperiodo) {
  try {
    const DatosCarreraActual = await funcionesmodelomovilidad.ObenterDatosCarrera('OAS_Master', objsolicitud.cm_dbcarrera_actual);
    const DatosCarreraMovilidad = await funcionesmodelomovilidad.ObenterDatosCarrera('OAS_Master', objsolicitud.cm_dbcarrera_movilidad);
    const fechaActual = tools.ObtenerFechaActualCertificado();
    
    const content = [];
    
    content.push({
      margin: [0, 0, 0, 10],
      alignment: 'center',
      stack: [
        { text: 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO', style: 'title' },
        { text: 'DECANATO ACADEMICO INSTITUCIONAL', style: 'title' }
      ]
    });
    
    content.push({
      text: fechaActual,
      style: 'fecha',
      margin: [0, 10, 0, 40]
    });
    
    content.push({
      text: 'CERTIFICADO CAMBIO DE CARRERA INTERNO',
      style: 'certificadoTitle',
      margin: [0, 0, 0, 20]
    });
    
    content.push({
      text: [
        'La ', { text: 'Escuela Superior Politécnica de Chimborazo', bold: true },
        ', a través del Decanato Académico, certifica que la estuidante ',
        { text: `${objpersona.nombreestudiante} ${objpersona.apellidoestudiante}`, bold: true },
        ', portadora de la cédula de ciudadanía No. ',
        { text: objpersona.strcedula, bold: true },
        ', realizó un cambio interno de carrera conforme a la normativa institucional vigente, pasando de la carrera de ',
        { text: DatosCarreraActual.data[0].strNombre, bold: true },
        ' a la carrera de ',
        { text: DatosCarreraMovilidad.data[0].strNombre, bold: true },
        ', correspondiente al período académico ',
        { text: objperiodo.strDescripcion, bold: true },
        '.'
      ],
      style: 'paragraph',
      margin: [0, 0, 0, 10]
    });
    
    content.push({
      text: 'El presente certificado se expide a solicitud del interesado para los fines académicos y administrativos que considere pertinentes.',
      style: 'paragraph',
      margin: [0, 0, 0, 40]
    });
    
    content.push({
      margin: [0, 80, 0, 0],
      alignment: 'center',
      stack: [
        { text: '__________________________________________', style: 'signatureLine' },
        { text: 'DECANO ACADÉMICO', style: 'signatureLabel' },
        { text: 'EDWIN FERNANDO VITERI NUÑEZ', style: 'signatureName' }
      ]
    });
    
    const docDefinition = {
      content: content,
      pageMargins: [60, 60, 60, 60],
      pageOrientation: 'portrait',
      styles: {
        title: {
          fontSize: 10,
          bold: true,
          alignment: 'center'
        },
        fecha: {
          fontSize: 10,
          alignment: 'right'
        },
        certificadoTitle: {
          fontSize: 10,
          bold: true,
          alignment: 'center'
        },
        paragraph: {
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.8
        },
        signatureLine: {
          fontSize: 10,
          margin: [0, 0, 0, 5]
        },
        signatureLabel: {
          fontSize: 10,
          bold: true,
          margin: [0, 5, 0, 2]
        },
        signatureName: {
          fontSize: 10,
          bold: true,
          margin: [0, 2, 0, 0]
        }
      }
    };
    
    const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
    return base64PDF;
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}

module.exports.pdfmakeProcesoPdfCurriculumEstudiantil = async function (cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas) {
  try {
    const content = [];

    // Header Info
    content.push({
      margin: [0, 0, 0, 10],
      alignment: 'center',
      stack: [
        { text: 'ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO', style: 'mainTitle' },
        { text: 'HISTORIAL ACADÉMICO', style: 'mainSubtitle' }
      ]
    });

    // Personal Data & Photo
    const personalDataStack = [
      { text: 'DATOS PERSONALES', style: 'sectionTitle' },
      {
        columns: [
          { text: 'NOMBRES COMPLETOS:', style: 'dataLabel', width: 120 },
          { text: `${persona.per_primerApellido} ${persona.per_segundoApellido} ${persona.per_nombres}`, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      },
      {
        columns: [
          { text: 'CÉDULA:', style: 'dataLabel', width: 120 },
          { text: cedula, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      },
      {
        columns: [
          { text: 'NACIONALIDAD:', style: 'dataLabel', width: 120 },
          { text: persona.nac_nombre, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      },
      {
        columns: [
          { text: 'GÉNERO:', style: 'dataLabel', width: 120 },
          { text: persona.gen_nombre, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      },
      {
        columns: [
          { text: 'CORREO:', style: 'dataLabel', width: 120 },
          { text: persona.per_email, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      },
      {
        columns: [
          { text: 'PROCEDENCIA:', style: 'dataLabel', width: 120 },
          { text: persona.procedencia, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      }
    ];

    let photoObj = {};
    if (foto && foto.startsWith('data:image')) {
      photoObj = { image: foto, width: 100, height: 130, alignment: 'center' };
    } else {
      photoObj = {
        table: {
          widths: [100],
          heights: [130],
          body: [[ { text: 'FOTO', alignment: 'center', margin: [0, 60, 0, 0] } ]]
        }
      };
    }

    content.push({
      columns: [
        { width: 120, stack: [ photoObj ] },
        { width: '*', stack: personalDataStack, margin: [10, 0, 0, 0] }
      ],
      margin: [0, 0, 0, 20]
    });

    // Academic Data
    content.push({ text: 'DATOS ACADÉMICOS', style: 'sectionTitle' });
    content.push({
      columns: [
        { text: 'FACULTAD:', style: 'dataLabel', width: 120 },
        { text: carrera.strNombreFacultad, style: 'dataValue', width: '*' }
      ], margin: [0, 2, 0, 2]
    });
    content.push({
      columns: [
        { text: 'CARRERA:', style: 'dataLabel', width: 120 },
        { text: carrera.strNombreCarrera, style: 'dataValue', width: '*' }
      ], margin: [0, 2, 0, 2]
    });
    content.push({
      columns: [
        { text: 'SEDE:', style: 'dataLabel', width: 120 },
        { text: carrera.strSede, style: 'dataValue', width: '*' }
      ], margin: [0, 2, 0, 20]
    });

    // Asignaturas
    content.push({ text: 'ASIGNATURAS MALLA CARRERA', style: 'sectionTitle' });
    listado.forEach(objnivel => {
      content.push({ text: `PAO: ${objnivel.strDescripcion}`, style: 'subSectionTitle', margin: [0, 5, 0, 5] });
      
      const tableBody = [];
      tableBody.push([
        { text: '#', style: 'tableHeader' },
        { text: 'CÓDIGO', style: 'tableHeader' },
        { text: 'NOMBRES', style: 'tableHeader' },
        { text: 'NIVEL', style: 'tableHeader' },
        { text: 'CRÉDITOS', style: 'tableHeader' },
        { text: 'ARÉA', style: 'tableHeader' },
        { text: 'TIPO', style: 'tableHeader' },
        { text: 'ESTADO', style: 'tableHeader' }
      ]);
      
      let contadot = 0;
      objnivel.listadoasignaturas.forEach(ojbAsignaturas => {
        contadot++;
        const isAprobada = ojbAsignaturas.estadoasignatura?.toUpperCase() === 'APROBADA';
        tableBody.push([
          { text: contadot.toString(), style: 'tableCellCenter' },
          { text: ojbAsignaturas.strCodMateria || '', style: 'tableCellLeft' },
          { text: ojbAsignaturas.nombreasignatura || '', style: 'tableCellLeft' },
          { text: ojbAsignaturas.strCodNivel || '', style: 'tableCellCenter' },
          { text: ojbAsignaturas.fltCreditos?.toString() || '', style: 'tableCellCenter' },
          { text: ojbAsignaturas.nombrearea || '', style: 'tableCellCenter' },
          { text: ojbAsignaturas.nombretipo || '', style: 'tableCellCenter' },
          { text: ojbAsignaturas.estadoasignatura || '', style: isAprobada ? 'tableCellAprobada' : 'tableCellPorAprobar' }
        ]);
      });
      
      content.push({
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: tableBody
        },
        margin: [0, 0, 0, 10]
      });
    });

    // Becas
    content.push({ text: 'BECAS ESTUDIANTIL', style: 'sectionTitle', margin: [0, 10, 0, 5] });
    if (listadoBecas && listadoBecas.length > 0) {
      const tableBodyBecas = [];
      tableBodyBecas.push([
        { text: '#', style: 'tableHeader' },
        { text: 'FACULTAD', style: 'tableHeader' },
        { text: 'CARRERA', style: 'tableHeader' },
        { text: 'BECA', style: 'tableHeader' },
        { text: 'PERíODO', style: 'tableHeader' },
        { text: 'ESTADO', style: 'tableHeader' }
      ]);
      
      let contadotBecas = 0;
      listadoBecas.forEach(objBecas => {
        contadotBecas++;
        tableBodyBecas.push([
          { text: contadotBecas.toString(), style: 'tableCellCenter' },
          { text: objBecas.nombFacultad || '', style: 'tableCellLeft' },
          { text: objBecas.nombCarrera || '', style: 'tableCellLeft' },
          { text: objBecas.strNombre || '', style: 'tableCellCenter' },
          { text: objBecas.periodoDetalle || '', style: 'tableCellCenter' },
          { text: (objBecas.detEstado || '').toUpperCase(), style: 'tableCellCenter' }
        ]);
      });
      
      content.push({
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', 'auto', 'auto', 'auto'],
          body: tableBodyBecas
        },
        margin: [0, 0, 0, 10]
      });
    } else {
      content.push({
        columns: [
          { text: 'ESTADO:', style: 'dataLabel', width: 120 },
          { text: 'El estudiante no registra información en becas', style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 10]
      });
    }

    // Titulacion
    content.push({ text: 'PROYECTO TITULACIÓN', style: 'sectionTitle', margin: [0, 10, 0, 5] });
    if (objTitulacion && objTitulacion.proceso) {
      content.push({
        columns: [
          { text: 'PROYECTO:', style: 'dataLabel', width: 120 },
          { text: `${objTitulacion.nombreproyecto}.`, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      });
      content.push({
        columns: [
          { text: 'TIPO PROYECTO:', style: 'dataLabel', width: 120 },
          { text: `${(objTitulacion.formagrado || '').toUpperCase()}.`, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      });
      content.push({
        columns: [
          { text: 'RESOLUCIÓN:', style: 'dataLabel', width: 120 },
          { text: `${objTitulacion.resolucion}.`, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      });
      content.push({
        columns: [
          { text: 'ESTADO:', style: 'dataLabel', width: 120 },
          { text: `${objTitulacion.estado}.`, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 10]
      });
    } else if (objTitulacion) {
      content.push({
        columns: [
          { text: 'TÍTULO:', style: 'dataLabel', width: 120 },
          { text: `${objTitulacion.mensaje}.`, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      });
      content.push({
        columns: [
          { text: 'ESTADO:', style: 'dataLabel', width: 120 },
          { text: 'NINGUNO.', style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 10]
      });
    }

    content.push({
      text: `Documento generado el ${new Date().toLocaleDateString()} - Sistema Académico`,
      style: 'footerText',
      margin: [0, 20, 0, 0]
    });

    const docDefinition = {
      content: content,
      pageMargins: [40, 40, 40, 40],
      pageOrientation: 'portrait',
      styles: {
        mainTitle: {
          fontSize: 14,
          bold: true,
          color: '#2c3e50',
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        mainSubtitle: {
          fontSize: 12,
          color: '#2c3e50',
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        sectionTitle: {
          fontSize: 10,
          bold: true,
          color: '#2c3e50',
          fillColor: '#f0f0f0',
          margin: [0, 5, 0, 5]
        },
        subSectionTitle: {
          fontSize: 10,
          bold: true,
          color: '#2c3e50'
        },
        dataLabel: {
          fontSize: 9,
          bold: true,
          color: '#555555'
        },
        dataValue: {
          fontSize: 9
        },
        tableHeader: {
          bold: true,
          fontSize: 9,
          color: 'white',
          fillColor: '#2c3e50',
          alignment: 'center'
        },
        tableCellCenter: {
          fontSize: 8,
          alignment: 'center'
        },
        tableCellLeft: {
          fontSize: 8,
          alignment: 'left'
        },
        tableCellAprobada: {
          fontSize: 8,
          alignment: 'center',
          color: '#27ae60',
          bold: true
        },
        tableCellPorAprobar: {
          fontSize: 8,
          alignment: 'center',
          color: '#e67e22',
          bold: true
        },
        footerText: {
          fontSize: 10,
          color: '#777777',
          alignment: 'center'
        }
      }
    };

    const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
    return base64PDF;
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}

module.exports.pdfmakeProcesoPdfCurriculumEstudiantilConsultor = async function (cedula, persona, carrera, listado, foto, objTitulacion, listadoBecas, codigo) {
  try {
    const content = [];

    // Header Info
    content.push({
      margin: [0, 0, 0, 10],
      alignment: 'center',
      stack: [
        { text: 'ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO', style: 'mainTitle' },
        { text: 'HISTORIAL ACADÉMICO', style: 'mainSubtitle' }
      ]
    });

    // Personal Data & Photo
    const personalDataStack = [
      { text: 'DATOS PERSONALES', style: 'sectionTitle' },
      {
        columns: [
          { text: 'NOMBRES COMPLETOS:', style: 'dataLabel', width: 120 },
          { text: `${persona.per_primerApellido} ${persona.per_segundoApellido} ${persona.per_nombres}`, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      },
      {
        columns: [
          { text: 'CÉDULA:', style: 'dataLabel', width: 120 },
          { text: cedula, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      },
      {
        columns: [
          { text: 'NACIONALIDAD:', style: 'dataLabel', width: 120 },
          { text: persona.nac_nombre, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      },
      {
        columns: [
          { text: 'GÉNERO:', style: 'dataLabel', width: 120 },
          { text: persona.gen_nombre, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      },
      {
        columns: [
          { text: 'CORREO:', style: 'dataLabel', width: 120 },
          { text: persona.per_email, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      },
      {
        columns: [
          { text: 'PROCEDENCIA:', style: 'dataLabel', width: 120 },
          { text: persona.procedencia, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      }
    ];

    let photoObj = {};
    if (foto && foto.startsWith('data:image')) {
      photoObj = { image: foto, width: 100, height: 130, alignment: 'center' };
    } else {
      photoObj = {
        table: {
          widths: [100],
          heights: [130],
          body: [[ { text: 'FOTO', alignment: 'center', margin: [0, 60, 0, 0] } ]]
        }
      };
    }

    content.push({
      columns: [
        { width: 120, stack: [ photoObj ] },
        { width: '*', stack: personalDataStack, margin: [10, 0, 0, 0] }
      ],
      margin: [0, 0, 0, 20]
    });

    // Academic Data
    content.push({ text: 'DATOS ACADÉMICOS', style: 'sectionTitle' });
    content.push({
      columns: [
        { text: 'FACULTAD:', style: 'dataLabel', width: 120 },
        { text: carrera.strNombreFacultad, style: 'dataValue', width: '*' }
      ], margin: [0, 2, 0, 2]
    });
    content.push({
      columns: [
        { text: 'CARRERA:', style: 'dataLabel', width: 120 },
        { text: carrera.strNombreCarrera, style: 'dataValue', width: '*' }
      ], margin: [0, 2, 0, 2]
    });
    content.push({
      columns: [
        { text: 'SEDE:', style: 'dataLabel', width: 120 },
        { text: carrera.strSede, style: 'dataValue', width: '*' }
      ], margin: [0, 2, 0, 2]
    });
    content.push({
      columns: [
        { text: 'CÓDIGO ESTUDIANTE:', style: 'dataLabel', width: 120 },
        { text: codigo, style: 'dataValue', width: '*' }
      ], margin: [0, 2, 0, 20]
    });

    // Asignaturas
    content.push({ text: 'ASIGNATURAS MALLA CARRERA', style: 'sectionTitle' });
    listado.forEach(objnivel => {
      content.push({ text: `PAO: ${objnivel.strDescripcion}`, style: 'subSectionTitle', margin: [0, 5, 0, 5] });
      
      const tableBody = [];
      tableBody.push([
        { text: '#', style: 'tableHeader' },
        { text: 'HOMOL.', style: 'tableHeader' },
        { text: 'CÓDIGO', style: 'tableHeader' },
        { text: 'NOMBRES', style: 'tableHeader' },
        { text: 'NIVEL', style: 'tableHeader' },
        { text: 'TIPO', style: 'tableHeader' },
        { text: 'ESTADO', style: 'tableHeader' }
      ]);
      
      let contadot = 0;
      objnivel.listadoasignaturas.forEach(ojbAsignaturas => {
        contadot++;
        const isAprobada = ojbAsignaturas.Estado?.toUpperCase() === 'APROBADA';
        tableBody.push([
          { text: contadot.toString(), style: 'tableCellCenter' },
          { text: ojbAsignaturas.CodigoMateriaNueva || '', style: 'tableCellCenter' },
          { text: ojbAsignaturas.CodigoMateria || '', style: 'tableCellLeft' },
          { text: ojbAsignaturas.NombreMateria || '', style: 'tableCellLeft' },
          { text: objnivel.strCodNivel || '', style: 'tableCellCenter' },
          { text: ojbAsignaturas.nombretipo || '', style: 'tableCellCenter' },
          { text: ojbAsignaturas.Estado || '', style: isAprobada ? 'tableCellAprobada' : 'tableCellPorAprobar' }
        ]);
      });
      
      content.push({
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto'],
          body: tableBody
        },
        margin: [0, 0, 0, 10]
      });
    });

    // Becas
    content.push({ text: 'BECAS ESTUDIANTIL', style: 'sectionTitle', margin: [0, 10, 0, 5] });
    if (listadoBecas && listadoBecas.length > 0) {
      const tableBodyBecas = [];
      tableBodyBecas.push([
        { text: '#', style: 'tableHeader' },
        { text: 'FACULTAD', style: 'tableHeader' },
        { text: 'CARRERA', style: 'tableHeader' },
        { text: 'BECA', style: 'tableHeader' },
        { text: 'PERíODO', style: 'tableHeader' },
        { text: 'ESTADO', style: 'tableHeader' }
      ]);
      
      let contadotBecas = 0;
      listadoBecas.forEach(objBecas => {
        contadotBecas++;
        tableBodyBecas.push([
          { text: contadotBecas.toString(), style: 'tableCellCenter' },
          { text: objBecas.nombFacultad || '', style: 'tableCellLeft' },
          { text: objBecas.nombCarrera || '', style: 'tableCellLeft' },
          { text: objBecas.strNombre || '', style: 'tableCellCenter' },
          { text: objBecas.periodoDetalle || '', style: 'tableCellCenter' },
          { text: (objBecas.detEstado || '').toUpperCase(), style: 'tableCellCenter' }
        ]);
      });
      
      content.push({
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', 'auto', 'auto', 'auto'],
          body: tableBodyBecas
        },
        margin: [0, 0, 0, 10]
      });
    } else {
      content.push({
        columns: [
          { text: 'ESTADO:', style: 'dataLabel', width: 120 },
          { text: 'El estudiante no registra información en becas', style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 10]
      });
    }

    // Titulacion
    content.push({ text: 'PROYECTO TITULACIÓN', style: 'sectionTitle', margin: [0, 10, 0, 5] });
    if (objTitulacion && objTitulacion.proceso) {
      content.push({
        columns: [
          { text: 'PROYECTO:', style: 'dataLabel', width: 120 },
          { text: `${objTitulacion.nombreproyecto}.`, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      });
      content.push({
        columns: [
          { text: 'TIPO PROYECTO:', style: 'dataLabel', width: 120 },
          { text: `${(objTitulacion.formagrado || '').toUpperCase()}.`, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      });
      content.push({
        columns: [
          { text: 'RESOLUCIÓN:', style: 'dataLabel', width: 120 },
          { text: `${objTitulacion.resolucion}.`, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      });
      content.push({
        columns: [
          { text: 'ESTADO:', style: 'dataLabel', width: 120 },
          { text: `${objTitulacion.estado}.`, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 10]
      });
    } else if (objTitulacion) {
      content.push({
        columns: [
          { text: 'TÍTULO:', style: 'dataLabel', width: 120 },
          { text: `${objTitulacion.mensaje}.`, style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 2]
      });
      content.push({
        columns: [
          { text: 'ESTADO:', style: 'dataLabel', width: 120 },
          { text: 'NINGUNO.', style: 'dataValue', width: '*' }
        ], margin: [0, 2, 0, 10]
      });
    }

    content.push({
      text: `Documento generado el ${new Date().toLocaleDateString()} - Sistema Académico`,
      style: 'footerText',
      margin: [0, 20, 0, 0]
    });

    const docDefinition = {
      content: content,
      pageMargins: [40, 40, 40, 40],
      pageOrientation: 'portrait',
      styles: {
        mainTitle: {
          fontSize: 14,
          bold: true,
          color: '#2c3e50',
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        mainSubtitle: {
          fontSize: 12,
          color: '#2c3e50',
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        sectionTitle: {
          fontSize: 10,
          bold: true,
          color: '#2c3e50',
          fillColor: '#f0f0f0',
          margin: [0, 5, 0, 5]
        },
        subSectionTitle: {
          fontSize: 10,
          bold: true,
          color: '#2c3e50'
        },
        dataLabel: {
          fontSize: 9,
          bold: true,
          color: '#555555'
        },
        dataValue: {
          fontSize: 9
        },
        tableHeader: {
          bold: true,
          fontSize: 9,
          color: 'white',
          fillColor: '#2c3e50',
          alignment: 'center'
        },
        tableCellCenter: {
          fontSize: 8,
          alignment: 'center'
        },
        tableCellLeft: {
          fontSize: 8,
          alignment: 'left'
        },
        tableCellAprobada: {
          fontSize: 8,
          alignment: 'center',
          color: '#27ae60',
          bold: true
        },
        tableCellPorAprobar: {
          fontSize: 8,
          alignment: 'center',
          color: '#e67e22',
          bold: true
        },
        footerText: {
          fontSize: 10,
          color: '#777777',
          alignment: 'center'
        }
      }
    };

    const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
    return base64PDF;
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}
