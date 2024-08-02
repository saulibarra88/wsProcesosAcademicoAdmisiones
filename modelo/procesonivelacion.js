const { connectionAcademico } = require('./../config/PollConexionesAcademico'); // Importa el pool de conexiones
const {  execDinamico,execDinamicoTransaccion} = require("./../config/execSQLDinamico.helper");
const {  execMaster,execMasterTransaccion} = require("./../config/execSQLMaster.helper");
const CONFIGMASTER = require('./../config/baseMaster');
const CONFIGACADEMICO = require('./../config/databaseDinamico');

const sql = require("mssql");
var os = require('os');

module.exports.ListadoCarreraTodas = async function (carrera) {
    var sentencia="";
    sentencia="SELECT F.strNombre as strNombreFacultad, C.strNombre as strNombreCarrera, * FROM [" + carrera + "].[dbo].Facultades AS F INNER JOIN [OAS_Master].[dbo].Escuelas AS E ON E.strCodFacultad=F.strCodigo INNER JOIN [OAS_Master].[dbo].Carreras AS C ON C.strCodEscuela=E.strCodigo "
   
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

  module.exports.MatriculasCarrerasPeriodo = async function (carrera,periodo) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matriculas] as m INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on m.strCodEstud=e.strCodigo WHERE  m.strCodPeriodo='" + periodo + "' and m.strCodEstado='DEF' ORDER BY m.strCodNivel,e.strApellidos"
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
  module.exports.ObtenerEstudianteCupo = async function (cedula,periodo,carrera) {
    var sentencia="";
    sentencia="SELECT * FROM [OAS_Master].[dbo].[Cupo] WHERE identificacion='" + cedula + "' and carrera= '" + carrera + "' and cup_estado=1"
   
  try {
    if (sentencia != "") {
      const sqlConsulta = await execMaster("OAS_Master",sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  
  }