const axios = require('axios');
const cron = require('node-cron');
const pathimage = require('path');
const nomenclatura = require('../config/nomenclatura');
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


module.exports.ListadoEstudiantes = async function (strBaseCarrera, periodo, idestado) {
    try {
        try {
            var ListadoEstudiantes = [];
            var ListadoEstudiantesProceso = [];
            var periodoactivoadmision = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/periodos/activos" , { httpsAgent: agent });
            var ofertaAcademica = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/cupo_carrera/periodo/" + periodoactivoadmision.data[0].perCodigo, { httpsAgent: agent });
   
            var objCarreraOferta='';
       
            if (ofertaAcademica.data.length > 0) {
            for (var oferta of ofertaAcademica.data) {
                if(strBaseCarrera===oferta.cupDbNivelacion){
                    objCarreraOferta=oferta
                }
            }
            const content = {
                cusId: objCarreraOferta.cupCusId,
                estId: idestado,
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
        console.log(error);
        return 'ERROR';
    }
}

module.exports.ListadoEstadosAdmisiones = async function (strBaseCarrera, periodo) {
    try {
        try {
            var ListadoEstados = [];
            
            var periodoactivoadmision = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/periodos/activos" , { httpsAgent: agent });
            var ofertaAcademica = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/cupo_carrera/periodo/" + periodoactivoadmision.data[0].perCodigo, { httpsAgent: agent });
            var objCarreraOferta='';
       
            if (ofertaAcademica.data.length > 0) {
            for (var oferta of ofertaAcademica.data) {
                if(strBaseCarrera===oferta.cupDbNivelacion){
                    objCarreraOferta=oferta
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
        console.log(error);
        return 'ERROR';
    }
}
module.exports.ListadoAspiranteAdmisiones = async function (strBaseCarrera, periodoAdmisiones) {
    try {
        try {
            var ListadoEstados = [];
            var DatosBaseCarrera = await procesoCupo.ObtenerDatosBase(strBaseCarrera);
            if (DatosBaseCarrera.data[0].strSede == 'NORTE') {
                DatosBaseCarrera.data[0].strSede = 'ORELLANA'
            }
            if (DatosBaseCarrera.count > 0) {
                var informacion = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/aspirante_sede/list_periodo/" + periodoAdmisiones, { httpsAgent: agent });
                if (informacion.data.length > 0) {
                    
                    var DatosPeriodoAcademico = await procesoCupo.ObtenerPeriodoDadoCodigo(informacion.data[0].Periodo.perNomenclatura);

                    if (DatosPeriodoAcademico.count > 0) {
                        var PeriodoAcademico = DatosPeriodoAcademico.data[0]
                    } else {
                        let datos = {
                            strCodigo: "NINGUNO",
                            strDescripcion: "NINGUNO",
                            dtFechaInic: "NINGUNO",
                            dtFechaFin: "NINGUNO",
                            dtFechaTopeMatOrd: "NINGUNO",
                            dtFechaTopeMatExt: "NINGUNO",
                            dtFechaTopeMatPro: "NINGUNO",
                            dtFechaTopeRetMat: "NINGUNO",
                            strCodReglamento: "NINGUNO",
                        }
                        PeriodoAcademico = datos;
                    }
                    for (var objAspirante of informacion.data) {
                        var verificarsede = tools.palabraIncluidaEnFrase(objAspirante.Sede.sedDescripcion, DatosBaseCarrera.data[0].strSede);
                        if (verificarsede) {
                            objAspirante.PeriodoAcademico = PeriodoAcademico
                            ListadoEstados.push(objAspirante)
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
        console.log(error);
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
        console.log(error);
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
        console.log(error);
        return 'ERROR';
    }
}

module.exports.ListadoHomologacionesCarreras = async function () {
    try {
        try {
            var ListadoEstudiantes = [];
            var ListadoEstudiantesProceso = [];
            var periodoactivoadmision = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/periodos/activos" , { httpsAgent: agent });
            var ofertaAcademica = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/cupo_carrera/periodo/" + periodoactivoadmision.data[0].perCodigo, { httpsAgent: agent });
          //  var ofertaAcademica = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/cupo_carrera/periodo/" +9, { httpsAgent: agent });
            var objCarreraOferta='';
            if (ofertaAcademica.data.length > 0) {
            for (var oferta of ofertaAcademica.data) {
              var carreraNivelacion= await procesoCupo.ObtenerDatosBase(oferta.cupDbNivelacion)
              var carrera=await procesoCupo.ObtenerDatosBase(oferta.cupDbCarrera)
              oferta.cupNombreCarrera=carrera.data[0].strNombreCarrera
              oferta.cupNombreNivelacion=carreraNivelacion.data[0].strNombreCarrera
              var carreraHomolo=await procesoCupo.ObtenerVerificacionHomologacionCarreraIngreso(oferta.Periodo.perNomenclatura,oferta.cupDbCarrera)
              if(carreraHomolo.count>0){
                oferta.blactiva=true
              }else{
                oferta.blactiva=false
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
        console.log(error);
        return 'ERROR';
    }
}

