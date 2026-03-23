
const express = require('express');
const router = express.Router();
const Request = require("request");
const procesosfuncionesrecord = require('../procesosformato/procesosrecord');
const { sendResponseServicios } = require('../herramientas/responseservice'); 
const logger = require('./../herramientas/logger');

router.get('/ListadoSolicitudesRecordPeriodo/:carrera/:periodo/:estado',async (req, res) => {
    const periodo = req.params.periodo;
    const estado = req.params.estado;
    const carrera = req.params.carrera;
    try {
        var Informacion=await  procesosfuncionesrecord.ProcesoListadoRecordEstadoPeriodo(carrera,periodo,estado);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos,'OK');
        }
        else {
            return sendResponseServicios(res, true, [],Informacion.message);
        }
    }catch (error) {
        logger.error('Error ListadoSolicitudesRecord', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }
 
});

router.get('/ListadoSolicitudesRecordCedula/:carrera/:cedula',async (req, res) => {
    const cedula = req.params.cedula;
    const carrera = req.params.carrera;
    try {
        var Informacion=await  procesosfuncionesrecord.ProcesoListadoRecordCedula(carrera,cedula);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos,'OK');
        }
        else {
            return sendResponseServicios(res, true, [],Informacion.message);
        }
    }catch (error) {
        logger.error('Error ListadoSolicitudesRecord', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }
 
});
router.get('/EliminarSolicitudRecord/:carrera/:periodo/:cedula/:idsolicitud',async (req, res) => {
    const cedula = req.params.cedula;
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    const idsolicitud = req.params.idsolicitud;
    try {
        var Informacion=await  procesosfuncionesrecord.ProcesoEliminarSolicitudRecord(carrera,idsolicitud,periodo,cedula);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos,'OK');
        }
        else {
            return sendResponseServicios(res, true, [],Informacion.message);
        }
    }catch (error) {
        logger.error('Error EliminarSolicitudRecord', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }
 
});
module.exports = router;