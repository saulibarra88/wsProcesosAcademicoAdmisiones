const { connectionAcademico } = require('../config/PollConexionesAcademico'); // Importa el pool de conexiones
const { execDinamico, execDinamicoTransaccion } = require("../config/execSQLDinamico.helper");
const { execMaster, execMasterTransaccion } = require("../config/execSQLMaster.helper");
const CONFIGMASTER = require('../config/baseMaster');
const CONFIGACADEMICO = require('../config/databaseDinamico');
const { sendResponseModelo } = require('../herramientas/responseservice');
const logger = require('./../herramientas/logger.js');

const sql = require("mssql");



module.exports.ListadoSolicitudesRecordEstadoPeriodo = async function (carrera,periodo,estado) { //1 ESTADO=1 FIRMADO ESTADO 2=SOLICITADO
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[tblRecordSolicitud] WHERE [intEstado]=" + estado + " AND [strCodPeriodo]='" + periodo + "' order by dtFechaSolicita desc"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
        return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
       return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ListadoSolicitudesRecordEstadoPeriodo', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ListadoSolicitudesRecordCedula= async function (carrera,cedula) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[tblRecordSolicitud] WHERE [strCedulaEstudiante]='" + cedula + "' order by dtFechaSolicita desc"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
        return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
       return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ListadoSolicitudesRecordCedula', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.EliminarSolicitudRecord= async function (carrera,idsolicitud,strperiodo,strcedula) {
  var sentencia = "";
  sentencia = "delete from [" + carrera + "].[dbo].[tblRecordFirmaAutoridad] where [intRecod] =" + idsolicitud + ""
  sentencia2 = "delete from [" + carrera + "].[dbo].[tblRecordSolicitud] where [intIdSolicitud]=" + idsolicitud + " and [strCedulaEstudiante]='" + strcedula + "' and [strCodPeriodo]='" + strperiodo + "'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      const sqlConsulta2 = await execDinamico(carrera, sentencia2, "OK", "OK");
        return sendResponseModelo(true, sqlConsulta2, 'OK')
    } else {
       return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error EliminarSolicitudRecord', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}