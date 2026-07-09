const { execDinamico, execDinamicoTransaccion } = require("../config/execSQLDinamico.helper.js");
const { execMaster, execMasterTransaccion } = require("../config/execSQLMaster.helper.js");
const CONFIGMASTER = require('../config/baseMaster.js');
const CONFIGACADEMICO = require('../config/databaseDinamico.js');
const { sendResponseModelo } = require('../herramientas/responseservice.js');
const logger = require('../herramientas/logger.js');

const sql = require("mssql");




module.exports.ObtenerDatosEstuidante60CreditoAsignaturasMatricula = async function (carrera,codigo,periodo,cedula) {
  var sentencia = "";
  sentencia ="WITH CTE_DatosEstudiante AS ( SELECT E.strCodigo, E.strCedula, E.strNombres, E.strApellidos, M.sintCodigo, M.strCodPeriodo, M.strCodEstado, (SELECT MIN(CAST(mp.strCodNivel AS INT)) FROM [" + carrera + "].[dbo].Matriculas m2 INNER JOIN [" + carrera + "].[dbo].Materias_Asignadas ma ON m2.sintCodigo = ma.sintCodMatricula AND m2.strCodPeriodo = ma.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].Materias_Pensum mp ON ma.strCodMateria = mp.strCodMateria INNER JOIN [" + carrera + "].[dbo].Pensums p ON mp.strCodPensum = p.strCodigo WHERE m2.strCodPeriodo = M.strCodPeriodo AND m2.strCodEstud = E.strCodigo AND p.blnActivo = 1) AS strCodNivelMatricula, (SELECT MAX(CAST(mp2.strCodNivel AS INT)) FROM [" + carrera + "].[dbo].Materias_Pensum mp2 INNER JOIN [" + carrera + "].[dbo].Pensums p2 ON mp2.strCodPensum = p2.strCodigo WHERE p2.blnActivo = 1) AS ultimoNivelCarrera, (SELECT SUM(fltCreditos) FROM ( SELECT fltCreditos FROM [" + carrera + "].[dbo].Materias_Pensum mp3 WHERE mp3.strCodPensum IN (SELECT strCodigo FROM [" + carrera + "].[dbo].Pensums WHERE blnActivo = 1) AND mp3.strCodNivel = (SELECT MIN(CAST(mp4.strCodNivel AS INT)) FROM [" + carrera + "].[dbo].Matriculas m3 INNER JOIN [" + carrera + "].[dbo].Materias_Asignadas ma2 ON m3.sintCodigo = ma2.sintCodMatricula AND m3.strCodPeriodo = ma2.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].Materias_Pensum mp4 ON ma2.strCodMateria = mp4.strCodMateria INNER JOIN [" + carrera + "].[dbo].Pensums p3 ON mp4.strCodPensum = p3.strCodigo WHERE m3.strCodPeriodo = M.strCodPeriodo AND m3.strCodEstud = E.strCodigo AND p3.blnActivo = 1) AND mp3.strCodTipo = 'NOR' UNION ALL SELECT TOP (1) fltCreditos FROM [" + carrera + "].[dbo].Materias_Pensum mp5 WHERE mp5.strCodPensum IN (SELECT strCodigo FROM [" + carrera + "].[dbo].Pensums WHERE blnActivo = 1) AND mp5.strCodNivel = (SELECT MIN(CAST(mp6.strCodNivel AS INT)) FROM [" + carrera + "].[dbo].Matriculas m4 INNER JOIN [" + carrera + "].[dbo].Materias_Asignadas ma3 ON m4.sintCodigo = ma3.sintCodMatricula AND m4.strCodPeriodo = ma3.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].Materias_Pensum mp6 ON ma3.strCodMateria = mp6.strCodMateria INNER JOIN [" + carrera + "].[dbo].Pensums p4 ON mp6.strCodPensum = p4.strCodigo WHERE m4.strCodPeriodo = M.strCodPeriodo AND m4.strCodEstud = E.strCodigo AND p4.blnActivo = 1) AND mp5.strCodTipo = 'PITI' ORDER BY mp5.strCodMateria ) t) AS creditosObligatorioNivel, (SELECT SUM(mp7.fltCreditos) FROM [" + carrera + "].[dbo].Matriculas m5 INNER JOIN [" + carrera + "].[dbo].Materias_Asignadas ma4 ON m5.sintCodigo = ma4.sintCodMatricula AND m5.strCodPeriodo = ma4.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].Materias_Pensum mp7 ON mp7.strCodMateria = ma4.strCodMateria WHERE m5.strCodPeriodo = M.strCodPeriodo AND m5.strCodEstud = E.strCodigo AND mp7.strCodPensum IN (SELECT strCodigo FROM [" + carrera + "].[dbo].Pensums WHERE blnActivo = 1)) AS numCreditosPropuestaMatricula, I.boolGratuidadT, I.boolGratuidad30 FROM [" + carrera + "].[dbo].[Estudiantes] E INNER JOIN [" + carrera + "].[dbo].[Matriculas] M ON E.strCodigo = M.strCodEstud LEFT JOIN [OAS_Master].dbo.Inscripciones I ON I.strCedEstud = E.strCedula AND I.strCodCarrera = '" + codigo + "'  WHERE E.strCedula = '" + cedula + "' AND M.strCodPeriodo = '" + periodo + "' ) SELECT strCodigo, strCedula, strNombres, strApellidos, sintCodigo, strCodPeriodo, strCodEstado, strCodNivelMatricula, ultimoNivelCarrera, creditosObligatorioNivel, creditosObligatorioNivel * 0.6 AS creditosObligatorioNivel60, numCreditosPropuestaMatricula, ISNULL(boolGratuidadT, 0) AS gratitudCarrera, ISNULL(boolGratuidad30, 0) AS pierdeGratitud30P0rciento, CAST(CASE WHEN ultimoNivelCarrera = strCodNivelMatricula THEN 1 WHEN (creditosObligatorioNivel * 0.6) <= numCreditosPropuestaMatricula THEN 1 ELSE 0 END AS BIT) AS gratitud60 FROM CTE_DatosEstudiante;"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ObtenerDatosEstuidante60CreditoAsignaturasMatricula', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ObtenerMasterDatosCarreraCodigo = async function (carrera,codigo) {
  var sentencia = "";
    sentencia="SELECT F.strNombre as strNombreFacultad, C.strNombre as strNombreCarrera, * FROM [" + carrera + "].[dbo].Facultades AS F INNER JOIN [" + carrera + "].[dbo].Escuelas AS E ON E.strCodFacultad=F.strCodigo INNER JOIN [" + carrera + "].[dbo].Carreras AS C ON C.strCodEscuela=E.strCodigo  WHERE C.strCodigo='" + codigo + "' "
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ObtenerMasterDatosCarreraCodigo', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}
