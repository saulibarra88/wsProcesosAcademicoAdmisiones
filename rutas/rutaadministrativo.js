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


router.get('/ListadoConfigHomologacionesFechas/:periodo/',async (req, res) => {
    const periodo = req.params.periodo;
    try {
        var Informacion=await  procesosAdministrativo.ListarConfiguracionesActivasPeriodo(periodo);
        res.json({
            success: true,
            Informacion:Informacion.resultado,
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

router.get('/ListadoConfigHomologacionesCarreras/:dbcarrera/',async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    try {
        var Informacion=await  procesosAdministrativo.ListarConfiguracionesHomoCarrerasHistoral(dbcarrera);
        res.json({
            success: true,
            Informacion:Informacion.resultado,
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

router.get('/ObtenerCarreraVigenteHomologacion/:dbcarrera/:periodo',async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    const periodo = req.params.periodo;
    try {
        var Informacion=await  procesosAdministrativo.ProcesoObtenerCarreraVigenteHomologacion(dbcarrera,periodo);
        res.json({
            success: true,
            Informacion:Informacion.resultado,
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
router.get('/ListadoRetirosInstitucionales/:periodo/:cedula',async (req, res) => {
    const cedula = req.params.cedula;
    const periodo = req.params.periodo;
    try {
        var Informacion=await  reportesexcelcarreras.ProcesoExcelListadoEstudiantesRetirosInstitucional(periodo,cedula);
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

router.get('/ListadoRetirosCarreras/:periodo/:dbCarrera',async (req, res) => {
    const periodo = req.params.periodo;
    const dbCarrera = req.params.dbCarrera;
    try {
        var Informacion=await  reportesexcelcarreras.ProcesoListadoEstudiantesRetirosCarrera(periodo,dbCarrera);
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
router.get('/ListadoRetirosCarrerasPdf/:periodo/:dbCarrera/:cedula',async (req, res) => {
    const periodo = req.params.periodo;
    const dbCarrera = req.params.dbCarrera;
    const cedula = req.params.cedula;
    try {
        var Informacion=await  reportesexcelcarreras.ProcesoListadoEstudiantesRetirosCarreraPdf(periodo,dbCarrera,cedula);
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
router.get('/ListadoRetirosCarrerasExcel/:periodo/:dbCarrera',async (req, res) => {
    const periodo = req.params.periodo;
    const dbCarrera = req.params.dbCarrera;
    try {
        var Informacion=await  reportesexcelcarreras.ProcesoExcelListadoEstudiantesRetirosCarrerraExcel(periodo,dbCarrera);
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
router.post('/IngresoHomologacionFecha/',async (req, res) => {
    var datos={
        chf_fechainicio:req.body.chf_fechainicio,
        chf_horainicio:req.body.chf_horainicio,
        chf_fechafin:req.body.chf_fechafin,
        chf_horafin:req.body.chf_horafin,
        chf_periodo:req.body.chf_periodo,
        chf_ruta:req.body.chf_ruta,
        chf_proceso:req.body.chf_proceso,
        chf_peridregistro:req.body.chf_peridregistro,
        chf_regid:req.body.chf_regid,
        chf_resolucion:req.body.chf_resolucion
    }
    const CarrerasListado = req.body.Carreras;
    try {
        var respuesta=await  procesosAdministrativo.InsertarHomologacionFechas(CarrerasListado,datos);
     
        if (respuesta !=" ") {
            return res.json({
                success: true,
                informacion: respuesta
            });
        } else {
            
            res.json({
                success: true,
                informacion:null
            });
        }
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

router.post('/RetiroestudianteSinMatricula/',async (req, res) => {

    var datos=req.body
    try {
        var respuesta=await  procesosmatricula.ProcesoRegistroRetiroSinmatricula(datos);
        res.json({
            success: true,
            respuesta
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