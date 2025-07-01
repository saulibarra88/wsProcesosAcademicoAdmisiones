const express = require('express');
const router = express.Router();
const Request = require("request");

const funcionesprocesosmovilidadconfiguraciones = require('../procesos/procesosmovilidadconfiguraciones');

router.get('/ListadoFacultadesAdministracion/', async (req, res) => {

    try {
        var respuesta = await funcionesprocesosmovilidadconfiguraciones.ProcesoListadoFacultadesAdministracion();
        res.json({
            success: true,
            Informacion: respuesta.data
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
router.get('/ListadoFacultadesActivas/', async (req, res) => {

    try {
        var respuesta = await funcionesprocesosmovilidadconfiguraciones.ProcesoListadoFacultadesActivas();
        res.json({
            success: true,
            Informacion: respuesta.data
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
router.get('/ListadoEscuelaAdministracion/:facultad', async (req, res) => {
    const facultad = req.params.facultad;
    try {
        var respuesta = await funcionesprocesosmovilidadconfiguraciones.ProcesoListadoEscuelaAdministracion(facultad);
        res.json({
            success: true,
            Informacion: respuesta.data
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