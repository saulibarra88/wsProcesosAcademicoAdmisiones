const express = require('express');
const router = express.Router();

const fs = require("fs");

const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");

const sqlmodelorecord = require('../modeloformato/recordmodelo');
const sqlmodelomovilidad = require('../modelo/modelomovilidad');
const sqlmodelocupos = require('../modelo/procesocupos');
const procesoenviocorreo = require('../procesos/procesoenviocorreo');

const tools = require('../rutas/tools');
const { sendResponseProcesos } = require('../herramientas/responseservice');
const logger = require('./../herramientas/logger');

const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});


module.exports.ProcesoListadoRecordEstadoPeriodo = async function (carrera, periodo, estado) {
    try {
        var listadoInformacion = []
        var Informacion = await sqlmodelorecord.ListadoSolicitudesRecordEstadoPeriodo(carrera, periodo, estado);
        if (Informacion.modelo) {
            for (let datos of Informacion.datos.data) {
                var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + tools.CedulaSinGuion(datos.strCedulaEstudiante), { httpsAgent: agent });
                var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
                datos.per_email = ObtenerPersona.data.listado[0].per_email;
                datos.per_emailAlternativo = ObtenerPersona.data.listado[0].per_emailAlternativo
                datos.per_telefonoCelular = ObtenerPersona.data.listado[0].per_telefonoCelular
                datos.nombreestudiante = strNombres
                datos.nombreestado = datos.intEstado == 1 ? 'FIRMADO' : 'POR FIRMAR'
                listadoInformacion.push(datos)
            }
            return sendResponseProcesos(true, listadoInformacion, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoRecordEstadoPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }

}

module.exports.ProcesoListadoRecordCedula = async function (carrera, cedula) {
    try {
        var listadoInformacion = []
        var Informacion = await sqlmodelorecord.ListadoSolicitudesRecordCedula(carrera, tools.CedulaConGuion(cedula));
        if (Informacion.modelo) {
            for (let datos of Informacion.datos.data) {
                var PeriodoVigenteDatos = await sqlmodelocupos.ObtenerPeriodoDadoCodigo(datos.strCodPeriodo)
                var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutadinardap/obtenerpersona/" + tools.CedulaSinGuion(datos.strCedulaEstudiante), { httpsAgent: agent });
                var strNombres = ObtenerPersona.data.listado[0].per_nombres + " " + ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
                datos.per_email = ObtenerPersona.data.listado[0].per_email;
                datos.per_emailAlternativo = ObtenerPersona.data.listado[0].per_emailAlternativo
                datos.per_telefonoCelular = ObtenerPersona.data.listado[0].per_telefonoCelular
                datos.nombreestudiante = strNombres
                datos.nombreestado = datos.intEstado == 1 ? 'FIRMADO' : 'POR FIRMAR'
                datos.periodoacademico = PeriodoVigenteDatos.data[0].strDescripcion
                listadoInformacion.push(datos)
            }
            return sendResponseProcesos(true, listadoInformacion, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoRecordCedula', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }

}
module.exports.ProcesoEliminarSolicitudRecord = async function (carrera, idsolicitud, strperiodo, strcedula) {
    try {
        var listadoInformacion = []
        var Informacion = await sqlmodelorecord.EliminarSolicitudRecord(carrera, idsolicitud, strperiodo, tools.CedulaConGuion(strcedula));
        if (Informacion.modelo) {

            return sendResponseProcesos(true, listadoInformacion, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoEliminarSolicitudRecord', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }

}


module.exports.ProcesoEnvioCorreoSolicitudrecord = async function (objDatos) {
    try {
        var htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud Registrada - ESPOCH</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style> * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; } body { background-color: #f5f7fa; color: #333; line-height: 1.6; padding: 20px; } .container { max-width: 800px; margin: 0 auto; background-color: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); overflow: hidden; } .header { background: #a00000; color: white; padding: 20px 30px; border-bottom: 5px solid #f39c12; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; } .header-content { display: flex; align-items: center; gap: 20px; flex: 1; } .logo-container { display: flex; align-items: center; } .header-text { flex: 1; } .header h1 { font-size: 24px; margin-bottom: 5px; line-height: 1.3; } .header .subtitle { font-size: 16px; opacity: 0.9; display: flex; align-items: center; gap: 8px; } .content { padding: 30px; } /* NUEVO BANNER DE LEGALIZACIÓN */ .legalization-banner { background: #1a5276; color: white; padding: 15px 20px; border-radius: 8px; margin-bottom: 25px; display: flex; align-items: center; gap: 15px; flex-wrap: wrap; border-left: 6px solid #f1c40f; } .legalization-banner i { font-size: 28px; color: #f1c40f; } .legalization-banner .text { flex: 1; } .legalization-banner .text strong { font-size: 1.1em; display: block; color: #f1c40f; } .legalization-banner .badge { background: #f1c40f; color: #1a5276; padding: 6px 16px; border-radius: 30px; font-weight: bold; font-size: 0.9rem; white-space: nowrap; } .confirmation-message { background-color: #eaf2f8; border-left: 4px solid #3498db; padding: 20px; margin-bottom: 25px; border-radius: 0 5px 5px 0; } .confirmation-message i { color: #3498db; font-size: 24px; margin-right: 10px; } .pending-notification { background-color: #fef5e7; padding: 15px; border-radius: 8px; margin-bottom: 25px; border-left: 5px solid #f39c12; display: flex; align-items: center; gap: 10px; } .pending-notification i { color: #f39c12; font-size: 24px; } .link-section { background-color: #e8f6f3; padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center; } .tracking-link { display: inline-block; background-color: #27ae60; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 10px; transition: background-color 0.3s; } .tracking-link:hover { background-color: #219653; } .details-section h3 { color: #1a5276; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #eee; display: flex; gap: 10px; } .transaction-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 25px; } .info-card { background-color: #f8f9fa; border-radius: 8px; padding: 20px; border-top: 4px solid #3498db; } .info-item { display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #ddd; } .info-label { font-weight: 600; } .info-value { font-weight: 500; color: #1a5276; } .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 14px; } .status-pending { background-color: #fef5e7; color: #f39c12; border: 1px solid #f39c12; } .payment-info { background-color: #eaf2f8; padding: 20px; border-radius: 8px; margin-bottom: 30px; } .support-section { background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 25px; border-left: 4px solid #a00000; } .footer { background-color: #a00000; color: #d6eaf8; text-align: center; padding: 20px; font-size: 13px; } .footer-logo { display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 10px; } @media (max-width: 768px) { .header { flex-direction: column; text-align: center; padding: 20px; } .header-content { flex-direction: column; text-align: center; } .transaction-info { grid-template-columns: 1fr; } .tracking-link { display: block; width: 100%; } .header h1 { font-size: 20px; } .legalization-banner { flex-direction: column; text-align: center; } } @media (max-width: 480px) { .header h1 { font-size: 18px; } .content { padding: 20px; } } </style>
</head>
<body>
<div class="container">
    <div class="header">
        <div class="header-content">
            <div class="logo-container">
                <!-- Logo ESPOCH - Se reemplazará con imagen embebida en el correo -->
                <img src="cid:image" width="70" height="70" alt="Logo ESPOCH" style="border-radius: 5px;">
            </div>
            <div class="header-text">
                <h1>SISTEMA YANKAY INSTITUCIONAL</h1>
                <div class="subtitle">
                    <i class="fas fa-file-invoice"></i> Solicitud Record Académico
                </div>
            </div>
        </div>
    </div>
    <div class="content">
        <div class="legalization-banner">
            <i class="fas fa-graduation-cap"></i>
            <div class="text">
                <strong> ESTIMADO/A COORDINADOR/A:  ${objDatos.nombrescoordinador.toUpperCase()}</strong>
                <span>El Estudiante ${objDatos.nombresestudiante.toUpperCase()} acaba de realizar una solicitud de record académico por el sistema por favor proceda a su legalización.</span>
            </div>
        </div>
        <div class="confirmation-message">
            <i class="fas fa-check-circle"></i>
            <div>
            <strong>Carrera: ${objDatos.carrera.toUpperCase()}</strong><br>
                <strong>Estudiante: ${objDatos.nombresestudiante.toUpperCase()}</strong><br>
                <strong>Cédula: ${objDatos.cedulaestudiante}</strong><br>
                Generación de proceso de legalización Record Académico
            </div>
        </div>
        <div class="link-section">
            <h3><i class="fas fa-link"></i> Seguimiento de la Solicitud</h3>
            <p>Recuerde que puede dar seguimiento a la solicitud en el siguiente enlace:</p>
            <a href="#" class="tracking-link">
                <i class="fas fa-external-link-alt"></i> 
                SISTEMA YANKAY INSTITUCIONAL
            </a>
        </div>
        <div class="support-section">
            <h3><i class="fas fa-headset"></i> Soporte Técnico</h3>
            <p>Si tiene alguna duda o necesita asistencia, puede contactar al soporte técnico:</p>
            <p><strong>SOPORTE TÉCNICO </strong></p>
            <p><i class="fas fa-envelope"></i> soporte@espoch.edu.ec</p>
        </div>
    </div>
    <div class="footer">
        <div class="footer-logo">
            <img src="cid:image" width="40" height="40" alt="Logo ESPOCH">
        </div>
        <p>SISTEMA YANKAY INSTITUCIONAL</p>
        <p>© ESPOCH 2026 – Todos los derechos reservados</p>
    </div>
</div>
</body>
</html>`

        const base64String = tools.htmlToBase64(htmlContent);
        const lstReceptores = [{ "email": "saul.ibarra@espoch.edu.ec" }, { "email": objDatos.correocoordinador }]
        const contenido = { strAsunto: 'RECORD ACADEMICO', strBody: base64String, lstReceptores: lstReceptores }
        var Informacion = await procesoenviocorreo.ProcesoEnvioCorreo(contenido, lstReceptores);
    } catch (error) {
        logger.error('Error ProcesoEnvioCorreoSolicitudrecord', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }

}