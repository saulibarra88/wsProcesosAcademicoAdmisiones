
const express = require('express');
const router = express.Router();
const Request = require("request");
const ProcesosAdmisiones = require('../rutas/ProcesosAdmisiones');
const ReportesAdmisiones = require('../rutas/reportesadmisiones');


router.get('/ObtenerListadoEstudianteAdmisiones/:dbBaseCarrera/:periodo/:idestado',async (req, res) => {
    const dbBaseCarrera = req.params.dbBaseCarrera;
    const periodo = req.params.periodo;
    const idestado = req.params.idestado;
    try {
        var respuesta=await  ProcesosAdmisiones.ListadoEstudiantes(dbBaseCarrera,periodo,idestado);
     
        if (respuesta.length>0) {
            return res.json({
                success: true,
                informacion: respuesta
            });
        } else {
            
            res.json({
                success: true,
                informacion:[]
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

router.get('/ObtenerListadoEstadosAdmisiones/:dbBaseCarrera/:periodo',async (req, res) => {
    const dbBaseCarrera = req.params.dbBaseCarrera;
    const periodo = req.params.periodo;
    try {
        var respuesta=await  ProcesosAdmisiones.ListadoEstadosAdmisiones(dbBaseCarrera,periodo);
     
        if (respuesta.length>0) {
            return res.json({
                success: true,
                informacion: respuesta
            });
        } else {
            
            res.json({
                success: true,
                informacion:[]
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

router.get('/pdfComproanteCupoAdmisiones/:acuId',async (req, res) => {
    const acuId = req.params.acuId;
    try {
        var respuesta=await  ProcesosAdmisiones.pdfComprobanteCupo(acuId);
     
        return res.json({
            success: true,
            informacion: respuesta
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
router.post('/ReportepdfListadoEstudiantesAdmisiones/',async (req, res) => {
    const listado = req.body.listado;
    const dbBaseCarrera = req.body.dbBaseCarrera;
    const cedulaUsuario = req.body.cedulaUsuario;
    try {
        var respuesta=await  ReportesAdmisiones.PdfListadosEstudiantesAdmisiones(listado,dbBaseCarrera,cedulaUsuario);
     
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
router.post('/ReportepdfListadoAspiranteAdmisiones/',async (req, res) => {
    const listado = req.body.listado;
    const dbBaseCarrera = req.body.dbBaseCarrera;
    const cedulaUsuario = req.body.cedulaUsuario;
    try {
        var respuesta=await  ReportesAdmisiones.PdfListadosaspiranteAdmisiones(listado,dbBaseCarrera,cedulaUsuario);
     
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
router.post('/ReporteexcelListadoEstudiantesAdmisiones/',async (req, res) => {
    const listado = req.body.listado;
    const dbBaseCarrera = req.body.dbBaseCarrera;
    const cedulaUsuario = req.body.cedulaUsuario;
    try {
        var respuesta=await  ReportesAdmisiones.ExcelListadosEstudiantesAdmisiones(listado,dbBaseCarrera,cedulaUsuario);
     
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
router.post('/ReporteexcelListadoAspiranteAdmisiones/',async (req, res) => {
    const listado = req.body.listado;
    const dbBaseCarrera = req.body.dbBaseCarrera;
    const cedulaUsuario = req.body.cedulaUsuario;
    try {
        var respuesta=await  ReportesAdmisiones.ExcelListadosAspiranteAdmisiones(listado,dbBaseCarrera,cedulaUsuario);
     
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
router.get('/ObtenerListadoAspiranteAdmisiones/:dbBaseCarrera/:periodo',async (req, res) => {
    const dbBaseCarrera = req.params.dbBaseCarrera;
    const periodo = req.params.periodo;
    try {
        var respuesta=await  ProcesosAdmisiones.ListadoAspiranteAdmisiones(dbBaseCarrera,periodo);
     
        if (respuesta.length>0) {
            return res.json({
                success: true,
                informacion: respuesta
            });
        } else {
            
            res.json({
                success: true,
                informacion:[]
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
router.get('/ObtenerPeriodoVigenteAdmisiones/',async (req, res) => {

    try {
        var respuesta=await  ProcesosAdmisiones.ObtenerPeriodoVigenteAdmisiones();
     
        if (respuesta.length>0) {
            return res.json({
                success: true,
                informacion: respuesta
            });
        } else {
            
            res.json({
                success: true,
                informacion:[]
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
module.exports = router; 