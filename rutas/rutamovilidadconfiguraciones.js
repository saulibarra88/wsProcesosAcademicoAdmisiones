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
                mensaje: 'Error en el proceso' + err
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
                mensaje: 'Error en el proceso' + err
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
                mensaje: 'Error en el proceso' + err
            }
        );
    }

});
router.get('/PrpuestaCodigoPensum/:carrera',async (req, res) => {
    const carrera = req.params.carrera;
    try {
        var Informacion=await  funcionesprocesosmovilidadconfiguraciones.ProcesoPropuestaCodigoPensumCarrera(carrera);
        res.json({
            success: true,
            Informacion:Informacion,
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en el proceso' + err
            }
        );
    }
 
});

router.post('/IngresarFacultad', async (req, res) => {
    try {
        const { facultad } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoInsertarFacultad(facultad);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});

router.post('/ActualizarFacultad', async (req, res) => {
    try {
        const { facultad } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoActualizarFacultad(facultad);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.post('/CambiarEstadoFacultad', async (req, res) => {
    try {
        const { codigo,estado } = req.body;

        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoCambiarEstadoFacultad(codigo,estado);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.post('/IngresarEscuela', async (req, res) => {
    try {
        const { escuela } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoInsertarEscuela(escuela);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});

router.post('/ActualizarEscuela', async (req, res) => {
    try {
        const { escuela } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoActualizarEscuela(escuela);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.post('/CambiarEstadoEscuela', async (req, res) => {
    try {
        const { codigo,facultad,estado } = req.body;

        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoCambiarEstadoEscuela(codigo,facultad,estado);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.post('/IngresarCarrera', async (req, res) => {
    try {
        const { carrera } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoInsertarCarrera(carrera);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.post('/ActualizarCarrera', async (req, res) => {
    try {
        const { carrera } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoActualizarCarrera(carrera);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.post('/CambiarEstadoCarrera', async (req, res) => {
    try {
        const { codigo,escuela,estado } = req.body;

        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoCambiarEstadoCarrera(codigo,escuela,estado);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.get('/ListadoCarrerasAdministracion/:escuela',async (req, res) => {
    const escuela = req.params.escuela;
    try {
        var Informacion=await  funcionesprocesosmovilidadconfiguraciones.ProcesoListadoCarreraaAdministracion(escuela);
          res.json({
            success: true,
            Informacion: Informacion.data
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en el proceso' + err
            }
        );
    }
 
});
router.get('/ListadoSedes/',async (req, res) => {
    
    try {
        var Informacion=await  funcionesprocesosmovilidadconfiguraciones.ProcesoListadoSede();
        res.json({
            success: true,
            Informacion: Informacion.data
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en el proceso' + err
            }
        );
    }
 
});
router.get('/CodigoSeguirdadCarrera/:escuela',async (req, res) => {
      const escuela = req.params.escuela;
    try {
        var Informacion=await  funcionesprocesosmovilidadconfiguraciones.ProcesoCodigoSeguridadCarrera(escuela);
        res.json({
            success: true,
            Informacion: Informacion
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en el proceso' + err
            }
        );
    }
 
});
router.post('/IngresarPais', async (req, res) => {
    try {
        const { strCodigo,strNombre } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoInsertarPais(strCodigo,strNombre);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.post('/ActualizarPais', async (req, res) => {
    try {
       const { strCodigo,strNombre } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoActualizarPais( strCodigo,strNombre);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.post('/IngresarProvincia', async (req, res) => {
    try {
        const { strCodigo,strNombre,strCodPais } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoInsertarProvincia(strCodigo,strNombre,strCodPais);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.post('/ActualizarProvincia', async (req, res) => {
    try {
       const { strCodigo,strNombre,strCodPais } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoActualizarProvincia( strCodigo,strNombre,strCodPais);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.post('/IngresarCiudad', async (req, res) => {
    try {
        const { strCodigo,strNombre,strCodProv } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoInsertarCiudad(strCodigo,strNombre,strCodProv);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.post('/ActualizarCiudad', async (req, res) => {
    try {
       const { strCodigo,strNombre,strCodProv } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoActualizarCiudad( strCodigo,strNombre,strCodProv);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});

router.get('/ListadoTipoInstituciones/',async (req, res) => {
    
    try {
        var Informacion=await  funcionesprocesosmovilidadconfiguraciones.ProcesoListadoTiposInstituciones();
        res.json({
            success: true,
            Informacion: Informacion.data
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en el proceso' + err
            }
        );
    }
 
});
router.get('/ListadoInstitucionesTodas/',async (req, res) => {
    
    try {
        var Informacion=await  funcionesprocesosmovilidadconfiguraciones.ProcesoListadoInstitucionesTodas();
        res.json({
            success: true,
            Informacion: Informacion.data
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en el proceso' + err
            }
        );
    }
 
});

router.post('/IngresarInstituciones', async (req, res) => {
    try {
        const { strCodigo,strNombre,strCodCiudad,strCodTipo } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoInsertarInstituciones(strCodigo,strNombre,strCodCiudad,strCodTipo);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.post('/ActualizarInstituciones', async (req, res) => {
    try {
   const { strCodigo,strNombre,strCodCiudad,strCodTipo } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoActualizarInstituciones( strCodigo,strNombre,strCodCiudad,strCodTipo);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.get('/ListadoTitulosTodos/',async (req, res) => {
    
    try {
        var Informacion=await  funcionesprocesosmovilidadconfiguraciones.ProcesoListadoTitulosMaster();
        res.json({
            success: true,
            Informacion: Informacion.data
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en el proceso' + err
            }
        );
    }
 
});
router.post('/IngresarTitulo', async (req, res) => {
    try {
        const { strCodigo,strNombre,blnProfesional } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoInsertarTitulo(strCodigo,strNombre,blnProfesional);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.post('/ActualizarTitulo', async (req, res) => {
    try {
   const { strCodigo,strNombre,blnProfesional } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoActualizarTitulo(strCodigo,strNombre,blnProfesional);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});

router.get('/ObtenerDatosInstitucion/',async (req, res) => {
    
    try {
        var Informacion=await  funcionesprocesosmovilidadconfiguraciones.ProcesoObteberDatosInstitucion();
        res.json({
            success: true,
            Informacion: Informacion.data
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en el proceso' + err
            }
        );
    }
 
});
router.post('/ActualizarDatosInstitucional', async (req, res) => {
    try {
   const { objdatos } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoActualizarDatosInstitucion(objdatos);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.get('/ObtenerNuevoCodigoPeriodoAcademico/:tipo',async (req, res) => {
     const tipo = req.params.tipo;
    try {
        if(tipo=='P'){
 var Informacion=await  funcionesprocesosmovilidadconfiguraciones.ProcesoObtenerNuevoCodigoPeriodoOrdinario();
        }else{
           var Informacion=await  funcionesprocesosmovilidadconfiguraciones.ProcesoObtenerNuevoCodigoPeriodoRemedial(); 
        }
        res.json({
            success: true,
            Informacion: Informacion.data
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en el proceso' + err
            }
        );
    }
 
});
router.post('/IngresoNuevoPeriodoAcademico', async (req, res) => {
    try {
   const { objperiodos } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoInsertarNuevoPeriodoAcademico(objperiodos);
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en el proceso' + err
            }
        );

    }
});
router.post('/ActualizarPeriodoCarreras', async (req, res) => {
    try {
   const { periodo,listadoCarrera,tipo } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoActualizarPeriodosCarreras(periodo,listadoCarrera,tipo );
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en la proceso' + err
            }
        );

    }
});
router.get('/ListadoCarrerasCalificaciones/',async (req, res) => {
    
    try {
        var Informacion=await  funcionesprocesosmovilidadconfiguraciones.ProcesoListarFechasCalificacionesCarreras();
        res.json({
            success: true,
            Informacion: Informacion
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en el proceso' + err
            }
        );
    }
 
});
router.get('/ObtenerFechasCalificacionesAcademico/',async (req, res) => {
    
    try {
        var Informacion=await  funcionesprocesosmovilidadconfiguraciones.ProcesoObtenerFechasCalificacionesSistemaAcademico();
        res.json({
            success: true,
            Informacion: Informacion
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en el proceso' + err
            }
        );
    }
 
});

router.post('/ActualizarFechasCalificacionesCarreras', async (req, res) => {
    try {
   const { objFechas,listado,tipo } = req.body;
        const Informacion = await funcionesprocesosmovilidadconfiguraciones.ProcesoActualizarFechasCalificacionesCarreras(objFechas,listado,tipo );
        res.json({
            success: true,
            Informacion
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.json(
            {
                success: false,
                mensaje: 'Error en la proceso' + err
            }
        );

    }
});

router.get('/ObtenerInformacionAcademicaEstudiante/:cedula',async (req, res) => {
     const cedula = req.params.cedula;
    try {
        var Informacion=await  funcionesprocesosmovilidadconfiguraciones.ProcesoObtenerInformacionAcademicaEstudiante(cedula);
        res.json({
            success: true,
            Informacion: Informacion
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en el proceso' + err
            }
        );
    }
 
});
module.exports = router;