
const express = require('express');
const router = express.Router();

const procesosfuncionespagosmatriculas = require('../procesosformato/procesospagosmatriculas');
const { sendResponseServicios } = require('../herramientas/responseservice'); 
const logger = require('./../herramientas/logger');


router.get('/Obtener60AsignaturasMatricula/:carrera/:periodo/:cedula',async (req, res) => {
    const cedula = req.params.cedula;
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    try {
        var Informacion=await  procesosfuncionespagosmatriculas.ProcesosEstudiante60AsignaturasMatricula(carrera,periodo,cedula);
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


module.exports = router;