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

module.exports = router;