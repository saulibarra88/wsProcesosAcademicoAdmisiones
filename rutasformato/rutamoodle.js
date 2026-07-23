
const express = require('express');
const router = express.Router();

const procesosmoodlefunciones = require('../procesosformato/procesomoodle');
const { sendResponseServicios } = require('../herramientas/responseservice'); 
const logger = require('./../herramientas/logger');

router.get('/LisatdoDictadoAsignaturaCarrera/:dbcarrera/:periodo',async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    const periodo = req.params.periodo;
    try {
        var Informacion=await  procesosmoodlefunciones.ProcesoModleMigracionDatosDictadoCarrera(dbcarrera,periodo);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos,'OK');
        }
        else {
            return sendResponseServicios(res, false, [],Informacion.message);
        }
    }catch (error) {
        logger.error('Error LisatdoDictadoAsignaturaCarrera', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],error.message);
    }
 
});
router.get('/ObtenerCarreraHomologacion/:dbcarrera/:periodo',async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    const periodo = req.params.periodo;
    try {
        var Informacion=await  procesosmoodlefunciones.ProcesoModleCarreraHomologacion(dbcarrera,periodo);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos,'OK');
        }
        else {
            return sendResponseServicios(res, false, [],Informacion.message);
        }
    }catch (error) {
        logger.error('Error LisatdoDictadoAsignaturaCarrera', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],error.message);
    }
 
});

router.post('/RetirosEstudianteCarreras', async (req, res) => {
    const { listado } = req.body;
    try {
        var Informacion=await  procesosmoodlefunciones.ProcesoRetirosEstudiantesCarrera(listado);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos,'OK');
        }
        else {
            return sendResponseServicios(res, false, [],Informacion.message);
        }
    }catch (error) {
        logger.error('Error RetirosEstudianteCarreras', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],error.message);
    }
});

router.post('/MigrarReconocimientosExcel', async (req, res) => {
    const { iduser } = req.body;
    try {
        var Informacion = await procesosmoodlefunciones.ProcesoMigrarReconocimientosExcel(iduser || 0);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos, 'OK');
        }
        else {
            return sendResponseServicios(res, false, [], Informacion.message);
        }
    } catch (error) {
        logger.error('Error MigrarReconocimientosExcel', { message: error.message, stack: error.stack });
        return sendResponseServicios(res, false, [], error.message);
    }
});

module.exports = router;