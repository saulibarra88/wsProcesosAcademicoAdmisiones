const { connectionAcademico } = require('./../config/PollConexionesAcademico'); // Importa el pool de conexiones
const {  execDinamico,execDinamicoTransaccion} = require("./../config/execSQLDinamico.helper");
const {  execMaster} = require("./../config/execSQLMaster.helper");
const CONFIGACADEMICO = require('./../config/databaseDinamico');
const sql = require("mssql");
var os = require('os');


module.exports.ObtenerCarrerasMater = async function (carrera,estado) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[Carreras] AS c WHERE c.strCodEstado= '" + estado + "';"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }

}

module.exports.ActualizarNotaExonerados = async function (carrera,periodo) {
    var sentencia="";
    sentencia="UPDATE [" + carrera + "].[dbo].[Notas_Examenes]  SET Notas_Examenes.bytNota=12 WHERE (strCodPeriodo = '" + periodo + "') AND (strCodTipoExamen = 'PRI') AND (strCodEquiv = 'E') AND (bytNota = 0)"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }

}
module.exports.ActualizarActasGeneradasAutomaticamenteFechas = async function (carrera,periodo,tipo) {
    var sentencia="";
    sentencia="UPDATE [" + carrera + "].[dbo].[Acta]  SET actestado=2 WHERE strCodPeriodo='" + periodo + "' AND tipcodigo='" + tipo + "' AND tipoactagenerado=2 AND actestado=1"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }

}