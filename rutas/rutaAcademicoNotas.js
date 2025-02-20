const express = require('express');
const router = express.Router();
const Request = require("request");
const procesoAcadeicoNotas = require('../rutas/ProcesoNotasAcademico');
const procesoreportecarrera = require('../rutas/reportesCarreras');


router.get('/ListadoCalificacionesEstudiante/:carrera/:periodo/:cedula/:idreglamento',async (req, res) => {
    const periodo = req.params.periodo;
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    const idreglamento = req.params.idreglamento;
    try {
        var respuesta=await  procesoAcadeicoNotas.ProcesoObtenerCalificacionesEstudiantes(carrera,periodo,cedula,idreglamento);
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

router.get('/ListadosCalificacionesEstudiantedadoDocente/:carrera/:periodo/:nivel/:paralelo/:CodMateria/:cedula/:idreglamento',async (req, res) => {
    const periodo = req.params.periodo;
    const nivel = req.params.nivel;
    const paralelo = req.params.paralelo;
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    const CodMateria = req.params.CodMateria;
    const idreglamento = req.params.idreglamento;
    try {
        var respuesta=await  procesoAcadeicoNotas.ProcesoListadoCalificacionesEstudiantedadoDocente(carrera, periodo,nivel,paralelo,CodMateria, cedula, idreglamento);
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
router.get('/ListadosEstudiantesAsignaturasDocenteExcel/:carrera/:periodo/:nivel/:paralelo/:CodMateria/:cedula',async (req, res) => {
    const periodo = req.params.periodo;
    const nivel = req.params.nivel;
    const paralelo = req.params.paralelo;
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    const CodMateria = req.params.CodMateria;
    try {
        var respuesta=await  procesoreportecarrera.ExcelListadoEstudiantesAsignaturDocente(carrera, periodo,nivel,paralelo,CodMateria, cedula);
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
router.get('/ProcesoReporteListadoCalificacionesEstudiantedadoDocente/:carrera/:periodo/:nivel/:paralelo/:CodMateria/:cedula/:idreglamento/:cedulaUsuario',async (req, res) => {
    const periodo = req.params.periodo;
    const nivel = req.params.nivel;
    const paralelo = req.params.paralelo;
    const carrera = req.params.carrera;
    const cedula = req.params.cedula;
    const cedulaUsuario = req.params.cedulaUsuario;
    const CodMateria = req.params.CodMateria;
    const idreglamento = req.params.idreglamento;
    try {
        var respuesta=await  procesoAcadeicoNotas.ProcesoReporteListadoCalificacionesEstudiantedadoDocente(carrera, periodo,nivel,paralelo,CodMateria, cedula, idreglamento,cedulaUsuario);
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
router.get('/ObtenerlinkActaCalificaciones/:carrera/:periodo/:nivel/:paralelo/:CodMateria/:codDocente/:idtipoacta',async (req, res) => {
    const periodo = req.params.periodo;
    const nivel = req.params.nivel;
    const paralelo = req.params.paralelo;
    const carrera = req.params.carrera;
    const codDocente = req.params.codDocente;
    const idtipoacta = req.params.idtipoacta;
    const CodMateria = req.params.CodMateria;
    try {
        var respuesta=await  procesoAcadeicoNotas.ProcesoObtenerLinkActacalificaciones(carrera, periodo,nivel,paralelo,CodMateria, codDocente, idtipoacta);
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
router.get('/ListadoConvalidacionesEstudiantes/:carrera/:cedula',async (req, res) => {
    const cedula = req.params.cedula;
    const carrera = req.params.carrera;
    try {
        var respuesta=await  procesoAcadeicoNotas.ListadoConvalidacionesEstudiantes(carrera,cedula);
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

router.get('/ListadoEquivalenciaRendimento/:idReglamento',async (req, res) => {
    const idReglamento = req.params.idReglamento;
    try {
        var respuesta=await  procesoAcadeicoNotas.ListadoEquivalenciaRelamentos(idReglamento);
        
        res.json({
            success: true,
            Informacion:  respuesta
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

router.get('/ActualizarActaGeneradaCambioFecha/:periodo/:acta',async (req, res) => {
    const periodo = req.params.periodo;
    const acta = req.params.acta;
    try {
        var respuesta=await  procesoAcadeicoNotas.ProcesoAcademicoCalificaciones(periodo,acta);
        res.json({
            success: true,
            Informacion:  respuesta
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
router.get('/ObtenerPeriodoDadoCodigo/:periodo/',async (req, res) => {
    const periodo = req.params.periodo;
    try {
        var respuesta=await  procesoAcadeicoNotas.ProcesoObtenerPeriodoDadoCodigo(periodo);
        res.json({
            success: true,
            Informacion:  respuesta
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


router.get('/ObtenerMatriculasInternadosDadoEstudiante/:carrera/:cedula',async (req, res) => {
    const cedula = req.params.cedula;
    const carrera = req.params.carrera;
    try {
        var respuesta=await  procesoAcadeicoNotas.ProcesoObtenerMatriculasInternados(carrera, cedula);
        res.json({
            success: true,
            informacion:respuesta.Asignaturas
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

router.get('/ListadoRetirosInternadosDadoEstudiante/:carrera/:cedula',async (req, res) => {
    const cedula = req.params.cedula;
    const carrera = req.params.carrera;
    try {
        var respuesta=await  procesoAcadeicoNotas.ProcesoObtenerRetirosInternados(carrera, cedula);
        res.json({
            success: true,
            informacion:respuesta.Asignaturas
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

router.get('/ListadoEstudiantesPeriodo/:carrera/:periodo',async (req, res) => {
    const carrera = req.params.carrera;
    const periodo = req.params.periodo;
    try {
        var respuesta=await  procesoAcadeicoNotas.ListadoEstudiantesPeriodosCarrera(carrera,periodo);
        
        res.json({
            success: true,
            Informacion:  respuesta
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