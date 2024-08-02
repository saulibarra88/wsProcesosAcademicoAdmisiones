const express = require('express');
const router = express.Router();
const Request = require("request");

const procesografico = require('../rutas/ProcesosGraficos');

router.post('/GraficoParciales1/',async (req, res) => {
    const carrera = req.body.carrera;
    const periodo = req.body.periodo;
    const nivel = req.body.nivel;
    const paralelo = req.body.paralelo;
    const codMateria = req.body.codMateria;
    const idreglamento = req.body.idreglamento;
    const cedula = req.body.cedula;
    const nombres = req.body.nombres;
    const asignatura = req.body.asignatura;
    try {
        var respuesta=await  procesografico.Graficopdf1(carrera, periodo,nivel,paralelo,codMateria, cedula, idreglamento,nombres,asignatura);
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
router.post('/GraficoParciales2/',async (req, res) => {
    const carrera = req.body.carrera;
    const periodo = req.body.periodo;
    const nivel = req.body.nivel;
    const paralelo = req.body.paralelo;
    const codMateria = req.body.codMateria;
    const idreglamento = req.body.idreglamento;
    const cedula = req.body.cedula;
    const nombres = req.body.nombres;
    const asignatura = req.body.asignatura;
    try {
        var respuesta=await  procesografico.Graficopdf2(carrera, periodo,nivel,paralelo,codMateria, cedula, idreglamento,nombres,asignatura);
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

router.post('/GraficoParcialesR/',async (req, res) => {
    const carrera = req.body.carrera;
    const periodo = req.body.periodo;
    const nivel = req.body.nivel;
    const paralelo = req.body.paralelo;
    const codMateria = req.body.codMateria;
    const idreglamento = req.body.idreglamento;
    const cedula = req.body.cedula;
    const nombres = req.body.nombres;
    const asignatura = req.body.asignatura;
    try {
        var respuesta=await  procesografico.GraficopdfR(carrera, periodo,nivel,paralelo,codMateria, cedula, idreglamento,nombres,asignatura);
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
router.get('/ReporteNoMatriculado/:carrera/:periodo1/:periodo2/:cedula',async (req, res) => {
    const periodo1 = req.params.periodo1;
    const periodo2 = req.params.periodo2;
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    try {
        var respuesta=await  procesografico.ReporteNoMatriculado(carrera,periodo1,periodo2,cedula);
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