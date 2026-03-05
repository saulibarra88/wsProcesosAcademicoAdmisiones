const { connectionAcademico } = require('../config/PollConexionesAcademico'); // Importa el pool de conexiones
const { execDinamico, execDinamicoTransaccion } = require("../config/execSQLDinamico.helper");
const { execMaster, execMasterTransaccion } = require("../config/execSQLMaster.helper");
const CONFIGMASTER = require('../config/baseMaster');
const CONFIGACADEMICO = require('../config/databaseDinamico');
const { sendResponseModelo } = require('../herramientas/responseservice');
const logger = require('./../herramientas/logger.js');

const sql = require("mssql");



module.exports.ListadoCarrerasDadoFacultad = async function (carrera, facultad) {
  var sentencia = "";
  sentencia = "SELECT c.* FROM [" + carrera + "].[dbo].[Carreras] AS c INNER JOIN [" + carrera + "].[dbo].[Escuelas] AS e ON e.strCodigo=c.strCodEscuela INNER JOIN [" + carrera + "].[dbo].[Facultades] AS f ON e.strCodFacultad=f.strCodigo WHERE F.strCodigo='" + facultad + "'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
        return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
       return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ListadoCarrerasDadoFacultad', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ListadoDocumentosfirmadosLegalizados = async function (carrera, periodo) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[solicitardocumento]  WHERE periodo='" + periodo + "' AND estadodocumento=3 AND tipoflujo='MAT'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ListadoDocumentosfirmadosLegalizados', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }

}

module.exports.ActualizarDocumentosfirmadosLegalizadosRuta = async function (carrera, periodo, iddocumento, ruta) {
  var sentencia = "";
  sentencia = "UPDATE [" + carrera + "].[dbo].[solicitardocumento] SET ruta='" + ruta + "' WHERE periodo='" + periodo + "' AND estadodocumento=3 AND tipoflujo='MAT' AND iddocumento='" + iddocumento + "'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ActualizarDocumentosfirmadosLegalizadosRuta', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}