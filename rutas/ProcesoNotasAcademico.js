const axios = require('axios');
const cron = require('node-cron');
const pathimage = require('path');
const procesoCupo = require('../modelo/procesocupos');
const procesonotasacademicos = require('../modelo/procesonotasacademicos');
const pdfmakegenerar = require('../reportesmake/reportescarrerasmake');

const tools = require('./tools');
const fs = require("fs");
const https = require('https');
const crypto = require("crypto");
const reportespdfmaker = require('../reportesmake/reportescarrerasmake');
const CONFIGACADEMICO = require('./../config/databaseDinamico');
const { iniciarDinamicoPool, iniciarDinamicoTransaccion } = require("./../config/execSQLDinamico.helper");


module.exports.ProcesoObtenerPeriodoDadoCodigo = async function (periodo) {
    try {


        var resultado = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo);
        if (resultado.count > 0) {
            return resultado.data[0]
        } else {
            return null
        }

    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ProcesoAcademicoCalificaciones = async function (periodo, acta) {
    try {

        var resultado = await ActualizarNotaExonerados(periodo, "ABI");//Numero de periodos a restas , estado de carrera
        // var resultado = await ActualizarActasParcialesCambiosFechas(periodo, acta);//Numero de periodos a restas , tipo de acta a actualizar
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ProcesoObtenerCalificacionesEstudiantes = async function (carrera, periodo, cedula, idreglamento) {
    try {
        var Asignaturas = await ObtenerListadoCalificacionesEstudiantes(carrera, periodo, cedula, idreglamento);
        return { Asignaturas }
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ProcesoListadoCalificacionesEstudiantedadoDocente = async function (carrera, periodo, nivel, paralelo, CodMateria, cedula, idreglamento) {
    try {
        var Asignaturas = await ObtenerListadoCalificacionesEstudiantedadoDocente(carrera, periodo, nivel, paralelo, CodMateria, cedula, idreglamento);
        return { Asignaturas }
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ProcesoReporteListadoCalificacionesEstudiantedadoDocente = async function (carrera, periodo, nivel, paralelo, CodMateria, cedula, idreglamento, cedulaUsuario) {
    try {
        var Asignaturas = await ObtenerListadoCalificacionesEstudiantedadoDocente(carrera, periodo, nivel, paralelo, CodMateria, cedula, idreglamento);
        //var base64 = await generarReporteNotasCalificaciones(Asignaturas, carrera, periodo, nivel, paralelo, CodMateria, cedula, cedulaUsuario);
        var base64 = await pdfmakegenerar.pdfmakegenerarReporteNotasCalificaciones(Asignaturas, carrera, periodo, nivel, paralelo, CodMateria, cedula, cedulaUsuario);
  

        return { base64 }
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ProcesoReporteListadoCalificacionesEstudiantedadoDocenteTres = async function (listado, carrera, periodo,nivel,paralelo,CodMateria, cedula, cedulaUsuario) {
    try {
        var base64 = await pdfmakegenerar.pdfmakegenerarReporteNotasCalificacionesTres(listado, carrera, periodo,nivel,paralelo,CodMateria, cedula, cedulaUsuario);
  

        return { base64 }
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ProcesoObtenerLinkActacalificaciones = async function (carrera, periodo, nivel, paralelo, CodMateria, codDocente, idTipoActa) {
    try {

        var Asignaturas = await ObtenerActaLinkCalificaciones(carrera, periodo, nivel, paralelo, CodMateria, codDocente, idTipoActa);
        return { Asignaturas }
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ProcesoObtenerMatriculasInternados = async function (carrera, cedula) {
    try {

        var Asignaturas = await ObtenerMatriculasInternados(carrera, cedula);
        return { Asignaturas }
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ProcesoObtenerRetirosInternados = async function (carrera, cedula) {
    try {

        var Asignaturas = await ListadoRetirosInternados(carrera, cedula);
        return { Asignaturas }
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ListadoConvalidacionesEstudiantes = async function (carrera, cedula) {
    try {
        var Asignaturas = await ListadosEstudianteConvalidaciones(carrera, cedula);
        return { Asignaturas }
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ListadoEquivalenciaRelamentos = async function (idReglamento) {
    try {
        var Equivalencias = await ListadoEquivalenciaRendimientoss(idReglamento);
        return { Equivalencias }
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ListadoEstudiantesPeriodosCarrera = async function (carrera,periodo) {
    try {
        var Datos = await FuncionListadoEstudiantePeriodos(carrera,periodo);
        return { Datos }
    } catch (error) {
        console.error(error);
        
    }
}

module.exports.ListadoEstudiantesAsignaturaDocente = async function (carrera, periodo,nivel,paralelo,CodMateria, cedula) {
    try {
        var Datos = await ObtenerListadoEstudiantedadoDocenteAsignatura(carrera, periodo,nivel,paralelo,CodMateria, cedula);
        return { Datos }
    } catch (error) {
        console.error(error);
        
    }
}
async function ActualizarNotaExonerados(periodo, estado) {
    console.log("***********PROCESO INICIALIZADO ACTUALIZACION NOTA EXONERADOS**********")
    try {
        try {
            var listadoCarreras = [];
            var listadoCarreras = await procesonotasacademicos.ObtenerCarrerasMater("OAS_Master", estado);
            if (listadoCarreras.data.length > 0) {
                for (var obj of listadoCarreras.data) {
                    var ActualizarInformacion = await procesonotasacademicos.ActualizarNotaExonerados(obj.strBaseDatos, periodo);
                }
            } else {
                console.log("No exite carreras Activas")
            }
            console.log("***********PROCESO FINALIZADO ACTUALIZACION NOTA EXONERADOS**********")
            return listadoCarreras;
        } catch (error) {
            console.error(error);
            
            return 'ERROR';
        }
    } catch (err) {
        console.error(err);
        
        return 'ERROR';
    }
}

async function ActualizarActasParcialesCambiosFechas(periodo, tipo) {
    console.log("***********PROCESO INICIALIZADO ACTUALIZACION ACTAS FECHAS ACTUALIZADAS**********")
    try {
        try {
            var listadoCarreras = [];
            var listadoCarreras = await procesonotasacademicos.ObtenerCarrerasMater("OAS_Master", "ABI");
            if (listadoCarreras.data.length > 0) {
                for (var obj of listadoCarreras.data) {
                    var ActualizarInformacion = await procesonotasacademicos.ActualizarActasGeneradasAutomaticamenteFechas(obj.strBaseDatos, periodo, tipo);
                }
            } else {
                console.log("No exite carreras Activas")
            }
            console.log("***********PROCESO FINALIZADO ACTUALIZACION ACTAS FECHAS ACTUALIZADAS**********")
            return listadoCarreras;
        } catch (error) {
            console.error(error);
            
            return 'ERROR';
        }
    } catch (err) {
        console.error(err);
        
        return 'ERROR';
    }
}


async function ObtenerListadoCalificacionesEstudiantes(carrera, periodo, cedula, idreglamento) {
    const pool = await iniciarDinamicoPool(carrera);
    await pool.connect();
    const transaction = await iniciarDinamicoTransaccion(pool);
    await transaction.begin();
    try {
        var listadoAsignaturas = [];
        var matriculaEstudiantesAsiganturas = await procesoCupo.AsignaturasMatriculadaEstudiante(transaction, carrera, periodo, cedula);
        if (matriculaEstudiantesAsiganturas.count > 0) {
            for (var asignaturas of matriculaEstudiantesAsiganturas.data) {
                var DatosConvalidaciones = await procesonotasacademicos.ObtenerConvalidacionesEstudiante(transaction, carrera, asignaturas.strCodPeriodoMatricula, asignaturas.sintCodMatricula, asignaturas.strCodMateria);
                var DatosRetiros = await procesonotasacademicos.ObtenerRetirosEstudiante(transaction, carrera, asignaturas.strCodPeriodoMatricula, asignaturas.sintCodMatricula, asignaturas.strCodMateria);
                var DatosSinAporbar = await procesonotasacademicos.ObtenerMateriaNoAprobarEstudiante(transaction, carrera, asignaturas.strCodMateria, Number(asignaturas.strCodEstud));
                if (DatosConvalidaciones.count == 0) {
                    if (DatosRetiros.count == 0) {
                        if (DatosSinAporbar.count == 0) {
                            var datosNotas = await procesonotasacademicos.ObtenerNotaPacialAsignatura(transaction, carrera, asignaturas.sintCodMatricula, asignaturas.strCodPeriodoMatricula, asignaturas.strCodMateria);
                            asignaturas.cantidadNota = datosNotas.count;
                            if (datosNotas.count > 0) {
                                var listadoCalificaciones = [];
                                for (var objNotas of datosNotas.data) {
                                    var EquivalenciaDatos = await procesonotasacademicos.ObtenerParametroCalificacionPorCodEquivalencia(transaction, "SistemaAcademico", objNotas.strCodEquiv, idreglamento);
                                    var valor1 = objNotas.dcParcial1 == null ? 0 : objNotas.dcParcial1;
                                    var valor2 = objNotas.dcParcial2 == null ? 0 : objNotas.dcParcial2;
                                    objNotas.promedio = tools.PromedioCalcular(valor1, valor2);
                                    objNotas.Equivalencia = EquivalenciaDatos.data[0];
                                    listadoCalificaciones.push(objNotas)
                                }
                                asignaturas.Calificacion = listadoCalificaciones;
                            } else {
                                asignaturas.Calificacion = null
                            }
                            listadoAsignaturas.push(asignaturas)
                        }
                    }
                }
            }
            return listadoAsignaturas;
        }
    } catch (err) {
        console.error(err);
        await transaction.rollback();
        
        return 'ERROR';
    } finally {
        await transaction.commit();
        await pool.close();
    }
}
async function ObtenerListadoCalificacionesEstudiantedadoDocente(carrera, periodo, nivel, paralelo, CodMateria, cedula, idreglamento) {
    const pool = await iniciarDinamicoPool(carrera);
    await pool.connect();
    const transaction = await iniciarDinamicoTransaccion(pool);
    await transaction.begin();
    try {
        var listadoNomina = [];
        var matriculaEstudiantesNomina = await procesonotasacademicos.ListadoNominaEstudianteDadoCedulaDocente(transaction, carrera, periodo, nivel, paralelo, CodMateria, cedula);
        if (matriculaEstudiantesNomina.count > 0) {
            for (var estudiante of matriculaEstudiantesNomina.data) {
                var DatosConvalidaciones = await procesonotasacademicos.ObtenerConvalidacionesEstudiante(transaction, carrera, estudiante.strCodPeriodoMateria, estudiante.sintCodigo, estudiante.strCodMateria);
                var DatosRetiros = await procesonotasacademicos.ObtenerRetirosEstudiante(transaction, carrera, estudiante.strCodPeriodoMateria, estudiante.sintCodigo, estudiante.strCodMateria);
                var DatosSinAporbar = await procesonotasacademicos.ObtenerMateriaNoAprobarEstudiante(transaction, carrera, estudiante.strCodMateria, Number(estudiante.strCodEstud));
                var DatosValidacion = await procesonotasacademicos.ObtenerMateriaConvalidacionConocimiento(transaction, carrera, estudiante.strCodMateria, estudiante.sintCodigo,estudiante.strCodPeriodoMateria);
                if (DatosConvalidaciones.count == 0) {
                    if (DatosRetiros.count == 0) {
                        if (DatosSinAporbar.count == 0) {
                            if(DatosValidacion.count==0){
                                var datosNotas = await procesonotasacademicos.ObtenerNotaPacialAsignatura(transaction, carrera, estudiante.sintCodigo, estudiante.strCodPeriodoMateria, estudiante.strCodMateria);
                                estudiante.cantidadNota = datosNotas.count;
                                if (datosNotas.count > 0) {
                                    var listadoCalificaciones = [];
                                    for (var objNotas of datosNotas.data) {
                                        var valor1 = objNotas.dcParcial1 == null ? 0 : objNotas.dcParcial1;
                                        var valor2 = objNotas.dcParcial2 == null ? 0 : objNotas.dcParcial2;
                                        objNotas.promedio = tools.PromedioCalcular(valor1, valor2);
                                        var EquivalenciaDatos = await procesonotasacademicos.ObtenerParametroCalificacionPromedioEquivalencia(transaction, "SistemaAcademico", objNotas.promedio, idreglamento);
                                        if (EquivalenciaDatos.count > 0) {
                                            objNotas.Equivalencia = EquivalenciaDatos.data[0];
                                        } else {
                                            var EquivalenciaAsistencia = await procesonotasacademicos.ObtenerParametroEquivalenciaAsistencia(transaction, "SistemaAcademico", objNotas.bytAsistencia, idreglamento);
                                            if (EquivalenciaAsistencia.count > 0) {
                                                objNotas.Equivalencia = EquivalenciaAsistencia.data[0];
                                            }
                                        }
                                        listadoCalificaciones.push(objNotas)
                                    }
                                    estudiante.Calificacion = listadoCalificaciones;
                                } else {
                                    estudiante.Calificacion = null
                                }
                                listadoNomina.push(estudiante)

                            }
                         
                        }
                    }
                }
            }
            return listadoNomina;
        }
    } catch (err) {
        console.error(err);
        await transaction.rollback();
        
        return 'ERROR';
    } finally {
        await transaction.commit();
        // Cerrar la conexión
        await pool.close();
    }
}

async function ObtenerActaLinkCalificaciones(carrera, periodo, nivel, paralelo, CodMateria, codDocente, idTipoActa) {
    const pool = await iniciarDinamicoPool(carrera);
    await pool.connect();
    const transaction = await iniciarDinamicoTransaccion(pool);
    await transaction.begin();
    try {
        var listadoNomina = [];
        var matriculaEstudiantesNomina = await procesonotasacademicos.ObtenerLinkActasCalificaciones(transaction, carrera, periodo, nivel, paralelo, CodMateria, codDocente, idTipoActa);
        if (matriculaEstudiantesNomina.count > 0) {

            return matriculaEstudiantesNomina.data;
        } else {
            return listadoNomina;
        }
    } catch (err) {
        console.error(err);
        await transaction.rollback();
        
        return 'ERROR';
    } finally {
        await transaction.commit();
        // Cerrar la conexión
        await pool.close();
    }
}

async function ListadosEstudianteConvalidaciones(carrera, cedula) {
    const pool = await iniciarDinamicoPool(carrera);
    await pool.connect();
    const transaction = await iniciarDinamicoTransaccion(pool);
    await transaction.begin();
    try {
        var listadoNomina = [];
        var matriculaEstudiantesNomina = await procesoCupo.EncontrarEstudianteMatriculaTodas(transaction, carrera, cedula);

        if (matriculaEstudiantesNomina.count > 0) {
            for (var estudiante of matriculaEstudiantesNomina.data) {
                var Convalidaciones = await procesoCupo.ObtenerConvalidacionesEstudiante(transaction, carrera, estudiante.sintCodigo, estudiante.strCodPeriodo);
                if (Convalidaciones.count > 0) {
                    for (var convalidad of Convalidaciones.data) {
                        var periodoobetner = await procesoCupo.ObtenerPeriodoDadoCodigo(convalidad.strCodPeriodo);
                        convalidad.periodo = periodoobetner.data[0];
                        listadoNomina.push(convalidad)
                    }
                }
            }
            return listadoNomina;

        } else {
            return listadoNomina;
        }
    } catch (err) {
        console.error(err);
        await transaction.rollback();
        
        return 'ERROR';
    } finally {
        await transaction.commit();
        // Cerrar la conexión
        await pool.close();
    }
}
async function ListadoEquivalenciaRendimientoss(idReglamento) {

    try {
        var listadoNomina = [];
        var listado = await procesonotasacademicos.ListadoEquivalenciaRendimentodadoReglamento("SistemaAcademico", idReglamento);
        if (listado.count > 0) {
            listadoNomina = listado.data
            return listadoNomina;

        } else {
            return listadoNomina;
        }
    } catch (err) {

        console.error(err);

        
        return 'ERROR';
    }
}
async function ObtenerMatriculasInternados(carrera, cedula) {

    try {
        var listado = [];
        var matriculaEstudiantesCarrera = await procesonotasacademicos.ObtenerMatriculaInternado(carrera, cedula);
        if (matriculaEstudiantesCarrera.count > 0) {
            for (var matriculas of matriculaEstudiantesCarrera.data) {
                var AsignaturasListado = [];
                var AsignaturasInternado = await procesonotasacademicos.ObtenerMatriculaInternadoAsignaturas(carrera, matriculas.strCodCoherte, matriculas.sintCodigo, matriculas.strCodEstud);
                for (var asignaturas of AsignaturasInternado.data) {
                    var Retirado = await procesonotasacademicos.ObtenerAsignaturasRetiroInternado(carrera, matriculas.strCodCoherte, matriculas.sintCodigo, asignaturas.strCodMateria);
                    if (Retirado.count == 0) {
                        AsignaturasListado.push(asignaturas)
                    }
                }
                matriculas.ListadoAsignaturas = AsignaturasListado;
                listado.push(matriculas)
            }
            return listado;
        } else {
            return listado;
        }
    } catch (err) {

        console.error(err);

        
        return 'ERROR';
    }
}
async function FuncionListadoEstudiantePeriodos(carrera,periodo) {
    const pool = await iniciarDinamicoPool(carrera);
    await pool.connect();
    const transaction = await iniciarDinamicoTransaccion(pool);
    await transaction.begin();
    try {
        var listado = [];
        var DatosPeriodo = await procesonotasacademicos.PeriodoDatosCarrera(transaction,carrera, periodo);
        var matriculaEstudiantesCarrera = await procesonotasacademicos.ListadoEstudiantePeriodoMatricula(transaction,carrera, periodo,'DEF');
        var numero=0;
        if (matriculaEstudiantesCarrera.count > 0) {
           
            for (var matriculas of matriculaEstudiantesCarrera.data) {
                numero =numero+1;
              var  ListadoAsignaturas=[];
                var AsignaturasMatricula = await procesonotasacademicos.ListadoAsignaturasEstudiante(transaction,carrera, matriculas.strCodPeriodo,matriculas.sintCodigo);

                if (AsignaturasMatricula.count > 0) {
                    for (var asignatura of AsignaturasMatricula.data) {
                     
                        var DatosConvalidaciones = await procesonotasacademicos.ObtenerConvalidacionesEstudiante(transaction, carrera, matriculas.strCodPeriodo, matriculas.sintCodigo, asignatura.strCodigo);
                       var DatosRetiros = await procesonotasacademicos.ObtenerRetirosEstudiante(transaction, carrera, matriculas.strCodPeriodo, matriculas.sintCodigo, asignatura.strCodigo);
                       var DatosSinAporbar = await procesonotasacademicos.ObtenerMateriaNoAprobarEstudiante(transaction, carrera, asignatura.strCodigo, Number(matriculas.strCodEstud));
                        if (DatosConvalidaciones.count == 0) {
                            if (DatosRetiros.count == 0) {
                                if (DatosSinAporbar.count == 0) {
                                    var datosNotas = await procesonotasacademicos.ObtenerNotaPacialAsignatura(transaction, carrera, matriculas.sintCodigo, matriculas.strCodPeriodo, asignatura.strCodigo);
                                    asignatura.cantidadNota = datosNotas.count;
                                    if (datosNotas.count > 0) {
                                        var listadoCalificaciones = [];
                                        for (var objNotas of datosNotas.data) {
                                            var EquivalenciaDatos = await procesonotasacademicos.ObtenerParametroCalificacionPorCodEquivalencia(transaction, "SistemaAcademico", objNotas.strCodEquiv, DatosPeriodo.data[0].idreglamento);
                                            var valor1 = objNotas.dcParcial1 == null ? 0 : objNotas.dcParcial1;
                                            var valor2 = objNotas.dcParcial2 == null ? 0 : objNotas.dcParcial2;
                                            objNotas.promedio = tools.PromedioCalcular(valor1, valor2);
                                            objNotas.Equivalencia = EquivalenciaDatos.data[0];
                                            listadoCalificaciones.push(objNotas)
                                        }
                                        asignatura.Calificacion = listadoCalificaciones;
                                    } else {
                                        asignatura.Calificacion = null
                                    }
                                    ListadoAsignaturas.push(asignatura)
                                }
                            }
                        }
                   
                    }
                    matriculas.selectColor=false,
                    matriculas.contar=numero,
                    matriculas.Asignaturas=ListadoAsignaturas;
                    listado.push(matriculas)
                }

               
            }
            return listado;
        }
    } catch (err) {
        console.error(err);
        await transaction.rollback();
        
        return 'ERROR';
    } finally {
        await transaction.commit();
        await pool.close();
    }
}
async function ListadoRetirosInternados(carrera, cedula) {

    try {
        var listado = [];
        var matriculaEstudiantesCarrera = await procesonotasacademicos.ObtenerMatriculaInternado(carrera, cedula);
        if (matriculaEstudiantesCarrera.count > 0) {
            for (var matriculas of matriculaEstudiantesCarrera.data) {
                var AsignaturasListado = [];


                var Retirado = await procesonotasacademicos.ObtenerAsignaturasRetiroTodas(carrera, matriculas.strCodCoherte, matriculas.sintCodigo);
                if (Retirado.count > 0) {
                    for (var retiros of Retirado.data) {
                        listado.push(retiros)
                    }
                    AsignaturasListado.push(Retirado.data)
                }


            }
            return listado;
        } else {
            return listado;
        }
    } catch (err) {

        console.error(err);

        
        return 'ERROR';
    }
}
const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

async function generarReporteNotasCalificaciones(listado, carrera, periodo, nivel, paralelo, CodMateria, cedula, cedulaUsuario) {
    try {
        var base64 = await reportespdfmaker.pdfmakegenerarReporteNotasCalificaciones(listado, carrera, periodo, nivel, paralelo, CodMateria, cedula, cedulaUsuario);
        return base64;
    } catch (error) {
        console.error(error);
        return 'ERROR';
    }
}




async function ObtenerListadoEstudiantedadoDocenteAsignatura(carrera, periodo,nivel,paralelo,CodMateria, cedula) {
    const pool = await iniciarDinamicoPool(carrera);
    await pool.connect();
    const transaction = await iniciarDinamicoTransaccion(pool);
    await transaction.begin();
    try {
        var listadoNomina = [];
        var matriculaEstudiantesNomina = await procesonotasacademicos.ListadoNominaEstudianteDadoCedulaDocente(transaction, carrera, periodo, nivel, paralelo, CodMateria, cedula);
        if (matriculaEstudiantesNomina.count > 0) {
            for (var estudiante of matriculaEstudiantesNomina.data) {
                var DatosConvalidaciones = await procesonotasacademicos.ObtenerConvalidacionesEstudiante(transaction, carrera, estudiante.strCodPeriodoMateria, estudiante.sintCodigo, estudiante.strCodMateria);
                var DatosRetiros = await procesonotasacademicos.ObtenerRetirosEstudiante(transaction, carrera, estudiante.strCodPeriodoMateria, estudiante.sintCodigo, estudiante.strCodMateria);
                var DatosSinAporbar = await procesonotasacademicos.ObtenerMateriaNoAprobarEstudiante(transaction, carrera, estudiante.strCodMateria, Number(estudiante.strCodEstud));
                var DatosValidacion = await procesonotasacademicos.ObtenerMateriaConvalidacionConocimiento(transaction, carrera, estudiante.strCodMateria, estudiante.sintCodigo,estudiante.strCodPeriodoMateria);
                if (DatosConvalidaciones.count == 0) {
                    if (DatosRetiros.count == 0) {
                        if (DatosSinAporbar.count == 0) {
                            if (DatosValidacion.count == 0) {
                                listadoNomina.push(estudiante)
                            }  
                        }
                    }
                }
            }
            return listadoNomina;
        }
    } catch (err) {
        console.error(err);
        await transaction.rollback();
        
        return 'ERROR';
    } finally {
        await transaction.commit();
        // Cerrar la conexión
        await pool.close();
    }
}

