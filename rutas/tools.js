const pathimage = require('path');
const fs = require("fs");
const moment = require('moment');
require('moment/locale/es');
const https = require('https');
const crypto = require("crypto");
const pdf = require('html-pdf');
  
      // Función para convertir una imagen a base64
  function imageToBase64(imagePath) {
    const imageData = fs.readFileSync(imagePath);
    return Buffer.from(imageData).toString('base64');
}

function FechaActual(){
  var date = new Date();
  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;
  const currentDate = new Date().toLocaleDateString();
  return currentDate;
}

module.exports.EsVigente = function (fecha)  {
  const fechaActual = moment();
  const fechaEvaluar = moment(fecha, 'YYYY-MM-DD HH:mm:ss');
  // Verifica si la fecha es mayor o igual a la fecha actual
  return fechaEvaluar.isSameOrAfter(fechaActual);
}

module.exports.FechaVigenteInicioFin = function (fechaInicio, fechaFin)  {
 if (!fechaInicio || !fechaFin) return false;

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const ahora = new Date();

  // Verifica si las fechas son válidas
  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return false;

  return ahora >= inicio && ahora <= fin;
}
module.exports.formatearFechaISO = function (fechaInput)  {
if (!fechaInput) return null;

  const fecha = new Date(fechaInput);
  if (isNaN(fecha.getTime())) return null; // Validación de fecha

  return fecha.toISOString().substring(0, 10);
}

module.exports.estaVigenteFechaMovilidad = function (fechaInicio, fechaFin)  {
  if (!fechaInicio || !fechaFin) return false;

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return false;

  const hoy = new Date();

  return hoy >= inicio && hoy <= fin;
}

module.exports.codigopesumultimo = function (codigo) {
  if (!codigo) return null;

  const currentYear = new Date().getFullYear();
  const num = parseInt(codigo, 10);

  if (isNaN(num)) return null;

  const baseYear = Math.floor(num / 10);
  const incremental = num - (baseYear * 10);

  const nuevoIncremental = incremental + 1;
  const nuevoCodigo = parseInt(`${currentYear}${nuevoIncremental}`);

  return {
    codigo: nuevoCodigo,
    descripcion: `MALLA CURRICULAR ${nuevoCodigo}`
  };
};
module.exports.FechaActualCupo = function () {
  var date = new Date();
  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  var fechaformato = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec
  return fechaformato
}  
    module.exports.convertirfechaformato = function (fecha) {
    let day = fecha.getDate()
    let month = fecha.getMonth() + 1
    let year = fecha.getFullYear()
    var fecha = "";
    if (month < 10) {
        month = "0" + month 
    }
    if (day < 10) {
        day = "0" + day
    }
    var fechaformato = year + "-" + month + "-" + day
    return fechaformato
  }
  module.exports.headerOcultoHtml = function () {
    var imagenheader = pathimage.join(__dirname, '../public/imagenes/espoch.png');
    const headerHtml2 = `<div style="text-align: center;;display:none">
    <img src="data:image/jpeg;base64,${imageToBase64(imagenheader)}" alt="Header Image" style="width: 50px;">
</div>`;
    return headerHtml2
  }

  module.exports.headerHtml = function () {
    var imagenheader = pathimage.join(__dirname, '../public/imagenes/espoch.png');
    const headerHtml = `<div style="text-align: center;">
    <img src="data:image/jpeg;base64,${imageToBase64(imagenheader)}" alt="Header Image" style="width: 50px;">
    </div>`;
    return headerHtml
  }

  module.exports.headerOcultoHtmlCarreras = function (datos) {
    var imagenheader = pathimage.join(__dirname, '../public/imagenes/espoch.png');
    const headerHtml2 =  `<div style="text-align: left;display:none">
    <img src="data:image/jpeg;base64,${imageToBase64(imagenheader)}" alt="Header Image" style="width: 50px;float: left;">
    </div>
    <div style="text-align: center;display:none">
    <p style='font-size: 11px'> <strong>ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO</strong>  </p>
    <p style='font-size: 10px;margin-top: -9px;'> <strong>FACULTAD: ${datos.strNombreFacultad}</strong> </p>
    <p style='font-size: 10px;margin-top: -9px;'><strong>CARRERA: ${datos.strNombreCarrera}</strong> </p>
    </div>`;
    return headerHtml2
  }

  module.exports.headerHtmlCarreras = function (datos) {
    var imagenheader = pathimage.join(__dirname, '../public/imagenes/espoch.png');
    const headerHtml = `<div style="text-align: left;">
    <img src="data:image/jpeg;base64,${imageToBase64(imagenheader)}" alt="Header Image" style="width: 50px;float: left;">
    </div>
    <div style="text-align: center;">
    <p style='font-size: 11px'> <strong>ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO</strong>  </p>
    <p style='font-size: 10px;margin-top: -9px;'> <strong>FACULTAD: ${datos.strNombreFacultad}</strong> </p>
    <p style='font-size: 10px;margin-top: -9px;'><strong>CARRERA: ${datos.strNombreCarrera}</strong> </p>
    </div>`;
    return headerHtml
  }

  module.exports.footerHtml = function () {
    var imagenfooter = pathimage.join(__dirname, '../public/imagenes/matriz.png');
    const footerHtml = `<div style="text-align: center;">
    <img src="data:image/jpeg;base64,${imageToBase64(imagenfooter)}" alt="Footer Image" style="width: 300px;height: 30px">
    <p style='text-align: right;font-size: 11px;'>Documento generado  el ${new Date().toLocaleDateString()} - Sistema Académico</p>

</div> `;
    return footerHtml
  }
  module.exports.footerOcultoHtml = function () {
    var imagenfooter = pathimage.join(__dirname, '../public/imagenes/matriz.png');
    const footerHtml2 = `<div style="text-align: center;display:none">
    <img src="data:image/jpeg;base64,${imageToBase64(imagenfooter)}" alt="Footer Image" style="width: 300px;height: 30px">
  
       <p style='text-align: right;font-size: 11px;'>Documento generado  el ${new Date().toLocaleDateString()} - Sistema Académico</p>
   
</div>`;
    return footerHtml2
  }



  module.exports.PromedioCalcular = function (num1, num2) {
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      throw new Error('Ambos argumentos deben ser números');
    }
    
    let promedio = (num1 + num2) / 2;
    const promedioStr = promedio.toFixed(3);
    const decimalPart = promedioStr.split('.')[1];
    promedio = Number(promedioStr); // Asegura que el valor sea redondeado a 3 decimales

    return decimalPart.length === 3 ? Math.ceil(promedio * 100) / 100 : Math.round(promedio * 100) / 100;
  };
  
  module.exports.formatearFechaNacimiento = function (fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const anio = fecha.getUTCFullYear();
  
    return `${dia}/${mes}/${anio}`;
  }
  module.exports.CedulaConGuion=function (strcedula) {
    if ((strcedula.length > 9) && (strcedula.indexOf("-") < 0)) {
      strcedula = strcedula.substring(0, 9) + "-" + strcedula.substring(9);
    }
    return strcedula;
  }
  module.exports.CedulaSinGuion=function (strcedula){
    if ((strcedula.length > 10) && (strcedula.indexOf("-") >= 0)) {
      var strcedula1 = strcedula.substring(0, 9) + strcedula.substring(10);
    }
    return strcedula1;
  }
  module.exports.ordenarPorCarrera=function (arr) {
    return arr.sort((a, b) => {
        const carreraA = a.Carrera.trim().toLowerCase();
        const carreraB = b.Carrera.trim().toLowerCase();
        
        if (carreraA < carreraB) return -1;
        if (carreraA > carreraB) return 1;
        return 0;
    });
}
module.exports.ordenarPorApellidos=function (arr) {
  return arr.sort((a, b) => {
      const carreraA = a.strApellidos.trim().toLowerCase();
      const carreraB = b.strApellidos.trim().toLowerCase();
      
      if (carreraA < carreraB) return -1;
      if (carreraA > carreraB) return 1;
      return 0;
  });
}
  module.exports.palabraIncluidaEnFrase=function(frase, palabra) {
    // Convertimos ambas la frase y la palabra a minúsculas para hacer la comparación sin distinguir mayúsculas de minúsculas
    const fraseMinusculas = frase.toUpperCase();
    const palabraMinusculas = palabra.toUpperCase();
    
    // Verificamos si la palabra se encuentra incluida en la frase
    if (fraseMinusculas.includes(palabraMinusculas)) {
        return true;
    } else {
        return false;
    }
}

  module.exports.convertirFormatoFecha=function (fechaStr) {
    // Parsear la cadena de fecha con moment.js
    const fecha = moment(fechaStr);

    // Obtener el nombre del día de la semana
    const nombreDiaSemana = fecha.format("dddd");

    // Obtener el día del mes
    const diaMes = fecha.format("DD");

    // Obtener el nombre del mes
    const nombreMes = fecha.format("MMMM");

    // Obtener el año
    const año = fecha.format("YYYY");

    // Obtener la hora y el minuto
    let hora = fecha.format("hh");
    const minuto = fecha.format("mm");

    // Obtener AM o PM
    const amPm = fecha.format("a");

    // Ajustar la hora si es necesario
    if (hora === '00') {
        hora = '12';
    }

    // Crear la cadena de fecha en el formato deseado
    const fechaFormateada = `${nombreDiaSemana} ${diaMes} de ${nombreMes} del ${año} hora ${hora}:${minuto}${amPm}`;

    return fechaFormateada;
}
let validCount = 0;
let invalidCount = 0;

module.exports.FormatoCalificacionesRecuperacion=function (text) {
  const regex = /Registro en la BD (?<database>\S+) la nota de (?<type>\S+)\s+(?<grade>null|\d+\.\d+) de la materia (?<subject>\S+) del periodo (?<period>\S+) de la matricula\s+(?<enrollment>\d+) desde (?<source>.+)/;
    
  const match = text.match(regex);
  var contador=0;
  var index=0;
  if (!match || Object.values(match.groups).some(value => value === undefined)) {
    invalidCount++;
    console.error(`Registros no válidos procesados: ${invalidCount}`);
     throw new Error("El texto no tiene el formato esperado o contiene valores nulos");
  }
  validCount++;
  console.log(`Registros válidos procesados: ${validCount}`);
 
  
  return {
      database: match.groups.database,
      type: match.groups.type,
      grade: match.groups.grade === "null" ? null : parseFloat(match.groups.grade),
      subject: match.groups.subject,
      period: match.groups.period,
      enrollment: match.groups.enrollment,
      source: match.groups.source.trim()
  };
}


module.exports.FunciongenerarPDF=function (htmlCompleto, options) {
    return new Promise((resolve, reject) => {
        pdf.create(htmlCompleto, options).toFile("NominaGenerada.pdf", function (err, res) {
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
  

module.exports.ConvertirFechaMatricula=function(isoDate) {
  const date = new Date(isoDate);
    
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    
    return `${day}/${month}/${year}`;

}

module.exports.VerificacionPeriodoTresCalificaciones=async function(strCodigoPeriodo) {
   var resultado= false;
    var numeroperiodo = await obtenerNumeroDelPeriodo(strCodigoPeriodo);
  
    if (Number(numeroperiodo) >= 42) {
      return true;
    } else {
      return false;
    }
  

}
module.exports.EncontraObjetodentroListadoRecordAcademico = async function (valorBuscado, listadoCarreras, atributo) {
   if (!Array.isArray(listadoCarreras)) return null;

  // Ordenar por fechaInicioperiodo de forma descendente
  const listadoOrdenado = listadoCarreras.sort((a, b) => {
    const fechaA = new Date(a.FechaInicPer1);
    const fechaB = new Date(b.FechaInicPer1);
    return fechaB - fechaA; // Descendente
  });

  // Buscar el valor dentro del listado ordenado
  const resultado = listadoOrdenado.find(carrera =>
    String(carrera?.[atributo] || '').toUpperCase() === valorBuscado.toUpperCase()
  );

  return resultado || null;
};
module.exports.EncontraObjetodentroEnunListado = async function (valorBuscado, listadoCarreras, atributo) {
   if (!Array.isArray(listadoCarreras)) return null;
  // Buscar el valor dentro del listado ordenado
  const resultado = listadoCarreras.find(carrera =>
    String(carrera?.[atributo] || '').toUpperCase() === valorBuscado.toUpperCase()
  );

  return resultado || null;
};
async function obtenerNumeroDelPeriodo(parametro) {
  if (typeof parametro !== 'string') return 0;

  if (parametro.startsWith('P')) {
    const numero = parseInt(parametro.slice(1), 10);
    return isNaN(numero) ? 0 : numero;
  }

  return 0;
}
module.exports.QuitarASignaturasNoAprobar = async function (listado1, listado2) {
  // Validación de parámetros
    if (!Array.isArray(listado1) || !Array.isArray(listado2)) {
        throw new Error('Ambos parámetros deben ser arrays');
    }

    // Crear un Set con los códigos del listado2 para búsqueda rápida
    const codigosListado2 = new Set(
        listado2
            .filter(item => item && item.strCodMat) // Filtrar items válidos
            .map(item => item.strCodMat.toString().trim().toUpperCase()) // Normalizar códigos
    );
    // Filtrar el listado1
    return listado1.filter(item => {
        if (!item || !item.CodigoMateriaAnterior) return false;
        
        // Normalizar el código para comparación
        const codigoNormalizado = item.CodigoMateriaAnterior.toString().trim().toUpperCase();
        
        // Verificar si el código NO está en el listado2
        return !codigosListado2.has(codigoNormalizado);
    });
};
async function obtenerNumeroDelPeriodo(parametro) {
  if (typeof parametro !== 'string') return 0;

  if (parametro.startsWith('P')) {
    const numero = parseInt(parametro.slice(1), 10);
    return isNaN(numero) ? 0 : numero;
  }

  return 0;
}
module.exports.ListadoNivelesRecordEncontrar = async function (valorBuscado, listado, atributo) {
 if (!Array.isArray(listado)) {
        throw new Error('El listado debe ser un array');
    }

    if (!listado.every(item => item[atributo] !== undefined)) {
        throw new Error(`El atributo "${atributo}" no existe en algunos elementos`);
    }

    return listado
        .filter(item => 
            String(item[atributo]).toUpperCase() === valorBuscado.toUpperCase()
        )
        .map(item => ({
            CodigoMateria: item.CodigoMateriaAnterior,
            NombreMateria: item.NombreMateriaAnterior,
            [atributo]: item[atributo],
            Periodo: item.Periodo,
            Promedio: item.Promedio,
            Tipo: item.Tipo,
             nombretipo: item.nombretipo || 'NO ESPECIFICADO',
             nombrearea: item.nombrearea || 'NO ESPECIFICADO',
             codNivel: item.codNivel || 'NO ESPECIFICADO',
            Estado: item.estadoasignatura || 'NO ESPECIFICADO',
            CodigoMateriaNueva: item.CodigoMateriaNueva 
        }));
};
module.exports.obtenerListadoNiveles = function() {
    const niveles = [
        { codigo: '0', descripcion: 'CAB' },
        { codigo: '1', descripcion: 'PRIMERO' },
        { codigo: '2', descripcion: 'SEGUNDO' },
        { codigo: '3', descripcion: 'TERCERO' },
        { codigo: '4', descripcion: 'CUARTO' },
        { codigo: '5', descripcion: 'QUINTO' },
        { codigo: '6', descripcion: 'SEXTO' },
        { codigo: '7', descripcion: 'SEPTIMO' },
        { codigo: '8', descripcion: 'OCTAVO' },
        { codigo: '9', descripcion: 'NOVENO' },
        { codigo: '10', descripcion: 'DECIMO' }
    ];

    return niveles;
};
module.exports.AgruparNivelesdelRecordAcademicos = async function (asignaturas) {
    // Mapeo de nombres de nivel a orden numérico
    const ordenNiveles = {
        'CAB': 0,
        'PRIMERO': 1,
        'SEGUNDO': 2,
        'TERCERO': 3,
        'CUARTO': 4,
        'QUINTO': 5,
        'SEXTO': 6,
        'SEPTIMO': 7,
        'OCTAVO': 8,
        'NOVENO': 9,
        'DECIMO': 10
    };

    // Validar entrada
    if (!Array.isArray(asignaturas)) {
        throw new Error('El parámetro asignaturas debe ser un array');
    }

    // Filtrar y agrupar solo niveles existentes en los datos
    const agrupadas = asignaturas.reduce((acc, curr) => {
        if (!curr || !curr.Nivel) return acc;
        
        const nivel = curr.Nivel.toUpperCase();
        
        // Solo procesar niveles que existen en nuestro mapeo
        if (ordenNiveles.hasOwnProperty(nivel)) {
            if (!acc[nivel]) {
                acc[nivel] = [];
            }
            acc[nivel].push(curr);
        }
        return acc;
    }, {});

    // Convertir a array y ordenar por nivel
    const nivelesOrdenados = Object.keys(agrupadas)
        .filter(nivel => ordenNiveles.hasOwnProperty(nivel)) // Filtro adicional por seguridad
        .map(nivel => ({
            nombre: nivel,
            orden: ordenNiveles[nivel],
            asignaturas: agrupadas[nivel]
        }))
        .sort((a, b) => a.orden - b.orden);

    // Formatear el resultado
    const resultado = nivelesOrdenados.map(nivel => ({
        strCodNivel: nivel.orden === 0 ? 'CAB' : nivel.orden.toString(),
        strDescripcion: nivel.nombre
    }));

    return resultado;
};
async function obtenerNumeroDelPeriodo(parametro) {
  if (typeof parametro !== 'string') return 0;

  if (parametro.startsWith('P')) {
    const numero = parseInt(parametro.slice(1), 10);
    return isNaN(numero) ? 0 : numero;
  }

  return 0;
}
module.exports.obtenerUltimosIntentosPorMateria = function (registros) {
   if (!Array.isArray(registros)) return [];

  // Crear un mapa para almacenar el intento más reciente por materia
  const materiasMap = new Map();

  registros.forEach(registro => {
    const codigo = registro.CodigoMateriaAnterior;
    const fecha = new Date(registro.FechaInicPer1);

    if (!materiasMap.has(codigo)) {
      materiasMap.set(codigo, registro);
    } else {
      const existente = materiasMap.get(codigo);
      const fechaExistente = new Date(existente.FechaInicPer1);
      if (fecha > fechaExistente) {
        materiasMap.set(codigo, registro);
      }
    }
  });

  // Construir el resultado con información de aprobación
  const resultado = [];
  for (const [codigo, registro] of materiasMap.entries()) {
    resultado.push({
      CodigoMateria: codigo,
      NombreMateria: registro.NombreMateriaAnterior,
      Periodo: registro.Periodo,
      Fecha: registro.FechaInicPer1,
      ComputoTotal: registro.ComputoTotal,
      Equivalencia: registro.Equivalencia,
      
    });
  }

  return resultado;
} 

module.exports.FotoPorDefecto=async function() {
 return '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' 

}