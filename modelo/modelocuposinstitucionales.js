const { connectionAcademico } = require('../config/PollConexionesAcademico'); // Importa el pool de conexiones
const {  execDinamico,execDinamicoTransaccion} = require("../config/execSQLDinamico.helper");
const {  execMaster,execMasterTransaccion} = require("../config/execSQLMaster.helper");
const CONFIGMASTER = require('../config/baseMaster');
const CONFIGACADEMICO = require('../config/databaseDinamico');

const sql = require("mssql");
var os = require('os');

module.exports.ObtenerCupoEstudianteDadoCarrera = async function (carrera,cedula,bdBase) {
    var sentencia="";
    sentencia = "select * from [" + carrera + "].[cupos].[tb_cupos]  where [c_identificacion]='" + cedula + "' and ([c_dbnivelacion]='" + bdBase + "' or [c_dbcarrera]='" + bdBase + "')"; 
  
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

module.exports.InsertaDetalleAdmisiones = async function (carrera,objDetalle) {
    var sentencia="";
    sentencia = "INSERT INTO [" + carrera + "].[cupos].[tb_detalle_cupo]([dc_idcupo],[dc_idestado],[dc_periodo],[dc_dbcarrera],[dc_observacion],[dc_rutaarchivo],[dc_per_id],[dc_dbnivelacion],[dc_cupo_admision])"
    + "VALUES(" +  objDetalle.dc_idcupo + "," + objDetalle.dc_idestado + ",'" + objDetalle.dc_periodo + "','" + objDetalle.dc_dbcarrera + "','" + objDetalle.dc_observacion + "','" + objDetalle.dc_rutaarchivo + "'," +objDetalle.dc_per_id + ",'" + objDetalle.dc_dbnivelacion + "'," +objDetalle.dc_cupo_admision + ");";
  
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