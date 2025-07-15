const express = require('express');
const router = express.Router();
const Request = require("request");
const fs = require("fs");
const pdf = require('html-pdf');
const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");
const funcionesmodelomovilidad = require('../modelo/modelomovilidad');
const funcionestools = require('../rutas/tools');
const funcionesmodelocarrera = require('../modelo/procesocarrera');
const funcionesmodelocupos = require('../modelo/procesocupos');
const funcionesmodelonotasacademicas = require('../modelo/procesonotasacademicos');
const funcionesreportemovilidad = require('../rutas/reportesMovilidad');
require('dotenv').config()
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const { JSDOM } = require('jsdom');
const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.ProcesoGeneracionCurriculumEstuidanteConsultor = async function (carrera, cedula, periodo) {

    try {

        var resultado = await FuncionCurriculumEstudiantilConsultor(carrera, cedula, periodo);
        return resultado
    } catch (error) {
        console.log(error);
    }
}

async function FuncionCurriculumEstudiantilConsultor(carrera, cedula) {
    try {
        var listado = []
        var listadoAsignaturaProcesada = []
        var listadoAsignaturasHomologadas = []
        var listadoAsignaturasHomologadasPorAprobar = []
        var listadoAsignaturasSinHomologadas = []
        var listadoAsignaturasSinHomologadasAprobadas = []
        var listadoBecas = []
        var ListadoNiveles = []
        var foto = ''
        const baseUrl = "https://centralizada2.espoch.edu.ec/rutaCentral/objpersonalizado/";
        const photoUrl = `https://apigestioncupos.espoch.edu.ec/wsservicioscupos/procesosdinardap/ObtenerFotoPersona/`;
        const graduationUrl = `https://apisustentacion.espoch.edu.ec/rutagrado/seguimientoTitulacion/${carrera}/${cedula}`;
        const scholarshipsUrl = `https://swbecas.espoch.edu.ec/rutaBecasUsuario/getGestionSrvBecasFicha/1/${funcionestools.CedulaSinGuion(cedula)}/5/5`;
        // Obtener datos en paralelo
        const [ObtenerPersona, ObtenerFoto, DatosTitulacion, DatosBecas] = await Promise.all([
            axios.get(baseUrl + funcionestools.CedulaSinGuion(cedula), { httpsAgent: agent }),
            axios.get(photoUrl + funcionestools.CedulaSinGuion(cedula), { httpsAgent: agent }),
            axios.get(graduationUrl, { httpsAgent: agent }),
            axios.get(scholarshipsUrl, { httpsAgent: agent })
        ]);
        const [datosCarrera, datosEstuidanteUltima] = await Promise.all([
            funcionesmodelocupos.ObtenerDatosBase(carrera),
            funcionesmodelomovilidad.ObtenerUltimoPeriodMatriculaEstuidante(carrera, cedula)
        ]);
        // Procesar foto
        foto = await processStudentPhoto(ObtenerFoto);
        // Procesar titulación
        const Titulacion = processGraduationData(DatosTitulacion);
        // Procesar becas
        listadoBecas = DatosBecas.data.resultado ? DatosBecas.data.resBecas : [];
        var RecordAcademicoNivel = await funcionesmodelomovilidad.ObtnerRecodAcademicoporNivel(carrera, datosEstuidanteUltima.data[0].strCodigo, 15);
        var VerificarHomologacion = await RecordAcademicoNivel.data.find(item => item.Tipo === 2) !== undefined
        if (VerificarHomologacion) {//Proceso Con Asignaturas Homologacion Carreras
            var InformacionListado = await procesarConHomologacion(RecordAcademicoNivel.data, carrera, datosEstuidanteUltima.data[0], cedula)
        } else {//Proceso SIN Homologacion Carreras
            var InformacionListado = await procesarSinHomologacion(RecordAcademicoNivel.data, carrera, datosEstuidanteUltima.data[0], cedula, Titulacion)
        }
        var Base64 = ''
        Base64 = await funcionesreportemovilidad.PdfCurriculumEstuidantilConsultor(cedula, ObtenerPersona.data.listado[0], datosCarrera.data[0], InformacionListado, foto, Titulacion, listadoBecas, datosEstuidanteUltima.data[0].strCodigo)
        return Base64;
    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

// Funciones auxiliares
async function procesarConHomologacion(RecordAcademicoNivel, carrera, datosEstuidanteUltima, cedula) {
    const listadoAsignaturasSinHomologadas = [];
    const listadoAsignaturaProcesada = [];
    const listadoAsignaturasHomologadas = [];
    const listado = [];
    const listadoAsignaturasSinHomologadasAprobadas = [];
    const listadoAsignaturasHomologadasPorAprobar = [];

    for (var datosrecord of RecordAcademicoNivel) {
        if (datosrecord.Tipo == 2) {//Asignaturas Homologadas
            banderahomologacion = true
            listadoAsignaturasHomologadas.push(datosrecord)
        } else {//Asignaturas SIN Homologar
            datosrecord.nombretipo = 'OBLIGATORIA'
            datosrecord.nombrearea = ''
            datosrecord.CodigoMateriaNueva = '',
                listadoAsignaturasSinHomologadas.push(datosrecord)
        }
    }
    //Proceso para saber las materias aprobadas sin homologar
    for (var asignaturasinhomologar of listadoAsignaturasSinHomologadas) {
        var objtoEncontradoAgrgar = await funcionestools.EncontraObjetodentroEnunListado(asignaturasinhomologar.CodigoMateriaAnterior, listadoAsignaturasSinHomologadasAprobadas, 'CodigoMateriaAnterior')
        if (objtoEncontradoAgrgar == null) {
            var objtoEncontrado = await funcionestools.EncontraObjetodentroListadoRecordAcademico(asignaturasinhomologar.CodigoMateriaAnterior, listadoAsignaturasSinHomologadas, 'CodigoMateriaAnterior')

            if (objtoEncontrado != null) {
                if (objtoEncontrado.Equivalencia == 'A' || objtoEncontrado.Equivalencia == 'E' || objtoEncontrado.Equivalencia == 'H' || objtoEncontrado.Equivalencia == 'RC' || objtoEncontrado.Equivalencia == 'AVC' || objtoEncontrado.Equivalencia == 'C') {
                    asignaturasinhomologar.estadoasignatura = 'APROBADA'
                    listadoAsignaturasSinHomologadasAprobadas.push(asignaturasinhomologar)
                    listadoAsignaturaProcesada.push(asignaturasinhomologar)
                }
            }
        }
    }
    //Proceso para las asignaturas con homologacionees
    var ListadoNiveles = await funcionesmodelomovilidad.ObtenerNivelesMallaDadoPeriodo(carrera, datosEstuidanteUltima.strCodPeriodo);
    for (var objniveles of ListadoNiveles.data) {
        var MallaAsignatura = await funcionesmodelomovilidad.MallCarreraASignaturasporNivelPeriodo(carrera, datosEstuidanteUltima.strCodPeriodo, objniveles.strCodNivel);
        if (MallaAsignatura.count > 0) {
            for (var datosasignatura of MallaAsignatura.data) {
                var asignaturaMalla = {
                    "Cedula": cedula,
                    "Tipo": 2,
                    "Apellidos": datosEstuidanteUltima.strCodPeriodo,
                    "Nombres": datosEstuidanteUltima.strCodPeriodo,
                    "Periodo": "",
                    "FechaMatricula": "",
                    "Nivel": objniveles.strDescripcion,
                    "codNivel": objniveles.strCodNivel,
                    "CodigoMateriaAnterior": datosasignatura.strCodMateria,
                    "NombreMateriaAnterior": datosasignatura.nombreasignatura,
                    "nombrearea": datosasignatura.nombrearea,
                    "nombretipo": datosasignatura.nombretipo,
                    "CodigoMateriaNueva": '',
                }
                var objtoEncontrado = await funcionestools.EncontraObjetodentroListadoRecordAcademico(datosasignatura.strCodMateria, listadoAsignaturasHomologadas, 'CodigoMateriaNueva')
                if (objtoEncontrado != null) {
                    if (objtoEncontrado.Equivalencia == 'A' || objtoEncontrado.Equivalencia == 'E' || objtoEncontrado.Equivalencia == 'H' || objtoEncontrado.Equivalencia == 'RC' || objtoEncontrado.Equivalencia == 'AVC' || objtoEncontrado.Equivalencia == 'C') {

                        asignaturaMalla.estadoasignatura = 'APROBADA'
                        asignaturaMalla.CodigoMateriaAnterior = objtoEncontrado.CodigoMateriaAnterior
                        asignaturaMalla.NombreMateriaAnterior = objtoEncontrado.NombreMateriaAnterior
                        asignaturaMalla.nombrehomologacion = objtoEncontrado.nombrehomologacion
                        asignaturaMalla.CodigoMateriaAnterior = objtoEncontrado.CodigoMateriaAnterior
                        asignaturaMalla.CodigoMateriaNueva = objtoEncontrado.CodigoMateriaNueva

                        listadoAsignaturaProcesada.push(asignaturaMalla)
                    } else {
                        asignaturaMalla.estadoasignatura = 'POR APROBAR'
                        asignaturaMalla.CodigoMateriaNueva = ''
                        listadoAsignaturasHomologadasPorAprobar.push(asignaturaMalla)
                        listadoAsignaturaProcesada.push(asignaturaMalla)
                    }
                } else {
                    asignaturaMalla.estadoasignatura = 'POR APROBAR'
                    asignaturaMalla.CodigoMateriaNueva = ''
                    listadoAsignaturasHomologadasPorAprobar.push(asignaturaMalla)
                    listadoAsignaturaProcesada.push(asignaturaMalla)
                }
            }
        }

    }
    var ListadoAsignaturaNoAprobar = await funcionesmodelomovilidad.ListadoASignaturasqNotieneqAprobar(carrera, datosEstuidanteUltima.strCodigo);
    if (ListadoAsignaturaNoAprobar.count > 0) {
        var ListadoASignaturasTotal = await funcionestools.QuitarASignaturasNoAprobar(listadoAsignaturaProcesada, ListadoAsignaturaNoAprobar.data)
        for (var objniveles of ListadoNiveles.data) {
            var ListadoAgrupacionNiveles = await funcionestools.ListadoNivelesRecordEncontrar(objniveles.strDescripcion, ListadoASignaturasTotal, 'Nivel')
            objniveles.listadoasignaturas = ListadoAgrupacionNiveles
            listado.push(objniveles)
        }
    } else {
        for (var objniveles of ListadoNiveles.data) {
            var ListadoAgrupacionNiveles = await funcionestools.ListadoNivelesRecordEncontrar(objniveles.strDescripcion, listadoAsignaturaProcesada, 'Nivel')
            objniveles.listadoasignaturas = ListadoAgrupacionNiveles
            listado.push(objniveles)
        }
    }
    return listado;
}

async function procesarSinHomologacion(RecordAcademicoNivel, carrera, datosEstuidanteUltima, cedula, Titulacion) {
    const listadoAsignaturasSinHomologadas = [];
    const listadoAsignaturaProcesada = [];
    const listadoAsignaturasHomologadas = [];
    const listadoAsignaturasSinHomologadasAprobadas = [];
    const listadoAsignaturasHomologadasPorAprobar = [];
    const listado = [];
    for (var asignaturasinhomologar of RecordAcademicoNivel) {
        asignaturasinhomologar.nombretipo = 'OBLIGATORIA'
        asignaturasinhomologar.nombrearea = ''
        asignaturasinhomologar.CodigoMateriaNueva = ''
        var objtoEncontradoAgrgar = await funcionestools.EncontraObjetodentroEnunListado(asignaturasinhomologar.CodigoMateriaAnterior, listadoAsignaturasSinHomologadasAprobadas, 'CodigoMateriaAnterior')
        if (objtoEncontradoAgrgar == null) {
            var objtoEncontrado = await funcionestools.EncontraObjetodentroListadoRecordAcademico(asignaturasinhomologar.CodigoMateriaAnterior, RecordAcademicoNivel, 'CodigoMateriaAnterior')
            if (objtoEncontrado != null) {
                if (objtoEncontrado.Equivalencia == 'A' || objtoEncontrado.Equivalencia == 'E' || objtoEncontrado.Equivalencia == 'H' || objtoEncontrado.Equivalencia == 'RC' || objtoEncontrado.Equivalencia == 'AVC' || objtoEncontrado.Equivalencia == 'C') {
                    asignaturasinhomologar.estadoasignatura = 'APROBADA'
                    listadoAsignaturasSinHomologadasAprobadas.push(asignaturasinhomologar)
                }
            }
        }
    }
    if (Titulacion.estado == 'TERMINADO') {
        var DatosNivelesRecord = await funcionestools.AgruparNivelesdelRecordAcademicos(listadoAsignaturasSinHomologadasAprobadas);
        //  ListadoNiveles = DatosNivelesRecord
        for (var objniveles of DatosNivelesRecord) {
            var ListadoAgrupacionNiveles = []
            ListadoAgrupacionNiveles = await funcionestools.ListadoNivelesRecordEncontrar(objniveles.strDescripcion, listadoAsignaturasSinHomologadasAprobadas, 'Nivel')
            objniveles.listadoasignaturas = ListadoAgrupacionNiveles
            listado.push(objniveles)
        }
    } else {
        var DatosNivelesMalla = await funcionesmodelomovilidad.ObtenerNivelesMallaDadoPeriodo(carrera, datosEstuidanteUltima.strCodPeriodo);
        // ListadoNiveles = DatosNivelesMalla.data
        for (var objniveles of DatosNivelesMalla.data) {
            var MallaAsignatura = await funcionesmodelomovilidad.MallCarreraASignaturasporNivelPeriodo(carrera, datosEstuidanteUltima.strCodPeriodo, objniveles.strCodNivel);
            if (MallaAsignatura.count > 0) {
                for (var datosasignatura of MallaAsignatura.data) {
                    var asignaturaMalla = {
                        "Cedula": cedula,
                        "Tipo": 2,
                        "Apellidos": datosEstuidanteUltima.strCodPeriodo,
                        "Nombres": datosEstuidanteUltima.strCodPeriodo,
                        "Periodo": "",
                        "FechaMatricula": "",
                        "Nivel": objniveles.strDescripcion,
                        "codNivel": objniveles.strCodNivel,
                        "CodigoMateriaAnterior": datosasignatura.strCodMateria,
                        "NombreMateriaAnterior": datosasignatura.nombreasignatura,
                        "nombrearea": datosasignatura.nombrearea,
                        "nombretipo": datosasignatura.nombretipo,
                        "CodigoMateriaNueva": '',
                    }
                    var objtoEncontrado = await funcionestools.EncontraObjetodentroListadoRecordAcademico(datosasignatura.strCodMateria, listadoAsignaturasSinHomologadasAprobadas, 'CodigoMateriaAnterior')
                    if (objtoEncontrado != null) {
                        if (objtoEncontrado.Equivalencia == 'A' || objtoEncontrado.Equivalencia == 'E' || objtoEncontrado.Equivalencia == 'H' || objtoEncontrado.Equivalencia == 'RC' || objtoEncontrado.Equivalencia == 'AVC' || objtoEncontrado.Equivalencia == 'C') {
                            asignaturaMalla.estadoasignatura = 'APROBADA'
                            asignaturaMalla.CodigoMateriaAnterior = objtoEncontrado.CodigoMateriaAnterior
                            asignaturaMalla.NombreMateriaAnterior = objtoEncontrado.NombreMateriaAnterior
                            asignaturaMalla.nombrehomologacion = objtoEncontrado.nombrehomologacion
                            asignaturaMalla.CodigoMateriaAnterior = objtoEncontrado.CodigoMateriaAnterior
                            asignaturaMalla.CodigoMateriaNueva = objtoEncontrado.CodigoMateriaNueva
                            listadoAsignaturaProcesada.push(asignaturaMalla)
                        } else {
                            asignaturaMalla.estadoasignatura = 'POR APROBAR'
                            asignaturaMalla.CodigoMateriaNueva = ''
                            listadoAsignaturasHomologadasPorAprobar.push(asignaturaMalla)
                            listadoAsignaturaProcesada.push(asignaturaMalla)
                        }
                    } else {
                        asignaturaMalla.estadoasignatura = 'POR APROBAR'
                        asignaturaMalla.CodigoMateriaNueva = ''
                        listadoAsignaturasHomologadasPorAprobar.push(asignaturaMalla)
                        listadoAsignaturaProcesada.push(asignaturaMalla)
                    }
                }
            }
        }
        var ListadoAsignaturaNoAprobar = await funcionesmodelomovilidad.ListadoASignaturasqNotieneqAprobar(carrera, datosEstuidanteUltima.strCodigo);
        if (ListadoAsignaturaNoAprobar.count > 0) {
            var ListadoASignaturasTotal = await funcionestools.QuitarASignaturasNoAprobar(listadoAsignaturaProcesada, ListadoAsignaturaNoAprobar.data)
            for (var objniveles of DatosNivelesMalla.data) {
                var ListadoAgrupacionNiveles = await funcionestools.ListadoNivelesRecordEncontrar(objniveles.strDescripcion, ListadoASignaturasTotal, 'Nivel')
                objniveles.listadoasignaturas = ListadoAgrupacionNiveles
                listado.push(objniveles)
            }
        } else {
            for (var objniveles of DatosNivelesMalla.data) {
                var ListadoAgrupacionNiveles = await funcionestools.ListadoNivelesRecordEncontrar(objniveles.strDescripcion, listadoAsignaturaProcesada, 'Nivel')
                objniveles.listadoasignaturas = ListadoAgrupacionNiveles
                listado.push(objniveles)
            }
        }
    }
    return listado
}
async function processStudentPhoto(photoData) {
    if (photoData.data.success && photoData.data.Informacion.blProceso) {
        return `data:image/jpeg;base64,${photoData.data.Informacion.Datos.valor}`;
    }
    return `data:image/png;base64,${await funcionestools.FotoPorDefecto()}`;
}


function processGraduationData(graduationData) {
    if (!graduationData.data.success) {
        return {
            proceso: false,
            mensaje: graduationData.data.mensaje
        };
    }
    const info = graduationData.data.informacion;
    const isOasis = info.tipo === 'OASIS';
    return {
        proceso: true,
        nombreproyecto: isOasis ? info.proyecto.nombreproyecto : info.proyecto.Tema,
        formagrado: isOasis ? info.proyecto.formagrado : info.proyecto.Modalidad,
        estado: info.proyecto.estado,
        resolucion: isOasis ? '' : info.proyecto.resolucionaprobacion
    };
}