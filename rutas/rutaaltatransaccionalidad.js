const express = require('express');
const router = express.Router();
const Request = require("request");

const pruebasInformacion = require('../rutas/procesoaltatransacionalidad');


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

router.get('/ListadoEstudiantesPeriodo/:carrera/:periodo',async (req, res) => {
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    try {
        var respuesta=await  pruebasInformacion.ListadoEstudiantesPeriodosCarrera(carrera,periodo);
        
        res.json({
            success: true,
            Informacion:  respuesta
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

router.get('/FotosNivelacionMatriculas/:periodo',async (req, res) => {
    const periodo = req.params.periodo;
    try {
        var respuesta=await  pruebasInformacion.ProcesoFotoMatriculasNivelacionInstitucional(periodo);
        
        res.json({
            success: true,
            Informacion:  respuesta
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

router.get('/FinancieroProcesoDatos/',async (req, res) => {
    try {
        var respuesta=await  pruebasInformacion.ProcesoFinancieroDatos();
        
        res.json({
            success: true,
            Informacion:  respuesta
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