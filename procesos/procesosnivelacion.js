const axios = require('axios');
const cron = require('node-cron');
const pathimage = require('path');
const nomenclatura = require('../config/nomenclatura');
const VariablesGlobales = require('../rutas/VariablesGlobales');
const modeloNivelacion = require('../modelo/procesonivelacion');
const procesoCupo = require('../modelo/procesocupos');

const tools = require('./tools');
const fs = require("fs");
const https = require('https');
const {  iniciarDinamicoPool,iniciarDinamicoTransaccion} = require("./../config/execSQLDinamico.helper");
const {  iniciarMasterTransaccion,iniciarMasterPool} = require("./../config/execSQLMaster.helper");

module.exports.ProcesoVerificarMatriculasIncripciones = async function (periodo, cedula) {
    try {
        var resultado = await FuncionVerificarMatriculaInscripcion(periodo);//Buscar estudiantes matriculasdos definitivos para insertar el cupo
        return { blProceso: true, mensaje: "Se ejecuto el proceso con exitos  periodo" + periodo, Informacion: resultado }

    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
        console.log(error);
    }
}


module.exports.ProcesoMatriculadosDefinitivas = async function (periodo, cedula) {
    try {
        var resultado = await ProcesoMatriculadosDefinitivasPeriodosss(periodo);//Buscar estudiantes matriculasdos definitivos para insertar el cupo
        return { blProceso: true, mensaje: "Se ejecuto el proceso con exitos  periodo" + periodo, Informacion: resultado }

    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
        console.log(error);
    }
}
async function FuncionVerificarMatriculaInscripcion(periodo) {
    try {
        
            var ListadoEstudiantes = [];
            var ListadoCarrera = await modeloNivelacion.ListadoCarreraTodas("OAS_Master");
            //var ListadoCarrera = await procesoCupo.ListadoCarreraNivelacion("UNA");
            for (var carrera of ListadoCarrera.data) {
                // if (carrera.strBaseDatos == 'OAS_NivArtes') {
                var ListadosMatriculas = await modeloNivelacion.MatriculasCarrerasPeriodo(transaction,carrera.strBaseDatos, periodo);
                for (var matricula of ListadosMatriculas.data) {
                    var VerificarEstudianteCupo = await procesoCupo.ObtenerEstudianteCupo(transaction,matricula.strCedula, periodo, carrera.strBaseDatos);
                    if (VerificarEstudianteCupo.count == 0) {
                        var DatosCentralizada = await centralizada.obtenerdocumento(tools.CedulaSinGuion(matricula.strCedula));
                        var dataCupo = {
                            acu_id: DatosCentralizada.data.per_id,
                            identificacion: matricula.strCedula,
                            per_id: DatosCentralizada.data.per_id,
                            tipoinsc: "NIVELACION",
                            per_niv: 0,
                            per_carrera: periodo,
                            carrera: carrera.strBaseDatos,
                            fechacreacion: tools.FechaActualCupo(),
                            cup_estado: 1
                        }
                        var dataDetalle = {
                            estcup_id: VariablesGlobales.ESTADOACTIVO,
                            per_carrera: periodo,
                            dcupfechacreacion: tools.FechaActualCupo(),
                            dcupobservacion: "INSERCION CUPO MATRICULADO PROCESO MIGRACION // SIN PROCESO DE ADMISION "
                        }
                        var IngresoDatos = await procesoCupo.InsertarCupoConfirmadoTrasnsaccionGeneral(transaction,"OAS_Master", dataCupo, dataDetalle, periodo);
                        var agregardatos = {
                            cedula: matricula.strCedula,
                            carrera: carrera.strBaseDatos
                        }
                        ListadoEstudiantes.push(agregardatos)
                    } else {
                        var ObtenerCupoUltimo = await procesoCupo.ObtenerUltimoDetalleCupoRegistrado(transaction,"OAS_Master", matricula.strCedula);

                        if (ObtenerCupoUltimo.count > 0) {
                            if (ObtenerCupoUltimo.data[0].estcup_id == VariablesGlobales.ESTADOACTIVO) {
                                console.log("No registra Cupo ya esta con cupo activo")
                            } else {
                                var dataDetalle = {
                                    cup_id: VerificarEstudianteCupo.data[0].cup_id,
                                    estcup_id: VariablesGlobales.ESTADOACTIVO,
                                    per_carrera: periodo,
                                    dcupfechacreacion: tools.FechaActualCupo(),
                                    dcupobservacion: "INSERCION CUPO MATRICULADO PROCESO MIGRACION // SIN PROCESO DE ADMISION"
                                }
                                var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo(transaction,"OAS_Master", dataDetalle);

                                var agregardatos = {
                                    cedula: matricula.strCedula,
                                    carrera: carrera.strBaseDatos
                                }
                                ListadoEstudiantes.push(agregardatos)
                            }
                        }


                    }

                }
                //  }
            }
            console.log("******************PROCESO FINALIZADO******************")
            return ListadoEstudiantes;
        } catch (err) {
            await transaction.rollback();
            console.error(err);
            return 'ERROR';
        } finally {
            await transaction.commit();
            await pool.close();
        }
}
async function ProcesoMatriculadosDefinitivasPeriodosss(periodo) {
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transaction = await iniciarMasterTransaccion(pool);
    await transaction.begin();
    try {
        
            var ListadoEstudiantes = [];
            var ListadoCarrera = await procesoCupo.ListadoCarreraTodas(transaction,"OAS_Master");
            //var ListadoCarrera = await procesoCupo.ListadoCarreraNivelacion("UNA");
            for (var carrera of ListadoCarrera.data) {
                // if (carrera.strBaseDatos == 'OAS_NivArtes') {
                var ListadosMatriculas = await procesoCupo.MatriculasCarrerasPeriodo(transaction,carrera.strBaseDatos, periodo);
                for (var matricula of ListadosMatriculas.data) {
                    var VerificarEstudianteCupo = await procesoCupo.ObtenerEstudianteCupo(transaction,matricula.strCedula, periodo, carrera.strBaseDatos);
                    if (VerificarEstudianteCupo.count == 0) {
                        var DatosCentralizada = await centralizada.obtenerdocumento(tools.CedulaSinGuion(matricula.strCedula));
                        var dataCupo = {
                            acu_id: DatosCentralizada.data.per_id,
                            identificacion: matricula.strCedula,
                            per_id: DatosCentralizada.data.per_id,
                            tipoinsc: "NIVELACION",
                            per_niv: 0,
                            per_carrera: periodo,
                            carrera: carrera.strBaseDatos,
                            fechacreacion: tools.FechaActualCupo(),
                            cup_estado: 1
                        }
                        var dataDetalle = {
                            estcup_id: VariablesGlobales.ESTADOACTIVO,
                            per_carrera: periodo,
                            dcupfechacreacion: tools.FechaActualCupo(),
                            dcupobservacion: "INSERCION CUPO MATRICULADO PROCESO MIGRACION // SIN PROCESO DE ADMISION "
                        }
                        var IngresoDatos = await procesoCupo.InsertarCupoConfirmadoTrasnsaccionGeneral(transaction,"OAS_Master", dataCupo, dataDetalle, periodo);
                        var agregardatos = {
                            cedula: matricula.strCedula,
                            carrera: carrera.strBaseDatos
                        }
                        ListadoEstudiantes.push(agregardatos)
                    } else {
                        var ObtenerCupoUltimo = await procesoCupo.ObtenerUltimoDetalleCupoRegistrado(transaction,"OAS_Master", matricula.strCedula);

                        if (ObtenerCupoUltimo.count > 0) {
                            if (ObtenerCupoUltimo.data[0].estcup_id == VariablesGlobales.ESTADOACTIVO) {
                                console.log("No registra Cupo ya esta con cupo activo")
                            } else {
                                var dataDetalle = {
                                    cup_id: VerificarEstudianteCupo.data[0].cup_id,
                                    estcup_id: VariablesGlobales.ESTADOACTIVO,
                                    per_carrera: periodo,
                                    dcupfechacreacion: tools.FechaActualCupo(),
                                    dcupobservacion: "INSERCION CUPO MATRICULADO PROCESO MIGRACION // SIN PROCESO DE ADMISION"
                                }
                                var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo(transaction,"OAS_Master", dataDetalle);

                                var agregardatos = {
                                    cedula: matricula.strCedula,
                                    carrera: carrera.strBaseDatos
                                }
                                ListadoEstudiantes.push(agregardatos)
                            }
                        }


                    }

                }
                //  }
            }
            console.log("******************PROCESO FINALIZADO******************")
            return ListadoEstudiantes;
        } catch (err) {
            await transaction.rollback();
            console.error(err);
            return 'ERROR';
        } finally {
            await transaction.commit();
            await pool.close();
        }
}