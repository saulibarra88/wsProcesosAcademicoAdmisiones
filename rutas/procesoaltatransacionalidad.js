const modeloprocesocarreras = require('../modelo/sqlaltatransacionalidad');
const axios = require('axios');
const reportescarreras = require('../rutas/reportesCarreras');
const tools = require('./tools');
const fs = require("fs");
const https = require('https');
const crypto = require("crypto");
const pLimit = require('p-limit');
const limit = pLimit(10);
const { closeAllPools } = require('./../config/dbPoolManager');
const modeloreporteexcelcarrera = require('../procesos/reportesexcelcarreras');
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
        console.log(err);
        return 'ERROR';
    }
}
module.exports.ProcesoReporteExcelMatriculasCarrerasTodasInstitucionales = async function (periodo, estado) {
    try {

        var resultado = await FuncionReporteExcelMatriculasCarrerasTodasInstitucionalTransaccion(periodo, estado);
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}
module.exports.ProcesoReporteExcelMatriculasNivelacionInstitucional = async function (periodo, estado) {
    try {
        var resultado = await FuncionReporteExcelMatriculasNivelacionTodasInstitucionalTransaccion(periodo, estado);
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}
module.exports.ProcesoReporteExcelMatriculasAdmisionesnstitucional = async function (periodo) {
    try {
        var resultado = await FuncionReporteExcelMatriculasAdmisionesInstitucinalTransaccion(periodo);
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

module.exports.ListadoEstudiantesPeriodosCarrera = async function (carrera, periodo) {
    try {
        var Datos = await FuncionListadoEstudiantePeriodos(carrera, periodo);
        return { Datos }
    } catch (error) {
        console.log(error);
    }
}
async function FuncionReporteExcelMatriculasCarrerasIndividualInstitucional(carrera, periodo, estado) {
    const limitHTTP = pLimit(10);
    const limitSQL = pLimit(10);
    try {
        var listadoNomina = [];

        var datosMatriculas = await modeloprocesocarreras.ListadoMatriculasCarrerasPeriodos(carrera, periodo, estado);
        var DatosCarreras = await modeloprocesocarreras.ObtenerDatosBase("OAS_Master", carrera);
        await Promise.all(datosMatriculas.data.map(async (matricula, i) => {

            console.log(`Carrera ${carrera}  , Matricula ${matricula.strCedula} #${i + 1}`);
            const cedulaSinGuion = tools.CedulaSinGuion(matricula.strCedula);
            const personaPromise = limitHTTP(() => axios.get(`https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/${cedulaSinGuion}`, { httpsAgent: agent }));
            const [personaResponse, pago, asignaturas, regulares, aprobacion] = await Promise.all([
                personaPromise.catch(() => null),
                modeloprocesocarreras.ObtenerPagoMatriculaEstudiante("pagosonline_db", periodo, cedulaSinGuion),
                modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidad(carrera, periodo, matricula.sintCodigo),
                modeloprocesocarreras.CalculoEstudiantesRegulares60PorCiento(carrera, periodo, matricula.sintCodigo),
                await tools.VerificacionPeriodoTresCalificaciones(periodo) ? modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudiante(carrera, periodo, matricula.sintCodigo) : modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudiante(carrera, periodo, matricula.sintCodigo)
            ]);
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



        }));



        var base64 = await reportescarreras.ExcelReporteMaticulasCarrerasIndividual(carrera, periodo, listadoNomina);

        return base64
    }
    catch (err) {

        console.error(err);
        return 'ERROR' + err;
    } finally {
        await closeAllPools();
    }


}

async function FuncionReporteExcelMatriculasCarrerasTodasInstitucionalTransaccion(periodo, estado) {
    try {
        const listadoNomina = [];
        const ListadoCarrera = await modeloprocesocarreras.ListadoHomologacionesCarreraPeriodo("OAS_Master", periodo);
        const limitHTTP = pLimit(10); // Limita a 10 peticiones simultáneas
        const limitSQL = pLimit(10);
        await Promise.all(ListadoCarrera.data.map(async (carrera, i) => {

            const [datosMatriculas, DatosCarreras] = await Promise.all([
                modeloprocesocarreras.ListadoMatriculasCarrerasPeriodos(carrera.hmbdbasecar, periodo, estado),
                modeloprocesocarreras.ObtenerDatosBase("OAS_Master", carrera.hmbdbasecar)
            ]);

            if (datosMatriculas.count === 0) return;
            await Promise.all(datosMatriculas.data.map((matricula, j) =>
                limitSQL(async () => {
                    console.log(`Carrera ${carrera.hmbdbasecar} # ${i + 1} , Matricula ${matricula.strCedula} #${j + 1}`);
                    const cedulaSinGuion = tools.CedulaSinGuion(matricula.strCedula);
                    const personaPromise = limitHTTP(() => axios.get(`https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/${cedulaSinGuion}`, { httpsAgent: agent }));
                    const [personaResponse, pago, asignaturas, regulares, aprobacion] = await Promise.all([
                        personaPromise.catch(() => null),
                        modeloprocesocarreras.ObtenerPagoMatriculaEstudiante("pagosonline_db", periodo, cedulaSinGuion),
                        modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidad(carrera.hmbdbasecar, periodo, matricula.sintCodigo),
                        modeloprocesocarreras.CalculoEstudiantesRegulares60PorCiento(carrera.hmbdbasecar, periodo, matricula.sintCodigo),
                        await tools.VerificacionPeriodoTresCalificaciones(periodo) ? modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudiante(carrera.hmbdbasecar, periodo, matricula.sintCodigo) : modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudiante(carrera.hmbdbasecar, periodo, matricula.sintCodigo)
                    ]);
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
                })
            ));

        }));

        const base64 = await reportescarreras.ExcelReporteMaticulasCarrerasInstitucional(periodo, listadoNomina);

        return base64;
    } catch (err) {
        console.error(err);
        return 'ERROR' + err;
    } finally {
        await closeAllPools();
    }
}

async function FuncionReporteExcelMatriculasNivelacionTodasInstitucionalTransaccion(periodo, estado) {
    try {
        const listadoNomina = [];
        const ListadoCarrera = await modeloprocesocarreras.ListadoHomologacionesCarreraPeriodo("OAS_Master", periodo);
        const limitHTTP = pLimit(10); // Limita a 10 peticiones simultáneas
        const limitSQL = pLimit(10);
        await Promise.all(ListadoCarrera.data.map(async (carrera, i) => {

            const [datosMatriculas, DatosCarreras] = await Promise.all([
                modeloprocesocarreras.ListadoMatriculasCarrerasPeriodos(carrera.hmbdbaseniv, periodo, estado),
                modeloprocesocarreras.ObtenerDatosBase("OAS_Master", carrera.hmbdbaseniv)
            ]);

            if (datosMatriculas.count === 0) return;
            await Promise.all(datosMatriculas.data.map((matricula, j) =>
                limitSQL(async () => {
                    console.log(`Carrera ${carrera.hmbdbasecar} # ${i + 1} , Matricula ${matricula.strCedula} #${j + 1}`);
                    const cedulaSinGuion = tools.CedulaSinGuion(matricula.strCedula);
                    const personaPromise = limitHTTP(() => axios.get(`https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/${cedulaSinGuion}`, { httpsAgent: agent }));
                    const [personaResponse, pago, asignaturas, regulares, aprobacion] = await Promise.all([
                        personaPromise.catch(() => null),
                        modeloprocesocarreras.ObtenerPagoMatriculaEstudiante("pagosonline_db", periodo, cedulaSinGuion),
                        modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidad(carrera.hmbdbaseniv, periodo, matricula.sintCodigo),
                        modeloprocesocarreras.CalculoEstudiantesRegulares60PorCiento(carrera.hmbdbaseniv, periodo, matricula.sintCodigo),
                        await tools.VerificacionPeriodoTresCalificaciones(periodo) ? modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudiante(carrera.hmbdbaseniv, periodo, matricula.sintCodigo) : modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudiante(carrera.hmbdbasecar, periodo, matricula.sintCodigo)
                    ]);
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
                })
            ));

        }));

        const base64 = await reportescarreras.ExcelReporteMaticulasNivelacionInstitucional(periodo, listadoNomina);

        return base64;
    } catch (err) {
        console.error(err);
        return 'ERROR' + err;
    } finally {
        await closeAllPools();
    }
}


async function FuncionReporteExcelMatriculasAdmisionesInstitucinalTransaccion(periodo) {
    const limitHTTP = pLimit(10);
    const limitSQL = pLimit(10);
    try {
        const listadoNomina = [];
        const Lstestudiantes = await modeloprocesocarreras.ListadoEstudiantesConfirmadoMatrizSenecyt("OAS_Cupos_Institucionales", periodo);

        await Promise.all(Lstestudiantes.data.map(async (estudiante, i) => {

            console.log(` Matricula ${estudiante.c_identificacion} #${i + 1}`);
            const cedula = tools.CedulaSinGuion(estudiante.c_identificacion);
            const [DatosCarreraNivelacion, DatosEstudiantes] = await Promise.all([
                limitHTTP(() => axios.post("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/cupo_carrera/periodo_cusid", { perNomenclatura: periodo, cusId: estudiante.c_cus_id }, { httpsAgent: agent })),
                limitHTTP(() => axios.get(`https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/${cedula}`, { httpsAgent: agent })),

            ]);
          await   limitSQL(async () => {
                const [ObjMatriculadoNivelacion, ObjMatriculadoCarrera, DatosCarreraSQL] = await Promise.all([
                    modeloprocesocarreras.EncontrarEstudianteMatriculado(estudiante.c_dbnivelacion, estudiante.c_periodo, estudiante.c_identificacion),
                    modeloprocesocarreras.EncontrarEstudianteMatriculado(estudiante.c_dbcarrera, estudiante.c_periodo, estudiante.c_identificacion),
                    modeloprocesocarreras.ObtenerDatosBase("OAS_Master", estudiante.c_dbcarrera)
                ]);


                const datosEst = DatosEstudiantes.data.listado[0];
                const estudianteBase = {
                    ...estudiante,
                    dc_idcupo: estudiante.c_id,
                    dc_idestado: 2,
                    dc_periodo: estudiante.c_periodo,
                    dc_dbcarrera: estudiante.c_dbcarrera,
                    dc_dbnivelacion: estudiante.c_dbnivelacion,
                    dc_observacion: '',
                    dc_matriculacion: '',
                    dc_sede: '',
                    dc_institucion: 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO',
                    dc_provincia: '',
                    dc_canton: '',
                    dc_parroquia: '',
                    dc_per_id: datosEst.per_id || 0,
                    dc_ofaid: DatosCarreraNivelacion.data.cupOfaId,
                    dc_modalidad: DatosCarreraNivelacion.data.Modalidad.modNombre,
                    dc_jornada: DatosCarreraNivelacion.data.Jornada.jorNombre,
                    dc_periodo_admision: DatosCarreraNivelacion.data.Periodo.perNombre,
                    dc_tipocupo: '',
                    dc_matricula: 'ORDINARIA',
                    dc_cupo_aceptado: DatosCarreraNivelacion.data.Periodo.perNombre,
                    dc_fecha_matricula: '',
                    dc_estado_matricula: '',
                    dc_cupo_admision: estudiante.c_cupo_admision,
                    dc_cusid: estudiante.c_cus_id,
                    dc_carrera: DatosCarreraNivelacion.data.Carrera.carNombre,
                    dc_facultad: DatosCarreraNivelacion.data.Carrera.Facultad.facNombre,
                    dc_nombres: datosEst.per_nombres,
                    dc_apellidos: `${datosEst.per_primerApellido} ${datosEst.per_segundoApellido}`,
                    dc_cedula: estudiante.c_identificacion,
                    dc_ies_id: 0,
                    dc_estado_fin_curso: '',
                    dc_reubicado_primer_nivel: '',
                    dc_oficio_notificacion_retiro: 'NINGUNO',
                    dc_fecha_notificacion_retiro: 'NINGUNO',
                    per_nombres: datosEst.per_nombres,
                    per_primerApellido: `${datosEst.per_primerApellido} ${datosEst.per_segundoApellido}`,
                    procedencia: datosEst.procedencia || 'NINGUNO',
                    nac_nombre: datosEst.nac_nombre || 'NINGUNO',
                    per_email: datosEst.per_email || 'NINGUNO',
                    per_emailAlternativo: datosEst.per_emailAlternativo || 'NINGUNO',
                    per_telefonoCelular: datosEst.per_telefonoCelular || 'NINGUNO',
                    per_telefonoCasa: datosEst.per_telefonoCasa || 'NINGUNO',
                    per_fechaNacimiento: datosEst.per_fechaNacimiento ? tools.formatearFechaNacimiento(datosEst.per_fechaNacimiento) : 'NINGUNO',
                    eci_nombre: datosEst.eci_nombre || 'NINGUNO',
                    etn_nombre: datosEst.etn_nombre || 'NINGUNO',
                    gen_nombre: datosEst.gen_nombre || 'NINGUNO',
                    prq_nombre: datosEst.prq_nombre || 'NINGUNO',
                    strCedula: estudiante.c_identificacion,
                    strCodEstud: 0,
                    descripcionestado: '',
                    descripcioninscripcion: 'ADMISION',
                    strCodNivel: 'NINGUNO',
                    dir_callePrincipal: datosEst.dir_callePrincipal || 'NINGUNO',
                    sexo: datosEst.sexo || 'NINGUNO',
                };

                const [prov, cant, parr] = (datosEst.procedencia || 'NINGUNO/NINGUNO/NINGUNO').split('/');
                estudianteBase.provincia = prov;
                estudianteBase.canton = cant;
                estudianteBase.parroquia = parr;


                estudianteBase.sede = DatosCarreraSQL.data[0].strSede;
                estudianteBase.facultad = DatosCarreraSQL.data[0].strNombreFacultad;
                estudianteBase.carrera = DatosCarreraSQL.data[0].strNombreCarrera;
                estudianteBase.dc_sede = DatosCarreraSQL.data[0].strSede;
                estudianteBase.dc_provincia = estudianteBase.dc_sede === 'MATRIZ' ? 'CHIMBORAZO' : estudianteBase.dc_sede === 'MORONA' ? 'MORONA SANTIAGO' : 'ORELLANA';
                estudianteBase.dc_canton = estudianteBase.dc_sede === 'MATRIZ' ? 'RIOBAMBA' : estudianteBase.dc_sede === 'MORONA' ? 'MORONA' : 'ORELLANA';

                const estadoCarrera = ObjMatriculadoCarrera.count > 0;
                const estadoNivelacion = ObjMatriculadoNivelacion.count > 0;

                if (estadoCarrera || estadoNivelacion) {
                    estudianteBase.dc_observacion = 'PROCESO MIGRACION // MATRICULADO EN CARRERA//';
                    estudianteBase.dc_matriculacion = 'MATRICULADO';
                    estudianteBase.dc_estado_matricula = 'PRIMERA MATRICULA';
                    estudianteBase.dc_reubicado_primer_nivel = 'SI';
                    estudianteBase.strCodEstud = estadoCarrera ? ObjMatriculadoCarrera.data[0].strCodEstud : ObjMatriculadoNivelacion.data[0].strCodEstud;
                    estudianteBase.strCodNivel = estadoCarrera ? ObjMatriculadoCarrera.data[0].strCodNivel : ObjMatriculadoNivelacion.data[0].strCodNivel;
                    estudianteBase.descripcionestado = estadoCarrera ? ObjMatriculadoCarrera.data[0].strCodEstado : ObjMatriculadoNivelacion.data[0].strCodEstado;
                    estudianteBase.dc_fecha_matricula = tools.ConvertirFechaMatricula(
                        estadoCarrera ? ObjMatriculadoCarrera.data[0].dtFechaAutorizada : ObjMatriculadoNivelacion.data[0].dtFechaAutorizada
                    );

                    const dbTarget = estadoCarrera ? estudiante.c_dbcarrera : estudiante.c_dbnivelacion;
                    const codTarget = estadoCarrera ? ObjMatriculadoCarrera.data[0].sintCodigo : ObjMatriculadoNivelacion.data[0].sintCodigo;

                    const [listadoRetiros, pago, asignaturas, calculoRegulares, verifPeriodo] = await Promise.all([
                     await FuncionEstudiantesRetirosPeriodoCarreraCedula(dbTarget, periodo, estudiante.c_identificacion, estudianteBase.strCodEstud),
                        modeloprocesocarreras.ObtenerPagoMatriculaEstudiante("pagosonline_db", periodo, cedula),
                        modeloprocesocarreras.AsignaturasMatriculadaEstudiantePeriodoCantidad(dbTarget, periodo, codTarget),
                        modeloprocesocarreras.CalculoEstudiantesRegulares60PorCiento(dbTarget, periodo, codTarget),
                     await   tools.VerificacionPeriodoTresCalificaciones(periodo)
                    ]);

                    if (listadoRetiros.length === 0) {
                        const datosAprob = verifPeriodo ? await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasEstudiante(dbTarget, periodo, codTarget) : await modeloprocesocarreras.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudiante(dbTarget, periodo, codTarget);
                        estudianteBase.aprobacion = datosAprob.data[0].Reprueba === 0 ? 'APROBADO' : 'REPROBADO';
                    } else {
                        estudianteBase.dc_estado_fin_curso = 'RETIRO PARCIAL VOLUNTARIO';
                    }

                    if (asignaturas.count > 0) {
                        const data = asignaturas.data[0];
                        estudianteBase.primera = data.Primera > 0 ? 'SI' : 'NO';
                        estudianteBase.segunda = data.Segunda > 0 ? 'SI' : 'NO';
                        estudianteBase.tercera = data.Tercera > 0 ? 'SI' : 'NO';
                        estudianteBase.repetidor = data.Tercera > 0 || data.Segunda > 0 ? 'SI' : 'NO';
                        estudianteBase.cantidadprimera = data.Primera;
                        estudianteBase.cantidadsegunda = data.Segunda;
                        estudianteBase.cantidadtercera = data.Tercera;
                    }

                    if (calculoRegulares.count > 0) {
                        estudianteBase.regular = calculoRegulares.data[0].Estudiante;
                    }

                    if (pago.count > 0) {
                        estudianteBase.gratuidad = 'NO';
                        estudianteBase.valorpago = pago.data[0].fltTotal;
                    } else {
                        estudianteBase.gratuidad = 'SI';
                        estudianteBase.valorpago = 0;
                    }

                } else {
                    estudianteBase.dc_observacion = 'PROCESO MIGRACION // NO MATRICULADO//';
                    estudianteBase.dc_matriculacion = 'NO MATRICULADO';
                    estudianteBase.dc_estado_matricula = 'NO INGRESO A LA INSTITUCION';
                    estudianteBase.dc_reubicado_primer_nivel = 'NO';
                    estudianteBase.dc_fecha_matricula = 'NINGUNA';
                    estudianteBase.dc_estado_fin_curso = 'REPROBADO';
                }

                listadoNomina.push(estudianteBase);
            })

        }));

        const base64 = await reportescarreras.ExcelReporteMaticulasAdmisionesInstitucional(periodo, listadoNomina);

        return base64;
    } catch (err) {
        console.error(err);
        return 'ERROR: ' + err.message;
    } finally {
        await closeAllPools();
    }
}

async function FuncionListadoEstudiantePeriodos(carrera, periodo) {
    const limitSQL = pLimit(10);
    const listadoResultado = [];

    try {
        const matriculaEstudiantesCarrera = await modeloprocesocarreras.ListadoEstudiantePeriodoMatricula(carrera, periodo, 'DEF');
        const DatosPeriodo = await modeloprocesocarreras.PeriodoDatosCarrera(carrera, periodo);
        await Promise.all(matriculaEstudiantesCarrera.data.map(async (matricula, i) => {
            console.log('Carrera ' + carrera + ' Código: ' + matricula.sintCodigo);
            const AsignaturasMatricula = await limitSQL(() => modeloprocesocarreras.ListadoAsignaturasEstudiante(carrera, matricula.strCodPeriodo, matricula.sintCodigo));
            if (AsignaturasMatricula.count === 0) return;
            const asignaturasValidas = await Promise.all( AsignaturasMatricula.data.map(async(asignatura) =>
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
                                    promedio:await tools.PromedioCalcular(valor1, valor2),
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

async function FuncionEstudiantesRetirosPeriodoCarreraCedula( dbCarrera,periodo,cedula,codigo) {
    try {
        var lstResultado = []
            var ListadoRetirosTipos = await modeloprocesocarreras.TiposRetirosEstudiantesCarrerasListado(dbCarrera,periodo, cedula);
            var ListadoRetirosNormales = await modeloprocesocarreras.RetirosEstudiantesNormalesCarrerasListado(dbCarrera,periodo, cedula);
            var ListadoRetirosSinMatriculas= await modeloprocesocarreras.ObternerDatosRetirosinMatricula(dbCarrera,periodo, codigo);
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
                        strurl:retiros.strUrl,
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
                        strurl:"",
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
                        sintCodMatricula:0,
                        strCodPeriodo: retirossinmatricula.rsm_strCodPeriodo,
                        strPeriodoDescripcion: retirossinmatricula.strDescripcion,
                        dtFechaAprob: retirossinmatricula.rsm_dtFechaAprob,
                        dtFechaAsentado: retirossinmatricula.rsm_fecha_registro,
                        strdescripcion: retirossinmatricula.rsm_strObservacion,
                        strnombreTipo: "",
                        strurl:retirossinmatricula.rsm_strRuta,
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
        console.log(error);
    }

}




