const express = require('express');
const router = express.Router();
const Request = require("request");

const procesoMigracion = require('../rutas/ProcesosMigracionNivelacion');
const procesoNivelacion = require('../procesos/procesosnivelacion');
const reportes = require('../rutas/reportesadmisiones');


//PROCESO DE ACTIVAR CUPO A TODOS EN EL
router.get('/ProcesoVerificarMatriculasInscripciones/:periodo/:cedula/',async (req, res) => {
    const periodo = req.params.periodo;
    const cedula = req.params.cedula;
    try {
        var respuesta=await  procesoNivelacion.ProcesoVerificarMatriculasIncripciones(periodo,cedula);
        res.json({
            success: true,
            informacion:respuesta
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en el registro' + err
            }
        );
    }
 
});

//PROCESO DE ACTIVAR CUPO A TODOS EN EL PERIODO P0038
router.get('/ProcesoMatriculadosDefinitivasPeriodos/:periodo/:cedula/',async (req, res) => {
    const periodo = req.params.periodo;
    const cedula = req.params.cedula;
    try {
        var respuesta=await  procesoNivelacion.ProcesoMatriculadosDefinitivas(periodo,cedula);
        res.json({
            success: true,
            informacion:respuesta
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en el registro' + err
            }
        );
    }
 
});


module.exports = router;