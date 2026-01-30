const express = require("express");
const router = express.Router();
const Request = require("request");
const fs = require("fs");
const pdf = require("html-pdf");
const pathimage = require("path");
const axios = require("axios");
const https = require("https");
const crypto = require("crypto");
const modelomovilidadasignaturasprocesos = require("../modelo/modelomovilidadasignaturas");
const modelomovilidadaprocesos = require("../modelo/modelomovilidad");
const xlsx = require("xlsx");
const tools = require("../rutas/tools");
const ExcelJS = require("exceljs");
const { JSDOM } = require("jsdom");
const agent = new https.Agent({
  rejectUnauthorized: false,
  // other options if needed
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.ProcesoInsertarAsignaturaMovilidad = async function( datos ) {
  try {
    var datosEncontrados = await modelomovilidadasignaturasprocesos.ObtenerAsignaturaMovilidadDocente("OAS_Master", datos );
    if (datosEncontrados.count > 0) {
      return {
        mensaje: "YA EXISTE LA ASIGNATURA PARA EL DOCENTE EN MOVILIDAD",
        blProceso: false,
      };
    } else {
      var datosCarreraActual = await modelomovilidadaprocesos.ObenterDatosCarrera( "OAS_Master", datos.mam_bdorigen );
      var datosCarreraMovilidad = await modelomovilidadaprocesos.ObenterDatosCarrera( "OAS_Master", datos.mam_bdmovilidad );
      datos.mam_codigoorigen = datosCarreraActual.data[0].strCodigo;
      datos.mam_carreraorigen = datosCarreraActual.data[0].strNombre;
      datos.mam_carreramovilidad = datosCarreraMovilidad.data[0].strNombre;
      datos.mam_codigomovilidad = datosCarreraMovilidad.data[0].strCodigo;
      var datosIngresados = await modelomovilidadasignaturasprocesos.InsertarAsignaturaMovilidad( "OAS_Master", datos );
      return {
        mensaje: "ASIGNATURA DE MOVILIDAD INSERTADA CORRECTAMENTE",
        blProceso: true,
      };
    }
  } catch (error) {
    console.log(error);
    return "ERROR" + error;
  }
};

module.exports.ProcesoObtenerAsignaturaMovilidadDocente = async function( datos ) {
  try {
    var datos = await modelomovilidadasignaturasprocesos.ObtenerAsignaturaMovilidadDocente( "OAS_Master", datos );
    return datos.data;
  } catch (error) {
    console.log(error);
    return "ERROR" + error;
  }
};

module.exports.ProcesoObtenerAsignaturaMovilidadNivelParalelo = async function( carrera, datos ) {
  try {
    var datos = await modelomovilidadasignaturasprocesos.ObtenerAsignaturaMovilidadNivelParalelo( carrera, datos );
    return datos.data;
  } catch (error) {
    console.log(error);
    return "ERROR" + error;
  }
};
module.exports.ProcesoEliminarAsignaturaMovilidadDocente = async function( carrera, datos ) {
  try {
    var datos = await modelomovilidadasignaturasprocesos.EliminarAsignaturaMovilidadDocente( carrera, datos );
    return datos;
  } catch (error) {
    console.log(error);
    return "ERROR" + error;
  }
};

module.exports.ProcesoDesactivarAsignaturaMovilidadDocente = async function( datos ) {
  try {
    var datos = await modelomovilidadasignaturasprocesos.DesactivarAsignaturaMovilidadDocente( "OAS_Master", datos );
    return datos;
  } catch (error) {
    console.log(error);
    return "ERROR" + error;
  }
};

module.exports.ProcesoObtenerAsignaturasCarreraDocente = async function( carrera,cedula,periodo ) {
  try {
    var datos = await modelomovilidadasignaturasprocesos.ObtenerDatosASignaturasCarreraDocente( carrera,tools.CedulaConGuion(cedula),periodo );
    return datos.data;
  } catch (error) {
    console.log(error);
    return "ERROR" + error;
  }
};