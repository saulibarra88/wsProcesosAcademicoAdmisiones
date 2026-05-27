// reporteNotas.js (CommonJS)
const PdfPrinter = require('pdfmake');
const { createBaseLayout } = require('./pdf-layout.js');
const axios = require('axios');
const procesoCupo = require('../modelo/procesocupos');     
const funcionesgenerales = require('../rutas/tools.js');     
const https = require('https');
const crypto = require("crypto");
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
// Configuración del agente HTTPS
const agent = new https.Agent({
  rejectUnauthorized: false,
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,

});

/**
 * Genera un reporte de notas y calificaciones en PDF
 */
module.exports.pdfmakegenerarReporteNotasCalificaciones=async function(Asignaturas, carrera, periodo, nivel, paralelo, CodMateria, cedula, cedulaUsuario) {
try {
    var resultado = await generarReporteNotasCalificaciones(Asignaturas, carrera, periodo, nivel, paralelo, CodMateria, cedula, cedulaUsuario);
    return resultado
  } catch (error) {
    console.log(error);
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
module.exports.pdfmakegenerarReporteNotasCalificacionesTres=async function(listado, carrera, periodo,nivel,paralelo,CodMateria, cedula, cedulaUsuario) {
try {
    var resultado = await generarReporteNotasCalificacionesTres(listado, carrera, periodo,nivel,paralelo,CodMateria, cedula, cedulaUsuario);
    return resultado
  } catch (error) {
    console.log(error);
  }
}

module.exports.pdfmakeProcesoPdfEstudianteAsignaturaAprueban=async function(listado, carrera, cedula, periodo) {
try {
    var resultado = await ProcesoPdfEstudianteAsignaturaAprueban(listado, carrera, cedula, periodo);
    return resultado
  } catch (error) {
    console.log(error);
  }
}
module.exports.pdfmakeProcesoPdfEstudianteAsignaturaApruebanNivelParalelo=async function(ListadoEstudiantesProceso, carrera, cedula, periodo) {
try {
    var resultado = await ProcesoPdfEstudianteAsignaturaApruebanNivelParalelo(ListadoEstudiantesProceso, carrera, cedula, periodo);
    return resultado
  } catch (error) {
    console.log(error);
  }
}
async function generarReporteNotasCalificaciones( listado, carrera, periodo, nivel, paralelo, CodMateria, cedula, cedulaUsuario ) {
  try {
    // Obtener datos necesarios
    const datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    const datosAsignatura = await procesoCupo.AsignaturasDatos(carrera, CodMateria);
    const datosDocentes = await procesoCupo.DocentesDatos(carrera, cedula);
    const datosPeriodo = await procesoCupo.PeriodoDatos(carrera, periodo);
    const ObtenerPersona = await axios.get( `https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/${cedulaUsuario}`, { httpsAgent: agent } );
    const strNombres = `${ObtenerPersona.data.listado[0].per_nombres} ${ObtenerPersona.data.listado[0].per_primerApellido} ${ObtenerPersona.data.listado[0].per_segundoApellido}`;
    // Función auxiliar para valores nulos
    const getValor = (valor, defaultValue = 'SIN REGISTRO') => {
      return valor !== null && valor !== undefined && valor !== '' ? valor : defaultValue;
    };

    // Preparar datos para la tabla
    const tableBody = listado.map((asignaturas, index) => {
      const contadot = index + 1;
      const calificacion = asignaturas.Calificacion?.[0];
      const calificacionRecuperacion = asignaturas.cantidadNota > 1 ? asignaturas.Calificacion?.[1] : null;

      return [
        { text: contadot.toString(), style: 'tableCellCenter' },
        { text: `${asignaturas.strApellidos} ${asignaturas.strNombres}`, style: 'tableCellLeft' },
        { text: getValor(asignaturas.bytNumMat), style: 'tableCellCenter' },
        { text: calificacion ? getValor(calificacion.dcParcial1) : 'SIN REGISTRO', style: 'tableCellCenter' },
        { text: calificacion ? getValor(calificacion.dcParcial2) : 'SIN REGISTRO', style: 'tableCellCenter' },
        { text: asignaturas.bytAsistencia ? `${asignaturas.bytAsistencia} %` : 'SIN REGISTRO', style: 'tableCellCenter' },
        { text: calificacion ? getValor(calificacion.promedio) : 'SIN REGISTRO', style: 'tableCellCenter' },
        { text: calificacion ? getValor(calificacion.Equivalencia.eqrennombre) : 'SIN REGISTRO', style: 'tableCellCenter' },
        {
          text: calificacionRecuperacion
            ? getValor(calificacionRecuperacion.dcParcial2)
            : 'SIN REGISTRO',
          style: 'tableCellCenter'
        },
        {
          text: calificacionRecuperacion
            ? getValor(calificacionRecuperacion.promedio)
            : 'SIN REGISTRO',
          style: 'tableCellCenter'
        }
      ];
    });

    // Definir columnas de la tabla
    const tableColumns = [
      { text: '#', style: 'tableHeader' },
      { text: 'ESTUDIANTES', style: 'tableHeader' },
      { text: 'MAT.', style: 'tableHeader' },
      { text: '1', style: 'tableHeader' },
      { text: '2', style: 'tableHeader' },
      { text: 'ASIST.', style: 'tableHeader' },
      { text: 'PROME.', style: 'tableHeader' },
      { text: 'EQUIV.', style: 'tableHeader' },
      { text: 'EVA.', style: 'tableHeader' },
      { text: 'PROME.', style: 'tableHeader' }
    ];

    // Definir widths para cada columna
    const tableWidths = ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'];

    // Contenido principal del PDF
    const content = [
 {
  margin: [0, 0, 0, 20],
  stack: [
    { 
      text: [
        { text: 'PROFESOR: ', bold: true },
        { text: `${datosDocentes.data[0].strNombres} ${datosDocentes.data[0].strApellidos}` }
      ], 
      style: 'SubtituloLeft' 
    },
        { 
      text: [
        { text: 'CÉDULA: ', bold: true },
        { text: `${datosDocentes.data[0].strCedula} ` }
      ], 
      style: 'SubtituloLeft' 
    },
    { 
      text: [
        { text: 'PERIODO: ', bold: true },
        { text: `${datosPeriodo.data[0].strDescripcion} (${periodo})` }
      ], 
      style: 'SubtituloLeft' 
    },
    { 
      text: [
        { text: 'ASIGNATURA: ', bold: true },
        { text: `${datosAsignatura.data[0].strNombre}` }
      ], 
      style: 'SubtituloLeft' 
    },
    { 
      text: [
        { text: 'PAO: ', bold: true },
        { text: `${nivel}` }
      ], 
      style: 'SubtituloLeft' 
    },
    { 
      text: [
        { text: 'PARALELO: ', bold: true },
        { text: `${paralelo}` }
      ], 
      style: 'SubtituloLeft' 
    }
  ]
},
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
            // Primera fila de encabezado (con colspan)
            [
              { text: 'INFORMACIÓN', colSpan: 3, style: 'tableHeaderCenter' },
              {},
              {},
              { text: 'MEDIO Y FIN CICLO', colSpan: 5, style: 'tableHeaderCenter' },
              {},
              {},
              {},
              {},
              { text: 'EVALUACIÓN RECUPERACIÓN', colSpan: 2, style: 'tableHeaderCenter' },
              {}
            ],
            // Segunda fila de encabezado (columnas individuales)
            tableColumns.map(col => col)
          ].concat(tableBody)
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
    // Configurar opciones del layout base
    const layoutOptions = {
      title: 'REPORTE CALIFICACIONES',
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
        infoText: {
          fontSize: 10,
          margin: [0, 2, 0, 2],
          alignment: 'center'
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          fillColor: '#eeeeee'
        },
        tableHeaderCenter: {
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
          fontSize: 8,
          alignment: 'left'
        },
          SubtituloLeft: {
          fontSize: 10,
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

const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition,defaultFonts);
return base64PDF
  } catch (error) {
    console.error('Error generando el reporte:', error);
    throw error;
  }
}
async function generarReporteNotasCalificacionesTres(listado, carrera, periodo,nivel,paralelo,CodMateria, cedula, cedulaUsuario) {
  try {
    // Obtener datos necesarios
    const datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    const datosAsignatura = await procesoCupo.AsignaturasDatos(carrera, CodMateria);
    const datosDocentes = await procesoCupo.DocentesDatos(carrera, cedula);
    const datosPeriodo = await procesoCupo.PeriodoDatos(carrera, periodo);
    const ObtenerPersona = await axios.get(
      `https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/${cedulaUsuario}`,
      { httpsAgent: agent }
    );
    const strNombres = `${ObtenerPersona.data.listado[0].per_nombres} ${ObtenerPersona.data.listado[0].per_primerApellido} ${ObtenerPersona.data.listado[0].per_segundoApellido}`;

    // Función auxiliar para valores nulos
    const getValor = (valor, defaultValue = '') => {
      return valor !== null && valor !== undefined && valor !== '' ? valor : defaultValue;
    };

    // Función para obtener el estado formateado
    const getEstadoText = (equivalencia) => {
      const estados = {
        'E': 'EXONERADO',
        'A': 'APROBADO',
        'S': 'SUSPENSO',
        'R': 'REPROBADO',
        'PR': 'NO REGISTRO',
        'RS': 'NO REGISTRO'
      };
      return estados[equivalencia] || getValor(equivalencia);
    };

    // Función para obtener estilo según estado
    const getEstadoStyle = (equivalencia) => {
      const styles = {
        'E': 'tagCell_info',
        'A': 'tagCell_success',
        'S': 'tagCell_warn',
        'R': 'tagCell_danger',
        'PR': 'tagCell_secondary',
        'RS': 'tagCell_secondary'
      };
      return styles[equivalencia] || 'tagCell_secondary';
    };

    // Preparar datos para la tabla usando los campos del listado
    const tableBody = listado.map((asignaturas, index) => {
      const contadot = index + 1;

      // Obtener valores directamente del objeto
      const nota1 = getValor(asignaturas.bytNota1);
      const nota2 = getValor(asignaturas.bytNota2);
      const nota3 = getValor(asignaturas.bytNota3);
      const asistencia = asignaturas.bytAsistencia !== null && asignaturas.bytAsistencia !== undefined 
        ? `${asignaturas.bytAsistencia}%` 
        : 'SIN REGISTRO';
      const acumuladoParciales = getValor(asignaturas.bytAcumuladoparciales);
      const notaPrincipal = getValor(asignaturas.bytNotaprincipal);
      const totalPrincipal = getValor(asignaturas.totalPrincipal);
      const estadoPrincipal = getEstadoText(asignaturas.bytEquivalenciaprincipal);
      const estadoPrincipalStyle = getEstadoStyle(asignaturas.bytEquivalenciaprincipal);
      const observacionPri = getValor(asignaturas.strObservacionespri);
      
      // Datos de recuperación/suspenso
      const acumuladoSuspenso = getValor(asignaturas.bytAcumuladosuspenso);
      const notaRecuperacion = getValor(asignaturas.bytSuspenso);
      const totalSuspenso = getValor(asignaturas.totalSuspenso);
      const estadoRecuperacion = getEstadoText(asignaturas.bytEquivalenciasuspenso);
      const estadoRecuperacionStyle = getEstadoStyle(asignaturas.bytEquivalenciasuspenso);
      const observacionSuspenso = getValor(asignaturas.strObservacionessus);

      return [
        { text: contadot.toString(), style: 'tableCellCenter' },
        { text: `${getValor(asignaturas.strApellidos)} ${getValor(asignaturas.strNombres)}`, style: 'tableCellLeft' },
        { text: getValor(asignaturas.bytNumMat), style: 'tableCellCenter' },
        { text: nota1, style: 'tableCellCenter' },
        { text: nota2, style: 'tableCellCenter' },
        { text: nota3, style: 'tableCellCenter' },
        { text: asistencia, style: 'tableCellCenterAsistencia' },
        { text: acumuladoParciales, style: 'tableCellCenterTotal' },
        { text: notaPrincipal, style: 'tableCellCenter' },
        { text: totalPrincipal, style: 'tableCellCenterTotal' },
        { text: estadoPrincipal, style: estadoPrincipalStyle },
        { text: observacionPri, style: 'tableCellCenter' },
        { text: acumuladoSuspenso, style: 'tableCellCenterTotal' },
        { text: notaRecuperacion, style: 'tableCellCenter' },
        { text: totalSuspenso, style: 'tableCellCenterTotal' },
        { text: estadoRecuperacion, style: estadoRecuperacionStyle },
        { text: observacionSuspenso, style: 'tableCellCenter' }
      ];
    });

    // Definir columnas de la tabla
    const tableColumns = [
      { text: '#', style: 'tableHeader' },
      { text: 'ESTUDIANTES', style: 'tableHeaderLeft' },
      { text: 'MAT.', style: 'tableHeader' },
      { text: '1', style: 'tableHeader' },
      { text: '2', style: 'tableHeader' },
      { text: '3', style: 'tableHeader' },
      { text: 'ASISTENCIA', style: 'tableHeader' },
      { text: 'TOTAL', style: 'tableHeader' },
      { text: 'PRINCIPAL', style: 'tableHeader' },
      { text: 'TOTAL', style: 'tableHeader' },
      { text: 'ESTADO', style: 'tableHeader' },
      { text: 'OBSERVACIÓN', style: 'tableHeader' },
      { text: 'ACUMULADO', style: 'tableHeader' },
      { text: 'RECUPERACIÓN', style: 'tableHeader' },
      { text: 'TOTAL', style: 'tableHeader' },
      { text: 'ESTADO', style: 'tableHeader' },
      { text: 'OBSERVACIÓN', style: 'tableHeader' }
    ];

    // Definir widths para cada columna
    const tableWidths = ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'];

    // Contenido principal del PDF
    const content = [
      {
        margin: [0, 0, 0, 20],
        stack: [
          { text: [{ text: 'PROFESOR: ', bold: true }, { text: `${datosDocentes.data[0].strNombres} ${datosDocentes.data[0].strApellidos}` }], style: 'SubtituloLeft' },
          { text: [{ text: 'CÉDULA: ', bold: true }, { text: `${datosDocentes.data[0].strCedula}` }], style: 'SubtituloLeft' },
          { text: [{ text: 'PERIODO: ', bold: true }, { text: `${datosPeriodo.data[0].strDescripcion} (${periodo})` }], style: 'SubtituloLeft' },
          { text: [{ text: 'ASIGNATURA: ', bold: true }, { text: `${datosAsignatura.data[0].strNombre}` }], style: 'SubtituloLeft' },
          { text: [{ text: 'PAO: ', bold: true }, { text: `${nivel}` }], style: 'SubtituloLeft' },
          { text: [{ text: 'PARALELO: ', bold: true }, { text: `${paralelo}` }], style: 'SubtituloLeft' }
        ]
      },
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
            // Primera fila de encabezado con colspans
            [
              { text: 'INFORMACIÓN', colSpan: 3, style: 'tableHeaderCenter' },
              {},
              {},
              { text: 'EVALUACIÓN ACUMULATIVA', colSpan: 5, style: 'tableHeaderCenter' },
              {},
              {},
              {},
              {},
              { text: 'EVALUACIÓN PRINCIPAL', colSpan: 4, style: 'tableHeaderCenter' },
              {},
              {},
              {},
              { text: 'EVALUACIÓN RECUPERACIÓN', colSpan: 5, style: 'tableHeaderCenter' },
              {},
              {},
              {},
              {}
            ],
            // Segunda fila de encabezado
            tableColumns
          ].concat(tableBody)
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

    // Configurar opciones del layout base
    const layoutOptions = {
      title: 'REPORTE CALIFICACIONES',
      subtitle: `CARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
    pageMargins: [40, 120, 40, 70],
  pageOrientation: 'landscape'  // ← Cambiado a horizontal
    };

    // Crear layout base
    const baseLayout = createBaseLayout(layoutOptions);

    // Construir el documento PDF
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        infoText: {
          fontSize: 10,
          margin: [0, 2, 0, 2],
          alignment: 'center'
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          fillColor: '#eeeeee'
        },
        tableHeaderLeft: {
          bold: true,
          fontSize: 8,
          alignment: 'left',
          fillColor: '#eeeeee'
        },
        tableHeaderCenter: {
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
          fontSize: 8,
          alignment: 'left'
        },
        tableCellCenterAsistencia: {
          fontSize: 7,
          alignment: 'center',
          bold: true,
          fillColor: '#e0f2fe'
        },
        tableCellCenterTotal: {
          fontSize: 7,
          alignment: 'center',
          bold: true,
          fillColor: '#e0f2fe'
        },
        SubtituloLeft: {
          fontSize: 10,
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
        },
        // Estilos para los tags de estado
        tagCell_info: {
          fontSize: 7,
          alignment: 'center',
          fillColor: '#e0f2fe',
          color: '#0369a1'
        },
        tagCell_success: {
          fontSize: 7,
          alignment: 'center',
          fillColor: '#dcfce7',
          color: '#166534'
        },
        tagCell_warn: {
          fontSize: 7,
          alignment: 'center',
          fillColor: '#fef9c3',
          color: '#854d0e'
        },
        tagCell_danger: {
          fontSize: 7,
          alignment: 'center',
          fillColor: '#fee2e2',
          color: '#991b1b'
        },
        tagCell_secondary: {
          fontSize: 7,
          alignment: 'center',
          fillColor: '#f1f5f9',
          color: '#475569'
        }
      }
    };

    const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
    return base64PDF;
  } catch (error) {
    console.error('Error generando el reporte:', error);
    throw error;
  }
}

async function ProcesoPdfEstudianteAsignaturaAprueban(listado, carrera, cedula, periodo) {
  try {
    // Obtener datos necesarios
    const ObtenerPersona = await axios.get(`https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/${cedula}`, { httpsAgent: agent });
    const datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    const periodoinfo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);
    
    const strNombres = `${ObtenerPersona.data.listado[0].per_nombres} ${ObtenerPersona.data.listado[0].per_primerApellido} ${ObtenerPersona.data.listado[0].per_segundoApellido}`;
    const Cedula = ObtenerPersona.data.listado[0].pid_valor;

    // Preparar datos para la tabla
    const tableBody = listado.map((carreras, index) => {
      const contadot = index + 1;
      return [
        { text: contadot.toString(), style: 'tableCellCenter' },
        { text: carreras.strCodMateria, style: 'tableCellLeft' },
        { text: carreras.strNombre, style: 'tableCellLeft' },
        { text: carreras.strCodNivel, style: 'tableCellCenter' },
        { text: carreras.cantidadtotal?.toString() || '0', style: 'tableCellCenter' },
        { text: carreras.cantidadprimera?.toString() || '0', style: 'tableCellCenter' },
        { text: carreras.cantidadsegunda?.toString() || '0', style: 'tableCellCenter' },
        { text: carreras.cantidadtercera?.toString() || '0', style: 'tableCellCenter' },
        { text: carreras.repitencia?.toString() || '0', style: 'tableCellCenter' },
        { text: carreras.Aprueban?.toString() || '0', style: 'tableCellCenter' },
        { text: carreras.Reprueban?.toString() || '0', style: 'tableCellCenter' },
        { text: carreras.retiros?.toString() || '0', style: 'tableCellCenter' }
      ];
    });

    // Definir columnas de la tabla
    const tableColumns = [
      { text: 'N°', style: 'tableHeader' },
      { text: 'CÓDIGO', style: 'tableHeader' },
      { text: 'ASIGNATURA', style: 'tableHeader' },
      { text: 'PAO', style: 'tableHeader' },
      { text: 'MATRICULADOS', style: 'tableHeader' },
      { text: 'PRIMERA', style: 'tableHeader' },
      { text: 'SEGUNDA', style: 'tableHeader' },
      { text: 'TERCERA', style: 'tableHeader' },
      { text: 'REPITEN', style: 'tableHeader' },
      { text: 'APRUEBAN', style: 'tableHeader' },
      { text: 'REPRUEBAN', style: 'tableHeader' },
      { text: 'RETIROS', style: 'tableHeader' }
    ];

    // Definir widths para cada columna (ajustados para orientación horizontal)
    const tableWidths = ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'];

    // Contenido principal del PDF
    const content = [
      {
        margin: [0, 0, 0, 15],
        alignment: 'center',
        stack: [
          { text: `PERIODO: ${periodoinfo.data[0].strDescripcion}`, style: 'subtitleCenter' }
        ]
      },
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
          headerRows: 1,
          widths: tableWidths,
          body: [
            tableColumns.map(col => ({ text: col.text, style: col.style })),
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

    // Configurar opciones del layout base con orientación horizontal
    const layoutOptions = {
      title: 'INFORMACIÓN DE ESTUDIANTES.',
      subtitle: `CARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
      pageMargins: [30, 100, 30, 60],  // Márgenes reducidos para horizontal
      pageOrientation: 'landscape'      // Orientación horizontal
    };

    // Crear layout base
    const baseLayout = createBaseLayout(layoutOptions);

    // Construir el documento PDF
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        titleCenter: {
          fontSize: 11,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        subtitleCenter: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
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
    console.error('Error generando el reporte de asignaturas que aprueban:', error);
    return 'ERROR';
  }
}
async function ProcesoPdfEstudianteAsignaturaApruebanNivelParalelo(listado, carrera, cedula, periodo) {
  try {
    // Obtener datos necesarios
    const ObtenerPersona = await axios.get(`https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/${cedula}`, { httpsAgent: agent });
    const datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    const periodoinfo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);
    
    const strNombres = `${ObtenerPersona.data.listado[0].per_nombres} ${ObtenerPersona.data.listado[0].per_primerApellido} ${ObtenerPersona.data.listado[0].per_segundoApellido}`;
    const Cedula = ObtenerPersona.data.listado[0].pid_valor;

    // Función auxiliar para valores nulos
    const getValor = (valor, defaultValue = '0') => {
      return valor !== null && valor !== undefined && valor !== '' ? valor : defaultValue;
    };

    // Construir contenido por cada asignatura
    const asignaturasContent = [];
    
    for (const datoslistado of listado) {
      // Preparar datos de la tabla para esta asignatura
      const tableBody = datoslistado.listadoparalelos.map((paralelodatos, index) => {
        const contadot = index + 1;
        return [
          { text: contadot.toString(), style: 'tableCellCenter' },
          { text: getValor(paralelodatos.strCodNivel), style: 'tableCellCenter' },
          { text: getValor(paralelodatos.strCodParalelo), style: 'tableCellCenter' },
          { text: getValor(paralelodatos.cantidadtotal), style: 'tableCellCenter' },
          { text: getValor(paralelodatos.cantidadprimera), style: 'tableCellCenter' },
          { text: getValor(paralelodatos.cantidadsegunda), style: 'tableCellCenter' },
          { text: getValor(paralelodatos.cantidadtercera), style: 'tableCellCenter' },
          { text: getValor(paralelodatos.repitencia), style: 'tableCellCenter' },
          { text: getValor(paralelodatos.Aprueban), style: 'tableCellCenter' },
          { text: getValor(paralelodatos.Reprueban), style: 'tableCellCenter' },
          { text: getValor(paralelodatos.retiros), style: 'tableCellCenter' },
          { text: getValor(paralelodatos.convalidaciones), style: 'tableCellCenter' },
          { text: getValor(paralelodatos.docente, 'SIN REGISTRO'), style: 'tableCellLeftSmall' }
        ];
      });

      // Definir columnas de la tabla
      const tableColumns = [
        { text: 'N°', style: 'tableHeader' },
        { text: 'PAO', style: 'tableHeader' },
        { text: 'PARALELO', style: 'tableHeader' },
        { text: 'MATRI', style: 'tableHeader' },
        { text: 'PRIMERA', style: 'tableHeader' },
        { text: 'SEGUNDA', style: 'tableHeader' },
        { text: 'TERCERA', style: 'tableHeader' },
        { text: 'REPITEN', style: 'tableHeader' },
        { text: 'APRUEBAN', style: 'tableHeader' },
        { text: 'REPRUEBAN', style: 'tableHeader' },
        { text: 'RETIROS', style: 'tableHeader' },
        { text: 'CONVALIDA', style: 'tableHeader' },
        { text: 'DOCENTES_NOMBRES', style: 'tableHeader' }
      ];

      // Definir widths para cada columna
      const tableWidths = ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'];

      // Agregar el contenido de esta asignatura
      asignaturasContent.push(
        {
          margin: [0, 10, 0, 5],
          stack: [
            { text: `ASIGNATURA: ${datoslistado.strNombre}`, style: 'asignaturaTitle' },
            { text: `CÓDIGO: ${datoslistado.strCodMateria}`, style: 'asignaturaSubtitle' }
          ]
        },
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
            headerRows: 1,
            widths: tableWidths,
            body: [
              tableColumns.map(col => ({ text: col.text, style: col.style })),
              ...tableBody
            ]
          }
        }
      );
    }

    // Contenido principal del PDF
    const content = [
      {
        margin: [0, 0, 0, 15],
        alignment: 'center',
        stack: [
          { text: `PERIODO: ${periodoinfo.data[0].strDescripcion}`, style: 'subtitleCenter' }
        ]
      },
      ...asignaturasContent,
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

    // Configurar opciones del layout base con orientación horizontal
    const layoutOptions = {
      title: 'DATOS INFORMATIVOS',
      subtitle: `CARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
      pageMargins: [30, 100, 30, 60],  // Márgenes reducidos para horizontal
      pageOrientation: 'landscape'      // Orientación horizontal
    };

    // Crear layout base
    const baseLayout = createBaseLayout(layoutOptions);

    // Construir el documento PDF
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        titleCenter: {
          fontSize: 11,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        subtitleCenter: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 15]
        },
        asignaturaTitle: {
          fontSize: 9,
          bold: true,
          alignment: 'left',
          margin: [0, 5, 0, 2]
        },
        asignaturaSubtitle: {
          fontSize: 9,
          alignment: 'left',
          margin: [0, 0, 0, 8]
        },
        tableHeader: {
          bold: true,
          fontSize: 7,
          alignment: 'center',
          fillColor: '#eeeeee'
        },
        tableCellCenter: {
          fontSize: 7,
          alignment: 'center'
        },
        tableCellLeft: {
          fontSize: 8,
          alignment: 'left'
        },
        tableCellLeftSmall: {
          fontSize: 6,
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
    console.error('Error generando el reporte de asignaturas por nivel y paralelo:', error);
    return 'ERROR';
  }
}



