const express = require('express');
const router = express.Router();
const Request = require("request");

const procesoMigracion = require('../rutas/ProcesosMigracionNivelacion');
const procesoCupo = require('../modelo/procesocupos');
const reportes = require('../rutas/reportesadmisiones');
const procesosadmisiones = require('../rutas/ProcesosAdmisiones');
const procesosCarreras = require('../rutas/procesoscarreras');

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
        var Informacion = await procesosCarreras.DocumentosMatriculasPeriosdos(BaseCarrera,periodo);
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

module.exports = router;