const express = require('express');
const router = express.Router();
const Request = require("request");

const funcionesprocesosmovilidadasignatura = require('../procesos/procesomovilidadasignaturas');

router.post('/InsertarAsignaturasMovilidad/', async (req, res) => {

        const { objdatos } = req.body;
    try {
        var respuesta = await funcionesprocesosmovilidadasignatura.ProcesoInsertarAsignaturaMovilidad(objdatos);
        res.json({
            success: true,
            Informacion: respuesta
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el registro' + err
            }
        );
    }

});

router.post('/ObtenerAsignaturaMovilidadDocente/', async (req, res) => {

        const { objdatos } = req.body;
    try {
        var respuesta = await funcionesprocesosmovilidadasignatura.ProcesoObtenerAsignaturaMovilidadDocente(objdatos);
        res.json({
            success: true,
            Informacion: respuesta
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el registro' + err
            }
        );
    }

});
router.post('/ObtenerAsignaturaMovilidadNivelParalelo/', async (req, res) => {

        const { carrera, objdatos } = req.body;
    try {
        var respuesta = await funcionesprocesosmovilidadasignatura.ProcesoObtenerAsignaturaMovilidadNivelParalelo(carrera, objdatos);
        res.json({
            success: true,
            Informacion: respuesta
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el registro' + err
            }
        );
    }

});
router.post('/EliminarAsignaturaMovilidadDocente/', async (req, res) => {

        const { carrera, objdatos } = req.body;
    try {
        var respuesta = await funcionesprocesosmovilidadasignatura.ProcesoEliminarAsignaturaMovilidadDocente(carrera, objdatos);
        res.json({
            success: true,
            Informacion: respuesta
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el registro' + err
            }
        );
    }

});
router.post('/DesactivarAsignaturaMovilidadDocente/', async (req, res) => {

        const {objdatos } = req.body;
    try {
        var respuesta = await funcionesprocesosmovilidadasignatura.ProcesoDesactivarAsignaturaMovilidadDocente(objdatos);
        res.json({
            success: true,
            Informacion: respuesta
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el registro' + err
            }
        );
    }

});
router.post('/ObtenerDatosDocenteAsignaturasCarrera/', async (req, res) => {

        const { carrera, cedula,periodo } = req.body;
    try {
        var respuesta = await funcionesprocesosmovilidadasignatura.ProcesoObtenerAsignaturasCarreraDocente(carrera, cedula, periodo);
        res.json({
            success: true,
            Informacion: respuesta
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el registro' + err
            }
        );
    }

});
module.exports = router;
