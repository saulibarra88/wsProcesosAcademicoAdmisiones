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
    <p style='text-align: right;font-size: 10px;'>Fecha impresión : <strong>${FechaActual()} </strong> </p>

</div> `;
    return footerHtml
  }
  module.exports.footerOcultoHtml = function () {
    var imagenfooter = pathimage.join(__dirname, '../public/imagenes/matriz.png');
    const footerHtml2 = `<div style="text-align: center;display:none">
    <img src="data:image/jpeg;base64,${imageToBase64(imagenfooter)}" alt="Footer Image" style="width: 300px;height: 30px">
    <p style='text-align: right;font-size: 11px;'> Fecha impresión : <strong>${FechaActual()} </strong> </p>
   
</div>`;
    return footerHtml2
  }


  /*module.exports.PromedioCalcular = function (num1, num2) {
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      throw new Error('Ambos argumentos deben ser números');
  }
  const promedio = (num1 + num2) / 2;
  return parseFloat(promedio.toFixed(2));
  }*/
  module.exports.PromedioCalcular = function (num1, num2) {
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      throw new Error('Ambos argumentos deben ser números');
    }
    
    const promedio = (num1 + num2) / 2;
    const promedioStr = promedio.toFixed(3);
    const decimalPart = promedioStr.split('.')[1];
   // promedio = Number(promedioStr); // Asegura que el valor sea redondeado a 3 decimales

    return decimalPart.length === 3 ? Math.ceil(promedio * 100) / 100 : Math.round(promedio * 100) / 100;
  };
  

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
  