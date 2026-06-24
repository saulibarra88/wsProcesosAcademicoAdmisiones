const { execDinamico, execDinamicoTransaccion } = require("../config/execSQLDinamico.helper");
const { execMaster, execMasterTransaccion } = require("../config/execSQLMaster.helper");
const CONFIGMASTER = require('../config/baseMaster');
const CONFIGACADEMICO = require('../config/databaseDinamico');
const { sendResponseModelo } = require('../herramientas/responseservice');
const logger = require('./../herramientas/logger.js');

const sql = require("mssql");




module.exports.ListadoDictadoAsignaturaCarrera = async function (carrera,periodo) {
  var sentencia = "";
  sentencia ="SELECT * FROM [" + carrera + "].[dbo].[Dictado_MateriasDocentes] AS DM INNER JOIN [" + carrera + "].[dbo].[Materias] AS M ON M.strCodigo=DM.strCodMateria INNER JOIN [" + carrera + "].[dbo].[Docentes] AS D ON D.strCodigo=DM.strCodDocente WHERE DM.strCodPeriodo='" + periodo + "'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ListadoApellidosDocentesCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ListadoEstudianteAsignatura = async function (carrera,periodo,nivel,paralelo) {
  var sentencia = "";
  sentencia ="SELECT E.*,MA.* FROM [" + carrera + "].[dbo].[Matriculas] AS M INNER JOIN [" + carrera + "].[dbo].[Materias_Asignadas] AS MA ON MA.sintCodMatricula=M.sintCodigo AND M.strCodPeriodo=MA.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Estudiantes] AS E ON E.strCodigo=M.strCodEstud WHERE M.strCodEstado='DEF' AND MA.strCodNivel='" + nivel + "' AND MA.strCodParalelo='" + paralelo + "' AND M.strCodPeriodo='" + periodo + "' AND MA.strCodPeriodo='" + periodo + "'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ListadoApellidosDocentesCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}
module.exports.ObternDatosCarreraFacultad = async function (carrera,dbcarrera) {
  var sentencia = "";
  sentencia ="SELECT F.*,C.*,F.strNombre as nombrefacultad,C.strNombre as nombrecarrera,F.strCodigo as codigofacultad,C.strCodigo as codigocarrera FROM [" + carrera + "].[dbo].[Facultades] AS F INNER JOIN [" + carrera + "].[dbo].[Escuelas] AS E ON E.strCodFacultad=F.strCodigo INNER JOIN [" + carrera + "].[dbo].[Carreras] AS C ON C.strCodEscuela=E.strCodigo WHERE C.strBaseDatos='" + dbcarrera + "'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ListadoApellidosDocentesCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}