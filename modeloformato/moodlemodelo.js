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

module.exports.ListadoEstudianteAsignatura = async function (carrera,periodo,nivel,paralelo,asignatura) {
  var sentencia = "";
  sentencia ="SELECT E.*,MA.* FROM [" + carrera + "].[dbo].[Matriculas] AS M INNER JOIN [" + carrera + "].[dbo].[Materias_Asignadas] AS MA ON MA.sintCodMatricula=M.sintCodigo AND M.strCodPeriodo=MA.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Estudiantes] AS E ON E.strCodigo=M.strCodEstud WHERE M.strCodEstado='DEF' AND MA.strCodNivel='" + nivel + "' AND MA.strCodParalelo='" + paralelo + "' AND M.strCodPeriodo='" + periodo + "' AND MA.strCodPeriodo='" + periodo + "' AND MA.strCodMateria='" + asignatura + "'"
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
      const sqlConsulta = await execMaster(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ListadoApellidosDocentesCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ObnterCarreraHomologacion = async function (carrera,dbcarrera,periodo) {
  var sentencia = "";
  sentencia ="SELECT h.*,C.strCodigo AS codigonivelacion, C.strNombre as nombrenivelacion ,CA.strNombre as nombrecarrera,CA.strCodigo codigocarrera FROM [" + carrera + "].[dbo].[homologacioncarreras] AS H INNER JOIN [" + carrera + "].[dbo].[Carreras] AS C ON C.strBaseDatos=H.hmbdbaseniv INNER JOIN [" + carrera + "].[dbo].[Carreras] AS CA ON CA.strBaseDatos=H.hmbdbasecar WHERE [periodo]='" + periodo + "' AND [hmbdbasecar]='" + dbcarrera + "'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execMaster(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ListadoApellidosDocentesCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.RetiroEstudiantePeriodoCarrera = async function (carrera,periodo,cedula) {
  var sentencia = "";
  sentencia ="SELECT asig.strNombre,asig.strCodigo,r.strResolucion FROM [" + carrera + "].[dbo].[Matriculas] AS M INNER JOIN [" + carrera + "].[dbo].[Retiros] AS R ON R.sintCodMatricula=M.sintCodigo AND R.strCodPeriodo=M.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Materias] AS ASIG ON ASIG.strCodigo=R.strCodMateria INNER JOIN [" + carrera + "].[dbo].[Estudiantes] AS E ON E.strCodigo=M.strCodEstud WHERE E.strCedula='" + cedula + "' AND M.strCodPeriodo='" + periodo + "' AND M.strCodEstado='DEF' AND R.strCodPeriodo='" + periodo + "'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execMaster(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error RetiroEstudiantePeriodoCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ObtenerDatosEstudianteCarrera = async function (carrera,cedula) {
  var sentencia = "";
  sentencia ="SELECT E.strNombres,E.strApellidos FROM [" + carrera + "].[dbo].[Estudiantes] AS E WHERE [strCedula]='" + cedula + "'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execMaster(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error RetiroEstudiantePeriodoCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}