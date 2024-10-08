const { connectionAcademico } = require('./../config/PollConexionesAcademico'); // Importa el pool de conexiones
const { execDinamico, execDinamicoTransaccion } = require("./../config/execSQLDinamico.helper");
const { execMaster, execMasterTransaccion } = require("./../config/execSQLMaster.helper");
const CONFIGACADEMICO = require('./../config/databaseDinamico');
const sql = require("mssql");
var os = require('os');
const fs = require('fs');
const path = require('path');


module.exports.ObtenerDocumentosMatriculas = async function ( carrera, periodo) {
    var sentencia = "";
    sentencia = " select * from [" + carrera + "].[dbo].[bandejadocumentos] where periodo='" + periodo + "'"
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
  module.exports.TotalDocumentoPendientes = async function ( carrera, periodo) {
    var sentencia = "";
    sentencia = " select count (distinct(matricula)) as total from [" + carrera + "].[dbo].[bandejadocumentos] where periodo='" + periodo + "' and (estado =2 or estado=1)"
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
  module.exports.TotalDocumentoFirmados = async function ( carrera, periodo) {
    var sentencia = "";
    sentencia = " select count (distinct(matricula)) as total from [" + carrera + "].[dbo].[bandejadocumentos] where periodo='" + periodo + "' and estado =3 "
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
  module.exports.ObtenerDatosMatriculasActas = async function ( carrera, periodo,idbandeja) {
    var sentencia = "";
    sentencia = "select * from [" + carrera + "].[dbo].bandejadocumentos as b inner join [" + carrera + "].[dbo].Matriculas as m on m.sintCodigo=b.matricula inner join [" + carrera + "].[dbo].Estudiantes as e on e.strCodigo=m.strCodEstud where b.periodo='" + periodo + "' and m.strCodPeriodo='" + periodo + "'and  b.idbandeja=" + idbandeja + ""
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