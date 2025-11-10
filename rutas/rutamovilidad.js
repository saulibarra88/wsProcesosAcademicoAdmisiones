const express = require('express');
const router = express.Router();
const Request = require("request");

const funcionesprocesosmovilidad = require('../procesos/procesosmovilidad');
const funcionesprocesosrecordmallaestuidante = require('../procesos/procesorecordmallaestuidante');



router.get('/CarrerasDadoFacultadHomologaciones/:periodo/:codFacultad', async (req, res) => {
    const periodo = req.params.periodo;
    const codFacultad = req.params.codFacultad;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoCarrerasDadoFacultadHomologacion(periodo, codFacultad);
        res.json({
            success: true,
            informacion: respuesta
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

router.post('/DatosEstudiantesCambioCarreraProcesos/', async (req, res) => {

        const { carrera, codEstudiante,nivel,periodo,cedula } = req.body;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoDatosEstudianteCambioCarrera(carrera, codEstudiante, nivel,periodo,cedula);
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

router.get('/DatosConfiguracionesAprobacionSolicitudesCarreras/:carreramovilidad/:periodo/:puntaje', async (req, res) => {
    const carreramovilidad = req.params.carreramovilidad;
    const periodo = req.params.periodo;
    const puntaje = req.params.puntaje;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoDatosConfiguracionesAprobacionSolicitudesCarreras(carreramovilidad, periodo, puntaje);
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

router.post('/IngresarSolicitudMovilidadEstudiante', async (req, res) => {
    try {
        const { solicitud, listadodocumento } = req.body;
        const Informacion = await funcionesprocesosmovilidad.ProcesoIngresarSolicitudEstuidanteMovilidad(solicitud, listadodocumento);
        res.json({
            success: true,
            Informacion
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
router.get('/ListadoSolicitudesMovilidadPorEstado/:estado/:periodo', async (req, res) => {
    const estado = req.params.estado;
    const periodo = req.params.periodo;

    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoListadoSolicitudesMovilidadPorEstado(estado, periodo);
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
router.get('/ObtenerFormatoTextoCodigo/:codigo', async (req, res) => {
    const codigo = req.params.codigo;


    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoObtnerFormatoTextoCodigo(codigo);
        res.json({
            success: true,
            Informacion: respuesta.data[0]
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
router.get('/ListadoTipoInscripcion/', async (req, res) => {

    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoListadoTipoInscripcion();
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
router.get('/TotalesCantidadesSolicitud/', async (req, res) => {

    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoTotalesCantidadesSolicitud();
        res.json({
            success: true,
            Informacion: respuesta.data[0]
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
router.get('/ObnterHomologacionCarreraEstuidante/:carrera/:periodo/:cedula', async (req, res) => {
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    const periodo = req.params.periodo;


    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoDatosHomologacionCarreraEstudiante(carrera, cedula, periodo);
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
router.get('/ObtnerDocumentosSOlicitudesTipo/:idsolicitud/:tipo', async (req, res) => {
    const idsolicitud = req.params.idsolicitud;
    const tipo = req.params.tipo;


    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoObtnerDocumentoTipo(idsolicitud, tipo);
        res.json({
            success: true,
            Informacion: respuesta.data[0]
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

router.get('/ObtnerSolicitudEstuidantePeriodo/:carrera/:cedula/:periodo', async (req, res) => {
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    const periodo = req.params.periodo;


    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoObtenerSolicitudesEstudiantes(carrera, cedula, periodo);
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
router.post('/ActulizarEstadoSolicitud', async (req, res) => {
    try {
        const { idsolicitud, estado, observacion, perautorizacion } = req.body;
        const Informacion = await funcionesprocesosmovilidad.ProcesoActualizarEstadoSolicitud(idsolicitud, estado, observacion, perautorizacion);
        res.json({
            success: true,
            Informacion
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
router.post('/InsertarSolicitudAprobadaInscripcionMoviInterna', async (req, res) => {
    try {
        const { idsolicitud, idpersona, idCupoAdmision, strRutadocumento, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30 } = req.body;
        const Informacion = await funcionesprocesosmovilidad.ProcesInsertarSolicitudAprobadaInscripcionMovilidadInterna(idsolicitud, idpersona, idCupoAdmision, strRutadocumento, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30);
        res.json({
            success: true,
            Informacion
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
router.post('/InsertarSolicitudAprobadaInscripcionMoviTraspaso', async (req, res) => {
    try {
        const { idsolicitud, idpersona, idCupoAdmision, strRutadocumento, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30 } = req.body;
        const Informacion = await funcionesprocesosmovilidad.ProcesInsertarSolicitudAprobadaInscripcionMovilidadTraspaso(idsolicitud, idpersona, idCupoAdmision, strRutadocumento, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30);
        res.json({
            success: true,
            Informacion
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
router.post('/InsertarInscripcionMoviExterna', async (req, res) => {
    try {
        const { solicitud, idpersona, strRutadocumento, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30, idCupoAdmision, strFoto } = req.body;
        const Informacion = await funcionesprocesosmovilidad.ProcesInsertarSolicitudAprobadaInscripcionMovilidadExterna(solicitud, idpersona, idCupoAdmision, strRutadocumento, strFormaInscripcion, strObservaciones, blgratuidadT, blgratuidad30, strFoto);
        res.json({
            success: true,
            Informacion
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
router.post('/InsertarInscripcionAntigua', async (req, res) => {
    try {
        const { objinscripcion } = req.body;
        const Informacion = await funcionesprocesosmovilidad.ProcesInsertarInscripcionesAntiguas(objinscripcion);
        res.json({
            success: true,
            Informacion
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
router.get('/InsertarCuposConfiguracionesCarreras/:periodo/:idusuario/', async (req, res) => {
    const idusuario = req.params.idusuario;
    const periodo = req.params.periodo;


    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesInsertarCarrerasCuposConfiguraciones(periodo, idusuario);
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
router.get('/ListadoCuposConfiguracionesCarreras/:periodo/', async (req, res) => {
    const periodo = req.params.periodo;


    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesListadoCarrerasCuposConfiguraciones(periodo);
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
router.post('/ActuzalizarCarrerasConfiguracionesMovilidad', async (req, res) => {
    try {
        const { mc_id, mc_puntaje_minimo_carrera, mc_cupos_movi_interna, mc_cupos_movi_externa, mc_cupos_movi_traspaso, mc_fecha_inicio, mc_fecha_fin } = req.body;
        var objConfiguraciones = {
            mc_id: mc_id,
            mc_puntaje_minimo_carrera: mc_puntaje_minimo_carrera,
            mc_cupos_movi_interna: mc_cupos_movi_interna,
            mc_cupos_movi_externa: mc_cupos_movi_externa,
            mc_cupos_movi_traspaso: mc_cupos_movi_traspaso,
            mc_fecha_inicio: mc_fecha_inicio,
            mc_fecha_fin: mc_fecha_fin
        }
        const Informacion = await funcionesprocesosmovilidad.ProcesoActualizarCarreraConfiguracion(objConfiguraciones);
        res.json({
            success: true,
            Informacion
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

router.get('/ListadoPaisesMaster/', async (req, res) => {
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoListadoPaises();
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
router.get('/ListadoProvinciasMaster/:codPais/', async (req, res) => {
    const codPais = req.params.codPais;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoListadoProvincias(codPais);
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
router.get('/ListadoCiudadMaster/:codProvincia/', async (req, res) => {
    const codProvincia = req.params.codProvincia;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoListadoCiudad(codProvincia);
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
router.get('/ListadoInstitucionesMaster/:codciudad/', async (req, res) => {
    const codciudad = req.params.codciudad;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoListadoInstituciones(codciudad);
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
router.get('/ListadoestadoVida/', async (req, res) => {

    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoListadoEstadoVida();
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
router.get('/ObnterDatosEstudianteMaster/:cedula', async (req, res) => {
    const cedula = req.params.cedula;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesodatosEstudianteMaster(cedula);
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
router.get('/ObnterDatosEstudianteCarrera/:cedula/:carrera', async (req, res) => {
    const cedula = req.params.cedula;
    const carrera = req.params.carrera;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesodatosEstudianteCarrera(cedula,carrera);
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
router.get('/ObnterDatosCarreraCodigo/:carrera', async (req, res) => {
    const carrera = req.params.carrera;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesodatosDatosCarreraCodigo(carrera);
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
router.post('/InserarEstudianteMaster', async (req, res) => {
    try {
        const { strCedula, strNombres, strApellidos, strClave, strCedulaMil, dtFechaNac, strNacionalidad, strDir, strTel, imgFoto, strEmail, strCodSexo, strCodEstCiv, strNombresPadre, strApellidosPadres, strNombresMadre, strApellidosMadre, strCodEstVidP, strCodEstVidM, strCodEstado, strCodCiudadProc, strCodEstadoUsuario } = req.body;
        var objEstudiante = {
            strCedula: strCedula,
            strNombres: strNombres,
            strApellidos: strApellidos,
            strClave: strClave,
            strCedulaMil: strCedulaMil,
            dtFechaNac: dtFechaNac,
            strNacionalidad: strNacionalidad,
            strDir: strDir,
            strTel: strTel,
            strEmail: strEmail,
            strCodSexo: strCodSexo,
            strCodEstCiv: strCodEstCiv,
            strNombresPadre: strNombresPadre,
            strApellidosPadres: strApellidosPadres,
            strNombresMadre: strNombresMadre,
            strApellidosMadre: strApellidosMadre,
            strCodEstVidP: strCodEstVidP,
            strCodEstVidM: strCodEstVidM,
            strCodEstado: strCodEstado,
            imgFoto: imgFoto,
            strCodCiudadProc: strCodCiudadProc,
            strCodEstadoUsuario: strCodEstadoUsuario
        }
        const Informacion = await funcionesprocesosmovilidad.ProcesoInsertarEstudianteMaster(objEstudiante);
        res.json({
            success: true,
            Informacion
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
router.get('/ListadoTitulosInstitucion/:codInstitucion', async (req, res) => {
    const codInstitucion = req.params.codInstitucion;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoListadoTitulosColegios(codInstitucion);
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
router.post('/InserarGradoEstudianteMaster', async (req, res) => {
    try {
        const { strCedEstud, strCodTit, strCodInt, strRefrendacion, dtFecha } = req.body;
        var objEstudiante = {
            strCedEstud: strCedEstud,
            strCodTit: strCodTit,
            strCodInt: strCodInt,
            strRefrendacion: strRefrendacion,
            dtFechaRegistro: null,
            dtFecha: dtFecha,
        }

        const Informacion = await funcionesprocesosmovilidad.ProcesoInsertarGradoEstudianteMaster(objEstudiante);
        res.json({
            success: true,
            Informacion
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
router.get('/ListadoGradoEstudianteTodas/:cedula', async (req, res) => {
    const cedula = req.params.cedula;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoListadoGradoEstuidanteTodas(cedula);
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
router.post('/EliminarGradoEstuidante', async (req, res) => {
    try {
        const { cedula, codtitulo, codInstitucion } = req.body;
        var objEstudiante = {
            cedula: cedula,
            codtitulo: codtitulo,
            codInstitucion: codInstitucion

        }

        const Informacion = await funcionesprocesosmovilidad.ProcesoEliminarGradoEstuidante(cedula, codtitulo, codInstitucion);
        res.json({
            success: true,
            Informacion
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
router.post('/ActualizarradoEstuidante', async (req, res) => {
    try {
        const { cedula, codtitulo, codInstitucion, fecha, refrendacion } = req.body;
        var objEstudiante = {
            cedula: cedula,
            codtitulo: codtitulo,
            codInstitucion: codInstitucion,
            fecha: fecha,
            refrendacion: refrendacion
        }
        const Informacion = await funcionesprocesosmovilidad.ProcesoActulizarGradoEstuidante(objEstudiante);
        res.json({
            success: true,
            Informacion
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
router.post('/EliminacionInscripcionMovExterna', async (req, res) => {
    try {
        const { dbCarrera, cedula, periodo } = req.body;

        const Informacion = await funcionesprocesosmovilidad.ProcesoEliminacionInscripcionMovExterna(dbCarrera, cedula, periodo);
        res.json({
            success: true,
            Informacion
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

router.get('/ObtenerDatosEstuidanteCarrera/:dbcarrera/:cedula', async (req, res) => {
    const dbcarrera = req.params.dbcarrera;
    const cedula = req.params.cedula;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoDatosEstuidanteCarrera(dbcarrera, cedula);
        res.json({
            success: true,
            Informacion: respuesta.data[0]
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

router.post('/ActulizarSolicitudesEstudiante', async (req, res) => {
    try {
        const { boolGratuidadT, boolGratuidad30, strObservaciones, strCedEstud, strCodPeriodo, strCodCarrera } = req.body;
        var objEstudiante = {
            boolGratuidadT: boolGratuidadT,
            boolGratuidad30: boolGratuidad30,
            strObservaciones: strObservaciones,
            strCedEstud: strCedEstud,
            strCodPeriodo: strCodPeriodo,
            strCodCarrera: strCodCarrera,
        }
        const Informacion = await funcionesprocesosmovilidad.ProcesoActulizarInscripcionesEstuidante(objEstudiante);
        res.json({
            success: true,
            Informacion
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

router.get('/ReporteExcelSolicitudesMovilidad/:periodo/:estado', async (req, res) => {
    const periodo = req.params.periodo;
    const estado = req.params.estado;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoGenerarExcelSolicitudes(periodo,estado);
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
router.get('/ReportePdfSolicitudesMovilidadAprobadas/:periodo', async (req, res) => {
    const periodo = req.params.periodo;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoGenerarPdfSolicitudesAprbadas(periodo);
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
router.get('/CurriculumEstuidante/:carrera/:cedula/:periodo',async (req, res) => {
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    const periodo = req.params.periodo;
    try {
        var Informacion=await  funcionesprocesosmovilidad.ProcesoGeneracionCurriculumEstuidante(carrera,cedula,periodo);
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
router.get('/CurriculumEstuidanteConsultor/:carrera/:cedula/',async (req, res) => {
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    try {
        var Informacion=await  funcionesprocesosrecordmallaestuidante.ProcesoGeneracionCurriculumEstuidanteConsultor(carrera,cedula);
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
router.post('/IngresoDocumentosSolicitud', async (req, res) => {
    try {
        const { listadodocumentoSolicitud } = req.body;
        const Informacion = await funcionesprocesosmovilidad.ProcesoIngresoDocumentoSolicitud(listadodocumentoSolicitud);
        res.json({
            success: true,
            Informacion
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
router.post('/IngresoEstuidanteExcepcionMovilidad', async (req, res) => {
    try {
        const { objDatos } = req.body;
        const Informacion = await funcionesprocesosmovilidad.ProcesoIngresoEstuidanteExcepcionMovilidad(objDatos);
        res.json({
            success: true,
            Informacion
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

router.get('/ListadoEstadoCivilMaster/', async (req, res) => {
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoListadoEstadoCivilMaster();
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
router.get('/ListadoSexoMaster/', async (req, res) => {
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoListadoSexoMaster();
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
router.get('/ListadoCiudadTodasMaster/', async (req, res) => {
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoListadoCiudadTodasMaster();
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

router.post('/ActualizarEstuidanteMaster', async (req, res) => {
    try {
        const { objDatos,carrera } = req.body;
        const Informacion = await funcionesprocesosmovilidad.ProcesoActualizarEstuidanteMaster(objDatos,carrera);
        res.json({
            success: true,
            Informacion
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
router.post('/ActualizarEstuidanteCarrera', async (req, res) => {
    try {
        const { objDatos,carrera } = req.body;
        const Informacion = await funcionesprocesosmovilidad.ProcesoActualizarEstuidanteCarrera(objDatos,carrera);
        res.json({
            success: true,
            Informacion
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

router.get('/ListadoInscripcionesTodasEstudiante/:cedula', async (req, res) => {
        const cedula = req.params.cedula;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoListadosInscrionestodasEstudiante(cedula);
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
router.get('/ObtenerDatosCarrera/:dbBase', async (req, res) => {
        const dbBase = req.params.dbBase;
    try {
        var respuesta = await funcionesprocesosmovilidad.ProcesoObtenerDatosCarrera(dbBase);
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