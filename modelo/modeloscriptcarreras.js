const { connectionAcademico } = require('../config/PollConexionesAcademico'); // Importa el pool de conexiones
const {  execDinamico,execDinamicoTransaccion} = require("../config/execSQLDinamico.helper");
const {  execMaster,execMasterTransaccion} = require("../config/execSQLMaster.helper");
const CONFIGMASTER = require('../config/baseMaster');
const CONFIGACADEMICO = require('../config/databaseDinamico');

const sql = require("mssql");
var os = require('os');

module.exports.ObtenerCupoEstudianteDadoCarrera = async function (carrera,periodo,bdBase) {
    var sentencia="";
    sentencia = "select * from [" + carrera + "].[dbo].[Periodos]  where [strCodigo]='" + cedula + "' and ([c_dbnivelacion]='" + bdBase + "' or [c_dbcarrera]='" + bdBase + "')"; 
  
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