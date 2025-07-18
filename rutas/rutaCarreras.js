const express = require('express');
const router = express.Router();
const Request = require("request");

const procesoMigracion = require('../rutas/ProcesosMigracionNivelacion');
const procesoCupo = require('../modelo/procesocupos');
const reportes = require('../rutas/reportesadmisiones');
const procesosadmisiones = require('../rutas/ProcesosAdmisiones');
const carrerasprocesosInformacion = require('./procesoscarrerasespoch');
const procesosAdministrativo = require('../procesos/Procesosadministrativos');
const reportesexcelcarreras = require('../procesos/reportesexcelcarreras');
const procesosmatricula = require('../procesos/procesosmatricula');
const pruebasInformacion = require('./procesosespochcarrera');

router.get('/ListadoPensumCarrera/:carrera/',async (req, res) => {
    const carrera = req.params.carrera;
    try {
        var Informacion=await  carrerasprocesosInformacion.ProcesoListadoPensumCarreras(carrera);
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
        var Informacion=await  carrerasprocesosInformacion.ProcesoListadoPensumMateriasarreras(carrera,pensum);
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
        var Informacion=await  carrerasprocesosInformacion.ProcesoListadoEstuidantesApellidosMaters(apellidos);
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
        var Informacion=await  carrerasprocesosInformacion.ListadoActasFinCicloNoGenerada(carrera,periodo);
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
        var Informacion=await  carrerasprocesosInformacion.ReporteExcelActasNoGenradas(carrera,periodo);
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
        var Informacion=await  carrerasprocesosInformacion.ProcesoActivacionBotonCreacionPerioodo(carrera,periodo,pemsun);
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
        var Informacion=await  carrerasprocesosInformacion.ProcesoListadoMatriculasFirmadasPorNivel(carrera,periodo,nivel);
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
router.get('/ReporteExcelMatriculasCarrerasIndividual/:carrera/:periodo/:estado',async (req, res) => {
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    const estado = req.params.estado;
    try {
        var Informacion=await  pruebasInformacion.ProcesoReporteExcelMatriculasCarrerasIndividual(carrera,periodo,estado);
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
router.get('/ReporteExcelMatriculasCarrerasTodasInstitucional/:periodo/:estado',async (req, res) => {
    const periodo = req.params.periodo;
    const estado = req.params.estado;
    try {
 
   
        var Informacion= await  pruebasInformacion.ProcesoReporteExcelMatriculasCarrerasTodasInstitucionales(periodo,estado);
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
router.get('/ReporteExcelMatriculasNivelacionTodasInstitucional/:periodo/:estado',async (req, res) => {
    const periodo = req.params.periodo;
    const estado = req.params.estado;
    try {
     
        
        var Informacion=await  pruebasInformacion.ProcesoReporteExcelMatriculasNivelacionInstitucional(periodo,estado);
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

router.get('/ReporteExcelUltimoNivelCarrerasTodasInstitucional/:periodo/:estado',async (req, res) => {
    const periodo = req.params.periodo;
    const estado = req.params.estado;
    try {
   
        var Informacion=await  carrerasprocesosInformacion.ProcesoReporteExcelUltimoNivelMatriculasCarrerasTodasInstitucional(periodo,estado);
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

router.get('/ReporteExcelMatriculasAdmisionesInstitucional/:periodo',async (req, res) => {
    const periodo = req.params.periodo;
    try {
      
        var Informacion= await pruebasInformacion.ProcesoReporteExcelMatriculasAdmisionesnstitucional(periodo);
        res.json({
            success: true,
            Informacion:Informacion,
        });
    }catch (err) {
        console.log('Error: ' + err);ee
        return res.json(
             {
                success: false,
                mensaje:'Error en el registro' + err
            }
        );
    }
 
});

router.get('/ListadoPeriodosCarreras/:carrera/',async (req, res) => {
    const carrera = req.params.carrera;
    try {
        var Informacion=await  carrerasprocesosInformacion.ProcesoListadoPeriodosCarreras(carrera);
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
router.get('/ObtenerPeriodosVigenteCarreras/:carrera/',async (req, res) => {
    const carrera = req.params.carrera;
    try {
        var Informacion=await  carrerasprocesosInformacion.ProcesoPeriodosVigenteCarreras(carrera);
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
router.get('/ListadoEstuidantesMatriculadosPeriodos/:carrera/:periodo',async (req, res) => {
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    try {
        var Informacion=await  carrerasprocesosInformacion.ProcesoListadoEstuidantesMatriculados(carrera,periodo);
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