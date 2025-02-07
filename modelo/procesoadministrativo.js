const { connectionAcademico } = require('./../config/PollConexionesAcademico'); // Importa el pool de conexiones
const { execDinamico, execDinamicoTransaccion } = require("./../config/execSQLDinamico.helper");
const { execMaster, execMasterTransaccion } = require("./../config/execSQLMaster.helper");
const CONFIGACADEMICO = require('./../config/databaseDinamico');
const sql = require("mssql");
var os = require('os');
const fs = require('fs');
const path = require('path');

module.exports.ListarConfigHomologacionesFecha = async function ( carrera, periodo) {
    var sentencia = "";
    sentencia = "select * from [" + carrera + "].[seguridad].[confighomologacionesfechas] where chf_estado=1 and chf_periodo='" + periodo + "' order by chf_id desc"
    try {
      if (sentencia != "") {
        const sqlconsulta = await execDinamico( carrera, sentencia, "OK", "OK");
        return (sqlconsulta)
      } else {
        return { data: "vacio sql" }
      }
    } catch (error) {
      return { data: "Error: " + error }
    }
  }
  module.exports.ListarConfigHomologacionesCarrerasHistorial = async function ( carrera, bdCarrera) {
    var sentencia = "";
    sentencia = "select * from [" + carrera + "].[seguridad].[confighomologacionesfechas] where chf_bdcarrera='" + bdCarrera + "' order by chf_id desc"
    try {
      if (sentencia != "") {
        const sqlconsulta = await execDinamico( carrera, sentencia, "OK", "OK");
        return (sqlconsulta)
      } else {
        return { data: "vacio sql" }
      }
    } catch (error) {
      return { data: "Error: " + error }
    }
  }
  module.exports.InsertarHomologacionesFechas = async function ( carrera, datos) {
    var sentencia = "";
    sentencia = "INSERT INTO  [" + carrera + "].[seguridad].[confighomologacionesfechas] ([chf_fechainicio],[chf_horainicio],[chf_fechafin],[chf_horafin],[chf_periodo],[chf_proceso],[chf_ruta],[chf_bdcarrera],[chf_codigocarrera],[chf_carrera],[chf_peridregistro],[chf_regid],[chf_resolucion] ) VALUES ('" + datos.chf_fechainicio + "','" + datos.chf_horainicio + "','" + datos.chf_fechafin + "','" + datos.chf_horafin + "','" + datos.chf_periodo + "','" + datos.chf_proceso + "','" + datos.chf_ruta + "','" + datos.chf_bdcarrera + "','" + datos.chf_codigocarrera + "','" + datos.chf_carrera + "','" + datos.chf_peridregistro + "'," + datos.chf_regid + ",'" + datos.chf_resolucion + "') "
    try {
      if (sentencia != "") {
        const sqlconsulta = await execDinamico( carrera, sentencia, "OK", "OK");
        return (sqlconsulta)
      } else {
        return { data: "vacio sql" }
      }
    } catch (error) {
      return { data: "Error: " + error }
    }
  }

  module.exports.ActualizarEstadoHomologacionFechas = async function ( carrera,bdCarrera, estado,periodo) {
    var sentencia = "";
    sentencia = "UPDATE [" + carrera + "].[seguridad].[confighomologacionesfechas] SET chf_estado=" + estado + " where chf_bdcarrera= '" + bdCarrera+ "' and chf_periodo= '" + periodo+ "'"
    try {
      if (sentencia != "") {
        const sqlconsulta = await execDinamico( carrera, sentencia, "OK", "OK");
        return (sqlconsulta)
      } else {
        return { data: "vacio sql" }
      }
    } catch (error) {
      return { data: "Error: " + error }
    }
  }

  module.exports.ObtenerHomologacionFechaDadoBaseCarrera = async function ( carrera,bdCarrera, periodo) {
    var sentencia = "";
    sentencia = "select * from  [" + carrera + "].[seguridad].[confighomologacionesfechas]  where chf_bdcarrera= '" + bdCarrera+ "' and chf_periodo= '" + periodo+ "' "
    try {
      if (sentencia != "") {
        const sqlconsulta = await execDinamico( carrera, sentencia, "OK", "OK");
        return (sqlconsulta)
      } else {
        return { data: "vacio sql" }
      }
    } catch (error) {
      return { data: "Error: " + error }
    }
  }

  module.exports.ObtenerCarreraHomologacionVigente = async function ( carrera,bdCarrera, periodo) {
    var sentencia = "";
    sentencia = "select * from  [" + carrera + "].[seguridad].[confighomologacionesfechas]  where chf_bdcarrera= '" + bdCarrera+ "' and chf_periodo= '" + periodo+ "' and chf_estado=1"
    try {
      if (sentencia != "") {
        const sqlconsulta = await execDinamico( carrera, sentencia, "OK", "OK");
        return (sqlconsulta)
      } else {
        return { data: "vacio sql" }
      }
    } catch (error) {
      return { data: "Error: " + error }
    }
  }

  module.exports.ObtenerDatosEstudianteApellidos = async function (carrera,apellidos) {
    var sentencia = "";
    sentencia = "select strCedula,strNombres,strApellidos,strClave,dtFechaNac,strLugarNac,strNacionalidad,strDir,strTel,strEmail from [" + carrera + "].[dbo].[Estudiantes] where strApellidos like '%" + apellidos+ "%'"
    try {
      if (sentencia != "") {
        const sqlconsulta = await execMaster( carrera, sentencia, "OK", "OK");
        return (sqlconsulta)
      } else {
        return { data: "vacio sql" }
      }
    } catch (error) {
      return { data: "Error: " + error }
    }
  }