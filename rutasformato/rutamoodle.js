
const express = require('express');
const router = express.Router();

const procesosmoodlefunciones = require('../procesosformato/procesomoodle');
const { sendResponseServicios } = require('../herramientas/responseservice'); 
const logger = require('./../herramientas/logger');

router.get('/LisatdoDictadoAsignaturaCarrera/:dbcarrera/:periodo',async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    const periodo = req.params.periodo;
    try {
        var Informacion=await  procesosmoodlefunciones.ProcesoModleMigracionDatosDictadoCarrera(dbcarrera,periodo);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos,'OK');
        }
        else {
            return sendResponseServicios(res, false, [],Informacion.message);
        }
    }catch (error) {
        logger.error('Error LisatdoDictadoAsignaturaCarrera', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],error.message);
    }
 
});


module.exports = router;