const axios = require('axios');
const cron = require('node-cron');
const pathimage = require('path');
const nomenclatura = require('../config/nomenclatura');
const VariablesGlobales = require('../rutas/VariablesGlobales');
const procesoCupo = require('../modelo/procesocupos');
const tools = require('./tools');
const fs = require("fs");
const https = require('https');


module.exports.ProcesoMigracionCupos = async function () {
    try {
        // var resultado=   await ProcesoVerificacionConfirmacionCupoInscripcionP0039('P0039'); //Periodo a bucar //Servicio Web Sistema Incripciones Caso Especiales no hay cuidcarrera

        //Proceso para insertar el cupo en confirmado cuando han aceptado la postulacion de la carrera
        var resultado = await ProcesoVerificacionConfirmacionCupoInscripcion('P0041'); //Periodo a bucar //Servicio Web Sistema Incripciones

        //Procesos para insertar el cupo en activo o perdida cuando se han matriculado en el periodo
        var resultado = await ProcesodeVerificarMatriculadoConfirmados('P0040');//Periodo a bucar 

        //Proceso para insertar el cupo en retiro parcial cuando se han retirado de las materias
        var resultado = await ProcesodeVerificarRetirosMatriculadoNivelacion('P0040', 0); //Periodo a Bucar y Nivel 

        //Proceso para realizar el calculo de perdida de cupo por periodos acumulados
         var resultado=   await ProcesodeCalcularPerdidaPeriodoCupo(2,4);//Numero de periodos a restas , estado de cupo a buscar

        //Proceso para activar los cupos cuando se han realizado un retiro parcial en la carrera y en el siguiente periodo se matricula
        //var resultado=   await ProcesodeActivarCupodeRetiros(4);//Estado de cupo a buscar para insertar
    } catch (error) {
        console.log(error);
    }
}
const agent = new https.Agent({
    rejectUnauthorized: false
});

async function ProcesoVerificacionConfirmacionCupoInscripcion(periodo) {
    try {
        console.log("***********PROCESO INICIALIZADO CUPO INSCRIPCION**********")
        var date = new Date();
        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        var min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        try {
            var ListadoEstudiantes = [];
            const content = {
                perNomenclatura: periodo
            }
            var ListadoEstudiantes = await axios.post("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/asignacion_cupo/aceptados_periodo_cusofa", content, { httpsAgent: agent });
            var contador = 1;
            if (ListadoEstudiantes.data.length > 0) {
                for (var obj of ListadoEstudiantes.data) {
                    var dataCupo = {
                        carCusId: obj.AspirantePostulacion.Carrera.carCusId,
                        acu_id: obj.acuId,
                        identificacion: tools.CedulaConGuion(obj.AspirantePostulacion.Persona.perCedula),
                        per_id: obj.AspirantePostulacion.Persona.perId,
                        tipoinsc: "NIVELACION",
                        per_niv: obj.AspirantePostulacion.Periodo.perCodigo,
                        per_carrera: obj.AspirantePostulacion.Periodo.perNomenclatura,
                        carrera: obj.AspirantePostulacion.Carrera.carNombre,
                        fechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                        cup_estado: 1
                    }
                    var dataDetalle = {
                        estcup_id: VariablesGlobales.ESTADOCONFIRMADO,
                        per_carrera: obj.AspirantePostulacion.Periodo.perNomenclatura,
                        dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                        dcupobservacion: "ACEPTACION CUPO PROCESO MIGRACION"
                    }
                    if (obj.Estado.estDescripcion == 'ACEPTADO') {
                        var VerificarEstudianteCupo = await procesoCupo.ObtenerEstudianteCupo(tools.CedulaConGuion(obj.AspirantePostulacion.Persona.perCedula), periodo, obj.AspirantePostulacion.Periodo.perNomenclatura);
                        if (VerificarEstudianteCupo.count == 0) {
                            var IngresoDatos = await procesoCupo.InsertarCupoConfirmadoTrasnsaccion("OAS_Master", dataCupo, dataDetalle, periodo);
                        } else {
                            console.log("Ya se encuentra registrado el estuainte :" + tools.CedulaConGuion(obj.AspirantePostulacion.Persona.perCedula) + " //Carrera: " + obj.AspirantePostulacion.Carrera.carNombre + " //Periodo: " + obj.AspirantePostulacion.Periodo.perNomenclatura)
                        }

                    }
                    contador = contador + 1;
                }
            }
            console.log("***********PROCESO FINALIZADO CUPO INSCRIPCION**********")
            return ListadoEstudiantes;
        } catch (error) {
            console.error(error);
            return 'ERROR';
        }
    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}

async function ProcesoVerificacionConfirmacionCupoInscripcionP0039(periodo) {
    try {
        console.log("***********PROCESO INICIALIZADO CUPO INSCRIPCION**********")
        var date = new Date();
        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        var min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        try {
            var ListadoEstudiantes = [];
            const content = {
                perNomenclatura: periodo
            }
            var ListadoEstudiantes = await axios.post("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/asignacion_cupo/aceptados_periodo_cusofa", content, { httpsAgent: agent });
            var contador = 1;
            if (ListadoEstudiantes.data.length > 0) {
                for (var obj of ListadoEstudiantes.data) {
                    var DatosIncripcion = await procesoCupo.ObenterEstudianteIncripcion("OAS_Master", tools.CedulaConGuion(obj.AspirantePostulacion.Persona.perCedula), periodo);

                    if (DatosIncripcion.data.length > 0) {

                        var dataCupo = {
                            acu_id: DatosIncripcion.data[0].hmbdbaseinsc,
                            identificacion: tools.CedulaConGuion(obj.AspirantePostulacion.Persona.perCedula),
                            per_id: obj.AspirantePostulacion.Persona.perId,
                            tipoinsc: "NIVELACION",
                            per_niv: obj.AspirantePostulacion.Periodo.perCodigo,
                            per_carrera: obj.AspirantePostulacion.Periodo.perNomenclatura,
                            carrera: DatosIncripcion.data[0].hmbdbaseniv,
                            fechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                            cup_estado: 1
                        }

                        var dataDetalle = {
                            estcup_id: VariablesGlobales.ESTADOCONFIRMADO,
                            per_carrera: obj.AspirantePostulacion.Periodo.perNomenclatura,
                            dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                            dcupobservacion: "ACEPTACION CUPO SENECYT PROCESO MIGRACION"
                        }

                        var IngresoDatos = await procesoCupo.InsertarCupoConfirmadoTrasnsaccion("OAS_Master", dataCupo, dataDetalle);

                    }


                    contador = contador + 1;

                }
            }

            console.log("***********PROCESO FINALIZADO CUPO INSCRIPCION**********")
            return ListadoEstudiantes;
        } catch (error) {
            console.error(error);
            return 'ERROR';
        }
    } catch (err) {
        console.log(error);
        return 'ERROR';
    }
}

async function ProcesodeVerificarMatriculadoConfirmados(periodo) {
    try {
        console.log("***********PROCESO INICIALIZADO MATRICULACION CUPO**********")
        var date = new Date();
        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        var min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        try {
            var ListadoEstudiantes = [];
            var ListadoEstudiantes = await procesoCupo.ListadoEstudianteConfirmados("OAS_Master", periodo);
            if (ListadoEstudiantes.data.length > 0) {
                for (var obj of ListadoEstudiantes.data) {
                    var DatosIncripcion = await procesoCupo.ObenterEstudianteIncripcionMaster("OAS_Master", obj.identificacion, periodo);
                    console.log("DatosIncripcion Nueva MAster")
                    console.log(DatosIncripcion)
                    if (DatosIncripcion.count > 0) {
                        var ObjEstudianteMatriculado = await procesoCupo.EncontrarEstudianteMatriculado(DatosIncripcion.data[0].strBaseDatos, obj.per_carrera, obj.identificacion);
                        if (ObjEstudianteMatriculado.count > 0) {
                            var dataDetalle = {
                                cup_id: obj.cup_id,
                                estcup_id: VariablesGlobales.ESTADOACTIVO,
                                per_carrera: obj.per_carrera,
                                dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                                dcupobservacion: "MATRICULACION NIVELACION PROCESO MIGRACION"
                            }
                            var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo("OAS_Master", dataDetalle);
                        } else {
                            var dataDetalle = {
                                cup_id: obj.cup_id,
                                estcup_id: VariablesGlobales.ESTADOPERDIDO,
                                per_carrera: obj.per_carrera,
                                dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                                dcupobservacion: "PERDIDA DE CUPO PROCESO MIGRACION"
                            }
                            var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo("OAS_Master", dataDetalle);
                        }
                    } else {
                        console.log("El estudiante: " + obj.identificacion + "no tiene inscripcion en el periodo: " + periodo);
                    }

                }
            }
            console.log("***********PROCESO FINALIZADO MATRICULACION CUPO**********")
            return ListadoEstudiantes;
        } catch (error) {
            console.error(error);
            return 'ERROR';
        }


    } catch (err) {
        console.error(err);
        return 'ERROR';
    }
}
async function ProcesodeVerificarRetirosMatriculadoNivelacion(periodo, nivel) {
    try {
        console.log("***********PROCESO INICIALIZADO RETIRO CUPO**********")
        var date = new Date();
        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        var min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        try {
            var ListadoEstudiantes = [];
            var ListadoEstudiantes = await procesoCupo.ListadoEstudianteConfirmados("OAS_Master", periodo);
            if (ListadoEstudiantes.data.length > 0) {
                for (var obj of ListadoEstudiantes.data) {
                    var DatosIncripcion = await procesoCupo.ObenterEstudianteIncripcionMaster("OAS_Master", obj.identificacion, periodo);
                    console.log("DatosIncripcion Nueva MAster")
                    console.log(DatosIncripcion)
                    if (DatosIncripcion.count > 0) {
                        var ListadoAsignaturasCurso = await procesoCupo.ObenterDictadoMateriasNivel(DatosIncripcion.data[0].strBaseDatos, obj.per_carrera, nivel);
                        if (ListadoAsignaturasCurso.data.length > 0) {
                            var listadoasignaturasMatriculado = await procesoCupo.AsignaturasMatriculadaEstudiante(DatosIncripcion.data[0].strBaseDatos, obj.per_carrera, obj.identificacion);
                            if (listadoasignaturasMatriculado.data.length > 0) {
                                if (ListadoAsignaturasCurso.data.length == listadoasignaturasMatriculado.data.length) {
                                    var VerificarRetiros = await procesoCupo.AsignaturasRetiroEstudiante(DatosIncripcion.data[0].strBaseDatos, obj.per_carrera, obj.identificacion);
                                    if (VerificarRetiros.data.length > 0) {
                                        if (VerificarRetiros.count == ListadoAsignaturasCurso.count) {

                                            var dataDetalle = {
                                                cup_id: obj.cup_id,
                                                estcup_id: VariablesGlobales.ESTADORETIROPARCIAL,
                                                per_carrera: obj.per_carrera,
                                                dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                                                dcupobservacion: "RETIRO PARCIAL CARRERA PROCESO MIGRACION"
                                            }
                                            var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo("OAS_Master", dataDetalle);
                                        }
                                    }

                                }
                            }
                        }
                    } else {
                        console.log("El estudiante: " + obj.identificacion + "no tiene inscripcion en el periodo: " + periodo);
                    }
                }
            }
            console.log("***********PROCESO FINALIZADO RETIRO CUPO**********")
            return ListadoEstudiantes;
        } catch (error) {
            console.error(error);
            return 'ERROR';
        }


    } catch (err) {
        console.error(err);
        return 'ERROR';
    }
}

async function ProcesodeCalcularPerdidaPeriodoCupo(numeroPeriodo, estadoperdida) {
    console.log("***********PROCESO INICIALIZADO CALCULO PERDIDA POR PERIODO**********")
    try {

        var date = new Date();
        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        var min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        try {
            var ListadoEstudiantes = [];

            var PeriodoActual = await procesoCupo.ObtenerPeriodoVigenteMaster("OAS_Master");
            if (PeriodoActual.data.length > 0) {
                var numeroPeriodoActual = obtenerNumeroDesdeParametro(PeriodoActual.data[0].strCodigo);
                if (numeroPeriodoActual > 0) {
                    var perdidaperiodo = Number(numeroPeriodoActual) - Number(numeroPeriodo);
                    var numeroPeriodoPerdidoString = obtenerParametroDesdeNumero(Number(perdidaperiodo));
                    var ListadoEstudiantes = await procesoCupo.ListadoEstudiantesRetiroParcial("OAS_Master", estadoperdida);
                    if (ListadoEstudiantes.data.length > 0) {
                        for (var obj of ListadoEstudiantes.data) {
                            if (obj.per_detalle == numeroPeriodoPerdidoString) {
                                var dataDetalle = {
                                    cup_id: obj.cup_id,
                                    estcup_id: VariablesGlobales.ESTADOPERDIDO,
                                    per_carrera: PeriodoActual.data[0].strCodigo,
                                    dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                                    dcupobservacion: "PERDIDA DE CUPO POR MAXIMO DE PERIODOS PROCESO MIGRACION"
                                }
                                var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo("OAS_Master", dataDetalle);
                            }
                        }

                    }

                } else {
                    console.log("El periodo actual no cumple con el formato correspondiente" + PeriodoActual.data[0].strCodigo)
                }

            } else {
                console.log("No exite periodo vigente en la master")
            }


            console.log("***********PROCESO FINALIZADO CALCULO PERDIDA POR PERIODO**********")
            return ListadoEstudiantes;
        } catch (error) {
            console.error(error);
            return 'ERROR';
        }


    } catch (err) {
        console.error(err);
        return 'ERROR';
    }
}

async function ProcesodeActivarCupodeRetiros(estadoperdida) {
    console.log("***********PROCESO ACTIVAR CUPO POR RETIRO PARCIAL**********")
    try {

        var date = new Date();
        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        var min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        try {
            var ListadoEstudiantes = [];
            var ListadoEstudiantes = await procesoCupo.ListadoEstudiantesRetiroParcial("OAS_Master", estadoperdida);
            if (ListadoEstudiantes.data.length > 0) {
                for (var obj of ListadoEstudiantes.data) {
                    var numeroPeriodoActual = obtenerNumeroDesdeParametro(obj.per_carrera);
                    var periodoMatricula = Number(numeroPeriodoActual) + 1;
                    var periodoMatriculaString = obtenerParametroDesdeNumero(Number(periodoMatricula));
                    var ObjEstudianteMatriculado = await procesoCupo.EncontrarEstudianteMatriculado(obj.carrera, periodoMatriculaString, obj.identificacion);
                    if (ObjEstudianteMatriculado.count > 0) {
                        var dataDetalle = {
                            cup_id: obj.cup_id,
                            estcup_id: VariablesGlobales.ESTADOACTIVO,
                            per_carrera: obj.per_carrera,
                            dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                            dcupobservacion: "MATRICULACION NIVELACION PROCESO MIGRACION REIGRESO"
                        }

                        var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo("OAS_Master", dataDetalle);
                    }
                }
            }

            console.log("***********PROCESO ACTIVAR CUPO POR RETIRO PARCIAL**********")
            return ListadoEstudiantes;
        } catch (error) {
            console.error(error);
            return 'ERROR';
        }


    } catch (err) {
        console.error(err);
        return 'ERROR';
    }
}
function obtenerNumeroDesdeParametro(parametro) {
    // Verificar si el parámetro comienza con 'P'
    if (parametro.startsWith('P')) {
        // Obtener el número entero después del 'P'
        const numero = parseInt(parametro.substring(1));
        // Verificar si el número es un entero válido
        if (!isNaN(numero)) {
            return numero;
        } else {
            return 0; // Retornar null si no se puede convertir a número entero
        }
    } else {
        return 0; // Retornar null si el parámetro no comienza con 'P'
    }
}

function obtenerParametroDesdeNumero(numero) {
    // Verificar si el número es un entero válido
    if (!isNaN(numero) && Number.isInteger(numero)) {
        // Convertir el número a una cadena y agregar ceros a la izquierda si es necesario
        const parametro = "P" + numero.toString().padStart(4, '0');
        return parametro;
    } else {
        return null; // Retornar null si el número no es válido
    }
}