const express = require('express');
const router = express.Router();
const Request = require("request");


router.get('/personaPorDocumento/:strCedula', (req, res) => {
    const strCedula = req.params.strCedula;
    var datos;
    Request.get("http://servicioscentral.espoch.edu.ec/Central/ServiciosPersona.svc/ObtenerPorDocumento/" + strCedula, (error, response, body) => {
        if (body == "") {
            return res.json({
                success: false
            });
        } else {
            datos = JSON.parse((body))
            res.json({
                success: true,
                datos
            });
        }
    });
});
router.get('/personaPorApellido/:strApellido', (req, res) => {
    const strApellido = req.params.strApellido;
    var datos;
    Request.get("http://servicioscentral.espoch.edu.ec/Central/ServiciosPersona.svc/ObtenerPorApellido/" + strApellido, (error, response, body) => {
        if (body == "") {
            return res.json({
                success: false
            });
        } else {
            datos = JSON.parse((body))
            res.json({
                success: true,
                datos
            });
        }
    });
});

router.get('/personaPorCorreo/:strCorreo', (req, res) => {
    const strCorreo = req.params.strCorreo;
    var datos;
    Request.get("http://servicioscentral.espoch.edu.ec/Central/ServiciosPersona.svc/ObtenerPorEmail/" + strCorreo, (error, response, body) => {
        if (body == "") {
            return res.json({
                success: false
            });
        } else {
            datos = JSON.parse((body))
            res.json({
                success: true,
                datos
            });
        }
    });
});
router.get('/personaPorId/:strId', (req, res) => {
    const strId = req.params.strId;
    var datos;
    Request.get("http://servicioscentral.espoch.edu.ec/Central/ServiciosDocumentoPersonal.svc/ObtenerDocumentoActivoPorPersona/" + strId, (error, response, body) => {
        if (body == "") {
            return res.json({
                success: false
            });
        } else {
            datos = JSON.parse((body))
            res.json({
                success: true,
                datos
            });
        }
    });
});
router.get('/validarCas/:id', (req, res) => {
    const id = req.params.id;
    const https = require('https');
    const url = "https://seguridad.espoch.edu.ec/cas/p3/serviceValidate?" + id;
    var datos;
    const request = require('request');
    request.get({
        rejectUnauthorized: false,
        url: url,
        json: true
    }, function (error, response, body) {
        return res.json(body);
    });
});
router.get('/personaCargo/:id', (req, res) => {
    const id = req.params.id;
    const https = require('https');
    const url = "https://swtalentohumano.espoch.edu.ec/funcionariosWS/wstthh/funcionariopuesto/" + id;
    var datos;
    const request = require('request');
    request.get({
        rejectUnauthorized: false,
        url: url,
        json: true
    }, function (error, response, body) {
        return res.json({ success: true, cargo: body });
    });
});
router.get('/personaGrupo/:op/:param1/:param2/:param3', (req, res) => {
    const opc = req.params.op;
    const cond1 = req.params.param1;
    const cond2 = req.params.param2;
    const cond3 = req.params.param3;
    const https = require('https');
    const url = "https://swcentromedico.espoch.edu.ec/rutaUsuario/getInfoOtros/" + opc + "/" + cond1 + "/" + cond2 + "/" + cond3;
    var datos;
    const request = require('request');
    request.get({
        rejectUnauthorized: false,
        url: url,
        json: true
    }, function (error, response, body) {
        return res.json(body);
    });
});


router.post('/envioCorreo', (req, res) => {
    var request = require('request');
    const strAsunto = req.body.strAsunto;
    const strCodigoSistema = req.body.strCodigoSistema;
    const strBody = req.body.strBody;
    const lstReceptores = req.body.lstReceptores;
    const lstArchivosAdjuntos = req.body.lstArchivosAdjuntos;
    var jsonDataObj = req.body;
    request.post({
        url: 'https://emailrelay.espoch.edu.ec/WebCorreoInstitucional/ServiciosCorreos/EnviarCorreo',
        body: jsonDataObj,
        rejectUnauthorized: false,
        json: true
    }, function (error, response, body) {
        res.json({
            success: body.success,
            mensajes: body.mensaje
        });
    });
});
    
module.exports = router;