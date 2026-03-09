
const express = require('express');
const router = express.Router();
const Request = require("request");
const procesosfuncionesgenerales = require('../procesosformato/procesosgenerales');
const { sendResponseServicios } = require('../herramientas/responseservice'); 

router.get('/ListadoCarrerasDadoFacultad/:facultad',async (req, res) => {
    const facultad = req.params.facultad;
    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoListadoCarrerasDadoFacultad(facultad);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos,'OK');
        }
        else {
            return sendResponseServicios(res, false, [],Informacion.message);
        }
    }catch (err) {
        logger.error('Error ListadoCarrerasDadoFacultad', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }
 
});

router.get('/VerifocarRutasMatriculasNuevoAlmacenamiento/:carrera/:periodo',async (req, res) => {
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoVerificarRutasMatriculasAlmacenamiento(carrera,periodo);
           return sendResponseServicios(res, true, Informacion.datos,'OK');
    }catch (error) {
       logger.error('Error VerifocarRutasMatriculasNuevoAlmacenamiento', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});

module.exports = router;