const { connectionAcademico } = require('../config/PollConexionesAcademico'); // Importa el pool de conexiones
const {  execDinamico,execDinamicoTransaccion} = require("../config/execSQLDinamico.helper");
const {  execMaster,execMasterTransaccion} = require("../config/execSQLMaster.helper");
const CONFIGMASTER = require('../config/baseMaster');
const CONFIGACADEMICO = require('../config/databaseDinamico');

const sql = require("mssql");
var os = require('os');

module.exports.CarrerasDadoFacultadHomologacion = async function (carrera,periodo,codFacultad) {
    var sentencia="";
 sentencia = " select c.strNombre as carreranomre,c.strCodigo as codigocarrera,f.strNombre as facultadnombre,f.strCodigo as codigofacultad , * from [" + carrera + "].[dbo].[homologacioncarreras] as h inner join [dbo].[Carreras] as c on c.strBaseDatos=h.hmbdbasecar inner join [dbo].[Escuelas] as e on e.strCodigo=c.strCodEscuela inner join [dbo].[Facultades] as f on f.strCodigo=e.strCodFacultad where f.strCodigo='" + codFacultad + "' and h.periodo='" + periodo + "'"; 
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

  module.exports.ObtenerMateriasAprobadasPorNivelPensum = async function (carrera,codEstudiante,nivel) {
    var sentencia=""; sentencia = "WITH MateriasMatriculadas AS ( SELECT mp.strCodMateria FROM [" + carrera + "].[dbo].[Matriculas] AS m INNER JOIN [" + carrera + "].[dbo].[Periodos] AS p ON p.strCodigo = m.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Materias_Pensum] AS mp ON mp.strCodPensum = p.strCodPensum WHERE m.strCodEstud = " + codEstudiante + " AND m.strCodNivel = " + nivel + " AND m.strCodEstado = 'DEF' AND mp.strCodNivel = " + nivel + " AND m.strCodPeriodo = ( SELECT MAX(strCodPeriodo) FROM [" + carrera + "].[dbo].[Matriculas] WHERE strCodEstud = " + codEstudiante + " AND strCodEstado='DEF' AND m.strCodNivel = " + nivel + " ) ), MateriasAprobadas AS ( SELECT strCodMateria FROM [" + carrera + "].[dbo].[Materias_Aprobadas] WHERE strCodEstud = " + codEstudiante + " ) SELECT COUNT(*) AS materiaspensum, COUNT(CASE WHEN a.strCodMateria IS NOT NULL THEN 1 END) AS aprobadas, COUNT(CASE WHEN a.strCodMateria IS NULL THEN 1 END) AS no_aprobadas FROM MateriasMatriculadas m LEFT JOIN MateriasAprobadas a ON m.strCodMateria = a.strCodMateria; "; 
 console.log(sentencia)  
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

    module.exports.ObtenerMateriasPerdidasSegundaMatriculaCantidad= async function (carrera,codEstudiante) {
    var sentencia="";
 sentencia = "WITH MateriasMatriculadasSegunda AS ( select ma.strCodMateria from [" + carrera + "].[dbo].[Matriculas] as m inner join [" + carrera + "].[dbo].[Materias_Asignadas] as ma on ma.sintCodMatricula=m.sintCodigo and ma.strCodPeriodo=m.strCodPeriodo where strCodEstud =" + codEstudiante + " and strCodEstado='DEF' and ma.bytNumMat>=2 and (ma.strObservaciones NOT LIKE '%VALIDADA%' AND ma.strObservaciones NOT LIKE '%RETIRADO%') ), MateriasAprobadas AS ( SELECT strCodMateria FROM [" + carrera + "].[dbo].[Materias_Aprobadas] WHERE strCodEstud = " + codEstudiante + " ) SELECT COUNT(*) AS materiasegundamat, COUNT(CASE WHEN a.strCodMateria IS NOT NULL THEN 1 END) AS aprobadas, COUNT(CASE WHEN a.strCodMateria IS NULL THEN 1 END) AS no_aprobadas FROM MateriasMatriculadasSegunda m LEFT JOIN MateriasAprobadas a ON m.strCodMateria = a.strCodMateria; "; 
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

   module.exports.ObtenerMateriasPerdidasSegundaMatriculaDetalle= async function (carrera,codEstudiante,nivel) {
    var sentencia="";
 sentencia = "WITH MateriasMatriculadasSegunda AS ( select ma.strCodMateria,ma.strCodPeriodo from [" + carrera + "].[dbo].[Matriculas] as m inner join [" + carrera + "].[dbo].[Materias_Asignadas] as ma on ma.sintCodMatricula=m.sintCodigo and ma.strCodPeriodo=m.strCodPeriodo where strCodEstud = " + codEstudiante + " and strCodEstado='DEF' and ma.bytNumMat>=2 and (ma.strObservaciones NOT LIKE '%VALIDADA%' AND ma.strObservaciones NOT LIKE '%RETIRADO%') ), MateriasAprobadas AS ( SELECT strCodMateria FROM [" + carrera + "].[dbo].[Materias_Aprobadas] WHERE strCodEstud =  " + codEstudiante + " ) SELECT m.strCodMateria,ma.strNombre,m.strCodPeriodo,pe.strDescripcion FROM MateriasMatriculadasSegunda m LEFT JOIN MateriasAprobadas a ON m.strCodMateria = a.strCodMateria INNER JOIN Materias as ma ON ma.strCodigo=m.strCodMateria INNER JOIN Periodos AS pe on pe.strCodigo=m.strCodPeriodo WHERE a.strCodMateria IS NULL; "; 
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