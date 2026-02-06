const express = require('express');
const router = express.Router();
const Request = require("request");

const procesoMigracion = require('../rutas/ProcesosMigracionNivelacion');
const procesoCupo = require('../modelo/procesocupos');
const reportes = require('../rutas/reportesadmisiones');
const procesosadmisiones = require('../rutas/ProcesosAdmisiones');
const procesosCarrerasFunciones = require('./procesoscarrerasespoch');
const procesosReportesFunciones = require('./procesosreportescarreras');
const pruebasInformacion = require('./procesosespochcarrera');

router.get('/ProcesoConfirmacionCupoInscripcion/:periodo/:cedula/',async (req, res) => {
    const periodo = req.params.periodo;
    const cedula = req.params.cedula;
    try {
        var respuesta=await  procesoMigracion.ProcesoConfirmacionCupoInscripcion(periodo,cedula);
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
router.get('/ProcesoMatriculacionAceptacionCupo/:periodo/:cedula/',async (req, res) => {
    const periodo = req.params.periodo;
    const cedula = req.params.cedula;
    try {

        var respuesta=await  procesoMigracion.ProcesoMatriculadosConfirmados(periodo,cedula);
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
router.get('/ProcesoRetirosParciales/:periodo/:cedula/',async (req, res) => {
    const periodo = req.params.periodo;
    const cedula = req.params.cedula;
    try {
        var respuesta=await  procesoMigracion.ProcesoRetirosParciales(periodo,cedula);
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

router.get('/ProcesoImpedimentoAcademicoNivelacion/:periodo/:cedula/',async (req, res) => {
    const periodo = req.params.periodo;
    const cedula = req.params.cedula;
    try {
        var respuesta=await  procesoMigracion.ProcesoImpedimentoAcademicoNivelacion(periodo,cedula);
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
router.get('/ProcesoMatriculadosDefinitivasPeriodos/:periodo/:cedula/',async (req, res) => {
    const periodo = req.params.periodo;
    const cedula = req.params.cedula;
    try {
        var respuesta=await  procesoMigracion.ProcesoMatriculadosDefinitivas(periodo,cedula);
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


router.get('/ProcesoConfirmadoCasoEspecialRuben/:periodo/',async (req, res) => {
    const periodo = req.params.periodo;

    try {
        
        var respuesta=await  procesoMigracion.ProcesoCasosEspecialRube(periodo);
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

router.get('/ProcesoActivarCupoRetiro/:periodo/:cedula/',async (req, res) => {
    const periodo = req.params.periodo;
    const cedula = req.params.cedula;
    try {
        var respuesta=await  procesoMigracion.ProcesoActivarCupoRetirado(periodo,cedula);
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
router.get('/ProcesoPerdidaPeriodoAcumulado/:periodo/:cedula/',async (req, res) => {
    const periodo = req.params.periodo;
    const cedula = req.params.cedula;
    try {
        var respuesta=await  procesoMigracion.ProcesoCalculoPerdidaCupo(periodo,cedula);
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

router.get('/ProcesoAprobacionNivelacionpasoCarrera/:periodo/',async (req, res) => {
    const periodo = req.params.periodo;
    try {
        var respuesta=await  procesoMigracion.ProcesoAprobacionNivelacionVerificarPasoCarrera(periodo);
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

router.get('/ProcesoAdmisionesVerificacionRegistroCupo/:periodo/',async (req, res) => {
    const periodo = req.params.periodo;
    try {
        var respuesta=await  procesoMigracion.ProcesoAdmisionesVerificacionRegistroCupo(periodo);
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

router.get('/ListadoEstudiantesNoRegistradoADmisionesPeridaCupo/:periodo/',async (req, res) => {
    const periodo = req.params.periodo;
    try {
        var respuesta=await  procesoMigracion.ProcesoAdmisionesEstudiantesPerdidaCupo(periodo);
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

router.get('/ListadoEstudianntesCupoPorEstado/:periodo/:idEstado/:cedula',async (req, res) => {
    const periodo = req.params.periodo;
    const idEstado = req.params.idEstado;
    const cedula = req.params.cedula;
    try {
        var respuesta=await  procesoMigracion.ProcesoListadoEstudianteCuposPorEstados(periodo,idEstado,cedula);
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
router.get('/ExcelListadoEstudianntesCupoPorEstado/:periodo/:idEstado/:cedula',async (req, res) => {
    const periodo = req.params.periodo;
    const idEstado = req.params.idEstado;
    const cedula = req.params.cedula;
    try {
        var respuesta=await  procesoMigracion.ProcesoExcelListadoEstudianteCuposPorEstados(periodo,idEstado,cedula);
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
router.get('/ListadoEstadoCupo/',async (req, res) => {

    try {
        var respuesta=await  procesoMigracion.ListadoeEtadoCupos();
      
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
//////Servicios Web /////////////////
router.get('/VerificarRegistroIncripcionEstudiantesAdmisiones/:periodo/:cedula/',async (req, res) => {
    const periodo = req.params.periodo;
    const cedula = req.params.cedula;
    try {
        var respuesta=await  procesoMigracion.ProcesoVerificarRegistroIncripcionesEstudiantesAdmisiones(periodo,cedula);
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
router.get('/ListadoProcesoPeriodo/',async (req, res) => {
    try {
        var respuesta=await  procesoMigracion.ListadoPeriodosEjecutados();
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
router.get('/PeriodoVigenteMaster/',async (req, res) => {
    try {
        var PeriodoActual = await procesoCupo.ObtenerPeriodoVigenteMaster("OAS_Master");
        res.json({
            success: true,
            informacion:PeriodoActual.data[0]
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
router.get('/ListadoPeriodoVigenteMaster/',async (req, res) => {
    try {
        var PeriodoActual = await procesoCupo.ListadoPeriodoVigenteMaster("OAS_Master");
        res.json({
            success: true,
            informacion:PeriodoActual.data
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
router.get('/IngresarInscripcionEstuidanteCasoEspeciales/:periodo/:cedula',async (req, res) => {
    try {
        const periodo = req.params.periodo;
        const cedula = req.params.cedula;
      
        var respuesta=await  procesoMigracion.InscripcionEstudianteNoregistradoCasoEspecialP0039(periodo,cedula);
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

router.get('/ListadoMatriculasProcesosValidacion/',async (req, res) => {
    const periodo = req.params.periodo;
    try {
        var respuesta=await  procesoMigracion.ProcesoValidacionConocimientosMatriculasPeriodos();
        res.json({
            success: true,
            informacion:respuesta.Informacion
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
router.get('/ListadoEstudianteMatriculadoDadoNivel/:periodo/:nivel',async (req, res) => {
    const periodo = req.params.periodo;
    const nivel = req.params.nivel;
    try {
        var respuesta=await  procesoMigracion.ProcesoEstudianteMatriculadosNivel(periodo,nivel);
      
       // var respuesta2=await  reportes.ExcelListadosEstudianteMatriculasdosNivel(respuesta.Informacion);
        res.json({
            success: true,
            informacion:respuesta.Informacion,
            Base:respuesta2
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
router.get('/ListadoEstudianteMatriculadoDadoNivelCupos/:periodo/:nivel',async (req, res) => {
    const periodo = req.params.periodo;
    const nivel = req.params.nivel;
    try {
        var respuesta=await  procesoMigracion.ProcesoEstudianteMatriculadosNivelCupos(periodo,nivel);
        var respuesta2=await  reportes.ExcelListadosEstudianteMatriculasdosNivelCupo(respuesta.Informacion);
        res.json({
            success: true,
            informacion:respuesta.Informacion,
            Base:respuesta2
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

router.get('/ListadoHomologacionCarreraAdminisiones/',async (req, res) => {
    try {
        var Informacion = await procesosadmisiones.ListadoHomologacionesCarreras();
        res.json({
            success: true,
            Informacion
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en la consulta' + err
            }
        );
    }
 
});

router.get('/DocumentosMatriculasPeriodos/:BaseCarrera/:periodo',async (req, res) => {
    const periodo = req.params.periodo;
    const BaseCarrera = req.params.BaseCarrera;
    try {
        var Informacion = await procesosCarrerasFunciones.DocumentosMatriculasPeriosdos(BaseCarrera,periodo);
        res.json({
            success: true,
            Informacion
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en la consulta' + err
            }
        );
    }
 
});
router.get('/RevisionDoumentosNoGeneradosMatriculasCarreras/:periodo',async (req, res) => {
    const periodo = req.params.periodo;
    try {
        var Informacion = await procesosCarrerasFunciones.RevisionDocumentosInvenientesCarreras(periodo);
        res.json({
            success: true,
            Informacion
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en la consulta' + err
            }
        );
    }
 
});
router.get('/PDFListadoDocumentosCarreras/:periodo/:cedula',async (req, res) => {
    const periodo = req.params.periodo;
    const cedula = req.params.cedula;
    try {
        var Informacion = await procesosCarrerasFunciones.pdfCarerasDocumentosMatriculas(periodo,cedula);
        res.json({
            success: true,
            Informacion
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en la consulta' + err
            }
        );
    }
 
});
router.get('/PDFListadoEstudianteMatriculasTerceraSegunda/:carrera/:periodo/:tipo/:cedula',async (req, res) => {
    const periodo = req.params.periodo;
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    const tipo = req.params.tipo;
    try {
        var Informacion = await procesosCarrerasFunciones.pdfListadoEstudianteTerceraSegundaMatricula(carrera,periodo,cedula,tipo);
        res.json({
            success: true,
            Informacion
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en la consulta' + err
            }
        );
    }
 
});
router.get('/PDFPerdidasAsignaturasEstudiantes/:carrera/:periodo/:cedula',async (req, res) => {
    const periodo = req.params.periodo;
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    try {
        
        var Informacion = await procesosCarrerasFunciones.pdfPerdidaAsignaturasEstudiantes(carrera,periodo,cedula);
        res.json({
            success: true,
            Informacion
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en la consulta' + err
            }
        );
    }
 
});
router.get('/PDFPerdidasAsignaturasEstudiantesNivelParalelos/:carrera/:periodo/:cedula',async (req, res) => {
    const periodo = req.params.periodo;
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    try {
        var Informacion = await procesosReportesFunciones.pdfPerdidaAsignaturasEstudiantesporParalelos(carrera,periodo,cedula);
        res.json({
            success: true,
            Informacion
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en la consulta' + err
            }
        );
    }
 
});

router.get('/PDFMatriculasEstadosNivelParalelos/:carrera/:periodo/:cedula',async (req, res) => {
    const periodo = req.params.periodo;
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    try {
        var Informacion = await procesosReportesFunciones.pdfMatriculasEstadosEstudiantesporParalelos(carrera,periodo,cedula);
        res.json({
            success: true,
            Informacion
        });
    }catch (err) {
        console.log('Error: ' + err);
        return res.json(
             {
                success: false,
                mensaje:'Error en la consulta' + err
            }
        );
    }
 
});
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