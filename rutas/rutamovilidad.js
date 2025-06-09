const express = require('express');
const router = express.Router();
const Request = require("request");

const funcionesprocesosmovilidad = require('../procesos/procesosmovilidad');



router.get('/CarrerasDadoFacultadHomologaciones/:periodo/:codFacultad',async (req, res) => {
    const periodo = req.params.periodo;
    const codFacultad = req.params.codFacultad;
    try {
        var respuesta=await  funcionesprocesosmovilidad.ProcesoCarrerasDadoFacultadHomologacion(periodo,codFacultad);
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

router.get('/DatosEstudiantesCambioCarrera/:carrera/:codEstudiante/:nivel',async (req, res) => {
    const carrera = req.params.carrera;
    const codEstudiante = req.params.codEstudiante;
    const nivel = req.params.nivel;
    try {
        var respuesta=await  funcionesprocesosmovilidad.ProcesoDatosEstudianteCambioCarrera(carrera,codEstudiante,nivel);
        res.json({
            success: true,
            Informacion:respuesta
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