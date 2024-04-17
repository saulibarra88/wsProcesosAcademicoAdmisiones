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
            var DatosBaseHomologacion = await procesoCupo.ObtenerCusIdBaseNivelacion(strBaseCarrera, periodo);
            if (DatosBaseHomologacion.count > 0) {
                const content = {
                    cusId: DatosBaseHomologacion.data[0].hmbdbaseinsc,
                    estId: idestado,
                }
                console.log(content)
                ListadoEstudiantes = await axios.post("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/asignacion_cupo/list_carrera_cusid_estado", content, { httpsAgent: agent });
                if (ListadoEstudiantes.data.length > 0) {
                    for (var obj of ListadoEstudiantes.data) {
                     var   DatosMatriculas = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/matricula_inscripcion/asignacion_cupo/" + obj.acuId, { httpsAgent: agent });
                     var   Exoneracion = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/exoneracion/asignacion_cupo/" + obj.acuId, { httpsAgent: agent });
               
                     var contador=0;
                   
                        if (DatosMatriculas.data) {
                            obj.habilitarMatricula = true;
                            obj.minsFecha = DatosMatriculas.data.minsFecha;
                            obj.minsId = DatosMatriculas.data.minsId;
                         
                        } else {
                            obj.habilitarMatricula = false;
                            obj.minsFecha = "";
                            obj.minsId = null;
                         
                        }
                        if(Exoneracion.data){
                            obj.minsCarrera=true  
                           
                        }else{
                            obj.minsCarrera=false
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
            var DatosBaseHomologacion = await procesoCupo.ObtenerCusIdBaseNivelacion(strBaseCarrera, periodo);
            if (DatosBaseHomologacion.count > 0) {
                const content = {
                    cusId: DatosBaseHomologacion.data[0].hmbdbaseinsc
                }
               var informacion = await axios.post("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/asignacion_cupo/estados_carrera_cusid", content, { httpsAgent: agent });
                if (informacion.data.length > 0) {
                    ListadoEstados=informacion.data;
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
        
               var informacion = await axios.get("https://apinivelacionplanificacion.espoch.edu.ec/api_m4/m_admision/asignacion_cupo/conprobantepdf/"+acuId, { httpsAgent: agent });
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

