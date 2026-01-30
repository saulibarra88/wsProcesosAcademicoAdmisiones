const { connectionAcademico } = require('../config/PollConexionesAcademico'); // Importa el pool de conexiones
const {  execDinamico,execDinamicoTransaccion} = require("../config/execSQLDinamico.helper");
const {  execMaster,execMasterTransaccion} = require("../config/execSQLMaster.helper");
const CONFIGMASTER = require('../config/baseMaster');
const CONFIGACADEMICO = require('../config/databaseDinamico');

const sql = require("mssql");
var os = require('os');

module.exports.InsertarAsignaturaMovilidad = async function (carrera,objdatos) {
    var sentencia="";
 sentencia = "INSERT INTO [" + carrera + "].[dbo].[Materias_Asignadas_Movilidad](mam_periodo,mam_nivelorigen,mam_paraleloorigen,mam_codmateriaorigen,mam_coddocenteorigen,mam_ceduladocente, mam_bdorigen,mam_codigoorigen,mam_carreraorigen,mam_nivelmovilidad,mam_paralelomovilidad,mam_codmateriamovilidad,mam_materiamovilidad,mam_ceduladocentemovilidad,mam_bdmovilidad,mam_codigomovilidad,mam_carreramovilidad,mam_user,mam_rutaarchivo) VALUES('" + objdatos.mam_periodo + "','" + objdatos.mam_nivelorigen + "','" + objdatos.mam_paraleloorigen + "','" + objdatos.mam_codmateriaorigen + "','" + objdatos.mam_coddocenteorigen + "','" + objdatos.mam_ceduladocente + "','" + objdatos.mam_bdorigen + "','" + objdatos.mam_codigoorigen + "','" + objdatos.mam_carreraorigen + "','" + objdatos.mam_nivelmovilidad + "','" + objdatos.mam_paralelomovilidad + "','" + objdatos.mam_codmateriamovilidad + "','" + objdatos.mam_materiamovilidad + "','" + objdatos.mam_ceduladocentemovilidad + "','" + objdatos.mam_bdmovilidad + "','" + objdatos.mam_codigomovilidad + "','" + objdatos.mam_carreramovilidad + "','" + objdatos.mam_user + "','" + objdatos.mam_rutaarchivo + "')"; 

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

  module.exports.ObtenerAsignaturaMovilidadDocente = async function (carrera,objdatos) {
    var sentencia="";
 sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Materias_Asignadas_Movilidad] WHERE mam_estado=1 and mam_codmateriaorigen='" + objdatos.mam_codmateriaorigen + "' and mam_nivelorigen='" + objdatos.mam_nivelorigen + "' and mam_periodo='" + objdatos.mam_periodo + "' and mam_paraleloorigen='" + objdatos.mam_paraleloorigen + "' and mam_coddocenteorigen='" + objdatos.mam_coddocenteorigen + "' "; 
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

    module.exports.ObtenerAsignaturaMovilidadNivelParalelo = async function (carrera,objdatos) {
    var sentencia="";
 sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Materias_Asignadas_Movilidad] WHERE mam_estado=1 and mam_codmateriaorigen='" + objdatos.mam_codmateriaorigen + "' and mam_nivelorigen='" + objdatos.mam_nivelorigen + "' and mam_periodo='" + objdatos.mam_periodo + "' and mam_paraleloorigen='" + objdatos.mam_paraleloorigen + "'  "; 
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
  module.exports.EliminarAsignaturaMovilidadDocente = async function (carrera,objdatos) {
    var sentencia="";
 sentencia = "DELETE  FROM [" + carrera + "].[dbo].[Materias_Asignadas_Movilidad] WHERE mam_estado=1 and mam_codmateriaorigen='" + objdatos.mam_codmateriaorigen + "' and mam_nivelorigen='" + objdatos.mam_nivelorigen + "' and mam_periodo='" + objdatos.mam_periodo + "' and mam_paraleloorigen='" + objdatos.mam_paraleloorigen + "' and mam_coddocenteorigen='" + objdatos.mam_coddocenteorigen + "' "; 
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

    module.exports.DesactivarAsignaturaMovilidadDocente = async function (carrera,objdatos) {
    var sentencia="";
 sentencia = "UPDATE [" + carrera + "].[dbo].[Materias_Asignadas_Movilidad] SET mam_estado=0 WHERE mam_estado=1 and mam_codmateriaorigen='" + objdatos.mam_codmateriaorigen + "' and mam_nivelorigen='" + objdatos.mam_nivelorigen + "' and mam_periodo='" + objdatos.mam_periodo + "' and mam_paraleloorigen='" + objdatos.mam_paraleloorigen + "' and mam_coddocenteorigen='" + objdatos.mam_coddocenteorigen + "' "; 
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

      module.exports.ObtenerDatosASignaturasCarreraDocente = async function (carrera,cedula,periodo) {
    var sentencia="";
 sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Dictado_Materias] AS dm INNER JOIN [" + carrera + "].[dbo].[Docentes] AS d on dm.strCodDocente=d.strCodigo INNER JOIN [" + carrera + "].[dbo].[Materias] AS m on m.strCodigo=dm.strCodMateria WHERE d.strCedula='" + cedula + "' and dm.strCodPeriodo='" + periodo + "'"; 
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