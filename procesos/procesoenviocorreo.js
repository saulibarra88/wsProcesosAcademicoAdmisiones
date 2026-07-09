const express = require("express");
const router = express.Router();

const fs = require("fs");

const pathimage = require("path");
const axios = require("axios");
const https = require("https");
const crypto = require("crypto");
const xlsx = require("xlsx");
const tools = require("../rutas/tools");
const ExcelJS = require("exceljs");
const { JSDOM } = require("jsdom");
const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.ProcesoEnvioCorreo = async function (objEnvioCorreo, lstReceptores) {
    try {
        var resultado = await FuncionEnvioCorreo(objEnvioCorreo, lstReceptores);
        return resultado
    } catch (error) {
        console.error(error);

    }
}

async function FuncionEnvioCorreo(objEnvioCorreo, lstReceptores) {
    try {
        var respuesta = {};
        var datosCarreraActual = null

        var content = {
            strAsunto: objEnvioCorreo.strAsunto,
            strCodigoSistema: process.env.DNS_CODIGO_ENVIO_CORREO,
            strBody: objEnvioCorreo.strBody,
            lstArchivosAdjuntos: [],
            lstReceptores: lstReceptores
        }
        var datosenvio = await axios.post(process.env.DNS_SERVICIOS_ENVIO_CORREO, content, { httpsAgent: agent });
        return { blProceso: true, mensaje: "OK", datosenvio: datosenvio.data }

    } catch (error) {
        console.error(error);

        return { blProceso: false, mensaje: "Error :" + error }

    }
}