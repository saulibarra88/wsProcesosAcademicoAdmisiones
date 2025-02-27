const express = require('express');
const router = express.Router();
const Request = require("request");

const procesoMigracion = require('../rutas/ProcesosMigracionNivelacion');
const procesoCupo = require('../modelo/procesocupos');
const reportes = require('../rutas/reportesadmisiones');
const procesosadmisiones = require('../rutas/ProcesosAdmisiones');
const procesosCarreras = require('../rutas/procesoscarreras');



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


module.exports = router;