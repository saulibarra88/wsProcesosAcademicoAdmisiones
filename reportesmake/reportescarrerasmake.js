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
const defaultFonts = {
   Roboto: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
   },
};
/**
 * Genera un reporte de notas y calificaciones en PDF
 */
module.exports.pdfmakegenerarReporteNotasCalificaciones=async function(Asignaturas, carrera, periodo, nivel, paralelo, CodMateria, cedula, cedulaUsuario) {
try {
    var resultado = await generarReporteNotasCalificaciones(Asignaturas, carrera, periodo, nivel, paralelo, CodMateria, cedula, cedulaUsuario);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}

module.exports.pdfmakegenerarReporteNotasCalificacionesTres=async function(listado, carrera, periodo,nivel,paralelo,CodMateria, cedula, cedulaUsuario) {
try {
    var resultado = await generarReporteNotasCalificacionesTres(listado, carrera, periodo,nivel,paralelo,CodMateria, cedula, cedulaUsuario);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}

module.exports.pdfmakeProcesoPdfEstudianteAsignaturaAprueban=async function(listado, carrera, cedula, periodo) {
try {
    var resultado = await ProcesoPdfEstudianteAsignaturaAprueban(listado, carrera, cedula, periodo);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.pdfmakeProcesoPdfEstudianteAsignaturaApruebanNivelParalelo=async function(ListadoEstudiantesProceso, carrera, cedula, periodo) {
try {
    var resultado = await ProcesoPdfEstudianteAsignaturaApruebanNivelParalelo(ListadoEstudiantesProceso, carrera, cedula, periodo);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.pdfmakegenerarReporteEvaluacionesRecuperacionCarrera=async function(listado, carrera, periodo, cedulaUsuario) {
try {
    var resultado = await generarReporteEvaluacionesRecuperacionCarrera(listado, carrera, periodo, cedulaUsuario);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.pdfmakegenerarAsignaturasTipoMovilidad=async function(listado, carrera, periodo, cedulaUsuario) {
try {
    var resultado = await generarReporteAsignaturasTipoMovilidadCarrera(listado, carrera, periodo, cedulaUsuario);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.pdfmakegenerarPromediosGeneralesAsignaturas=async function(listado, carrera, periodo, cedulaUsuario) {
try {
    var resultado = await generarReportePromediosGeneralesAsignaturas(listado, carrera, periodo, cedulaUsuario);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.pdfmakegenerarReporteHomologacionCarrera=async function(listado, carrera, cedulaUsuario) {
try {
    var resultado = await generarReporteHomologacionCarrera(listado, carrera, cedulaUsuario);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.pdfmakegenerarReporteNoMatriculados=async function(listado, listadoperiodo,carrera,cedula) {
try {
    var resultado = await generarReporteNoMatriculados(listado, listadoperiodo,carrera,cedula);
    return resultado
  } catch (error) {
    console.error(error);
    
  }
}
module.exports.pdfmakeProcesoPdfListadoDocumentosCarreras = async function(listado, cedulaUsuario, periodo) {
  try {
    var resultado = await ProcesoPdfListadoDocumentosCarreras(listado, cedulaUsuario, periodo);
    return resultado;
  } catch (error) { console.error(error); }
}
module.exports.pdfmakeProcesoPdfTerceraSegundaMatriculaCarrera = async function(listado, carrera, cedulaUsuario, periodo, tipo) {
  try {
    var resultado = await ProcesoPdfTerceraSegundaMatriculaCarrera(listado, carrera, cedulaUsuario, periodo, tipo);
    return resultado;
  } catch (error) { console.error(error); }
}
module.exports.pdfmakeProcesoPdfTerceraSegundaMatriculaCarreraGeneral = async function(listado, carrera, cedulaUsuario, periodo) {
  try {
    var resultado = await ProcesoPdfTerceraSegundaMatriculaCarreraGeneral(listado, carrera, cedulaUsuario, periodo);
    return resultado;
  } catch (error) { console.error(error); }
}
module.exports.pdfmakeProcesoPdfMatriculasEstadosNivelParalelo = async function(listado, carrera, cedulaUsuario, periodo) {
  try {
    var resultado = await ProcesoPdfMatriculasEstadosNivelParalelo(listado, carrera, cedulaUsuario, periodo);
    return resultado;
  } catch (error) { console.error(error); }
}
module.exports.pdfmakeProcesoPdfListadoEstudiantesCuposEstados = async function(listado, cedulaUsuario, periodo, estado) {
  try {
    var resultado = await ProcesoPdfListadoEstudiantesCuposEstados(listado, cedulaUsuario, periodo, estado);
    return resultado;
  } catch (error) { console.error(error); }
}
module.exports.pdfmakeProcesoPdfEstudianteAsignaturaAprueban = async function(listado, carrera, cedulaUsuario, periodo) {
  try {
    var resultado = await ProcesoPdfEstudianteAsignaturaAprueban(listado, carrera, cedulaUsuario, periodo);
    return resultado;
  } catch (error) { console.error(error); }
}
module.exports.pdfmakeProcesoPdfEstudianteAsignaturaApruebanNivelParalelo = async function(listado, carrera, cedulaUsuario, periodo) {
  try {
    var resultado = await ProcesoPdfEstudianteAsignaturaApruebanNivelParalelo(listado, carrera, cedulaUsuario, periodo);
    return resultado;
  } catch (error) { console.error(error); }
}

module.exports.pdfmakegenerarcertificadoasignatura = async function(datos) {
  try {
    var resultado = await generarCertificadoAsignatura(datos);
    return resultado;
  } catch (error) { console.error(error); }
}

module.exports.pdfmakegenerarcertificadoCalificacionesperiodo = async function(datos) {
  try {
    var resultado = await generarCertificadoCalificacionesPeriodo(datos);
    return resultado;
  } catch (error) { console.error(error); }
}

module.exports.pdfmakegenerarMallaCarrera = async function(datos) {
  try {
    var resultado = await generarMallaCarrera(datos);
    return resultado;
  } catch (error) { console.error(error); }
}
module.exports.pdfmakegenerarMallaCarreraPesum = async function(datos) {
  try {
    var resultado = await generarMallaCarreraPesum(datos);
    return resultado;
  } catch (error) { console.error(error); }
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
    console.error(error);
    
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
    console.error(error);
    
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
    console.error(error);
    
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
    console.error(error);
    
    return 'ERROR';
  }
}

async function generarReporteEvaluacionesRecuperacionCarrera( listado, carrera, periodo, cedulaUsuario ) {
  try {
    // 1. Obtener datos necesarios en paralelo para mejorar rendimiento
    const [ datosCarrera, datosPeriodo, ObtenerPersona ] = await Promise.all([ procesoCupo.ObtenerDatosBase(carrera) , procesoCupo.PeriodoDatos(carrera, periodo), axios.get( `https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/${cedulaUsuario}`, { httpsAgent: agent } ) ]);

    // 2. Extraer y formatear datos básicos
    const strNombres = `${ObtenerPersona.data.listado[0].per_nombres} ${ObtenerPersona.data.listado[0].per_primerApellido} ${ObtenerPersona.data.listado[0].per_segundoApellido}`;
    
    const periodoInfo = {
      descripcion: datosPeriodo.data[0].strDescripcion,
      codigo: periodo
    };

    // 3. Función auxiliar para valores nulos
    const getValor = (valor, defaultValue = 'SIN REGISTRO') => {
      return valor !== null && valor !== undefined && valor !== '' ? valor : defaultValue;
    };

    // 4. Función para formatear fecha
const formatearFecha = (fecha) => {
  if (!fecha) return 'SIN REGISTRO';
  
  const date = new Date(fecha);
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) return 'SIN REGISTRO';
  
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

    // 5. Agrupar materias por nivel
    const materiasPorNivel = agruparPorNivel(listado);

    // 6. Generar contenido del PDF con múltiples tablas agrupadas
    const content = await generarContenidoPDF({
      materiasPorNivel,
      periodoInfo,
      datosCarrera,
      getValor,
      formatearFecha
    });

    // 7. Configuración del layout base
    const layoutOptions = {
      title: 'FECHAS DE EVALUACIONES RECUPERACIÓN',
      subtitle: `CARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
      pageMargins: [40, 120, 40, 70],
      pageOrientation: 'portrait'
    };

    const baseLayout = createBaseLayout(layoutOptions);

    // 8. Agregar firma al final
    content.push(crearFirmaPDF(strNombres));

    // 9. Construir documento final
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        ...obtenerEstilosPDF()
      }
    };

    const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
    return base64PDF;

  } catch (error) {
    console.error(error);
    
    throw error;
  }
}
async function generarReporteAsignaturasTipoMovilidadCarrera( listado, carrera, periodo, cedulaUsuario ) {
  try {
    // 1. Obtener datos necesarios en paralelo para mejorar rendimiento
    const [ datosCarrera, datosPeriodo, ObtenerPersona ] = await Promise.all([ procesoCupo.ObtenerDatosBase(carrera) , procesoCupo.PeriodoDatos(carrera, periodo), axios.get( `https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/${cedulaUsuario}`, { httpsAgent: agent } ) ]);

    // 2. Extraer y formatear datos básicos
    const strNombres = `${ObtenerPersona.data.listado[0].per_nombres} ${ObtenerPersona.data.listado[0].per_primerApellido} ${ObtenerPersona.data.listado[0].per_segundoApellido}`;
    
    const periodoInfo = {
      descripcion: datosPeriodo.data[0].strDescripcion,
      codigo: periodo
    };

    // 3. Función auxiliar para valores nulos
    const getValor = (valor, defaultValue = 'SIN REGISTRO') => {
      return valor !== null && valor !== undefined && valor !== '' ? valor : defaultValue;
    };

    // 4. Función para formatear fecha
const formatearFecha = (fecha) => {
  if (!fecha) return 'SIN REGISTRO';
  
  const date = new Date(fecha);
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) return 'SIN REGISTRO';
  
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

    // 5. Agrupar materias por nivel
    const materiasPorNivel = agruparPorNivel(listado);

    // 6. Generar contenido del PDF con múltiples tablas agrupadas
    const content = await generarContenidoPDFAsignaturaMovilidad({
      materiasPorNivel,
      periodoInfo,
      datosCarrera,
      getValor    });

    // 7. Configuración del layout base
    const layoutOptions = {
      title: 'DICTADO ASIGNATURA CARRERA ',
      subtitle: `CARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
      pageMargins: [40, 120, 40, 70],
      pageOrientation: 'landscape'
    };

    const baseLayout = createBaseLayout(layoutOptions);

    // 8. Agregar firma al final
    content.push(crearFirmaPDF(strNombres));

    // 9. Construir documento final
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        ...obtenerEstilosPDF()
      }
    };

    const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
    return base64PDF;

  } catch (error) {
    console.error(error);
    
    throw error;
  }
}
async function generarReporteHomologacionCarrera(listado, carrera, cedulaUsuario) {

  try {
    // 1. Obtener datos necesarios en paralelo para mejorar rendimiento
    const [datosCarrera, obtenerPersona] = await Promise.all([
      procesoCupo.ObtenerDatosBase(carrera),
      axios.get(`https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/${cedulaUsuario}`, { httpsAgent: agent })
    ]);

    // 2. Extraer y formatear datos básicos
    const strNombres = `${obtenerPersona.data.listado[0].per_nombres} ${obtenerPersona.data.listado[0].per_primerApellido} ${obtenerPersona.data.listado[0].per_segundoApellido}`;


    // 3. Función auxiliar para valores nulos
    const getValor = (valor, defaultValue = 'SIN REGISTRO') => {
      return valor !== null && valor !== undefined && valor !== '' ? valor : defaultValue;
    };

    // 4. Función para formatear fecha
    const formatearFecha = (fecha) => {
      if (!fecha) return 'SIN REGISTRO';
      
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return 'SIN REGISTRO';
      
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    };

    // 5. Función para obtener el estado formateado
    const formatearEstado = (estado) => {
      return estado === 'A' ? 'ACTIVO' : 'INACTIVO';
    };

    const obtenerClaseEstado = (estado) => {
      return estado === 'A' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    // 6. Generar contenido del PDF con estructura de tabla
    const content = [
   
      // Tabla principal
      {
        table: {
          headerRows: 2,
          widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: [
            // Primera fila de headers con colores
            [
              { text: 'DATOS', colSpan: 6, style: 'tableHeaderBlue', alignment: 'center' },
              {}, {},{},{},{}
            
            ],
            // Segunda fila de headers
            [
              { text: '#', style: 'tableHeader', alignment: 'center' },
              { text: 'ASIGNATURA ANTERIOR', style: 'tableHeader', alignment: 'center' },
              { text: 'ASIGNATURA ACREDITADA/HOMOLOGADA', style: 'tableHeader', alignment: 'center' },
              { text: 'MALLA', style: 'tableHeader', alignment: 'center' },
              { text: 'FECHA_REGISTRO', style: 'tableHeader', alignment: 'center' },
              { text: 'ESTADO', style: 'tableHeader', alignment: 'center' }

            ],
            // Filas de datos
            ...listado.map((item, index) => [
              { text: (index + 1).toString(), alignment: 'center' },
              {
                stack: [
                  { text: `CÓDIGO: ${getValor(item.hommateriaant)}`, fontSize: 8 },
                  { text: `ASIGNATURA: ${getValor(item.homnombremateriaant)}`, fontSize: 8, margin: [0, 2, 0, 0] }
                ],
                alignment: 'left'
              },
              {
                stack: [
                  { text: `CÓDIGO: ${getValor(item.hommaterianew)}`, fontSize: 8 },
                  { text: `ASIGNATURA: ${getValor(item.homnombrematerianew)}`, fontSize: 8, margin: [0, 2, 0, 0] }
                ],
                alignment: 'left'
              },
              { text: getValor(item.pensumvigente), alignment: 'center', fontSize: 8 },
              { text: formatearFecha(item.homfechacreacion), alignment: 'center', fontSize: 8 },
              {
                text: formatearEstado(item.homestado),
                alignment: 'center', fontSize: 8,
                fillColor: item.homestado === 'A' ? '#dcfce7' : '#fee2e2',
                color: item.homestado === 'A' ? '#166534' : '#991b1b'
              },
             
            ])
          ]
        },
        layout: {
          fillColor: (rowIndex, node, columnIndex) => {
            if (rowIndex === 0 || rowIndex === 1) return null;
            return rowIndex % 2 === 0 ? '#f9fafb' : null;
          },
          hLineWidth: (i, node) => {
            return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
          },
          vLineWidth: () => 0.5,
          hLineColor: (i) => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
          paddingLeft: () => 5,
          paddingRight: () => 5,
          paddingTop: () => 5,
          paddingBottom: () => 5
        }
      },
      // Espacio antes de la firma
      { text: '', margin: [0, 30, 0, 0] },
      // Firma
      crearFirmaPDF(strNombres)
    ];

    // 7. Configuración del layout base
    const layoutOptions = {
      title: 'HOMOLOGACIÓN DE ASIGNATURAS',
      subtitle: `CARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
      pageMargins: [40, 120, 40, 70],
  pageOrientation: 'landscape'  // ← Cambiado a horizontal
    };

    const baseLayout = createBaseLayout(layoutOptions);

    // 8. Construir documento final
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        ...obtenerEstilosPDF(),
       tableHeader: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          fillColor: '#eeeeee'
        },
        tableHeaderBlue: {
          bold: true,
          fontSize: 10,
          fillColor: '#eff6ff',
          color: '#1e3a8a',
          alignment: 'center'
        },
        tableHeaderGreen: {
          bold: true,
          fontSize: 10,
          fillColor: '#f0fdf4',
          color: '#14532d',
          alignment: 'center'
        },
        tableHeaderRed: {
          bold: true,
          fontSize: 10,
          fillColor: '#fef2f2',
          color: '#991b1b',
          alignment: 'center'
        }
      }
    };

    const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
    return base64PDF;

  } catch (error) {
    console.error(error);
    
    throw error;
  }
}


async function generarReporteNoMatriculados(listado, listadoperiodo,carrera,cedula) {
  try {
    // Obtener datos necesarios
    const datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    const ObtenerPersona = await axios.get(`https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/${cedula}`, { httpsAgent: agent });
    
    const strNombres = `${ObtenerPersona.data.listado[0].per_nombres} ${ObtenerPersona.data.listado[0].per_primerApellido} ${ObtenerPersona.data.listado[0].per_segundoApellido}`;
    const Cedula = ObtenerPersona.data.listado[0].pid_valor;

    // Preparar columnas dinámicas para los periodos
    const periodoColumns = listadoperiodo.map(periodo => ({
      text: periodo,
      style: 'tableHeader'
    }));

    // Preparar datos para la tabla
    const tableBody = listado.map((estudiante, index) => {
      const contadot = index + 1;
      
      // Crear celdas para cada periodo
      const periodoCells = estudiante.Periodos.map(periodo => ({
        stack: [
          { text: `MATRICULA: ${periodo.matricula ? 'SI' : 'NO'}`, style: 'periodoText' },
          { text: `PERIODO: ${periodo.periodo}`, style: 'periodoText' },
          { text: `PAO: ${periodo.Nivel}`, style: 'periodoText' }
        ],
        style: 'tableCellCenter'
      }));
      
      return [
        { text: contadot.toString(), style: 'tableCellCenter' },
        { text: estudiante.strCodigo || '', style: 'tableCellCenter' },
        { text: `${estudiante.strApellidos || ''} ${estudiante.strNombres || ''}`, style: 'tableCellLeft' },
        { text: estudiante.strCedula || '', style: 'tableCellCenter' },
        ...periodoCells
      ];
    });

    // Definir columnas de la tabla
    const tableColumns = [
      { text: '#', style: 'tableHeader' },
      { text: 'CÓDIGO', style: 'tableHeader' },
      { text: 'ESTUDIANTES', style: 'tableHeader' },
      { text: 'CÉDULA', style: 'tableHeader' },
      ...periodoColumns
    ];

    // Calcular widths de columnas
    const columnWidths = ['auto', 'auto', '*', 'auto', ...periodoColumns.map(() => '*')];

    // Contenido principal del PDF
    const content = [
      {
        margin: [0, 0, 0, 15],
        alignment: 'center',
        stack: [
          { text: 'INFORMACIÓN ESTUDIANTES MATRICULADOS', style: 'titleCenter' }
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
          widths: columnWidths,
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
      title: 'REPORTE DE ESTUDIANTES COMPARATIVAS DE MATRICULADOS',
      subtitle: `CARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
      pageMargins: [30, 100, 30, 60],
      pageOrientation: 'landscape'
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
        periodoText: {
          fontSize: 7,
          alignment: 'left',
          margin: [0, 1, 0, 1]
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
// ==================== FUNCIONES AUXILIARES ====================

/**
 * Agrupa las materias por nivel
 */
function agruparPorNivel(listado) {
  const grupos = new Map();

  listado.forEach(materia => {
    const nivel = materia.strCodNivel;
    if (!grupos.has(nivel)) {
      grupos.set(nivel, []);
    }
    grupos.get(nivel).push(materia);
  });

  
  // Convertir a array ordenado por nivel
  return Array.from(grupos.entries())
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([nivel, materias]) => ({
      nivel,
      materias
    }));
}



/**
 * Genera la tabla para un nivel específico
 */
async function generarTablaPorNivel(materias, getValor, formatearFecha) {
  // Definir columnas de la tabla
  const tableColumns = [
    { text: '#', style: 'tableHeader' },
    { text: 'ASIGNATURA', style: 'tableHeader' },
    { text: 'PAO', style: 'tableHeader' },
    { text: 'PARALELO', style: 'tableHeader' },
    { text: 'DOCENTE', style: 'tableHeader' },
    { text: 'FECHA EX. RECUPERACIÓN', style: 'tableHeader' }
  ];

  const tableWidths = ['auto', '*', 'auto', 'auto', '*', 'auto'];

  // Construir cuerpo de la tabla
  const tableBody = materias.map((materia, index) => {
    const contador = index + 1;
    const nombreDocente = `${materia.strApellidos || ''} ${materia.strNombres || ''}`.trim();
    return [
      { text: contador.toString(), style: 'tableCellCenter' },
      { text: getValor(materia.strNombre), style: 'tableCellLeft' },
      { text: getValor(materia.strCodNivel), style: 'tableCellCenter' },
      { text: getValor(materia.strCodParalelo), style: 'tableCellCenter' },
      { text: getValor(nombreDocente, 'SIN ASIGNAR'), style: 'tableCellLeft' },
      { text: formatearFecha(materia.dtFechaExSusp), style: 'tableCellCenter' }
    ];
  });

  return {
    layout: obtenerLayoutTabla(),
    table: {
      headerRows: 1,
      widths: tableWidths,
      body: [tableColumns.map(col => col), ...tableBody]
    },
    margin: [0, 0, 0, 20]
  };
}
async function generarTablaPorNivelAsignaturaMovilidad(materias, getValor) {
  // Definir columnas de la tabla
  const tableColumns = [
    { text: '#', style: 'tableHeader' },
    { text: 'ASIGNATURA', style: 'tableHeader' },
    { text: 'PAO', style: 'tableHeader' },
    { text: 'PARALELO', style: 'tableHeader' },
    { text: 'DOCENTE', style: 'tableHeader' },
    { text: 'TIPO', style: 'tableHeader' },
    { text: 'MOVILIDAD', style: 'tableHeader' }
  ];

  const tableWidths = ['auto', '*', 'auto', 'auto', '*', 'auto','auto'];

  // Construir cuerpo de la tabla
  const tableBody = materias.map((materia, index) => {
    const contador = index + 1;
    const nombreDocente = `${materia.strApellidos || ''} ${materia.strNombres || ''}`.trim();
    return [
      { text: contador.toString(), style: 'tableCellCenter' },
      { text: getValor(materia.strNombre), style: 'tableCellLeft' },
      { text: getValor(materia.strCodNivel), style: 'tableCellCenter' },
      { text: getValor(materia.strCodParalelo), style: 'tableCellCenter' },
      { text: getValor(nombreDocente, 'SIN ASIGNAR'), style: 'tableCellLeft' },
      { text: getValor(materia.tipo), style: 'tableCellCenter' },
      { text: getValor(materia.carreramovilidad), style: 'tableCellCenter' }
    ];
  });

  return {
    layout: obtenerLayoutTabla(),
    table: {
      headerRows: 1,
      widths: tableWidths,
      body: [tableColumns.map(col => col), ...tableBody]
    },
    margin: [0, 0, 0, 20]
  };
}

async function generarContenidoPDF({
  materiasPorNivel,
  periodoInfo,
  datosCarrera,
  getValor,
  formatearFecha
}) {
  const content = [];

  // Encabezado del profesor (común para todo el reporte)
  content.push(crearEncabezadoProfesor(periodoInfo));

  // Generar una tabla por cada nivel
  for (const grupo of materiasPorNivel) {
    // Título del nivel
    content.push({
      text: `PAO: ${grupo.nivel}`,
      style: 'nivelTitle',
      margin: [0, 20, 0, 10]
    });

    // Generar tabla para este nivel
    const tablaNivel = await generarTablaPorNivel(grupo.materias, getValor, formatearFecha);
    content.push(tablaNivel);
  }

  return content;
}
async function generarContenidoPDFAsignaturaMovilidad({
  materiasPorNivel,
  periodoInfo,
  datosCarrera,
  getValor}) {
  const content = [];

  // Encabezado del profesor (común para todo el reporte)
  content.push(crearEncabezadoProfesor(periodoInfo));

  // Generar una tabla por cada nivel
  for (const grupo of materiasPorNivel) {
    // Título del nivel
    content.push({
      text: `PAO: ${grupo.nivel}`,
      style: 'nivelTitle',
      margin: [0, 5, 0, 0]
    });

    // Generar tabla para este nivel
    const tablaNivel = await generarTablaPorNivelAsignaturaMovilidad(grupo.materias, getValor);
    content.push(tablaNivel);
  }

  return content;
}
/**
 * Crea el encabezado con información del profesor y periodo
 */
function crearEncabezadoProfesor( periodoInfo) {
  return {
    margin: [0, 0, 0, 20],
    stack: [
     
      { 
        text: [
          { text: 'PERIODO: ', bold: true ,fontSize: 12, alignment: 'center'},
          { text: `${periodoInfo.descripcion} (${periodoInfo.codigo})` ,fontSize: 12, alignment: 'center'}
        ], 
        style: 'subtituloLeft' 
      }
    ]
  };
}

/**
 * Crea la sección de firma al final del documento
 */
function crearFirmaPDF(nombreCompleto) {
  return {
    margin: [0, 40, 0, 0],
    alignment: 'center',
    stack: [
      { text: '----------------------------------------', style: 'signatureLine' },
      { text: 'GENERADO POR:', style: 'signatureLabel' },
      { text: nombreCompleto, style: 'signatureName' }
    ]
  };
}

/**
 * Configuración del layout de la tabla
 */
function obtenerLayoutTabla() {
  return {
    hLineWidth: () => 1,
    vLineWidth: () => 1,
    hLineColor: () => '#000000',
    vLineColor: () => '#000000',
    paddingLeft: () => 4,
    paddingRight: () => 4,
    paddingTop: () => 4,
    paddingBottom: () => 4
  };
}

/**
 * Estilos del PDF
 */
function obtenerEstilosPDF() {
  return {
    nivelTitle: {
      fontSize: 12,
      bold: true,
      alignment: 'left',
      margin: [0, 15, 0, 5],
      fillColor: '#f0f0f0'
    },
    tableHeader: {
      bold: true,
      fontSize: 9,
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


// ==========================================
// 1. FUNCIONES AUXILIARES REUTILIZABLES
// ==========================================

const Utils = {
  // Manejo de valores nulos
  getValor: (valor, defaultValue = 'SIN REGISTRO') => {
    return valor !== null && valor !== undefined && valor !== '' ? valor : defaultValue;
  },

  // Formateo de fecha UTC
  formatearFechaUTC: (fecha) => {
    if (!fecha) return 'SIN REGISTRO';
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return 'SIN REGISTRO';
    
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },

  // Calcular promedio de un array de números
  calcularPromedio: (valores) => {
    const numeros = valores.filter(v => typeof v === 'number' && !isNaN(v));
    if (numeros.length === 0) return 0;
    const suma = numeros.reduce((acc, val) => acc + val, 0);
    return +(suma / numeros.length).toFixed(2);
  },

  // Formatear nombre completo
  formatearNombreCompleto: (persona) => {
    if (!persona?.listado?.[0]) return 'SIN REGISTRO';
    const { per_nombres, per_primerApellido, per_segundoApellido } = persona.listado[0];
    return `${per_nombres || ''} ${per_primerApellido || ''} ${per_segundoApellido || ''}`.trim();
  },

  // Extraer valores numéricos de un array de materias
  extraerValoresNumericos: (materias) => {
    const parciales1 = [];
    const parciales2 = [];
    const generales = [];
    
    materias.forEach(materia => {
      if (typeof materia.promedioParcial1 === 'number') parciales1.push(materia.promedioParcial1);
      if (typeof materia.promedioParcial2 === 'number') parciales2.push(materia.promedioParcial2);
      if (typeof materia.promedioGeneral === 'number') generales.push(materia.promedioGeneral);
    });
    
    return { parciales1, parciales2, generales };
  }
};

// ==========================================
// 2. FUNCIÓN PRINCIPAL REFACTORIZADA
// ==========================================

async function generarReportePromediosGeneralesAsignaturas(listado, carrera, periodo, cedulaUsuario) {
  try {
    // 1. Obtener datos en paralelo
    const [datosCarrera, datosPeriodo, persona] = await Promise.all([
      procesoCupo.ObtenerDatosBase(carrera),
      procesoCupo.PeriodoDatos(carrera, periodo),
      axios.get(`https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/${cedulaUsuario}`, { httpsAgent: agent })
    ]);

    // 2. Extraer información básica
    const strNombres = Utils.formatearNombreCompleto(persona.data);
    const periodoInfo = {
      descripcion: datosPeriodo.data[0]?.strDescripcion || 'SIN DESCRIPCIÓN',
      codigo: periodo
    };

    // 3. Agrupar materias por nivel
    const materiasPorNivel = agruparPorNivelPromedio(listado);

    // 4. Calcular promedios totales globales
    const valoresGlobales = Utils.extraerValoresNumericos(listado);
    const totalesGlobales = {
      promedioParcial1: Utils.calcularPromedio(valoresGlobales.parciales1),
      promedioParcial2: Utils.calcularPromedio(valoresGlobales.parciales2),
      promedioGeneral: Utils.calcularPromedio(valoresGlobales.generales)
    };

    // 5. Generar contenido del PDF
    const content = await generarContenidoPDFPromedios({
      materiasPorNivel,
      periodoInfo,
      datosCarrera,
      totalesGlobales
    });

    // 6. Configurar y generar PDF
    const layoutOptions = {
      title: 'PROMEDIOS GENERALES POR ASIGNATURA AGRUPADOS POR NIVEL',
      subtitle: `CARRERA: ${datosCarrera.data[0]?.strNombreCarrera || 'SIN CARRERA'}`,
      pageMargins: [40, 120, 40, 70],
        pageOrientation: 'landscape'  // ← Cambiado a horizontal

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

// ==========================================
// 3. AGRUPACIÓN POR NIVEL
// ==========================================

function agruparPorNivelPromedio(listado) {
  const grupos = new Map();

  listado.forEach(materia => {
    const nivel = materia.strCodNivel;
    if (!grupos.has(nivel)) grupos.set(nivel, []);
    grupos.get(nivel).push(materia);
  });

  return Array.from(grupos.entries())
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([nivel, materias]) => ({ nivel, materias }));
}

// ==========================================
// 4. GENERACIÓN DE CONTENIDO DEL PDF
// ==========================================

async function generarContenidoPDFPromedios({ materiasPorNivel, periodoInfo, datosCarrera, totalesGlobales }) {
  const content = [];

  // Encabezado del profesor
  content.push(crearEncabezadoProfesor(periodoInfo));

  // Generar una tabla por cada nivel con sus promedios
  for (const grupo of materiasPorNivel) {
    // Título del nivel
    content.push({
      text: `PAO: ${grupo.nivel}`,
      style: 'nivelTitle',
      margin: [0, 10, 0, 5]
    });

    // Generar tabla para este nivel
    const tablaNivel = await generarTablaPorNivelPromedioGenerales(grupo.materias);
    content.push(tablaNivel);

    // Calcular y agregar promedios de este PAO específico
    const promediosPAO = calcularPromediosPorPAO(grupo.materias, grupo.nivel);
    content.push(crearTablaPromediosPAO(promediosPAO));
  }

  // ==========================================
  // 5. TABLA DE TOTALES GENERALES
  // ==========================================
  
  content.push({
    text: 'TOTALES GENERALES DEL REPORTE',
    style: 'resumenTitle',
    margin: [0, 30, 0, 15],
    alignment: 'center',
    bold: true
  });

  content.push(crearTablaTotalesGenerales(totalesGlobales));

  return content;
}

// ==========================================
// 6. CÁLCULO DE PROMEDIOS POR PAO
// ==========================================

function calcularPromediosPorPAO(materias, nivel) {
  const valores = Utils.extraerValoresNumericos(materias);
  
  return {
    nivel: nivel,
    promedioParcial1: Utils.calcularPromedio(valores.parciales1),
    promedioParcial2: Utils.calcularPromedio(valores.parciales2),
    promedioGeneral: Utils.calcularPromedio(valores.generales),
    totalMaterias: materias.length,
    materiasConDatos: {
      parcial1: valores.parciales1.length,
      parcial2: valores.parciales2.length,
      general: valores.generales.length
    }
  };
}

// ==========================================
// 7. TABLA DE PROMEDIOS POR PAO (para mostrar debajo de cada agrupación)
// ==========================================

function crearTablaPromediosPAO(promediosPAO) {
  // Solo mostrar la tabla si hay al menos un promedio calculado
  if (promediosPAO.promedioParcial1 === 0 && 
      promediosPAO.promedioParcial2 === 0 && 
      promediosPAO.promedioGeneral === 0) {
    return {
      text: 'No hay datos de promedio disponibles para este PAO',
      style: 'sinDatos',
      margin: [0, 5, 0, 5],
      italics: true
    };
  }

  const tableColumns = [
    { text: 'RESUMEN PAO', style: 'tableHeaderResumen', colSpan: 4, alignment: 'center' },
    {}, {}, {}
  ];

  const tableBody = [
    tableColumns.map(col => col),
    [
      { text: 'PROMEDIO PARCIAL 1', style: 'tableCellResumen' },
      { text: 'PROMEDIO PARCIAL 2', style: 'tableCellResumen' },
      { text: 'PROMEDIO GENERAL', style: 'tableCellResumen' },
      { text: 'TOTAL ASIGNATURAS', style: 'tableCellResumen' }
    ],
    [
      { text: promediosPAO.promedioParcial1.toString(), style: 'tableCellResumenValor', bold: true },
      { text: promediosPAO.promedioParcial2.toString(), style: 'tableCellResumenValor', bold: true },
      { text: promediosPAO.promedioGeneral.toString(), style: 'tableCellResumenValor', bold: true },
      { text: promediosPAO.totalMaterias.toString(), style: 'tableCellResumenValor', bold: true }
    ]
  ];

  // Agregar fila informativa de materias con datos
  if (promediosPAO.materiasConDatos.parcial1 < promediosPAO.totalMaterias ||
      promediosPAO.materiasConDatos.parcial2 < promediosPAO.totalMaterias ||
      promediosPAO.materiasConDatos.general < promediosPAO.totalMaterias) {
    tableBody.push([
      { 
        text: `* Datos disponibles: Parcial1 (${promediosPAO.materiasConDatos.parcial1}/${promediosPAO.totalMaterias}), ` +
              `Parcial2 (${promediosPAO.materiasConDatos.parcial2}/${promediosPAO.totalMaterias}), ` +
              `General (${promediosPAO.materiasConDatos.general}/${promediosPAO.totalMaterias})`,
        style: 'tableCellNota',
        colSpan: 4
      },
      {}, {}, {}
    ]);
  }

  return {
    layout: 'lightHorizontalLines',
    table: {
      headerRows: 2,
      widths: ['*', '*', '*', 'auto'],
      body: tableBody
    },
    margin: [0, 5, 0, 5]
  };
}

// ==========================================
// 8. TABLA DE TOTALES GENERALES
// ==========================================

function crearTablaTotalesGenerales(totalesGlobales) {
  const tableColumns = [
    { text: 'TOTALES GLOBALES CARRERAS', style: 'tableHeaderResumen', colSpan: 3, alignment: 'center' },
    {}, {}
  ];

  const tableBody = [
    tableColumns.map(col => col),
    [
      { text: 'PROMEDIO PARCIAL 1', style: 'tableCellResumen' },
      { text: 'PROMEDIO PARCIAL 2', style: 'tableCellResumen' },
      { text: 'PROMEDIO GENERAL', style: 'tableCellResumen' }
    ],
    [
      { text: totalesGlobales.promedioParcial1.toString(), style: 'tableCellResumenValor', bold: true, fontSize: 12 },
      { text: totalesGlobales.promedioParcial2.toString(), style: 'tableCellResumenValor', bold: true, fontSize: 12 },
      { text: totalesGlobales.promedioGeneral.toString(), style: 'tableCellResumenValor', bold: true, fontSize: 12 }
    ]
  ];

  return {
    layout: 'lightHorizontalLines',
    table: {
      headerRows: 2,
      widths: ['*', '*', '*'],
      body: tableBody
    },
    margin: [0, 5, 0, 20]
  };
}

// ==========================================
// 9. GENERACIÓN DE TABLA POR NIVEL (DETALLE DE MATERIAS)
// ==========================================

async function generarTablaPorNivelPromedioGenerales(materias) {
  const tableColumns = [
    { text: '#', style: 'tableHeader' },
    { text: 'ASIGNATURAS', style: 'tableHeader' },
    { text: 'PAO', style: 'tableHeader' },
    { text: 'PARALELO', style: 'tableHeader' },
    { text: 'DOCENTES', style: 'tableHeader' },
    { text: 'PARCIAL_1', style: 'tableHeader' },
    { text: 'PARCIAL_2', style: 'tableHeader' },
    { text: 'PROMEDIO', style: 'tableHeader' }
  ];

  const tableWidths = ['auto', '*', 'auto', 'auto', '*', 'auto', 'auto', 'auto'];

  const tableBody = materias.map((materia, index) => {
    const contador = index + 1;
    const nombreDocente = `${materia.strApellidos || ''} ${materia.strNombres || ''}`.trim();
    
    return [
      { text: contador.toString(), style: 'tableCellCenter' },
      { text: Utils.getValor(materia.strNombre), style: 'tableCellLeft' },
      { text: Utils.getValor(materia.strCodNivel), style: 'tableCellCenter' },
      { text: Utils.getValor(materia.strCodParalelo), style: 'tableCellCenter' },
      { text: Utils.getValor(nombreDocente, 'SIN ASIGNAR'), style: 'tableCellLeft' },
      { text: Utils.getValor(materia.promedioParcial1), style: 'tableCellCenter' },
      { text: Utils.getValor(materia.promedioParcial2), style: 'tableCellCenter' },
      { text: Utils.getValor(materia.promedioGeneral), style: 'tableCellCenter' }
    ];
  });

  return {
    layout: obtenerLayoutTabla(),
    table: {
      headerRows: 1,
      widths: tableWidths,
      body: [tableColumns.map(col => col), ...tableBody]
    },
    margin: [0, 0, 0, 10]
  };
}

async function generarReporteRetiros(listado, carrera, periodo, cedulaUsuario) {
  try {
    const datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    const datosPeriodo = await procesoCupo.PeriodoDatos(carrera, periodo);
    const ObtenerPersona = await axios.get(`https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/${cedulaUsuario}`, { httpsAgent: agent });
    const strNombres = `${ObtenerPersona.data.listado[0].per_nombres} ${ObtenerPersona.data.listado[0].per_primerApellido} ${ObtenerPersona.data.listado[0].per_segundoApellido}`;
    
    const getValor = (valor, defaultValue = 'SIN REGISTRO') => {
      return valor !== null && valor !== undefined && valor !== '' ? valor : defaultValue;
    };

    const tableBody = listado.map((asignaturas, index) => {
      const contadot = index + 1;
      return [
        { text: contadot.toString(), style: 'tableCellCenter' },
        { text: getValor(asignaturas.strCodEstud), style: 'tableCellCenter' },
        { text: getValor(asignaturas.strCedula), style: 'tableCellCenter' },
        { text: `${asignaturas.strApellidos} ${asignaturas.strNombres}`, style: 'tableCellLeft' },
        { text: getValor(asignaturas.strtipo), style: 'tableCellCenter' },
        { text: getValor(asignaturas.strnombreTipo), style: 'tableCellCenter' }
      ];
    });

    const tableColumns = [
      { text: '#', style: 'tableHeader' },
      { text: 'MATRÍCULA', style: 'tableHeader' },
      { text: 'CÉDULA', style: 'tableHeader' },
      { text: 'ESTUDIANTE', style: 'tableHeader' },
      { text: 'RETIRO', style: 'tableHeader' },
      { text: 'TIPO RETIRO', style: 'tableHeader' }
    ];

    const tableWidths = ['auto', 'auto', 'auto', '*', 'auto', 'auto'];

    const content = [
      {
        text: 'LISTADO DE ESTUDIANTES RETIRADOS',
        style: 'tableTitle',
        alignment: 'center',
        margin: [0, 10, 0, 5]
      },
      {
        text: `PERIODO: ${datosPeriodo.data[0].strDescripcion} (${periodo})`,
        style: 'tableTitle',
        alignment: 'center',
        margin: [0, 0, 0, 10]
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
            [ { text: 'INFORMACIÓN', colSpan: 6, style: 'tableHeaderCenter' }, {}, {}, {}, {}, {} ],
            tableColumns.map(col => col)
          ].concat(tableBody)
        }
      },
      {
        margin: [0, 50, 0, 0],
        alignment: 'center',
        stack: [
          { text: '----------------------------------------', style: 'signatureLine' },
          { text: 'GENERADO POR:', style: 'signatureName' },
          { text: strNombres, style: 'signatureName' }
        ]
      }
    ];

    const layoutOptions = {
      title: 'LISTADO DE ESTUDIANTES RETIRADOS',
      subtitle: `CARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
      pageMargins: [40, 120, 40, 70],
      pageOrientation: 'portrait'
    };

    const baseLayout = createBaseLayout(layoutOptions);

    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
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
        tableHeaderCenter: {
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

    const base64PDF = await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
    return base64PDF;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function ProcesoPdfListadoDocumentosCarreras(listado, cedula, periodo) {
  try {
    const ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
    const strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido;
    const periodoinfo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);

    const tableBody = listado.map((carreras, index) => [
      { text: (index + 1).toString(), style: 'tableCellCenter' },
      { text: carreras.Carrera, style: 'tableCellLeft' },
      { text: carreras.CantidadPendientes.toString(), style: 'tableCellCenter' },
      { text: carreras.CantidadFirmadas.toString(), style: 'tableCellCenter' }
    ]);

    const content = [
      {
        margin: [0, 0, 0, 15],
        alignment: 'center',
        stack: [
          { text: 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO', style: 'subtitleCenter' },
          { text: 'INFORMACIÓN DE DOCUMENTOS LEGALIZADOS MATRICULAS', style: 'subtitleCenter' },
          { text: `PERIODO: ${periodoinfo.data[0].strDescripcion}`, style: 'subtitleCenter' }
        ]
      },
      {
        layout: {
          hLineWidth: () => 1, vLineWidth: () => 1,
          hLineColor: () => '#000000', vLineColor: () => '#000000',
          paddingLeft: () => 4, paddingRight: () => 4,
          paddingTop: () => 4, paddingBottom: () => 4
        },
        table: {
          headerRows: 2,
          widths: ['auto', '*', 'auto', 'auto'],
          body: [
            [{ text: 'INFORMACIÓN', colSpan: 4, style: 'tableHeaderCenter' }, {}, {}, {}],
            [
              { text: 'N°', style: 'tableHeader' },
              { text: 'CARRERA', style: 'tableHeader' },
              { text: 'DOC. PEDIENTES', style: 'tableHeader' },
              { text: 'DOC. FIRMADOS', style: 'tableHeader' }
            ],
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
      title: 'DOCUMENTOS MATRICULAS',
      subtitle: '',
      pageMargins: [40, 80, 40, 60],
      pageOrientation: 'portrait'
    };

    const baseLayout = createBaseLayout(layoutOptions);
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        subtitleCenter: { fontSize: 11, bold: true, alignment: 'center', margin: [0, 0, 0, 5] },
        tableHeader: { bold: true, fontSize: 10, alignment: 'center', fillColor: '#eeeeee' },
        tableHeaderCenter: { bold: true, fontSize: 10, alignment: 'center', fillColor: '#eeeeee' },
        tableCellCenter: { fontSize: 10, alignment: 'center' },
        tableCellLeft: { fontSize: 10, alignment: 'left' },
        signatureLine: { fontSize: 10, margin: [0, 0, 0, 5] },
        signatureLabel: { fontSize: 9, margin: [0, 5, 0, 2] },
        signatureName: { fontSize: 9, bold: true, margin: [0, 2, 0, 0] }
      }
    };
    return await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}

async function ProcesoPdfTerceraSegundaMatriculaCarrera(listado, carrera, cedula, periodo, tipo) {
  try {
    const ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
    const datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    const strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido;
    const periodoinfo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);

    let titulo = '';
    if (tipo == 3) titulo = 'ESTUDIANTES CON TERCERAS MATRÍCULAS';
    if (tipo == 2) titulo = 'ESTUDIANTES CON SEGUNDAS MATRÍCULAS';

    const tableBody = listado.map((carreras, index) => [
      { text: (index + 1).toString(), style: 'tableCellCenter' },
      { text: `${carreras.strApellidos}   ${carreras.strNombres}`, style: 'tableCellLeft' },
      { text: carreras.strCedula, style: 'tableCellLeft' },
      { text: carreras.strCodNivel, style: 'tableCellCenter' },
      { text: carreras.CantidadMaterias.toString(), style: 'tableCellCenter' }
    ]);

    const content = [
      {
        margin: [0, 0, 0, 15],
        alignment: 'center',
        stack: [
          { text: titulo, style: 'subtitleCenter' },
          { text: `PERIODO:   ${periodoinfo.data[0].strDescripcion}`, style: 'subtitleCenter' }
        ]
      },
      {
        layout: {
          hLineWidth: () => 1, vLineWidth: () => 1,
          hLineColor: () => '#000000', vLineColor: () => '#000000',
          paddingLeft: () => 4, paddingRight: () => 4,
          paddingTop: () => 4, paddingBottom: () => 4
        },
        table: {
          headerRows: 2,
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
          body: [
            [{ text: 'INFORMACIÓN.', colSpan: 5, style: 'tableHeaderCenter' }, {}, {}, {}, {}],
            [
              { text: 'N°', style: 'tableHeader' },
              { text: 'ESTUDIANTES', style: 'tableHeader' },
              { text: 'CÉDULA', style: 'tableHeader' },
              { text: 'NIVEL', style: 'tableHeader' },
              { text: 'CANTIDAD ASIGNATURAS', style: 'tableHeader' }
            ],
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
      title: 'INFORMACIÓN MATRÍCULAS',
      subtitle: `CARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
      pageMargins: [40, 80, 40, 60],
      pageOrientation: 'portrait'
    };

    const baseLayout = createBaseLayout(layoutOptions);
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        subtitleCenter: { fontSize: 11, bold: true, alignment: 'center', margin: [0, 0, 0, 5] },
        tableHeader: { bold: true, fontSize: 10, alignment: 'center', fillColor: '#eeeeee' },
        tableHeaderCenter: { bold: true, fontSize: 10, alignment: 'center', fillColor: '#eeeeee' },
        tableCellCenter: { fontSize: 10, alignment: 'center' },
        tableCellLeft: { fontSize: 10, alignment: 'left' },
        signatureLine: { fontSize: 10, margin: [0, 0, 0, 5] },
        signatureLabel: { fontSize: 9, margin: [0, 5, 0, 2] },
        signatureName: { fontSize: 9, bold: true, margin: [0, 2, 0, 0] }
      }
    };
    return await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}

async function ProcesoPdfTerceraSegundaMatriculaCarreraGeneral(listado, carrera, cedula, periodo) {
  try {
    const ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
    const datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    const strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido;
    const periodoinfo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);

    const tableBody = listado.map((carreras, index) => [
      { text: (index + 1).toString(), style: 'tableCellCenter' },
      { text: `${carreras.strApellidos}   ${carreras.strNombres}`, style: 'tableCellLeft' },
      { text: carreras.strCedula, style: 'tableCellLeft' },
      { text: carreras.strCodNivel, style: 'tableCellCenter' },
      { text: carreras.cantidadprimera.toString(), style: 'tableCellCenter' },
      { text: carreras.cantidadsegunda.toString(), style: 'tableCellCenter' },
      { text: carreras.cantidadtercera.toString(), style: 'tableCellCenter' },
      { text: carreras.cantidadtotal.toString(), style: 'tableCellCenter' }
    ]);

    const content = [
      {
        margin: [0, 0, 0, 15],
        alignment: 'center',
        stack: [
          { text: 'LISTADO DE ESTUDIANTE ASIGNATURAS CON MATRÍCULAS', style: 'subtitleCenter' },
          { text: `PERIODO:   ${periodoinfo.data[0].strDescripcion}`, style: 'subtitleCenter' }
        ]
      },
      {
        layout: {
          hLineWidth: () => 1, vLineWidth: () => 1,
          hLineColor: () => '#000000', vLineColor: () => '#000000',
          paddingLeft: () => 4, paddingRight: () => 4,
          paddingTop: () => 4, paddingBottom: () => 4
        },
        table: {
          headerRows: 2,
          widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: [
            [{ text: 'INFORMACIÓN MATRÍCULAS ASIGNATURAS.', colSpan: 8, style: 'tableHeaderCenter' }, ...Array(7).fill({})],
            [
              { text: 'N°', style: 'tableHeader' },
              { text: 'ESTUDIANTES', style: 'tableHeader' },
              { text: 'CÉDULA_IDENTIDAD', style: 'tableHeader' },
              { text: 'NIVEL', style: 'tableHeader' },
              { text: '1RA', style: 'tableHeader' },
              { text: '2DA', style: 'tableHeader' },
              { text: '3RA', style: 'tableHeader' },
              { text: 'TOTAL', style: 'tableHeader' }
            ],
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
      title: 'INFORMACIÓN MATRÍCULAS',
      subtitle: `CARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
      pageMargins: [40, 80, 40, 60],
      pageOrientation: 'portrait'
    };

    const baseLayout = createBaseLayout(layoutOptions);
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        subtitleCenter: { fontSize: 11, bold: true, alignment: 'center', margin: [0, 0, 0, 5] },
        tableHeader: { bold: true, fontSize: 9, alignment: 'center', fillColor: '#eeeeee' },
        tableHeaderCenter: { bold: true, fontSize: 9, alignment: 'center', fillColor: '#eeeeee' },
        tableCellCenter: { fontSize: 9, alignment: 'center' },
        tableCellLeft: { fontSize: 9, alignment: 'left' },
        signatureLine: { fontSize: 10, margin: [0, 0, 0, 5] },
        signatureLabel: { fontSize: 9, margin: [0, 5, 0, 2] },
        signatureName: { fontSize: 9, bold: true, margin: [0, 2, 0, 0] }
      }
    };
    return await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}

async function ProcesoPdfMatriculasEstadosNivelParalelo(listado, carrera, cedula, periodo) {
  try {
    const ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
    const datosCarrera = await procesoCupo.ObtenerDatosBase(carrera);
    const strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido;
    const periodoinfo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);

    const content = [
      {
        margin: [0, 0, 0, 15],
        alignment: 'center',
        stack: [
          { text: `PERIODO: ${periodoinfo.data[0].strDescripcion}`, style: 'subtitleCenter' }
        ]
      }
    ];

    listado.forEach(datoslistado => {
      content.push({
        margin: [0, 10, 0, 5],
        stack: [
          { text: `ASIGNATURA: ${datoslistado.strNombre}`, style: 'tableCellLeft' },
          { text: `CODIGO: ${datoslistado.strCodMateria}`, style: 'tableCellLeft' }
        ]
      });

      const tableBody = datoslistado.listadoparalelos.map((paralelodatos, index) => [
        { text: (index + 1).toString(), style: 'tableCellCenter' },
        { text: paralelodatos.strCodNivel, style: 'tableCellCenter' },
        { text: paralelodatos.strCodParalelo, style: 'tableCellCenter' },
        { text: paralelodatos.cantidadtotal?.toString() || '0', style: 'tableCellCenter' },
        { text: paralelodatos.cantidaddef?.toString() || '0', style: 'tableCellCenter' },
        { text: paralelodatos.cantidadpen?.toString() || '0', style: 'tableCellCenter' },
        { text: paralelodatos.cantidadsol?.toString() || '0', style: 'tableCellCenter' },
        { text: paralelodatos.cantidadpre?.toString() || '0', style: 'tableCellCenter' },
        { text: paralelodatos.cantidaddefva?.toString() || '0', style: 'tableCellCenter' },
        { text: paralelodatos.cantidadpenva?.toString() || '0', style: 'tableCellCenter' },
        { text: paralelodatos.cantidadsolva?.toString() || '0', style: 'tableCellCenter' },
        { text: paralelodatos.cantidadpreva?.toString() || '0', style: 'tableCellCenter' },
        { text: paralelodatos.docente || '', style: 'tableCellCenterDocente' }
      ]);

      content.push({
        layout: {
          hLineWidth: () => 1, vLineWidth: () => 1,
          hLineColor: () => '#000000', vLineColor: () => '#000000',
          paddingLeft: () => 2, paddingRight: () => 2,
          paddingTop: () => 2, paddingBottom: () => 2
        },
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
          body: [
            [
              { text: 'N°', style: 'tableHeader' },
              { text: 'PAO', style: 'tableHeader' },
              { text: 'PARALELO', style: 'tableHeader' },
              { text: 'MATRICULAS', style: 'tableHeader' },
              { text: 'DEFINITIVA', style: 'tableHeader' },
              { text: 'PENDIENTE', style: 'tableHeader' },
              { text: 'SOLICITADA', style: 'tableHeader' },
              { text: 'PRESOL', style: 'tableHeader' },
              { text: 'VA_DEF', style: 'tableHeader' },
              { text: 'VA_PEN', style: 'tableHeader' },
              { text: 'VA_SOL', style: 'tableHeader' },
              { text: 'VA_PRE', style: 'tableHeader' },
              { text: 'DOCENTES_NOMBRES', style: 'tableHeader' }
            ],
            ...tableBody
          ]
        }
      });
    });

    content.push({
      margin: [0, 40, 0, 0],
      alignment: 'center',
      stack: [
        { text: '----------------------------------------', style: 'signatureLine' },
        { text: 'GENERADO POR:', style: 'signatureLabel' },
        { text: strNombres, style: 'signatureName' }
      ]
    });

    const layoutOptions = {
      title: 'LISTADO DE ASIGNATURAS POR CARRERAS INFORMACIÓN MATRÍCULAS',
      subtitle: `CARRERA: ${datosCarrera.data[0].strNombreCarrera}`,
      pageMargins: [30, 80, 30, 60],
      pageOrientation: 'landscape'
    };

    const baseLayout = createBaseLayout(layoutOptions);
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        subtitleCenter: { fontSize: 10, bold: true, alignment: 'center', margin: [0, 0, 0, 5] },
        tableHeader: { bold: true, fontSize: 7, alignment: 'center', fillColor: '#eeeeee' },
        tableCellCenter: { fontSize: 8, alignment: 'center' },
        tableCellCenterDocente: { fontSize: 7, alignment: 'center' },
        tableCellLeft: { fontSize: 9, alignment: 'left', bold: true },
        signatureLine: { fontSize: 10, margin: [0, 0, 0, 5] },
        signatureLabel: { fontSize: 9, margin: [0, 5, 0, 2] },
        signatureName: { fontSize: 9, bold: true, margin: [0, 2, 0, 0] }
      }
    };
    return await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}

async function ProcesoPdfListadoEstudiantesCuposEstados(listado, cedula, periodo, estado) {
  try {
    const ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + cedula, { httpsAgent: agent });
    const strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido;
    const periodoinfo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);

    const tableBody = listado.map((carreras, index) => [
      { text: (index + 1).toString(), style: 'tableCellCenter' },
      { text: carreras.identificacion, style: 'tableCellLeft' },
      { text: `${carreras.Estudiante.strNombres}   ${carreras.Estudiante.strApellidos}`, style: 'tableCellLeft' },
      { text: carreras.Carrera.strNombreCarrera, style: 'tableCellLeft' },
      { text: carreras.dcupobservacion, style: 'tableCellCenter' },
      { text: carreras.Estado.estnombre, style: 'tableCellCenter' }
    ]);

    const content = [
      {
        margin: [0, 0, 0, 15],
        alignment: 'center',
        stack: [
          { text: 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO', style: 'subtitleCenter' },
          { text: 'INFORMACIÓN ESTUDIANTE CUPOS', style: 'subtitleCenter' },
          { text: `ESTADO CUPO ACADÉMICO: ${estado.estnombre}`, style: 'subtitleCenter' },
          { text: `PERIODO: ${periodoinfo.data[0].strDescripcion}`, style: 'subtitleCenter' }
        ]
      },
      {
        layout: {
          hLineWidth: () => 1, vLineWidth: () => 1,
          hLineColor: () => '#000000', vLineColor: () => '#000000',
          paddingLeft: () => 4, paddingRight: () => 4,
          paddingTop: () => 4, paddingBottom: () => 4
        },
        table: {
          headerRows: 2,
          widths: ['auto', 'auto', '*', '*', 'auto', 'auto'],
          body: [
            [{ text: 'INFORMACIÓN.', colSpan: 6, style: 'tableHeaderCenter' }, ...Array(5).fill({})],
            [
              { text: 'N°', style: 'tableHeader' },
              { text: 'CEDULA EST.', style: 'tableHeader' },
              { text: 'NOMBRES Y APELLIDOS', style: 'tableHeader' },
              { text: 'CARRERA', style: 'tableHeader' },
              { text: 'DESCRIPCIÓN', style: 'tableHeader' },
              { text: 'CUPO', style: 'tableHeader' }
            ],
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
      title: 'INFORMACIÓN ESTUDIANTE CUPOS',
      subtitle: '',
      pageMargins: [40, 80, 40, 60],
      pageOrientation: 'portrait'
    };

    const baseLayout = createBaseLayout(layoutOptions);
    const docDefinition = {
      ...baseLayout,
      content: content,
      styles: {
        ...baseLayout.styles,
        subtitleCenter: { fontSize: 9, bold: true, alignment: 'center', margin: [0, 0, 0, 5] },
        tableHeader: { bold: true, fontSize: 8, alignment: 'center', fillColor: '#eeeeee' },
        tableHeaderCenter: { bold: true, fontSize: 8, alignment: 'center', fillColor: '#eeeeee' },
        tableCellCenter: { fontSize: 8, alignment: 'center' },
        tableCellLeft: { fontSize: 8, alignment: 'left' },
        signatureLine: { fontSize: 9, margin: [0, 0, 0, 5] },
        signatureLabel: { fontSize: 9, margin: [0, 5, 0, 2] },
        signatureName: { fontSize: 9, bold: true, margin: [0, 2, 0, 0] }
      }
    };
    return await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}

async function generarCertificadoAsignatura(datos) {
  try {
    const defaultFonts = {
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };

    const layoutOptions = {
      title: '',
      subtitle: '',
      pageMargins: [60, 80, 60, 80],
      pageOrientation: 'landscape',
      background: function (currentPage, pageSize) {
        return {
          canvas: [
            {
              type: 'rect',
              x: 20,
              y: 20,
              w: pageSize.width - 40,
              h: pageSize.height - 40,
              lineWidth: 4,
              lineColor: '#c0392b'
            },
            {
              type: 'rect',
              x: 25,
              y: 25,
              w: pageSize.width - 50,
              h: pageSize.height - 50,
              lineWidth: 1,
              lineColor: '#c0392b'
            },
            {
              type: 'rect',
              x: 35,
              y: 15,
              w: 100,
              h: 15,
              color: 'white'
            }
          ]
        };
      }
    };

    const baseLayout = createBaseLayout(layoutOptions);

    const docDefinition = {
      ...baseLayout,
      content: [
        {
          text: 'Certificado de Mérito Académico',
          style: 'titulo'
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 210, y1: 0,
              x2: 510, y2: 0,
              lineWidth: 2,
              lineColor: '#c0392b'
            }
          ],
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Por la mejor calificación obtenida en la asignatura',
          style: 'subtitulo'
        },
        {
          text: [
            'La ',
            { text: datos.institucion || '[NOMBRE DE LA INSTITUCIÓN]', bold: true, color: '#000000' },
            ' hace constar que el/la estudiante ',
            { text: datos.estudianteNombres || '[NOMBRES Y APELLIDOS]', bold: true, color: '#000000' },
            ', con identificación ',
            { text: datos.estudianteCedula || '[N° CÉDULA/PASAPORTE]', bold: true, color: '#000000' },
            ', de la carrera  ',
            { text: datos.programaNombre || '[NOMBRE DEL PROGRAMA]', bold: true, color: '#000000' },
            ', durante el período académico ',
            { text: datos.periodoAcademico || '[PERÍODO ACADÉMICO]', bold: true, color: '#000000' },
            ', cursó la asignatura ',
            { text: datos.asignaturaNombre || 'MATEMÁTICA II', bold: true, color: '#000000' },
            '.',
          ],
          style: 'cuerpo'
        },
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: [
                    'OBTUVO LA CALIFICACIÓN MÁS ALTA DEL PERÍODO: ',
                    { 
                      text: datos.calificacion != null && !isNaN(parseFloat(datos.calificacion)) 
                              ? parseFloat(datos.calificacion).toFixed(2) 
                              : (datos.calificacion || '[CALIFICACIÓN / 10]').toString() , 
                      color: '#000000' 
                    }, 
                        { 
                      text: datos.tipocalificacion,
                      color: '#000000' 
                    }
                  ],
                  style: 'destacado',
                  margin: [0, 8, 0, 8]
                }
              ]
            ]
          },
          layout: {
            defaultBorder: false,
            hLineWidth: function (i, node) { return 1; },
            vLineWidth: function (i, node) { return 1; },
            hLineColor: function (i, node) { return '#000000'; },
            vLineColor: function (i, node) { return '#000000'; },
            hLineStyle: function (i, node) { return {dash: {length: 4, space: 4}}; },
            vLineStyle: function (i, node) { return {dash: {length: 4, space: 4}}; },
            fillColor: function (i, node) { return '#fdf0e0'; }
          },
          margin: [40, 15, 40, 15]
        },
        {
          text: [
            'Por su desempeño sobresaliente, dedicación y dominio de los contenidos, se le otorga el presente reconocimiento como ',
            { text: 'MEJOR ESTUDIANTE', bold: true, color: '#000000' },
            ' de la asignatura en el período señalado.'
          ],
          style: 'cuerpo',
          margin: [0, 0, 0, 25]
        },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 250,
              stack: [
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 0, y1: 0,
                      x2: 250, y2: 0,
                      lineWidth: 1,
                      lineColor: '#2c3e50'
                    }
                  ],
                  margin: [0, 0, 0, 5]
                },
                { text: 'Firma del Coordinador/a Carrera', alignment: 'center', fontSize: 13 }
              ]
            },
            { width: '*', text: '' }
          ],
          margin: [0, 25, 0, 15]
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 720, y2: 0,
              lineWidth: 1,
              lineColor: '#cccccc'
            }
          ],
          alignment: 'center',
          margin: [0, 10, 0, 10]
        },
        {
          text: '* Documento válido para fines académicos y de presentación personal.',
          style: 'nota'
        }
      ],
      styles: {
        ...baseLayout.styles,
        titulo: {
          fontSize: 28,
          bold: true,
          alignment: 'center',
          color: '#1a1a2e',
          characterSpacing: 3,
          margin: [0, 0, 0, 10]
        },
        subtitulo: {
          fontSize: 16,
          alignment: 'center',
          color: '#2c3e50',
          margin: [0, 0, 0, 20]
        },
        cuerpo: {
          fontSize: 17,
          lineHeight: 1.5,
          alignment: 'justify',
          margin: [0, 10, 0, 10]
        },
        destacado: {
          fontSize: 20,
          bold: true,
          alignment: 'center',
          color: '#1a1a2e',
        },
        pie: {
          fontSize: 13,
          alignment: 'center',
          color: '#555555',
          margin: [0, 0, 0, 5]
        },
        nota: {
          fontSize: 11,
          alignment: 'center',
          color: '#888888',
          italics: true
        }
      }
    };

    return await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}

async function generarCertificadoCalificacionesPeriodo(datos) {
  try {
    const defaultFonts = {
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };

    const layoutOptions = {
      title: '',
      subtitle: '',
      pageMargins: [60, 80, 60, 80],
      pageOrientation: 'portrait',
      background: function (currentPage, pageSize) {
        return {
          canvas: [
            {
              type: 'rect',
              x: 20,
              y: 20,
              w: pageSize.width - 40,
              h: pageSize.height - 40,
              lineWidth: 4,
              lineColor: '#c0392b'
            },
            {
              type: 'rect',
              x: 25,
              y: 25,
              w: pageSize.width - 50,
              h: pageSize.height - 50,
              lineWidth: 1,
              lineColor: '#c0392b'
            },
            {
              type: 'rect',
              x: 35,
              y: 15,
              w: 100,
              h: 15,
              color: 'white'
            }
          ]
        };
      }
    };

    const baseLayout = createBaseLayout(layoutOptions);

    const docDefinition = {
      ...baseLayout,
      content: [
        {
          text: 'Certificado de Calificaciones',
          style: 'titulo',
          margin: [0, 60, 0, 10]
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 210, y1: 0,
              x2: 510, y2: 0,
              lineWidth: 2,
              lineColor: '#c0392b'
            }
          ],
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Correspondiente al período académico',
          style: 'subtitulo'
        },
        {
          text: [
            'La ',
            { text: datos.institucion || 'ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO', bold: true, color: '#000000' },
            ' hace constar que el/ la estudiante ',
            { text: datos.estudianteNombres || '[NOMBRES Y APELLIDOS]', bold: true, color: '#000000' },
            ', con identificación ',
            { text: datos.estudianteCedula || '[N° CÉDULA/PASAPORTE]', bold: true, color: '#000000' },
            ', de la carrera ',
            { text: datos.programaNombre || '[NOMBRE DEL PROGRAMA]', bold: true, color: '#000000' },
            ', durante el período académico ',
            { text: datos.periodoAcademico || '[PERÍODO ACADÉMICO]', bold: true, color: '#000000' },
            ', obtuvo las siguientes calificaciones ', { text: datos.tipocalificacion},' :',
          ],
          style: 'cuerpo',
          margin: [0, 20, 0, 15]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*','auto','auto','auto'],
            body: [
              [
                { text: 'N°', style: 'tableHeaderList' },
                { text: 'CÓDIGO', style: 'tableHeaderList' },
                { text: 'ASIGNATURA', style: 'tableHeaderList' },
                { text: 'MATRÍCULA', style: 'tableHeaderList' },
                { text: 'PAO', style: 'tableHeaderList' },
                { text: 'CALIFICACIÓN', style: 'tableHeaderList' }
              ],
              ...(datos.asignaturas || []).map((asig, index) => [
                { text: (index + 1).toString(), style: 'tableCellCenterList' },
                { text: asig.codigo || '', style: 'tableCellCenterList' },
                { text: asig.nombre || '', style: 'tableCellLeftList' },
                { text: asig.numeromatricula || '', style: 'tableCellCenterList' },
                { text: asig.nivel || '', style: 'tableCellCenterList' },
                { 
                  text: asig.calificacion != null && !isNaN(parseFloat(asig.calificacion)) 
                          ? parseFloat(asig.calificacion).toFixed(2) 
                          : (asig.calificacion || '').toString(), 
                  style: 'tableCellCenterList' 
                }
              ])
            ]
          },
          layout: {
            hLineWidth: function (i, node) { return 1; },
            vLineWidth: function (i, node) { return 1; },
            hLineColor: function (i, node) { return '#e0e0e0'; },
            vLineColor: function (i, node) { return '#e0e0e0'; }
          },
          margin: [40, 5, 40, 20]
        },
        {
          text: 'Se expide el presente certificado a petición de la parte interesada para los fines que estime convenientes.',
          style: 'cuerpo',
          margin: [0, 20, 0, 25]
        },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 250,
              stack: [
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 0, y1: 0,
                      x2: 250, y2: 0,
                      lineWidth: 1,
                      lineColor: '#2c3e50'
                    }
                  ],
                  margin: [0, 0, 0, 5]
                },
                { text: 'Firma del Coordinador/a de Carrera', alignment: 'center', fontSize: 13 ,    margin: [0, 10, 0, 0]}
              ]
            },
            { width: '*', text: '' }
          ],
          margin: [0, 60, 0, 15]
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 520, y2: 0,
              lineWidth: 1,
              lineColor: '#cccccc'
            }
          ],
          alignment: 'center',
          margin: [0, 30, 0, 10]
        },
        {
          text: '* Documento válido para fines académicos y de presentación personal.',
          style: 'nota', 
        }
      ],
      styles: {
        ...baseLayout.styles,
        titulo: {
          fontSize: 20,
          bold: true,
          alignment: 'center',
          color: '#1a1a2e',
          characterSpacing: 3,
          margin: [0, 0, 0, 10]
        },
        subtitulo: {
          fontSize: 14,
          alignment: 'center',
          color: '#2c3e50',
          margin: [0, 0, 0, 20]
        },
        cuerpo: {
          fontSize: 12,
          lineHeight: 1.5,
          alignment: 'justify',
          margin: [0, 10, 0, 10]
        },
        tableHeaderList: {
          bold: true,
          fontSize: 11,
          alignment: 'center',
          color: '#ffffff',
          fillColor: '#a09f9f',
          margin: [0, 5, 0, 5]
        },
        tableCellCenterList: {
          fontSize: 9,
          alignment: 'center',
          margin: [0, 3, 0, 3]
        },
        tableCellLeftList: {
          fontSize: 9,
          alignment: 'left',
          margin: [0, 3, 0, 3]
        },
        pie: {
          fontSize: 12,
          alignment: 'center',
          color: '#555555',
          margin: [0, 0, 0, 5]
        },
        nota: {
          fontSize: 10,
          alignment: 'center',
          color: '#888888',
          italics: true
        }
      }
    };

    return await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}

async function generarMallaCarrera(datos) {
  try {
    let niveles = datos.niveles || [];
    
    // Adapt flat list into grouped niveles if provided
    if (datos.listado && datos.listado.length > 0) {
      const nivelesMap = {};
      datos.listado.forEach(item => {
        const nivelStr = item.strCodNivel || '0';
        if (!nivelesMap[nivelStr]) {
          nivelesMap[nivelStr] = {
            nivel: nivelStr,
            nivelNombre: `PAO ${nivelStr}`,
            asignaturas: [],
            totales: {
              contactoDocente: 0,
              practicoExp: 0,
              autonomo: 0,
              totalHoras: 0,
              creditos: 0,
              horasClase: 0
            }
          };
        }
        
        const hTeo = parseFloat(item.bytHorasTeo) || 0;
        const hPrac = parseFloat(item.bytHorasPrac) || 0;
        const hAut = parseFloat(item.bytHorasAut) || 0;
        const tHoras = hTeo + hPrac + hAut;
        const cred = parseFloat(item.fltCreditos) || 0;
        const hSem = parseFloat(item.bytHorasSeman) || 0;

        nivelesMap[nivelStr].asignaturas.push({
          codigo: item.strCodMateriaPensum || '',
          asignatura: item.strNombreMateria || '',
          contactoDocente: hTeo || '',
          practicoExp: hPrac || '',
          autonomo: hAut || '',
          totalHoras: tHoras || '',
          requisitos: item.strPrerrequisitosCodigos || '',
          creditos: cred,
          horasClase: hSem || ''
        });

        nivelesMap[nivelStr].totales.contactoDocente += hTeo;
        nivelesMap[nivelStr].totales.practicoExp += hPrac;
        nivelesMap[nivelStr].totales.autonomo += hAut;
        nivelesMap[nivelStr].totales.totalHoras += tHoras;
        nivelesMap[nivelStr].totales.creditos += cred;
        nivelesMap[nivelStr].totales.horasClase += hSem;
      });

      niveles = Object.values(nivelesMap).sort((a, b) => parseInt(a.nivel) - parseInt(b.nivel));
      niveles.forEach(n => {
        n.asignaturas.forEach((asig, index) => {
          asig.num = index + 1;
        });
      });
    }

    const defaultFonts = {
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };

    const layoutOptions = {
      title: '',
      subtitle: '',
      pageMargins: [40, 80, 40, 60],
      pageOrientation: 'landscape'
    };

    const baseLayout = createBaseLayout(layoutOptions);

    const tableBody = [
      [
        { text: 'NUM.', rowSpan: 3, style: 'tableHeaderMalla' },
        { text: 'CÓDIGO', rowSpan: 3, style: 'tableHeaderMalla' },
        { text: 'ASIGNATURA', rowSpan: 3, style: 'tableHeaderMalla' },
        { text: 'COMPONENTES DE APRENDIZAJE (HORAS/PAO)', colSpan: 3, style: 'tableHeaderMalla' },
        {},
        {},
        { text: 'TOTAL HORAS', rowSpan: 3, style: 'tableHeaderMalla' },
        { text: 'REQUISITOS', rowSpan: 3, style: 'tableHeaderMalla' },
        { text: 'CRÉDITOS', rowSpan: 3, style: 'tableHeaderMalla' },
        { text: 'HORAS CLASE / SEMANA', rowSpan: 3, style: 'tableHeaderMalla' }
      ],
      [
        {},
        {},
        {},
        { text: 'DOCENCIA', colSpan: 2, style: 'tableHeaderMalla' },
        {},
        { text: 'APRENDIZAJE AUTÓNOMO', rowSpan: 2, style: 'tableHeaderMalla' },
        {},
        {},
        {},
        {}
      ],
      [
        {},
        {},
        {},
        { text: 'APRENDIZAJE EN CONTACTO CON EL DOCENTE', style: 'tableHeaderMalla' },
        { text: 'APRENDIZAJE PRÁCTICO EXPERIMENTAL', style: 'tableHeaderMalla' },
        {},
        {},
        {},
        {},
        {}
      ],
      [
        { text: datos.programaNombre || 'NOMBRE DE LA CARRERA', colSpan: 10, style: 'tableHeaderMallaLight' },
        {},{},{},{},{},{},{},{},{}
      ]
    ];

    if (niveles && niveles.length > 0) {
      niveles.forEach(nivel => {
        tableBody.push([
          { text: nivel.nivelNombre || `PAO ${nivel.nivel}`, colSpan: 10, style: 'tableHeaderMallaLight' },
          {},{},{},{},{},{},{},{},{}
        ]);
        
        if (nivel.asignaturas) {
          nivel.asignaturas.forEach(asig => {
            tableBody.push([
              { text: asig.num || '', style: 'tableCellCenterMalla' },
              { text: asig.codigo || '', style: 'tableCellCenterMalla' },
              { text: asig.asignatura || '', style: 'tableCellLeftMalla' },
              { text: asig.contactoDocente || '', style: 'tableCellCenterMalla' },
              { text: asig.practicoExp || '', style: 'tableCellCenterMalla' },
              { text: asig.autonomo || '', style: 'tableCellCenterMalla' },
              { text: asig.totalHoras || '', style: 'tableCellCenterMalla' },
              { text: asig.requisitos || '', style: 'tableCellCenterMalla' },
              { text: asig.creditos != null ? parseFloat(asig.creditos).toFixed(2) : '', style: 'tableCellCenterMalla' },
              { text: asig.horasClase || '', style: 'tableCellCenterMalla' }
            ]);
          });
        }
        
        if (nivel.totales) {
          tableBody.push([
            { text: 'TOTAL', colSpan: 3, style: 'tableHeaderMallaLeft' },
            {},
            {},
            { text: nivel.totales.contactoDocente || '', style: 'tableHeaderMallaCenter' },
            { text: nivel.totales.practicoExp || '', style: 'tableHeaderMallaCenter' },
            { text: nivel.totales.autonomo || '', style: 'tableHeaderMallaCenter' },
            { text: nivel.totales.totalHoras || '', style: 'tableHeaderMallaCenter' },
            { text: '', style: 'tableCellCenterMalla' },
            { text: nivel.totales.creditos != null ? parseFloat(nivel.totales.creditos).toFixed(2) : '', style: 'tableHeaderMallaCenter' },
            { text: nivel.totales.horasClase || '', style: 'tableHeaderMallaCenter' }
          ]);
        }
      });
    }

    const docDefinition = {
      ...baseLayout,
      content: [
            {
          text: 'ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO',
          style: 'tituloMalla',
          margin: [0, 20, 0, 0]
        },
        {
          text: `CARRERA: ${datos.programaNombre || '[NOMBRE DEL PROGRAMA]'}`,
          style: 'tituloMalla',
          margin: [0, 0, 0, 0]
        },
        {
          text: `PERÍODO ACADÉMICO: ${datos.periodoAcademico || '[PERÍODO ACADÉMICO]'}`,
          style: 'tituloMalla',
          margin: [0, 0, 0, 0]
        },
        {
          text: 'MALLA CURRICULAR',
          style: 'tituloMalla',
          margin: [0, 0, 0, 0]
        },
        {
          table: {
            headerRows: 4,
            widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: tableBody
          },
          layout: {
            hLineWidth: function (i, node) { return 1; },
            vLineWidth: function (i, node) { return 1; },
            hLineColor: function (i, node) { return '#444444'; },
            vLineColor: function (i, node) { return '#444444'; }
          },
          margin: [0, 20, 0, 50]
        },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 300,
              stack: [
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 0, y1: 0,
                      x2: 300, y2: 0,
                      lineWidth: 1,
                      lineColor: '#2c3e50'
                    }
                  ],
                  margin: [0, 0, 0, 5]
                },
                { text: 'Firma del Coordinador/a de Carrera', alignment: 'center', fontSize: 13, bold: true },
                { text: 'Escuela Superior Politécnica de Chimborazo', alignment: 'center', fontSize: 11 }
              ]
            },
            { width: '*', text: '' }
          ],
          margin: [0, 30, 0, 15]
        }
      ],
      styles: {
        ...baseLayout.styles,
        tituloMalla: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
          color: '#000000',
          characterSpacing: 1
        },
        subtituloMalla: {
          fontSize: 11,
          alignment: 'center',
          color: '#333333'
        },
        tableHeaderMalla: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          color: '#000000',
          fillColor: '#a6a6a6',
          margin: [0, 2, 0, 2]
        },
        tableHeaderMallaLight: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          color: '#000000',
          fillColor: '#d9d9d9',
          margin: [0, 2, 0, 2]
        },
        tableHeaderMallaLeft: {
          bold: true,
          fontSize: 8,
          alignment: 'left',
          color: '#000000',
          fillColor: '#d9d9d9',
          margin: [0, 2, 0, 2]
        },
        tableHeaderMallaCenter: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          color: '#000000',
          fillColor: '#d9d9d9',
          margin: [0, 2, 0, 2]
        },
        tableCellCenterMalla: {
          fontSize: 8,
          alignment: 'center',
          color: '#000000',
          margin: [0, 2, 0, 2]
        },
        tableCellLeftMalla: {
          fontSize: 8,
          alignment: 'left',
          color: '#000000',
          margin: [0, 2, 0, 2]
        }
      }
    };

    return await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}

async function generarMallaCarreraPesum(datos) {
  try {
    let niveles = datos.niveles || [];
    
    // Adapt flat list into grouped niveles if provided
    if (datos.listado && datos.listado.length > 0) {
      const nivelesMap = {};
      datos.listado.forEach(item => {
        const nivelStr = item.strCodNivel || '0';
        if (!nivelesMap[nivelStr]) {
          nivelesMap[nivelStr] = {
            nivel: nivelStr,
            nivelNombre: `PAO ${nivelStr}`,
            asignaturas: [],
            totales: {
              contactoDocente: 0,
              practicoExp: 0,
              autonomo: 0,
              totalHoras: 0,
              creditos: 0,
              horasClase: 0
            }
          };
        }
        
        const hTeo = parseFloat(item.bytHorasTeo) || 0;
        const hPrac = parseFloat(item.bytHorasPrac) || 0;
        const hAut = parseFloat(item.bytHorasAut) || 0;
        const tHoras = hTeo + hPrac + hAut;
        const cred = parseFloat(item.fltCreditos) || 0;
        const hSem = parseFloat(item.bytHorasSeman) || 0;

        nivelesMap[nivelStr].asignaturas.push({
          codigo: item.strCodMateriaPensum || '',
          asignatura: item.strNombreMateria || '',
          contactoDocente: hTeo || '',
          practicoExp: hPrac || '',
          autonomo: hAut || '',
          totalHoras: tHoras || '',
          requisitos: item.strPrerrequisitosCodigos || '',
          creditos: cred,
          horasClase: hSem || ''
        });

        nivelesMap[nivelStr].totales.contactoDocente += hTeo;
        nivelesMap[nivelStr].totales.practicoExp += hPrac;
        nivelesMap[nivelStr].totales.autonomo += hAut;
        nivelesMap[nivelStr].totales.totalHoras += tHoras;
        nivelesMap[nivelStr].totales.creditos += cred;
        nivelesMap[nivelStr].totales.horasClase += hSem;
      });

      niveles = Object.values(nivelesMap).sort((a, b) => parseInt(a.nivel) - parseInt(b.nivel));
      niveles.forEach(n => {
        n.asignaturas.forEach((asig, index) => {
          asig.num = index + 1;
        });
      });
    }

    const defaultFonts = {
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };

    const layoutOptions = {
      title: '',
      subtitle: '',
      pageMargins: [40, 80, 40, 60],
      pageOrientation: 'landscape'
    };

    const baseLayout = createBaseLayout(layoutOptions);

    const tableBody = [
      [
        { text: 'NUM.', rowSpan: 3, style: 'tableHeaderMalla' },
        { text: 'CÓDIGO', rowSpan: 3, style: 'tableHeaderMalla' },
        { text: 'ASIGNATURA', rowSpan: 3, style: 'tableHeaderMalla' },
        { text: 'COMPONENTES DE APRENDIZAJE (HORAS/PAO)', colSpan: 3, style: 'tableHeaderMalla' },
        {},
        {},
        { text: 'TOTAL HORAS', rowSpan: 3, style: 'tableHeaderMalla' },
        { text: 'REQUISITOS', rowSpan: 3, style: 'tableHeaderMalla' },
        { text: 'CRÉDITOS', rowSpan: 3, style: 'tableHeaderMalla' },
        { text: 'HORAS CLASE / SEMANA', rowSpan: 3, style: 'tableHeaderMalla' }
      ],
      [
        {},
        {},
        {},
        { text: 'DOCENCIA', colSpan: 2, style: 'tableHeaderMalla' },
        {},
        { text: 'APRENDIZAJE AUTÓNOMO', rowSpan: 2, style: 'tableHeaderMalla' },
        {},
        {},
        {},
        {}
      ],
      [
        {},
        {},
        {},
        { text: 'APRENDIZAJE EN CONTACTO CON EL DOCENTE', style: 'tableHeaderMalla' },
        { text: 'APRENDIZAJE PRÁCTICO EXPERIMENTAL', style: 'tableHeaderMalla' },
        {},
        {},
        {},
        {},
        {}
      ],
      [
        { text: datos.programaNombre || 'NOMBRE DE LA CARRERA', colSpan: 10, style: 'tableHeaderMallaLight' },
        {},{},{},{},{},{},{},{},{}
      ]
    ];

    if (niveles && niveles.length > 0) {
      niveles.forEach(nivel => {
        tableBody.push([
          { text: nivel.nivelNombre || `PAO ${nivel.nivel}`, colSpan: 10, style: 'tableHeaderMallaLight' },
          {},{},{},{},{},{},{},{},{}
        ]);
        
        if (nivel.asignaturas) {
          nivel.asignaturas.forEach(asig => {
            tableBody.push([
              { text: asig.num || '', style: 'tableCellCenterMalla' },
              { text: asig.codigo || '', style: 'tableCellCenterMalla' },
              { text: asig.asignatura || '', style: 'tableCellLeftMalla' },
              { text: asig.contactoDocente || '', style: 'tableCellCenterMalla' },
              { text: asig.practicoExp || '', style: 'tableCellCenterMalla' },
              { text: asig.autonomo || '', style: 'tableCellCenterMalla' },
              { text: asig.totalHoras || '', style: 'tableCellCenterMalla' },
              { text: asig.requisitos || '', style: 'tableCellCenterMalla' },
              { text: asig.creditos != null ? parseFloat(asig.creditos).toFixed(2) : '', style: 'tableCellCenterMalla' },
              { text: asig.horasClase || '', style: 'tableCellCenterMalla' }
            ]);
          });
        }
        
        if (nivel.totales) {
          tableBody.push([
            { text: 'TOTAL', colSpan: 3, style: 'tableHeaderMallaLeft' },
            {},
            {},
            { text: nivel.totales.contactoDocente || '', style: 'tableHeaderMallaCenter' },
            { text: nivel.totales.practicoExp || '', style: 'tableHeaderMallaCenter' },
            { text: nivel.totales.autonomo || '', style: 'tableHeaderMallaCenter' },
            { text: nivel.totales.totalHoras || '', style: 'tableHeaderMallaCenter' },
            { text: '', style: 'tableCellCenterMalla' },
            { text: nivel.totales.creditos != null ? parseFloat(nivel.totales.creditos).toFixed(2) : '', style: 'tableHeaderMallaCenter' },
            { text: nivel.totales.horasClase || '', style: 'tableHeaderMallaCenter' }
          ]);
        }
      });
    }

    const docDefinition = {
      ...baseLayout,
      content: [
            {
          text: 'ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO',
          style: 'tituloMalla',
          margin: [0, 20, 0, 0]
        },
        {
          text: `CARRERA: ${datos.programaNombre || '[NOMBRE DEL PROGRAMA]'}`,
          style: 'tituloMalla',
          margin: [0, 0, 0, 0]
        },
        {
          text: ` ${datos.periodoAcademico || '[MALLA ACADÉMICA]'}`,
          style: 'tituloMalla',
          margin: [0, 0, 0, 0]
        },
        {
          table: {
            headerRows: 4,
            widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: tableBody
          },
          layout: {
            hLineWidth: function (i, node) { return 1; },
            vLineWidth: function (i, node) { return 1; },
            hLineColor: function (i, node) { return '#444444'; },
            vLineColor: function (i, node) { return '#444444'; }
          },
          margin: [0, 20, 0, 50]
        },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 300,
              stack: [
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 0, y1: 0,
                      x2: 300, y2: 0,
                      lineWidth: 1,
                      lineColor: '#2c3e50'
                    }
                  ],
                  margin: [0, 0, 0, 5]
                },
                { text: 'Firma del Coordinador/a de Carrera', alignment: 'center', fontSize: 13, bold: true },
                { text: 'Escuela Superior Politécnica de Chimborazo', alignment: 'center', fontSize: 11 }
              ]
            },
            { width: '*', text: '' }
          ],
          margin: [0, 30, 0, 15]
        }
      ],
      styles: {
        ...baseLayout.styles,
        tituloMalla: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
          color: '#000000',
          characterSpacing: 1
        },
        subtituloMalla: {
          fontSize: 11,
          alignment: 'center',
          color: '#333333'
        },
        tableHeaderMalla: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          color: '#000000',
          fillColor: '#a6a6a6',
          margin: [0, 2, 0, 2]
        },
        tableHeaderMallaLight: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          color: '#000000',
          fillColor: '#d9d9d9',
          margin: [0, 2, 0, 2]
        },
        tableHeaderMallaLeft: {
          bold: true,
          fontSize: 8,
          alignment: 'left',
          color: '#000000',
          fillColor: '#d9d9d9',
          margin: [0, 2, 0, 2]
        },
        tableHeaderMallaCenter: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          color: '#000000',
          fillColor: '#d9d9d9',
          margin: [0, 2, 0, 2]
        },
        tableCellCenterMalla: {
          fontSize: 8,
          alignment: 'center',
          color: '#000000',
          margin: [0, 2, 0, 2]
        },
        tableCellLeftMalla: {
          fontSize: 8,
          alignment: 'left',
          color: '#000000',
          margin: [0, 2, 0, 2]
        }
      }
    };

    return await funcionesgenerales.pdfMakeDocumento(docDefinition, defaultFonts);
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
}