
const { connectionAcademico } = require('../config/PollConexionesAcademico'); // Importa el pool de conexiones
const { execDinamico, execDinamicoTransaccion } = require("../config/execSQLDinamico.helper");
const { execMaster, execMasterTransaccion } = require("../config/execSQLMaster.helper");
const CONFIGMASTER = require('../config/baseMaster');
const CONFIGACADEMICO = require('../config/databaseDinamico');
const { sendResponseModelo } = require('../herramientas/responseservice');
const logger = require('./../herramientas/logger.js');

const sql = require("mssql");



module.exports.EncontrarEstudianteMatriculaTodas = async function (carrera, cedula) {
  var sentencia = "";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matriculas] as m  INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on m.strCodEstud=e.strCodigo INNER JOIN [" + carrera + "].[dbo].[Periodos] as p on m.strCodPeriodo=p.strCodigo WHERE e.strCedula='" + cedula + "' and  m.strCodEstado='DEF' ORDER BY m.dtFechaCreada DESC"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
        return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
       return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error EncontrarEstudianteMatriculaTodas', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}
module.exports.EncontrarSolicitudesTercerasTodas = async function (carrera, cedula) {
  var sentencia = "";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[solicitudtercera] AS S INNER JOIN [" + carrera + "].[dbo].[bandejasolicitud] AS B ON B.idsolicitud=S.idsolt WHERE S.[soltestado]='APR' AND S.[soltcedula]='" + cedula + "' ORDER BY [soltfecha] DESC"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
        return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
       return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error EncontrarSolicitudesTercerasTodas', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.EncontrarSolicitudesValidacionTodas = async function (carrera, cedula) {
  var sentencia = "";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[solicitudvalidacion] AS SO INNER JOIN [" + carrera + "].[dbo].[Estudiantes] AS E ON E.strCodigo=SO.svalcodestud INNER JOIN [" + carrera + "].[dbo].[Periodos] AS P ON P.strCodigo=SO.svalcodperiodo WHERE E.strCedula='" + cedula + "' AND SO.svalestado='FIN' ORDER BY SO.svalfecharegistro DESC"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
        return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
       return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error EncontrarSolicitudesValidacionTodas', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.EncontrarSolicitudesMovilidadesTodas = async function (carrera, cedula) {
  var sentencia = "";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud] AS S INNER JOIN [" + carrera + "].[dbo].[tb_movilidad_solicitud_documentos] AS D ON D.msd_idsolicitud=S.cm_id INNER JOIN [" + carrera + "].[dbo].[Periodos] AS P ON P.strCodigo=S.cm_periodo WHERE S.cm_identificacion='" + cedula + "' AND S.cm_idtipo_estado='APRO' AND cm_estado=1 ORDER BY S.cm_fecha_registro DESC"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
        return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
       return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error EncontrarSolicitudesMovilidadesTodas', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.EncontrarSolicitudesRetirosTodos = async function (carrera, cedula) {
  var sentencia = "";
  sentencia="SELECT P.strCodigo AS strcodigoperiodo,* FROM [" + carrera + "].[dbo].[Retiros] AS R INNER JOIN [" + carrera + "].[dbo].[Periodos] AS P ON P.strCodigo=R.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Materias] AS M ON M.strCodigo=R.strCodMateria INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS MA ON MA.sintCodigo=R.sintCodMatricula INNER JOIN [" + carrera + "].[dbo].[Estudiantes] AS E ON E.strCodigo=MA.strCodEstud WHERE E.strCedula='" + cedula + "' ORDER BY R.dtFechaAsentado DESC"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
        return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
       return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error EncontrarSolicitudesRetirosTodos', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

