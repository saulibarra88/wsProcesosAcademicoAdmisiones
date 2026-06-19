const modeloprocesocarreras = require('../modelo/sqlaltatransacionalidad');
const sqlprocesocarreras = require('../modelo/procesocarrera');
const axios = require('axios');
const reportescarreras = require('../rutas/reportesCarreras');
const sqlprocesoCupo = require('../modelo/procesocupos');

const tools = require('./tools');
const fs = require("fs");
const https = require('https');
const crypto = require("crypto");
const pLimit = require('p-limit');
const limit = pLimit(10);
const modeloreporteexcelcarrera = require('../procesos/reportesexcelcarreras');
const modelocentralizada = require('../modelo/centralizada');
const { iniciarMasterTransaccion, iniciarMasterPool } = require("./../config/execSQLMaster.helper");
const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.ProcesoReporteExcelMatriculasCarrerasIndividual = async function (carrera, periodo, estado) {
    try {
        var resultado = await FuncionReporteExcelMatriculasCarrerasIndividualInstitucional(carrera, periodo, estado);

        return resultado
    } catch (err) {
        console.error(err);
        
        return 'ERROR';
    }
}
module.exports.ProcesoReporteExcelMatriculasCarrerasTodasInstitucionales = async function (periodo, estado) {
    try {

        var resultado = await FuncionReporteExcelMatriculasCarrerasTodasInstitucionalTransaccion(periodo, estado);
        return { resultado }

    } catch (error) {
        console.error(error);
        
        return { blProceso: false, mensaje: "Error :" + error }

    }
}
module.exports.ProcesoReporteExcelMatriculasNivelacionInstitucional = async function (periodo, estado) {
    try {
        var resultado = await FuncionReporteExcelMatriculasNivelacionTodasInstitucionalTransaccion(periodo, estado);
        return { resultado }

    } catch (error) {
        console.error(error);
        
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

module.exports.ProcesoFotoMatriculasNivelacionInstitucional = async function (periodo) {
    try {
        var resultado = await FuncionFotoMatriculasNivelacionTodasInstitucionalTransaccion(periodo);
        return { resultado }

    } catch (error) {
        console.error(error);
        
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

module.exports.ProcesoFinancieroDatos = async function () {
    try {
        var resultado = await FuncionFinancieroDatos();
        return { resultado }

    } catch (error) {
        console.error(error);
        
        return { blProceso: false, mensaje: "Error :" + error }

    }
}
module.exports.ProcesoReporteExcelMatriculasAdmisionesnstitucional = async function (periodo) {
    try {
        var resultado = await FuncionReporteExcelMatriculasAdmisionesInstitucinalTransaccion(periodo);
        return { resultado }

    } catch (error) {
        console.error(error);
        
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

module.exports.ListadoEstudiantesPeriodosCarrera = async function (carrera, periodo) {
    try {
        var Datos = await FuncionListadoEstudiantePeriodos(carrera, periodo);
        return { Datos }
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ProcesoInformacionUsuario = async function () {
    try {
        var resultado = await FuncionuUsuariosDatos();
        return { resultado }

    } catch (error) {
        console.error(error);
        
        return { blProceso: false, mensaje: "Error :" + error }

    }
}
async function FuncionReporteExcelMatriculasCarrerasIndividualInstitucional(carrera, periodo, estado) {
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transactionGlobal = await iniciarMasterTransaccion(pool);
    await transactionGlobal.begin();
    const limitHTTP = pLimit(2);
    const limitProcess = pLimit(10);
    try {
        var listadoNomina = [];
        var datosMatriculas = await modeloprocesocarreras.ListadoMatriculasCarrerasPeriodosTransaccion(transactionGlobal, carrera, periodo, estado);
        var DatosCarreras = await modeloprocesocarreras.ObtenerDatosBaseTransaccion(transactionGlobal, "OAS_Master", carrera);
        
        await Promise.all(datosMatriculas.data.map(matricula => limitProcess(async () => {
            const transaction = await iniciarMasterTransaccion(pool);
            await transaction.begin();
            try {
                const cedulaSinGuion = tools.CedulaSinGuion(matricula.strCedula);
                var personaResponse = await limitHTTP(() => axios.get(`https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/${cedulaSinGuion}`, { httpsAgent: agent }));
                var pago = await modeloprocesocarreras.ObtenerPagoMatriculaEstudianteTransaccion(transaction, "pagosonline_db", periodo, cedulaSinGuion)
                var asignaturas = await modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidadTransaccion(transaction, carrera, periodo, matricula.sintCodigo)
                var regulares = await modeloprocesocarreras.CalculoEstudiantesRegulares60PorCientoTransaccion(transaction, carrera, periodo, matricula.sintCodigo)
                var aprobacion = await tools.VerificacionPeriodoTresCalificaciones(periodo) ? await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudianteTransaccion(transaction, carrera, periodo, matricula.sintCodigo) : await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudianteTransaccion(transaction, carrera, periodo, matricula.sintCodigo)
                const persona = personaResponse?.data?.success ? personaResponse.data.listado[0] : null;
                const safe = (val, def = 'NINGUNO') => (val == null || val === '') ? def : val;
                // Datos personales
                matricula.per_nombres = safe(persona?.per_nombres, matricula.strNombres);
                matricula.per_primerApellido = safe(`${persona?.per_primerApellido || ''} ${persona?.per_segundoApellido || ''}`, matricula.strApellidos);
                matricula.procedencia = safe(persona?.procedencia);
                matricula.nac_nombre = safe(persona?.nac_nombre);
                matricula.per_email = safe(persona?.per_email);
                matricula.per_emailAlternativo = safe(persona?.per_emailAlternativo);
                matricula.per_telefonoCelular = safe(persona?.per_telefonoCelular);
                matricula.per_telefonoCasa = safe(persona?.per_telefonoCasa);
                matricula.per_fechaNacimiento = persona?.per_fechaNacimiento ? tools.formatearFechaNacimiento(persona.per_fechaNacimiento) : 'NINGUNO';
                matricula.eci_nombre = safe(persona?.eci_nombre);
                matricula.etn_nombre = safe(persona?.etn_nombre);
                matricula.gen_nombre = safe(persona?.gen_nombre);
                matricula.prq_nombre = safe(persona?.prq_nombre);
                matricula.dir_callePrincipal = safe(persona?.dir_callePrincipal);
                matricula.sexo = safe(persona?.sexo);
                const [provincia, canton, parroquia] = (persona?.procedencia || 'NINGUNO/NINGUNO/NINGUNO').split('/');
                matricula.provincia = provincia || 'NINGUNO';
                matricula.canton = canton || 'NINGUNO';
                matricula.parroquia = parroquia || 'NINGUNO';
                // Datos carrera
                matricula.sede = DatosCarreras.data[0]?.strSede || 'NINGUNO';
                matricula.facultad = DatosCarreras.data[0]?.strNombreFacultad || 'NINGUNO';
                matricula.carrera = DatosCarreras.data[0]?.strNombreCarrera || 'NINGUNO';
                // Asignaturas y aprobación
                if (asignaturas.count) {
                    const data = asignaturas.data[0];
                    matricula.primera = data.Primera > 0 ? 'SI' : 'NO';
                    matricula.segunda = data.Segunda > 0 ? 'SI' : 'NO';
                    matricula.tercera = data.Tercera > 0 ? 'SI' : 'NO';
                    matricula.cantidadprimera = data.Primera;
                    matricula.cantidadsegunda = data.Segunda;
                    matricula.cantidadtercera = data.Tercera;
                    matricula.repetidor = data.Tercera > 0 || data.Segunda > 0 ? 'SI' : 'NO';
                }
                if (regulares.count > 0) {
                    matricula.regular = regulares.data[0].Estudiante;
                }
                if (pago.count > 0) {
                    matricula.gratuidad = 'NO';
                    matricula.valorpago = pago.data[0].fltTotal;
                } else {
                    matricula.gratuidad = 'SI';
                    matricula.valorpago = 0;
                }
                matricula.aprobacion = aprobacion.data[0]?.Reprueba == 0 ? 'APROBADO' : 'REPROBADO';
                listadoNomina.push(matricula);
                
                await transaction.commit();
            } catch (err) {
                console.error(err);
                await transaction.rollback();
                
            }
        })));

        await transactionGlobal.commit();
        var base64 = await reportescarreras.ExcelReporteMaticulasCarrerasIndividual(carrera, periodo, listadoNomina);
        return base64
    }
    catch (err) {
        console.error(err);
        if(transactionGlobal) await transactionGlobal.rollback();
        
        return 'ERROR' + err;
    } finally {
        await pool.close();
    }
}
async function FuncionReporteExcelMatriculasCarrerasTodasInstitucionalTransaccion(periodo, estado) {
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transactionGlobal = await iniciarMasterTransaccion(pool);
    await transactionGlobal.begin();
    try {
        const listadoNomina = [];
        const ListadoCarrera = await modeloprocesocarreras.ListadoHomologacionesCarreraPeriodoTransacciones(transactionGlobal, "OAS_Master", periodo);
        const limitHTTP = pLimit(2);
        const limitProcess = pLimit(10);

        for (var carrera of ListadoCarrera.data) {

            var datosMatriculas = await modeloprocesocarreras.ListadoMatriculasCarrerasPeriodosTransaccion(transactionGlobal, carrera.hmbdbasecar, periodo, estado);
            var DatosCarreras = await modeloprocesocarreras.ObtenerDatosBaseTransaccion(transactionGlobal, "OAS_Master", carrera.hmbdbasecar);
            
            await Promise.all(datosMatriculas.data.map(matricula => limitProcess(async () => {
                const transaction = await iniciarMasterTransaccion(pool);
                await transaction.begin();
                try {
                    const cedulaSinGuion = tools.CedulaSinGuion(matricula.strCedula);
                    var personaResponse = await limitHTTP(() => axios.get(`https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/${cedulaSinGuion}`, { httpsAgent: agent }));
                    var pago = await modeloprocesocarreras.ObtenerPagoMatriculaEstudianteTransaccion(transaction, "pagosonline_db", periodo, cedulaSinGuion)
                    var asignaturas = await modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidadTransaccion(transaction, carrera.hmbdbasecar, periodo, matricula.sintCodigo)
                    var regulares = await modeloprocesocarreras.CalculoEstudiantesRegulares60PorCientoTransaccion(transaction, carrera.hmbdbasecar, periodo, matricula.sintCodigo)
                    var aprobacion = await tools.VerificacionPeriodoTresCalificaciones(periodo) ? await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudianteTransaccion(transaction, carrera.hmbdbasecar, periodo, matricula.sintCodigo) : await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudianteTransaccion(transaction, carrera.hmbdbasecar, periodo, matricula.sintCodigo)
                    const persona = personaResponse?.data?.success ? personaResponse.data.listado[0] : null;
                    const safe = (val, def = 'NINGUNO') => (val == null || val === '') ? def : val;


                    // Datos personales
                    matricula.per_nombres = safe(persona?.per_nombres, matricula.strNombres);
                    matricula.per_primerApellido = safe(`${persona?.per_primerApellido || ''} ${persona?.per_segundoApellido || ''}`, matricula.strApellidos);
                    matricula.procedencia = safe(persona?.procedencia);
                    matricula.nac_nombre = safe(persona?.nac_nombre);
                    matricula.per_email = safe(persona?.per_email);
                    matricula.per_emailAlternativo = safe(persona?.per_emailAlternativo);
                    matricula.per_telefonoCelular = safe(persona?.per_telefonoCelular);
                    matricula.per_telefonoCasa = safe(persona?.per_telefonoCasa);
                    matricula.per_fechaNacimiento = persona?.per_fechaNacimiento ? tools.formatearFechaNacimiento(persona.per_fechaNacimiento) : 'NINGUNO';
                    matricula.eci_nombre = safe(persona?.eci_nombre);
                    matricula.etn_nombre = safe(persona?.etn_nombre);
                    matricula.gen_nombre = safe(persona?.gen_nombre);
                    matricula.prq_nombre = safe(persona?.prq_nombre);
                    matricula.dir_callePrincipal = safe(persona?.dir_callePrincipal);
                    matricula.sexo = safe(persona?.sexo);
                    const [provincia, canton, parroquia] = (persona?.procedencia || 'NINGUNO/NINGUNO/NINGUNO').split('/');
                    matricula.provincia = provincia || 'NINGUNO';
                    matricula.canton = canton || 'NINGUNO';
                    matricula.parroquia = parroquia || 'NINGUNO';
                    // Datos carrera
                    matricula.sede = DatosCarreras.data[0]?.strSede || 'NINGUNO';
                    matricula.facultad = DatosCarreras.data[0]?.strNombreFacultad || 'NINGUNO';
                    matricula.carrera = DatosCarreras.data[0]?.strNombreCarrera || 'NINGUNO';
                    // Asignaturas y aprobación
                    if (asignaturas.count) {
                        const data = asignaturas.data[0];
                        matricula.primera = data.Primera > 0 ? 'SI' : 'NO';
                        matricula.segunda = data.Segunda > 0 ? 'SI' : 'NO';
                        matricula.tercera = data.Tercera > 0 ? 'SI' : 'NO';
                        matricula.cantidadprimera = data.Primera;
                        matricula.cantidadsegunda = data.Segunda;
                        matricula.cantidadtercera = data.Tercera;
                        matricula.repetidor = data.Tercera > 0 || data.Segunda > 0 ? 'SI' : 'NO';
                    }
                    if (regulares.count > 0) {
                        matricula.regular = regulares.data[0].Estudiante;
                    }
                    if (pago.count > 0) {
                        matricula.gratuidad = 'NO';
                        matricula.valorpago = pago.data[0].fltTotal;
                    } else {
                        matricula.gratuidad = 'SI';
                        matricula.valorpago = 0;
                    }
                    matricula.aprobacion = aprobacion.data[0]?.Reprueba == 0 ? 'APROBADO' : 'REPROBADO';
                    listadoNomina.push(matricula);

                    await transaction.commit();
                } catch (err) {
                    console.error(err);
                    await transaction.rollback();
                    
                }
            })));

        }
        await transactionGlobal.commit();
        const base64 = await reportescarreras.ExcelReporteMaticulasCarrerasInstitucional(periodo, listadoNomina);

        return base64;
    } catch (err) {
        console.error(err);
        if(transactionGlobal) await transactionGlobal.rollback();
        
        return 'ERROR' + err;
    } finally {
        await pool.close();
    }
}
async function FuncionReporteExcelMatriculasNivelacionTodasInstitucionalTransaccion(periodo, estado) {
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();
    const transactionGlobal = await iniciarMasterTransaccion(pool);
    await transactionGlobal.begin();
    try {
        if (tools.compararPeriodos(periodo, 'P0038')) {
            const listadoNomina = [];
            const ListadoCarrera = await modeloprocesocarreras.ListadoHomologacionesCarreraPeriodoTransacciones(transactionGlobal, "OAS_Master", periodo);
            const limitHTTP = pLimit(2);
            const limitProcess = pLimit(10);
            for (var carrera of ListadoCarrera.data) {
                var datosMatriculas = await modeloprocesocarreras.ListadoMatriculasCarrerasPeriodosTransaccion(transactionGlobal, carrera.hmbdbaseniv, periodo, estado);
                var DatosCarreras = await modeloprocesocarreras.ObtenerDatosBaseTransaccion(transactionGlobal, "OAS_Master", carrera.hmbdbaseniv);
                
                await Promise.all(datosMatriculas.data.map(matricula => limitProcess(async () => {
                    const transaction = await iniciarMasterTransaccion(pool);
                    await transaction.begin();
                    try {
                        const cedulaSinGuion = tools.CedulaSinGuion(matricula.strCedula);
                        var personaResponse = await limitHTTP(() => axios.get(`https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/${cedulaSinGuion}`, { httpsAgent: agent }));
                        var pago = await modeloprocesocarreras.ObtenerPagoMatriculaEstudianteTransaccion(transaction, "pagosonline_db", periodo, cedulaSinGuion)
                        var asignaturas = await modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidadTransaccion(transaction, carrera.hmbdbaseniv, periodo, matricula.sintCodigo)
                        var regulares = await modeloprocesocarreras.CalculoEstudiantesRegulares60PorCientoTransaccion(transaction, carrera.hmbdbaseniv, periodo, matricula.sintCodigo)
                        var aprobacion = await tools.VerificacionPeriodoTresCalificaciones(periodo) ? await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudianteTransaccion(transaction, carrera.hmbdbaseniv, periodo, matricula.sintCodigo) : await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudianteTransaccion(transaction, carrera.hmbdbaseniv, periodo, matricula.sintCodigo)
                        const persona = personaResponse?.data?.success ? personaResponse.data.listado[0] : null;
                        const safe = (val, def = 'NINGUNO') => (val == null || val === '') ? def : val;

                        // Datos personales
                        matricula.per_nombres = safe(persona?.per_nombres, matricula.strNombres);
                        matricula.per_primerApellido = safe(`${persona?.per_primerApellido || ''} ${persona?.per_segundoApellido || ''}`, matricula.strApellidos);
                        matricula.procedencia = safe(persona?.procedencia);
                        matricula.nac_nombre = safe(persona?.nac_nombre);
                        matricula.per_email = safe(persona?.per_email);
                        matricula.per_emailAlternativo = safe(persona?.per_emailAlternativo);
                        matricula.per_telefonoCelular = safe(persona?.per_telefonoCelular);
                        matricula.per_telefonoCasa = safe(persona?.per_telefonoCasa);
                        matricula.per_fechaNacimiento = persona?.per_fechaNacimiento ? tools.formatearFechaNacimiento(persona.per_fechaNacimiento) : 'NINGUNO';
                        matricula.eci_nombre = safe(persona?.eci_nombre);
                        matricula.etn_nombre = safe(persona?.etn_nombre);
                        matricula.gen_nombre = safe(persona?.gen_nombre);
                        matricula.prq_nombre = safe(persona?.prq_nombre);
                        matricula.dir_callePrincipal = safe(persona?.dir_callePrincipal);
                        matricula.sexo = safe(persona?.sexo);
                        const [provincia, canton, parroquia] = (persona?.procedencia || 'NINGUNO/NINGUNO/NINGUNO').split('/');
                        matricula.provincia = provincia || 'NINGUNO';
                        matricula.canton = canton || 'NINGUNO';
                        matricula.parroquia = parroquia || 'NINGUNO';
                        // Datos carrera
                        matricula.sede = DatosCarreras.data[0]?.strSede || 'NINGUNO';
                        matricula.facultad = DatosCarreras.data[0]?.strNombreFacultad || 'NINGUNO';
                        matricula.carrera = DatosCarreras.data[0]?.strNombreCarrera || 'NINGUNO';
                        // Asignaturas y aprobación
                        if (asignaturas.count) {
                            const data = asignaturas.data[0];
                            matricula.primera = data.Primera > 0 ? 'SI' : 'NO';
                            matricula.segunda = data.Segunda > 0 ? 'SI' : 'NO';
                            matricula.tercera = data.Tercera > 0 ? 'SI' : 'NO';
                            matricula.cantidadprimera = data.Primera;
                            matricula.cantidadsegunda = data.Segunda;
                            matricula.cantidadtercera = data.Tercera;
                            matricula.repetidor = data.Tercera > 0 || data.Segunda > 0 ? 'SI' : 'NO';
                        }
                        if (regulares.count > 0) {
                            matricula.regular = regulares.data[0].Estudiante;
                        }
                        if (pago.count > 0) {
                            matricula.gratuidad = 'NO';
                            matricula.valorpago = pago.data[0].fltTotal;
                        } else {
                            matricula.gratuidad = 'SI';
                            matricula.valorpago = 0;
                        }
                        matricula.aprobacion = aprobacion.data[0]?.Reprueba == 0 ? 'APROBADO' : 'REPROBADO';

                        listadoNomina.push(matricula);
                        await transaction.commit();
                    } catch (err) {
                        console.error(err);
                        await transaction.rollback();
                        
                    }
                })));
            }
            await transactionGlobal.commit();
            const base64 = await reportescarreras.ExcelReporteMaticulasNivelacionInstitucional(periodo, listadoNomina);
            return base64;
        } else {
            const listadoNomina = [];
            const ListadoCarrera = await modeloprocesocarreras.ListadoCarreraNivelacionMasterTransacciones(transactionGlobal, "OAS_Master", periodo);
            const limitHTTP = pLimit(2);
            const limitProcess = pLimit(10);
            for (var carrera of ListadoCarrera.data) {
                var datosMatriculas = await modeloprocesocarreras.ListadoMatriculasCarrerasPeriodosTransaccion(transactionGlobal, carrera.strBaseDatos, periodo, estado);
                var DatosCarreras = await modeloprocesocarreras.ObtenerDatosBaseTransaccion(transactionGlobal, "OAS_Master", carrera.strBaseDatos);
                
                await Promise.all(datosMatriculas.data.map(matricula => limitProcess(async () => {
                    const transaction = await iniciarMasterTransaccion(pool);
                    await transaction.begin();
                    try {
                        const cedulaSinGuion = tools.CedulaSinGuion(matricula.strCedula);
                        var personaResponse = await limitHTTP(() => axios.get(`https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/${cedulaSinGuion}`, { httpsAgent: agent }));
                        var pago = await modeloprocesocarreras.ObtenerPagoMatriculaEstudianteTransaccion(transaction, "pagosonline_db", periodo, cedulaSinGuion)
                        var asignaturas = await modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidadTransaccion(transaction, carrera.strBaseDatos, periodo, matricula.sintCodigo)
                        var regulares = await modeloprocesocarreras.CalculoEstudiantesRegulares60PorCientoTransaccion(transaction, carrera.strBaseDatos, periodo, matricula.sintCodigo)
                        var aprobacion = await tools.VerificacionPeriodoTresCalificaciones(periodo) ? await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudianteTransaccion(transaction, carrera.strBaseDatos, periodo, matricula.sintCodigo) : await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudianteTransaccion(transaction, carrera.strBaseDatos, periodo, matricula.sintCodigo)
                        const persona = personaResponse?.data?.success ? personaResponse.data.listado[0] : null;
                        const safe = (val, def = 'NINGUNO') => (val == null || val === '') ? def : val;

                        // Datos personales
                        matricula.per_nombres = safe(persona?.per_nombres, matricula.strNombres);
                        matricula.per_primerApellido = safe(`${persona?.per_primerApellido || ''} ${persona?.per_segundoApellido || ''}`, matricula.strApellidos);
                        matricula.procedencia = safe(persona?.procedencia);
                        matricula.nac_nombre = safe(persona?.nac_nombre);
                        matricula.per_email = safe(persona?.per_email);
                        matricula.per_emailAlternativo = safe(persona?.per_emailAlternativo);
                        matricula.per_telefonoCelular = safe(persona?.per_telefonoCelular);
                        matricula.per_telefonoCasa = safe(persona?.per_telefonoCasa);
                        matricula.per_fechaNacimiento = persona?.per_fechaNacimiento ? tools.formatearFechaNacimiento(persona.per_fechaNacimiento) : 'NINGUNO';
                        matricula.eci_nombre = safe(persona?.eci_nombre);
                        matricula.etn_nombre = safe(persona?.etn_nombre);
                        matricula.gen_nombre = safe(persona?.gen_nombre);
                        matricula.prq_nombre = safe(persona?.prq_nombre);
                        matricula.dir_callePrincipal = safe(persona?.dir_callePrincipal);
                        matricula.sexo = safe(persona?.sexo);
                        const [provincia, canton, parroquia] = (persona?.procedencia || 'NINGUNO/NINGUNO/NINGUNO').split('/');
                        matricula.provincia = provincia || 'NINGUNO';
                        matricula.canton = canton || 'NINGUNO';
                        matricula.parroquia = parroquia || 'NINGUNO';
                        // Datos carrera
                        matricula.sede = DatosCarreras.data[0]?.strSede || 'NINGUNO';
                        matricula.facultad = DatosCarreras.data[0]?.strNombreFacultad || 'NINGUNO';
                        matricula.carrera = DatosCarreras.data[0]?.strNombreCarrera || 'NINGUNO';
                        // Asignaturas y aprobación
                        if (asignaturas.count) {
                            const data = asignaturas.data[0];
                            matricula.primera = data.Primera > 0 ? 'SI' : 'NO';
                            matricula.segunda = data.Segunda > 0 ? 'SI' : 'NO';
                            matricula.tercera = data.Tercera > 0 ? 'SI' : 'NO';
                            matricula.cantidadprimera = data.Primera;
                            matricula.cantidadsegunda = data.Segunda;
                            matricula.cantidadtercera = data.Tercera;
                            matricula.repetidor = data.Tercera > 0 || data.Segunda > 0 ? 'SI' : 'NO';
                        }
                        if (regulares.count > 0) {
                            matricula.regular = regulares.data[0].Estudiante;
                        }
                        if (pago.count > 0) {
                            matricula.gratuidad = 'NO';
                            matricula.valorpago = pago.data[0].fltTotal;
                        } else {
                            matricula.gratuidad = 'SI';
                            matricula.valorpago = 0;
                        }
                        matricula.aprobacion = aprobacion.data[0]?.Reprueba == 0 ? 'APROBADO' : 'REPROBADO';

                        listadoNomina.push(matricula);
                        await transaction.commit();
                    } catch (err) {
                        console.error(err);
                        await transaction.rollback();
                        
                    }
                })));
            }
            await transactionGlobal.commit();
            const base64 = await reportescarreras.ExcelReporteMaticulasNivelacionInstitucional(periodo, listadoNomina);
            return base64;
        }

    } catch (err) {
        console.error(err);
        if(transactionGlobal) await transactionGlobal.rollback();
        
        return 'ERROR' + err;
    } finally {
        await pool.close();
    }
}
async function FuncionReporteExcelMatriculasAdmisionesInstitucinalTransaccion(periodo) {
    const pool = await iniciarMasterPool("OAS_Master");
    await pool.connect();

    try {
        var listadoNomina = [];
        const content1 = { perNomenclatura: periodo };
        var ListadoEstudiantes = await axios.post("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/asignacion_cupo/aceptados_periodo_cusofa", content1, { httpsAgent: agent });

        if (ListadoEstudiantes.data.length > 0) {
            const limitProcess = pLimit(10);
            const limitHTTP = pLimit(2); // Limita las peticiones a la API para evitar Error 429

            await Promise.all(ListadoEstudiantes.data.map(estudianteAdmision => limitProcess(async () => {
                const transaction = await iniciarMasterTransaccion(pool);
                await transaction.begin();

                try {
                    var DatosEstudianteCupo = await sqlprocesocarreras.EncontrarEstudiantesConfirmadoMatrizSenecytTransaccion(transaction, "OAS_Cupos_Institucionales", tools.CedulaConGuion(estudianteAdmision.AspirantePostulacion.Persona.perCedula), periodo);

                    if (DatosEstudianteCupo.count > 0) {
                        var estudiante = DatosEstudianteCupo.data[0];
                        var content = { "perNomenclatura": periodo, "cusId": estudiante.c_cus_id };
                        var DatosCarreraNivelacion = await limitHTTP(() => axios.post("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/cupo_carrera/periodo_cusid", content, { httpsAgent: agent }));

                        if (Object.keys(DatosCarreraNivelacion.data).length > 0) {
                            var DatosEstudiantes = await limitHTTP(() => axios.get("https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/" + tools.CedulaSinGuion(estudiante.c_identificacion), { httpsAgent: agent }));
                            var ObjEstudianteMatriculadoNivelacion = await sqlprocesocarreras.EncontrarEstudianteMatriculadoTransaccion(transaction, estudiante.c_dbnivelacion, estudiante.c_periodo, estudiante.c_identificacion);
                            var ObjEstudianteMatriculadoCarrera = await sqlprocesocarreras.EncontrarEstudianteMatriculadoTransaccion(transaction, estudiante.c_dbcarrera, estudiante.c_periodo, estudiante.c_identificacion);

                            if (ObjEstudianteMatriculadoCarrera.count > 0) {
                                var DatosCarreras = await sqlprocesoCupo.ObtenerDatosBaseTransaccion(transaction, 'OAS_Master', estudiante.c_dbcarrera);
                                var listadoRetiros = await modeloreporteexcelcarrera.ProcesoListadoRetirosEstudiantePeriodoTrnsaccion(transaction, estudiante.c_dbcarrera, periodo, estudiante.c_identificacion, ObjEstudianteMatriculadoCarrera.data[0].strCodEstud);
                                var PagoMatriculaestudiante = await sqlprocesocarreras.ObtenerPagoMatriculaEstudianteTransaccion(transaction, "pagosonline_db", periodo, tools.CedulaSinGuion(estudiante.c_identificacion));
                                var AsignaturasMatriculadas = await sqlprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidadTrasaccion(transaction, estudiante.c_dbcarrera, periodo, ObjEstudianteMatriculadoCarrera.data[0].sintCodigo);
                                var CalulosEstuidantesRegulares = await sqlprocesocarreras.CalculoEstudiantesRegulares60PorCientoTransaccion(transaction, estudiante.c_dbcarrera, periodo, ObjEstudianteMatriculadoCarrera.data[0].sintCodigo);

                                var strEstadoAprobacion = 'REPROBADO';
                                if (listadoRetiros.length == 0) {
                                    if (await tools.VerificacionPeriodoTresCalificaciones(periodo)) {
                                        var datosAprobacion = await sqlprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudianteTransaccion(transaction, estudiante.c_dbcarrera, periodo, ObjEstudianteMatriculadoCarrera.data[0].sintCodigo);
                                    } else {
                                        var datosAprobacion = await sqlprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudianteTransaccion(transaction, estudiante.c_dbcarrera, periodo, ObjEstudianteMatriculadoCarrera.data[0].sintCodigo);
                                    }
                                    estudiante.aprobacion = datosAprobacion.data[0].Reprueba == 0 ? 'APROBADO' : 'REPROBADO';
                                }
                                if (AsignaturasMatriculadas.count) {
                                    estudiante.primera = AsignaturasMatriculadas.data[0].Primera > 0 ? 'SI' : 'NO';
                                    estudiante.cantidadprimera = AsignaturasMatriculadas.data[0].Primera;
                                    estudiante.segunda = AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO';
                                    estudiante.cantidadsegunda = AsignaturasMatriculadas.data[0].Segunda;
                                    estudiante.repetidor = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO';
                                    estudiante.tercera = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : 'NO';
                                    estudiante.cantidadtercera = AsignaturasMatriculadas.data[0].Tercera;
                                }
                                if (CalulosEstuidantesRegulares.count > 0) {
                                    estudiante.regular = CalulosEstuidantesRegulares.data[0].Estudiante;
                                }
                                if (PagoMatriculaestudiante.count > 0) {
                                    estudiante.gratuidad = 'NO';
                                    estudiante.valorpago = PagoMatriculaestudiante.data[0].fltTotal;
                                } else {
                                    estudiante.gratuidad = 'SI';
                                    estudiante.valorpago = 0;
                                }

                                estudiante.dc_idcupo = estudiante.c_id,
                                    estudiante.dc_idestado = 2,
                                    estudiante.dc_periodo = estudiante.c_periodo,
                                    estudiante.dc_dbcarrera = estudiante.c_dbcarrera,
                                    estudiante.dc_dbnivelacion = estudiante.c_dbnivelacion,
                                    estudiante.dc_observacion = "PROCESO MIGRACION // MATRICULADO EN CARRERA//",
                                    estudiante.dc_matriculacion = "MATRICULADO",
                                    estudiante.dc_sede = DatosCarreras.data[0].strSede,
                                    estudiante.dc_institucion = 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO',
                                    estudiante.dc_provincia = DatosCarreras.data[0].strSede == 'MATRIZ' ? 'CHIMBORAZO' : DatosCarreras.data[0].strSede == 'MORONA' ? 'MORONA SANTIAGO' : 'ORELLANA',
                                    estudiante.dc_canton = DatosCarreras.data[0].strSede == 'MATRIZ' ? 'RIOBAMBA' : DatosCarreras.data[0].strSede == 'MORONA' ? 'MORONA' : 'ORELLANA',
                                    estudiante.dc_parroquia = "",
                                    estudiante.dc_per_id = 0,
                                    estudiante.dc_ofaid = DatosCarreraNivelacion.data.cupOfaId,
                                    estudiante.dc_modalidad = DatosCarreraNivelacion.data.Modalidad.modNombre,
                                    estudiante.dc_jornada = DatosCarreraNivelacion.data.Jornada.jorNombre,
                                    estudiante.dc_periodo_admision = DatosCarreraNivelacion.data.Periodo.perNombre,
                                    estudiante.dc_tipocupo = 'NIVELACION CARRERA',
                                    estudiante.dc_matricula = 'ORDINARIA',
                                    estudiante.dc_cupo_aceptado = DatosCarreraNivelacion.data.Periodo.perNombre,
                                    estudiante.dc_fecha_matricula = tools.ConvertirFechaMatricula(ObjEstudianteMatriculadoCarrera.data[0].dtFechaAutorizada),
                                    estudiante.dc_estado_matricula = 'PRIMERA MATRICULA',
                                    estudiante.dc_cupo_admision = estudiante.c_cupo_admision,
                                    estudiante.dc_cusid = estudiante.c_cus_id,
                                    estudiante.dc_carrera = DatosCarreraNivelacion.data.Carrera.carNombre,
                                    estudiante.dc_facultad = DatosCarreraNivelacion.data.Carrera.Facultad.facNombre,
                                    estudiante.dc_nombres = DatosEstudiantes.data.listado[0].per_nombres,
                                    estudiante.dc_apellidos = DatosEstudiantes.data.listado[0].per_primerApellido + ' ' + DatosEstudiantes.data.listado[0].per_segundoApellido,
                                    estudiante.dc_cedula = estudiante.c_identificacion,
                                    estudiante.dc_ies_id = 0,
                                    estudiante.dc_estado_fin_curso = listadoRetiros.length > 0 ? 'RETIRO PARCIAL VOLUNTARIO' : strEstadoAprobacion,
                                    estudiante.dc_reubicado_primer_nivel = 'SI',
                                    estudiante.dc_oficio_notificacion_retiro = 'NINGUNO',
                                    estudiante.dc_fecha_notificacion_retiro = 'NINGUNO',


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

                                listadoNomina.push(estudiante);
                            }

                            if (ObjEstudianteMatriculadoNivelacion.count > 0) {
                                var DatosCarreras = await sqlprocesoCupo.ObtenerDatosBaseTransaccion(transaction, 'OAS_Master', estudiante.c_dbnivelacion);
                                var listadoRetiros = await modeloreporteexcelcarrera.ProcesoListadoRetirosEstudiantePeriodoTrnsaccion(transaction, estudiante.c_dbnivelacion, periodo, estudiante.c_identificacion, ObjEstudianteMatriculadoNivelacion.data[0].strCodEstud);
                                var PagoMatriculaestudiante = await sqlprocesocarreras.ObtenerPagoMatriculaEstudianteTransaccion(transaction, "pagosonline_db", periodo, tools.CedulaSinGuion(estudiante.c_identificacion));
                                var AsignaturasMatriculadas = await sqlprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidadTrasaccion(transaction, estudiante.c_dbnivelacion, periodo, ObjEstudianteMatriculadoNivelacion.data[0].sintCodigo);
                                var CalulosEstuidantesRegulares = await sqlprocesocarreras.CalculoEstudiantesRegulares60PorCientoTransaccion(transaction, estudiante.c_dbnivelacion, periodo, ObjEstudianteMatriculadoNivelacion.data[0].sintCodigo);

                                var strEstadoAprobacion = 'REPROBADO';
                                if (listadoRetiros.length == 0) {
                                    if (await tools.VerificacionPeriodoTresCalificaciones(periodo)) {
                                        var datosAprobacion = await sqlprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudianteTransaccion(transaction, estudiante.c_dbnivelacion, periodo, ObjEstudianteMatriculadoNivelacion.data[0].sintCodigo);
                                    } else {
                                        var datosAprobacion = await sqlprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudianteTransaccion(transaction, estudiante.c_dbnivelacion, periodo, ObjEstudianteMatriculadoNivelacion.data[0].sintCodigo);
                                    }
                                    estudiante.aprobacion = datosAprobacion.data[0].Reprueba == 0 ? 'APROBADO' : 'REPROBADO';
                                }
                                if (AsignaturasMatriculadas.count) {
                                    estudiante.primera = AsignaturasMatriculadas.data[0].Primera > 0 ? 'SI' : 'NO';
                                    estudiante.cantidadprimera = AsignaturasMatriculadas.data[0].Primera;
                                    estudiante.segunda = AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO';
                                    estudiante.cantidadsegunda = AsignaturasMatriculadas.data[0].Segunda;
                                    estudiante.repetidor = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : AsignaturasMatriculadas.data[0].Segunda > 0 ? 'SI' : 'NO';
                                    estudiante.tercera = AsignaturasMatriculadas.data[0].Tercera > 0 ? 'SI' : 'NO';
                                    estudiante.cantidadtercera = AsignaturasMatriculadas.data[0].Tercera;
                                }
                                if (CalulosEstuidantesRegulares.count > 0) {
                                    estudiante.regular = CalulosEstuidantesRegulares.data[0].Estudiante;
                                }
                                if (PagoMatriculaestudiante.count > 0) {
                                    estudiante.gratuidad = 'NO';
                                    estudiante.valorpago = PagoMatriculaestudiante.data[0].fltTotal;
                                } else {
                                    estudiante.gratuidad = 'SI';
                                    estudiante.valorpago = 0;
                                }

                                estudiante.dc_idcupo = estudiante.c_id,
                                    estudiante.dc_idestado = 2,
                                    estudiante.dc_periodo = estudiante.c_periodo,
                                    estudiante.dc_dbcarrera = estudiante.c_dbcarrera,
                                    estudiante.dc_dbnivelacion = estudiante.c_dbnivelacion,
                                    estudiante.dc_observacion = "PROCESO MIGRACION // MATRICULADO EN CARRERA//",
                                    estudiante.dc_matriculacion = "MATRICULADO",
                                    estudiante.dc_sede = DatosCarreras.data[0].strSede,
                                    estudiante.dc_institucion = 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO',
                                    estudiante.dc_provincia = DatosCarreras.data[0].strSede == 'MATRIZ' ? 'CHIMBORAZO' : DatosCarreras.data[0].strSede == 'MORONA' ? 'MORONA SANTIAGO' : 'ORELLANA',
                                    estudiante.dc_canton = DatosCarreras.data[0].strSede == 'MATRIZ' ? 'RIOBAMBA' : DatosCarreras.data[0].strSede == 'MORONA' ? 'MORONA' : 'ORELLANA',
                                    estudiante.dc_parroquia = "",
                                    estudiante.dc_per_id = 0,
                                    estudiante.dc_ofaid = DatosCarreraNivelacion.data.cupOfaId,
                                    estudiante.dc_modalidad = DatosCarreraNivelacion.data.Modalidad.modNombre,
                                    estudiante.dc_jornada = DatosCarreraNivelacion.data.Jornada.jorNombre,
                                    estudiante.dc_periodo_admision = DatosCarreraNivelacion.data.Periodo.perNombre,
                                    estudiante.dc_tipocupo = 'NIVELACION CARRERA',
                                    estudiante.dc_matricula = 'ORDINARIA',
                                    estudiante.dc_cupo_aceptado = DatosCarreraNivelacion.data.Periodo.perNombre,
                                    estudiante.dc_fecha_matricula = tools.ConvertirFechaMatricula(ObjEstudianteMatriculadoNivelacion.data[0].dtFechaAutorizada),
                                    estudiante.dc_estado_matricula = 'PRIMERA MATRICULA',
                                    estudiante.dc_cupo_admision = estudiante.c_cupo_admision,
                                    estudiante.dc_cusid = estudiante.c_cus_id,
                                    estudiante.dc_carrera = DatosCarreraNivelacion.data.Carrera.carNombre,
                                    estudiante.dc_facultad = DatosCarreraNivelacion.data.Carrera.Facultad.facNombre,
                                    estudiante.dc_nombres = DatosEstudiantes.data.listado[0].per_nombres,
                                    estudiante.dc_apellidos = DatosEstudiantes.data.listado[0].per_primerApellido + ' ' + DatosEstudiantes.data.listado[0].per_segundoApellido,
                                    estudiante.dc_cedula = estudiante.c_identificacion,
                                    estudiante.dc_ies_id = 0,
                                    estudiante.dc_estado_fin_curso = listadoRetiros.length > 0 ? 'RETIRO PARCIAL VOLUNTARIO' : strEstadoAprobacion,
                                    estudiante.dc_reubicado_primer_nivel = 'SI',
                                    estudiante.dc_oficio_notificacion_retiro = 'NINGUNO',
                                    estudiante.dc_fecha_notificacion_retiro = 'NINGUNO',


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

                                listadoNomina.push(estudiante);
                            }

                            if (ObjEstudianteMatriculadoNivelacion.count == 0 && ObjEstudianteMatriculadoCarrera.count == 0) {
                                var DatosCarreras = await sqlprocesoCupo.ObtenerDatosBaseTransaccion(transaction, 'OAS_Master', estudiante.c_dbcarrera);
                                var DatosNivelacion = await sqlprocesoCupo.ObtenerDatosBaseTransaccion(transaction, 'OAS_Master', estudiante.c_dbnivelacion);

                                estudiante.dc_idcupo = estudiante.c_id,
                                    estudiante.dc_idestado = 2,
                                    estudiante.dc_periodo = estudiante.c_periodo,
                                    estudiante.dc_dbcarrera = estudiante.c_dbcarrera,
                                    estudiante.dc_dbnivelacion = estudiante.c_dbnivelacion,
                                    estudiante.dc_observacion = "PROCESO MIGRACION // MATRICULADO EN CARRERA//",
                                    estudiante.dc_matriculacion = "MATRICULADO",
                                    estudiante.dc_sede = DatosCarreras.data[0].strSede,
                                    estudiante.dc_institucion = 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO',
                                    estudiante.dc_provincia = DatosCarreras.data[0].strSede == 'MATRIZ' ? 'CHIMBORAZO' : DatosCarreras.data[0].strSede == 'MORONA' ? 'MORONA SANTIAGO' : 'ORELLANA',
                                    estudiante.dc_canton = DatosCarreras.data[0].strSede == 'MATRIZ' ? 'RIOBAMBA' : DatosCarreras.data[0].strSede == 'MORONA' ? 'MORONA' : 'ORELLANA',
                                    estudiante.dc_parroquia = "",
                                    estudiante.dc_per_id = 0,
                                    estudiante.dc_ofaid = 'NINGUNO',
                                    estudiante.dc_modalidad = 'NINGUNO',
                                    estudiante.dc_jornada = 'NINGUNO',
                                    estudiante.dc_periodo_admision ='NINGUNO',
                                    estudiante.dc_tipocupo = 'NIVELACION CARRERA',
                                    estudiante.dc_matricula = 'ORDINARIA',
                                    estudiante.dc_cupo_aceptado = 'NINGUNO',
                                    estudiante.dc_fecha_matricula = 'NINGUNO',
                                    estudiante.dc_estado_matricula = 'PRIMERA MATRICULA',
                                    estudiante.dc_cupo_admision = estudiante.c_cupo_admision,
                                    estudiante.dc_cusid = estudiante.c_cus_id,
                                    estudiante.dc_carrera = DatosCarreraNivelacion.data.Carrera.carNombre,
                                    estudiante.dc_facultad = DatosCarreraNivelacion.data.Carrera.Facultad.facNombre,
                                    estudiante.dc_nombres = DatosEstudiantes.data.listado[0].per_nombres,
                                    estudiante.dc_apellidos = DatosEstudiantes.data.listado[0].per_primerApellido + ' ' + DatosEstudiantes.data.listado[0].per_segundoApellido,
                                    estudiante.dc_cedula = estudiante.c_identificacion,
                                    estudiante.dc_ies_id = 0,
                                    estudiante.dc_estado_fin_curso = 'NINGUNO',
                                    estudiante.dc_reubicado_primer_nivel = 'SI',
                                    estudiante.dc_oficio_notificacion_retiro = 'NINGUNO',
                                    estudiante.dc_fecha_notificacion_retiro = 'NINGUNO',


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
                                estudiante.strCodEstud = 0
                                estudiante.descripcionestado = 'NO INGRESO A LA INSTITUCION'
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

                                estudiante.dc_observacion = "PROCESO MIGRACION // NO MATRICULADO//";
                                estudiante.dc_matriculacion = "NO MATRICULADO";
                                estudiante.dc_per_id = DatosEstudiantes.data.listado[0].per_id;
                                estudiante.dc_tipocupo = 'NINGUNA';
                                estudiante.dc_fecha_matricula = 'NINGUNA';
                                estudiante.dc_estado_matricula = 'NO INGRESO A LA INSTITUCION';
                                estudiante.dc_estado_fin_curso = 'REPROBADO';
                                estudiante.dc_reubicado_primer_nivel = 'NO';

                                listadoNomina.push(estudiante);
                            }
                        }
                    }
                    await transaction.commit();
                } catch (error) {
                    console.error(error);
                    await transaction.rollback();
                    
                }
            })));

            var base64 = await reportescarreras.ExcelReporteMaticulasAdmisionesInstitucional(periodo, listadoNomina);
            return base64;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        
        return 'ERROR';
    } finally {
        await pool.close();
    }
}

async function FuncionListadoEstudiantePeriodos(carrera, periodo) {
    const limitSQL = pLimit(10);
    const listadoResultado = [];
console.log('Proceso')
    try {
        const matriculaEstudiantesCarrera = await modeloprocesocarreras.ListadoEstudiantePeriodoMatricula(carrera, periodo, 'DEF');
        const DatosPeriodo = await modeloprocesocarreras.PeriodoDatosCarrera(carrera, periodo);
        await Promise.all(matriculaEstudiantesCarrera.data.map(async (matricula, i) => {
            const AsignaturasMatricula = await limitSQL(() => modeloprocesocarreras.ListadoAsignaturasEstudiante(carrera, matricula.strCodPeriodo, matricula.sintCodigo));
            if (AsignaturasMatricula.count === 0) return;
            const asignaturasValidas = await Promise.all(AsignaturasMatricula.data.map(async (asignatura) =>
                await limitSQL(async () => {
                    const [DatosConvalidaciones, DatosRetiros, DatosSinAprobar] = await Promise.all([
                        modeloprocesocarreras.ObtenerConvalidacionesEstudiante(carrera, matricula.strCodPeriodo, matricula.sintCodigo, asignatura.strCodigo),
                        modeloprocesocarreras.ObtenerRetirosEstudiante(carrera, matricula.strCodPeriodo, matricula.sintCodigo, asignatura.strCodigo),
                        modeloprocesocarreras.ObtenerMateriaNoAprobarEstudiante(carrera, asignatura.strCodigo, Number(matricula.strCodEstud)),
                    ]);
                    if (DatosConvalidaciones.count > 0 || DatosRetiros.count > 0 || DatosSinAprobar.count > 0) {
                        return null;
                    }
                    const datosNotas = await modeloprocesocarreras.ObtenerNotaPacialAsignatura(carrera, matricula.sintCodigo, matricula.strCodPeriodo, asignatura.strCodigo);

                    asignatura.cantidadNota = datosNotas.count;

                    if (datosNotas.count > 0) {
                        const calificaciones = await Promise.all(
                            datosNotas.data.map(async (nota) => {
                                const EquivalenciaDatos = await modeloprocesocarreras.ObtenerParametroCalificacionPorCodEquivalencia("SistemaAcademico", nota.strCodEquiv, DatosPeriodo.data[0].idreglamento);
                                const valor1 = nota.dcParcial1 || 0;
                                const valor2 = nota.dcParcial2 || 0;
                                return {
                                    ...nota,
                                    promedio: await tools.PromedioCalcular(valor1, valor2),
                                    Equivalencia: EquivalenciaDatos.data[0],
                                };
                            })
                        );
                        asignatura.Calificacion = calificaciones;
                    } else {
                        asignatura.Calificacion = null;
                    }

                    return asignatura;
                })
            )
            );

            const asignaturasFinales = asignaturasValidas.filter((a) => a !== null);
            if (asignaturasFinales.length > 0) {
                matricula.selectColor = false;
                matricula.contar = i + 1;
                matricula.Asignaturas = asignaturasFinales;
                listadoResultado.push(matricula);
            }
        })
        );

        return listadoResultado;
    } catch (err) {
        console.error(err);
        
        return 'ERROR';
    }
}

async function FuncionEstudiantesRetirosPeriodoCarreraCedula(dbCarrera, periodo, cedula, codigo) {
    try {
        var lstResultado = []
        var ListadoRetirosTipos = await modeloprocesocarreras.TiposRetirosEstudiantesCarrerasListado(dbCarrera, periodo, cedula);
        var ListadoRetirosNormales = await modeloprocesocarreras.RetirosEstudiantesNormalesCarrerasListado(dbCarrera, periodo, cedula);
        var ListadoRetirosSinMatriculas = await modeloprocesocarreras.ObternerDatosRetirosinMatricula(dbCarrera, periodo, codigo);
        if (ListadoRetirosTipos.count > 0) {
            for (var retiros of ListadoRetirosTipos.data) {
                var datos = {
                    sintCodMatricula: retiros.sintCodigo[0],
                    strCodPeriodo: retiros.strCodPeriodo[0],
                    strPeriodoDescripcion: '',
                    dtFechaAprob: retiros.dtFechaAprob,
                    dtFechaAsentado: retiros.dtFechaAsentado,
                    strdescripcion: retiros.strdescripcion,
                    strnombreTipo: retiros.strnombre,
                    strurl: retiros.strUrl,
                    strCedula: retiros.strCedula,
                    strNombres: retiros.strNombres,
                    strApellidos: retiros.strApellidos,
                    strNivel: retiros.strCodNivel,
                    strtipo: "RETIROS TIPOS"
                }

                lstResultado.push(datos);
            }
        }
        if (ListadoRetirosNormales.count > 0) {
            for (var retirosnormales of ListadoRetirosNormales.data) {
                var datosNormales = {
                    sintCodMatricula: retirosnormales.sintCodMatricula,
                    strCodPeriodo: retirosnormales.strCodPeriodo,
                    strPeriodoDescripcion: retirosnormales.strDescripcion,
                    dtFechaAprob: retirosnormales.dtFechaAprob,
                    dtFechaAsentado: retirosnormales.dtFechaAsentado,
                    strdescripcion: retirosnormales.strResolucion,
                    strnombreTipo: "",
                    strurl: "",
                    strCedula: retirosnormales.strCedula,
                    strNombres: retirosnormales.strNombres,
                    strApellidos: retirosnormales.strApellidos,
                    strNivel: retirosnormales.strCodNivel,
                    strtipo: "RETIROS ASIGNATURAS"
                }
                lstResultado.push(datosNormales);
            }
        }
        if (ListadoRetirosSinMatriculas.count > 0) {
            for (var retirossinmatricula of ListadoRetirosSinMatriculas.data) {

                var datosSinMatricula = {
                    sintCodMatricula: 0,
                    strCodPeriodo: retirossinmatricula.rsm_strCodPeriodo,
                    strPeriodoDescripcion: retirossinmatricula.strDescripcion,
                    dtFechaAprob: retirossinmatricula.rsm_dtFechaAprob,
                    dtFechaAsentado: retirossinmatricula.rsm_fecha_registro,
                    strdescripcion: retirossinmatricula.rsm_strObservacion,
                    strnombreTipo: "",
                    strurl: retirossinmatricula.rsm_strRuta,
                    strCedula: retirossinmatricula.strCedula,
                    strNombres: retirossinmatricula.strNombres,
                    strApellidos: retirossinmatricula.strApellidos,
                    strNivel: 'NIGUNO',
                    strtipo: "RETIRO SIN MATRICULA"
                }
                lstResultado.push(datosSinMatricula);
            }
        }


        return lstResultado
    } catch (error) {
        console.error(error);
        
    }

}


async function FuncionFotoMatriculasNivelacionTodasInstitucionalTransaccion(periodo) {
    try {
        const listadoNomina = [];
        const ListadoCarrera = await modeloprocesocarreras.ListadoHomologacionesCarreraPeriodo("OAS_Master", periodo);
        const limitHTTP = pLimit(10); // Limita a 10 peticiones simultáneas
        const limitSQL = pLimit(10);
        await Promise.all(ListadoCarrera.data.map(async (carrera, i) => {

            const [datosMatriculas, DatosCarreras] = await Promise.all([
                modeloprocesocarreras.ListadoMatriculasCarrerasPeriodos(carrera.hmbdbasecar, periodo, 'DEF'),
                modeloprocesocarreras.ObtenerDatosBase("OAS_Master", carrera.hmbdbasecar)
            ]);

            if (datosMatriculas.count === 0) return;
            await Promise.all(datosMatriculas.data.map((matricula, j) =>
                limitSQL(async () => {
                    const cedulaSinGuion = tools.CedulaSinGuion(matricula.strCedula);
                    const personaFoto = limitHTTP(() => axios.get(`https://apigestioncupos.espoch.edu.ec/wsservicioscupos/procesosdinardap/ObtenerFotoPersona/${cedulaSinGuion}`, { httpsAgent: agent }));
                })
            ));

        }));
        return 'OK';
    } catch (err) {
        console.error(err);
        
        return 'ERROR' + err;
    } 
}

async function FuncionFinancieroDatos() {
    try {
        const listadoNomina = [];
        const ListadoCarrera = await modelocentralizada.ListadoFinanciero();
        const limitHTTP = pLimit(10); // Limita a 10 peticiones simultáneas
        const limitSQL = pLimit(10);
        await Promise.all(ListadoCarrera.data.map(async (info, i) => {

            const personaPromise = limitHTTP(() => axios.get(`https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/${info.stridentificacioncomprador}`, { httpsAgent: agent }));
            const [personaResponse] = await Promise.all([personaPromise.catch(() => null),]);

            const persona = personaResponse?.data?.success ? personaResponse.data.listado[0] : null;
            const safe = (val, def = 'NINGUNO') => (val == null || val === '') ? def : val;
            info.per_emailAlternativo = safe(persona?.per_emailAlternativo);
            info.dir_callePrincipal = safe(persona?.dir_callePrincipal);
            info.per_email = safe(persona?.per_email);
            info.per_telefonoCelular = safe(persona?.per_telefonoCelular);

            listadoNomina.push(info);



        }));

        const base64 = await reportescarreras.ExcelReporteFinanciero(listadoNomina);

        return listadoNomina;
    } catch (err) {
        console.error(err);
        
        return 'ERROR' + err;
    } 
}

async function FuncionuUsuariosDatos() {
    try {
        const listadoNomina = [];
        const ListadoCarrera = await modelocentralizada.UsuariosOrdenesPagos();
        const limitHTTP = pLimit(10); // Limita a 10 peticiones simultáneas
        const limitSQL = pLimit(10);
        await Promise.all(ListadoCarrera.data.map(async (info, i) => {

            // const personaPromise = limitHTTP(() => axios.get(`https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/${info.usu_strCedula}`, { httpsAgent: agent }));
            const personaPromise = limitHTTP(() => axios.get(`https://centralizada2.espoch.edu.ec/rutaCentral/objetopersonalizadodadoid/${info.lngusr_id}`, { httpsAgent: agent }));
            const [personaResponse] = await Promise.all([personaPromise.catch(() => null),]);

            const persona = personaResponse?.data?.success ? personaResponse.data.listado[0] : null;
            const safe = (val, def = 'NINGUNO') => (val == null || val === '') ? def : val;
            info.cedula = safe(persona?.pid_valor);
            info.nombres = safe(persona?.per_nombres);
            info.apellidos = safe(persona?.per_primerApellido + " " + persona?.per_segundoApellido);
            info.correo = safe(persona?.per_email);
            info.rol = info.strnombre;
            info.sistema = 'SEGUIMIENTO GRADUADOS';


            listadoNomina.push(info);



        }));

        const base64 = await reportescarreras.ExcelReporteFinanciero(listadoNomina);

        return listadoNomina;
    } catch (err) {
        console.error(err);
        
        return 'ERROR' + err;
    } 
}