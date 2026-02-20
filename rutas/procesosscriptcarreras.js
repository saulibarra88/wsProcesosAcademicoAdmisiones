const express = require('express');
const router = express.Router();
const Request = require("request");
const fs = require('fs');
const axios = require('axios');
const https = require('https');
const puppeteer = require('puppeteer');
const tools = require('./tools');
const pdf = require('html-pdf');
const procesoAcadeicoNotas = require('../rutas/ProcesoNotasAcademico');
const procesoCupo = require('../modelo/procesocupos');
const procesoscriptcarrera = require('../modelo/modeloscriptcarreras');
const procesoCarrera = require('../modelo/procesocarrera');
const procesoReportesCarrera = require('./reportesCarreras');
const procesonotasacademicos = require('../modelo/procesonotasacademicos');
const Chart = require('chart.js');
const crypto = require("crypto");
const { iniciarDinamicoPool, iniciarDinamicoTransaccion } = require("./../config/execSQLDinamico.helper");


const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.DocumentosMatriculasPeriosdos = async function (carrera, periodo) {
    try {
        var resultado = await FuncionActivacionBotonCrearPeriodo(carrera, periodo, pensum);
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

module.exports.ProcesoActualizacionNotasRecuperacion = async function (carrera, periodo) {
    try {
        var resultado = await FuncionCalifacionesRecuperacion();
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}
module.exports.ProcesoEliminacionMatriculasPendientes = async function (periodo) {
    try {
        var resultado = await FuncionCalifacionesRecuperacion();
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}

module.exports.ProcesoVerificacionMatriculaAsignaturas = async function (carrera, periodoactual, peridoanterior) {
    try {
        var resultado = await FuncionListadoEstudianteConIrregularidadMatricula(carrera, periodoactual, peridoanterior);
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}
async function FuncionActivacionBotonCrearPeriodo(periodo) {
    try {
        var resultado = await FuncionListarConfiguracionesActivasPeriodo(carrera, periodo, pensum);
        return { resultado }

    } catch (error) {
        console.log(error);
        return { blProceso: false, mensaje: "Error :" + error }

    }
}


async function FuncionCalifacionesRecuperacion() {

    try {
        var ListadoEstudiantes = [];
        var ListadoEstudiantesResultado = [];

        //  var ListadoRegistro = await procesoCarrera.SentenciaNotas1("SistemaAcademico"); 
        var ListadoRegistro = await procesoCarrera.ListadoLogRecuperacionTabla("SistemaAcademico");

        if (ListadoRegistro.count > 0) {
            for (var informacion of ListadoRegistro.data) {
                /*   console.log(informacion.autdescripcionproceso)
                   var formatocalificaciones = await tools.FormatoCalificacionesRecuperacion(informacion.autdescripcionproceso);    
                  let f = 0;
                   console.log(formatocalificaciones)*/
                // var Actualizacion = await procesoCarrera.ActualizacionCalifacionRecuperacion(formatocalificaciones.database,formatocalificaciones.enrollment,formatocalificaciones.grade,formatocalificaciones.subject); 

                if (informacion.nota !== 'undefined' || informacion.nota !== 'null' || informacion.nota !== 'NaN.00')
                    if (informacion.bd !== 'OAS_TelecomunicacionesR') {
                        var Actualizacion = await procesoCarrera.ActualizacionCalifacionRecuperacion(informacion.bd, informacion.matricula, informacion.nota, informacion.materia);
                    }
            }
        }
        return 'OK';
    } catch (err) {

        console.error(err);
        return 'ERROR';
    }
}

async function FuncionListadoEstudianteConIrregularidadMatricula(carrera3, periodoactual, peridoanterior) {
    const pool = await iniciarDinamicoPool('OAS_Master');
    await pool.connect();
    const transaction = await iniciarDinamicoTransaccion(pool);
    await transaction.begin();
    try {
        var listado = [];
        var DatosPeriodo = await procesonotasacademicos.PeriodoDatosCarrera(transaction, 'OAS_Master', peridoanterior);
        var ListadoCarreras = await procesonotasacademicos.ListadoCarreraTodas(transaction, 'OAS_Master');
        console.log('Listado Carreras: ' + ListadoCarreras.count);
        if (ListadoCarreras.count > 0) {
            for (var objcarrera of ListadoCarreras.data) {
                var carrera = objcarrera.strBaseDatos;
                console.log('Carrera: ' + carrera);
             //   if (carrera == 'OAS_AgroindustriaR') {
var matriculaEstudiantesCarrera = await procesonotasacademicos.ListadoEstudiantePeriodoMatricula(transaction, carrera, peridoanterior, 'DEF');
                var numero = 0;
                var blcontrol = false;
                if (matriculaEstudiantesCarrera.count > 0) {

                    for (var matriculas of matriculaEstudiantesCarrera.data) {
                        blcontrol = false;
                        numero = numero + 1;
                        console.log('Estudiante: ' + matriculas.strCodEstud + ' - ' + numero + ' de ' + matriculaEstudiantesCarrera.count);
                        var ListadoAsignaturas = [];
                        //  if (Number(matriculas.strCodEstud) == 7525) {
                            var  materiaactual = '';
                        var  materiaanterior = '';
                        var AsignaturasMatricula = await procesonotasacademicos.ListadoAsignaturasEstudiante(transaction, carrera, matriculas.strCodPeriodo, matriculas.sintCodigo);
                        if (AsignaturasMatricula.count > 0) {
                            for (var asignatura of AsignaturasMatricula.data) {
                                var DatosConvalidaciones = await procesonotasacademicos.ObtenerConvalidacionesEstudiante(transaction, carrera, matriculas.strCodPeriodo, matriculas.sintCodigo, asignatura.strCodigo);
                                var DatosRetiros = await procesonotasacademicos.ObtenerRetirosEstudiante(transaction, carrera, matriculas.strCodPeriodo, matriculas.sintCodigo, asignatura.strCodigo);
                                var DatosSinAporbar = await procesonotasacademicos.ObtenerMateriaNoAprobarEstudiante(transaction, carrera, asignatura.strCodigo, Number(matriculas.strCodEstud));
                                if (DatosConvalidaciones.count == 0) {
                                    if (DatosRetiros.count == 0) {
                                        if (DatosSinAporbar.count == 0) {
                                            var matriculaEstudiantesAsiganturas = await procesoCupo.AsignaturasMatriculadaEstudiante(transaction, carrera, periodoactual, matriculas.strCedula);
                                     
                                            if (matriculaEstudiantesAsiganturas.count > 0) {
                                                for (var asignaturaactual of matriculaEstudiantesAsiganturas.data) {
                                                    if (asignaturaactual.strCodMateria == asignatura.strCodMateria) {
                                                        if (asignaturaactual.bytNumMat == asignatura.bytNumMat) {
                                                            blcontrol = true;
                                                            console.log('Caso Especial')
                                                            console.log('asignatura',asignatura)
                                                            console.log('asignaturaactual',asignaturaactual)
                                                            materiaactual = materiaactual + 'Codigo:' + asignaturaactual.strCodMateria  + ' - Nombre:' + asignaturaactual.strNombre +' - Periodo:' + asignaturaactual.strCodPeriodoMatricula + ' -# Matricula:  ' + asignaturaactual.bytNumMat +'// ';
                                                            materiaanterior = materiaanterior+ 'Codigo:' + asignatura.strCodMateria + ' - Nombre:' + asignatura.strNombre + ' - Periodo:' + asignatura.strCodPeriodo + ' - # Matricula: ' + asignatura.bytNumMat +'// ' ;
                                                            console.log('Matricula Anterior: ' + materiaanterior);
                                                            console.log('Matricula Actual: ' + materiaactual);
                                                            console.log('---------************')
                                                         
                                                            console.log('Asignatura Matriculada en el periodo anterior: ' + matriculas.strCodEstud + ' - ' + asignatura.strCodMateria + ' - ' + asignatura.strCodPeriodo + ' - ' + asignatura.bytNumMat);
                                                            console.log('Asignatura Matriculada en el periodo actual: ' + matriculas.strCodEstud + ' - ' + asignaturaactual.strCodMateria + ' - ' + asignaturaactual.strCodPeriodo + ' - ' + asignaturaactual.bytNumMat);
                                                            console.log('---------************')
                                                           var datos = {
                                                                actual:materiaactual,
                                                                anteriror: materiaanterior
                                                            }
                                                            ListadoAsignaturas.push(datos)
                                                       
                                                        }
                                                    }
                                                }
                                            
                                                 
                                            }


                                        }
                                    }
                                }

                            } if (blcontrol == true) {
                                matriculas.ListadoAsignaturas = ListadoAsignaturas;
                                matriculas.carrera = carrera;
                                matriculas.objcarrera = objcarrera;
                                listado.push(matriculas);

                            }
                        }
                          }



                    }
                  
              //  }
               // }
                
            }
             var base64=await    procesoReportesCarrera.ExcelInconsistenciaMatriculas(listado,objcarrera);
                                                  
              return listado;
        }

    } catch (err) {
        await transaction.rollback();
        console.error(err);
        return 'ERROR';
    } finally {
        await transaction.commit();
        await pool.close();
    }
}
