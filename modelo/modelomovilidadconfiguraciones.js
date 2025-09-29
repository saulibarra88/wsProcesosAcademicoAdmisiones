const { connectionAcademico } = require('../config/PollConexionesAcademico'); // Importa el pool de conexiones
const {  execDinamico,execDinamicoTransaccion} = require("../config/execSQLDinamico.helper");
const {  execMaster,execMasterTransaccion} = require("../config/execSQLMaster.helper");
const CONFIGMASTER = require('../config/baseMaster');
const CONFIGACADEMICO = require('../config/databaseDinamico');

const sql = require("mssql");
var os = require('os');

module.exports.ListadoFacultadesAdministracion = async function (carrera) {
    var sentencia="";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Facultades] ORDER BY strNombre"; 
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

  module.exports.ListadoFacultadesActivas = async function (carrera) {
    var sentencia=""; 
    sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Facultades] WHERE [strCodigo] NOT IN ('CAA','FXM') ORDER BY strNombre"; 
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

    module.exports.ListadoEscuelaAdministracion = async function (carrera, facultad) {
    var sentencia=""; 
    sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Escuelas] WHERE [strCodFacultad] = '" + facultad + "' ORDER BY strNombre"; 
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
    module.exports.ListadoCarrerasAdministracion = async function (carrera, escuela) {
    var sentencia=""; 
    sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Carreras] WHERE [strCodEscuela] = '" + escuela + "' ORDER BY strNombre"; 
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
     module.exports.InsertarEscuela= async function (carrera,objEscuela) {
      const now = new Date().toISOString().slice(0, 10).replace('T', ' ');
    var sentencia=""; 
    sentencia = "INSERT INTO [" + carrera + "].[dbo].[Escuelas]([strCodigo],[strNombre],[strDirector],[strCedulaDirector],[strClaveDirector],[dtCreacion],[strUbicacion],[imgLogo],[strDatos],[strCodEstado],[strCodFacultad],[strCodTipoEntidad]) VALUES ('" + objEscuela.strCodigo + "','" + objEscuela.strNombre + "','" + objEscuela.strDirector + "','" + objEscuela.strCedulaDirector + "','" + objEscuela.strClaveDirector + "'," + now+ ",'" + objEscuela.strUbicacion + "','" + objEscuela.imgLogo + "','" + objEscuela.strDatos + "','ABI','" + objEscuela.strCodFacultad + "','ESC')"; 
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
   module.exports.ActualizarEscuela = async function (carrera,objEscuela) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Escuelas] SET [strNombre]='" + objEscuela.strNombre + "',[strDirector]='" + objEscuela.strDirector + "',[strCedulaDirector]='" + objEscuela.strCedulaDirector + "',[strClaveDirector]='" + objEscuela.strClaveDirector + "',[strUbicacion]='" + objEscuela.strUbicacion + "',[imgLogo]='" + objEscuela.imgLogo + "',[strDatos]='" + objEscuela.strDatos + "' WHERE [strCodFacultad]='" + objEscuela.strCodFacultad + "' AND [strCodigo]='" + objEscuela.strCodigo + "'"
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

   module.exports.CambiarEstadoEscuela = async function (carrera,codigo,facultad,estado) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Escuelas] SET [strCodEstado]='" + estado+ "' WHERE [strCodigo]='" + codigo+ "' AND  [strCodFacultad]='" + facultad+ "'"
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

 module.exports.InsertarCarrera= async function (carrera,objCarrera) {
 
    var sentencia=""; 
    sentencia = "INSERT INTO [" + carrera + "].[dbo].[Carreras]([strCodigo],[strNombre],[strCodEstado],[strBaseDatos],[strCodEscuela],[strNumSeguridad],[strCodTipoEntidad],[blnAdmiteInscripcion],[blnAdmiteCambioCarrera],[blnAdmiteMigrarEstudiante],[strCodCarreraOrigen],[strSede],[intTotalHoras],[intTotalSemanasSemestre],[carrera_unica]) VALUES ('" + objCarrera.strCodigo + "','" + objCarrera.strNombre + "','ABI','" + objCarrera.strBaseDatos + "','" + objCarrera.strCodEscuela + "','" + objCarrera.strNumSeguridad + "','CAR'," + objCarrera.blnAdmiteInscripcion + "," + objCarrera.blnAdmiteCambioCarrera + "," + objCarrera.blnAdmiteMigrarEstudiante + "," + null + ",'" + objCarrera.strSede + "'," + objCarrera.intTotalHoras + "," + objCarrera.intTotalSemanasSemestre + ",'" + objCarrera.carrera_unica + "')"; 
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

  
   module.exports.CambiarEstadoCarrera = async function (carrera,codigo,escuela,estado) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Carreras] SET [strCodEstado]='" + estado+ "' WHERE [strCodigo]='" + codigo+ "' AND  [strCodEscuela]='" + escuela+ "'"
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

   module.exports.ListadoSedes = async function (carrera) {
  var sentencia="";
  sentencia="SELECT [strSede] FROM [" + carrera + "].[dbo].[Carreras] GROUP BY [strSede]"
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
   module.exports.ObtnerCodigoSeguridadCarrera = async function (carrera,escuela) {
  var sentencia="";
  sentencia="SELECT [strCodEscuela],[strNumSeguridad] FROM [" + carrera + "].[dbo].[Carreras] WHERE [strCodEscuela]='" + escuela+ "' GROUP BY [strCodEscuela],[strNumSeguridad]"
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

   module.exports.ActualizarCarrera = async function (carrera,objCarrera) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Carreras] SET [strNombre]='" + objCarrera.strNombre + "',[blnAdmiteInscripcion]=" + objCarrera.blnAdmiteInscripcion + ",[blnAdmiteCambioCarrera]=" + objCarrera.blnAdmiteCambioCarrera + ",[blnAdmiteMigrarEstudiante]=" + objCarrera.blnAdmiteMigrarEstudiante + ",[intTotalHoras]=" + objCarrera.intTotalHoras + ",[intTotalSemanasSemestre]=" + objCarrera.intTotalSemanasSemestre + " WHERE [strCodigo]='" + objCarrera.strCodigo + "' AND [strCodEscuela]='" + objCarrera.strCodEscuela + "'"
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

 module.exports.InsertarPais= async function (carrera,strCodigo,strnombre) {
 
    var sentencia=""; 
    sentencia = "INSERT INTO [" + carrera + "].[dbo].[Paises]([strCodigo],[strNombre]) VALUES ('" + strCodigo+ "','" + strnombre + "')"; 
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

     module.exports.ActualizarPais = async function (carrera,strCodigo,strnombre) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Paises] SET [strNombre]='" + strnombre + "' WHERE [strCodigo]='" + strCodigo+ "'"
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
     module.exports.InsertarProvincia = async function (carrera,strCodigo,strNombre,strCodPais) {
  var sentencia="";
  sentencia="INSERT INTO [" + carrera + "].[dbo].[Provincias] ([strCodigo] ,[strNombre] ,[strCodPais]) VALUES ('" + strCodigo+ "','" + strNombre + "','" + strCodPais + "')"
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
     module.exports.ActulizarProvincia = async function (carrera,strCodigo,strNombre,strCodPais) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Provincias] SET [strNombre]='" + strNombre + "' WHERE [strCodigo]='" + strCodigo+ "' and [strCodPais]='" + strCodPais + "'"
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

     module.exports.InsertarCiudad = async function (carrera,strCodigo,strNombre,strCodProv) {
  var sentencia="";
  sentencia="INSERT INTO [" + carrera + "].[dbo].[Ciudades] ([strCodigo] ,[strNombre] ,[strCodProv]) VALUES ('" + strCodigo+ "','" + strNombre + "','" + strCodProv + "')"
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

     module.exports.ActulizarCiudad = async function (carrera,strCodigo,strNombre,strCodProv) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Ciudades] SET [strNombre]='" + strNombre + "' WHERE [strCodigo]='" + strCodigo+ "' and [strCodProv]='" + strCodProv + "'"
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

module.exports.ListadoTiposInstituciones = async function (carrera) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Tipos_Instituciones] ORDER BY strDescripcion"
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

 module.exports.ListadoInstitucionesMasterTodas = async function (carrera) {

  var sentencia="";
  sentencia="SELECT ins.strCodigo as codigoinst, ins.strNombre as nombreinst,c.strCodigo as codigociudad,c.strNombre as nombreciudad,tc.strCodigo as tipoinstitucion,tc.strDescripcion as nombretipo, * FROM [" + carrera + "].[dbo].[Instituciones] as ins INNER JOIN [" + carrera + "].[dbo].[Ciudades] AS c on c.strCodigo=ins.strCodCiudad INNER JOIN [" + carrera + "].[dbo].[Tipos_Instituciones] AS tc on tc.strCodigo=ins.strCodTipo ORDER BY ins.strNombre"

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

     module.exports.InsertarInstitucion = async function (carrera,strCodigo,strNombre,strCodCiudad,strCodTipo) {
  var sentencia="";
  sentencia="INSERT INTO [" + carrera + "].[dbo].[Instituciones] ([strCodigo] ,[strNombre] ,[strCodCiudad],[strCodTipo]) VALUES ('" + strCodigo+ "','" + strNombre + "','" + strCodCiudad + "','" + strCodTipo + "')"
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

     module.exports.ActulizarInstituciones = async function (carrera,strCodigo,strNombre,strCodCiudad,strCodTipo) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Instituciones] SET [strNombre]='" + strNombre + "',[strCodCiudad]='" + strCodCiudad + "',[strCodTipo]='" + strCodTipo + "' WHERE [strCodigo]='" + strCodigo+ "'"
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
module.exports.ListadoTitulosMaster = async function (carrera) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Titulos] ORDER BY strNombre ASC"
 
try {
  if (sentencia != "") {
    const sqlConsulta = await execDinamico("OAS_Master",sentencia, "OK","OK");
  
   return (sqlConsulta)
  } else {
    return {data:"vacio sql"}
  }
} catch (error) {
  return {data:"Error: "+ error}
}
}

    module.exports.InsertarTitulo = async function (carrera,strCodigo,strNombre,blnProfesional) {
  var sentencia="";
  sentencia="INSERT INTO [" + carrera + "].[dbo].[Titulos] ([strCodigo] ,[strNombre] ,[blnProfesional]) VALUES ('" + strCodigo+ "','" + strNombre + "'," + blnProfesional + ")"
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

     module.exports.ActulizarTitulo = async function (carrera,strCodigo,strNombre,blnProfesional) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Titulos] SET [strNombre]='" + strNombre + "',[blnProfesional]='" + blnProfesional + "'WHERE [strCodigo]='" + strCodigo+ "'"
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
module.exports.ObtenerDatosInstitucion = async function (carrera) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Configuracion_Institucion] "
 
try {
  if (sentencia != "") {
    const sqlConsulta = await execDinamico("OAS_Master",sentencia, "OK","OK");
  
   return (sqlConsulta)
  } else {
    return {data:"vacio sql"}
  }
} catch (error) {
  return {data:"Error: "+ error}
}
}
     module.exports.ActualizarDatosInstitucion = async function (carrera,objDatos) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Configuracion_Institucion] SET [strNombre]='" + objDatos.strNombre + "',[strRector]='" + objDatos.strRector + "',[strCedulaRector]='" + objDatos.strCedulaRector + "',[strClaveRector]='" + objDatos.strClaveRector + "',[strViceRAca]='" + objDatos.strViceRAca + "',[strCedulaViceRAca]='" + objDatos.strCedulaViceRAca + "',[strClaveViceRAca]='" + objDatos.strClaveViceRAca + "',[strViceRAdm]='" + objDatos.strViceRAdm + "',[strCedulaViceRAdm]='" + objDatos.strCedulaViceRAdm + "',[strClaveViceRAdm]='" + objDatos.strClaveViceRAdm + "',[strSecreAca]='" + objDatos.strSecreAca + "',[strCedulaSecreAca]='" + objDatos.strCedulaSecreAca + "',[strClaveSecreAca]='" + objDatos.strClaveSecreAca + "',[strCedUsuResp]='" + objDatos.strCedUsuResp + "',[strDir]='" + objDatos.strDir + "',[strTelefonos]='" + objDatos.strTelefonos + "',[strDatos]='" + objDatos.strDatos + "',[strCodSexoSecreAca]='" + objDatos.strCodSexoSecreAca + "',[strCodSexoRector]='" + objDatos.strCodSexoRector + "',[strCodSexoVRectorAca]='" + objDatos.strCodSexoVRectorAca + "',[strCodSexoVRectorAdm]='" + objDatos.strCodSexoVRectorAdm + "',[strLogo]='" + objDatos.strLogo + "',[strViceInvestigacion]='" + objDatos.strViceInvestigacion + "',[strCedulaInvestigacion]='" + objDatos.strCedulaInvestigacion + "',[strClaveInvestigacion]='" + objDatos.strClaveInvestigacion + "',[strCodSexoInvestigacion]='" + objDatos.strCodSexoInvestigacion + "' WHERE [strCodigo]='" + objDatos.strCodigo+ "'"
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

     module.exports.ObtenerNuevoCodigoPeriodoRemedial = async function (carrera) {
  var sentencia="";
  sentencia="SELECT TOP 1 *, CAST(SUBSTRING(strCodigo, 2, LEN(strCodigo)) AS numeric) AS NumeroActual, 'R' + RIGHT('000' + CAST(CAST(SUBSTRING(strCodigo, 2, LEN(strCodigo)) AS numeric) + 1 AS VARCHAR), 3) AS NuevoCodigo FROM [" + carrera + "].[dbo].[Periodos] WHERE [strCodigo] LIKE 'R[0-9][0-9][0-9]' ORDER BY CAST(SUBSTRING(strCodigo, 2, LEN(strCodigo)) AS numeric) DESC;"
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
     module.exports.ObtenerNuevoCodigoPeriodoOrdinario = async function (carrera) {
  var sentencia="";
  sentencia="SELECT TOP 1 *, CAST(SUBSTRING(strCodigo, 2, LEN(strCodigo)) AS numeric) AS NumeroActual, 'P' + RIGHT('0000' + CAST(CAST(SUBSTRING(strCodigo, 2, LEN(strCodigo)) AS numeric) + 1 AS VARCHAR), 4) AS NuevoCodigo FROM [" + carrera + "].[dbo].[Periodos] WHERE [strCodigo] LIKE 'P[0-9][0-9][0-9][0-9]' ORDER BY CAST(SUBSTRING(strCodigo, 2, LEN(strCodigo)) AS numeric) DESC;"
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

   module.exports.InsertarPeridoAcademicoMaster = async function (carrera,objperiodo) {
  var sentencia="";
  sentencia="INSERT INTO [" + carrera + "].[dbo].[Periodos] ([strCodigo] ,[strDescripcion] ,[dtFechaInic] ,[dtFechaFin] ,[dtFechaTopeMatOrd] ,[dtFechaTopeMatExt] ,[dtFechaTopeMatPro] ,[dtFechaTopeRetMat] ,[strCodReglamento]) VALUES ('" + objperiodo.strCodigo+ "','" + objperiodo.strDescripcion+ "','" + objperiodo.dtFechaInic+ "','" + objperiodo.dtFechaFin+ "','" + objperiodo.dtFechaTopeMatOrd+ "','" + objperiodo.dtFechaTopeMatExt+ "','" + objperiodo.dtFechaTopeMatPro+ "','" + objperiodo.dtFechaTopeRetMat+ "','" + objperiodo.strCodReglamento+ "')"
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

   module.exports.ActualizarPeridoAcademicoCarrera = async function (carrera,objperiodo) {
  var sentencia="";
  sentencia="update [" + carrera + "].[dbo].[Periodos] set [strDescripcion]='" + objperiodo.strDescripcion+ "',[dtFechaInic]='" + objperiodo.dtFechaInic+ "',[dtFechaFin]='" + objperiodo.dtFechaFin+ "',[dtFechaTopeMatOrd]='" + objperiodo.dtFechaTopeMatOrd+ "',[dtFechaTopeMatExt]='" + objperiodo.dtFechaTopeMatExt+ "', [dtFechaTopeMatPro]='" + objperiodo.dtFechaTopeMatPro+ "',[dtFechaTopeRetMat]='" + objperiodo.dtFechaTopeRetMat+ "' where [strCodigo]='" + objperiodo.strCodigo+ "'"
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

   module.exports.ListadosTodasCarrerasAcademica = async function (carrera) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].Carreras order by  strNombre"
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

   module.exports.ListadoParametroCarreraCalificaciones = async function (carrera) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Parametros_Carrera] WHERE strCodigo  in ('FN1','FN2','FN3','FNP','FNS','FP1','FP2','FPR')"
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
   module.exports.ActualizarFechasCalificacionesCarrera = async function (carrera,strcodigo,strValor) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Parametros_Carrera] SET [strValor]='" + strValor+ "' WHERE [strCodigo]='" + strcodigo+ "'"
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

   module.exports.ActualizarFechasCalificacionesAcademico = async function (carrera,strcodigo,strValor,idReglamento) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Parametros_Sistema] SET [strValor]='" + strValor+ "' WHERE [strCodigo]='" + strcodigo+ "' AND idreglamento= " + idReglamento+ ""
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
   module.exports.ListadoFechaCalificacionesSistemaAcademico = async function (carrera) {
  var sentencia="";
  sentencia="SELECT p.*, r.* FROM [dbo].[Parametros_Sistema] p INNER JOIN [seguridad].[reglamento] r ON p.idreglamento=r.reg_id WHERE p.strCodigo IN ('FN1','FN2','FN3','FNP','FNS','FP1','FP2','FPR') AND r.[reg_estado] = 1"
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