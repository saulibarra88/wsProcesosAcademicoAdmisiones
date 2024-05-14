const axios = require('axios');
const cron = require('node-cron');
const pathimage = require('path');
const nomenclatura = require('../config/nomenclatura');
const VariablesGlobales = require('../rutas/VariablesGlobales');
const procesoCupo = require('../modelo/procesocupos');
const centralizada = require('../modelo/centralizada');
const tools = require('./tools');
const fs = require("fs");
const https = require('https');

module.exports.ProcesoVerificarRegistroIncripcionesEstudiantesAdmisiones = async function (periodo, cedula) {
    try {
        var ListadoEstudiantes = [];
        var listadoMatriculas = [];
        const content = {
            perNomenclatura: periodo
        }
        var ListadoEstudiantes = await axios.post("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/asignacion_cupo/aceptados_periodo_cusofa", content, { httpsAgent: agent });
        if (ListadoEstudiantes.data.length > 0) {
            for (var estudiantes of ListadoEstudiantes.data) {
                var VerifiacionIncripcion = await procesoCupo.ObenterTodasEstudianteIncripcion("OAS_Master", tools.CedulaConGuion(estudiantes.AspirantePostulacion.Persona.perCedula));
                if (VerifiacionIncripcion.count == 0) {
                    var datos = {
                        Cedula: estudiantes.AspirantePostulacion.Persona.perCedula,
                        Estudiante: estudiantes.AspirantePostulacion.Persona.perNombres + " " + estudiantes.AspirantePostulacion.Persona.perApellidos,
                        Carrera: estudiantes.AspirantePostulacion.Carrera.carNombre,
                        Mesaje: "No tiene ninguna inscripcion registrada",
                        Periodo: 0
                    }
                    listadoMatriculas.push(datos)
                }
                else {
                    var bandera = false;
                    var strperiodo = ""
                    for (var datosincripciones of VerifiacionIncripcion.data) {
                        if (datosincripciones.strCodPeriodo == periodo) {
                            bandera = true
                        }
                        strperiodo = strperiodo + datosincripciones.strCodPeriodo + "//"
                    }
                    if (!bandera) {
                        var datos = {
                            Cedula: estudiantes.AspirantePostulacion.Persona.perCedula,
                            Estudiante: estudiantes.AspirantePostulacion.Persona.perNombres + " " + estudiantes.AspirantePostulacion.Persona.perApellidos,
                            Carrera: estudiantes.AspirantePostulacion.Carrera.carNombre,
                            Mesaje: "Tiene Inscripcion en otros periodos no en el actual",
                            Periodo: strperiodo
                        }
                        listadoMatriculas.push(datos)
                    } else {


                    }
                }
            }
        }
        return { blProceso: true, Informacion: listadoMatriculas }
    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
        console.log(error);
    }
}
module.exports.ProcesoConfirmacionCupoInscripcion = async function (periodo, cedula) {
    try {
        //Proceso para insertar el cupo en confirmado cuando han aceptado la postulacion de la carrera
        var obtenerDatos = await procesoCupo.ObtenerDatosCupoProcesoTabla(periodo, 1);
        if (obtenerDatos.count > 0) {
            return { blProceso: true, mensaje: "El proceso CONFIRMACION CUPO INSCRIPCION ya se encuetra ejecutado en el periodo:  " + periodo }
        } else {
            if (periodo == 'P0039') {
                var resultado = await ProcesoVerificacionConfirmacionCupoInscripcionP0039(periodo);

            } else {
                var resultado = await ProcesoVerificacionConfirmacionCupoInscripcion(periodo); //Periodo a bucar //Servicio Web Sistema Incripciones
            }

            var ingresoProceso = await procesoCupo.InsertarCupoProcesoTabla(1, "CONFIRMACION CUPO INSCRIPCION", periodo, cedula);
            return { blProceso: true, mensaje: "Se ejecuto el proceso CONFIRMACION CUPO INSCRIPCION con éxito en el " + periodo }
        }
    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
        console.log(error);
    }
}


module.exports.ProcesoMatriculadosConfirmados = async function (periodo, cedula) {
    try {
        //Procesos para insertar el cupo en activo o perdida cuando se han matriculado en el periodo
        var obtenerDatos = await procesoCupo.ObtenerDatosCupoProcesoTabla(periodo, 2);
        if (obtenerDatos.count > 0) {
            return { blProceso: true, mensaje: "El proceso MATRICULACION ACEPTACION CUPO ya se encuetra ejecutado en el periodo:  " + periodo }
        } else {
            var resultado = await ProcesodeVerificarMatriculadoConfirmados(periodo);//Periodo a bucar 
            var resultado2 = await ProcesoMatriculadosDefinitivasPeriodosssNivelacion(periodo);//Matriculados sin proceso de admision
            var ingresoProceso = await procesoCupo.InsertarCupoProcesoTabla(2, "MATRICULACION ACEPTACION CUPO", periodo, cedula);
            return { blProceso: true, mensaje: "Se ejecuto el proceso MATRICULACION ACEPTACION CUPO con éxito en el " + periodo }
        }
    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
        console.log(error);
    }
}

module.exports.ProcesoRetirosParciales = async function (periodo, cedula) {
    try {
        //Proceso para insertar el cupo en retiro parcial cuando se han retirado de las materias
        var obtenerDatos = await procesoCupo.ObtenerDatosCupoProcesoTabla(periodo, 3);
        if (obtenerDatos.count > 0) {
            return { blProceso: true, mensaje: "El proceso RETIROS PARCIALES  ya se encuetra ejecutado en el periodo:  " + periodo }
        } else {
            var resultado = await ProcesodeVerificarRetirosMatriculadoNivelacion(periodo, 0); //Periodo a Bucar y Nivel
            var ingresoProceso = await procesoCupo.InsertarCupoProcesoTabla(3, "RETIROS PARCIALES", periodo, cedula);
            return { blProceso: true, mensaje: "Se ejecuto el proceso RETIROS PARCIALES con éxito en el " + periodo }
        }
    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
        console.log(error);
    }
}

module.exports.ProcesoCalculoPerdidaCupo = async function (periodo, cedula) {
    try {
        //Proceso para realizar el calculo de perdida de cupo por periodos acumulados
        var obtenerDatos = await procesoCupo.ObtenerDatosCupoProcesoTabla(periodo, 4);
        if (obtenerDatos.count > 0) {
            return { blProceso: true, mensaje: "El proceso PERDIDA CUPO PERIODOS ACUMULADOS  ya se encuetra ejecutado en el periodo:  " + periodo }
        } else {
            var resultado = await ProcesodeCalcularPerdidaPeriodoCupo(2, 4);//Numero de periodos a restas , estado de cupo a buscar
            var ingresoProceso = await procesoCupo.InsertarCupoProcesoTabla(4, "PERDIDA CUPO PERIODOS ACUMULADOS", periodo, cedula);
            return { blProceso: true, mensaje: "Se ejecuto el proceso PERDIDA CUPO PERIODOS ACUMULADOS con éxito en el " + periodo }
        }
    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
        console.log(error);
    }
}

module.exports.ProcesoActivarCupoRetirado = async function (periodo, cedula) {
    try {
        //Proceso para activar los cupos cuando se han realizado un retiro parcial en la carrera y en el siguiente periodo se matricula
        var obtenerDatos = await procesoCupo.ObtenerDatosCupoProcesoTabla(periodo, 5);
        if (obtenerDatos.count > 0) {
            return { blProceso: true, mensaje: "El proceso ACTIVACION CUPO RETIRO PARCIAL  ya se encuetra ejecutado en el periodo:  " + periodo }
        } else {
            var resultado = await ProcesodeActivarCupodeRetiros(4);//Estado de cupo a buscar para insertar
            var ingresoProceso = await procesoCupo.InsertarCupoProcesoTabla(5, "ACTIVACION CUPO RETIRO PARCIAL", periodo, cedula);
            return { blProceso: true, mensaje: "Se ejecuto el proceso ACTIVACION CUPO RETIRO PARCIAL con éxito en el " + periodo }
        }
    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
        console.log(error);
    }
}
module.exports.ProcesoImpedimentoAcademicoNivelacion = async function (periodo, cedula) {
    try {
        var resultado = await ProcesoImpedimentoAcademicoNivelacionn(periodo);//Estado de cupo a buscar para insertar
        return { blProceso: true, mensaje: "Se ejecuto el proceso IMPEDIMENTO ACADEMICO NIVELACION CON EXITOS  periodo" + periodo, Informacion: resultado }

    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
        console.log(error);
    }
}
module.exports.ProcesoMatriculadosNivelacion = async function (periodo, cedula) {
    try {
        var resultado = await ProcesoImpedimentoAcademicoNivelacionn(periodo);//Estado de cupo a buscar para insertar
        return { blProceso: true, mensaje: "Se ejecuto el proceso IMPEDIMENTO ACADEMICO NIVELACION CON EXITOS  periodo" + periodo, Informacion: resultado }

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
module.exports.ListadoPeriodosEjecutados = async function (periodo, cedula) {
    try {
        var listado = [];
        var listadoPeriodos = await procesoCupo.ListadoPeriodoEjecutados();
        if (listadoPeriodos.count > 0) {
            for (var obj of listadoPeriodos.data) {
                var ObtenerPeriodo = await procesoCupo.ObtenerPeriodoDadoCodigo(obj.strPeriodo);
                var datosProcesos = await procesoCupo.ListadoProcesoPeriodos(obj.strPeriodo);
                obj.periodos = ObtenerPeriodo.data[0];
                obj.procesos = datosProcesos.data;
                listado.push(obj)
            }
            return { blProceso: true, Datos: listado }
        }
    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
        console.log(error);
    }
}

module.exports.InscripcionEstudianteNoregistradoCasoEspecialP0039 = async function (periodo, cedula) {
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
        //Proceso para verificar los estudiantes que no estan inscripto pero si matriculados en nivelacion 
        var ListadoEstudiantes = [];
        var ListadoEstudiantes = await procesoCupo.ListadoEstudianteCuposCasoEspecial("OAS_Master", periodo);
        for (var estudiantes of ListadoEstudiantes.data) {
            var VerifiacionIncripcion = await procesoCupo.ObenterTodasEstudianteIncripcion("OAS_Master", estudiantes.identificacion);
            if (VerifiacionIncripcion.count == 0) {
                var listadoMatriculas = [];
                var ListadoCarreras = await procesoCupo.ListadoCarreraTodas();
                for (var carreras of ListadoCarreras.data) {
                    var MatriculasEstudiante = await procesoCupo.EncontrarEstudianteMatriculaTodas(carreras.strBaseDatos, estudiantes.identificacion);
                    if (MatriculasEstudiante.count > 0) {
                        listadoMatriculas.push(MatriculasEstudiante.data)
                    }
                }

                if (listadoMatriculas.length == 0) {
                    var dataDetalle = {
                        cup_id: estudiantes.cup_id,
                        estcup_id: VariablesGlobales.ESTADOPERDIDO,
                        per_carrera: estudiantes.per_carrera,
                        dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                        dcupobservacion: "PERDIDA DE CUPO PROCESO MIGRACION CASO ESPECIAL NO MATRICULADO//SIN INSCRIPCION"
                    }
                    var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo("OAS_Master", dataDetalle);
                }
            }
            else {
                var bandera = false;
                for (var datosincripciones of VerifiacionIncripcion.data) {
                    if (datosincripciones.strCodPeriodo == periodo) {
                        bandera = true
                    }

                }
                if (!bandera) {
                    var dataDetalle = {
                        cup_id: estudiantes.cup_id,
                        estcup_id: VariablesGlobales.ESTADOPERDIDO,
                        per_carrera: estudiantes.per_carrera,
                        dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                        dcupobservacion: "PERDIDA DE CUPO PROCESO MIGRACION CASO ESPECIAL NO MATRICULADO//SIN INSCRIPCION"
                    }
                    var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo("OAS_Master", dataDetalle);
                } else {
                    var dataDetalle = {
                        cup_id: estudiantes.cup_id,
                        estcup_id: VariablesGlobales.ESTADOACTIVO,
                        per_carrera: estudiantes.per_carrera,
                        dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                        dcupobservacion: "MATRICULACION NIVELACION PROCESO MIGRACION CASO ESPECIAL MATRICULADO//SIN INSCRIPCION"
                    }
                    var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo("OAS_Master", dataDetalle);
                }

            }

        }

        return { blProceso: true, Informacion: listadoMatriculas }

    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
        console.log(error);
    }
} 

module.exports.ProcesoValidacionConocimientosMatriculasPeriodos = async function () {
    try {
        var ListadoEstudiantes = [];
        var listadoMatriculas = [];
        var ListadoCarrera = await procesoCupo.ListadoCarreraTodas();
        for (var carrera of ListadoCarrera.data) {
            var ListadosMatriculas = await procesoCupo.MatriculasCarrerasValidacionConocimiento(carrera.strBaseDatos);
            for (var matricula of ListadosMatriculas.data) {
                matricula.carreraBase=carrera.strBaseDatos
                matricula.carreraNombre=carrera.strNombreCarrera
                listadoMatriculas.push(matricula)
            }
        }
        return { blProceso: true, Informacion: listadoMatriculas }
    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
        console.log(error);
    }
}
module.exports.ProcesoEstudianteMatriculadosNivel = async function (periodo,nivel) {
    try {
        var ListadoEstudiantes = [];
        var listadoMatriculas = [];
        var ListadoCarrera = await procesoCupo.ListadoCarreraTodas();
        for (var carrera of ListadoCarrera.data) {

            var ListadosMatriculas = await procesoCupo.MatriculasCarrerasPeriodo(carrera.strBaseDatos, periodo);
            for (var matricula of ListadosMatriculas.data) {
                if(matricula.strCodNivel==nivel){
                    var datos={
                        Sede:carrera.strSede ,
                        Carrera:carrera.strNombreCarrera ,
                        Facultad:carrera.strNombreFacultad ,
                        Cedula: matricula.strCedula,
                        Estudiante:matricula.strApellidos+ " " +  matricula.strNombres ,
                        Correo:matricula.strEmail ,
                        Nivel:matricula.strCodNivel,
                        Celular:matricula.strCedulaMil,
                        Periodo:periodo
                    }
                    listadoMatriculas.push(datos)
                }
            }
console.log("Total Informacion: "+listadoMatriculas.length)
           
        }
        return { blProceso: true, Informacion: listadoMatriculas }
    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
        console.log(error);
    }
}
module.exports.ProcesoEstudianteMatriculadosNivelCupos = async function (periodo,nivel) {
    try {
        var ListadoEstudiantes = [];
        var listadoMatriculas = [];
        var ListadoCarrera = await procesoCupo.ListadoCarreraTodas();
        for (var carrera of ListadoCarrera.data) {

            var ListadosMatriculas = await procesoCupo.MatriculasCarrerasPeriodo(carrera.strBaseDatos, periodo);
            for (var matricula of ListadosMatriculas.data) {
                if(matricula.strCodNivel==nivel){
                    var ObtenerCupoUltimo = await procesoCupo.ObtenerUltimoDetalleCupoRegistrado("OAS_Master", matricula.strCedula);
                    var datos={
                        Sede:carrera.strSede ,
                        Carrera:carrera.strNombreCarrera ,
                        Facultad:carrera.strNombreFacultad ,
                        Cedula: matricula.strCedula,
                        Estudiante:matricula.strApellidos+ " " +  matricula.strNombres ,
                        Correo:matricula.strEmail ,
                        Nivel:matricula.strCodNivel,
                        Celular:matricula.strCedulaMil,
                        Periodo:periodo
                    }
                    
                    console.log(ObtenerCupoUltimo)
                    if (ObtenerCupoUltimo.count > 0) {
                        datos.CupoId=ObtenerCupoUltimo.data[0].cup_iddetalle,
                        datos.CupoDescripcion=ObtenerCupoUltimo.data[0].dcupobservacion
                        datos.CupoEstado=ObtenerCupoUltimo.data[0].estnombre
                        datos.CupoEstadoSenescyt=ObtenerCupoUltimo.data[0].estnombresenescyt
                        datos.CupoEstadoId=ObtenerCupoUltimo.data[0].idEstadoCupo
                    }else{
                        datos.CupoId=0,
                        datos.CupoDescripcion="NO REGISTRO",
                        datos.CupoEstado="NO REGISTRO",
                        datos.CupoEstadoSenescyt="NO REGISTRO",
                        datos.CupoEstadoId=0
                    }
              
                   
                    listadoMatriculas.push(datos)
                }
            }
console.log("Total Informacion: "+listadoMatriculas.length)
           
        }
        return { blProceso: true, Informacion: listadoMatriculas }
    } catch (error) {
        return { blProceso: false, mensaje: "Error :" + error }
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
                        var VerificarEstudianteCupo = await procesoCupo.ObtenerEstudianteCupo(tools.CedulaConGuion(obj.AspirantePostulacion.Persona.perCedula), periodo, obj.AspirantePostulacion.Carrera.carNombre);
                        if (VerificarEstudianteCupo.count == 0) {
                            var IngresoDatos = await procesoCupo.InsertarCupoConfirmadoTrasnsaccion("OAS_Master", dataCupo, dataDetalle, periodo);
                        } else {
                            console.log("Ya se encuentra registrado el estudiainte :" + tools.CedulaConGuion(obj.AspirantePostulacion.Persona.perCedula) + " //Carrera: " + obj.AspirantePostulacion.Carrera.carNombre + " //Periodo: " + obj.AspirantePostulacion.Periodo.perNomenclatura)
                        }

                    }

                }
            }
          
            console.log("***********PROCESO FINALIZADO CUPO INSCRIPCION**********")
            return 'OK';
        } catch (error) {
            console.error(error);
            return 'ERROR: ' + error;
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

            if (ListadoEstudiantes.data.length > 0) {
                for (var obj of ListadoEstudiantes.data) {
                    var DatosIncripcion = await procesoCupo.ObenterEstudianteIncripcionP0039("OAS_Master", tools.CedulaConGuion(obj.AspirantePostulacion.Persona.perCedula), periodo);

                    if (DatosIncripcion.count > 0) {

                        var dataCupo = {
                            acu_id: obj.acuId,
                            identificacion: tools.CedulaConGuion(obj.AspirantePostulacion.Persona.perCedula),
                            per_id: obj.AspirantePostulacion.Persona.perId,
                            tipoinsc: "NIVELACION",
                            per_niv: obj.AspirantePostulacion.Periodo.perCodigo,
                            per_carrera: obj.AspirantePostulacion.Periodo.perNomenclatura,
                            carrera: DatosIncripcion.data[0].strBaseDatos,
                            fechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                            cup_estado: 1
                        }
                        var dataDetalle = {
                            estcup_id: VariablesGlobales.ESTADOCONFIRMADO,
                            per_carrera: obj.AspirantePostulacion.Periodo.perNomenclatura,
                            dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                            dcupobservacion: "ACEPTACION CUPO SENECYT PROCESO MIGRACION"
                        }
                        var IngresoDatos = await procesoCupo.InsertarCupoConfirmadoTrasnsaccionGeneral("OAS_Master", dataCupo, dataDetalle);
                    } else {

                        var DatosCarrera = await procesoCupo.ObtenerBaseNivelacionDadoCusidPeriodo(obj.AspirantePostulacion.Carrera.carCusId, periodo);
                        var basedatoCarrera = "BASE DESCONOCIDA EN HOMOLOGACIONES " + periodo
                        if (DatosCarrera.count > 0) {
                            basedatoCarrera = DatosCarrera.data[0].hmbdbaseniv
                        }
                        var dataCupo = {
                            acu_id: obj.acuId,
                            identificacion: tools.CedulaConGuion(obj.AspirantePostulacion.Persona.perCedula),
                            per_id: obj.AspirantePostulacion.Persona.perId,
                            tipoinsc: "NIVELACION",
                            per_niv: obj.AspirantePostulacion.Periodo.perCodigo,
                            per_carrera: obj.AspirantePostulacion.Periodo.perNomenclatura,
                            carrera: basedatoCarrera,
                            fechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                            cup_estado: 1
                        }
                        var dataDetalle = {
                            estcup_id: VariablesGlobales.ESTADOIMPEDIMENTOACADEMICO,
                            per_carrera: obj.AspirantePostulacion.Periodo.perNomenclatura,
                            dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                            dcupobservacion: "IMPEDIMENTO ACADEMICO PROCESO MIGRACION"
                        }
                        var IngresoDatos = await procesoCupo.InsertarCupoConfirmadoTrasnsaccionGeneral("OAS_Master", dataCupo, dataDetalle);

                    }
                }
            }
            console.log("POSTULANTES ADMISIONES TOTAL" + ListadoEstudiantes.data.length)

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
                    if (DatosIncripcion.count > 0) {
                        var ObjEstudianteMatriculado = await procesoCupo.EncontrarEstudianteMatriculado(DatosIncripcion.data[0].strBaseDatos, obj.per_carrera, obj.identificacion);
                        if (ObjEstudianteMatriculado.count > 0) {
                            var dataDetalle = {
                                cup_id: obj.cup_id,
                                estcup_id: VariablesGlobales.ESTADOACTIVO,
                                per_carrera: obj.per_carrera,
                                dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                                dcupobservacion: "MATRICULACION NIVELACION PROCESO MIGRACION // MATRICULADO EN NIVELACION"
                            }
                            var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo("OAS_Master", dataDetalle);
                        } else {
                            var dataDetalle = {
                                cup_id: obj.cup_id,
                                estcup_id: VariablesGlobales.ESTADOPERDIDO,
                                per_carrera: obj.per_carrera,
                                dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                                dcupobservacion: "PERDIDA DE CUPO PROCESO MIGRACION// NO MATRICULADO EN NIVELACION"
                            }
                            var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo("OAS_Master", dataDetalle);
                        }
                    } else {
                        var dataDetalle = {
                            cup_id: obj.cup_id,
                            estcup_id: VariablesGlobales.ESTADOIMPEDIMENTOACADEMICO,
                            per_carrera: obj.per_carrera,
                            dcupfechacreacion: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec,
                            dcupobservacion: "IMPEDIMENTO ACADEMICO PROCESO MIGRACION"
                        }
                        var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo("OAS_Master", dataDetalle);
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

async function ProcesoImpedimentoAcademicoNivelacionn(periodo) {
    try {
        try {
            var ListadoEstudiantes = [];
            var ListadoCarrera = await procesoCupo.ListadoCarreraNivelacion("UNA");
            for (var carrera of ListadoCarrera.data) {
                // if (carrera.strBaseDatos == 'OAS_NivArtes') {
                var ListadosMatriculas = await procesoCupo.MatriculasCarrerasPeriodo(carrera.strBaseDatos, periodo);
                for (var matricula of ListadosMatriculas.data) {
                    var DatosAsignaturas = await procesoCupo.AsignaturasMatriculadaEstudiante(carrera.strBaseDatos, periodo, matricula.strCedula);
                    var verificarperdida = false;
                    if (DatosAsignaturas.count > 0) {
                        for (var asignatura of DatosAsignaturas.data) {
                            if (Number(asignatura.bytNumMat) >= VariablesGlobales.REPETICIONESaSIGNATURAS) {
                                var DatosExamenes = await procesoCupo.NotasExamenesEstudianteDadoMateria(carrera.strBaseDatos, periodo, matricula.sintCodigo, asignatura.strCodMateria);

                                if (DatosExamenes.count > 0) {
                                    for (var notas of DatosExamenes.data) {
                                        if (notas.strCodEquiv == VariablesGlobales.EQUIVALENCIAPERDIDAaSIGNATURA) {
                                            verificarperdida = true;

                                        }
                                    }

                                }

                            }
                        }
                        if (verificarperdida) {
                            var VerificarEstudianteCupo = await procesoCupo.ObtenerEstudianteCupo(matricula.strCedula, periodo, carrera.strBaseDatos);
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
                                    estcup_id: VariablesGlobales.ESTADOIMPEDIMENTOACADEMICO,
                                    per_carrera: periodo,
                                    dcupfechacreacion: tools.FechaActualCupo(),
                                    dcupobservacion: "IMPEDIMENTO ACADEMICO PROCESO MIEGRACION // PERDIDA SEGUNDA MATRICULA NIVELACION"
                                }
                                var IngresoDatos = await procesoCupo.InsertarCupoConfirmadoTrasnsaccionGeneral("OAS_Master", dataCupo, dataDetalle, periodo);
                                var agregardatos = {
                                    cedula: matricula.strCedula,
                                    carrera: carrera.strBaseDatos
                                }
                                ListadoEstudiantes.push(agregardatos)
                            } else {
                                console.log("Ya se encuentra registrado el estudiainte ")
                                var dataDetalle = {
                                    cup_id: VerificarEstudianteCupo.data[0].cup_id,
                                    estcup_id: VariablesGlobales.ESTADOIMPEDIMENTOACADEMICO,
                                    per_carrera: periodo,
                                    dcupfechacreacion: tools.FechaActualCupo(),
                                    dcupobservacion: "IMPEDIMENTO ACADEMICO PROCESO MIEGRACION // PERDIDA SEGUNDA MATRICULA NIVELACION"
                                }
                                var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo("OAS_Master", dataDetalle);

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
async function ProcesoMatriculadosDefinitivasPeriodosss(periodo) {
    try {
        try {
            var ListadoEstudiantes = [];
            var ListadoCarrera = await procesoCupo.ListadoCarreraTodas();
            //var ListadoCarrera = await procesoCupo.ListadoCarreraNivelacion("UNA");
            for (var carrera of ListadoCarrera.data) {
                // if (carrera.strBaseDatos == 'OAS_NivArtes') {
                var ListadosMatriculas = await procesoCupo.MatriculasCarrerasPeriodo(carrera.strBaseDatos, periodo);
                for (var matricula of ListadosMatriculas.data) {
                    var VerificarEstudianteCupo = await procesoCupo.ObtenerEstudianteCupo(matricula.strCedula, periodo, carrera.strBaseDatos);
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
                        var IngresoDatos = await procesoCupo.InsertarCupoConfirmadoTrasnsaccionGeneral("OAS_Master", dataCupo, dataDetalle, periodo);
                        var agregardatos = {
                            cedula: matricula.strCedula,
                            carrera: carrera.strBaseDatos
                        }
                        ListadoEstudiantes.push(agregardatos)
                    } else {
                        var ObtenerCupoUltimo = await procesoCupo.ObtenerUltimoDetalleCupoRegistrado("OAS_Master", matricula.strCedula);

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
                                var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo("OAS_Master", dataDetalle);

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
        } catch (error) {
            console.error(error);
            return 'ERROR';
        }


    } catch (err) {
        console.error(err);
        return 'ERROR';
    }
}
async function ProcesoMatriculadosDefinitivasPeriodosssNivelacion(periodo) {
    try {
        try {
            var ListadoEstudiantes = [];
           // var ListadoCarrera = await procesoCupo.ListadoCarreraTodas();
            var ListadoCarrera = await procesoCupo.ListadoCarreraNivelacion("UNA");
            for (var carrera of ListadoCarrera.data) {
                // if (carrera.strBaseDatos == 'OAS_NivArtes') {
                var ListadosMatriculas = await procesoCupo.MatriculasCarrerasPeriodo(carrera.strBaseDatos, periodo);
                for (var matricula of ListadosMatriculas.data) {
                    var VerificarEstudianteCupo = await procesoCupo.ObtenerEstudianteCupo(matricula.strCedula, periodo, carrera.strBaseDatos);
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
                        var IngresoDatos = await procesoCupo.InsertarCupoConfirmadoTrasnsaccionGeneral("OAS_Master", dataCupo, dataDetalle, periodo);
                        var agregardatos = {
                            cedula: matricula.strCedula,
                            carrera: carrera.strBaseDatos
                        }
                        ListadoEstudiantes.push(agregardatos)
                    } else {
                        var ObtenerCupoUltimo = await procesoCupo.ObtenerUltimoDetalleCupoRegistrado("OAS_Master", matricula.strCedula);
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
                                var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo("OAS_Master", dataDetalle);

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
        } catch (error) {
            console.error(error);
            return 'ERROR';
        }


    } catch (err) {
        console.error(err);
        return 'ERROR';
    }
}