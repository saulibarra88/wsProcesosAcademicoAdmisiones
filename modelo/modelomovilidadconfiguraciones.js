const { connectionAcademico } = require('../config/PollConexionesAcademico'); // Importa el pool de conexiones
const {  execDinamico,execDinamicoTransaccion} = require("../config/execSQLDinamico.helper");
const {  execMaster,execMasterTransaccion} = require("../config/execSQLMaster.helper");
const CONFIGMASTER = require('../config/baseMaster');
const CONFIGACADEMICO = require('../config/databaseDinamico');

const sql = require("mssql");
var os = require('os');

module.exports.ListadoFacultadesAdministracion = async function (carrera) {
    var sentencia="";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Facultades] "; 
    try {
    if (sentencia != "") {
      const sqlConsulta = await execMaster(carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }

  module.exports.ListadoFacultadesActivas = async function (carrera) {
    var sentencia=""; 
    sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Facultades] WHERE [strCodigo] NOT IN ('CAA','FXM') "; 
    try {
    if (sentencia != "") {
      const sqlConsulta = await execMaster(carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }

    module.exports.ListadoEscuelaAdministracion = async function (carrera, facultad) {
    var sentencia=""; 
    sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Escuelas] WHERE [strCodFacultad] = '" + facultad + "'"; 
    try {
    if (sentencia != "") {
      const sqlConsulta = await execMaster(carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }