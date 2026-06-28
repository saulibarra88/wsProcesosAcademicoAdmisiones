const axios = require('axios');
const cron = require('node-cron');
const pathimage = require('path');
const procesoCupo = require('../modelo/procesocupos');
const procesonotasacademicos = require('../modelo/procesonotasacademicos');
const tools = require('./tools');
const fs = require("fs");
const https = require('https');
const crypto = require("crypto");

const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});


module.exports.ListadoEstudiantes = async function (strBaseCarrera, periodo, idestado, percodigoadmision) {
    try {
        try {
            var ListadoEstudiantes = [];
            var ListadoEstudiantesProceso = [];
            //  var periodoactivoadmision = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/periodos/activos" , { httpsAgent: agent });
            var ofertaAcademica = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/cupo_carrera/periodo/" + percodigoadmision, { httpsAgent: agent });
            var objCarreraOferta = '';
            var cupCusId = '';
            if (ofertaAcademica.data.length > 0) {
                const ofertaEncontrada = ofertaAcademica.data.find(oferta => strBaseCarrera === oferta.cupDbNivelacion);
                if (ofertaEncontrada) {
                    objCarreraOferta = ofertaEncontrada;
                    cupCusId = objCarreraOferta.cupCusId;
                } else {
                    objCarreraOferta.cupCusId = 0;
                    cupCusId = 0;
                }
                const content = {
                    cusId: cupCusId,
                    estId: idestado,
                    perNomenclatura: periodo
                }
                ListadoEstudiantes = await axios.post("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/asignacion_cupo/list_carrera_cusid_estado", content, { httpsAgent: agent });
                if (ListadoEstudiantes.data.length > 0) {
                    for (var obj of ListadoEstudiantes.data) {
                        var DatosMatriculas = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/matricula_inscripcion/asignacion_cupo/" + obj.acuId, { httpsAgent: agent });
                        var Exoneracion = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/exoneracion/asignacion_cupo/" + obj.acuId, { httpsAgent: agent });
                        var contador = 0;
                        if (DatosMatriculas.data) {
                            obj.habilitarMatricula = true;
                            obj.minsFecha = DatosMatriculas.data.minsFecha;
                            obj.minsId = DatosMatriculas.data.minsId;

                        } else {
                            obj.habilitarMatricula = false;
                            obj.minsFecha = "";
                            obj.minsId = null;

                        }
                        if (Exoneracion.data) {
                            obj.minsCarrera = true

                        } else {
                            obj.minsCarrera = false
                        }
                        ListadoEstudiantesProceso.push(obj);
                    }
                }
            }
            return ListadoEstudiantesProceso;
        } catch (error) {
            console.error(error);
            
            return 'ERROR';
        }
    } catch (err) {
        console.error(err);
        
        return 'ERROR';
    }
}

module.exports.ListadoEstadosAdmisiones = async function (strBaseCarrera, periodo) {
    try {
        try {
            var ListadoEstados = [];

            var periodoactivoadmision = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/periodos/activos", { httpsAgent: agent });
            var ofertaAcademica = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/cupo_carrera/periodo/" + periodoactivoadmision.data[0].perCodigo, { httpsAgent: agent });
            var objCarreraOferta = '';

            if (ofertaAcademica.data.length > 0) {
                for (var oferta of ofertaAcademica.data) {
                    if (strBaseCarrera === oferta.cupDbNivelacion) {
                        objCarreraOferta = oferta
                    }
                }
                const content = {
                    cusId: objCarreraOferta.cupCusId,
                }
                var informacion = await axios.post("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/asignacion_cupo/estados_carrera_cusid", content, { httpsAgent: agent });
                if (informacion.data.length > 0) {
                    ListadoEstados = informacion.data;
                }
            }

            return ListadoEstados;
        } catch (error) {
            console.error(error);
            
            return 'ERROR';
        }
    } catch (err) {
        console.error(err);
        
        return 'ERROR';
    }
}
module.exports.ListadoAspiranteAdmisiones = async function (strBaseCarrera, periodoAdmisiones) {
    try {
        try {
            var ListadoEstados = [];
            var DatosBaseCarrera = await procesoCupo.ObtenerDatosBase(strBaseCarrera);
            if (DatosBaseCarrera && DatosBaseCarrera.data && DatosBaseCarrera.data.length > 0) {
                if (DatosBaseCarrera.data[0].strSede == 'NORTE') {
                    DatosBaseCarrera.data[0].strSede = 'ORELLANA';
                }
                if (DatosBaseCarrera.count > 0) {
                    var informacion = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/aspirante_sede/list_periodo/" + periodoAdmisiones, { httpsAgent: agent });
                    if (informacion.data && informacion.data.length > 0) {

                        var DatosPeriodoAcademico = await procesoCupo.ObtenerPeriodoDadoCodigo(informacion.data[0].Periodo.perNomenclatura);
                        var PeriodoAcademico;

                        if (DatosPeriodoAcademico && DatosPeriodoAcademico.count > 0 && DatosPeriodoAcademico.data && DatosPeriodoAcademico.data.length > 0) {
                            PeriodoAcademico = DatosPeriodoAcademico.data[0];
                        } else {
                            var datos = {
                                strCodigo: "NINGUNO",
                                strDescripcion: "NINGUNO",
                                dtFechaInic: "NINGUNO",
                                dtFechaFin: "NINGUNO",
                                dtFechaTopeMatOrd: "NINGUNO",
                                dtFechaTopeMatExt: "NINGUNO",
                                dtFechaTopeMatPro: "NINGUNO",
                                dtFechaTopeRetMat: "NINGUNO",
                                strCodReglamento: "NINGUNO",
                            };
                            PeriodoAcademico = datos;
                        }

                        // 1. Filtrar los aspirantes por sede primero para evitar llamadas HTTP innecesarias
                        var sedeBuscada = DatosBaseCarrera.data[0].strSede;
                        var aspirantesFiltrados = informacion.data.filter(function (objAspirante) {
                            return objAspirante.Sede && 
                                   objAspirante.Sede.sedDescripcion && 
                                   tools.palabraIncluidaEnFrase(objAspirante.Sede.sedDescripcion, sedeBuscada);
                        });

                        // 2. Si periodoAdmisiones >= 12, resolver campos de conocimiento de forma eficiente y secuencial
                        if (periodoAdmisiones >= 12) {
                            // Obtener combinaciones únicas de pccId y ccoId para no duplicar peticiones
                            var mapaClavesUnicas = new Map();
                            for (var objAspirante of aspirantesFiltrados) {
                                if (objAspirante.PeriodoCconocimiento && objAspirante.PeriodoCconocimiento.CampoConocimiento) {
                                    var pccId = objAspirante.PeriodoCconocimiento.pccCampoId;
                                    var ccoId = objAspirante.PeriodoCconocimiento.CampoConocimiento.ccoId;
                                    var clave = `${pccId}_${ccoId}`;
                                    mapaClavesUnicas.set(clave, { pccId: pccId, ccoId: ccoId });
                                }
                            }

                            // Consultar secuencialmente con reintento (máximo 3 intentos por clave única)
                            var cacheCampos = new Map();
                            for (var [clave, ids] of mapaClavesUnicas.entries()) {
                                var responseData = null;
                                var maxRetries = 3;
                                for (var i = 0; i < maxRetries; i++) {
                                    try {
                                        var response = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_configuracion/campo_conocimiento/campo_xidytipo/" + ids.pccId + '/' + ids.ccoId, { httpsAgent: agent });
                                        if (response && response.data) {
                                            responseData = response.data;
                                            break; // Romper bucle de reintentos en caso de éxito
                                        }
                                    } catch (err) {
                                        console.error(`Intento ${i + 1} falló al obtener campo de conocimiento (${ids.pccId}/${ids.ccoId}):`, err.message);
                                        if (i < maxRetries - 1) {
                                            // Pequeña espera de 200ms antes de reintentar
                                            await new Promise(function (resolve) { setTimeout(resolve, 200); });
                                        }
                                    }
                                }
                                cacheCampos.set(clave, responseData);
                            }

                            // Asignar los campos correspondientes a los aspirantes filtrados
                            for (var objAspirante of aspirantesFiltrados) {
                                objAspirante.PeriodoAcademico = PeriodoAcademico;
                                if (objAspirante.PeriodoCconocimiento && objAspirante.PeriodoCconocimiento.CampoConocimiento) {
                                    var clave = `${objAspirante.PeriodoCconocimiento.pccCampoId}_${objAspirante.PeriodoCconocimiento.CampoConocimiento.ccoId}`;
                                    var datosCampo = cacheCampos.get(clave);
                                    if (datosCampo) {
                                        objAspirante.camCodigo = datosCampo.camCodigo;
                                        objAspirante.camNombre = datosCampo.camNombre;
                                    } else {
                                        objAspirante.camCodigo = '';
                                        objAspirante.camNombre = '';
                                    }
                                } else {
                                    objAspirante.camCodigo = '';
                                    objAspirante.camNombre = '';
                                }
                                ListadoEstados.push(objAspirante);
                            }
                        } else {
                            // Si periodoAdmisiones < 12, se asigna el periodo y se limpian camCodigo / camNombre
                            for (var objAspirante of aspirantesFiltrados) {
                                objAspirante.PeriodoAcademico = PeriodoAcademico;
                                objAspirante.camCodigo = '';
                                objAspirante.camNombre = '';
                                ListadoEstados.push(objAspirante);
                            }
                        }
                    }
                }
            }
            return ListadoEstados;
        } catch (error) {
            console.error(error);
            return 'ERROR';
        }
    } catch (err) {
        console.error(err);
        return 'ERROR';
    }
}
module.exports.ObtenerPeriodoVigenteAdmisiones = async function () {
    try {
        try {
            var ListadoEstados = [];
            var informacion = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/periodos", { httpsAgent: agent });
            if (informacion.data.length > 0) {
                for (var objPeriodo of informacion.data) {
                    if (objPeriodo.perVigente) {
                        ListadoEstados.push(objPeriodo)
                    }
                }
            }
            return ListadoEstados;
        } catch (error) {
            console.error(error);
            
            return 'ERROR';
        }
    } catch (err) {
        console.error(err);
        
        return 'ERROR';
    }
}
module.exports.pdfComprobanteCupo = async function (acuId) {
    try {
        try {

            var informacion = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/asignacion_cupo/conprobantepdf/" + acuId, { httpsAgent: agent });
            return informacion.data;
        } catch (error) {
            console.error(error);
            
            return 'ERROR';
        }
    } catch (err) {
        console.error(err);
        
        return 'ERROR';
    }
}

module.exports.ListadoHomologacionesCarreras = async function () {
    try {
        try {
            var ListadoEstudiantes = [];
            var ListadoEstudiantesProceso = [];
            var periodoactivoadmision = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/periodos/activos", { httpsAgent: agent });
            var ofertaAcademica = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/cupo_carrera/periodo/" + periodoactivoadmision.data[0].perCodigo, { httpsAgent: agent });
            var objCarreraOferta = '';
            if (ofertaAcademica.data.length > 0) {
                for (var oferta of ofertaAcademica.data) {
                    var carreraNivelacion = await procesoCupo.ObtenerDatosBase(oferta.cupDbNivelacion)
                    var carrera = await procesoCupo.ObtenerDatosBase(oferta.cupDbCarrera)
                    oferta.cupNombreCarrera = carrera.data[0].strNombreCarrera
                    oferta.cupNombreNivelacion = carreraNivelacion.data[0].strNombreCarrera
                    var carreraHomolo = await procesoCupo.ObtenerVerificacionHomologacionCarreraIngreso(oferta.Periodo.perNomenclatura, oferta.cupDbCarrera)
                    if (carreraHomolo.count > 0) {
                        oferta.blactiva = true
                    } else {
                        oferta.blactiva = false
                    }

                    ListadoEstudiantesProceso.push(oferta)
                }

            }
            return ListadoEstudiantesProceso;
        } catch (error) {
            console.error(error);
            
            return 'ERROR';
        }
    } catch (err) {
        console.error(err);
        
        return 'ERROR';
    }
}

