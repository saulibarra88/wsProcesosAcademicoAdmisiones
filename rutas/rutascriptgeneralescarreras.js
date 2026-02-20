const express = require('express');
const router = express.Router();
const Request = require("request");

const procesoMigracion = require('../rutas/ProcesosMigracionNivelacion');
const procesoCupo = require('../modelo/procesocupos');
const reportes = require('../rutas/reportesadmisiones');
const procesosadmisiones = require('../rutas/ProcesosAdmisiones');
const procesosCarreras = require('./procesoscarrerasespoch');
const tools = require('../rutas/tools');
const procesosScript = require('../rutas/procesosscriptcarreras');



router.get('/ProcesosPruebas/:periodo/',async (req, res) => {
    const periodo = req.params.periodo;

    try {
        
        var respuesta=await  procesoMigracion.ProcesoPruebas(periodo);
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
router.get('/ProcesosNotasRecuperacion/',async (req, res) => {


    try {
        
        var respuesta=await  procesosScript.ProcesoActualizacionNotasRecuperacion();
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
router.get('/ProcesosEliminacionMatriculasPendientes/:periodo',async (req, res) => {
    const periodo = req.params.periodo;

    try {
        
        var respuesta=await  procesosScript.ProcesoEliminacionMatriculasPendientes(periodo);
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

router.get('/ProcesosVerificacionInconsistenciaMatricula/:carrera/:periodoactual/:periodoanterior',async (req, res) => {
    const carrera = req.params.carrera;
    const periodoactual = req.params.periodoactual;
    const periodoanterior = req.params.periodoanterior;

    try {
        
        var respuesta=await  procesosScript.ProcesoVerificacionMatriculaAsignaturas(carrera,periodoactual,periodoanterior);
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