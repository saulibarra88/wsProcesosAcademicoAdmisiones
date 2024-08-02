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
const {  iniciarDinamicoPool,iniciarDinamicoTransaccion} = require("./../config/execSQLDinamico.helper");
const {  iniciarMasterTransaccion,iniciarMasterPool} = require("./../config/execSQLMaster.helper");

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
module.exports.ProcesoCasosEspecialRube = async function (periodo) {
    try {
        //Procesos para insertar el cupo en activo o perdida cuando se han matriculado en el periodo
  
    
            var resultado = await ProcesodeVerificarMatriculadoConfirmadosCasoRuben(periodo);//Periodo a bucar 
            
            return { blProceso: true, mensaje: "Se ejecuto el proceso MATRICULACION ACEPTACION CUPO con éxito en el " + periodo }
        
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
module.exports.ProcesoAprobacionNivelacionVerificarPasoCarrera = async function (periodo,) {
    try {
        //Proceso para realizar el calculo de perdida de cupo por periodos acumulados
        var obtenerDatos = await ProcesoAprobacionNivelacionPasoCarrera(periodo, 0);
     
            return obtenerDatos;
        
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
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transaction = await iniciarMasterTransaccion(pool);
    await transaction.begin();
    try {
        //Proceso para verificar los estudiantes que no estan inscripto pero si matriculados en nivelacion 
        var ListadoEstudiantes = [];
        var ListadoEstudiantes = await procesoCupo.ListadoEstudianteCuposCasoEspecial("OAS_Master", periodo);
        for (var estudiantes of ListadoEstudiantes.data) {
            var VerifiacionIncripcion = await procesoCupo.ObenterTodasEstudianteIncripcion("OAS_Master", estudiantes.identificacion);
            if (VerifiacionIncripcion.count == 0) {
                var listadoMatriculas = [];
                
                var ListadoCarreras = await procesoCupo.ListadoCarreraTodas(transaction,"OAS_Master");
                for (var carreras of ListadoCarreras.data) {
                    var MatriculasEstudiante = await procesoCupo.EncontrarEstudianteMatriculaTodas(transaction,carreras.strBaseDatos, estudiantes.identificacion);
                    if (MatriculasEstudiante.count > 0) {
                        listadoMatriculas.push(MatriculasEstudiante.data)
                    }
                }

                if (listadoMatriculas.length == 0) {
                    var dataDetalle = {
                        cup_id: estudiantes.cup_id,
                        estcup_id: VariablesGlobales.ESTADOPERDIDO,
                        per_carrera: estudiantes.per_carrera,
                        dcupfechacreacion: tools.FechaActualCupo(),
                        dcupobservacion: "PERDIDA DE CUPO PROCESO MIGRACION CASO ESPECIAL NO MATRICULADO//SIN INSCRIPCION"
                    }
                    var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo(transaction,"OAS_Master", dataDetalle);
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
                        dcupfechacreacion: tools.FechaActualCupo(),
                        dcupobservacion: "PERDIDA DE CUPO PROCESO MIGRACION CASO ESPECIAL NO MATRICULADO//SIN INSCRIPCION"
                    }
                    var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo(transaction,"OAS_Master", dataDetalle);
                } else {
                    var dataDetalle = {
                        cup_id: estudiantes.cup_id,
                        estcup_id: VariablesGlobales.ESTADOACTIVO,
                        per_carrera: estudiantes.per_carrera,
                        dcupfechacreacion:tools.FechaActualCupo(),
                        dcupobservacion: "MATRICULACION NIVELACION PROCESO MIGRACION CASO ESPECIAL MATRICULADO//SIN INSCRIPCION"
                    }
                    var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo(transaction,"OAS_Master", dataDetalle);
                }

            }

        }

        return { blProceso: true, Informacion: listadoMatriculas }

    } catch (err) {
        await transaction.rollback();
        console.error(err);
        return 'ERROR';
    } finally {
        await transaction.commit();
        await pool.close();
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
        var ListadoCarrera = await procesoCupo.ListadoCarreraTodasSinTransaccion("OAS_Master");
        for (var carrera of ListadoCarrera.data) {

            var ListadosMatriculas = await procesoCupo.MatriculasCarrerasPeriodoSinTransaccion(carrera.strBaseDatos, periodo);
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
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transaction = await iniciarMasterTransaccion(pool);
    await transaction.begin();
    try {
        console.log("***********PROCESO INICIALIZADO CUPO INSCRIPCION**********")

        
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
                        fechacreacion: tools.FechaActualCupo(),
                        cup_estado: 1
                    }
                    var dataDetalle = {
                        estcup_id: VariablesGlobales.ESTADOCONFIRMADO,
                        per_carrera: obj.AspirantePostulacion.Periodo.perNomenclatura,
                        dcupfechacreacion:tools.FechaActualCupo(),
                        dcupobservacion: "ACEPTACION CUPO PROCESO MIGRACION"
                    }
                   
                        var VerificarEstudianteCupo = await procesoCupo.ObtenerEstudianteCupo(transaction,tools.CedulaConGuion(obj.AspirantePostulacion.Persona.perCedula), periodo, obj.AspirantePostulacion.Carrera.carNombre);
                        if (VerificarEstudianteCupo.count == 0) {
                            var IngresoDatos = await procesoCupo.InsertarCupoConfirmadoTrasnsaccion(transaction,"OAS_Master", dataCupo, dataDetalle, periodo);
                        } else {
                            console.log("Ya se encuentra registrado el estudiainte :" + tools.CedulaConGuion(obj.AspirantePostulacion.Persona.perCedula) + " //Carrera: " + obj.AspirantePostulacion.Carrera.carNombre + " //Periodo: " + obj.AspirantePostulacion.Periodo.perNomenclatura)
                        }
                    

                }
            }
          
            console.log("***********PROCESO FINALIZADO CUPO INSCRIPCION**********")
            return 'OK';
       
        } catch (err) {
            await transaction.rollback();
            console.error(err);
            return 'ERROR';
        } finally {
            await transaction.commit();
            await pool.close();
        }
}

async function ProcesoVerificacionConfirmacionCupoInscripcionP0039(periodo) {
    console.log("***********PROCESO INICIALIZADO CUPO INSCRIPCION**********")
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transaction = await iniciarMasterTransaccion(pool);
    await transaction.begin();
    try {
            var ListadoEstudiantes = [];
            const content = {
                perNomenclatura: periodo
            }
            var ListadoEstudiantes = await axios.post("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/asignacion_cupo/aceptados_periodo_cusofa", content, { httpsAgent: agent });
            if (ListadoEstudiantes.data.length > 0) {
                for (var obj of ListadoEstudiantes.data) {
                    var DatosIncripcion = await procesoCupo.ObenterEstudianteIncripcionP0039(transaction,"OAS_Master", tools.CedulaConGuion(obj.AspirantePostulacion.Persona.perCedula), periodo);
                    if (DatosIncripcion.count > 0) {
                        var dataCupo = {
                            acu_id: obj.acuId,
                            identificacion: tools.CedulaConGuion(obj.AspirantePostulacion.Persona.perCedula),
                            per_id: obj.AspirantePostulacion.Persona.perId,
                            tipoinsc: "NIVELACION",
                            per_niv: obj.AspirantePostulacion.Periodo.perCodigo,
                            per_carrera: obj.AspirantePostulacion.Periodo.perNomenclatura,
                            carrera: DatosIncripcion.data[0].strBaseDatos,
                            fechacreacion: tools.FechaActualCupo(),
                            cup_estado: 1
                        }
                        var dataDetalle = {
                            estcup_id: VariablesGlobales.ESTADOCONFIRMADO,
                            per_carrera: obj.AspirantePostulacion.Periodo.perNomenclatura,
                            dcupfechacreacion:tools.FechaActualCupo(),
                            dcupobservacion: "ACEPTACION CUPO SENECYT PROCESO MIGRACION"
                        }
                        var IngresoDatos = await procesoCupo.InsertarCupoConfirmadoTrasnsaccionGeneral(transaction,"OAS_Master", dataCupo, dataDetalle);
                    } else {

                        var DatosCarrera = await procesoCupo.ObtenerBaseNivelacionDadoCusidPeriodo(transaction,"OAS_Master",obj.AspirantePostulacion.Carrera.carCusId, periodo);
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
                            fechacreacion: tools.FechaActualCupo(),
                            cup_estado: 1
                        }
                        var dataDetalle = {
                            estcup_id: VariablesGlobales.ESTADOIMPEDIMENTOACADEMICO,
                            per_carrera: obj.AspirantePostulacion.Periodo.perNomenclatura,
                            dcupfechacreacion: tools.FechaActualCupo(),
                            dcupobservacion: "IMPEDIMENTO ACADEMICO PROCESO MIGRACION"
                        }
                        var IngresoDatos = await procesoCupo.InsertarCupoConfirmadoTrasnsaccionGeneral(transaction,"OAS_Master", dataCupo, dataDetalle);
                    }
                }
            }
            console.log("POSTULANTES ADMISIONES TOTAL" + ListadoEstudiantes.data.length)
            console.log("***********PROCESO FINALIZADO CUPO INSCRIPCION**********")
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

async function ProcesodeVerificarMatriculadoConfirmados(periodo) {
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transaction = await iniciarMasterTransaccion(pool);
    await transaction.begin();
    try {
        console.log("***********PROCESO INICIALIZADO MATRICULACION CUPO**********")
  
            var ListadoEstudiantes = [];
            var ListadoEstudiantes = await procesoCupo.ListadoEstudianteConfirmados(transaction,"OAS_Master", periodo);
            if (ListadoEstudiantes.data.length > 0) {
                for (var obj of ListadoEstudiantes.data) {
                    var DatosIncripcion = await procesoCupo.ObenterEstudianteIncripcionMaster(transaction,"OAS_Master", obj.identificacion, periodo);
                    if (DatosIncripcion.count > 0) {
                        var ObjEstudianteMatriculado = await procesoCupo.EncontrarEstudianteMatriculado(transaction,DatosIncripcion.data[0].strBaseDatos, obj.per_carrera, obj.identificacion);
                        if (ObjEstudianteMatriculado.count > 0) {
                            var dataDetalle = {
                                cup_id: obj.cup_id,
                                estcup_id: VariablesGlobales.ESTADOACTIVO,
                                per_carrera: obj.per_carrera,
                                dcupfechacreacion:  tools.FechaActualCupo(),
                                dcupobservacion: "MATRICULACION NIVELACION PROCESO MIGRACION // MATRICULADO EN NIVELACION"
                            }
                            var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo(transaction,"OAS_Master", dataDetalle);
                        } else {
                            var dataDetalle = {
                                cup_id: obj.cup_id,
                                estcup_id: VariablesGlobales.ESTADOPERDIDO,
                                per_carrera: obj.per_carrera,
                                dcupfechacreacion:  tools.FechaActualCupo(),
                                dcupobservacion: "PERDIDA DE CUPO PROCESO MIGRACION// NO MATRICULADO EN NIVELACION"
                            }
                            var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo(transaction,"OAS_Master", dataDetalle);
                        }
                    } else {
                        var dataDetalle = {
                            cup_id: obj.cup_id,
                            estcup_id: VariablesGlobales.ESTADOIMPEDIMENTOACADEMICO,
                            per_carrera: obj.per_carrera,
                            dcupfechacreacion:  tools.FechaActualCupo(),
                            dcupobservacion: "IMPEDIMENTO ACADEMICO PROCESO MIGRACION"
                        }
                        var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo(transaction,"OAS_Master", dataDetalle);
                        console.log("El estudiante: " + obj.identificacion + "no tiene inscripcion en el periodo: " + periodo);
                    }

                }
            }
            console.log("***********PROCESO FINALIZADO MATRICULACION CUPO**********")
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
async function ProcesodeVerificarMatriculadoConfirmadosCasoRuben(periodo) {
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transaction = await iniciarMasterTransaccion(pool);
    await transaction.begin();
    try {
        console.log("***********PROCESO INICIALIZADO MATRICULACION CUPO**********")
  
            var ListadoEstudiantes = [];
            var ListadoEstudiantes = await procesoCupo.ListadoEstudianteConfirmados(transaction,"OAS_Master", periodo);
            if (ListadoEstudiantes.data.length > 0) {
                for (var obj of ListadoEstudiantes.data) {
                    var DatosIncripcion = await procesoCupo.ObenterEstudianteIncripcionMaster(transaction,"OAS_Master", obj.identificacion, periodo);
                    if (DatosIncripcion.count > 0) {
                        var ObjEstudianteMatriculado = await procesoCupo.EncontrarEstudianteMatriculado(transaction,DatosIncripcion.data[0].strBaseDatos, obj.per_carrera, obj.identificacion);
                        if (ObjEstudianteMatriculado.count > 0) {

                            var ObtenerCupoUltimo = await procesoCupo.ObtenerUltimoDetalleCupoRegistrado(transaction,"OAS_Master", obj.identificacion);
                        
                            if (ObtenerCupoUltimo.count > 0) {
                                console.log(ObtenerCupoUltimo.data[0])
                                console.log(ObtenerCupoUltimo.data[0].idEstadoCupo == VariablesGlobales.ESTADOCONFIRMADO)
                                if (ObtenerCupoUltimo.data[0].idEstadoCupo == VariablesGlobales.ESTADOCONFIRMADO) {
                                    var dataDetalle = {
                                        cup_id: obj.cup_id,
                                        estcup_id: VariablesGlobales.ESTADOACTIVO,
                                        per_carrera: obj.per_carrera,
                                        dcupfechacreacion:  tools.FechaActualCupo(),
                                        dcupobservacion: "MATRICULACION NIVELACION PROCESO MIGRACION // MATRICULADO EN NIVELACION"
                                    }
                                    console.log("dataDetalle: "+ obj.identificacion)
                                    console.log(dataDetalle)
                                    var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo(transaction,"OAS_Master", dataDetalle);

                                }

                        } 
                        } else {
                            var dataDetalle = {
                                cup_id: obj.cup_id,
                                estcup_id: VariablesGlobales.ESTADOPERDIDO,
                                per_carrera: obj.per_carrera,
                                dcupfechacreacion:  tools.FechaActualCupo(),
                                dcupobservacion: "PERDIDA DE CUPO PROCESO MIGRACION// NO MATRICULADO EN NIVELACION"
                            }
                            var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo(transaction,"OAS_Master", dataDetalle);
                        }
                    } else{

                        console.log("No inscripcion:"+ obj.identificacion)
                    }
                }
            }
            console.log("***********PROCESO FINALIZADO MATRICULACION CUPO**********")
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
async function ProcesodeVerificarRetirosMatriculadoNivelacion(periodo, nivel) {
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transaction = await iniciarMasterTransaccion(pool);
    await transaction.begin();
    try {
        console.log("***********PROCESO INICIALIZADO RETIRO CUPO**********")
            var ListadoEstudiantes = [];
            var ListadoEstudiantes = await procesoCupo.ListadoEstudianteConfirmados(transaction,"OAS_Master", periodo);
            if (ListadoEstudiantes.data.length > 0) {
                for (var obj of ListadoEstudiantes.data) {
                    var DatosIncripcion = await procesoCupo.ObenterEstudianteIncripcionMaster(transaction,"OAS_Master", obj.identificacion, periodo);
                    if (DatosIncripcion.count > 0) {
                        var ListadoAsignaturasCurso = await procesoCupo.ObenterDictadoMateriasNivel(transaction,DatosIncripcion.data[0].strBaseDatos, obj.per_carrera, nivel);
                        if (ListadoAsignaturasCurso.data.length > 0) {
                            var listadoasignaturasMatriculado = await procesoCupo.AsignaturasMatriculadaEstudiante(transaction,DatosIncripcion.data[0].strBaseDatos, obj.per_carrera, obj.identificacion);
                            if (listadoasignaturasMatriculado.data.length > 0) {
                                if (ListadoAsignaturasCurso.data.length == listadoasignaturasMatriculado.data.length) {
                                    var VerificarRetiros = await procesoCupo.AsignaturasRetiroEstudiante(transaction,DatosIncripcion.data[0].strBaseDatos, obj.per_carrera, obj.identificacion);
                                    if (VerificarRetiros.data.length > 0) {
                                        if (VerificarRetiros.count == ListadoAsignaturasCurso.count) {

                                            var dataDetalle = {
                                                cup_id: obj.cup_id,
                                                estcup_id: VariablesGlobales.ESTADORETIROPARCIAL,
                                                per_carrera: obj.per_carrera,
                                                dcupfechacreacion:  tools.FechaActualCupo(),
                                                dcupobservacion: "RETIRO PARCIAL CARRERA PROCESO MIGRACION"
                                            }
                                            var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo(transaction,"OAS_Master", dataDetalle);
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
      
        } catch (err) {
            await transaction.rollback();
            console.error(err);
            return 'ERROR';
        } finally {
            await transaction.commit();
            await pool.close();
        }
}

async function ProcesodeCalcularPerdidaPeriodoCupo(numeroPeriodo, estadoperdida) {
    console.log("***********PROCESO INICIALIZADO CALCULO PERDIDA POR PERIODO**********")
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transaction = await iniciarMasterTransaccion(pool);
    await transaction.begin();
    try {
            var ListadoEstudiantes = [];
            var PeriodoActual = await procesoCupo.ObtenerPeriodoVigenteMaster("OAS_Master");
            if (PeriodoActual.data.length > 0) {
                var numeroPeriodoActual = obtenerNumeroDesdeParametro(PeriodoActual.data[0].strCodigo);
                if (numeroPeriodoActual > 0) {
                    var perdidaperiodo = Number(numeroPeriodoActual) - Number(numeroPeriodo);
                    var numeroPeriodoPerdidoString = obtenerParametroDesdeNumero(Number(perdidaperiodo));
                    var ListadoEstudiantes = await procesoCupo.ListadoEstudiantesRetiroParcial(transaction,"OAS_Master", estadoperdida);
                    if (ListadoEstudiantes.data.length > 0) {
                        for (var obj of ListadoEstudiantes.data) {
                            if (obj.per_detalle == numeroPeriodoPerdidoString) {
                                var dataDetalle = {
                                    cup_id: obj.cup_id,
                                    estcup_id: VariablesGlobales.ESTADOPERDIDO,
                                    per_carrera: PeriodoActual.data[0].strCodigo,
                                    dcupfechacreacion: tools.FechaActualCupo(),
                                    dcupobservacion: "PERDIDA DE CUPO POR MAXIMO DE PERIODOS PROCESO MIGRACION"
                                }
                                var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo(transaction,"OAS_Master", dataDetalle);
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
        } catch (err) {
            await transaction.rollback();
            console.error(err);
            return 'ERROR';
        } finally {
            await transaction.commit();
            await pool.close();
        }
}

async function ProcesodeActivarCupodeRetiros(estadoperdida) {
    console.log("***********PROCESO ACTIVAR CUPO POR RETIRO PARCIAL**********")
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transaction = await iniciarMasterTransaccion(pool);
    await transaction.begin();
    try {
            var ListadoEstudiantes = [];
            var ListadoEstudiantes = await procesoCupo.ListadoEstudiantesRetiroParcial(transaction,"OAS_Master", estadoperdida);
            if (ListadoEstudiantes.data.length > 0) {
                for (var obj of ListadoEstudiantes.data) {
                    var numeroPeriodoActual = obtenerNumeroDesdeParametro(obj.per_carrera);
                    var periodoMatricula = Number(numeroPeriodoActual) + 1;
                    var periodoMatriculaString = obtenerParametroDesdeNumero(Number(periodoMatricula));
                    var ObjEstudianteMatriculado = await procesoCupo.EncontrarEstudianteMatriculado(transaction,obj.carrera, periodoMatriculaString, obj.identificacion);
                    if (ObjEstudianteMatriculado.count > 0) {
                        var dataDetalle = {
                            cup_id: obj.cup_id,
                            estcup_id: VariablesGlobales.ESTADOACTIVO,
                            per_carrera: obj.per_carrera,
                            dcupfechacreacion:tools.FechaActualCupo(),
                            dcupobservacion: "MATRICULACION NIVELACION PROCESO MIGRACION REIGRESO"
                        }

                        var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo(transaction,"OAS_Master", dataDetalle);
                    }
                }
            }
            console.log("***********PROCESO ACTIVAR CUPO POR RETIRO PARCIAL**********")
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
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transaction = await iniciarMasterTransaccion(pool);
    await transaction.begin();
    try {
            var ListadoEstudiantes = [];
            var ListadoCarrera = await procesoCupo.ListadoCarreraNivelacion(transaction,"OAS_Master","UNA");
            for (var carrera of ListadoCarrera.data) {
                // if (carrera.strBaseDatos == 'OAS_NivArtes') {
                var ListadosMatriculas = await procesoCupo.MatriculasCarrerasPeriodo(transaction,carrera.strBaseDatos, periodo);
                for (var matricula of ListadosMatriculas.data) {
                    var DatosAsignaturas = await procesoCupo.AsignaturasMatriculadaEstudiante(transaction,carrera.strBaseDatos, periodo, matricula.strCedula);
                    var verificarperdida = false;
                    if (DatosAsignaturas.count > 0) {
                        for (var asignatura of DatosAsignaturas.data) {
                            if (Number(asignatura.bytNumMat) >= VariablesGlobales.REPETICIONESaSIGNATURAS) {
                                var DatosExamenes = await procesoCupo.NotasExamenesEstudianteDadoMateria(transaction,carrera.strBaseDatos, periodo, matricula.sintCodigo, asignatura.strCodMateria);

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
                                    estcup_id: VariablesGlobales.ESTADOIMPEDIMENTOACADEMICO,
                                    per_carrera: periodo,
                                    dcupfechacreacion: tools.FechaActualCupo(),
                                    dcupobservacion: "IMPEDIMENTO ACADEMICO PROCESO MIEGRACION // PERDIDA SEGUNDA MATRICULA NIVELACION"
                                }
                                var IngresoDatos = await procesoCupo.InsertarCupoConfirmadoTrasnsaccionGeneral(transaction,"OAS_Master", dataCupo, dataDetalle, periodo);
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
async function ProcesoMatriculadosDefinitivasPeriodosssNivelacion(periodo) {
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transaction = await iniciarMasterTransaccion(pool);
    await transaction.begin();
    try {
            var ListadoEstudiantes = [];
         //var ListadoCarrera = await procesoCupo.ListadoCarreraTodas(transaction,"OAS_Master");
            var ListadoCarrera = await procesoCupo.ListadoCarreraNivelacion(transaction,"OAS_Master","UNA");
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

async function ProcesoAprobacionNivelacionPasoCarrera(periodo, nivel) {
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transaction = await iniciarMasterTransaccion(pool);
    await transaction.begin();
    try {
        console.log("***********PROCESO APROBACION NIVELACION A CARRERA**********")
            var ListadoEstudiantes = [];

            var ListadoCarrera = await procesoCupo.ListadoCarreraNivelacion(transaction,"OAS_Master","UNA");
            for (var carrera of ListadoCarrera.data) {
                 if (carrera.strBaseDatos == 'OAS_NivTics') {
                var ListadoAsignaturasCurso = await procesoCupo.ObenterDictadoMateriasNivel(transaction,carrera.strBaseDatos, periodo, nivel);
                console.log(ListadoAsignaturasCurso.data)
                if (ListadoAsignaturasCurso.data.length > 0) {
                var ListadosMatriculas = await procesoCupo.MatriculasCarrerasPeriodo(transaction,carrera.strBaseDatos, periodo);
                console.log("Total matriculados : "+ListadosMatriculas.count)
                for (var matricula of ListadosMatriculas.data) {
                    var contador=0;
                    var ListadosAsignaturasAprobadas = await procesoCupo.AsignaturasAprobadaEstudiante(transaction,carrera.strBaseDatos, matricula.strCodEstud);
                    console.log("Total materias Aprobadas : "+ListadosAsignaturasAprobadas.count)
                    for (var materiasCurso of ListadoAsignaturasCurso.data) {
                        for (var materiasaprobadas of ListadosAsignaturasAprobadas.data) {
                       if(materiasCurso.strCodMateria==materiasaprobadas.strCodMateria){
                        contador=contador+1;
                       }
                        }
                    }

                    if(contador==ListadoAsignaturasCurso.count){
                        var ObtenerRegistroAProbacionNivelacion = await procesoCupo.ObtenerDetalleCupoDadoEstadoCupo(transaction,carrera.strBaseDatos,VariablesGlobales.ESTADONIVELACIONAPROBACION,matricula.strCedula);
                       if(ObtenerRegistroAProbacionNivelacion.count>0){
                            console.log("YA EXITE REGISTRO DE APROBACION")
                       }else{
                        console.log("NO EXITE REGISTRO DE APROBACION")
                        var dataDetalle = {
                            cup_id: ObtenerRegistroAProbacionNivelacion.data[0].cup_id,
                            estcup_id: VariablesGlobales.ESTADONIVELACIONAPROBACION,
                            per_carrera: periodo,
                            dcupfechacreacion: tools.FechaActualCupo(),
                            dcupobservacion: "APROBACION NIVELACION  PROCESO MIGRACION // PASO CARRERA"
                        }
                        var InsertarDetalleCupo = await procesoCupo.InsertarDetalleCupo(transaction,"OAS_Master", dataDetalle);

                       }
                       
                       
                        console.log(carrera.strBaseDatos)
                        console.log("APRUEBA NIEVALCION " +matricula.strCodEstud)
                    }else{
                        console.log(carrera.strBaseDatos)
                        console.log(" NO APRUEBA NIEVALCION " +matricula.strCodEstud)
                    }
                    
                }

            }
            }
            }
        
            
            console.log("***********PROCESO APROBACION NIVELACION A CARRERA**********")
            return null;
      
        } catch (err) {
            await transaction.rollback();
            console.error(err);
            return 'ERROR';
        } finally {
            await transaction.commit();
            await pool.close();
        }
}
