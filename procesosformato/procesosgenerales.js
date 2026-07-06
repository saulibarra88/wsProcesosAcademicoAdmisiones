const express = require('express');
const router = express.Router();

const fs = require("fs");

const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");

const sqlmodelogenerales = require('../modeloformato/generalesmodelo');
const funcionesgenerales = require('../rutas/tools');
const sqlmodelomovilidad = require('../modelo/modelomovilidad');
const { sendResponseProcesos } = require('../herramientas/responseservice');
const logger = require('./../herramientas/logger');
const funcionesmodelomovilidadconfiguraciones = require('../modelo/modelomovilidadconfiguraciones');
const funcionesreportesmake = require('../reportesmake/reportescarrerasmake');
const sqlprocesoCupo = require('../modelo/procesocupos');
const console = require('console');

const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});


module.exports.ProcesoListadoCarrerasDadoFacultad = async function (codigofacultad) {
    try {

        var Informacion = await sqlmodelogenerales.ListadoCarrerasDadoFacultad('OAS_Master', codigofacultad);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoCarrerasDadoFacultad', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoDocenteDictadoAsignatura = async function (carrera, cedula) {
    try {

        var Informacion = await sqlmodelogenerales.DocenteDictadoAsignaturas(carrera, funcionesgenerales.CedulaConGuion(cedula));
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoDocenteDictadoAsignatura', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoDictadoAsignaturaPeriodo = async function (carrera, periodo) {
    try {

        var Informacion = await sqlmodelogenerales.DictadoAsignaturasPeriodo(carrera, periodo);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoDictadoAsignaturaPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoVerificarRutasMatriculasAlmacenamiento = async function (carrera, periodo) {
    try {
        var ListadoDocumentos = [];
        var ListadoDocumentosDatos = await sqlmodelogenerales.ListadoDocumentosfirmadosLegalizados(carrera, periodo);
        var DatosCarrera = await sqlmodelomovilidad.ObenterDatosCarrera('OAS_Master', carrera);
        if (ListadoDocumentosDatos.modelo) {
            for (var documentos of ListadoDocumentosDatos.datos.data) {
                if (documentos.ruta == null || documentos.ruta == 'undefined') {
                    var ruta = periodo + '/ActasMatriculas/' + DatosCarrera.data[0].strNombre.replace('.', 'R') + '/' + documentos.iddocumento + '.pdf'
                    var ActualizarRuta = await sqlmodelogenerales.ActualizarDocumentosfirmadosLegalizadosRuta(carrera, periodo, documentos.iddocumento, ruta);
                    ListadoDocumentos.push(documentos)
                }
            }
        }
        return sendResponseProcesos(true, [], 'OK')
    } catch (error) {
        logger.error('Error ProcesoVerificarRutasMatriculasAlmacenamiento', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoEstadisticasMatriculasPeriodo = async function (carrera, periodo) {
    try {

        var Informacion = await sqlmodelogenerales.EstadisticasMatriculasPeriodo(carrera, periodo);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoEstadisticasMatriculasPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoTotalDefinitivaCarrera = async function (periodo) {
    try {
        var ListadoCarreras = await funcionesmodelomovilidadconfiguraciones.ListadosTodasCarrerasAcademica('OAS_Master');
        contadortotalNivelacion = 0
        contadortotalGeneral = 0
        contadortotalNivel = 0
        if (ListadoCarreras.count > 0) {
            for (var carreras of ListadoCarreras.data) {
                let contiene = carreras.strBaseDatos.includes("OAS_Niv");
                var InformacionGeneral = await sqlmodelogenerales.TotalMatriculaDefinitvaCarrera(carreras.strBaseDatos, periodo);
                contadortotalGeneral = contadortotalGeneral + InformacionGeneral.datos.data[0].TotalDEF
                if (contiene == true) {
                    var Informacion = await sqlmodelogenerales.TotalMatriculaDefinitvaCarrera(carreras.strBaseDatos, periodo);
                    contadortotalNivelacion = contadortotalNivelacion + Informacion.datos.data[0].TotalDEF
                } else {
                    var Informacion = await sqlmodelogenerales.TotalMatriculaDefinitvaCarrera(carreras.strBaseDatos, periodo);
                    contadortotalNivel = contadortotalNivel + Informacion.datos.data[0].TotalDEF_Nivel1

                }
            }
        }
        var resultado = {
            contadortotalGeneral: contadortotalGeneral,
            contadortotalNivelacion: contadortotalNivelacion,
            contadortotalNivel: contadortotalNivel,
        }
        return sendResponseProcesos(true, resultado, 'OK')

    } catch (error) {
        logger.error('Error ProcesoTotalDefinitivaCarrera', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoListadoCarrerasMovilidadesPeriodo = async function (periodo) {
    try {

        var Informacion = await sqlmodelogenerales.ListadoCarrerasMovilidadesPeriodo('OAS_Master', periodo);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoCarrerasMovilidadesPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoListadoCarrerasHomologacionesPeriodo = async function (periodo) {
    try {

        var Informacion = await sqlmodelogenerales.ListadoCarrerasHomologacionPeriodo('OAS_Master', periodo);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoCarrerasHomologacionesPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoClonacionCarreraMovilidadPeriodo = async function (periodonuevo, periodoanterior) {
    try {

        var Informacion = await sqlmodelogenerales.ClonarCarrerasMoviliadPeriodo('OAS_Master', periodonuevo, periodoanterior);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoCarrerasHomologacionesPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoClonacionCarreraHomologacionGeneralPeriodo = async function (periodonuevo, periodoanterior) {
    try {

        var Informacion = await sqlmodelogenerales.ClonarCarrerasHomologacionGeneralPeriodo('OAS_Master', periodonuevo, periodoanterior);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ClonarCarrerasHomologacionGeneralPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoIngresoCarrerasMovilidad = async function (listado) {
    try {
        for (var carreras of listado) {
            var VerificacionDatos = await sqlmodelogenerales.ObtenerModilidadCarreraPeriodoBase('OAS_Master', carreras.msca_periodo, carreras.msca_dbcarreraactual, carreras.msca_dbcarreramovilidad, carreras.msca_tipo);
            if (VerificacionDatos.datos.count == 0) {
                var IngresoDatos = await sqlmodelogenerales.IngresarMoviliadCarrera('OAS_Master', carreras);
            }
        }

        return sendResponseProcesos(true, [], 'OK')
    } catch (error) {
        logger.error('Error ProcesoIngresoCarrerasMovilidad', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoActualizacionDatosHomologacionesCarreras = async function (objDatos) {
    try {

        var Informacion = await sqlmodelogenerales.ActualizarDatosHomologacionesCarrera('OAS_Master', objDatos);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoActualizacionDatosHomologacionesCarreras', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoListadoDocentesApellidosCarrera = async function (carrera,apellido) {
    try {

        var Informacion = await sqlmodelogenerales.ListadoApellidosDocentesCarrera(carrera, apellido);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoActualizacionDatosHomologacionesCarreras', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoCertificadoMejorEstudianteAsignatura = async function (dbcarrera, periodo, asignatura) {
    try {
        if (funcionesgenerales.compararPeriodos(periodo, 'P0041')) {
            console.log('Dos Calificaciones')
            var Informacion = await sqlmodelogenerales.ObtenerMejorEstudianteDosCalificacionesAsignaturaCarrera(dbcarrera, periodo, asignatura);
        } else {
            console.log('tres Calificaciones')

            var Informacion = await sqlmodelogenerales.ObtenerMejorEstudianteTresCalificacionesAsignaturaCarrera(dbcarrera, periodo, asignatura);
        }
        console.log(Informacion)
        if(Informacion.datos.count>0){
   const datosCarrera = await sqlprocesoCupo.ObtenerDatosBase(dbcarrera);
        const datosPeriodo = await sqlprocesoCupo.PeriodoDatos(dbcarrera, periodo);
        const datosAsignatura = await sqlprocesoCupo.AsignaturasDatos(dbcarrera, asignatura);
        var datos = {
            institucion: "ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO",
            estudianteNombres: Informacion.datos.data[0].strNombres + ' ' + Informacion.datos.data[0].strApellidos,
            estudianteCedula: Informacion.datos.data[0].strCedula,
            programaNombre: datosCarrera.data[0].strNombreCarrera,
            periodoAcademico: datosPeriodo.data[0].strDescripcion,
            asignaturaNombre: datosAsignatura.data[0].strNombre,
            docenteNombre: "ING. CARLOS DOCENTE",
            calificacion: Informacion.datos.data[0].CalificacionTotal,
            tipocalificacion: await funcionesgenerales.compararPeriodos(periodo, 'P0041')==true?' / 10':' / 40'
        }
        var base64 = await funcionesreportesmake.pdfmakegenerarcertificadoasignatura(datos);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, base64, 'OK')
        } else {
            return sendResponseProcesos(false, base64, Informacion.message)
        }
        }else{
                return sendResponseProcesos(false, base64, '')
        }
     
    } catch (error) {
        logger.error('Error ProcesoCertificadoMejorEstudianteAsignatura', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoCertificadoEstudianteRegularCarrera = async function (dbcarrera, periodo, cedulaestudiante) {
    try {
         var datosMatricula = await sqlmodelogenerales.ObtenerEstudianteMatriculaperiodo(dbcarrera, periodo, cedulaestudiante)
         var regulares = await sqlmodelogenerales.CalculoEstudiantesRegulares60PorCiento(dbcarrera, periodo, datosMatricula.datos.data[0].sintCodigo)
           if(regulares.datos.count>0){
   const datosCarrera = await sqlprocesoCupo.ObtenerDatosBase(dbcarrera);
        var datos = {
            institucion: "ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO",
            estudianteNombres: datosMatricula.datos.data[0].strNombres + ' ' + datosMatricula.datos.data[0].strApellidos,
            estudianteCedula: cedulaestudiante,
            programaNombre: datosCarrera.data[0].strNombreCarrera,
            periodoAcademico: datosMatricula.datos.data[0].strDescripcion,
            tipocalificacion: regulares.datos.data[0].Estudiante,
            tipocalificacionDescripcion: regulares.datos.data[0].Estudiante=='REGULAR' ?' considerado/a un/a estudiante regular, cumpliendo con los requisitos académicos establecidos por la institución ':' considerado/a un/a estudiante no regular, incumpliendo con los requisitos académicos establecidos por la institución '
        }
        var base64 = await funcionesreportesmake.pdfmakegenerarcertificadoaestudianteRegular(datos);
       return sendResponseProcesos(true, base64, 'OK')
        }else{
                return sendResponseProcesos(false, base64, '')
        }
     
    } catch (error) {
        logger.error('Error ProcesoCertificadoEstudianteRegularCarrera', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoCertificadoEstudianteRetiroasignaturaCarrera = async function (dbcarrera, periodo, cedulaestudiante) {
    try {
         var DatosRetiros = await sqlmodelogenerales.ObtenerMateriasRetiradasEstuidanteCarrera(dbcarrera, periodo, cedulaestudiante)
           if(DatosRetiros.datos.count>0){
   const datosCarrera = await sqlprocesoCupo.ObtenerDatosBase(dbcarrera);
   var listado=[];
     for (let datos of DatosRetiros.datos.data) {
            var elementos={
                nombre:datos.strNombre,
                codigo:datos.strCodMateria,
                numeromatricula:datos.bytNumMat,
                nivel:datos.strCodNivel,
                paralelo:datos.strCodParalelo,
                resolucion:datos.strResolucion,
            }
            listado.push(elementos)
        }
        var datos = {
            institucion: "ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO",
            estudianteNombres: DatosRetiros.datos.data[0].strNombres + ' ' + DatosRetiros.datos.data[0].strApellidos,
            estudianteCedula: cedulaestudiante,
            programaNombre: datosCarrera.data[0].strNombreCarrera,
            periodoAcademico: DatosRetiros.datos.data[0].strDescripcion,
         asignaturas: listado,
        }
        var base64 = await funcionesreportesmake.pdfmakegenerarcertificadoRetiroAsignaturaCarrera(datos);
       return sendResponseProcesos(true, base64, 'OK')
        }else{
                return sendResponseProcesos(false, base64, '')
        }
     
    } catch (error) {
        logger.error('Error ProcesoCertificadoEstudianteRetiroasignaturaCarrera', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoCertificadoCalificacionesEstudiantePeriodoCarrera = async function (dbcarrera, periodo, cedulaestudiante) {
    try {
        if (funcionesgenerales.compararPeriodos(periodo, 'P0041')) {
            var Informacion = await sqlmodelogenerales.ObtenerDosCalificacionesAsignarutasEstudiantePeriodo(dbcarrera, periodo, cedulaestudiante);
        } else {

            var Informacion = await sqlmodelogenerales.ObtenerMejorEstudianteTresCalificacionesAsignaturaCarrera(dbcarrera, periodo, asignatura);
        }
        if(Informacion.datos.count>0){
   const datosCarrera = await sqlprocesoCupo.ObtenerDatosBase(dbcarrera);
        const datosPeriodo = await sqlprocesoCupo.PeriodoDatos(dbcarrera, periodo);
        var listado=[]
        for (let datos of Informacion.datos.data) {
            var elementos={
                nombre:datos.strNombre,
                codigo:datos.strCodMateria,
                calificacion:datos.CalificacionTotal,
                numeromatricula:datos.bytNumMat,
                nivel:datos.strCodNivel,
                paralelo:datos.strCodParalelo,
            }
            listado.push(elementos)
        }
        var datos = {
            institucion: "ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO",
            estudianteNombres: Informacion.datos.data[0].strNombres + ' ' + Informacion.datos.data[0].strApellidos,
            estudianteCedula: cedulaestudiante,
            programaNombre: datosCarrera.data[0].strNombreCarrera,
            periodoAcademico: datosPeriodo.data[0].strDescripcion,
            docenteNombre: "ING. CARLOS DOCENTE",
            calificacion: Informacion.datos.data[0].CalificacionTotal,
              tipocalificacion: await funcionesgenerales.compararPeriodos(periodo, 'P0041')==true?' sobre/10':' sobre/40',
             asignaturas: listado,
        }
        var base64 = await funcionesreportesmake.pdfmakegenerarcertificadoCalificacionesperiodo(datos);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, base64, 'OK')
        } else {
            return sendResponseProcesos(false, base64, Informacion.message)
        }
        }else{
                return sendResponseProcesos(false, base64, '')
        }
     
    } catch (error) {
        logger.error('Error ProcesoCertificadoMejorEstudianteAsignatura', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoReporteMallaAcademicaCarrera = async function (dbcarrera, periodo) {
    try {
     var Informacion = await sqlmodelogenerales.ObtenerMallaAcademicaCarrera(dbcarrera, periodo);
        if(Informacion.datos.count>0){
   const datosCarrera = await sqlprocesoCupo.ObtenerDatosBase(dbcarrera);
        const datosPeriodo = await sqlprocesoCupo.PeriodoDatos(dbcarrera, periodo);
   
      var datos = {
            institucion: "ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO",
            programaNombre: datosCarrera.data[0].strNombreCarrera,
            periodoAcademico: datosPeriodo.data[0].strDescripcion,
          listado:Informacion.datos.data
        }
        
        var base64 = await funcionesreportesmake.pdfmakegenerarMallaCarrera (datos);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, base64, 'OK')
        } else {
            return sendResponseProcesos(false, base64, Informacion.message)
        }
        }else{
                return sendResponseProcesos(false, base64, '')
        }
     
    } catch (error) {
        logger.error('Error ProcesoReporteMallaAcademicaCarrera', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}
module.exports.ProcesoReporteMallaAcademicaCarreraPesum = async function (dbcarrera, pesum) {
    try {
      var Informacion = await sqlmodelogenerales.ObtenerMallaAcademicaCarreraPesum(dbcarrera, pesum);
         if(Informacion.datos.count>0){
    const datosCarrera = await sqlprocesoCupo.ObtenerDatosBase(dbcarrera);
         const datosPensum = await sqlprocesoCupo.ObtenerPensumCarrera(dbcarrera, pesum);
    
       var datos = {
             institucion: "ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO",
             programaNombre: datosCarrera.data[0].strNombreCarrera,
             periodoAcademico: datosPensum.data[0].strNombre,
           listado:Informacion.datos.data
         }
         
         var base64 = await funcionesreportesmake.pdfmakegenerarMallaCarreraPesum (datos);
         if (Informacion.modelo) {
             return sendResponseProcesos(true, base64, 'OK')
         } else {
             return sendResponseProcesos(false, base64, Informacion.message)
         }
         }else{
                 return sendResponseProcesos(false, base64, '')
         }
      
    } catch (error) {
        logger.error('Error ProcesoReporteMallaAcademicaCarrera', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoListadoParentescos = async function (carrera) {
    try {
        var Informacion = await sqlmodelogenerales.ListadoParentescos(carrera);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoParentescos', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoListadoDireccionesEstudiante = async function (carrera, est_identificacion) {
    try {
        var Informacion = await sqlmodelogenerales.ListadoDireccionesEstudiante(carrera, est_identificacion);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoDireccionesEstudiante', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoObtenerDireccionEstudiantePorTipo = async function (carrera, est_identificacion, dir_tipo_id) {
    try {
        var Informacion = await sqlmodelogenerales.ObtenerDireccionEstudiantePorTipo(carrera, est_identificacion, dir_tipo_id);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoObtenerDireccionEstudiantePorTipo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoIngresarDireccionEstudiante = async function (carrera, datos) {
    try {
        var existePrevia = await sqlmodelogenerales.ObtenerDireccionEstudiantePorTipo(carrera, datos.dir_strCedula, datos.dir_tipo_id);
        if (existePrevia.modelo && existePrevia.datos && existePrevia.datos.count > 0) {
            await sqlmodelogenerales.EliminarDireccionEstudianteFisico(carrera, datos.dir_strCedula, datos.dir_tipo_id);
        }

        var Informacion = await sqlmodelogenerales.IngresarDireccionEstudiante(carrera, datos);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoIngresarDireccionEstudiante', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoActualizarDireccionEstudiante = async function (carrera, datos) {
    try {
        var Informacion = await sqlmodelogenerales.ActualizarDireccionEstudiante(carrera, datos);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoActualizarDireccionEstudiante', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoEliminarDireccionEstudiante = async function (carrera, dir_id) {
    try {
        var Informacion = await sqlmodelogenerales.EliminarDireccionEstudiante(carrera, dir_id);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoEliminarDireccionEstudiante', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoListadoFamiliaresEstudiante = async function (carrera, est_identificacion) {
    try {
        var Informacion = await sqlmodelogenerales.ListadoFamiliaresEstudiante(carrera, est_identificacion);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoListadoFamiliaresEstudiante', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoIngresarFamiliarEstudiante = async function (carrera, datos) {
    try {
        var existePrevia = await sqlmodelogenerales.ObtenerFamiliarEstudiantePorParentesco(carrera, datos.fam_strCedula, datos.fam_parentesco_id);
        if (existePrevia.modelo && existePrevia.datos && existePrevia.datos.count > 0) {
            await sqlmodelogenerales.EliminarFamiliarEstudianteFisico(carrera, datos.fam_strCedula, datos.fam_parentesco_id);
        }

        var Informacion = await sqlmodelogenerales.IngresarFamiliarEstudiante(carrera, datos);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoIngresarFamiliarEstudiante', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoActualizarFamiliarEstudiante = async function (carrera, datos) {
    try {
        var Informacion = await sqlmodelogenerales.ActualizarFamiliarEstudiante(carrera, datos);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoActualizarFamiliarEstudiante', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoEliminarFamiliarEstudiante = async function (carrera, fam_id) {
    try {
        var Informacion = await sqlmodelogenerales.EliminarFamiliarEstudiante(carrera, fam_id);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK')
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message)
        }
    } catch (error) {
        logger.error('Error ProcesoEliminarFamiliarEstudiante', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message)
    }
}

module.exports.ProcesoGuardarOActualizarRegistroDireccionPeriodo = async function (carrera, datos) {
    try {
        var Informacion = await sqlmodelogenerales.GuardarOActualizarRegistroDireccionPeriodo(carrera, datos);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK');
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message);
        }
    } catch (error) {
        logger.error('Error ProcesoGuardarOActualizarRegistroDireccionPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message);
    }
};

module.exports.ProcesoObtenerRegistroDireccionPeriodo = async function (carrera, cedula, periodo) {
    try {
        var Informacion = await sqlmodelogenerales.ObtenerRegistroDireccionPeriodo(carrera, cedula, periodo);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK');
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message);
        }
    } catch (error) {
        logger.error('Error ProcesoObtenerRegistroDireccionPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message);
    }
};

module.exports.ProcesoListarRegistrosDireccionPeriodoPorEstudiante = async function (carrera, cedula) {
    try {
        var Informacion = await sqlmodelogenerales.ListarRegistrosDireccionPeriodoPorEstudiante(carrera, cedula);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK');
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message);
        }
    } catch (error) {
        logger.error('Error ProcesoListarRegistrosDireccionPeriodoPorEstudiante', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message);
    }
};

module.exports.ProcesoEliminarRegistroDireccionPeriodo = async function (carrera, reg_id) {
    try {
        var Informacion = await sqlmodelogenerales.EliminarRegistroDireccionPeriodo(carrera, reg_id);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK');
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message);
        }
    } catch (error) {
        logger.error('Error ProcesoEliminarRegistroDireccionPeriodo', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message);
    }
};

module.exports.ProcesoRegistrarInformacionCompletaEstudiante = async function (carrera, datosCompleto) {
    try {
        var Informacion = await sqlmodelogenerales.RegistrarInformacionCompletaEstudiante(carrera, datosCompleto);
        if (Informacion.modelo) {
            return sendResponseProcesos(true, Informacion.datos, 'OK');
        } else {
            return sendResponseProcesos(false, Informacion.datos, Informacion.message);
        }
    } catch (error) {
        logger.error('Error ProcesoRegistrarInformacionCompletaEstudiante', { message: error.message, stack: error.stack });
        return sendResponseProcesos(false, [], error.message);
    }
};



