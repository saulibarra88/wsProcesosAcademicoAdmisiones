const modeloprocesocarreras = require('../modelo/procesocarrera');
const axios = require('axios');
const cron = require('node-cron');
const pathimage = require('path');
const nomenclatura = require('../config/nomenclatura');
const modeloprocesoCupo = require('../modelo/procesocupos');
const reportescarreras = require('../rutas/reportesCarreras');
const modeloreporteexcelcarrera = require('../procesos/reportesexcelcarreras');
const tools = require('./tools');
const fs = require("fs");
const https = require('https');
const crypto = require("crypto");
const pLimit = require('p-limit');
const limit = pLimit(10);
const { iniciarDinamicoPool, iniciarDinamicoTransaccion } = require("./../config/execSQLDinamico.helper");
const { iniciarMasterTransaccion, iniciarMasterPool } = require("./../config/execSQLMaster.helper");
const { closeAllPools } = require('./../config/dbPoolManager');
const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});


module.exports.ProcesoReporteExcelMatriculasCarrerasIndividual = async function (carrera, periodo, estado) {
    try {
        var resultado = await FuncionReporteExcelMatriculasCarrerasIndividualInstitucionalTransaccion(carrera, periodo, estado);

        return resultado
    } catch (err) {
        console.log(err);
        return 'ERROR';
    }
}
module.exports.ProcesoReporteExcelMatriculasCarrerasTodasInstitucionales = async function (periodo, estado) {
    try {

//  var resultado = await FuncionReporteExcelMatriculasCarrerasTodasInstitucinal(periodo, estado);
var resultado = await FuncionReporteExcelMatriculasCarrerasTodasInstitucionalTransaccion(periodo, estado);
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

module.exports.ProcesoReporteExcelMatriculasNivelacionInstitucional = async function (periodo, estado) {
    try {
      //  var resultado = await FuncionReporteExcelMatriculasNivelacionTodasInstitucional(periodo, estado);
        var resultado = await FuncionReporteExcelMatriculasNivelacionTodasInstitucionalTransaccion(periodo, estado);
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }
      
    }
}
module.exports.ProcesoReporteExcelMatriculasAdmisionesnstitucional = async function (periodo) {
    try {
     //   var resultado = await FuncionReporteExcelMatriculasAdmisionesInstitucinal(periodo);
        var resultado = await FuncionReporteExcelMatriculasAdmisionesInstitucinalTransaccion(periodo);
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }
      
    }
}


async function FuncionReporteExcelMatriculasCarrerasIndividualInstitucionalTransaccion(carrera,periodo, estado) {

            const pool = await iniciarMasterPool("OAS_Master");
            await pool.connect();
            const transaction = await iniciarMasterTransaccion(pool);
            await transaction.begin();
            try {
        var listadoNomina = [];

                var datosMatriculas = await modeloprocesocarreras.ListadoMatriculasCarrerasPeriodosTransaccion(transaction, carrera, periodo, estado);
                var DatosCarreras = await modeloprocesoCupo.ObtenerDatosBaseTransaccion(transaction,"OAS_Master",carrera);

                if (datosMatriculas.count > 0) {
                 var j=0;
                    for (var matriculas of datosMatriculas.data) {
                        j = j + 1
                        console.log("Carrera " + carrera  + " Matricula " + matriculas.strCedula + " " + j);
                 
                        var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/" + tools.CedulaSinGuion(matriculas.strCedula), { httpsAgent: agent });
                
                        if (ObtenerPersona.data.success) {
                            if (ObtenerPersona.data.listado.length > 0) {
                                matriculas.per_nombres = ObtenerPersona.data.listado[0].per_nombres
                                matriculas.per_primerApellido = ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
                                matriculas.procedencia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].procedencia
                                matriculas.nac_nombre = ObtenerPersona.data.listado[0].nac_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].nac_nombre
                                matriculas.per_email = ObtenerPersona.data.listado[0].per_email == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_email
                                matriculas.per_emailAlternativo = ObtenerPersona.data.listado[0].per_emailAlternativo == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_emailAlternativo
                                matriculas.per_telefonoCelular = ObtenerPersona.data.listado[0].per_telefonoCelular == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_telefonoCelular
                                matriculas.per_telefonoCasa = ObtenerPersona.data.listado[0].per_telefonoCasa == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_telefonoCasa
                                matriculas.per_fechaNacimiento = ObtenerPersona.data.listado[0].per_fechaNacimiento == null ? 'NINGUNO' : tools.formatearFechaNacimiento(ObtenerPersona.data.listado[0].per_fechaNacimiento)
                                matriculas.eci_nombre = ObtenerPersona.data.listado[0].eci_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].eci_nombre
                                matriculas.etn_nombre = ObtenerPersona.data.listado[0].etn_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].etn_nombre
                                matriculas.gen_nombre = ObtenerPersona.data.listado[0].gen_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].gen_nombre
                                matriculas.prq_nombre = ObtenerPersona.data.listado[0].prq_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].prq_nombre
                                matriculas.dir_callePrincipal = ObtenerPersona.data.listado[0].dir_callePrincipal == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].dir_callePrincipal
                                matriculas.sexo = ObtenerPersona.data.listado[0].sexo == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].sexo
                                const [provincia, canton, parroquia] = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].procedencia.split("/");
                                matriculas.provincia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : provincia
                                matriculas.canton = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : canton
                                matriculas.parroquia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : parroquia
                                matriculas.sede = DatosCarreras.data[0].strSede,
                                    matriculas.facultad = DatosCarreras.data[0].strNombreFacultad,
                                    matriculas.carrera = DatosCarreras.data[0].strNombreCarrera

                            } else {
                                matriculas.per_nombres = 'NINGNUNO'
                                matriculas.per_primerApellido = 'NINGNUNO'
                                matriculas.per_segundoApellido = 'NINGNUNO'
                                matriculas.procedencia = 'NINGNUNO'
                                matriculas.nac_nombre = 'NINGNUNO'
                                matriculas.per_email = 'NINGNUNO'
                                matriculas.per_emailAlternativo = 'NINGNUNO'
                                matriculas.per_telefonoCelular = 'NINGNUNO'
                                matriculas.per_telefonoCelular = 'NINGNUNO'
                                matriculas.per_telefonoCelular = 'NINGNUNO'
                                matriculas.per_fechaNacimiento = 'NINGNUNO'
                                matriculas.eci_nombre = 'NINGNUNO'
                                matriculas.etn_nombre = 'NINGNUNO'
                                matriculas.gen_nombre = 'NINGNUNO'
                                matriculas.prq_nombre = 'NINGNUNO'
                                matriculas.dir_callePrincipal = 'NINGNUNO'
                                matriculas.sexo = 'NINGNUNO'
                                matriculas.dir_callePrincipal = 'NINGNUNO'
                                matriculas.provincia = 'NINGNUNO'
                                matriculas.canton = 'NINGNUNO'
                                matriculas.parroquia = 'NINGNUNO'
                                matriculas.sede = 'NINGNUNO'
                                matriculas.facultad = 'NINGNUNO'
                                matriculas.carrera = 'NINGNUNO'
                            }
                        } else {
                            matriculas.per_nombres = matriculas.strNombres
                            matriculas.per_primerApellido = matriculas.strApellidos
                            matriculas.per_segundoApellido = ''
                            matriculas.sede = DatosCarreras.data[0].strSede,
                                matriculas.facultad = DatosCarreras.data[0].strNombreFacultad,
                                matriculas.carrera = DatosCarreras.data[0].strNombreCarrera,
                                matriculas.procedencia = 'NINGNUNO'
                            matriculas.nac_nombre = 'NINGNUNO'
                            matriculas.per_email = 'NINGNUNO'
                            matriculas.per_emailAlternativo = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_fechaNacimiento = 'NINGNUNO'
                            matriculas.eci_nombre = 'NINGNUNO'
                            matriculas.etn_nombre = 'NINGNUNO'
                            matriculas.gen_nombre = 'NINGNUNO'
                            matriculas.prq_nombre = 'NINGNUNO'
                            matriculas.dir_callePrincipal = 'NINGNUNO'
                            matriculas.sexo = 'NINGNUNO'
                            matriculas.dir_callePrincipal = 'NINGNUNO'
                            matriculas.provincia = 'NINGNUNO'
                            matriculas.canton = 'NINGNUNO'
                            matriculas.parroquia = 'NINGNUNO'
                        }


                        var PagoMatriculaestudiante = await modeloprocesocarreras.ObtenerPagoMatriculaEstudianteTransaccion(transaction, "pagosonline_db", periodo, tools.CedulaSinGuion(matriculas.strCedula));

                        var AsignaturasMatriculadas = await modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidadTrasaccion(transaction, carrera, periodo, matriculas.sintCodigo);
 
                        var CalulosEstuidantesRegulares = await modeloprocesocarreras.CalculoEstudiantesRegulares60PorCientoTransaccion(transaction, carrera, periodo, matriculas.sintCodigo);
    
                        if(await tools.VerificacionPeriodoTresCalificaciones(periodo)){
                            var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudianteTransaccion(transaction, carrera, periodo, matriculas.sintCodigo);
                        }else{
                             var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudianteTransaccion(transaction, carrera, periodo, matriculas.sintCodigo);
                        }
                        
                     
                        matriculas.aprobacion = datosAprobacion.data[0].Reprueba == 0 ? 'APROBADO' : 'REPROBADO'
                        if (AsignaturasMatriculadas.count) {
                            matriculas.primera = AsignaturasMatriculadas.data[0].Primera > 0 ? 'SI' : 'NO'
                            matriculas.cantidadprimera = AsignaturasMatriculadas.data[0].Primera
                            matriculas.segunda = AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                            matriculas.cantidadsegunda = AsignaturasMatriculadas.data[0].Segunda
                            matriculas.repetidor = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                            matriculas.tercera = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : 'NO'
                            matriculas.cantidadtercera = AsignaturasMatriculadas.data[0].Tercera
                        }
                        if (CalulosEstuidantesRegulares.count > 0) {
                            matriculas.regular = CalulosEstuidantesRegulares.data[0].Estudiante
                        }
                        if (PagoMatriculaestudiante.count > 0) {
                            matriculas.gratuidad = 'NO'
                            matriculas.valorpago = PagoMatriculaestudiante.data[0].fltTotal
                        } else {
                            matriculas.gratuidad = 'SI'
                            matriculas.valorpago = 0
                        }
                        listadoNomina.push(matriculas)
                      
                    }

                }

             var base64 = await reportescarreras.ExcelReporteMaticulasCarrerasIndividual(carrera ,periodo, listadoNomina);
                return base64
        }
         catch (err) {
                await transaction.rollback();
                console.error(err);
                return 'ERROR';
            } finally {
                await transaction.commit();
                await pool.close();
            }

    
}
/*async function FuncionReporteExcelMatriculasCarrerasTodasInstitucinal(periodo, estado) {
    console.log("Aqui")
    try {
        var listadoNomina = [];
        var ListadoCarrera = await modeloprocesocarreras.ListadoHomologacionesCarreraPeriodo("OAS_Master", periodo);
        console.log("ListadoCarrera.length")
        console.log(ListadoCarrera.count)
        var i = 0;
        for (var carrera of ListadoCarrera.data) {
            i = i + 1
            console.log("Carrera " + carrera.hmbdbasecar + " " + i);
            var datosMatriculas = await modeloprocesocarreras.ListadoMatriculasCarrerasPeriodos(carrera.hmbdbasecar, periodo, estado);
            var DatosCarreras = await modeloprocesoCupo.ObtenerDatosBase(carrera.hmbdbasecar);
            if (datosMatriculas.count > 0) {
                var j = 0;
                for (var matriculas of datosMatriculas.data) {
                    j = j + 1
                    console.log("Carrera " + carrera.hmbdbasecar + "#  " + i + " Matricula " + matriculas.strCedula + " " + j);
                    var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/" + tools.CedulaSinGuion(matriculas.strCedula), { httpsAgent: agent });
                    if (ObtenerPersona.data.success) {
                        if (ObtenerPersona.data.listado.length > 0) {
                            matriculas.per_nombres = ObtenerPersona.data.listado[0].per_nombres
                            matriculas.per_primerApellido = ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
                            matriculas.procedencia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].procedencia
                            matriculas.nac_nombre = ObtenerPersona.data.listado[0].nac_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].nac_nombre
                            matriculas.per_email = ObtenerPersona.data.listado[0].per_email == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_email
                            matriculas.per_emailAlternativo = ObtenerPersona.data.listado[0].per_emailAlternativo == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_emailAlternativo
                            matriculas.per_telefonoCelular = ObtenerPersona.data.listado[0].per_telefonoCelular == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_telefonoCelular
                            matriculas.per_telefonoCasa = ObtenerPersona.data.listado[0].per_telefonoCasa == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_telefonoCasa
                            matriculas.per_fechaNacimiento = ObtenerPersona.data.listado[0].per_fechaNacimiento == null ? 'NINGUNO' : tools.formatearFechaNacimiento(ObtenerPersona.data.listado[0].per_fechaNacimiento)
                            matriculas.eci_nombre = ObtenerPersona.data.listado[0].eci_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].eci_nombre
                            matriculas.etn_nombre = ObtenerPersona.data.listado[0].etn_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].etn_nombre
                            matriculas.gen_nombre = ObtenerPersona.data.listado[0].gen_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].gen_nombre
                            matriculas.prq_nombre = ObtenerPersona.data.listado[0].prq_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].prq_nombre
                            matriculas.dir_callePrincipal = ObtenerPersona.data.listado[0].dir_callePrincipal == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].dir_callePrincipal
                            matriculas.sexo = ObtenerPersona.data.listado[0].sexo == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].sexo
                            const [provincia, canton, parroquia] = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].procedencia.split("/");
                            matriculas.provincia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : provincia
                            matriculas.canton = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : canton
                            matriculas.parroquia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : parroquia
                            matriculas.sede = DatosCarreras.data[0].strSede,
                                matriculas.facultad = DatosCarreras.data[0].strNombreFacultad,
                                matriculas.carrera = DatosCarreras.data[0].strNombreCarrera

                        } else {
                            matriculas.per_nombres = 'NINGNUNO'
                            matriculas.per_primerApellido = 'NINGNUNO'
                            matriculas.per_segundoApellido = 'NINGNUNO'
                            matriculas.procedencia = 'NINGNUNO'
                            matriculas.nac_nombre = 'NINGNUNO'
                            matriculas.per_email = 'NINGNUNO'
                            matriculas.per_emailAlternativo = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_fechaNacimiento = 'NINGNUNO'
                            matriculas.eci_nombre = 'NINGNUNO'
                            matriculas.etn_nombre = 'NINGNUNO'
                            matriculas.gen_nombre = 'NINGNUNO'
                            matriculas.prq_nombre = 'NINGNUNO'
                            matriculas.dir_callePrincipal = 'NINGNUNO'
                            matriculas.sexo = 'NINGNUNO'
                            matriculas.dir_callePrincipal = 'NINGNUNO'
                            matriculas.provincia = 'NINGNUNO'
                            matriculas.canton = 'NINGNUNO'
                            matriculas.parroquia = 'NINGNUNO'
                            matriculas.sede = 'NINGNUNO'
                            matriculas.facultad = 'NINGNUNO'
                            matriculas.carrera = 'NINGNUNO'
                        }
                    } else {
                        matriculas.per_nombres = matriculas.strNombres
                        matriculas.per_primerApellido = matriculas.strApellidos
                        matriculas.per_segundoApellido = ''
                        matriculas.sede = DatosCarreras.data[0].strSede,
                            matriculas.facultad = DatosCarreras.data[0].strNombreFacultad,
                            matriculas.carrera = DatosCarreras.data[0].strNombreCarrera,
                            matriculas.procedencia = 'NINGNUNO'
                        matriculas.nac_nombre = 'NINGNUNO'
                        matriculas.per_email = 'NINGNUNO'
                        matriculas.per_emailAlternativo = 'NINGNUNO'
                        matriculas.per_telefonoCelular = 'NINGNUNO'
                        matriculas.per_telefonoCelular = 'NINGNUNO'
                        matriculas.per_telefonoCelular = 'NINGNUNO'
                        matriculas.per_fechaNacimiento = 'NINGNUNO'
                        matriculas.eci_nombre = 'NINGNUNO'
                        matriculas.etn_nombre = 'NINGNUNO'
                        matriculas.gen_nombre = 'NINGNUNO'
                        matriculas.prq_nombre = 'NINGNUNO'
                        matriculas.dir_callePrincipal = 'NINGNUNO'
                        matriculas.sexo = 'NINGNUNO'
                        matriculas.dir_callePrincipal = 'NINGNUNO'
                        matriculas.provincia = 'NINGNUNO'
                        matriculas.canton = 'NINGNUNO'
                        matriculas.parroquia = 'NINGNUNO'
                    }


                    var PagoMatriculaestudiante = await modeloprocesocarreras.ObtenerPagoMatriculaEstudiante("pagosonline_db", periodo, tools.CedulaSinGuion(matriculas.strCedula));
                    var AsignaturasMatriculadas = await modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidad(carrera.hmbdbasecar, periodo, matriculas.sintCodigo);
                    var CalulosEstuidantesRegulares = await modeloprocesocarreras.CalculoEstudiantesRegulares60PorCiento(carrera.hmbdbasecar, periodo, matriculas.sintCodigo);
                     if(await tools.VerificacionPeriodoTresCalificaciones(periodo)){
                            var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudiante(carrera.hmbdbasecar, periodo, matriculas.sintCodigo);
                        }else{
                             var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudiante(carrera.hmbdbasecar, periodo, matriculas.sintCodigo);
                        }
                    matriculas.aprobacion = datosAprobacion.data[0].Reprueba == 0 ? 'APROBADO' : 'REPROBADO'
                    if (AsignaturasMatriculadas.count) {
                        matriculas.primera = AsignaturasMatriculadas.data[0].Primera > 0 ? 'SI' : 'NO'
                        matriculas.cantidadprimera = AsignaturasMatriculadas.data[0].Primera
                        matriculas.segunda = AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                        matriculas.cantidadsegunda = AsignaturasMatriculadas.data[0].Segunda
                        matriculas.repetidor = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                        matriculas.tercera = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : 'NO'
                        matriculas.cantidadtercera = AsignaturasMatriculadas.data[0].Tercera
                    }
                    if (CalulosEstuidantesRegulares.count > 0) {
                        matriculas.regular = CalulosEstuidantesRegulares.data[0].Estudiante
                    }
                    if (PagoMatriculaestudiante.count > 0) {
                        matriculas.gratuidad = 'NO'
                        matriculas.valorpago = PagoMatriculaestudiante.data[0].fltTotal
                    } else {
                        matriculas.gratuidad = 'SI'
                        matriculas.valorpago = 0
                    }
                    listadoNomina.push(matriculas)
                    //  var base64 = await reportescarreras.ExcelReporteMaticulasCarrerasInstitucional(periodo,listadoNomina);
                    //    return base64
                }

            }
        }
        var base64 = await reportescarreras.ExcelReporteMaticulasCarrerasInstitucional(periodo, listadoNomina);
        return base64

    } catch (err) {
        console.log(err)
        return { "error: ": err }
    }
}*/



async function FuncionReporteExcelMatriculasCarrerasTodasInstitucionalTransaccion(periodo, estado) {

            const pool = await iniciarMasterPool("OAS_Master");
            await pool.connect();
            const transaction = await iniciarMasterTransaccion(pool);
            await transaction.begin();
            try {
        var listadoNomina = [];
        var ListadoCarrera = await modeloprocesocarreras.ListadoHomologacionesCarreraPeriodoTransaccion(transaction, "OAS_Master", periodo);
        console.log(ListadoCarrera.count)
        var i = 0;
        for (var carrera of ListadoCarrera.data) {
    
                i = i + 1
                console.log("Carrera " + carrera.hmbdbasecar + " " + i);
                var datosMatriculas = await modeloprocesocarreras.ListadoMatriculasCarrerasPeriodosTransaccion(transaction, carrera.hmbdbasecar, periodo, estado);
                var DatosCarreras = await modeloprocesoCupo.ObtenerDatosBaseTransaccion(transaction,"OAS_Master",carrera.hmbdbasecar);

                if (datosMatriculas.count > 0) {
                    var j = 0;
                    for (var matriculas of datosMatriculas.data) {
                        j = j + 1
                        console.log("Carrera " + carrera.hmbdbasecar + "#  " + i + " Matricula " + matriculas.strCedula + " " + j);
                 
                        var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/" + tools.CedulaSinGuion(matriculas.strCedula), { httpsAgent: agent });
                
                        if (ObtenerPersona.data.success) {
                            if (ObtenerPersona.data.listado.length > 0) {
                                matriculas.per_nombres = ObtenerPersona.data.listado[0].per_nombres
                                matriculas.per_primerApellido = ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
                                matriculas.procedencia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].procedencia
                                matriculas.nac_nombre = ObtenerPersona.data.listado[0].nac_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].nac_nombre
                                matriculas.per_email = ObtenerPersona.data.listado[0].per_email == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_email
                                matriculas.per_emailAlternativo = ObtenerPersona.data.listado[0].per_emailAlternativo == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_emailAlternativo
                                matriculas.per_telefonoCelular = ObtenerPersona.data.listado[0].per_telefonoCelular == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_telefonoCelular
                                matriculas.per_telefonoCasa = ObtenerPersona.data.listado[0].per_telefonoCasa == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_telefonoCasa
                                matriculas.per_fechaNacimiento = ObtenerPersona.data.listado[0].per_fechaNacimiento == null ? 'NINGUNO' : tools.formatearFechaNacimiento(ObtenerPersona.data.listado[0].per_fechaNacimiento)
                                matriculas.eci_nombre = ObtenerPersona.data.listado[0].eci_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].eci_nombre
                                matriculas.etn_nombre = ObtenerPersona.data.listado[0].etn_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].etn_nombre
                                matriculas.gen_nombre = ObtenerPersona.data.listado[0].gen_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].gen_nombre
                                matriculas.prq_nombre = ObtenerPersona.data.listado[0].prq_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].prq_nombre
                                matriculas.dir_callePrincipal = ObtenerPersona.data.listado[0].dir_callePrincipal == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].dir_callePrincipal
                                matriculas.sexo = ObtenerPersona.data.listado[0].sexo == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].sexo
                                const [provincia, canton, parroquia] = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].procedencia.split("/");
                                matriculas.provincia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : provincia
                                matriculas.canton = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : canton
                                matriculas.parroquia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : parroquia
                                matriculas.sede = DatosCarreras.data[0].strSede,
                                    matriculas.facultad = DatosCarreras.data[0].strNombreFacultad,
                                    matriculas.carrera = DatosCarreras.data[0].strNombreCarrera

                            } else {
                                matriculas.per_nombres = 'NINGNUNO'
                                matriculas.per_primerApellido = 'NINGNUNO'
                                matriculas.per_segundoApellido = 'NINGNUNO'
                                matriculas.procedencia = 'NINGNUNO'
                                matriculas.nac_nombre = 'NINGNUNO'
                                matriculas.per_email = 'NINGNUNO'
                                matriculas.per_emailAlternativo = 'NINGNUNO'
                                matriculas.per_telefonoCelular = 'NINGNUNO'
                                matriculas.per_telefonoCelular = 'NINGNUNO'
                                matriculas.per_telefonoCelular = 'NINGNUNO'
                                matriculas.per_fechaNacimiento = 'NINGNUNO'
                                matriculas.eci_nombre = 'NINGNUNO'
                                matriculas.etn_nombre = 'NINGNUNO'
                                matriculas.gen_nombre = 'NINGNUNO'
                                matriculas.prq_nombre = 'NINGNUNO'
                                matriculas.dir_callePrincipal = 'NINGNUNO'
                                matriculas.sexo = 'NINGNUNO'
                                matriculas.dir_callePrincipal = 'NINGNUNO'
                                matriculas.provincia = 'NINGNUNO'
                                matriculas.canton = 'NINGNUNO'
                                matriculas.parroquia = 'NINGNUNO'
                                matriculas.sede = 'NINGNUNO'
                                matriculas.facultad = 'NINGNUNO'
                                matriculas.carrera = 'NINGNUNO'
                            }
                        } else {
                            matriculas.per_nombres = matriculas.strNombres
                            matriculas.per_primerApellido = matriculas.strApellidos
                            matriculas.per_segundoApellido = ''
                            matriculas.sede = DatosCarreras.data[0].strSede,
                                matriculas.facultad = DatosCarreras.data[0].strNombreFacultad,
                                matriculas.carrera = DatosCarreras.data[0].strNombreCarrera,
                                matriculas.procedencia = 'NINGNUNO'
                            matriculas.nac_nombre = 'NINGNUNO'
                            matriculas.per_email = 'NINGNUNO'
                            matriculas.per_emailAlternativo = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_fechaNacimiento = 'NINGNUNO'
                            matriculas.eci_nombre = 'NINGNUNO'
                            matriculas.etn_nombre = 'NINGNUNO'
                            matriculas.gen_nombre = 'NINGNUNO'
                            matriculas.prq_nombre = 'NINGNUNO'
                            matriculas.dir_callePrincipal = 'NINGNUNO'
                            matriculas.sexo = 'NINGNUNO'
                            matriculas.dir_callePrincipal = 'NINGNUNO'
                            matriculas.provincia = 'NINGNUNO'
                            matriculas.canton = 'NINGNUNO'
                            matriculas.parroquia = 'NINGNUNO'
                        }


                        var PagoMatriculaestudiante = await modeloprocesocarreras.ObtenerPagoMatriculaEstudianteTransaccion(transaction, "pagosonline_db", periodo, tools.CedulaSinGuion(matriculas.strCedula));

                        var AsignaturasMatriculadas = await modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidadTrasaccion(transaction, carrera.hmbdbasecar, periodo, matriculas.sintCodigo);
 
                        var CalulosEstuidantesRegulares = await modeloprocesocarreras.CalculoEstudiantesRegulares60PorCientoTransaccion(transaction, carrera.hmbdbasecar, periodo, matriculas.sintCodigo);
                        
                         if(await tools.VerificacionPeriodoTresCalificaciones(periodo)){
                            var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudianteTransaccion(transaction, carrera.hmbdbasecar, periodo, matriculas.sintCodigo);
                        
                        }else{
                             var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudianteTransaccion(transaction, carrera.hmbdbasecar, periodo, matriculas.sintCodigo);
                        }
                        matriculas.aprobacion = datosAprobacion.data[0].Reprueba == 0 ? 'APROBADO' : 'REPROBADO'
                        if (AsignaturasMatriculadas.count) {
                            matriculas.primera = AsignaturasMatriculadas.data[0].Primera > 0 ? 'SI' : 'NO'
                            matriculas.cantidadprimera = AsignaturasMatriculadas.data[0].Primera
                            matriculas.segunda = AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                            matriculas.cantidadsegunda = AsignaturasMatriculadas.data[0].Segunda
                            matriculas.repetidor = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                            matriculas.tercera = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : 'NO'
                            matriculas.cantidadtercera = AsignaturasMatriculadas.data[0].Tercera
                        }
                        if (CalulosEstuidantesRegulares.count > 0) {
                            matriculas.regular = CalulosEstuidantesRegulares.data[0].Estudiante
                        }
                        if (PagoMatriculaestudiante.count > 0) {
                            matriculas.gratuidad = 'NO'
                            matriculas.valorpago = PagoMatriculaestudiante.data[0].fltTotal
                        } else {
                            matriculas.gratuidad = 'SI'
                            matriculas.valorpago = 0
                        }
                        listadoNomina.push(matriculas)
                      
                    }

                }

              
            }
             var base64 = await reportescarreras.ExcelReporteMaticulasCarrerasInstitucional(periodo, listadoNomina);
                return base64
        }
         catch (err) {
                await transaction.rollback();
                console.error(err);
                return 'ERROR';
            } finally {
                await transaction.commit();
                await pool.close();
            }

    
}


async function FuncionReporteExcelMatriculasNivelacionTodasInstitucional(periodo, estado) {
    console.log("Aqui")
    try {
        var listadoNomina = [];
        var ListadoCarrera = await modeloprocesocarreras.ListadoHomologacionesCarreraPeriodo("OAS_Master", periodo);
        console.log("ListadoCarrera.length")
        console.log(ListadoCarrera.count)
        var i = 0;
        for (var carrera of ListadoCarrera.data) {
            i = i + 1
            console.log("Carrera " + carrera.hmbdbaseniv + " " + i);
            var datosMatriculas = await modeloprocesocarreras.ListadoMatriculasCarrerasPeriodos(carrera.hmbdbaseniv, periodo, estado);
            var DatosCarreras = await modeloprocesoCupo.ObtenerDatosBase(carrera.hmbdbaseniv);
            if (datosMatriculas.count > 0) {
                var j = 0;
                for (var matriculas of datosMatriculas.data) {
                    j = j + 1
                    console.log("Carrera " + carrera.hmbdbaseniv + "#  " + i + " Matricula " + matriculas.strCedula + " " + j);
                    var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/" + tools.CedulaSinGuion(matriculas.strCedula), { httpsAgent: agent });
                    if (ObtenerPersona.data.success) {
                        if (ObtenerPersona.data.listado.length > 0) {
                            matriculas.per_nombres = ObtenerPersona.data.listado[0].per_nombres
                            matriculas.per_primerApellido = ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
                            matriculas.procedencia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].procedencia
                            matriculas.nac_nombre = ObtenerPersona.data.listado[0].nac_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].nac_nombre
                            matriculas.per_email = ObtenerPersona.data.listado[0].per_email == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_email
                            matriculas.per_emailAlternativo = ObtenerPersona.data.listado[0].per_emailAlternativo == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_emailAlternativo
                            matriculas.per_telefonoCelular = ObtenerPersona.data.listado[0].per_telefonoCelular == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_telefonoCelular
                            matriculas.per_telefonoCasa = ObtenerPersona.data.listado[0].per_telefonoCasa == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_telefonoCasa
                            matriculas.per_fechaNacimiento = ObtenerPersona.data.listado[0].per_fechaNacimiento == null ? 'NINGUNO' : tools.formatearFechaNacimiento(ObtenerPersona.data.listado[0].per_fechaNacimiento)
                            matriculas.eci_nombre = ObtenerPersona.data.listado[0].eci_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].eci_nombre
                            matriculas.etn_nombre = ObtenerPersona.data.listado[0].etn_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].etn_nombre
                            matriculas.gen_nombre = ObtenerPersona.data.listado[0].gen_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].gen_nombre
                            matriculas.prq_nombre = ObtenerPersona.data.listado[0].prq_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].prq_nombre
                            matriculas.dir_callePrincipal = ObtenerPersona.data.listado[0].dir_callePrincipal == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].dir_callePrincipal
                            matriculas.sexo = ObtenerPersona.data.listado[0].sexo == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].sexo
                            const [provincia, canton, parroquia] = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].procedencia.split("/");
                            matriculas.provincia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : provincia
                            matriculas.canton = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : canton
                            matriculas.parroquia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : parroquia
                            matriculas.sede = DatosCarreras.data[0].strSede,
                                matriculas.facultad = DatosCarreras.data[0].strNombreFacultad,
                                matriculas.carrera = DatosCarreras.data[0].strNombreCarrera

                        } else {
                            matriculas.per_nombres = 'NINGNUNO'
                            matriculas.per_primerApellido = 'NINGNUNO'
                            matriculas.per_segundoApellido = 'NINGNUNO'
                            matriculas.procedencia = 'NINGNUNO'
                            matriculas.nac_nombre = 'NINGNUNO'
                            matriculas.per_email = 'NINGNUNO'
                            matriculas.per_emailAlternativo = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_fechaNacimiento = 'NINGNUNO'
                            matriculas.eci_nombre = 'NINGNUNO'
                            matriculas.etn_nombre = 'NINGNUNO'
                            matriculas.gen_nombre = 'NINGNUNO'
                            matriculas.prq_nombre = 'NINGNUNO'
                            matriculas.dir_callePrincipal = 'NINGNUNO'
                            matriculas.sexo = 'NINGNUNO'
                            matriculas.dir_callePrincipal = 'NINGNUNO'
                            matriculas.provincia = 'NINGNUNO'
                            matriculas.canton = 'NINGNUNO'
                            matriculas.parroquia = 'NINGNUNO'
                            matriculas.sede = 'NINGNUNO'
                            matriculas.facultad = 'NINGNUNO'
                            matriculas.carrera = 'NINGNUNO'
                        }
                    } else {
                        matriculas.per_nombres = matriculas.strNombres
                        matriculas.per_primerApellido = matriculas.strApellidos
                        matriculas.per_segundoApellido = ''
                        matriculas.sede = DatosCarreras.data[0].strSede,
                            matriculas.facultad = DatosCarreras.data[0].strNombreFacultad,
                            matriculas.carrera = DatosCarreras.data[0].strNombreCarrera,
                            matriculas.procedencia = 'NINGNUNO'
                        matriculas.nac_nombre = 'NINGNUNO'
                        matriculas.per_email = 'NINGNUNO'
                        matriculas.per_emailAlternativo = 'NINGNUNO'
                        matriculas.per_telefonoCelular = 'NINGNUNO'
                        matriculas.per_telefonoCelular = 'NINGNUNO'
                        matriculas.per_telefonoCelular = 'NINGNUNO'
                        matriculas.per_fechaNacimiento = 'NINGNUNO'
                        matriculas.eci_nombre = 'NINGNUNO'
                        matriculas.etn_nombre = 'NINGNUNO'
                        matriculas.gen_nombre = 'NINGNUNO'
                        matriculas.prq_nombre = 'NINGNUNO'
                        matriculas.dir_callePrincipal = 'NINGNUNO'
                        matriculas.sexo = 'NINGNUNO'
                        matriculas.dir_callePrincipal = 'NINGNUNO'
                        matriculas.provincia = 'NINGNUNO'
                        matriculas.canton = 'NINGNUNO'
                        matriculas.parroquia = 'NINGNUNO'
                    }


                    var PagoMatriculaestudiante = await modeloprocesocarreras.ObtenerPagoMatriculaEstudiante("pagosonline_db", periodo, tools.CedulaSinGuion(matriculas.strCedula));
                    var AsignaturasMatriculadas = await modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidad(carrera.hmbdbaseniv, periodo, matriculas.sintCodigo);
                    var CalulosEstuidantesRegulares = await modeloprocesocarreras.CalculoEstudiantesRegulares60PorCiento(carrera.hmbdbaseniv, periodo, matriculas.sintCodigo);
                     if(await tools.VerificacionPeriodoTresCalificaciones(periodo)){
                            var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudiante( carrera.hmbdbaseniv, periodo, matriculas.sintCodigo);
                        }else{
                             var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudiante(carrera.hmbdbaseniv, periodo, matriculas.sintCodigo);
                        }
                    matriculas.aprobacion = datosAprobacion.data[0].Reprueba == 0 ? 'APROBADO' : 'REPROBADO'
                    if (AsignaturasMatriculadas.count) {
                        matriculas.primera = AsignaturasMatriculadas.data[0].Primera > 0 ? 'SI' : 'NO'
                        matriculas.cantidadprimera = AsignaturasMatriculadas.data[0].Primera
                        matriculas.segunda = AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                        matriculas.cantidadsegunda = AsignaturasMatriculadas.data[0].Segunda
                        matriculas.repetidor = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                        matriculas.tercera = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : 'NO'
                        matriculas.cantidadtercera = AsignaturasMatriculadas.data[0].Tercera
                    }
                    if (CalulosEstuidantesRegulares.count > 0) {
                        matriculas.regular = CalulosEstuidantesRegulares.data[0].Estudiante
                    }
                    if (PagoMatriculaestudiante.count > 0) {
                        matriculas.gratuidad = 'NO'
                        matriculas.valorpago = PagoMatriculaestudiante.data[0].fltTotal
                    } else {
                        matriculas.gratuidad = 'SI'
                        matriculas.valorpago = 0
                    }
                    listadoNomina.push(matriculas)
                 
                }

            }
        }
        var base64 = await reportescarreras.ExcelReporteMaticulasNivelacionInstitucional(periodo, listadoNomina);
        return base64

    } catch (err) {
        console.log(err)
        return { "error: ": err }
    }
}
async function FuncionReporteExcelMatriculasNivelacionTodasInstitucionalTransaccion(periodo, estado) {

   console.log("Aqui Transaxcc")
            const pool = await iniciarMasterPool("OAS_Master");
            await pool.connect();
            const transaction = await iniciarMasterTransaccion(pool);
            await transaction.begin();
            try {
        var listadoNomina = [];
        var ListadoCarrera = await modeloprocesocarreras.ListadoHomologacionesCarreraPeriodoTransaccion(transaction, "OAS_Master", periodo);
        console.log(ListadoCarrera.count)
        var i = 0;
        for (var carrera of ListadoCarrera.data) {
    
                i = i + 1
                console.log("Carrera " + carrera.hmbdbaseniv + " " + i);
                var datosMatriculas = await modeloprocesocarreras.ListadoMatriculasCarrerasPeriodosTransaccion(transaction, carrera.hmbdbaseniv, periodo, estado);
                var DatosCarreras = await modeloprocesoCupo.ObtenerDatosBaseTransaccion(transaction,"OAS_Master",carrera.hmbdbaseniv);

                if (datosMatriculas.count > 0) {
                    var j = 0;
                    for (var matriculas of datosMatriculas.data) {
                        j = j + 1
                        console.log("Carrera " + carrera.hmbdbaseniv + "#  " + i + " Matricula " + matriculas.strCedula + " " + j);
                 
                        var ObtenerPersona = await axios.get("https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/" + tools.CedulaSinGuion(matriculas.strCedula), { httpsAgent: agent });
                
                        if (ObtenerPersona.data.success) {
                            if (ObtenerPersona.data.listado.length > 0) {
                                matriculas.per_nombres = ObtenerPersona.data.listado[0].per_nombres
                                matriculas.per_primerApellido = ObtenerPersona.data.listado[0].per_primerApellido + " " + ObtenerPersona.data.listado[0].per_segundoApellido
                                matriculas.procedencia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].procedencia
                                matriculas.nac_nombre = ObtenerPersona.data.listado[0].nac_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].nac_nombre
                                matriculas.per_email = ObtenerPersona.data.listado[0].per_email == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_email
                                matriculas.per_emailAlternativo = ObtenerPersona.data.listado[0].per_emailAlternativo == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_emailAlternativo
                                matriculas.per_telefonoCelular = ObtenerPersona.data.listado[0].per_telefonoCelular == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_telefonoCelular
                                matriculas.per_telefonoCasa = ObtenerPersona.data.listado[0].per_telefonoCasa == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].per_telefonoCasa
                                matriculas.per_fechaNacimiento = ObtenerPersona.data.listado[0].per_fechaNacimiento == null ? 'NINGUNO' : tools.formatearFechaNacimiento(ObtenerPersona.data.listado[0].per_fechaNacimiento)
                                matriculas.eci_nombre = ObtenerPersona.data.listado[0].eci_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].eci_nombre
                                matriculas.etn_nombre = ObtenerPersona.data.listado[0].etn_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].etn_nombre
                                matriculas.gen_nombre = ObtenerPersona.data.listado[0].gen_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].gen_nombre
                                matriculas.prq_nombre = ObtenerPersona.data.listado[0].prq_nombre == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].prq_nombre
                                matriculas.dir_callePrincipal = ObtenerPersona.data.listado[0].dir_callePrincipal == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].dir_callePrincipal
                                matriculas.sexo = ObtenerPersona.data.listado[0].sexo == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].sexo
                                const [provincia, canton, parroquia] = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : ObtenerPersona.data.listado[0].procedencia.split("/");
                                matriculas.provincia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : provincia
                                matriculas.canton = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : canton
                                matriculas.parroquia = ObtenerPersona.data.listado[0].procedencia == null ? 'NINGUNO' : parroquia
                                matriculas.sede = DatosCarreras.data[0].strSede,
                                    matriculas.facultad = DatosCarreras.data[0].strNombreFacultad,
                                    matriculas.carrera = DatosCarreras.data[0].strNombreCarrera

                            } else {
                                matriculas.per_nombres = 'NINGNUNO'
                                matriculas.per_primerApellido = 'NINGNUNO'
                                matriculas.per_segundoApellido = 'NINGNUNO'
                                matriculas.procedencia = 'NINGNUNO'
                                matriculas.nac_nombre = 'NINGNUNO'
                                matriculas.per_email = 'NINGNUNO'
                                matriculas.per_emailAlternativo = 'NINGNUNO'
                                matriculas.per_telefonoCelular = 'NINGNUNO'
                                matriculas.per_telefonoCelular = 'NINGNUNO'
                                matriculas.per_telefonoCelular = 'NINGNUNO'
                                matriculas.per_fechaNacimiento = 'NINGNUNO'
                                matriculas.eci_nombre = 'NINGNUNO'
                                matriculas.etn_nombre = 'NINGNUNO'
                                matriculas.gen_nombre = 'NINGNUNO'
                                matriculas.prq_nombre = 'NINGNUNO'
                                matriculas.dir_callePrincipal = 'NINGNUNO'
                                matriculas.sexo = 'NINGNUNO'
                                matriculas.dir_callePrincipal = 'NINGNUNO'
                                matriculas.provincia = 'NINGNUNO'
                                matriculas.canton = 'NINGNUNO'
                                matriculas.parroquia = 'NINGNUNO'
                                matriculas.sede = 'NINGNUNO'
                                matriculas.facultad = 'NINGNUNO'
                                matriculas.carrera = 'NINGNUNO'
                            }
                        } else {
                            matriculas.per_nombres = matriculas.strNombres
                            matriculas.per_primerApellido = matriculas.strApellidos
                            matriculas.per_segundoApellido = ''
                            matriculas.sede = DatosCarreras.data[0].strSede,
                                matriculas.facultad = DatosCarreras.data[0].strNombreFacultad,
                                matriculas.carrera = DatosCarreras.data[0].strNombreCarrera,
                                matriculas.procedencia = 'NINGNUNO'
                            matriculas.nac_nombre = 'NINGNUNO'
                            matriculas.per_email = 'NINGNUNO'
                            matriculas.per_emailAlternativo = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_telefonoCelular = 'NINGNUNO'
                            matriculas.per_fechaNacimiento = 'NINGNUNO'
                            matriculas.eci_nombre = 'NINGNUNO'
                            matriculas.etn_nombre = 'NINGNUNO'
                            matriculas.gen_nombre = 'NINGNUNO'
                            matriculas.prq_nombre = 'NINGNUNO'
                            matriculas.dir_callePrincipal = 'NINGNUNO'
                            matriculas.sexo = 'NINGNUNO'
                            matriculas.dir_callePrincipal = 'NINGNUNO'
                            matriculas.provincia = 'NINGNUNO'
                            matriculas.canton = 'NINGNUNO'
                            matriculas.parroquia = 'NINGNUNO'
                        }


                        var PagoMatriculaestudiante = await modeloprocesocarreras.ObtenerPagoMatriculaEstudianteTransaccion(transaction, "pagosonline_db", periodo, tools.CedulaSinGuion(matriculas.strCedula));

                        var AsignaturasMatriculadas = await modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidadTrasaccion(transaction, carrera.hmbdbaseniv, periodo, matriculas.sintCodigo);
 
                        var CalulosEstuidantesRegulares = await modeloprocesocarreras.CalculoEstudiantesRegulares60PorCientoTransaccion(transaction, carrera.hmbdbaseniv, periodo, matriculas.sintCodigo);
                         if(await tools.VerificacionPeriodoTresCalificaciones(periodo)){
                            var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudianteTransaccion(transaction, carrera.hmbdbaseniv, periodo, matriculas.sintCodigo);
                        }else{
                             var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudianteTransaccion(transaction, carrera.hmbdbaseniv, periodo, matriculas.sintCodigo);
                        }
                        matriculas.aprobacion = datosAprobacion.data[0].Reprueba == 0 ? 'APROBADO' : 'REPROBADO'
                        if (AsignaturasMatriculadas.count) {
                            matriculas.primera = AsignaturasMatriculadas.data[0].Primera > 0 ? 'SI' : 'NO'
                            matriculas.cantidadprimera = AsignaturasMatriculadas.data[0].Primera
                            matriculas.segunda = AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                            matriculas.cantidadsegunda = AsignaturasMatriculadas.data[0].Segunda
                            matriculas.repetidor = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                            matriculas.tercera = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : 'NO'
                            matriculas.cantidadtercera = AsignaturasMatriculadas.data[0].Tercera
                        }
                        if (CalulosEstuidantesRegulares.count > 0) {
                            matriculas.regular = CalulosEstuidantesRegulares.data[0].Estudiante
                        }
                        if (PagoMatriculaestudiante.count > 0) {
                            matriculas.gratuidad = 'NO'
                            matriculas.valorpago = PagoMatriculaestudiante.data[0].fltTotal
                        } else {
                            matriculas.gratuidad = 'SI'
                            matriculas.valorpago = 0
                        }
                        listadoNomina.push(matriculas)
                      
                    }

                }

              
            }
             var base64 = await reportescarreras.ExcelReporteMaticulasNivelacionInstitucional(periodo, listadoNomina);
                return base64
        }
         catch (err) {
                await transaction.rollback();
                console.error(err);
                return 'ERROR';
            } finally {
                await transaction.commit();
                await pool.close();
            }

    
}
async function FuncionReporteExcelMatriculasAdmisionesInstitucinal(periodo) {
 
    try {
        var listadoNomina = [];
        var ListadoEstudiantes = await modeloprocesocarreras.ListadoEstudiantesConfirmadoMatrizSenecyt( "OAS_Cupos_Institucionales", periodo);
        var i=0;
        for (var estudiante of ListadoEstudiantes.data) {
            
            var content ={ "perNomenclatura": periodo, "cusId": estudiante.c_cus_id }
         var DatosCarreraNivelacion = await axios.post("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/cupo_carrera/periodo_cusid", content, { httpsAgent: agent });
        var DatosEstudiantes = await axios.get("https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/" + tools.CedulaSinGuion(estudiante.c_identificacion), { httpsAgent: agent });
        var ObjEstudianteMatriculadoNivelacion = await modeloprocesocarreras.EncontrarEstudianteMatriculado( estudiante.c_dbnivelacion, estudiante.c_periodo, estudiante.c_identificacion);
           i = i + 1
                console.log("Carrera " + DatosCarreraNivelacion.data.Carrera.carNombre + " " + estudiante.c_dbnivelacion + "# " +i);
        var ObjEstudianteMatriculadoCarrera = await modeloprocesocarreras.EncontrarEstudianteMatriculado( estudiante.c_dbcarrera, estudiante.c_periodo, estudiante.c_identificacion);
           if (ObjEstudianteMatriculadoCarrera.count > 0) {
              console.log("CARRERA")
            var DatosCarreras = await modeloprocesoCupo.ObtenerDatosBase(estudiante.c_dbcarrera);
        
            var listadoRetiros = await modeloreporteexcelcarrera.ProcesoListadoRetirosEstudiantePeriodo( estudiante.c_dbcarrera, periodo, estudiante.c_identificacion, ObjEstudianteMatriculadoCarrera.data[0].strCodEstud);

            var PagoMatriculaestudiante = await modeloprocesocarreras.ObtenerPagoMatriculaEstudiante( "pagosonline_db", periodo, tools.CedulaSinGuion(estudiante.c_identificacion));
            var AsignaturasMatriculadas = await modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidad( estudiante.c_dbcarrera, periodo, ObjEstudianteMatriculadoCarrera.data[0].sintCodigo);
            var CalulosEstuidantesRegulares = await modeloprocesocarreras.CalculoEstudiantesRegulares60PorCiento(estudiante.c_dbcarrera, periodo, ObjEstudianteMatriculadoCarrera.data[0].sintCodigo);
            var strEstadoAprobacion='REPROBADO'
            if(listadoRetiros.length==0){
                 if(await tools.VerificacionPeriodoTresCalificaciones(periodo)){
                            var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudiante(estudiante.c_dbcarrera, periodo, matriculas.sintCodigo);
                        }else{
                             var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudiante(estudiante.c_dbcarrera, periodo, matriculas.sintCodigo);
                        }
              // var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudiante(estudiante.c_dbcarrera, periodo, ObjEstudianteMatriculadoCarrera.data[0].sintCodigo);
               estudiante.aprobacion = datosAprobacion.data[0].Reprueba == 0 ? 'APROBADO' : 'REPROBADO'
            }               
            if (AsignaturasMatriculadas.count) {
                estudiante.primera = AsignaturasMatriculadas.data[0].Primera > 0 ? 'SI' : 'NO'
                estudiante.cantidadprimera = AsignaturasMatriculadas.data[0].Primera
                estudiante.segunda = AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                estudiante.cantidadsegunda = AsignaturasMatriculadas.data[0].Segunda
                estudiante.repetidor = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                estudiante.tercera = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : 'NO'
                estudiante.cantidadtercera = AsignaturasMatriculadas.data[0].Tercera
            }
            if (CalulosEstuidantesRegulares.count > 0) {
                estudiante.regular = CalulosEstuidantesRegulares.data[0].Estudiante
            }
            if (PagoMatriculaestudiante.count > 0) {
                estudiante.gratuidad = 'NO'
                estudiante.valorpago = PagoMatriculaestudiante.data[0].fltTotal
            } else {
                estudiante.gratuidad = 'SI'
                estudiante.valorpago = 0
            }
                estudiante.dc_idcupo= estudiante.c_id,
                estudiante.dc_idestado= 2,
                estudiante.dc_periodo= estudiante.c_periodo,
                estudiante.dc_dbcarrera= estudiante.c_dbcarrera,
                estudiante.dc_dbnivelacion= estudiante.c_dbnivelacion,
                estudiante.dc_observacion= "PROCESO MIGRACION // MATRICULADO EN CARRERA//",
                estudiante.dc_matriculacion= "MATRICULADO",
                estudiante.dc_sede= DatosCarreras.data[0].strSede,
                estudiante.dc_institucion='ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO',
                estudiante.dc_provincia=DatosCarreras.data[0].strSede=='MATRIZ'?'CHIMBORAZO':DatosCarreras.data[0].strSede=='MORONA'?'MORONA SANTIAGO':'ORELLANA',
                estudiante.dc_canton=DatosCarreras.data[0].strSede=='MATRIZ'?'RIOBAMBA':DatosCarreras.data[0].strSede=='MORONA'?'MORONA':'ORELLANA',
                estudiante.dc_parroquia= "",
                estudiante.dc_per_id= 0,
                estudiante.dc_ofaid=DatosCarreraNivelacion.data.cupOfaId,
                estudiante.dc_modalidad=DatosCarreraNivelacion.data.Modalidad.modNombre,
                estudiante.dc_jornada=DatosCarreraNivelacion.data.Jornada.jorNombre,
                estudiante.dc_periodo_admision=DatosCarreraNivelacion.data.Periodo.perNombre,
                estudiante.dc_tipocupo='NIVELACION CARRERA',
                estudiante.dc_matricula='ORDINARIA',
                estudiante.dc_cupo_aceptado=DatosCarreraNivelacion.data.Periodo.perNombre,
                estudiante.dc_fecha_matricula=tools.ConvertirFechaMatricula(ObjEstudianteMatriculadoCarrera.data[0].dtFechaAutorizada) ,
                estudiante.dc_estado_matricula='PRIMERA MATRICULA',
                estudiante.dc_cupo_admision= estudiante.c_cupo_admision,
                estudiante.dc_cusid= estudiante.c_cus_id,
                estudiante.dc_carrera=DatosCarreraNivelacion.data.Carrera.carNombre,
                estudiante.dc_facultad=DatosCarreraNivelacion.data.Carrera.Facultad.facNombre,
                estudiante.dc_nombres=DatosEstudiantes.data.listado[0].per_nombres,
                estudiante.dc_apellidos=DatosEstudiantes.data.listado[0].per_primerApellido+' '+DatosEstudiantes.data.listado[0].per_segundoApellido,
                estudiante.dc_cedula=estudiante.c_identificacion,
                estudiante.dc_ies_id=0,
                estudiante.dc_estado_fin_curso=listadoRetiros.length>0?'RETIRO PARCIAL VOLUNTARIO':strEstadoAprobacion,
                estudiante.dc_reubicado_primer_nivel='SI',
                estudiante.dc_oficio_notificacion_retiro='NINGUNO',
                estudiante.dc_fecha_notificacion_retiro='NINGUNO',
            

                estudiante.per_nombres = DatosEstudiantes.data.listado[0].per_nombres
                estudiante.per_primerApellido = DatosEstudiantes.data.listado[0].per_primerApellido + " " + DatosEstudiantes.data.listado[0].per_segundoApellido
                estudiante.procedencia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].procedencia
                estudiante.nac_nombre = DatosEstudiantes.data.listado[0].nac_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].nac_nombre
                estudiante.per_email = DatosEstudiantes.data.listado[0].per_email == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_email
                estudiante.per_emailAlternativo = DatosEstudiantes.data.listado[0].per_emailAlternativo == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_emailAlternativo
                estudiante.per_telefonoCelular = DatosEstudiantes.data.listado[0].per_telefonoCelular == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_telefonoCelular
                estudiante.per_telefonoCasa = DatosEstudiantes.data.listado[0].per_telefonoCasa == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_telefonoCasa
                estudiante.per_fechaNacimiento = DatosEstudiantes.data.listado[0].per_fechaNacimiento == null ? 'NINGUNO' : tools.formatearFechaNacimiento(DatosEstudiantes.data.listado[0].per_fechaNacimiento)
                estudiante.eci_nombre = DatosEstudiantes.data.listado[0].eci_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].eci_nombre
                estudiante.etn_nombre = DatosEstudiantes.data.listado[0].etn_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].etn_nombre
                estudiante.gen_nombre = DatosEstudiantes.data.listado[0].gen_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].gen_nombre
                estudiante.prq_nombre = DatosEstudiantes.data.listado[0].prq_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].prq_nombre
                estudiante.strCedula = estudiante.c_identificacion
                estudiante.strCodEstud = ObjEstudianteMatriculadoCarrera.data[0].strCodEstud
                estudiante.descripcionestado = ObjEstudianteMatriculadoCarrera.data[0].strCodEstado
                estudiante.descripcioninscripcion = 'ADMISION'
                
                estudiante.strCodNivel = ObjEstudianteMatriculadoCarrera.data[0].strCodNivel
                estudiante.dir_callePrincipal = DatosEstudiantes.data.listado[0].dir_callePrincipal == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].dir_callePrincipal
                estudiante.sexo = DatosEstudiantes.data.listado[0].sexo == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].sexo
            const [provincia, canton, parroquia] = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].procedencia.split("/");
            estudiante.provincia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : provincia
            estudiante.canton = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : canton
            estudiante.parroquia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : parroquia
            estudiante.sede = DatosCarreras.data[0].strSede,
            estudiante.facultad = DatosCarreras.data[0].strNombreFacultad,
            estudiante.carrera = DatosCarreras.data[0].strNombreCarrera
            listadoNomina.push(estudiante)
           // return base64 = await reportescarreras.ExcelReporteMaticulasAdmisionesInstitucional(periodo, listadoNomina);
            }
            if (ObjEstudianteMatriculadoNivelacion.count > 0) {
                console.log("NIVELACION")
                var DatosCarreras = await modeloprocesoCupo.ObtenerDatosBase(estudiante.c_dbnivelacion);
  
                var listadoRetiros = await modeloreporteexcelcarrera.ProcesoListadoRetirosEstudiantePeriodo( estudiante.c_dbnivelacion, periodo, estudiante.c_identificacion, ObjEstudianteMatriculadoNivelacion.data[0].strCodEstud);

                var PagoMatriculaestudiante = await modeloprocesocarreras.ObtenerPagoMatriculaEstudiante( "pagosonline_db", periodo, tools.CedulaSinGuion(estudiante.c_identificacion));
                var AsignaturasMatriculadas = await modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidad( estudiante.c_dbnivelacion, periodo, ObjEstudianteMatriculadoNivelacion.data[0].sintCodigo);
                var CalulosEstuidantesRegulares = await modeloprocesocarreras.CalculoEstudiantesRegulares60PorCiento(estudiante.c_dbnivelacion, periodo, ObjEstudianteMatriculadoNivelacion.data[0].sintCodigo);
                var strEstadoAprobacion='REPROBADO'
                if(listadoRetiros.length==0){
                     if(await tools.VerificacionPeriodoTresCalificaciones(periodo)){
                            var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudiante(estudiante.c_dbnivelacion, periodo, matriculas.sintCodigo);
                        }else{
                             var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudiante(estudiante.c_dbnivelacion, periodo, matriculas.sintCodigo);
                        }
                  // var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudiante(estudiante.c_dbnivelacion, periodo, ObjEstudianteMatriculadoNivelacion.data[0].sintCodigo);
                   estudiante.aprobacion = datosAprobacion.data[0].Reprueba == 0 ? 'APROBADO' : 'REPROBADO'
                }               
                if (AsignaturasMatriculadas.count) {
                    estudiante.primera = AsignaturasMatriculadas.data[0].Primera > 0 ? 'SI' : 'NO'
                    estudiante.cantidadprimera = AsignaturasMatriculadas.data[0].Primera
                    estudiante.segunda = AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                    estudiante.cantidadsegunda = AsignaturasMatriculadas.data[0].Segunda
                    estudiante.repetidor = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                    estudiante.tercera = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : 'NO'
                    estudiante.cantidadtercera = AsignaturasMatriculadas.data[0].Tercera
                }
                if (CalulosEstuidantesRegulares.count > 0) {
                    estudiante.regular = CalulosEstuidantesRegulares.data[0].Estudiante
                }
                if (PagoMatriculaestudiante.count > 0) {
                    estudiante.gratuidad = 'NO'
                    estudiante.valorpago = PagoMatriculaestudiante.data[0].fltTotal
                } else {
                    estudiante.gratuidad = 'SI'
                    estudiante.valorpago = 0
                }
                    estudiante.dc_idcupo= estudiante.c_id,
                    estudiante.dc_idestado= 2,
                    estudiante.dc_periodo= estudiante.c_periodo,
                    estudiante.dc_dbcarrera= estudiante.c_dbcarrera,
                    estudiante.dc_dbnivelacion= estudiante.c_dbnivelacion,
                    estudiante.dc_observacion= "PROCESO MIGRACION // MATRICULADO EN CARRERA//",
                    estudiante.dc_matriculacion= "MATRICULADO",
                    estudiante.dc_sede= DatosCarreras.data[0].strSede,
                    estudiante.dc_institucion='ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO',
                    estudiante.dc_provincia=DatosCarreras.data[0].strSede=='MATRIZ'?'CHIMBORAZO':DatosCarreras.data[0].strSede=='MORONA'?'MORONA SANTIAGO':'ORELLANA',
                    estudiante.dc_canton=DatosCarreras.data[0].strSede=='MATRIZ'?'RIOBAMBA':DatosCarreras.data[0].strSede=='MORONA'?'MORONA':'ORELLANA',
                    estudiante.dc_parroquia= "",
                    estudiante.dc_per_id= 0,
                    estudiante.dc_ofaid=DatosCarreraNivelacion.data.cupOfaId,
                    estudiante.dc_modalidad=DatosCarreraNivelacion.data.Modalidad.modNombre,
                    estudiante.dc_jornada=DatosCarreraNivelacion.data.Jornada.jorNombre,
                    estudiante.dc_periodo_admision=DatosCarreraNivelacion.data.Periodo.perNombre,
                    estudiante.dc_tipocupo='NIVELACION CARRERA',
                    estudiante.dc_matricula='ORDINARIA',
                    estudiante.dc_cupo_aceptado=DatosCarreraNivelacion.data.Periodo.perNombre,
                    estudiante.dc_fecha_matricula=tools.ConvertirFechaMatricula(ObjEstudianteMatriculadoNivelacion.data[0].dtFechaAutorizada) ,
                    estudiante.dc_estado_matricula='PRIMERA MATRICULA',
                    estudiante.dc_cupo_admision= estudiante.c_cupo_admision,
                    estudiante.dc_cusid= estudiante.c_cus_id,
                    estudiante.dc_carrera=DatosCarreraNivelacion.data.Carrera.carNombre,
                    estudiante.dc_facultad=DatosCarreraNivelacion.data.Carrera.Facultad.facNombre,
                    estudiante.dc_nombres=DatosEstudiantes.data.listado[0].per_nombres,
                    estudiante.dc_apellidos=DatosEstudiantes.data.listado[0].per_primerApellido+' '+DatosEstudiantes.data.listado[0].per_segundoApellido,
                    estudiante.dc_cedula=estudiante.c_identificacion,
                    estudiante.dc_ies_id=0,
                    estudiante.dc_estado_fin_curso=listadoRetiros.length>0?'RETIRO PARCIAL VOLUNTARIO':strEstadoAprobacion,
                    estudiante.dc_reubicado_primer_nivel='SI',
                    estudiante.dc_oficio_notificacion_retiro='NINGUNO',
                    estudiante.dc_fecha_notificacion_retiro='NINGUNO',
                

                    estudiante.per_nombres = DatosEstudiantes.data.listado[0].per_nombres
                    estudiante.per_primerApellido = DatosEstudiantes.data.listado[0].per_primerApellido + " " + DatosEstudiantes.data.listado[0].per_segundoApellido
                    estudiante.procedencia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].procedencia
                    estudiante.nac_nombre = DatosEstudiantes.data.listado[0].nac_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].nac_nombre
                    estudiante.per_email = DatosEstudiantes.data.listado[0].per_email == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_email
                    estudiante.per_emailAlternativo = DatosEstudiantes.data.listado[0].per_emailAlternativo == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_emailAlternativo
                    estudiante.per_telefonoCelular = DatosEstudiantes.data.listado[0].per_telefonoCelular == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_telefonoCelular
                    estudiante.per_telefonoCasa = DatosEstudiantes.data.listado[0].per_telefonoCasa == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_telefonoCasa
                    estudiante.per_fechaNacimiento = DatosEstudiantes.data.listado[0].per_fechaNacimiento == null ? 'NINGUNO' : tools.formatearFechaNacimiento(DatosEstudiantes.data.listado[0].per_fechaNacimiento)
                    estudiante.eci_nombre = DatosEstudiantes.data.listado[0].eci_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].eci_nombre
                    estudiante.etn_nombre = DatosEstudiantes.data.listado[0].etn_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].etn_nombre
                    estudiante.gen_nombre = DatosEstudiantes.data.listado[0].gen_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].gen_nombre
                    estudiante.prq_nombre = DatosEstudiantes.data.listado[0].prq_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].prq_nombre
                    estudiante.strCedula = estudiante.c_identificacion
                    estudiante.strCodEstud = ObjEstudianteMatriculadoNivelacion.data[0].strCodEstud
                    estudiante.descripcionestado = ObjEstudianteMatriculadoNivelacion.data[0].strCodEstado
                    estudiante.descripcioninscripcion = 'ADMISION'
                    estudiante.strCodNivel = ObjEstudianteMatriculadoNivelacion.data[0].strCodNivel
                    estudiante.dir_callePrincipal = DatosEstudiantes.data.listado[0].dir_callePrincipal == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].dir_callePrincipal
                    estudiante.sexo = DatosEstudiantes.data.listado[0].sexo == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].sexo
                const [provincia, canton, parroquia] = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].procedencia.split("/");
                estudiante.provincia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : provincia
                estudiante.canton = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : canton
                estudiante.parroquia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : parroquia
                estudiante.sede = DatosCarreras.data[0].strSede,
                estudiante.facultad = DatosCarreras.data[0].strNombreFacultad,
                estudiante.carrera = DatosCarreras.data[0].strNombreCarrera
                listadoNomina.push(estudiante)
               // return base64 = await reportescarreras.ExcelReporteMaticulasAdmisionesInstitucional(periodo, listadoNomina);
            }
           if (ObjEstudianteMatriculadoNivelacion.count == 0 && ObjEstudianteMatriculadoCarrera.count == 0) {
                console.log("NNINGUNA")
                var DatosCarreras = await modeloprocesoCupo.ObtenerDatosBase(estudiante.c_dbcarrera);
                var DatosNivelacion = await modeloprocesoCupo.ObtenerDatosBase(estudiante.c_dbnivelacion);
         
                
                estudiante.dc_idcupo= estudiante.c_id,
                estudiante.dc_idestado= 2,
                estudiante.dc_periodo= estudiante.c_periodo,
                estudiante.dc_dbcarrera= estudiante.c_dbcarrera,
                estudiante.dc_dbnivelacion= estudiante.c_dbnivelacion,
                estudiante.dc_observacion= "PROCESO MIGRACION // NO MATRICULADO//",
                estudiante.dc_matriculacion= "NO MATRICULADO",
                estudiante.dc_sede= DatosCarreras.data[0].strSede,
                estudiante.dc_institucion='ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO',
                estudiante.dc_provincia=DatosCarreras.data[0].strSede=='MATRIZ'?'CHIMBORAZO':DatosCarreras.data[0].strSede=='MORONA'?'MORONA SANTIAGO':'ORELLANA',
                estudiante.dc_canton=DatosCarreras.data[0].strSede=='MATRIZ'?'RIOBAMBA':DatosCarreras.data[0].strSede=='MORONA'?'MORONA':'ORELLANA',
                estudiante.dc_parroquia= "",
                estudiante.dc_per_id= DatosEstudiantes.data.listado[0].per_id,
                estudiante.dc_ofaid=DatosCarreraNivelacion.data.cupOfaId,
                estudiante.dc_modalidad=DatosCarreraNivelacion.data.Modalidad.modNombre,
                estudiante.dc_jornada=DatosCarreraNivelacion.data.Jornada.jorNombre,
                estudiante.dc_tipocupo='NINGUNA',
                estudiante.dc_matricula='ORDINARIA',
                estudiante.dc_cupo_aceptado=DatosCarreraNivelacion.data.Periodo.perNombre,
                estudiante.dc_fecha_matricula='NINGUNA',
                estudiante.dc_estado_matricula='NO INGRESO A LA INSTITUCION',
                estudiante.dc_cupo_admision= estudiante.c_cupo_admision,
                estudiante.dc_cusid= estudiante.c_cus_id,
                estudiante.dc_carrera=DatosCarreraNivelacion.data.Carrera.carNombre,
                estudiante.dc_facultad=DatosCarreraNivelacion.data.Carrera.Facultad.facNombre,
                estudiante.dc_nombres=DatosEstudiantes.data.listado[0].per_nombres,
                estudiante.dc_apellidos=DatosEstudiantes.data.listado[0].per_primerApellido+' '+DatosEstudiantes.data.listado[0].per_segundoApellido,
                estudiante.dc_cedula=estudiante.c_identificacion,
                estudiante.dc_ies_id=0,
                estudiante.dc_estado_fin_curso='REPROBADO',
                estudiante.dc_reubicado_primer_nivel='NO',
                estudiante.dc_oficio_notificacion_retiro='NINGUNO',
                estudiante.dc_fecha_notificacion_retiro='NINGUNO',

                estudiante.per_nombres = DatosEstudiantes.data.listado[0].per_nombres
                estudiante.per_primerApellido = DatosEstudiantes.data.listado[0].per_primerApellido + " " + DatosEstudiantes.data.listado[0].per_segundoApellido
                estudiante.procedencia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].procedencia
                estudiante.nac_nombre = DatosEstudiantes.data.listado[0].nac_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].nac_nombre
                estudiante.per_email = DatosEstudiantes.data.listado[0].per_email == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_email
                estudiante.per_emailAlternativo = DatosEstudiantes.data.listado[0].per_emailAlternativo == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_emailAlternativo
                estudiante.per_telefonoCelular = DatosEstudiantes.data.listado[0].per_telefonoCelular == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_telefonoCelular
                estudiante.per_telefonoCasa = DatosEstudiantes.data.listado[0].per_telefonoCasa == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_telefonoCasa
                estudiante.per_fechaNacimiento = DatosEstudiantes.data.listado[0].per_fechaNacimiento == null ? 'NINGUNO' : tools.formatearFechaNacimiento(DatosEstudiantes.data.listado[0].per_fechaNacimiento)
                estudiante.eci_nombre = DatosEstudiantes.data.listado[0].eci_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].eci_nombre
                estudiante.etn_nombre = DatosEstudiantes.data.listado[0].etn_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].etn_nombre
                estudiante.gen_nombre = DatosEstudiantes.data.listado[0].gen_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].gen_nombre
                estudiante.prq_nombre = DatosEstudiantes.data.listado[0].prq_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].prq_nombre
                estudiante.strCedula = estudiante.c_identificacion
                estudiante.strCodEstud =0
                estudiante.descripcionestado = 'NO INGRESO A LA INSTITUCION',
                estudiante.descripcioninscripcion = 'ADMISION'
                estudiante.strCodNivel = 'NINGUNO'
                estudiante.dir_callePrincipal = DatosEstudiantes.data.listado[0].dir_callePrincipal == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].dir_callePrincipal
                estudiante.sexo = DatosEstudiantes.data.listado[0].sexo == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].sexo
            const [provincia, canton, parroquia] = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].procedencia.split("/");
            estudiante.provincia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : provincia
            estudiante.canton = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : canton
            estudiante.parroquia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : parroquia
            estudiante.sede = DatosCarreras.data[0].strSede,
            estudiante.facultad = DatosCarreras.data[0].strNombreFacultad,
            estudiante.carrera = DatosCarreras.data[0].strNombreCarrera
            listadoNomina.push(estudiante)
            // return base64 = await reportescarreras.ExcelReporteMaticulasAdmisionesInstitucional(periodo, listadoNomina);
            }
        }

        var base64 = await reportescarreras.ExcelReporteMaticulasAdmisionesInstitucional(periodo, listadoNomina);
       return base64

    } catch (err) {

        console.error(err);
        return 'ERROR' +err;
    }
}

async function FuncionReporteExcelMatriculasAdmisionesInstitucinalTransaccion(periodo) {
    const pool = await iniciarMasterPool("OAS_Master");
            await pool.connect();
            const transaction = await iniciarMasterTransaccion(pool);
            await transaction.begin();
    try {
        var listadoNomina = [];
        var ListadoEstudiantes = await modeloprocesocarreras.ListadoEstudiantesConfirmadoMatrizSenecytTransaccion(transaction, "OAS_Cupos_Institucionales", periodo);
        var i=0;
        for (var estudiante of ListadoEstudiantes.data) {
           
            var content ={ "perNomenclatura": periodo, "cusId": estudiante.c_cus_id }
         var DatosCarreraNivelacion = await axios.post("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/cupo_carrera/periodo_cusid", content, { httpsAgent: agent });
        var DatosEstudiantes = await axios.get("https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/" + tools.CedulaSinGuion(estudiante.c_identificacion), { httpsAgent: agent });
        var ObjEstudianteMatriculadoNivelacion = await modeloprocesocarreras.EncontrarEstudianteMatriculadoTransaccion(transaction, estudiante.c_dbnivelacion, estudiante.c_periodo, estudiante.c_identificacion);
           i = i + 1
                console.log("Carrera " + DatosCarreraNivelacion.data.Carrera.carNombre + " " + estudiante.c_dbnivelacion + "# " +i);
        var ObjEstudianteMatriculadoCarrera = await modeloprocesocarreras.EncontrarEstudianteMatriculadoTransaccion(transaction, estudiante.c_dbcarrera, estudiante.c_periodo, estudiante.c_identificacion);
           if (ObjEstudianteMatriculadoCarrera.count > 0) {
              console.log("CARRERA")
            var DatosCarreras = await modeloprocesoCupo.ObtenerDatosBase(estudiante.c_dbcarrera);
        
            var listadoRetiros = await modeloreporteexcelcarrera.ProcesoListadoRetirosEstudiantePeriodoTrnsaccion(transaction, estudiante.c_dbcarrera, periodo, estudiante.c_identificacion, ObjEstudianteMatriculadoCarrera.data[0].strCodEstud);

            var PagoMatriculaestudiante = await modeloprocesocarreras.ObtenerPagoMatriculaEstudianteTransaccion( transaction,"pagosonline_db", periodo, tools.CedulaSinGuion(estudiante.c_identificacion));
            var AsignaturasMatriculadas = await modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidadTrasaccion(transaction, estudiante.c_dbcarrera, periodo, ObjEstudianteMatriculadoCarrera.data[0].sintCodigo);
            var CalulosEstuidantesRegulares = await modeloprocesocarreras.CalculoEstudiantesRegulares60PorCientoTransaccion(transaction,estudiante.c_dbcarrera, periodo, ObjEstudianteMatriculadoCarrera.data[0].sintCodigo);
            var strEstadoAprobacion='REPROBADO'
            if(listadoRetiros.length==0){
                if(await tools.VerificacionPeriodoTresCalificaciones(periodo)){
                            var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudianteTransaccion(transaction,estudiante.c_dbcarrera, periodo, ObjEstudianteMatriculadoCarrera.data[0].sintCodigo);
                        }else{
                             var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudianteTransaccion(transaction,estudiante.c_dbcarrera, periodo, ObjEstudianteMatriculadoCarrera.data[0].sintCodigo);
                        }
             //   var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudianteTransaccion(transaction,estudiante.c_dbcarrera, periodo, ObjEstudianteMatriculadoCarrera.data[0].sintCodigo);
               estudiante.aprobacion = datosAprobacion.data[0].Reprueba == 0 ? 'APROBADO' : 'REPROBADO'
            }               
            if (AsignaturasMatriculadas.count) {
                estudiante.primera = AsignaturasMatriculadas.data[0].Primera > 0 ? 'SI' : 'NO'
                estudiante.cantidadprimera = AsignaturasMatriculadas.data[0].Primera
                estudiante.segunda = AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                estudiante.cantidadsegunda = AsignaturasMatriculadas.data[0].Segunda
                estudiante.repetidor = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                estudiante.tercera = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : 'NO'
                estudiante.cantidadtercera = AsignaturasMatriculadas.data[0].Tercera
            }
            if (CalulosEstuidantesRegulares.count > 0) {
                estudiante.regular = CalulosEstuidantesRegulares.data[0].Estudiante
            }
            if (PagoMatriculaestudiante.count > 0) {
                estudiante.gratuidad = 'NO'
                estudiante.valorpago = PagoMatriculaestudiante.data[0].fltTotal
            } else {
                estudiante.gratuidad = 'SI'
                estudiante.valorpago = 0
            }
                estudiante.dc_idcupo= estudiante.c_id,
                estudiante.dc_idestado= 2,
                estudiante.dc_periodo= estudiante.c_periodo,
                estudiante.dc_dbcarrera= estudiante.c_dbcarrera,
                estudiante.dc_dbnivelacion= estudiante.c_dbnivelacion,
                estudiante.dc_observacion= "PROCESO MIGRACION // MATRICULADO EN CARRERA//",
                estudiante.dc_matriculacion= "MATRICULADO",
                estudiante.dc_sede= DatosCarreras.data[0].strSede,
                estudiante.dc_institucion='ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO',
                estudiante.dc_provincia=DatosCarreras.data[0].strSede=='MATRIZ'?'CHIMBORAZO':DatosCarreras.data[0].strSede=='MORONA'?'MORONA SANTIAGO':'ORELLANA',
                estudiante.dc_canton=DatosCarreras.data[0].strSede=='MATRIZ'?'RIOBAMBA':DatosCarreras.data[0].strSede=='MORONA'?'MORONA':'ORELLANA',
                estudiante.dc_parroquia= "",
                estudiante.dc_per_id= 0,
                estudiante.dc_ofaid=DatosCarreraNivelacion.data.cupOfaId,
                estudiante.dc_modalidad=DatosCarreraNivelacion.data.Modalidad.modNombre,
                estudiante.dc_jornada=DatosCarreraNivelacion.data.Jornada.jorNombre,
                estudiante.dc_periodo_admision=DatosCarreraNivelacion.data.Periodo.perNombre,
                estudiante.dc_tipocupo='NIVELACION CARRERA',
                estudiante.dc_matricula='ORDINARIA',
                estudiante.dc_cupo_aceptado=DatosCarreraNivelacion.data.Periodo.perNombre,
                estudiante.dc_fecha_matricula=tools.ConvertirFechaMatricula(ObjEstudianteMatriculadoCarrera.data[0].dtFechaAutorizada) ,
                estudiante.dc_estado_matricula='PRIMERA MATRICULA',
                estudiante.dc_cupo_admision= estudiante.c_cupo_admision,
                estudiante.dc_cusid= estudiante.c_cus_id,
                estudiante.dc_carrera=DatosCarreraNivelacion.data.Carrera.carNombre,
                estudiante.dc_facultad=DatosCarreraNivelacion.data.Carrera.Facultad.facNombre,
                estudiante.dc_nombres=DatosEstudiantes.data.listado[0].per_nombres,
                estudiante.dc_apellidos=DatosEstudiantes.data.listado[0].per_primerApellido+' '+DatosEstudiantes.data.listado[0].per_segundoApellido,
                estudiante.dc_cedula=estudiante.c_identificacion,
                estudiante.dc_ies_id=0,
                estudiante.dc_estado_fin_curso=listadoRetiros.length>0?'RETIRO PARCIAL VOLUNTARIO':strEstadoAprobacion,
                estudiante.dc_reubicado_primer_nivel='SI',
                estudiante.dc_oficio_notificacion_retiro='NINGUNO',
                estudiante.dc_fecha_notificacion_retiro='NINGUNO',
            

                estudiante.per_nombres = DatosEstudiantes.data.listado[0].per_nombres
                estudiante.per_primerApellido = DatosEstudiantes.data.listado[0].per_primerApellido + " " + DatosEstudiantes.data.listado[0].per_segundoApellido
                estudiante.procedencia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].procedencia
                estudiante.nac_nombre = DatosEstudiantes.data.listado[0].nac_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].nac_nombre
                estudiante.per_email = DatosEstudiantes.data.listado[0].per_email == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_email
                estudiante.per_emailAlternativo = DatosEstudiantes.data.listado[0].per_emailAlternativo == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_emailAlternativo
                estudiante.per_telefonoCelular = DatosEstudiantes.data.listado[0].per_telefonoCelular == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_telefonoCelular
                estudiante.per_telefonoCasa = DatosEstudiantes.data.listado[0].per_telefonoCasa == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_telefonoCasa
                estudiante.per_fechaNacimiento = DatosEstudiantes.data.listado[0].per_fechaNacimiento == null ? 'NINGUNO' : tools.formatearFechaNacimiento(DatosEstudiantes.data.listado[0].per_fechaNacimiento)
                estudiante.eci_nombre = DatosEstudiantes.data.listado[0].eci_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].eci_nombre
                estudiante.etn_nombre = DatosEstudiantes.data.listado[0].etn_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].etn_nombre
                estudiante.gen_nombre = DatosEstudiantes.data.listado[0].gen_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].gen_nombre
                estudiante.prq_nombre = DatosEstudiantes.data.listado[0].prq_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].prq_nombre
                estudiante.strCedula = estudiante.c_identificacion
                estudiante.strCodEstud = ObjEstudianteMatriculadoCarrera.data[0].strCodEstud
                estudiante.descripcionestado = ObjEstudianteMatriculadoCarrera.data[0].strCodEstado
                estudiante.descripcioninscripcion = 'ADMISION'
                
                estudiante.strCodNivel = ObjEstudianteMatriculadoCarrera.data[0].strCodNivel
                estudiante.dir_callePrincipal = DatosEstudiantes.data.listado[0].dir_callePrincipal == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].dir_callePrincipal
                estudiante.sexo = DatosEstudiantes.data.listado[0].sexo == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].sexo
            const [provincia, canton, parroquia] = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].procedencia.split("/");
            estudiante.provincia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : provincia
            estudiante.canton = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : canton
            estudiante.parroquia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : parroquia
            estudiante.sede = DatosCarreras.data[0].strSede,
            estudiante.facultad = DatosCarreras.data[0].strNombreFacultad,
            estudiante.carrera = DatosCarreras.data[0].strNombreCarrera
            listadoNomina.push(estudiante)
           // return base64 = await reportescarreras.ExcelReporteMaticulasAdmisionesInstitucional(periodo, listadoNomina);
            }
            if (ObjEstudianteMatriculadoNivelacion.count > 0) {
                console.log("NIVELACION")
                var DatosCarreras = await modeloprocesoCupo.ObtenerDatosBaseTransaccion(transaction,'OAS_Master',estudiante.c_dbnivelacion);
  
                var listadoRetiros = await modeloreporteexcelcarrera.ProcesoListadoRetirosEstudiantePeriodoTrnsaccion(transaction, estudiante.c_dbnivelacion, periodo, estudiante.c_identificacion, ObjEstudianteMatriculadoNivelacion.data[0].strCodEstud);
                var PagoMatriculaestudiante = await modeloprocesocarreras.ObtenerPagoMatriculaEstudianteTransaccion( transaction,"pagosonline_db", periodo, tools.CedulaSinGuion(estudiante.c_identificacion));
                var AsignaturasMatriculadas = await modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidadTrasaccion(transaction, estudiante.c_dbnivelacion, periodo, ObjEstudianteMatriculadoNivelacion.data[0].sintCodigo);
                var CalulosEstuidantesRegulares = await modeloprocesocarreras.CalculoEstudiantesRegulares60PorCientoTransaccion(transaction,estudiante.c_dbnivelacion, periodo, ObjEstudianteMatriculadoNivelacion.data[0].sintCodigo);
                var strEstadoAprobacion='REPROBADO'
                if(listadoRetiros.length==0){
                     if(await tools.VerificacionPeriodoTresCalificaciones(periodo)){
                            var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudianteTransaccion(transaction,estudiante.c_dbnivelacion, periodo, ObjEstudianteMatriculadoNivelacion.data[0].sintCodigo);
                        }else{
                             var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudianteTransaccion(transaction,estudiante.c_dbnivelacion, periodo, ObjEstudianteMatriculadoNivelacion.data[0].sintCodigo);
                        }
                  // var datosAprobacion = await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudianteTransaccion(transaction,estudiante.c_dbnivelacion, periodo, ObjEstudianteMatriculadoNivelacion.data[0].sintCodigo);
                   estudiante.aprobacion = datosAprobacion.data[0].Reprueba == 0 ? 'APROBADO' : 'REPROBADO'
                }               
                if (AsignaturasMatriculadas.count) {
                    estudiante.primera = AsignaturasMatriculadas.data[0].Primera > 0 ? 'SI' : 'NO'
                    estudiante.cantidadprimera = AsignaturasMatriculadas.data[0].Primera
                    estudiante.segunda = AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                    estudiante.cantidadsegunda = AsignaturasMatriculadas.data[0].Segunda
                    estudiante.repetidor = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO'
                    estudiante.tercera = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : 'NO'
                    estudiante.cantidadtercera = AsignaturasMatriculadas.data[0].Tercera
                }
                if (CalulosEstuidantesRegulares.count > 0) {
                    estudiante.regular = CalulosEstuidantesRegulares.data[0].Estudiante
                }
                if (PagoMatriculaestudiante.count > 0) {
                    estudiante.gratuidad = 'NO'
                    estudiante.valorpago = PagoMatriculaestudiante.data[0].fltTotal
                } else {
                    estudiante.gratuidad = 'SI'
                    estudiante.valorpago = 0
                }
                    estudiante.dc_idcupo= estudiante.c_id,
                    estudiante.dc_idestado= 2,
                    estudiante.dc_periodo= estudiante.c_periodo,
                    estudiante.dc_dbcarrera= estudiante.c_dbcarrera,
                    estudiante.dc_dbnivelacion= estudiante.c_dbnivelacion,
                    estudiante.dc_observacion= "PROCESO MIGRACION // MATRICULADO EN CARRERA//",
                    estudiante.dc_matriculacion= "MATRICULADO",
                    estudiante.dc_sede= DatosCarreras.data[0].strSede,
                    estudiante.dc_institucion='ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO',
                    estudiante.dc_provincia=DatosCarreras.data[0].strSede=='MATRIZ'?'CHIMBORAZO':DatosCarreras.data[0].strSede=='MORONA'?'MORONA SANTIAGO':'ORELLANA',
                    estudiante.dc_canton=DatosCarreras.data[0].strSede=='MATRIZ'?'RIOBAMBA':DatosCarreras.data[0].strSede=='MORONA'?'MORONA':'ORELLANA',
                    estudiante.dc_parroquia= "",
                    estudiante.dc_per_id= 0,
                    estudiante.dc_ofaid=DatosCarreraNivelacion.data.cupOfaId,
                    estudiante.dc_modalidad=DatosCarreraNivelacion.data.Modalidad.modNombre,
                    estudiante.dc_jornada=DatosCarreraNivelacion.data.Jornada.jorNombre,
                    estudiante.dc_periodo_admision=DatosCarreraNivelacion.data.Periodo.perNombre,
                    estudiante.dc_tipocupo='NIVELACION CARRERA',
                    estudiante.dc_matricula='ORDINARIA',
                    estudiante.dc_cupo_aceptado=DatosCarreraNivelacion.data.Periodo.perNombre,
                    estudiante.dc_fecha_matricula=tools.ConvertirFechaMatricula(ObjEstudianteMatriculadoNivelacion.data[0].dtFechaAutorizada) ,
                    estudiante.dc_estado_matricula='PRIMERA MATRICULA',
                    estudiante.dc_cupo_admision= estudiante.c_cupo_admision,
                    estudiante.dc_cusid= estudiante.c_cus_id,
                    estudiante.dc_carrera=DatosCarreraNivelacion.data.Carrera.carNombre,
                    estudiante.dc_facultad=DatosCarreraNivelacion.data.Carrera.Facultad.facNombre,
                    estudiante.dc_nombres=DatosEstudiantes.data.listado[0].per_nombres,
                    estudiante.dc_apellidos=DatosEstudiantes.data.listado[0].per_primerApellido+' '+DatosEstudiantes.data.listado[0].per_segundoApellido,
                    estudiante.dc_cedula=estudiante.c_identificacion,
                    estudiante.dc_ies_id=0,
                    estudiante.dc_estado_fin_curso=listadoRetiros.length>0?'RETIRO PARCIAL VOLUNTARIO':strEstadoAprobacion,
                    estudiante.dc_reubicado_primer_nivel='SI',
                    estudiante.dc_oficio_notificacion_retiro='NINGUNO',
                    estudiante.dc_fecha_notificacion_retiro='NINGUNO',
                    estudiante.per_nombres = DatosEstudiantes.data.listado[0].per_nombres
                    estudiante.per_primerApellido = DatosEstudiantes.data.listado[0].per_primerApellido + " " + DatosEstudiantes.data.listado[0].per_segundoApellido
                    estudiante.procedencia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].procedencia
                    estudiante.nac_nombre = DatosEstudiantes.data.listado[0].nac_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].nac_nombre
                    estudiante.per_email = DatosEstudiantes.data.listado[0].per_email == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_email
                    estudiante.per_emailAlternativo = DatosEstudiantes.data.listado[0].per_emailAlternativo == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_emailAlternativo
                    estudiante.per_telefonoCelular = DatosEstudiantes.data.listado[0].per_telefonoCelular == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_telefonoCelular
                    estudiante.per_telefonoCasa = DatosEstudiantes.data.listado[0].per_telefonoCasa == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_telefonoCasa
                    estudiante.per_fechaNacimiento = DatosEstudiantes.data.listado[0].per_fechaNacimiento == null ? 'NINGUNO' : tools.formatearFechaNacimiento(DatosEstudiantes.data.listado[0].per_fechaNacimiento)
                    estudiante.eci_nombre = DatosEstudiantes.data.listado[0].eci_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].eci_nombre
                    estudiante.etn_nombre = DatosEstudiantes.data.listado[0].etn_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].etn_nombre
                    estudiante.gen_nombre = DatosEstudiantes.data.listado[0].gen_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].gen_nombre
                    estudiante.prq_nombre = DatosEstudiantes.data.listado[0].prq_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].prq_nombre
                    estudiante.strCedula = estudiante.c_identificacion
                    estudiante.strCodEstud = ObjEstudianteMatriculadoNivelacion.data[0].strCodEstud
                    estudiante.descripcionestado = ObjEstudianteMatriculadoNivelacion.data[0].strCodEstado
                    estudiante.descripcioninscripcion = 'ADMISION'
                    estudiante.strCodNivel = ObjEstudianteMatriculadoNivelacion.data[0].strCodNivel
                    estudiante.dir_callePrincipal = DatosEstudiantes.data.listado[0].dir_callePrincipal == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].dir_callePrincipal
                    estudiante.sexo = DatosEstudiantes.data.listado[0].sexo == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].sexo
                const [provincia, canton, parroquia] = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].procedencia.split("/");
                estudiante.provincia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : provincia
                estudiante.canton = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : canton
                estudiante.parroquia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : parroquia
                estudiante.sede = DatosCarreras.data[0].strSede,
                estudiante.facultad = DatosCarreras.data[0].strNombreFacultad,
                estudiante.carrera = DatosCarreras.data[0].strNombreCarrera
                listadoNomina.push(estudiante)
               // return base64 = await reportescarreras.ExcelReporteMaticulasAdmisionesInstitucional(periodo, listadoNomina);
            }
           if (ObjEstudianteMatriculadoNivelacion.count == 0 && ObjEstudianteMatriculadoCarrera.count == 0) {
                console.log("NNINGUNA")
                var DatosCarreras = await modeloprocesoCupo.ObtenerDatosBaseTransaccion(transaction,'OAS_Master',estudiante.c_dbcarrera);
                var DatosNivelacion = await modeloprocesoCupo.ObtenerDatosBaseTransaccion(transaction,'OAS_Master',estudiante.c_dbnivelacion);
         
                
                estudiante.dc_idcupo= estudiante.c_id,
                estudiante.dc_idestado= 2,
                estudiante.dc_periodo= estudiante.c_periodo,
                estudiante.dc_dbcarrera= estudiante.c_dbcarrera,
                estudiante.dc_dbnivelacion= estudiante.c_dbnivelacion,
                estudiante.dc_observacion= "PROCESO MIGRACION // NO MATRICULADO//",
                estudiante.dc_matriculacion= "NO MATRICULADO",
                estudiante.dc_sede= DatosCarreras.data[0].strSede,
                estudiante.dc_institucion='ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO',
                estudiante.dc_provincia=DatosCarreras.data[0].strSede=='MATRIZ'?'CHIMBORAZO':DatosCarreras.data[0].strSede=='MORONA'?'MORONA SANTIAGO':'ORELLANA',
                estudiante.dc_canton=DatosCarreras.data[0].strSede=='MATRIZ'?'RIOBAMBA':DatosCarreras.data[0].strSede=='MORONA'?'MORONA':'ORELLANA',
                estudiante.dc_parroquia= "",
                estudiante.dc_per_id= DatosEstudiantes.data.listado[0].per_id,
                estudiante.dc_ofaid=DatosCarreraNivelacion.data.cupOfaId,
                estudiante.dc_modalidad=DatosCarreraNivelacion.data.Modalidad.modNombre,
                estudiante.dc_jornada=DatosCarreraNivelacion.data.Jornada.jorNombre,
                estudiante.dc_tipocupo='NINGUNA',
                estudiante.dc_matricula='ORDINARIA',
                estudiante.dc_cupo_aceptado=DatosCarreraNivelacion.data.Periodo.perNombre,
                estudiante.dc_fecha_matricula='NINGUNA',
                estudiante.dc_estado_matricula='NO INGRESO A LA INSTITUCION',
                estudiante.dc_cupo_admision= estudiante.c_cupo_admision,
                estudiante.dc_cusid= estudiante.c_cus_id,
                estudiante.dc_carrera=DatosCarreraNivelacion.data.Carrera.carNombre,
                estudiante.dc_facultad=DatosCarreraNivelacion.data.Carrera.Facultad.facNombre,
                estudiante.dc_nombres=DatosEstudiantes.data.listado[0].per_nombres,
                estudiante.dc_apellidos=DatosEstudiantes.data.listado[0].per_primerApellido+' '+DatosEstudiantes.data.listado[0].per_segundoApellido,
                estudiante.dc_cedula=estudiante.c_identificacion,
                estudiante.dc_ies_id=0,
                estudiante.dc_estado_fin_curso='REPROBADO',
                estudiante.dc_reubicado_primer_nivel='NO',
                estudiante.dc_oficio_notificacion_retiro='NINGUNO',
                estudiante.dc_fecha_notificacion_retiro='NINGUNO',

                estudiante.per_nombres = DatosEstudiantes.data.listado[0].per_nombres
                estudiante.per_primerApellido = DatosEstudiantes.data.listado[0].per_primerApellido + " " + DatosEstudiantes.data.listado[0].per_segundoApellido
                estudiante.procedencia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].procedencia
                estudiante.nac_nombre = DatosEstudiantes.data.listado[0].nac_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].nac_nombre
                estudiante.per_email = DatosEstudiantes.data.listado[0].per_email == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_email
                estudiante.per_emailAlternativo = DatosEstudiantes.data.listado[0].per_emailAlternativo == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_emailAlternativo
                estudiante.per_telefonoCelular = DatosEstudiantes.data.listado[0].per_telefonoCelular == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_telefonoCelular
                estudiante.per_telefonoCasa = DatosEstudiantes.data.listado[0].per_telefonoCasa == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].per_telefonoCasa
                estudiante.per_fechaNacimiento = DatosEstudiantes.data.listado[0].per_fechaNacimiento == null ? 'NINGUNO' : tools.formatearFechaNacimiento(DatosEstudiantes.data.listado[0].per_fechaNacimiento)
                estudiante.eci_nombre = DatosEstudiantes.data.listado[0].eci_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].eci_nombre
                estudiante.etn_nombre = DatosEstudiantes.data.listado[0].etn_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].etn_nombre
                estudiante.gen_nombre = DatosEstudiantes.data.listado[0].gen_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].gen_nombre
                estudiante.prq_nombre = DatosEstudiantes.data.listado[0].prq_nombre == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].prq_nombre
                estudiante.strCedula = estudiante.c_identificacion
                estudiante.strCodEstud =0
                estudiante.descripcionestado = 'NO INGRESO A LA INSTITUCION',
                estudiante.descripcioninscripcion = 'ADMISION'
                estudiante.strCodNivel = 'NINGUNO'
                estudiante.dir_callePrincipal = DatosEstudiantes.data.listado[0].dir_callePrincipal == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].dir_callePrincipal
                estudiante.sexo = DatosEstudiantes.data.listado[0].sexo == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].sexo
            const [provincia, canton, parroquia] = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : DatosEstudiantes.data.listado[0].procedencia.split("/");
            estudiante.provincia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : provincia
            estudiante.canton = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : canton
            estudiante.parroquia = DatosEstudiantes.data.listado[0].procedencia == null ? 'NINGUNO' : parroquia
            estudiante.sede = DatosCarreras.data[0].strSede,
            estudiante.facultad = DatosCarreras.data[0].strNombreFacultad,
            estudiante.carrera = DatosCarreras.data[0].strNombreCarrera
            listadoNomina.push(estudiante)
            // return base64 = await reportescarreras.ExcelReporteMaticulasAdmisionesInstitucional(periodo, listadoNomina);
            }
        }

        var base64 = await reportescarreras.ExcelReporteMaticulasAdmisionesInstitucional(periodo, listadoNomina);
       return base64

    } catch (err) {
                await transaction.rollback();
                console.error(err);
                return 'ERROR';
            } finally {
                await transaction.commit();
                await pool.close();
            }
}

