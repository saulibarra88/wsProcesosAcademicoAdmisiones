 const { connectionAcademico } = require('./../config/PollConexionesAcademico'); // Importa el pool de conexiones
const { execDinamico, execDinamicoTransaccion } = require("./../config/execSQLDinamico.helper");
const { execMaster, execMasterTransaccion } = require("./../config/execSQLMaster.helper");
const { execMasterMejorado} = require("./../config/execSQLMasterMejorado.helper");
const { execPagos,execPagosTransaccion} = require("./../config/execSQLPagos.helper");
const { execPagosMejorado} = require("./../config/execSQLPagosMejorado.helper");
const CONFIGACADEMICO = require('./../config/databaseDinamico');
const sql = require("mssql");
var os = require('os');
const fs = require('fs');
const path = require('path');
 
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
 module.exports.ListadoHomologacionesCarreraPeriodoTransacciones = async function (transaction,carrera,periodo) {
    var sentencia="";
    sentencia=" select * from [" + carrera + "].[dbo].[homologacioncarreras] where  periodo='" + periodo + "'  "
      try {
    if (sentencia != "") {
      const sqlConsulta = await execMasterTransaccion(transaction,carrera,sentencia, "OK","OK");
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

    module.exports.execMasterMejorado = async function (carrera,periodo,cedula) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[PagosFacturaElectronico] WHERE strCodPeriodo='" + periodo + "' AND strCedula='" + cedula + "' AND strEstado='PAG'"
   
    try {
    if (sentencia != "") {
      const sqlConsulta = await execMasterMejorado(carrera,sentencia, "OK","OK");
    
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
      const sqlConsulta = await execMaster(carrera,sentencia, "OK","OK");

     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  
  }
    module.exports.AsignaturasMatriculadaEstudiantePeriodoCantidadTransaccion = async function (transaction,carrera,periodo,intmatricula) {
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
     const sqlConsulta = await execMaster(carrera,sentencia, "OK","OK");
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
     const sqlConsulta = await execMaster(carrera,sentencia, "OK","OK");
     
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
       module.exports.ObternerAsignaturasAprobadasReprobadasCincoNotasEstudiante = async function (carrera,periodo,intMatricula) {
    var sentencia="";
    sentencia="SELECT SUM(CASE WHEN (np.Aprobado = 1 ) THEN 1 ELSE 0 END) AS Aprueba, SUM(CASE WHEN (np.Aprobado = 0 ) THEN 1 ELSE 0 END) AS Reprueba, COUNT(sintCodMatricula) AS Total FROM ( SELECT sintCodMatricula, strCodPeriodo, strCodMateria, MAX( CASE WHEN strCodEquiv = 'A' OR strCodEquiv = 'E' THEN 1 ELSE 0 END) AS Aprobado FROM [" + carrera + "].[dbo].[Notas_Examenes] WHERE strCodPeriodo = '" + periodo + "' AND sintCodMatricula =" + intMatricula + " GROUP BY sintCodMatricula, strCodPeriodo, strCodMateria) AS np"
   
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
   module.exports.ObtenerPagoMatriculaEstudiante = async function (carrera,periodo,cedula) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[PagosFacturaElectronico] WHERE strCodPeriodo='" + periodo + "' AND strCedula='" + cedula + "' AND strEstado='PAG'"
   
    try {
    if (sentencia != "") {
      const sqlConsulta = await execPagos(carrera,sentencia, "OK","OK");
    
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
      const sqlConsulta = await execPagosTransaccion(transaction,carrera,sentencia, "OK","OK");
    
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }
  module.exports.ObtenerDatosBase = async function (bddatos,carrera) {
  var sentencia="";
  sentencia="SELECT F.strNombre as strNombreFacultad, C.strNombre as strNombreCarrera, * FROM [" + bddatos + "].[dbo].Facultades AS F INNER JOIN [" + bddatos + "].[dbo].Escuelas AS E ON E.strCodFacultad=F.strCodigo INNER JOIN [" + bddatos + "].[dbo].Carreras AS C ON C.strCodEscuela=E.strCodigo  WHERE C.strBaseDatos='" + carrera + "' "
 
try {
  if (sentencia != "") {
    const sqlConsulta = await execMaster(bddatos,sentencia, "OK","OK");
  
   return (sqlConsulta)
  } else {
    return {data:"vacio sql"}
  }
} catch (error) {
  return {data:"Error: "+ error}
}
}
  module.exports.ObtenerDatosBaseTransaccion = async function (transaction,bddatos,carrera) {
  var sentencia="";
  sentencia="SELECT F.strNombre as strNombreFacultad, C.strNombre as strNombreCarrera, * FROM [" + bddatos + "].[dbo].Facultades AS F INNER JOIN [" + bddatos + "].[dbo].Escuelas AS E ON E.strCodFacultad=F.strCodigo INNER JOIN [" + bddatos + "].[dbo].Carreras AS C ON C.strCodEscuela=E.strCodigo  WHERE C.strBaseDatos='" + carrera + "' "
 
try {
  if (sentencia != "") {
    const sqlConsulta = await execMasterTransaccion(transaction,bddatos,sentencia, "OK","OK");
  
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
      const sqlConsulta = await execMasterMejorado(carrera,sentencia, "OK","OK");
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
      const sqlConsulta = await execMasterMejorado(carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  
  }

  module.exports.ListadoEstudiantePeriodoMatricula = async function ( carrera,periodo,estado) {
  var sentencia = "";
  sentencia = " select * from [" + carrera + "].[dbo].[Matriculas] as m inner join [" + carrera + "].[dbo].[Estudiantes] as e on m.strCodEstud=e.strCodigo where m.strCodPeriodo='" + periodo + "' and m.strCodEstado='" + estado + "' order by m.strCodNivel"

  try {
    if (sentencia != "") {
      const sqlconsulta = await execMasterMejorado( carrera, sentencia, "OK", "OK");
      return (sqlconsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}

module.exports.ListadoAsignaturasEstudiante = async function ( carrera,periodo,intMatricula) {
  var sentencia = "";
  sentencia = " select * from [" + carrera + "].[dbo].[Materias_Asignadas] as ma inner join [" + carrera + "].[dbo].[Materias] as m on ma.strCodMateria=m.strCodigo where  ma.strCodPeriodo='" + periodo + "' and ma.sintCodMatricula='" + intMatricula + "'"
  try {
    if (sentencia != "") {
      const sqlconsulta = await execMasterMejorado( carrera, sentencia, "OK", "OK");
      return (sqlconsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}

module.exports.ObtenerConvalidacionesEstudiante = async function ( carrera, periodo, idmatricula, CodMateria) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Convalidaciones] WHERE sintCodMatricula=" + idmatricula + " and  strCodPeriodo='" + periodo + "' and  strCodMateria='" + CodMateria + "'"
  try {
    if (sentencia != "") {
      const sqlconsulta = await execMasterMejorado( carrera, sentencia, "OK", "OK");
      return (sqlconsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}

module.exports.ObtenerRetirosEstudiante = async function ( carrera, periodo, idmatricula, CodMateria) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Retiros] WHERE sintCodMatricula=" + idmatricula + " and  strCodPeriodo='" + periodo + "' and  strCodMateria='" + CodMateria + "'"
  try {
    if (sentencia != "") {
      const sqlconsulta = await execMasterMejorado( carrera, sentencia, "OK", "OK");
      return (sqlconsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}

module.exports.ObtenerMateriaNoAprobarEstudiante = async function (carrera, CodMateria, codEstudiante) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Materias_Sin_Tener_Aprobar] WHERE strCodEstud=" + codEstudiante + " and  strCodMat='" + CodMateria + "'"
  try {
    if (sentencia != "") {
      const sqlconsulta = await execMasterMejorado( carrera, sentencia, "OK", "OK");
      return (sqlconsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}

module.exports.ObtenerNotaPacialAsignatura = async function (carrera, idMatricula, periodo, asignatura) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Notas_Parciales] AS np WHERE np.strCodPeriodo= '" + periodo + "' and np.sintCodMatricula= " + idMatricula + " and np.strCodMateria= '" + asignatura + "';"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execMasterMejorado(carrera, sentencia, "OK", "OK");
      return (sqlConsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }

}

module.exports.ObtenerParametroCalificacionPorCodEquivalencia = async function (carrera, codEquivalencia, idreglemanto) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[equivalenciarendimiento] AS eqv WHERE eqv.eqrencualitativa= '" + codEquivalencia + "' and eqv.eqrenregid= " + idreglemanto + ";"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execMasterMejorado(carrera, sentencia, "OK", "OK");
      return (sqlConsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}
module.exports.PeriodoDatosCarrera = async function (carrera,periodo) {
  var sentencia="";
  sentencia=" SELECT * FROM [" + carrera + "].dbo.Periodos WHERE strCodigo='" + periodo + "' "
    try {
  if (sentencia != "") {
    const sqlConsulta = await execMasterMejorado(carrera,sentencia, "OK","OK");
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
      const sqlConsulta = await execMasterMejorado(carrera,sentencia, "OK","OK");
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
      const sqlConsulta = await execMasterMejorado(carrera,sentencia, "OK","OK");
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
      const sqlConsulta = await execMasterMejorado(carrera,sentencia, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }
  }