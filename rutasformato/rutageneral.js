
const express = require('express');
const router = express.Router();

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

router.get('/CertificadoMejorEstudianteAsignaturaCarrera/:dbcarrera/:periodo/:asignatura',async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    const periodo = req.params.periodo;
    const asignatura = req.params.asignatura;

    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoCertificadoMejorEstudianteAsignatura(dbcarrera,periodo,asignatura);
           return sendResponseServicios(res, true, Informacion.datos,'OK');
    }catch (error) {
       logger.error('Error ListadoCarrerasHomologacionPeriodo', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});
router.get('/CertificadoCalificacionesEstudiantePeriodo/:dbcarrera/:periodo/:cedula',async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    const periodo = req.params.periodo;
    const cedula = req.params.cedula;

    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoCertificadoCalificacionesEstudiantePeriodoCarrera(dbcarrera,periodo,cedula);
           return sendResponseServicios(res, true, Informacion.datos,'OK');
    }catch (error) {
       logger.error('Error ListadoCarrerasHomologacionPeriodo', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});

router.get('/ReporteMAllaAcademicaCarrera/:dbcarrera/:periodo/',async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    const periodo = req.params.periodo;


    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoReporteMallaAcademicaCarrera(dbcarrera,periodo);
           return sendResponseServicios(res, true, Informacion.datos,'OK');
    }catch (error) {
       logger.error('Error ReporteMAllaAcademicaCarrera', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});
router.get('/ReporteMAllaAcademicaCarreraPensum/:dbcarrera/:pensum/',async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    const pensum = req.params.pensum;


    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoReporteMallaAcademicaCarreraPesum(dbcarrera,pensum);
           return sendResponseServicios(res, true, Informacion.datos,'OK');
    }catch (error) {
       logger.error('Error ReporteMAllaAcademicaCarreraPensum', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],err.message);
    }

});
router.get('/ListadoDocentesApellidoCarrera/:dbcarrera/:apellido/',async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    const apellido = req.params.apellido;


    try {
        var Informacion=await  procesosfuncionesgenerales.ProcesoListadoDocentesApellidosCarrera(dbcarrera,apellido);
            return sendResponseServicios(res, true, Informacion.datos,'OK');
    }catch (error) {
       logger.error('Error ListadoDocentesApellidoCarrera', { message: error.message, stack: error.stack});
        return sendResponseServicios(res, false, [],error.message);
    }

});

router.get('/ListadoParentescos/:dbcarrera', async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    try {
        var Informacion = await procesosfuncionesgenerales.ProcesoListadoParentescos(dbcarrera);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos, 'OK');
        } else {
            return sendResponseServicios(res, false, [], Informacion.message);
        }
    } catch (error) {
        return sendResponseServicios(res, false, [], error.message);
    }
});

router.get('/ListadoDireccionesEstudiante/:dbcarrera/:est_identificacion', async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    const est_identificacion = req.params.est_identificacion;
    try {
        var Informacion = await procesosfuncionesgenerales.ProcesoListadoDireccionesEstudiante(dbcarrera, est_identificacion);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos, 'OK');
        } else {
            return sendResponseServicios(res, false, [], Informacion.message);
        }
    } catch (error) {
        return sendResponseServicios(res, false, [], error.message);
    }
});

router.get('/ObtenerDireccionEstudiantePorTipo/:dbcarrera/:est_identificacion/:dir_tipo_id', async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    const est_identificacion = req.params.est_identificacion;
    const dir_tipo_id = req.params.dir_tipo_id;
    try {
        var Informacion = await procesosfuncionesgenerales.ProcesoObtenerDireccionEstudiantePorTipo(dbcarrera, est_identificacion, dir_tipo_id);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos, 'OK');
        } else {
            return sendResponseServicios(res, false, [], Informacion.message);
        }
    } catch (error) {
        return sendResponseServicios(res, false, [], error.message);
    }
});

router.post('/IngresarDireccionEstudiante', async (req, res) => {
    const { dbcarrera, datos } = req.body;
    try {
        var Informacion = await procesosfuncionesgenerales.ProcesoIngresarDireccionEstudiante(dbcarrera, datos);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos, 'OK');
        } else {
            return sendResponseServicios(res, false, [], Informacion.message);
        }
    } catch (error) {
        return sendResponseServicios(res, false, [], error.message);
    }
});

router.post('/ActualizarDireccionEstudiante', async (req, res) => {
    const { dbcarrera, datos } = req.body;
    try {
        var Informacion = await procesosfuncionesgenerales.ProcesoActualizarDireccionEstudiante(dbcarrera, datos);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos, 'OK');
        } else {
            return sendResponseServicios(res, false, [], Informacion.message);
        }
    } catch (error) {
        return sendResponseServicios(res, false, [], error.message);
    }
});

router.post('/EliminarDireccionEstudiante', async (req, res) => {
    const { dbcarrera, dir_id } = req.body;
    try {
        var Informacion = await procesosfuncionesgenerales.ProcesoEliminarDireccionEstudiante(dbcarrera, dir_id);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos, 'OK');
        } else {
            return sendResponseServicios(res, false, [], Informacion.message);
        }
    } catch (error) {
        return sendResponseServicios(res, false, [], error.message);
    }
});

router.get('/ListadoFamiliaresEstudiante/:dbcarrera/:est_identificacion', async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    const est_identificacion = req.params.est_identificacion;
    try {
        var Informacion = await procesosfuncionesgenerales.ProcesoListadoFamiliaresEstudiante(dbcarrera, est_identificacion);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos, 'OK');
        } else {
            return sendResponseServicios(res, false, [], Informacion.message);
        }
    } catch (error) {
        return sendResponseServicios(res, false, [], error.message);
    }
});

router.post('/IngresarFamiliarEstudiante', async (req, res) => {
    const { dbcarrera, datos } = req.body;
    try {
        var Informacion = await procesosfuncionesgenerales.ProcesoIngresarFamiliarEstudiante(dbcarrera, datos);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos, 'OK');
        } else {
            return sendResponseServicios(res, false, [], Informacion.message);
        }
    } catch (error) {
        return sendResponseServicios(res, false, [], error.message);
    }
});

router.post('/ActualizarFamiliarEstudiante', async (req, res) => {
    const { dbcarrera, datos } = req.body;
    try {
        var Informacion = await procesosfuncionesgenerales.ProcesoActualizarFamiliarEstudiante(dbcarrera, datos);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos, 'OK');
        } else {
            return sendResponseServicios(res, false, [], Informacion.message);
        }
    } catch (error) {
        return sendResponseServicios(res, false, [], error.message);
    }
});

router.post('/EliminarFamiliarEstudiante', async (req, res) => {
    const { dbcarrera, fam_id } = req.body;
    try {
        var Informacion = await procesosfuncionesgenerales.ProcesoEliminarFamiliarEstudiante(dbcarrera, fam_id);
        if (Informacion.proceso) {
            return sendResponseServicios(res, true, Informacion.datos, 'OK');
        } else {
            return sendResponseServicios(res, false, [], Informacion.message);
        }
    } catch (error) {
        return sendResponseServicios(res, false, [], error.message);
    }
});

module.exports = router;