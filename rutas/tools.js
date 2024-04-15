const pathimage = require('path');
const fs = require("fs");
const moment = require('moment');
require('moment/locale/es');
  
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

  module.exports.CedulaConGuion=function (strcedula) {
    if ((strcedula.length > 9) && (strcedula.indexOf("-") < 0)) {
      strcedula = strcedula.substring(0, 9) + "-" + strcedula.substring(9);
    }
    return strcedula;
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
  