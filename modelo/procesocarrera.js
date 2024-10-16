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
  module.exports.MatriculasCarrerasPeriodo = async function (carrera,periodo) {
    var sentencia="";
    sentencia="SELECT top (1) * FROM [" + carrera + "].[dbo].[Matriculas] as m  WHERE  m.strCodPeriodo='" + periodo + "' and m.strCodEstado='DEF'"
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

  module.exports.MatriculasCarrerasPeriodoTodas = async function (carrera,periodo) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matriculas] as m  WHERE  m.strCodPeriodo='" + periodo + "' and m.strCodEstado='DEF'"
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
  module.exports.ListadoEstudianteTerceraMatriculas = async function ( carrera, periodo) {
    var sentencia = "";
    sentencia = "select m.sintCodigo as intmatricula,m.strCodNivel,m.strCodEstado , m.strCodEstud as codigoestudiante,m.strCodPeriodo as periodo,e.strCedula,e.strApellidos,e.strNombres,  COUNT(DISTINCT ma.strCodMateria) AS CantidadMaterias from [" + carrera + "].[dbo].[Matriculas]  as m inner join [" + carrera + "].[dbo].[Materias_Asignadas]  as ma on ma.sintCodMatricula=m.sintCodigo inner join [" + carrera + "].[dbo].[Estudiantes]  as e on e.strCodigo=m.strCodEstud where m.strCodPeriodo='" + periodo + "' and ma.strCodPeriodo='" + periodo + "' and m.strCodEstado='DEF' and ma.bytNumMat=3 GROUP BY  m.sintCodigo,m.strCodNivel,m.strCodEstado, m.strCodEstud,m.strCodPeriodo,e.strCedula,e.strApellidos,e.strNombres ORDER BY  e.strApellidos"
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
  module.exports.ListadoEstudianteSegundaMatriculas = async function ( carrera, periodo) {
    var sentencia = "";
    sentencia = "select m.sintCodigo as intmatricula,m.strCodNivel,m.strCodEstado , m.strCodEstud as codigoestudiante,m.strCodPeriodo as periodo,e.strCedula,e.strApellidos,e.strNombres,  COUNT(DISTINCT ma.strCodMateria) AS CantidadMaterias from [" + carrera + "].[dbo].[Matriculas]  as m inner join [" + carrera + "].[dbo].[Materias_Asignadas]  as ma on ma.sintCodMatricula=m.sintCodigo inner join [" + carrera + "].[dbo].[Estudiantes]  as e on e.strCodigo=m.strCodEstud where m.strCodPeriodo='" + periodo + "' and ma.strCodPeriodo='" + periodo + "' and m.strCodEstado='DEF' and ma.bytNumMat=2 GROUP BY  m.sintCodigo,m.strCodNivel,m.strCodEstado, m.strCodEstud,m.strCodPeriodo,e.strCedula,e.strApellidos,e.strNombres ORDER BY  e.strApellidos"
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
  module.exports.ListadoEstudiantePrimeraMatriculas = async function ( carrera, periodo) {
    var sentencia = "";
    sentencia = "select m.sintCodigo as intmatricula,m.strCodNivel,m.strCodEstado , m.strCodEstud as codigoestudiante,m.strCodPeriodo as periodo,e.strCedula,e.strApellidos,e.strNombres,  COUNT(DISTINCT ma.strCodMateria) AS CantidadMaterias from [" + carrera + "].[dbo].[Matriculas]  as m inner join [" + carrera + "].[dbo].[Materias_Asignadas]  as ma on ma.sintCodMatricula=m.sintCodigo inner join [" + carrera + "].[dbo].[Estudiantes]  as e on e.strCodigo=m.strCodEstud where m.strCodPeriodo='" + periodo + "' and ma.strCodPeriodo='" + periodo + "' and m.strCodEstado='DEF' and ma.bytNumMat=1 GROUP BY  m.sintCodigo,m.strCodNivel,m.strCodEstado, m.strCodEstud,m.strCodPeriodo,e.strCedula,e.strApellidos,e.strNombres ORDER BY  e.strApellidos"
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
  module.exports.TotalNumerosMatriculasPorEstudiantes = async function ( carrera, periodo,intMatricula) {
    var sentencia = "";
    sentencia = "SELECT e.strApellidos,e.strCedula,e.strNombres,SUM(CASE WHEN ma.bytNumMat = 1 THEN 1 ELSE 0 END) AS MateriasPrimeraMatricula,SUM(CASE WHEN ma.bytNumMat = 2 THEN 1 ELSE 0 END) AS MateriasSegundaMatricula,SUM(CASE WHEN ma.bytNumMat = 3 THEN 1 ELSE 0 END) AS MateriasTerceraMatricula,COUNT( ma.bytNumMat) AS MateriasTotalMatricula FROM [" + carrera + "].[dbo].[Matriculas] AS m INNER JOIN  [" + carrera + "].[dbo].[Materias_Asignadas]  AS ma ON ma.sintCodMatricula = m.sintCodigo INNER JOIN  [" + carrera + "].[dbo].[Estudiantes]  AS e ON e.strCodigo = m.strCodEstud WHERE  m.strCodPeriodo = '" + periodo + "' and m.sintCodigo=" + intMatricula + " and ma.strCodPeriodo = '" + periodo + "' GROUP BY m.strCodEstud,e.strApellidos,e.strCedula,e.strNombres ORDER BY  m.strCodEstud;"
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