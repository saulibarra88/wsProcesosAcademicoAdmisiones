const axios = require('axios');
const cron = require('node-cron');
const pathimage = require('path');
const nomenclatura = require('../config/nomenclatura');
const modeloprocesocarreras = require('../modelo/procesocarrera');
const reportescarreras = require('../rutas/reportesCarreras');

const tools = require('./tools');
const fs = require("fs");
const https = require('https');
const crypto = require("crypto");
const { console } = require('inspector');

const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});


module.exports.pdfPerdidaAsignaturasEstudiantesporParalelos = async function (carrera, periodo, cedula) {
    try {
        var Repitencia = 0;
        var ListadoEstudiantesProceso = [];
        var ListadoAsignaturas = await modeloprocesocarreras.AsignaturasDictadosMateriasCarreras(carrera, periodo);
        if (ListadoAsignaturas.count > 0) {
            for (var asignaturasTodas of ListadoAsignaturas.data) {
                var ListadoDocumentos = [];
                var ListadoAsignaturasParalelos = await modeloprocesocarreras.AsignaturasDictadosMateriasParalelosCarreras(carrera, periodo, asignaturasTodas.strCodMateria);
                if (ListadoAsignaturasParalelos.count > 0) {
                    for (var asignaturas of ListadoAsignaturasParalelos.data) {
                        var CantidadMatriculadosAsignatura = await modeloprocesocarreras.AsignaturasMatriculadaNivelParalelosPeriodoCantidad(carrera, periodo, asignaturas.strCodMateria, asignaturas.strCodNivel, asignaturas.strCodParalelo);
                        var datos = await modeloprocesocarreras.CalculosEstuidantesApruebaRepruebaPorAsignaturasNivelParalelo(carrera, periodo, asignaturas.strCodMateria, asignaturas.strCodNivel, asignaturas.strCodParalelo);
                        var datosRetiros = await modeloprocesocarreras.RetirosAsignaturasNormalesCarrerasListadoNivelParalelo(carrera, periodo, asignaturas.strCodMateria, asignaturas.strCodNivel, asignaturas.strCodParalelo);
                        var datosConvalidaciones = await modeloprocesocarreras.AsignaturasConvalidadasPorNivelParalelo(carrera, periodo, asignaturas.strCodMateria, asignaturas.strCodNivel, asignaturas.strCodParalelo);
                        if (CantidadMatriculadosAsignatura.data[0].Segunda > 0 || CantidadMatriculadosAsignatura.data[0].Tercera) {
                            var Repitencia = Number(CantidadMatriculadosAsignatura.data[0].Segunda) + Number(CantidadMatriculadosAsignatura.data[0].Tercera)
                        }
                        var resultado = {
                            cantidadprimera: CantidadMatriculadosAsignatura.data[0].Primera == null ? 0 : CantidadMatriculadosAsignatura.data[0].Primera,
                            cantidadsegunda: CantidadMatriculadosAsignatura.data[0].Segunda == null ? 0 : CantidadMatriculadosAsignatura.data[0].Segunda,
                            cantidadtercera: CantidadMatriculadosAsignatura.data[0].Tercera == null ? 0 : CantidadMatriculadosAsignatura.data[0].Tercera,
                            cantidadtotal: CantidadMatriculadosAsignatura.data[0].Tercera == null ? 0 : CantidadMatriculadosAsignatura.data[0].Total,
                            retiros: datosRetiros.count,
                            repitencia: Repitencia,
                            convalidaciones: datosConvalidaciones.count,
                            strCodMateria: asignaturas.strCodMateria,
                            strCodMateria: asignaturas.strCodMateria,
                            strCodNivel: asignaturas.strCodNivel,
                            strCodParalelo:asignaturas.strCodParalelo,
                            strNombre: asignaturas.strNombre,
                            docente: asignaturas.strNombres + ' ' + asignaturas.strApellidos,
                            Aprueban: datos.data[0].Aprueba == null ? 0 : datos.data[0].Aprueba,
                            Reprueban: datos.data[0].Reprueba == null ? 0 : datos.data[0].Reprueba,
                            Total: datos.data[0].Total == null ? 0 : datos.data[0].Total

                        }
                        ListadoDocumentos.push(resultado)
                    }
                }
                asignaturasTodas.listadoparalelos = ListadoDocumentos
                ListadoEstudiantesProceso.push(asignaturasTodas)
                  //var base64 = await reportescarreras.PdfListadoEstudiantesAsignaturaApruebanNivelParalelo(ListadoEstudiantesProceso, carrera, cedula, periodo)
               // return ListadoEstudiantesProceso
            }
        }


          var base64 = await reportescarreras.PdfListadoEstudiantesAsignaturaApruebanNivelParalelo(ListadoEstudiantesProceso, carrera, cedula, periodo)

        return base64

    } catch (err) {
        console.log(error);
        return 'ERROR' + error;
    }
}

module.exports.pdfMatriculasEstadosEstudiantesporParalelos = async function (carrera, periodo, cedula) {
    try {

        var ListadoEstudiantesProceso = [];
        var ListadoAsignaturas = await modeloprocesocarreras.AsignaturasDictadosMateriasCarreras(carrera, periodo);
        if (ListadoAsignaturas.count > 0) {
            for (var asignaturasTodas of ListadoAsignaturas.data) {
                var ListadoDocumentos = [];
                var ListadoAsignaturasParalelos = await modeloprocesocarreras.AsignaturasDictadosMateriasParalelosCarreras(carrera, periodo, asignaturasTodas.strCodMateria);
                if (ListadoAsignaturasParalelos.count > 0) {
                    for (var asignaturas of ListadoAsignaturasParalelos.data) {
                   
                        var CantidadMatriculadosAsignatura = await modeloprocesocarreras.MatriculasCantidadEstadosAsignaturas(carrera, periodo, asignaturas.strCodMateria, asignaturas.strCodNivel, asignaturas.strCodParalelo);
                      
                        var resultado = {
                            cantidaddef: CantidadMatriculadosAsignatura.data[0].Definitiva == null ? 0 : CantidadMatriculadosAsignatura.data[0].Definitiva,
                            cantidadpen: CantidadMatriculadosAsignatura.data[0].Pendiente == null ? 0 : CantidadMatriculadosAsignatura.data[0].Pendiente,
                            cantidadsol: CantidadMatriculadosAsignatura.data[0].Solicitadas == null ? 0 : CantidadMatriculadosAsignatura.data[0].Solicitadas,
                            cantidadpre: CantidadMatriculadosAsignatura.data[0].Presolicitada == null ? 0 : CantidadMatriculadosAsignatura.data[0].Presolicitada,
                            cantidaddefva: CantidadMatriculadosAsignatura.data[0].Definitvavalidacion == null ? 0 : CantidadMatriculadosAsignatura.data[0].Definitvavalidacion,
                            cantidadpenva: CantidadMatriculadosAsignatura.data[0].Pendientevalidación == null ? 0 : CantidadMatriculadosAsignatura.data[0].Pendientevalidación, 
                            cantidadsolva: CantidadMatriculadosAsignatura.data[0].Solicitadavalidacion == null ? 0 : CantidadMatriculadosAsignatura.data[0].Solicitadavalidacion, 
                            cantidadpreva: CantidadMatriculadosAsignatura.data[0].presolicitadavalidacion == null ? 0 : CantidadMatriculadosAsignatura.data[0].presolicitadavalidacion, 
                            cantidadtotal: CantidadMatriculadosAsignatura.data[0].Total == null ? 0 : CantidadMatriculadosAsignatura.data[0].Total,
                            strCodMateria: asignaturas.strCodMateria,
                            strCodNivel: asignaturas.strCodNivel,
                            strCodParalelo:asignaturas.strCodParalelo,
                            strNombre: asignaturas.strNombre,
                            docente: asignaturas.strNombres + ' ' + asignaturas.strApellidos,
                        }
                        ListadoDocumentos.push(resultado)
                    }
                }
                asignaturasTodas.listadoparalelos = ListadoDocumentos
                ListadoEstudiantesProceso.push(asignaturasTodas)
           
            }
        }


          var base64 = await reportescarreras.PdfListadoEstudiantesMatriculasEstadosASignaturas(ListadoEstudiantesProceso, carrera, cedula, periodo)

        return base64

    } catch (err) {
        console.log(error);
        return 'ERROR' + error;
    }
}