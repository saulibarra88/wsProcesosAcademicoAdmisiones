const xlsx = require('xlsx');
const ExcelJS = require('exceljs');

const sourceFile = 'C:\\Users\\saul.ibarra\\Downloads\\ESPOCH_CONSOLIDADO_LOGROS_ESTUDIANTES.xlsx';
const formatFile = 'D:\\Respaldo Saul\\Documentos\\FORMATO_INGRRESO_RECONOCIMIENTO.xlsx';
const outputFile = 'D:\\Respaldo Saul\\Documentos\\FORMATO_INGRRESO_RECONOCIMIENTO_MIGRADO.xlsx';

const countryKeywords = {
  'ESPAÑA': ['ESPAÑA', 'SPAIN'],
  'BRASIL': ['BRASIL', 'BRAZIL'],
  'ALEMANIA': ['ALEMANIA', 'GERMANY'],
  'JAPÓN': ['JAPÓN', 'JAPON', 'JAPAN'],
  'AUSTRALIA': ['AUSTRALIA'],
  'CHILE': ['CHILE'],
  'PERÚ': ['PERÚ', 'PERU'],
  'AUSTRIA': ['AUSTRIA'],
  'ECUADOR': ['ECUADOR']
};

function detectCountry(desc) {
  if (!desc) return 'ECUADOR';
  const descUpper = desc.toUpperCase();
  for (const [country, keywords] of Object.entries(countryKeywords)) {
    for (const keyword of keywords) {
      if (descUpper.includes(keyword)) {
        return country;
      }
    }
  }
  return 'ECUADOR';
}

function detectTipoReconocimiento(tipo) {
  const tipoUpper = (tipo || '').toUpperCase().trim();
  
  if (tipoUpper.includes('DEPORTIVO')) return 1; // DEPORTIVOS
  if (tipoUpper.includes('ACADÉMICO') || tipoUpper.includes('ACADEMICO')) return 2; // ACADEMICOS
  if (tipoUpper.includes('CULTURAL')) return 3; // CULTURAL
  if (tipoUpper.includes('CIENTÍFICO') || tipoUpper.includes('CIENTIFICO')) return 4; // CIENTIFICOS
  
  return 5; // OTROS
}

function detectNivelReconocimiento(desc) {
  if (!desc) return 1; // LOCAL
  const descUpper = desc.toUpperCase();
  
  const intKeywords = ['INTERNACIONAL', 'MUNDIAL', 'WORLD', 'INTERNATIONAL', 'ESPAÑA', 'BRASIL', 'ALEMANIA', 'JAPÓN', 'JAPON', 'AUSTRALIA', 'CHILE', 'PERÚ', 'PERU', 'AUSTRIA', 'HULT PRIZE'];
  const nacKeywords = ['NACIONAL', 'NACIONALES', 'ECUADOR', 'CUENCA', 'AMBATO'];
  const regKeywords = ['REGIONAL'];
  const locKeywords = ['INTERNO', 'LOCAL', 'ESPOCH', 'ON CAMPUS', 'SEDE', 'JUEGOS INTERNOS', 'COPA TI'];
  
  for (const kw of intKeywords) {
    if (descUpper.includes(kw)) return 4; // INTERNACIONAL
  }
  for (const kw of nacKeywords) {
    if (descUpper.includes(kw)) return 3; // NACIONAL
  }
  for (const kw of regKeywords) {
    if (descUpper.includes(kw)) return 2; // REGIONAL
  }
  for (const kw of locKeywords) {
    if (descUpper.includes(kw)) return 1; // LOCAL
  }
  
  return 1; // Default to LOCAL
}

function extractNombreReconocimiento(desc) {
  if (!desc) return 'RECONOCIMIENTO';
  const descUpper = desc.toUpperCase();
  if (descUpper.includes('PRESENTACIÓN DEL TRABAJO') || descUpper.includes('PRESENTACION DEL TRABAJO')) {
    return 'PRESENTACION DE TRABAJO CIENTIFICO';
  }
  if (descUpper.includes('APROBACIÓN DISCIPLINA ARTÍSTICA') || descUpper.includes('APROBACION DISCIPLINA ARTISTICA')) {
    return desc.replace(/Aprobación\s+/i, '').toUpperCase();
  }
  return desc.toUpperCase();
}

function extractInstitucionOtorgante(desc, carrera) {
  if (!desc) return 'ESPOCH';
  const descUpper = desc.toUpperCase();
  if (descUpper.includes('HULT PRIZE')) return 'HULT PRIZE FOUNDATION';
  if (descUpper.includes('UNIR')) return 'UNIVERSIDAD INTERNACIONAL DE LA RIOJA (UNIR)';
  if (descUpper.includes('UTPL')) return 'UNIVERSIDAD TÉCNICA PARTICULAR DE LOJA (UTPL)';
  if (descUpper.includes('BABES BOLAYI')) return 'BABES-BOLYAI UNIVERSITY';
  if (descUpper.includes('CONFERENCIA') || descUpper.includes('CONFERENCE') || descUpper.includes('JAPÓN') || descUpper.includes('AUSTRALIA') || descUpper.includes('BRASIL') || descUpper.includes('ESPAÑA')) {
    const confMatch = desc.match(/en la ([^,]+)/i) || desc.match(/at the ([^,]+)/i);
    if (confMatch) {
      return confMatch[1].trim().toUpperCase();
    }
    return 'ORGANIZACION EXTERNA';
  }
  if (descUpper.includes('DISCIPLINA ARTÍSTICA') || descUpper.includes('JUEGOS DEPORTIVOS TI') || descUpper.includes('INTERNO') || descUpper.includes('COPA TI')) {
    return 'ESPOCH';
  }
  return 'ESPOCH';
}

function extractTituloMencion(desc) {
  if (!desc) return 'RECONOCIMIENTO';
  const descUpper = desc.toUpperCase();
  if (descUpper.includes('PRIMER LUGAR')) return 'PRIMER LUGAR';
  if (descUpper.includes('SEGUNDO LUGAR')) return 'SEGUNDO LUGAR';
  if (descUpper.includes('TERCER LUGAR')) return 'TERCER LUGAR';
  if (descUpper.includes('MENCIÓN ESPECIAL') || descUpper.includes('MENCION ESPECIAL')) return 'MENCION ESPECIAL';
  if (descUpper.includes('MEDALLA DE ORO')) return 'MEDALLA DE ORO';
  if (descUpper.includes('MEDALLA DE PLATA')) return 'MEDALLA DE PLATA';
  if (descUpper.includes('MEDALLA DE BRONCE')) return 'MEDALLA DE BRONCE';
  if (descUpper.includes('APROBACIÓN') || descUpper.includes('APROBACION')) return 'APROBADO';
  if (descUpper.includes('GANADOR')) return 'GANADOR';
  if (descUpper.includes('PARTICIPACIÓN') || descUpper.includes('PARTICIPACION')) return 'PARTICIPANTE';
  return 'RECONOCIMIENTO';
}

async function runMigration() {
  console.log('Iniciando migración...');
  
  // 1. Leer los datos origen usando xlsx (para formatear fechas automáticamente)
  console.log(`Leyendo datos de origen: ${sourceFile}`);
  const sourceWorkbook = xlsx.readFile(sourceFile, { cellDates: true, dateNF: 'dd/mm/yyyy' });
  const sourceSheet = sourceWorkbook.Sheets['Hoja1'];
  const sourceRows = xlsx.utils.sheet_to_json(sourceSheet, { raw: false });
  console.log(`Leídos ${sourceRows.length} registros del archivo origen.`);
  
  // 2. Mapear los datos
  console.log('Mapeando registros al formato destino...');
  const mappedRows = sourceRows.map((row) => {
    const cedula = (row['cédula de identidad '] || row['cédula de identidad'] || '').trim();
    const tipoLogro = row['tipo de logro (académico, científico, cultural, deportivo, otros)'] || row['tipo de logro'];
    const descLogro = row['descripción del logro  (académico, científico, cultural, deportivo, otros)'] || row['descripción del logro'];
    const fecha = row['fecha de obtención'] || '';
    const carrera = row['Carrera '] || row['Carrera'] || '';
    
    return {
      cedula: cedula,
      tipoReconocimiento: detectTipoReconocimiento(tipoLogro),
      nivelReconocimiento: detectNivelReconocimiento(descLogro),
      nombreReconocimiento: extractNombreReconocimiento(descLogro).substring(0, 250),
      institucionOtorgante: extractInstitucionOtorgante(descLogro, carrera).substring(0, 150),
      tituloMencion: extractTituloMencion(descLogro).substring(0, 400),
      fechaReconocimiento: fecha,
      descripcion: (descLogro || '').trim().substring(0, 700),
      pais: detectCountry(descLogro)
    };
  });
  
  // 3. Cargar el formato destino usando exceljs
  console.log(`Cargando plantilla de formato: ${formatFile}`);
  const destWorkbook = new ExcelJS.Workbook();
  await destWorkbook.xlsx.readFile(formatFile);
  
  const destSheet = destWorkbook.getWorksheet('Hoja1');
  if (!destSheet) {
    throw new Error('No se encontró la hoja "Hoja1" en la plantilla.');
  }
  
  const initialRowCount = destSheet.rowCount;
  console.log(`Filas iniciales en Hoja1 de la plantilla: ${initialRowCount}`);
  
  // 4. Escribir nuevos registros mapeados directamente a sus filas (reemplazando desde la fila 2)
  console.log('Escribiendo registros mapeados...');
  mappedRows.forEach((row, index) => {
    const rowIndex = index + 2; // Fila 1 es cabecera, los datos empiezan en fila 2
    const excelRow = destSheet.getRow(rowIndex);
    excelRow.values = [
      row.cedula, // Column A (CEDULA)
      row.tipoReconocimiento, // Column B (TIPO_RECONOCIMIENTO)
      row.nivelReconocimiento, // Column C (NIVEL_RECONOCIMIENTO)
      row.nombreReconocimiento, // Column D (NOMBRE_RECONOCIMIENTO)
      row.institucionOtorgante, // Column E (INSTITUCION_OTORGANTE)
      row.tituloMencion, // Column F (TITULO_MENCION_OTORGADA)
      row.fechaReconocimiento, // Column G (FECHA_RECONOCIMIENTO)
      row.descripcion, // Column H (DESCRIPCION)
      row.pais // Column I (PAIS)
    ];
  });
  
  // 5. Si la plantilla original tenía más filas que los nuevos datos, limpiar las filas sobrantes
  const totalRowsWritten = mappedRows.length + 1; // Cabecera + datos
  if (initialRowCount > totalRowsWritten) {
    console.log(`Limpiando ${initialRowCount - totalRowsWritten} filas excedentes al final de la hoja...`);
    for (let r = totalRowsWritten + 1; r <= initialRowCount; r++) {
      destSheet.getRow(r).values = [];
    }
  }
  
  // 6. Guardar el archivo resultante
  console.log(`Guardando archivo final: ${outputFile}`);
  await destWorkbook.xlsx.writeFile(outputFile);
  console.log('¡Migración completada exitosamente!');
}

runMigration().catch(err => {
  console.error('Error durante la migración:', err);
  process.exit(1);
});
