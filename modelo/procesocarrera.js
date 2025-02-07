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

  module.exports.CalculosEstuidantesPorAsignaturas = async function ( carrera, periodo,materia) {
    var sentencia = "";
   // sentencia = "WITH UltimosRegistros AS (SELECT sintCodMatricula,strCodPeriodo,strCodMateria,strCodTipoExamen,dcParcial1,dcParcial2,strCodEquiv FROM ( SELECT sintCodMatricula,strCodPeriodo, strCodMateria,strCodTipoExamen,dcParcial1, dcParcial2, strCodEquiv, ROW_NUMBER() OVER ( PARTITION BY sintCodMatricula ORDER BY CASE WHEN strCodTipoExamen = 'REC' THEN 1 ELSE 2 END, strCodTipoExamen DESC ) AS rn FROM Notas_Parciales ) AS UltimosRegistros WHERE rn = 1) select SUM(CASE WHEN (strCodEquiv='A' and strCodTipoExamen='PAR') THEN 1 ELSE 0 END) AS ApruebanDirecto, SUM(CASE WHEN (strCodEquiv='A' and strCodTipoExamen='REC' ) THEN 1 ELSE 0 END) AS ApruebanExamen, SUM(CASE WHEN (strCodEquiv='R' and strCodTipoExamen='PAR' ) THEN 1 ELSE 0 END) AS RepruebaDirecta, SUM(CASE WHEN (strCodEquiv='R' and strCodTipoExamen='REC' )THEN 1 ELSE 0 END) AS RepruebanExamen, COUNT(DISTINCT np.sintCodMatricula) as total from UltimosRegistros  as np where strCodPeriodo='" + periodo + "' and strCodMateria='" + materia + "' "
    sentencia = " SELECT SUM(CASE WHEN (strCodEquiv = 'A' AND strCodTipoExamen = 'PAR') THEN 1 ELSE 0 END) AS ApruebanDirecto, SUM(CASE WHEN (strCodEquiv = 'A' AND strCodTipoExamen = 'REC') THEN 1 ELSE 0 END) AS ApruebanExamen, SUM(CASE WHEN (strCodEquiv = 'R' AND strCodTipoExamen = 'PAR') THEN 1 ELSE 0 END) AS RepruebaDirecta, SUM(CASE WHEN (strCodEquiv = 'R' AND strCodTipoExamen = 'REC') THEN 1 ELSE 0 END) AS RepruebanExamen, COUNT(DISTINCT np.sintCodMatricula) AS total FROM ( SELECT np.sintCodMatricula, np.strCodPeriodo, np.strCodMateria, np.strCodTipoExamen, np.dcParcial1, np.dcParcial2, np.strCodEquiv FROM Notas_Parciales np WHERE np.strCodTipoExamen = ( SELECT TOP 1 np2.strCodTipoExamen FROM Notas_Parciales np2 WHERE np2.sintCodMatricula = np.sintCodMatricula ORDER BY CASE WHEN np2.strCodTipoExamen = 'REC' THEN 1 ELSE 2 END, np2.strCodTipoExamen DESC )) AS np WHERE strCodPeriodo = '" + periodo + "' AND strCodMateria ='" + materia + "';"
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