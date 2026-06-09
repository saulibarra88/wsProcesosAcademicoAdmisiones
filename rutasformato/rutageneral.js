
const express = require('express');
const router = express.Router();
const Request = require("request");
const procesosfuncionesgenerales = require('../procesosformato/procesosgenerales');
const { sendResponseServicios } = require('../herramientas/responseservice'); 

router.get('/ListadoCarrerasDadoFacultad/:facultad',async (req, res) => {
    const facultad = req.params.facultad;
    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoListadoCarrerasDadoFacultad(facultad);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos,'OK');
        }
        else {
            return sendResponseServicios(res, false, [],Informacion.message);
        }
    }catch (err) {
        logger.error('Error ListadoCarrerasDadoFacultad', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }
 
});

router.get('/VerifocarRutasMatriculasNuevoAlmacenamiento/:carrera/:periodo',async (req, res) => {
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoVerificarRutasMatriculasAlmacenamiento(carrera,periodo);
           return sendResponseServicios(res, true, Informacion.datos,'OK');
    }catch (error) {
       logger.error('Error VerifocarRutasMatriculasNuevoAlmacenamiento', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});
router.get('/EstadisitcasMatriculasPeriodoCarrera/:carrera/:periodo',async (req, res) => {
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoEstadisticasMatriculasPeriodo(carrera,periodo);
           return sendResponseServicios(res, true, Informacion.datos,'OK');
    }catch (error) {
       logger.error('Error EstadisitcasMatriculasPeriodoCarrera', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});

router.get('/TotalDefinitivasCarrerasInstitucional/:periodo',async (req, res) => {
    const periodo = req.params.periodo;
    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoTotalDefinitivaCarrera(periodo);
           return sendResponseServicios(res, true, Informacion,'OK');
    }catch (error) {
       logger.error('Error TotalDefinitivasCarrerasInstitucional', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});
router.get('/ListadoAsignaturasDictadoDocente/:carrera/:cedula',async (req, res) => {
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoDocenteDictadoAsignatura(carrera,cedula);
           return sendResponseServicios(res, true, Informacion,'OK');
    }catch (error) {
       logger.error('Error ListadoASignaturasDictadoDocente', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});
router.get('/ListadoAsignaturasDictadoPeriodo/:carrera/:periodo',async (req, res) => {
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoDictadoAsignaturaPeriodo(carrera,periodo);
           return sendResponseServicios(res, true, Informacion,'OK');
    }catch (error) {
       logger.error('Error ListadoAsignaturasDictadoPeriodo', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});

router.get('/ListadoCarrerasMovilidadesPeriodo/:periodo',async (req, res) => {
    const periodo = req.params.periodo;

    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoListadoCarrerasMovilidadesPeriodo(periodo);
           return sendResponseServicios(res, true, Informacion.datos,'OK');
    }catch (error) {
       logger.error('Error ListadoCarrerasMovilidadesPeriodo', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});
router.get('/ListadoCarrerasHomologacionPeriodo/:periodo',async (req, res) => {
    const periodo = req.params.periodo;

    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoListadoCarrerasHomologacionesPeriodo(periodo);
           return sendResponseServicios(res, true, Informacion.datos,'OK');
    }catch (error) {
       logger.error('Error ListadoCarrerasHomologacionPeriodo', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});
router.post('/InsertarCarreraMovilidad/', async (req, res) => {

        const { listado } = req.body;
    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoIngresoCarrerasMovilidad(listado);
           return sendResponseServicios(res, true, [],'OK');
    }catch (error) {
       logger.error('Error InsertarCarreraMovilidad', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});
router.post('/ClonacionCarreraPeriodo/', async (req, res) => {

        const { periodonuevo,periodoanterior } = req.body;
    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoClonacionCarreraMovilidadPeriodo(periodonuevo,periodoanterior);
           return sendResponseServicios(res, true, [],'OK');
    }catch (error) {
       logger.error('Error InsertarCarreraMovilidad', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});
router.post('/ClonacionCarreraHomologacionGeneralPeriodo/', async (req, res) => {

        const { periodonuevo,periodoanterior } = req.body;
    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoClonacionCarreraHomologacionGeneralPeriodo(periodonuevo,periodoanterior);
           return sendResponseServicios(res, true, [],'OK');
    }catch (error) {
       logger.error('Error ClonacionCarreraHomologacionGeneralPeriodo', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});
router.post('/ActualizacionDatosHomologacionesCarreras/', async (req, res) => {

        const { objDatos } = req.body;
    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoActualizacionDatosHomologacionesCarreras(objDatos);
           return sendResponseServicios(res, true, [],'OK');
    }catch (error) {
       logger.error('Error ActualizacionDatosHomologacionesCarreras', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});
module.exports = router;