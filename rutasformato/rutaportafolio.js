
const express = require('express');
const router = express.Router();
const Request = require("request");
const procesosfuncionesportafolio = require('../procesosformato/procesoportafolio');
const { sendResponseServicios } = require('../herramientas/responseservice'); 
const logger = require('./../herramientas/logger');

router.get('/MatriculdasTodasEstuidanteCarrera/:carrera/:cedula',async (req, res) => {
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    try {
        var Informacion=await  procesosfuncionesportafolio.ProcesoMatriculasTodasEstudianteCarrera(carrera,cedula);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos,'OK');
        }
        else {
            return sendResponseServicios(res, true, [],Informacion.message);
        }
    }catch (error) {
        logger.error('Error MatriculdasTodasEstuidanteCarrera', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }
 
});

router.get('/SolicitudesTercerasTodas/:carrera/:cedula',async (req, res) => {
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    try {
        var Informacion=await  procesosfuncionesportafolio.ProcesoEncontrarSolicitudesterceraTodas(carrera,cedula);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos,'OK');
        }
        else {
            return sendResponseServicios(res, true, [],Informacion.message);
        }
    }catch (error) {
        logger.error('Error SolicitudesTercerasTodas', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }
 
});
router.get('/SolicitudesValidacionesTodas/:carrera/:cedula',async (req, res) => {
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    try {
        var Informacion=await  procesosfuncionesportafolio.ProcesoEncontrarSolicitudesValidacionesTodas(carrera,cedula);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos,'OK');
        }
        else {
            return sendResponseServicios(res, true, [],Informacion.message);
        }
    }catch (error) {
        logger.error('Error SolicitudesValidacionesTodas', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }
 
});
router.get('/SolicitudesMovilidadesTodas/:carrera/:cedula',async (req, res) => {
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    try {
        var Informacion=await  procesosfuncionesportafolio.ProcesoEncontrarSolicitudesMovilidadesTodas(carrera,cedula);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos,'OK');
        }
        else {
            return sendResponseServicios(res, true, [],Informacion.message);
        }
    }catch (error) {
        logger.error('Error SolicitudesMovilidadesTodas', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }
 
});

router.get('/SolicitudesRetirosTodos/:carrera/:cedula',async (req, res) => {
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    try {
        var Informacion=await  procesosfuncionesportafolio.ProcesoEncontrarSolicitudesRetirosTodos(carrera,cedula);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos,'OK');
        }
        else {
            return sendResponseServicios(res, true, [],Informacion.message);
        }
    }catch (error) {
        logger.error('Error SolicitudesRetirosTodos', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }
 
});
module.exports = router;