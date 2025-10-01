const { connectionAcademico } = require('./../config/PollConexionesAcademico'); // Importa el pool de conexiones
const { execDinamico, execDinamicoTransaccion } = require("./../config/execSQLDinamico.helper");
const { execMaster, execMasterTransaccion } = require("./../config/execSQLMaster.helper");
const { execMasterMejorado} = require("./../config/execSQLMasterMejorado.helper");
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
  module.exports.ListadoEstudianteTerceraMatriculasAsignatura = async function ( carrera, periodo) {
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
  module.exports.AsignaturasDictadosMateriasCarreras = async function ( carrera, periodo) {
    var sentencia = "";
    sentencia = "SELECT DISTINCT(dm.strCodMateria),dm.strCodNivel,m.strNombre FROM [" + carrera + "].[dbo].[Dictado_Materias]  as dm INNER JOIN [" + carrera + "].[dbo].[Materias]  as m on m.strCodigo=dm.strCodMateria WHERE strCodPeriodo='" + periodo + "' ORDER BY dm.strCodNivel,dm.strCodMateria"
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

   module.exports.AsignaturasDictadosMateriasParalelosCarreras = async function ( carrera, periodo,materia) {
    var sentencia = "";
    sentencia = "SELECT dm.strCodMateria, dm.strCodNivel,dm.strCodParalelo,m.strNombre,d.strCedula,d.strNombres,d.strApellidos FROM [" + carrera + "].[dbo].[Dictado_Materias]  as dm INNER JOIN [" + carrera + "].[dbo].[Materias]  as m on m.strCodigo=dm.strCodMateria INNER JOIN [" + carrera + "].[dbo].[Docentes] as d on d.strCodigo=dm.strCodDocente WHERE strCodPeriodo='" + periodo + "' AND strCodMateria='" + materia + "' ORDER BY dm.strCodNivel,dm.strCodMateria"
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
    module.exports.CalculosEstuidantesApruebaRepruebaPorAsignaturasNivelParalelo = async function ( carrera, periodo,materia,nivel,paralelo) {
    var sentencia = "";
  sentencia="SELECT SUM(CASE WHEN (np.Aprobado = 1 ) THEN 1 ELSE 0 END) AS Aprueba, SUM(CASE WHEN (np.Aprobado = 0 ) THEN 1 ELSE 0 END) AS Reprueba, COUNT(sintCodMatricula) AS Total FROM ( SELECT np.sintCodMatricula, np.strCodPeriodo, np.strCodMateria,MAX( CASE WHEN strCodEquiv = 'A' THEN 1 ELSE 0 END) AS Aprobado FROM [" + carrera + "].[dbo].Notas_Parciales as np INNER JOIN [" + carrera + "].[dbo].[Materias_Asignadas] AS ma on ma.sintCodMatricula=np.sintCodMatricula and ma.strCodPeriodo=np.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS m ON ma.sintCodMatricula=m.sintCodigo and ma.strCodPeriodo=m.strCodPeriodo WHERE  m.strCodPeriodo ='" + periodo + "' and np.strCodPeriodo = '" + periodo + "' AND np.strCodMateria ='" + materia + "'  AND ma.strCodMateria ='" + materia + "' AND ma.strCodParalelo = '" + paralelo + "' AND ma.strCodNivel='" + nivel + "' AND ma.strCodPeriodo ='" + periodo + "' AND (ma.strObservaciones IS NULL OR (ma.strObservaciones NOT LIKE '%VALIDADA%')) GROUP BY np.sintCodMatricula, np.strCodPeriodo, np.strCodMateria) AS np"
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
  module.exports.CalculosEstuidantesPorAsignaturas = async function ( carrera, periodo,materia) {
    var sentencia = "";
  sentencia="SELECT SUM(CASE WHEN (np.Aprobado = 1 ) THEN 1 ELSE 0 END) AS Aprueba, SUM(CASE WHEN (np.Aprobado = 0 ) THEN 1 ELSE 0 END) AS Reprueba, COUNT(sintCodMatricula) AS Total FROM ( SELECT sintCodMatricula, strCodPeriodo, strCodMateria,MAX( CASE WHEN strCodEquiv = 'A' THEN 1 ELSE 0 END) AS Aprobado FROM Notas_Parciales WHERE strCodPeriodo = '" + periodo + "' AND strCodMateria ='" + materia + "' GROUP BY sintCodMatricula, strCodPeriodo, strCodMateria) AS np"

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
  module.exports.ListadoCarreraTodasMater = async function (carrera) {
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
  module.exports.ListadoCarreraNivelacion = async function (carrera,strCodfigoFacultad) {
    var sentencia="";
    sentencia="SELECT F.strNombre as strNombreFacultad, C.strNombre as strNombreCarrera, * FROM [" + carrera + "].[dbo].Facultades AS F INNER JOIN [OAS_Master].[dbo].Escuelas AS E ON E.strCodFacultad=F.strCodigo INNER JOIN [OAS_Master].[dbo].Carreras AS C ON C.strCodEscuela=E.strCodigo  WHERE F.strCodigo='" + strCodfigoFacultad + "' "
   
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
  module.exports.RetirosSinMatriculaEstudiantesCarrerasListado = async function (carrera,periodo) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[RetirosSinMatricula] AS RM INNER JOIN [" + carrera + "].[dbo].[Estudiantes] AS E ON E.strCodigo=RM.rsm_strCodEstud WHERE RM.rsm_strCodPeriodo='" + periodo + "'"
   
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
  module.exports.RetirosSinMatriculaEstudiantesCarrerasCedula = async function (carrera,cedula) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[RetirosSinMatricula] AS RM INNER JOIN [" + carrera + "].[dbo].[Estudiantes] AS E ON E.strCodigo=RM.rsm_strCodEstud INNER JOIN [" + carrera + "].[dbo].[Periodos] AS P ON P.strCodigo=RM.rsm_strCodPeriodo WHERE E.strCedula='" + cedula + "'"
   
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

  module.exports.TiposRetirosEstudiantesCarrerasListado = async function (carrera,periodo) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matricula_Retiros] as r INNER JOIN [dbo].[Tipo_Retiros] AS tr on tr.tipcodigo=r.tipcodigo INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS m on m.sintCodigo=r.sintCodigo INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on e.strCodigo=m.strCodEstud WHERE r.strCodPeriodo='" + periodo + "' and m.strCodPeriodo='" + periodo + "'"
   
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
  module.exports.TiposRetirosEstudiantesCarrerasCedula = async function (carrera,cedula) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matricula_Retiros] as r INNER JOIN [" + carrera + "].[dbo].[Tipo_Retiros] AS tr on tr.tipcodigo=r.tipcodigo INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS m on m.sintCodigo=r.sintCodigo INNER JOIN [" + carrera + "].[dbo].[Periodos] AS P ON P.strCodigo=m.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on e.strCodigo=m.strCodEstud WHERE e.strCedula='" + cedula + "'"
   
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
  module.exports.TiposRetirosEstudiantesCarrerasListadoTransaccion = async function (transaccion,carrera,periodo,cedula) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matricula_Retiros] as r INNER JOIN [" + carrera + "].[dbo].[Tipo_Retiros] AS tr on tr.tipcodigo=r.tipcodigo INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS m on m.sintCodigo=r.sintCodigo INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on e.strCodigo=m.strCodEstud WHERE r.strCodPeriodo='" + periodo + "' and m.strCodPeriodo='" + periodo + "' and e.strCedula='" + cedula + "'"
   
    try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaccion,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }
  module.exports.RetirosEstudiantesNormalesCarrerasListadoTransaccion = async function (transaccion,carrera,periodo,cedula) {
    var sentencia="";
    sentencia="select * from ( SELECT  r.sintCodMatricula,r.dtFechaAprob,r.dtFechaAsentado,r.strResolucion FROM [" + carrera + "].[dbo].[Retiros] as r WHERE r.strCodPeriodo='" + periodo + "' group by r.sintCodMatricula,r.dtFechaAprob,r.dtFechaAsentado,r.strResolucion) as ta INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS m on m.sintCodigo=ta.sintCodMatricula INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on e.strCodigo=m.strCodEstud WHERE m.strCodPeriodo='" + periodo + "'and e.strCedula='" + cedula + "' "
   
    try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaccion,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }
  module.exports.ObternerDatosRetirosinMatriculaTransaccion = async function (transaccion,carrera,periodo,codEstudiante) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[RetirosSinMatricula] WHERE rsm_strCodEstud= '" + codEstudiante + "' AND rsm_estado=1 AND rsm_strCodPeriodo='" + periodo + "' "

    try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaccion,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }
  module.exports.RetirosEstudiantesNormalesCarrerasListado = async function (carrera,periodo) {
    var sentencia="";
    sentencia="select * from ( SELECT  r.sintCodMatricula,r.dtFechaAprob,r.dtFechaAsentado,r.strResolucion FROM [" + carrera + "].[dbo].[Retiros] as r WHERE r.strCodPeriodo='" + periodo + "' group by r.sintCodMatricula,r.dtFechaAprob,r.dtFechaAsentado,r.strResolucion) as ta INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS m on m.sintCodigo=ta.sintCodMatricula INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on e.strCodigo=m.strCodEstud WHERE m.strCodPeriodo='" + periodo + "' "
   
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

  module.exports.RetirosAsignaturasNormalesCarrerasListado = async function (carrera,periodo,codmateria) {
    var sentencia="";
    sentencia="select * from [" + carrera + "].[dbo].[Retiros] where [strCodPeriodo]='" + periodo + "' and [strCodMateria]='" + codmateria + "'"
   
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

 module.exports.RetirosAsignaturasNormalesCarrerasListadoNivelParalelo = async function (carrera,periodo,codmateria,nivel,paralelo) {
    var sentencia="";
    sentencia="select * from [" + carrera + "].[dbo].[Matriculas] as m INNER JOIN [" + carrera + "].[dbo].[Materias_Asignadas] as ma on ma.sintCodMatricula=m.sintCodigo and ma.strCodPeriodo=m.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Retiros] as r on r.sintCodMatricula=m.sintCodigo and r.strCodPeriodo =m.strCodPeriodo where m.strCodPeriodo='" + periodo + "' and r.strCodPeriodo='" + periodo + "' and ma.strCodMateria ='" + codmateria + "' and r.strCodMateria ='" + codmateria + "' and ma.strCodNivel='" + nivel + "' and ma.strCodParalelo='" + paralelo + "' "
   
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
    module.exports.AsignaturasConvalidadasPorNivelParalelo = async function (carrera,periodo,codmateria,nivel,paralelo) {
    var sentencia="";
    sentencia=" SELECT * FROM [" + carrera + "].[dbo].[Materias_Asignadas] AS ma INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS m ON ma.sintCodMatricula=m.sintCodigo and ma.strCodPeriodo=m.strCodPeriodo WHERE m.strCodEstado='DEF' and  ma.strCodMateria = '" + codmateria + "' AND ma.strCodParalelo = '" + paralelo + "' AND ma.strCodNivel='" + nivel + "' AND ma.strCodPeriodo ='" + periodo + "' AND (ma.strObservaciones IS NULL OR (ma.strObservaciones LIKE '%VALIDADA%')) "
   
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
  module.exports.RetirosEstudiantesNormalesCarrerasCedula = async function (carrera,cedula) {
    var sentencia="";
    sentencia="select * from ( SELECT  r.sintCodMatricula,r.dtFechaAprob,r.dtFechaAsentado,r.strResolucion FROM [" + carrera + "].[dbo].[Retiros] as r INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS m on m.sintCodigo=r.sintCodMatricula INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on e.strCodigo=m.strCodEstud WHERE e.strCedula='" + cedula + "' group by r.sintCodMatricula,r.dtFechaAprob,r.dtFechaAsentado,r.strResolucion ) as ta INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS m on m.sintCodigo=ta.sintCodMatricula INNER JOIN [" + carrera + "].[dbo].[Periodos] AS P ON P.strCodigo=m.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on e.strCodigo=m.strCodEstud WHERE e.strCedula='" + cedula + "'"
   
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

  module.exports.ObternerDatosRetirosinMatricula = async function (carrera,codEstudiante) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[RetirosSinMatricula] WHERE rsm_strCodEstud= '" + codEstudiante + "' AND rsm_estado=1"
   
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

  module.exports.IngresarRetiroSinMatricula = async function (carrera,datos) {
    var sentencia="";
    sentencia = "INSERT INTO [" + carrera + "].[dbo].[RetirosSinMatricula]([rsm_tipo],[rsm_strCodPeriodo],[rsm_strCodEstud],[rsm_dtFechaAprob],[rsm_strResolucion],[rsm_strObservacion],[rsm_strRuta])"
    + "VALUES(" +  datos.rsm_tipo + ",'" + datos.rsm_strCodPeriodo + "','" + datos.rsm_strCodEstud + "','" + datos.rsm_dtFechaAprob + "','" + datos.rsm_strResolucion + "','" + datos.rsm_strObservacion + "','" + datos.rsm_strRuta + "');";
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

  module.exports.ObtenerDatosEstudianteCarrera = async function (carrera,cedula) {
    var sentencia="";
    sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Estudiantes] WHERE strCedula='" + cedula + "' or strCodigo='" + cedula + "'";
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

  module.exports.ListadoPensumCarrera = async function (carrera) {
    var sentencia="";
    sentencia = "select * from [" + carrera + "].[dbo].[Pensums] order by [dtFechaInic] desc";
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

  module.exports.ListadoMateriasPensumCarrera = async function (carrera,pensum) {
    var sentencia="";
    sentencia = "select * from [" + carrera + "].[dbo].[Materias_Pensum] as mp inner join [" + carrera + "].[dbo].[Materias] as m on m.strCodigo=mp.strCodMateria where mp.strCodPensum='" + pensum + "' ";
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
  module.exports.ListadoDocenteActasNoGeneradas = async function (carrera,tipoActa,periodo) {
    var sentencia="";
   // sentencia = "WITH DocentesConActa AS ( SELECT dm.strCodDocente,dm.strCodMateria,dm.strCodNivel,dm.strCodParalelo,dm.strCodPeriodo,a.strdescripcion FROM Acta AS a INNER JOIN Dictado_Materias AS dm ON dm.strCodMateria = a.strCodMateria AND dm.strCodNivel = a.strCodNivel AND dm.strCodParalelo = a.strCodParalelo INNER JOIN Docentes AS d ON d.strCodigo = dm.strCodDocente INNER JOIN bandejaactas AS ba ON ba.strCodMateria=a.strCodMateria AND ba.strCodNivel = a.strCodNivel AND ba.strCodParalelo = a.strCodParalelo WHERE  a.actestado = 1 AND a.tipcodigo = " + tipoActa + " AND a.strCodPeriodo = '" + periodo + "' AND dm.strCodPeriodo = '" + periodo + "' ) SELECT 'ACTA DE FIN DE CICLO 'AS strdescripcionacta,d.strCedula, d.strApellidos,d.strNombres,d.strTel,m.strNombre,dm.strCodNivel,dm.strCodParalelo,dm.strCodPeriodo FROM Dictado_Materias AS dm INNER JOIN Docentes AS d ON d.strCodigo = dm.strCodDocente INNER JOIN Materias AS m ON m.strCodigo=dm.strCodMateria LEFT JOIN DocentesConActa AS a ON a.strCodDocente = d.strCodigo and a.strCodMateria=dm.strCodMateria and a.strCodNivel=dm.strCodNivel and a.strCodParalelo=dm.strCodParalelo WHERE dm.strCodPeriodo = '" + periodo + "' AND a.strCodDocente IS NULL;";
    sentencia = "WITH DocentesConActa AS ( SELECT dm.strCodDocente,dm.strCodMateria,dm.strCodNivel,dm.strCodParalelo,dm.strCodPeriodo,ba.rutaArchivo FROM bandejaactas AS ba INNER JOIN Dictado_Materias AS dm ON dm.strCodMateria = ba.strCodMateria AND dm.strCodNivel = ba.strCodNivel AND dm.strCodParalelo = ba.strCodParalelo INNER JOIN Docentes AS d ON d.strCodigo = dm.strCodDocente WHERE  ba.estado = 3 AND ba.tipoacta = " + tipoActa + " AND ba.strCodPeriodo = '" + periodo + "' AND dm.strCodPeriodo = '" + periodo + "' and ba.rutaArchivo is not null) SELECT 'ACTA DE FIN DE CICLO 'AS strdescripcionacta,a.rutaArchivo,d.strCedula, d.strApellidos,d.strNombres,d.strTel,m.strNombre,dm.strCodNivel,dm.strCodParalelo,dm.strCodPeriodo FROM Dictado_Materias AS dm INNER JOIN Docentes AS d ON d.strCodigo = dm.strCodDocente INNER JOIN Materias AS m ON m.strCodigo=dm.strCodMateria LEFT JOIN DocentesConActa AS a ON a.strCodDocente = d.strCodigo and a.strCodMateria=dm.strCodMateria and a.strCodNivel=dm.strCodNivel and a.strCodParalelo=dm.strCodParalelo WHERE dm.strCodPeriodo = '" + periodo + "' AND a.strCodDocente IS NULL;";
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

  module.exports.ListadoDictadoMateriasCarrera = async function (carrera,periodo) {
    var sentencia="";
    sentencia = "select * from [" + carrera + "].[dbo].[Dictado_Materias]  as dm inner join [" + carrera + "].[dbo].[Docentes]  as d on d.strCodigo=dm.strCodDocente inner join [" + carrera + "].[dbo].[Materias] as m on m.strCodigo=dm.strCodMateria where dm.strCodPeriodo='" + periodo + "'";
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

  module.exports.ListadoEstudiantesRecuperacionAsignaturas = async function (carrera,periodo,nivel,paralelo,materia) {
    var sentencia="";
    sentencia = "SELECT Estudiantes.strCodigo , Estudiantes.strCedula , Estudiantes.strNombres , Estudiantes.strApellidos , Materias_Asignadas.sintCodMatricula , Materias_Asignadas.strCodPeriodo , Materias_Asignadas.strCodMateria , Materias_Asignadas.bytNumMat , Materias_Asignadas.bytAsistencia , Materias_Asignadas.strCodParalelo , Materias_Asignadas.strCodNivel , CAST( Notas_Parciales.dcParcial1 AS varchar) AS dcParcial1 , CAST( Notas_Parciales.dcParcial2 AS varchar) AS dcParcial2 , Notas_Parciales.strObservaciones FROM [" + carrera + "].[dbo].[Materias_Asignadas] INNER JOIN  [" + carrera + "].[dbo].[Matriculas] ON Materias_Asignadas.sintCodMatricula = Matriculas.sintCodigo AND Materias_Asignadas.strCodPeriodo = Matriculas.strCodPeriodo INNER JOIN  [" + carrera + "].[dbo].[Estudiantes] ON Matriculas.strCodEstud = Estudiantes.strCodigo INNER JOIN [" + carrera + "].[dbo].[Notas_Parciales] ON Materias_Asignadas.sintCodMatricula = Notas_Parciales.sintCodMatricula AND Materias_Asignadas.strCodPeriodo = Notas_Parciales.strCodPeriodo AND Materias_Asignadas.strCodMateria = Notas_Parciales.strCodMateria WHERE (Materias_Asignadas.strCodPeriodo = '" + periodo + "') AND (Materias_Asignadas.strCodMateria = '" + materia + "') AND (Materias_Asignadas.strCodParalelo = '" + paralelo + "') AND (Matriculas.strCodEstado = 'DEF') AND (Materias_Asignadas.strCodNivel = '" + nivel + "') AND Notas_Parciales.strCodTipoExamen='REC' ORDER BY Estudiantes.strApellidos";
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
  module.exports.ListadoActasGeneradasTipo = async function (carrera,periodo,tipo) {
    var sentencia="";
    //sentencia = "select * from [" + carrera + "].[dbo].[Acta] as a inner join [" + carrera + "].[dbo].[Dictado_Materias]  as dm on dm.strCodMateria=a.strCodMateria and dm.strCodNivel=a.strCodNivel and dm.strCodParalelo=a.strCodParalelo inner join [" + carrera + "].[dbo].[Docentes]  as d on d.strCodigo=dm.strCodDocente INNER JOIN [" + carrera + "].[dbo].[bandejaactas] AS ba ON ba.strCodMateria=a.strCodMateria AND ba.strCodNivel = a.strCodNivel AND ba.strCodParalelo = a.strCodParalelo where  a.actestado=1 and a.tipcodigo='" + tipo + "' and a.strCodPeriodo='" + periodo + "' and dm.strCodPeriodo='" + periodo + "'";
  //  sentencia = "select a.strCodParalelo as codigoparalelo,a.strCodPeriodo as codigoperiodo,a.strCodNivel as codigonivel,a.strCodMateria as codigomateria,dm.strCodDocente as codigodocente, * from [" + carrera + "].[dbo].[Acta] as a INNER JOIN [" + carrera + "].[dbo].[bandejaactas] AS ba ON ba.strCodMateria=a.strCodMateria AND ba.strCodNivel = a.strCodNivel AND ba.strCodParalelo = a.strCodParalelo AND ba.strCodPeriodo=a.strCodPeriodo inner join [" + carrera + "].[dbo].[Dictado_Materias]  as dm on dm.strCodMateria=a.strCodMateria and dm.strCodNivel=a.strCodNivel and dm.strCodParalelo=a.strCodParalelo AND dm.strCodPeriodo=a.strCodPeriodo inner join [" + carrera + "].[dbo].[Docentes]  as d on d.strCodigo=dm.strCodDocente where  a.actestado=1 and a.tipcodigo='" + tipo + "' and a.strCodPeriodo='" + periodo + "' and dm.strCodPeriodo='" + periodo + "' and ba.tipoacta='" + tipo + "'";
    sentencia = "select ba.strCodParalelo as codigoparalelo,ba.strCodPeriodo as codigoperiodo,ba.strCodNivel as codigonivel,ba.strCodMateria as codigomateria,ba.strCodDocente as codigodocente, * from [" + carrera + "].[dbo].[bandejaactas] as ba inner join [" + carrera + "].[dbo].[Dictado_Materias]  as dm on dm.strCodMateria=ba.strCodMateria and dm.strCodNivel=ba.strCodNivel and dm.strCodParalelo=ba.strCodParalelo AND dm.strCodPeriodo=ba.strCodPeriodo inner join [dbo].[Docentes]  as d on d.strCodigo=dm.strCodDocente where  ba.estado=3 and ba.tipoacta=" + tipo + " and ba.strCodPeriodo='" + periodo + "' and dm.strCodPeriodo='" + periodo + "'";
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

  module.exports.VerificacionPeriodoActivo = async function (carrera,periodo) {
    var sentencia="";
    sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Periodos] WHERE [strCodigo]='" + periodo + "' and blnVigente=0";
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


  module.exports.VerificacionPensumActivo = async function (carrera,pemsun) {
    var sentencia="";
    sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Pensums] WHERE [strCodigo]='" + pemsun + "' and  [blnActivo]=1";
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

  module.exports.SentenciaNotas1 = async function (carrera) {
    var sentencia="";
    sentencia = "SELECT * FROM   [" + carrera + "].[seguridad].[auditoria] WHERE  (autfecha >= '2025-02-19') AND (autdescripcionproceso LIKE '%P0042%') AND (autdescripcionproceso LIKE '%nota de REC %') ORDER BY 3,4";
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

  module.exports.ListadoLogRecuperacionTabla = async function (carrera) {
    var sentencia="";
    sentencia = "SELECT * FROM   [" + carrera + "].[dbo].[log] ORDER BY 2,3";
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

  module.exports.ActualizacionCalifacionRecuperacion = async function (carrera,matericula,nota,materia) {
    var sentencia="";
    sentencia = "update [" + carrera + "].[dbo].[Notas_Parciales]  set dcParcial2=" + nota + " where sintCodMatricula=" + matericula + " and strCodPeriodo='P0042' and strCodMateria='" + materia + "' and strCodTipoExamen='REC' ";
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

  module.exports.ListadoMatriculasFirmadasPorNivel = async function (carrera,periodo,nivel) {
    var sentencia="";
    sentencia = " SELECT m.sintCodigo, m.strCodPeriodo, m.strCodNivel, m.strCodEstud, m.dtFechaAutorizada, m.dtFechaCreada, b.iddocumento,e.strCedula,e.strApellidos,e.strNombres FROM [" + carrera + "].[dbo].[Matriculas] m INNER JOIN ( SELECT matricula, periodo, iddocumento FROM [" + carrera + "].[dbo].[bandejadocumentos] WHERE periodo = '" + periodo + "' AND estado = 3 AND matricula IS NOT NULL GROUP BY matricula, periodo, iddocumento ) b ON m.sintCodigo = b.matricula AND m.strCodPeriodo = b.periodo INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on e.strCodigo=m.strCodEstud WHERE m.strCodNivel = '" + nivel + "' AND m.strCodPeriodo = '" + periodo + "' and m.strCodEstado='DEF';";
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
  module.exports.ListadoMatriculasCarrerasPeriodos = async function (carrera,periodo,estado) {
    var sentencia="";
    sentencia = "select *,fi.strDescripcion as descripcioninscripcion,n.strDescripcion as descripcionnivel,em.strDescripcion as descripcionestado from [" + carrera + "].[dbo].[Matriculas] as m inner join [" + carrera + "].[dbo].[Estudiantes] as e on e.strCodigo=m.strCodEstud inner join [" + carrera + "].[dbo].[Sexos] as sex on sex.strCodigo=e.strCodSexo inner join [" + carrera + "].[dbo].[Formas de Inscripcion] as fi on fi.strCodigo=e.strFormaIns inner join [" + carrera + "].[dbo].[Niveles] as n on n.strCodigo=m.strCodNivel inner join [" + carrera + "].[dbo].[Estados_Matriculas] as em on em.strCodigo=m.strCodEstado where m.[strCodPeriodo]='" + periodo + "' and m.strCodEstado='" + estado + "' order by n.strCodigo desc ,e.strApellidos asc";
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
  module.exports.ListadoMatriculasCarrerasPeriodosTransaccion = async function (transaction,carrera,periodo,estado) {
    var sentencia="";
    sentencia = "select *,fi.strDescripcion as descripcioninscripcion,n.strDescripcion as descripcionnivel,em.strDescripcion as descripcionestado from [" + carrera + "].[dbo].[Matriculas] as m inner join [" + carrera + "].[dbo].[Estudiantes] as e on e.strCodigo=m.strCodEstud inner join [" + carrera + "].[dbo].[Sexos] as sex on sex.strCodigo=e.strCodSexo inner join [" + carrera + "].[dbo].[Formas de Inscripcion] as fi on fi.strCodigo=e.strFormaIns inner join [" + carrera + "].[dbo].[Niveles] as n on n.strCodigo=m.strCodNivel inner join [" + carrera + "].[dbo].[Estados_Matriculas] as em on em.strCodigo=m.strCodEstado where m.[strCodPeriodo]='" + periodo + "' and m.strCodEstado='" + estado + "' order by n.strCodigo desc ,e.strApellidos asc";
    try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaction,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }
  module.exports.ListadoMatriculasCarrerasPeriodosNivelTransaccion = async function (transaction,carrera,periodo,estado,nivel) {
    var sentencia="";
    sentencia = "select *,fi.strDescripcion as descripcioninscripcion,n.strDescripcion as descripcionnivel,em.strDescripcion as descripcionestado from [" + carrera + "].[dbo].[Matriculas] as m inner join [" + carrera + "].[dbo].[Estudiantes] as e on e.strCodigo=m.strCodEstud inner join [" + carrera + "].[dbo].[Sexos] as sex on sex.strCodigo=e.strCodSexo inner join [" + carrera + "].[dbo].[Formas de Inscripcion] as fi on fi.strCodigo=e.strFormaIns inner join [" + carrera + "].[dbo].[Niveles] as n on n.strCodigo=m.strCodNivel inner join [" + carrera + "].[dbo].[Estados_Matriculas] as em on em.strCodigo=m.strCodEstado where m.[strCodPeriodo]='" + periodo + "' and m.strCodEstado='" + estado + "' and m.strCodNivel='" + nivel + "' order by n.strCodigo desc ,e.strApellidos asc";
    try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaction,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }
  module.exports.ListadoMatriculasCarrerasPeriodosTransaccionDefinitiva = async function (transaction,carrera,periodo) {
    var sentencia="";
    sentencia = "select *,fi.strDescripcion as descripcioninscripcion,n.strDescripcion as descripcionnivel,em.strDescripcion as descripcionestado from [" + carrera + "].[dbo].[Matriculas] as m inner join [" + carrera + "].[dbo].[Estudiantes] as e on e.strCodigo=m.strCodEstud inner join [" + carrera + "].[dbo].[Sexos] as sex on sex.strCodigo=e.strCodSexo inner join [" + carrera + "].[dbo].[Formas de Inscripcion] as fi on fi.strCodigo=e.strFormaIns inner join [" + carrera + "].[dbo].[Niveles] as n on n.strCodigo=m.strCodNivel inner join [" + carrera + "].[dbo].[Estados_Matriculas] as em on em.strCodigo=m.strCodEstado where m.[strCodPeriodo]='" + periodo + "' and m.strCodEstado='DEF' order by n.strCodigo desc ,e.strApellidos asc";
    try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaction,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }
  module.exports.ObtenerPagoMatriculaEstudiante = async function (carrera,periodo,cedula) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[PagosFacturaElectronico] WHERE strCodPeriodo='" + periodo + "' AND strCedula='" + cedula + "' AND strEstado='PAG'"
   
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
  module.exports.ObtenerPagoMatriculaEstudianteTransaccion = async function (transaction,carrera,periodo,cedula) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[PagosFacturaElectronico] WHERE strCodPeriodo='" + periodo + "' AND strCedula='" + cedula + "' AND strEstado='PAG'"
   
    try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaction,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }
  module.exports.AsignaturasMatriculadaEstudiantePeriodoCantidad = async function (carrera,periodo,intmatricula) {
    var sentencia="";
    sentencia="SELECT SUM(CASE WHEN bytNumMat = 1 THEN 1 ELSE 0 END) AS Primera, SUM(CASE WHEN bytNumMat = 2 THEN 1 ELSE 0 END) AS Segunda, SUM(CASE WHEN bytNumMat = 3 THEN 1 ELSE 0 END) AS Tercera FROM [" + carrera + "].[dbo].[Materias_Asignadas] WHERE sintCodMatricula = '" + intmatricula + "' AND strCodPeriodo ='" + periodo + "' AND (strObservaciones IS NULL OR (strObservaciones NOT LIKE '%VALIDADA%' AND strObservaciones NOT LIKE '%RETIRADO%'));"
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

  module.exports.AsignaturasMatriculadaPeriodoCantidad = async function (carrera,periodo,codmateria) {
    var sentencia="";
    sentencia="SELECT SUM(CASE WHEN bytNumMat = 1 THEN 1 ELSE 0 END) AS Primera, SUM(CASE WHEN bytNumMat = 2 THEN 1 ELSE 0 END) AS Segunda, SUM(CASE WHEN bytNumMat = 3 THEN 1 ELSE 0 END) AS Tercera,COUNT(bytNumMat) AS Total  FROM [" + carrera + "].[dbo].[Materias_Asignadas] AS ma INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS m ON ma.sintCodMatricula=m.sintCodigo and ma.strCodPeriodo=m.strCodPeriodo WHERE m.strCodEstado='DEF' and  ma.strCodMateria = '" + codmateria + "' AND ma.strCodPeriodo ='" + periodo + "' AND (ma.strObservaciones IS NULL OR (ma.strObservaciones NOT LIKE '%VALIDADA%'));"
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
  module.exports.AsignaturasMatriculadaNivelParalelosPeriodoCantidad = async function (carrera,periodo,codmateria,nivel,paralelo) {
    var sentencia="";
    sentencia="SELECT SUM(CASE WHEN bytNumMat = 1 THEN 1 ELSE 0 END) AS Primera, SUM(CASE WHEN bytNumMat = 2 THEN 1 ELSE 0 END) AS Segunda, SUM(CASE WHEN bytNumMat = 3 THEN 1 ELSE 0 END) AS Tercera,COUNT(bytNumMat) AS Total  FROM [" + carrera + "].[dbo].[Materias_Asignadas] AS ma INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS m ON ma.sintCodMatricula=m.sintCodigo and ma.strCodPeriodo=m.strCodPeriodo WHERE m.strCodEstado='DEF' and  ma.strCodMateria = '" + codmateria + "' AND ma.strCodParalelo = '" + paralelo + "' AND ma.strCodNivel='" + nivel + "' AND ma.strCodPeriodo ='" + periodo + "' AND (ma.strObservaciones IS NULL OR (ma.strObservaciones NOT LIKE '%VALIDADA%'));"
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
    module.exports.MatriculasCantidadEstadosAsignaturas = async function (carrera,periodo,materia,nivel,paralelo) {
    var sentencia="";
    sentencia="SELECT SUM(CASE WHEN m.strCodEstado = 'DEF' THEN 1 ELSE 0 END) AS Definitiva, SUM(CASE WHEN m.strCodEstado = 'PEN' THEN 1 ELSE 0 END) AS Pendiente, SUM(CASE WHEN m.strCodEstado = 'SOL' THEN 1 ELSE 0 END) AS Solicitadas, SUM(CASE WHEN m.strCodEstado = 'PRE' THEN 1 ELSE 0 END) AS Presolicitada, SUM(CASE WHEN m.strCodEstado = 'VCDEF' THEN 1 ELSE 0 END) AS Definitvavalidacion, SUM(CASE WHEN m.strCodEstado = 'VCPEN' THEN 1 ELSE 0 END) AS Pendientevalidación, SUM(CASE WHEN m.strCodEstado = 'VCSOL' THEN 1 ELSE 0 END) AS Solicitadavalidacion, SUM(CASE WHEN m.strCodEstado = 'VCPRE' THEN 1 ELSE 0 END) AS presolicitadavalidacion, COUNT(m.sintCodigo) AS Total FROM [" + carrera + "].[dbo].[Materias_Asignadas] AS ma INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS m ON ma.sintCodMatricula=m.sintCodigo and ma.strCodPeriodo=m.strCodPeriodo WHERE ma.strCodMateria = '" + materia + "' AND ma.strCodParalelo = '" + paralelo + "' AND ma.strCodNivel='" + nivel + "' AND ma.strCodPeriodo ='" + periodo + "' AND (ma.strObservaciones IS NULL OR (ma.strObservaciones NOT LIKE '%VALIDADA%')); "
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
  module.exports.AsignaturasMatriculadaEstudiantePeriodoCantidadTrasaccion = async function (transaction,carrera,periodo,intmatricula) {
    var sentencia="";
    sentencia="SELECT SUM(CASE WHEN bytNumMat = 1 THEN 1 ELSE 0 END) AS Primera, SUM(CASE WHEN bytNumMat = 2 THEN 1 ELSE 0 END) AS Segunda, SUM(CASE WHEN bytNumMat = 3 THEN 1 ELSE 0 END) AS Tercera FROM [" + carrera + "].[dbo].[Materias_Asignadas] WHERE sintCodMatricula = '" + intmatricula + "' AND strCodPeriodo ='" + periodo + "' AND (strObservaciones IS NULL OR (strObservaciones NOT LIKE '%VALIDADA%' AND strObservaciones NOT LIKE '%RETIRADO%'));"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaction,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  
  }

  module.exports.CalculoEstudiantesRegulares60PorCiento = async function (carrera,periodo,intmatricula) {
    var sentencia="";
    sentencia=" SELECT CreditosMalla.strCodPeriodo, CreditosMalla.strCodNivel, CreditosMalla.strCodPensum, CreditosMalla.TotalCreditoMalla, CreditosMalla.Credito60PorCiento, CreditosMatriculados.TotalCreditoMatriculada, CASE WHEN CreditosMatriculados.TotalCreditoMatriculada >= CreditosMalla.Credito60PorCiento THEN 'REGULAR' ELSE 'NO REGULAR' END AS Estudiante FROM ( SELECT m.strCodPeriodo, m.strCodNivel, p.strCodPensum, SUM(mp.fltCreditos) AS TotalCreditoMalla, SUM(mp.fltCreditos) * 0.6 AS Credito60PorCiento FROM [" + carrera + "].[dbo].[Matriculas] AS m INNER JOIN [" + carrera + "].[dbo].[Periodos] AS p ON p.strCodigo = m.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Materias_Pensum] AS mp ON mp.strCodPensum = p.strCodPensum AND mp.strCodNivel = m.strCodNivel WHERE m.strCodPeriodo = '" + periodo + "' AND m.sintCodigo = '" + intmatricula + "' GROUP BY m.strCodPeriodo, m.strCodNivel, p.strCodPensum ) AS CreditosMalla CROSS JOIN ( SELECT SUM(mp.fltCreditos) AS TotalCreditoMatriculada FROM [" + carrera + "].[dbo].[Matriculas] AS m INNER JOIN [" + carrera + "].[dbo].[Materias_Asignadas] AS ma ON ma.sintCodMatricula = m.sintCodigo AND ma.strCodPeriodo = m.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Periodos] AS p ON p.strCodigo = m.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Materias_Pensum] AS mp ON mp.strCodPensum = p.strCodPensum AND mp.strCodMateria = ma.strCodMateria WHERE m.strCodPeriodo = '" + periodo + "' AND m.sintCodigo = '" + intmatricula + "' AND (ma.strObservaciones NOT LIKE '%VALIDADA%' AND ma.strObservaciones NOT LIKE '%RETIRADO%') ) AS CreditosMatriculados;"

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
  module.exports.CalculoEstudiantesRegulares60PorCientoTransaccion = async function (transaction,carrera,periodo,intmatricula) {
    var sentencia="";
    sentencia=" SELECT CreditosMalla.strCodPeriodo, CreditosMalla.strCodNivel, CreditosMalla.strCodPensum, CreditosMalla.TotalCreditoMalla, CreditosMalla.Credito60PorCiento, CreditosMatriculados.TotalCreditoMatriculada, CASE WHEN CreditosMatriculados.TotalCreditoMatriculada >= CreditosMalla.Credito60PorCiento THEN 'REGULAR' ELSE 'NO REGULAR' END AS Estudiante FROM ( SELECT m.strCodPeriodo, m.strCodNivel, p.strCodPensum, SUM(mp.fltCreditos) AS TotalCreditoMalla, SUM(mp.fltCreditos) * 0.6 AS Credito60PorCiento FROM [" + carrera + "].[dbo].[Matriculas] AS m INNER JOIN [" + carrera + "].[dbo].[Periodos] AS p ON p.strCodigo = m.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Materias_Pensum] AS mp ON mp.strCodPensum = p.strCodPensum AND mp.strCodNivel = m.strCodNivel WHERE m.strCodPeriodo = '" + periodo + "' AND m.sintCodigo = '" + intmatricula + "' GROUP BY m.strCodPeriodo, m.strCodNivel, p.strCodPensum ) AS CreditosMalla CROSS JOIN ( SELECT SUM(mp.fltCreditos) AS TotalCreditoMatriculada FROM [" + carrera + "].[dbo].[Matriculas] AS m INNER JOIN [" + carrera + "].[dbo].[Materias_Asignadas] AS ma ON ma.sintCodMatricula = m.sintCodigo AND ma.strCodPeriodo = m.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Periodos] AS p ON p.strCodigo = m.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Materias_Pensum] AS mp ON mp.strCodPensum = p.strCodPensum AND mp.strCodMateria = ma.strCodMateria WHERE m.strCodPeriodo = '" + periodo + "' AND m.sintCodigo = '" + intmatricula + "' AND (ma.strObservaciones NOT LIKE '%VALIDADA%' AND ma.strObservaciones NOT LIKE '%RETIRADO%') ) AS CreditosMatriculados;"

    try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaction,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  
  }
  module.exports.ObternerAsignaturasAprobadasReprobadasEstudiante = async function (carrera,periodo,intMatricula) {
    var sentencia="";
    sentencia="SELECT SUM(CASE WHEN (np.Aprobado = 1 ) THEN 1 ELSE 0 END) AS Aprueba, SUM(CASE WHEN (np.Aprobado = 0 ) THEN 1 ELSE 0 END) AS Reprueba, COUNT(sintCodMatricula) AS Total FROM ( SELECT sintCodMatricula, strCodPeriodo, strCodMateria, MAX( CASE WHEN strCodEquiv = 'A' THEN 1 ELSE 0 END) AS Aprobado FROM [" + carrera + "].[dbo].[Notas_Parciales] WHERE strCodPeriodo = '" + periodo + "' AND sintCodMatricula =" + intMatricula + " GROUP BY sintCodMatricula, strCodPeriodo, strCodMateria) AS np"
   
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
  module.exports.ObternerAsignaturasAprobadasReprobadasEstudianteTransaccion = async function (transaction,carrera,periodo,intMatricula) {
    var sentencia="";
    sentencia="SELECT SUM(CASE WHEN (np.Aprobado = 1 ) THEN 1 ELSE 0 END) AS Aprueba, SUM(CASE WHEN (np.Aprobado = 0 ) THEN 1 ELSE 0 END) AS Reprueba, COUNT(sintCodMatricula) AS Total FROM ( SELECT sintCodMatricula, strCodPeriodo, strCodMateria, MAX( CASE WHEN strCodEquiv = 'A' THEN 1 ELSE 0 END) AS Aprobado FROM [" + carrera + "].[dbo].[Notas_Parciales] WHERE strCodPeriodo = '" + periodo + "' AND sintCodMatricula =" + intMatricula + " GROUP BY sintCodMatricula, strCodPeriodo, strCodMateria) AS np"
   
    try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaction,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }
   module.exports.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudianteTransaccion = async function (transaction,carrera,periodo,intMatricula) {
    var sentencia="";
    sentencia="SELECT SUM(CASE WHEN (np.Aprobado = 1 ) THEN 1 ELSE 0 END) AS Aprueba, SUM(CASE WHEN (np.Aprobado = 0 ) THEN 1 ELSE 0 END) AS Reprueba, COUNT(sintCodMatricula) AS Total FROM ( SELECT sintCodMatricula, strCodPeriodo, strCodMateria, MAX( CASE WHEN strCodEquiv = 'A' OR strCodEquiv = 'E' THEN 1 ELSE 0 END) AS Aprobado FROM [" + carrera + "].[dbo].[Notas_Examenes] WHERE strCodPeriodo = '" + periodo + "' AND sintCodMatricula =" + intMatricula + " GROUP BY sintCodMatricula, strCodPeriodo, strCodMateria) AS np"
   
    try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaction,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }
     module.exports.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudiante = async function (carrera,periodo,intMatricula) {
    var sentencia="";
    sentencia="SELECT SUM(CASE WHEN (np.Aprobado = 1 ) THEN 1 ELSE 0 END) AS Aprueba, SUM(CASE WHEN (np.Aprobado = 0 ) THEN 1 ELSE 0 END) AS Reprueba, COUNT(sintCodMatricula) AS Total FROM ( SELECT sintCodMatricula, strCodPeriodo, strCodMateria, MAX( CASE WHEN strCodEquiv = 'A' OR strCodEquiv = 'E' THEN 1 ELSE 0 END) AS Aprobado FROM [" + carrera + "].[dbo].[Notas_Examenes] WHERE strCodPeriodo = '" + periodo + "' AND sintCodMatricula =" + intMatricula + " GROUP BY sintCodMatricula, strCodPeriodo, strCodMateria) AS np"
   
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
  module.exports.ListadoHomologacionesCarreraPeriodoTransaccion = async function (transaction,carrera,periodo) {
    var sentencia="";
    sentencia=" select * from [" + carrera + "].[dbo].[homologacioncarreras] where  periodo='" + periodo + "'  "
      try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaction,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }
  module.exports.ListadoEstudiantesConfirmadoMatrizSenecytTransaccion = async function (transaccion,carrera,periodo) {
    var sentencia="";
  
    sentencia="SELECT * FROM [" + carrera + "].[cupos].[tb_cupos] AS C INNER JOIN [" + carrera + "].[cupos].[tb_detalle_cupo] AS DC ON DC.dc_idcupo=C.c_id WHERE C.c_periodo='" + periodo + "' AND DC.dc_idestado=1 AND DC.dc_periodo='" + periodo + "'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaccion,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  
  }
  module.exports.ListadoEstudiantesConfirmadoMatrizSenecyt = async function (carrera,periodo) {
    var sentencia="";
  
    sentencia="SELECT * FROM [" + carrera + "].[cupos].[tb_cupos] AS C INNER JOIN [" + carrera + "].[cupos].[tb_detalle_cupo] AS DC ON DC.dc_idcupo=C.c_id WHERE C.c_periodo='" + periodo + "' AND DC.dc_idestado=1 AND DC.dc_periodo='" + periodo + "'"
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
  module.exports.ListadoHomologacionesCarreraPeriodo = async function (carrera,periodo) {
    var sentencia="";
    sentencia=" select * from [" + carrera + "].[dbo].[homologacioncarreras] where  periodo='" + periodo + "'  "
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
  module.exports.EncontrarEstudianteMatriculadoTransaccion = async function (transaccion,carrera,periodo,cedula) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matriculas] as m  INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on m.strCodEstud=e.strCodigo WHERE e.strCedula='" + cedula + "' and  m.strCodPeriodo='" + periodo + "' and m.strCodEstado='DEF' "
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaccion,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  
  }
  module.exports.EncontrarEstudianteMatriculado = async function (carrera,periodo,cedula) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matriculas] as m  INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on m.strCodEstud=e.strCodigo WHERE e.strCedula='" + cedula + "' and  m.strCodPeriodo='" + periodo + "' and m.strCodEstado='DEF' "
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
  module.exports.EncontrarUltimoNivelCarreraTransaccion = async function (transaccion,carrera) {
    var sentencia="";
    sentencia="select  strCodPensum,max([strCodNivel]) as ultimo from [" + carrera + "].[dbo].[Materias_Pensum] where [strCodPensum]=(select [strCodigo] from [" + carrera + "].[dbo].[Pensums] where [blnActivo]=1) group by strCodPensum"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaccion,carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  
  }


    module.exports.EncontrarUltimoPesumCarrera = async function (carrera) {
    var sentencia="";
    sentencia="SELECT TOP 1 * FROM [" + carrera + "].[dbo].[Pensums] WHERE dtFechaInic IS NOT NULL and [blnActivo]=1 ORDER BY dtFechaInic DESC;"
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
    module.exports.ReglamentoActivoMaster = async function (carrera) {
    var sentencia="";
    sentencia="SELECT TOP 1 * FROM [" + carrera + "].[seguridad].[reglamento] WHERE [reg_fecha] IS NOT NULL and [reg_estado]=1 ORDER BY [reg_fecha] DESC;"
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
    module.exports.ListadoPeriodosCarrera = async function (carrera) {
    var sentencia="";
    sentencia = "SELECT TOP 10 * FROM [" + carrera + "].[dbo].[Periodos] ORDER BY dtFechaInic DESC";
 
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
      module.exports.VigentePeriodosCarrera = async function (carrera) {
    var sentencia="";
    sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Periodos] WHERE blnVigente=1";
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

  module.exports.MatriculasCarrerasPeriodoAcademicos = async function (carrera,periodo) {
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

  