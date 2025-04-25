const express = require('express');
const router = express.Router();
const Request = require("request");

const procesoMigracion = require('../rutas/ProcesosMigracionNivelacion');
const procesoCupo = require('../modelo/procesocupos');
const reportes = require('../rutas/reportesadmisiones');
const procesosadmisiones = require('../rutas/ProcesosAdmisiones');
const procesosCarreras = require('../rutas/procesoscarreras');
const procesosAdministrativo = require('../procesos/Procesosadministrativos');
const reportesexcelcarreras = require('../procesos/reportesexcelcarreras');
const procesosmatricula = require('../procesos/procesosmatricula');


router.get('/ListadoPensumCarrera/:carrera/',async (req, res) => {
    const carrera = req.params.carrera;
    try {
        var Informacion=await  procesosCarreras.ProcesoListadoPensumCarreras(carrera);
        res.json({
            success: true,
            listado:Informacion,
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
router.get('/ListadoPensumMateriasCarreras/:carrera/:pensum',async (req, res) => {
    const carrera = req.params.carrera;
    const pensum = req.params.pensum;
    try {
        var Informacion=await  procesosCarreras.ProcesoListadoPensumMateriasarreras(carrera,pensum);
        res.json({
            success: true,
            listado:Informacion,
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
router.get('/ListadoEstudiantesApellidos/:apellidos/',async (req, res) => {
    const apellidos = req.params.apellidos;
    try {
        var Informacion=await  procesosCarreras.ProcesoListadoEstuidantesApellidosMaters(apellidos);
        res.json({
            success: true,
            Informacion:Informacion,
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

router.get('/ListadoActasFinCicloNoGeneradas/:carrera/:periodo',async (req, res) => {
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    try {
        var Informacion=await  procesosCarreras.ListadoActasFinCicloNoGenerada(carrera,periodo);
        res.json({
            success: true,
            Informacion:Informacion,
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
router.get('/ReporteExcelActasNoGeneradas/:carrera/:periodo',async (req, res) => {
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    try {
        var Informacion=await  procesosCarreras.ReporteExcelActasNoGenradas(carrera,periodo);
        res.json({
            success: true,
            Informacion:Informacion,
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

router.get('/ActivacionBotonCreacionPeriodo/:carrera/:periodo/:pemsun',async (req, res) => {
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    const pemsun = req.params.pemsun;
    try {
        var Informacion=await  procesosCarreras.ProcesoActivacionBotonCreacionPerioodo(carrera,periodo,pemsun);
        res.json({
            success: true,
            Informacion:Informacion,
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

router.get('/ListadoMatriculasFirmadasPorNivel/:carrera/:periodo/:nivel',async (req, res) => {
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    const nivel = req.params.nivel;
    try {
        var Informacion=await  procesosCarreras.ProcesoListadoMatriculasFirmadasPorNivel(carrera,periodo,nivel);
        res.json({
            success: true,
            Informacion:Informacion,
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
router.get('/ReporteExcelMatriculasCarreras/:carrera/:periodo/:estado',async (req, res) => {
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    const estado = req.params.estado;
    try {
        var Informacion=await  procesosCarreras.ProcesoReporteExcelMatriculasCarreras(carrera,periodo,estado);
        res.json({
            success: true,
            Informacion:Informacion,
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