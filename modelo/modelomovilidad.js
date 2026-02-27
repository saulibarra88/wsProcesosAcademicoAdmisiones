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
    var sentencia=""; sentencia = "WITH MateriasMatriculadas AS ( SELECT mp.strCodMateria FROM [" + carrera + "].[dbo].[Matriculas] AS m INNER JOIN [" + carrera + "].[dbo].[Periodos] AS p ON p.strCodigo = m.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Materias_Pensum] AS mp ON mp.strCodPensum = p.strCodPensum WHERE m.strCodEstud = " + codEstudiante + " AND m.strCodNivel = " + nivel + " AND m.strCodEstado = 'DEF' AND mp.strCodNivel = " + nivel + " AND m.strCodPeriodo = ( SELECT MAX(strCodPeriodo) FROM [" + carrera + "].[dbo].[Matriculas] as m WHERE strCodEstud = " + codEstudiante + " AND strCodEstado='DEF' AND m.strCodNivel = " + nivel + " ) ), MateriasAprobadas AS ( SELECT strCodMateria FROM [" + carrera + "].[dbo].[Materias_Aprobadas] WHERE strCodEstud = " + codEstudiante + " ) SELECT COUNT(*) AS materiaspensum, COUNT(CASE WHEN a.strCodMateria IS NOT NULL THEN 1 END) AS aprobadas, COUNT(CASE WHEN a.strCodMateria IS NULL THEN 1 END) AS no_aprobadas FROM MateriasMatriculadas m LEFT JOIN MateriasAprobadas a ON m.strCodMateria = a.strCodMateria; "; 

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

module.exports.ObtenerMateriasPerdidasSegundaMatriculaCantidad= async function (carrera,codEstudiante) {
    var sentencia="";

 sentencia = "WITH MateriasMatriculadasSegunda AS ( select ma.strCodMateria from [" + carrera + "].[dbo].[Matriculas] as m inner join [" + carrera + "].[dbo].[Materias_Asignadas] as ma on ma.sintCodMatricula=m.sintCodigo and ma.strCodPeriodo=m.strCodPeriodo where strCodEstud =" + codEstudiante + " and strCodEstado='DEF' and ma.bytNumMat>=3 and (ma.strObservaciones NOT LIKE '%VALIDADA%' AND ma.strObservaciones NOT LIKE '%RETIRADO%') ), MateriasAprobadas AS ( SELECT strCodMateria FROM [" + carrera + "].[dbo].[Materias_Aprobadas] WHERE strCodEstud = " + codEstudiante + " ) SELECT COUNT(*) AS materiasegundamat, COUNT(CASE WHEN a.strCodMateria IS NOT NULL THEN 1 END) AS aprobadas, COUNT(CASE WHEN a.strCodMateria IS NULL THEN 1 END) AS no_aprobadas FROM MateriasMatriculadasSegunda m LEFT JOIN MateriasAprobadas a ON m.strCodMateria = a.strCodMateria; "; 
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
     module.exports.ObtenerConfifuracionCupoMovilidadCarreraPeriodo= async function (carrera,dbcarreramovilidad,periodo) {
    var sentencia="";
     sentencia = "select * from [" + carrera + "].[seguridad].[tb_movilidad_config] where [mc_dbcarrera] = '" + dbcarreramovilidad + "' and  [mc_periodo]='" + periodo + "' AND [mc_estado]=1"; 
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
      module.exports.ObtenerSolicitudAprobadasCarrerasMovilidad= async function (carrera,dbcarreramovilidad,periodo,tipomovilidad) {
    var sentencia=""; 
    sentencia = "select * from [" + carrera + "].[dbo].[tb_movilidad_solicitud] where [cm_dbcarrera_movilidad]='" + dbcarreramovilidad + "' and [cm_periodo]='" + periodo + "' and [cm_idtipo_estado]='APRO' and cm_estado=1 and cm_idtipo_movilidad='" + tipomovilidad + "'"; 
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

 module.exports.InsertarSolicitudEstudiante= async function (carrera,datossolicitud) {
    var sentencia=""; 
    sentencia = "insert into [" + carrera + "].[dbo].[tb_movilidad_solicitud] ([cm_periodo],[cm_strsolicitud],[cm_strobservacion],[cm_perid],[cm_identificacion],[cm_idtipo_movilidad] ,[cm_idtipo_estado],[cm_dbcarrera_actual],[cm_nombrecarrera_actual],[cm_perdidatercera_actual],[cm_dbcarrera_movilidad],[cm_nombrecarrera_movilidad],[cm_impedimento_movilidad],[cm_puntaje],[cm_blpuntajeadmision]) values ('" + datossolicitud.cm_periodo + "','" + datossolicitud.cm_strsolicitud + "','" + datossolicitud.cm_strobservacion + "'," + datossolicitud.cm_perid + ",'" + datossolicitud.cm_identificacion + "','" + datossolicitud.cm_idtipo_movilidad + "','" + datossolicitud.cm_idtipo_estado + "','" + datossolicitud.cm_dbcarrera_actual + "','" + datossolicitud.cm_nombrecarrera_actual + "','" + datossolicitud.cm_perdidatercera_actual + "','" + datossolicitud.cm_dbcarrera_movilidad + "','" + datossolicitud.cm_nombrecarrera_movilidad + "','" + datossolicitud.cm_impedimento_movilidad + "','" + datossolicitud.cm_puntaje + "','" + datossolicitud.cm_blpuntajeadmision + "');select max([cm_id]) as cm_id from [" + carrera + "].[dbo].[tb_movilidad_solicitud] where [cm_estado]=1"; 
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
   module.exports.InsertarDocumentosMovilidad= async function (carrera,documentos) {
    var sentencia=""; 
    sentencia = "INSERT INTO  [" + carrera + "].[dbo].[tb_movilidad_solicitud_documentos]([msd_idsolicitud],[msd_strdescripcion],[msd_strtipo],[msd_strurl]) VALUES(" + documentos.msd_idsolicitud + ",'" + documentos.msd_strdescripcion + "','" + documentos.msd_strtipo + "','" + documentos.msd_strurl + "')"; 
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

  module.exports.ListadoSolicitudesMovilidadPorEstado= async function (carrera,estado,periodo) {
    var sentencia=""; 
    sentencia = "SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud] AS sm INNER JOIN [" + carrera + "].[dbo].[tb_movilidad_tipo_estado] AS mts ON mts.mte_strcodigo=sm.cm_idtipo_estado INNER JOIN [" + carrera + "].[dbo].[tb_movilidad_tipo_solicitud] AS mt ON mt.mte_strcodigo=sm.cm_idtipo_movilidad WHERE sm.[cm_idtipo_estado]='" + estado + "' AND sm.[cm_estado]=1 AND sm.[cm_periodo]='" + periodo + "' ORDER BY sm.[cm_fecha_registro]"; 
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
  module.exports.ListadoSolicitudesMovilidadPorCarrera= async function (carrera,estado,periodo,dbcarrera) {
    var sentencia=""; 
    sentencia = "SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud] AS sm INNER JOIN [" + carrera + "].[dbo].[tb_movilidad_tipo_estado] AS mts ON mts.mte_strcodigo=sm.cm_idtipo_estado INNER JOIN [" + carrera + "].[dbo].[tb_movilidad_tipo_solicitud] AS mt ON mt.mte_strcodigo=sm.cm_idtipo_movilidad WHERE sm.[cm_idtipo_estado]='" + estado + "' AND sm.[cm_estado]=1 AND sm.[cm_periodo]='" + periodo + "' AND sm.[cm_dbcarrera_movilidad]='" + dbcarrera + "' ORDER BY sm.[cm_fecha_registro]"; 
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
 module.exports.ObtnerFormatoTextoDadoCodigo= async function (carrera,codigo) {
    var sentencia=""; 
    sentencia = "SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_formato_texto] WHERE [mft_strcodigo]='" + codigo + "'"; 
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

   module.exports.ListadoTipoInscripcion= async function (carrera) {
    var sentencia=""; 
    sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Formas de Inscripcion]"; 
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

    module.exports.TotalesCantidadesSolicitud= async function (carrera) {
    var sentencia=""; 
    sentencia = "SELECT COUNT(CASE WHEN cm_idtipo_movilidad = 'MOVIN' AND cm_idtipo_estado='APRO' AND cm_estado=1  THEN 1 END) AS total_movin, COUNT(CASE WHEN cm_idtipo_movilidad = 'MOVEX' AND cm_idtipo_estado='APRO' AND cm_estado=1 THEN 1 END) AS total_movex, COUNT(CASE WHEN cm_idtipo_movilidad = 'MOVTP' AND cm_idtipo_estado='APRO' AND cm_estado=1 THEN 1 END) AS total_movtp, COUNT(CASE WHEN cm_idtipo_estado = 'GEN' AND cm_estado=1 THEN 1 END) AS total_gen, COUNT(CASE WHEN cm_idtipo_estado = 'CANC' AND cm_estado=1 THEN 1 END) AS total_rech, COUNT(CASE WHEN cm_idtipo_estado = 'ANU' AND cm_estado=1 THEN 1 END) AS total_anu, COUNT(CASE WHEN cm_idtipo_estado = 'APRO' AND cm_estado=1 THEN 1 END) AS total_apro, COUNT(CASE WHEN  cm_estado=1 THEN 1 END) AS total_solicitudes FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud];"; 
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

  module.exports.ObenterHomologacionCarrera = async function (carrera,bdcarrera,periodo) {
  var sentencia="";
  sentencia=" select * from [" + carrera + "].[dbo].[homologacioncarreras] where (hmbdbaseniv='" + bdcarrera + "' or hmbdbasecar='" + bdcarrera + "') and periodo='" + periodo + "' "
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

 module.exports.ObenterDatosCarrera = async function (carrera,bdcarrera) {
  var sentencia="";
  sentencia=" select * from [" + carrera + "].[dbo].[Carreras] where  [strBaseDatos]='" + bdcarrera + "'"
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
 module.exports.ObenterDatosCarreraCodigo = async function (carrera,codigocarrera) {
  var sentencia="";
  sentencia=" select * from [" + carrera + "].[dbo].[Carreras] where  [strCodigo]='" + codigocarrera + "'"
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
 module.exports.ObtnerDocumentosDadoIdSolicitud = async function (carrera,idSolicitud) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud_documentos] WHERE [msd_idsolicitud]=" + idSolicitud + " AND [msd_estado]=1"
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
 module.exports.ObtnerDocumentosDadoIdSolicitudTipo = async function (carrera,idSolicitud,tipo) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud_documentos] WHERE [msd_idsolicitud]=" + idSolicitud + " AND [msd_estado]=1 AND [msd_strtipo]='" + tipo + "'"
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

 module.exports.ObtenerSolictudesEstuidantePeriodosUltima = async function (carrera,dbcarrera,cedula,periodo) {
 var  sentencia=""
   sentencia="SELECT  TOP(1) * FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud] AS sm INNER JOIN [" + carrera + "].[dbo].[tb_movilidad_tipo_estado] AS mts ON mts.mte_strcodigo=sm.cm_idtipo_estado INNER JOIN [" + carrera + "].[dbo].[tb_movilidad_tipo_solicitud] AS mt ON mt.mte_strcodigo=sm.cm_idtipo_movilidad WHERE sm.[cm_identificacion]='" + cedula + "' AND sm.[cm_periodo]='" + periodo + "' AND sm.[cm_estado]=1 AND sm.[cm_dbcarrera_actual]='" + dbcarrera + "' order by sm.[cm_fecha_registro] desc";
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
 module.exports.ObtenerSolictudDadoId = async function (carrera,idSolicitud) {
 var  sentencia=""
   sentencia="SELECT  TOP(1) * FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud] AS sm INNER JOIN [" + carrera + "].[dbo].[tb_movilidad_tipo_estado] AS mts ON mts.mte_strcodigo=sm.cm_idtipo_estado INNER JOIN [" + carrera + "].[dbo].[tb_movilidad_tipo_solicitud] AS mt ON mt.mte_strcodigo=sm.cm_idtipo_movilidad WHERE  sm.[cm_id]='" + idSolicitud + "'";
 
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
 module.exports.ObtenerSolictudesEstuidantePeriodos = async function (carrera,dbcarrera,cedula,periodo) {
 var  sentencia=""
   sentencia="SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud] AS sm INNER JOIN [" + carrera + "].[dbo].[tb_movilidad_tipo_estado] AS mts ON mts.mte_strcodigo=sm.cm_idtipo_estado INNER JOIN [" + carrera + "].[dbo].[tb_movilidad_tipo_solicitud] AS mt ON mt.mte_strcodigo=sm.cm_idtipo_movilidad WHERE sm.[cm_identificacion]='" + cedula + "' AND sm.[cm_periodo]='" + periodo + "' AND sm.[cm_estado]=1 AND sm.[cm_dbcarrera_actual]='" + dbcarrera + "' order by sm.[cm_fecha_registro] desc";
 
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
 module.exports.ActualziarEstadoSolitiud = async function (carrera,idsolicitud,estado,observacion,perautorizacion) {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  var sentencia="";
  sentencia=" UPDATE [" + carrera + "].[dbo].[tb_movilidad_solicitud] SET [cm_strobservacion]='" + observacion + "',[cm_perid_autorizacion]=" + perautorizacion + ",[cm_fecha_autorizacion]='" + now + "',cm_idtipo_estado='" + estado + "' WHERE [cm_id]=" + idsolicitud + " AND [cm_estado]=1"
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

 module.exports.InsertarInscripcionEstuidante = async function (carrera,strCedEstud,strCodCarrera,strCodPeriodo,strCodFormaIns,strObservaciones,boolGratuidadT,boolGratuidad30) {
  const now = new Date().toISOString().slice(0, 10).replace('T', ' ');
  var sentencia="";
  sentencia="INSERT INTO [" + carrera + "].[dbo].[Inscripciones] ([strCedEstud],[strCodCarrera],[strCodPeriodo],[dtFecha],[blnConfirmada],[strCodFormaIns],[strObservaciones],[boolGratuidadT],[boolGratuidad30]) VALUES('" + strCedEstud + "','" + strCodCarrera + "','" + strCodPeriodo + "',CONVERT(datetime, '" + now + "', 120) ," + 0 + ",'" + strCodFormaIns + "','" + strObservaciones + "'," + boolGratuidadT + "," + boolGratuidad30 + ")"

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
 module.exports.ObtenerInscripcionEstuidante = async function (carrera,strCedEstud,strCodCarrera) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Inscripciones] WHERE [strCedEstud]='" + strCedEstud + "' AND [strCodCarrera]='" + strCodCarrera + "'"
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
 module.exports.ObtenerCodigoSiguienteEstuidante = async function (carrera) {
  var sentencia="";
  sentencia="SELECT TOP 1 (maxVal + 1) AS siguientecodigodisponible FROM ( SELECT MAX(CAST(strCodigo AS INT)) AS maxVal FROM [" + carrera + "].[dbo].[Estudiantes] WHERE ISNUMERIC(strCodigo) = 1 ) AS Maximo WHERE NOT EXISTS ( SELECT 1 FROM [" + carrera + "].[dbo].[Estudiantes] WHERE strCodigo = CAST((maxVal + 1) AS VARCHAR) );"
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
 module.exports.ObtenerCodigoSiguienteEstuidanteConfiguracionCarrera = async function (carrera) {
  var sentencia="";
  sentencia="SELECT ISNULL(CAST([lngUltNumEst] AS INT), 0) + 1 AS siguientecodigodisponible FROM [" + carrera + "].[dbo].[Configuracion_Carrera]"
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
 module.exports.ObtenerEstuidanteCarreraCodigo = async function (carrera,codigo) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Estudiantes] WHERE [strCodigo]='" + codigo + "'"
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
 module.exports.ActualizarUltimoEstuidanteConfiguracionCarrera = async function (carrera,numero) {
  var sentencia="";
  sentencia="update [" + carrera + "].[dbo].[Configuracion_Carrera] set [lngUltNumEst]='" + numero + "'"
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
 module.exports.InsertarEstudianteCarrera = async function (carrera,objEstuidante) {
    const now = new Date().toISOString().slice(0, 10).replace('T', ' ');
  var sentencia="";
  sentencia="INSERT INTO [" + carrera + "].[dbo].[Estudiantes]([strCodigo],[strCedula],[strNombres],[strApellidos],[strCedulaMil],[dtFechaNac],[dtFechaIng],[strEmail],[strNacionalidad],[strDocumentacion],[strCodSexo],[strCodTit],[strCodInt],[strFormaIns]) VALUES('" + objEstuidante.strCodigo + "','" + objEstuidante.strCedula + "','" + objEstuidante.strNombres + "','" + objEstuidante.strApellidos + "','" + objEstuidante.strCedulaMil + "','" + objEstuidante.dtFechaNac + "',CONVERT(datetime, '" + now + "', 120) ,'" + objEstuidante.strEmail + "','" + objEstuidante.strNacionalidad + "','" + objEstuidante.strDocumentacion + "','" + objEstuidante.strCodSexo + "','" + objEstuidante.strCodTit + "','" + objEstuidante.strCodInt + "','" + objEstuidante.strFormaIns + "')"
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

 module.exports.InsertarFotoEstudianteCarrera = async function (carrera,codigoestuidante,periodo,foto) {

  var sentencia="";
  sentencia="INSERT INTO [" + carrera + "].[dbo].[Estudiantefoto]([strCodigo],[strCodPeriodo],[strFoto],[actestado]) VALUES('" + codigoestuidante + "','" + periodo+ "','" + foto + "',1)"
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
 module.exports.InsertarCuposCarreraConfiguracion = async function (carrera,objCupoConfiguracion) {

  var sentencia="";
  sentencia="INSERT INTO [" + carrera + "].[seguridad].[tb_movilidad_config]([mc_strdescripcon],[mc_strobservacion],[mc_periodo],[mc_dbcarrera],[mc_nombre_carrera],[mc_cusid_carrera],[mc_urldocumento],[mc_puntaje_minimo_carrera],[mc_cupos_adminisiones],[mc_cupos_movi_interna],[mc_cupos_movi_externa],[mc_cupos_movi_traspaso], [mc_perid_registro],[mc_fecha_inicio],[mc_fecha_fin])VALUES('" + objCupoConfiguracion.mc_strdescripcon + "','" + objCupoConfiguracion.mc_strobservacion + "','" + objCupoConfiguracion.mc_periodo + "','" + objCupoConfiguracion.mc_dbcarrera + "','" + objCupoConfiguracion.mc_nombre_carrera + "','" + objCupoConfiguracion.mc_cusid_carrera + "'," + objCupoConfiguracion.mc_urldocumento + ",'" + objCupoConfiguracion.mc_puntaje_minimo_carrera + "','" + objCupoConfiguracion.mc_cupos_adminisiones + "','" + objCupoConfiguracion.mc_cupos_movi_interna + "','" + objCupoConfiguracion.mc_cupos_movi_externa + "','" + objCupoConfiguracion.mc_cupos_movi_traspaso + "','" + objCupoConfiguracion.mc_perid_registro + "'," + objCupoConfiguracion.mc_fecha_inicio + "," + objCupoConfiguracion.mc_fecha_fin + ")"
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

 module.exports.ObtenerCupoCarreraConfiguraciones = async function (carrera,dbcarrera,periodo) {

  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[seguridad].[tb_movilidad_config] WHERE mc_periodo='" + periodo + "' AND mc_dbcarrera='" + dbcarrera+ "' AND mc_estado=1"
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

 module.exports.ListadoCupoCarreraConfiguracionesPeriodo = async function (carrera,periodo) {

  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[seguridad].[tb_movilidad_config] WHERE mc_periodo='" + periodo + "' AND mc_estado=1"
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
 module.exports.ActulizarCupoCarreraConfiguraciones = async function (carrera,objConfiguracion) {

  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[seguridad].[tb_movilidad_config] SET [mc_puntaje_minimo_carrera]=" + objConfiguracion.mc_puntaje_minimo_carrera+ ",[mc_cupos_movi_interna]=" + objConfiguracion.mc_cupos_movi_interna+ ",[mc_cupos_movi_externa]=" + objConfiguracion.mc_cupos_movi_externa+ ",[mc_cupos_movi_traspaso]=" + objConfiguracion.mc_cupos_movi_traspaso+ ",[mc_fecha_inicio]='" + objConfiguracion.mc_fecha_inicio+ "',[mc_fecha_fin]='" + objConfiguracion.mc_fecha_fin+ "' WHERE [mc_id]=" + objConfiguracion.mc_id+ ""
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

 module.exports.ListadoPaisesMaster = async function (carrera) {

  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Paises] ORDER BY strNombre"
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
 module.exports.ListadoProvinciaMaster = async function (carrera,codPais) {

  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Provincias] WHERE strCodPais='"+codPais +"' ORDER BY strNombre"
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
 module.exports.ListadoCiudadMaster = async function (carrera,codProvincia) {

  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Ciudades] WHERE strCodProv='"+codProvincia +"' ORDER BY strNombre"
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
 module.exports.ListadoInstitucionesMaster = async function (carrera,codciudad) {

  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Instituciones] WHERE strCodCiudad='"+codciudad+"' ORDER BY strNombre"
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
 module.exports.IngresarEstudianteMaster = async function (carrera,objEstuidante) {

  var sentencia="";
  sentencia="INSERT INTO [" + carrera + "].[dbo].[Estudiantes] ([strCedula],[strNombres],[strApellidos],[strClave],[strCedulaMil],[dtFechaNac],[strNacionalidad],[strDir],[strTel] ,[imgFoto],[strEmail],[strCodSexo],[strCodEstCiv],[strNombresPadre],[strApellidosPadres],[strNombresMadre],[strApellidosMadre],[strCodEstVidP], [strCodEstVidM],[strCodEstado],[strCodCiudadProc],[strCodEstadoUsuario]) VALUES ('"+objEstuidante.strCedula+"','"+objEstuidante.strNombres+"','"+objEstuidante.strApellidos+"','"+objEstuidante.strClave+"','"+objEstuidante.strCedulaMil+"',CONVERT(datetime,'"+objEstuidante.dtFechaNac+"',112) ,'"+objEstuidante.strNacionalidad+"','"+objEstuidante.strDir+"','"+objEstuidante.strTel+"','"+objEstuidante.imgFoto+"','"+objEstuidante.strEmail+"','"+objEstuidante.strCodSexo+"','"+objEstuidante.strCodEstCiv+"','"+objEstuidante.strNombresPadre+"','"+objEstuidante.strApellidosPadres+"','"+objEstuidante.strNombresMadre+"','"+objEstuidante.strApellidosMadre+"','"+objEstuidante.strCodEstVidP+"','"+objEstuidante.strCodEstVidM+"','"+objEstuidante.strCodEstado+"','"+objEstuidante.strCodCiudadProc+"','"+objEstuidante.strCodEstadoUsuario+"')"
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
 module.exports.ActualizarEstudianteMaster = async function (carrera,objEstuidante) {

  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Estudiantes] SET [strNombres]='"+objEstuidante.strNombres+"',[strApellidos]='"+objEstuidante.strApellidos+"',[strClave]='"+objEstuidante.strClave+"',[strCedulaMil]='"+objEstuidante.strCedulaMil+"',[dtFechaNac]='"+objEstuidante.dtFechaNac+"',[strLugarNac]='"+objEstuidante.strLugarNac+"',[strNacionalidad]='"+objEstuidante.strNacionalidad+"',[strDir]='"+objEstuidante.strDir+"',[strTel]='"+objEstuidante.strTel+"' ,[strEmail]='"+objEstuidante.strEmail+"',[strCodSexo]='"+objEstuidante.strCodSexo+"',[strCodEstCiv]='"+objEstuidante.strCodEstCiv+"',[strNombresPadre]='"+objEstuidante.strNombresPadre+"',[strApellidosPadres]='"+objEstuidante.strApellidosPadres+"',[strNombresMadre]='"+objEstuidante.strNombresMadre+"',[strApellidosMadre]='"+objEstuidante.strApellidosMadre+"',[strCodEstVidP]='"+objEstuidante.strCodEstVidP+"', [strCodEstVidM]='"+objEstuidante.strCodEstVidM+"',[strCodEstado]='"+objEstuidante.strCodEstado+"',[strCodCiudadProc]='"+objEstuidante.strCodCiudadProc+"' WHERE [strCedula]='"+objEstuidante.strCedula+"'"
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
 module.exports.ActualizarEstudianteCarrera = async function (carrera,objEstuidante) {

  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Estudiantes] SET [strNombres]='"+objEstuidante.strNombres+"',[strApellidos]='"+objEstuidante.strApellidos+"',[dtFechaNac]='"+objEstuidante.dtFechaNac+"',[strNacionalidad]='"+objEstuidante.strNacionalidad+"',[strDocumentacion]='"+objEstuidante.strDir+"' ,[strEmail]='"+objEstuidante.strEmail+"',[strCodSexo]='"+objEstuidante.strCodSexo+"',[strCedulaMil]='"+objEstuidante.strTel+"' WHERE [strCedula]='"+objEstuidante.strCedula+"'"
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
 module.exports.ObtnerEstuidanteMaster = async function (carrera,cedula) {

  var sentencia="";
  sentencia="SELECT  *,evp.[strDescripcion] as estadovidapapa,evm.[strDescripcion] as estadovidamama,s.[strNombre] as nombresexo,ec.[strDescripcion] as nombreestadocivil,c.[strNombre] as nombreciudad,eu.[strDescripcion] as nombreestadousuario FROM [" + carrera + "].[dbo].[Estudiantes] as e INNER JOIN [" + carrera + "].[dbo].[Estados_Vida] AS evp on evp.[strCodigo]=e.[strCodEstVidP] INNER JOIN [" + carrera + "].[dbo].[Estados_Vida] AS evm on evm.[strCodigo]=e.[strCodEstVidM] INNER JOIN [" + carrera + "].[dbo].[Sexos] AS s on s.[strCodigo]=e.[strCodSexo] INNER JOIN [" + carrera + "].[dbo].[Estados_Civiles] AS ec on ec.[strCodigo]=e.[strCodEstCiv] INNER JOIN [" + carrera + "].[dbo].[Ciudades] AS c on c.[strCodigo]=e.[strCodCiudadProc] INNER JOIN [" + carrera + "].[dbo].[Estados_Usuarios] as eu on eu.[strCodigo]=e.[strCodEstadoUsuario] WHERE [strCedula]='"+cedula+"'"
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
 module.exports.ObtnerEstuidanteCarrera = async function (carrera,cedula) {

  var sentencia="";
  sentencia="SELECT  *,s.[strNombre] as nombresexo FROM [" + carrera + "].[dbo].[Estudiantes] as e  INNER JOIN [" + carrera + "].[dbo].[Sexos] AS s on s.[strCodigo]=e.[strCodSexo]   WHERE [strCedula]='"+cedula+"'"
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
 module.exports.ListadoEstadoVida = async function (carrera) {

  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Estados_Vida]"
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

 module.exports.TitulosColegios = async function (carrera,codigoInstitucion) {

  var sentencia="";
  sentencia="SELECT *,i. [strNombre] as nombrecolegio,t.strNombre as nombretitulo FROM  [" + carrera + "].[dbo].[Titulos_Validos] AS tv INNER JOIN [" + carrera + "].[dbo].[Titulos] AS t on t.[strCodigo]=tv.[strCodTit] INNER JOIN [" + carrera + "].[dbo].[Instituciones] AS i on i.[strCodigo] =tv.[strCodInt] WHERE tv.[strCodInt]='" + codigoInstitucion + "'"
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
 module.exports.InsertarGradoEstudiante = async function (carrera,objGrado) {
  var sentencia="";
  sentencia="INSERT INTO [" + carrera + "].[dbo].[Grados] ([strCedEstud],[strCodTit],[strCodInt],[dtFecha],[strRefrendacion],[dtFechaRegistro]) VALUES ( '" + objGrado.strCedEstud + "','" + objGrado.strCodTit + "','" + objGrado.strCodInt + "','" + objGrado.dtFecha + "','" + objGrado.strRefrendacion + "'," + objGrado.dtFechaRegistro + ")"
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
 module.exports.ObtenerGradoEstudiante = async function (carrera,objGrado) {

  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Grados] WHERE strCedEstud='" + objGrado.strCedEstud + "' AND strCodTit='" + objGrado.strCodTit + "' AND strCodInt='" + objGrado.strCodInt + "' "
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
 module.exports.ObtenerGradoEstudianteTodas = async function (carrera,cedula) {

  var sentencia="";
  sentencia="SELECT *,i. [strNombre] as nombrecolegio,t.strNombre as nombretitulo,gr.strCodTit as codigotitulo,gr.strCodInt as codigoinstitucion,ti.strDescripcion as nombretipoinstitucion, c.strNombre as nombreciudad FROM  [" + carrera + "].[dbo].[Grados] AS gr INNER JOIN [" + carrera + "].[dbo].[Titulos_Validos] AS tv on tv.strCodTit = gr.strCodTit and tv.strCodInt=gr.strCodInt INNER JOIN [" + carrera + "].[dbo].[Titulos] AS t on t.[strCodigo]=tv.[strCodTit] INNER JOIN [" + carrera + "].[dbo].[Instituciones] AS i on i.[strCodigo] =tv.[strCodInt] INNER JOIN [" + carrera + "].[dbo].[Tipos_Instituciones] AS ti ON ti.strCodigo=i.strCodTipo INNER JOIN [" + carrera + "].[dbo].[Ciudades] AS c ON c.strCodigo=i.strCodCiudad WHERE gr.[strCedEstud]='" + cedula + "'"
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

 module.exports.EliminarGradoEstudanteMaster = async function (carrera,cedula,codtitulo,codInstitucion) {

  var sentencia="";
  sentencia="DELETE FROM [" + carrera + "].[dbo].[Grados] WHERE strCedEstud='" + cedula + "' AND strCodTit='" + codtitulo + "' AND strCodInt='" + codInstitucion + "'"
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
 module.exports.ActualizarGradoEstudanteMaster = async function (carrera,objEstudiante) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Grados] SET dtFecha='" + objEstudiante.fecha + "',strRefrendacion='" + objEstudiante.refrendacion + "',strCodTit='" + objEstudiante.codtitulo + "',strCodInt='" + objEstudiante.codInstitucion + "' WHERE strCedEstud='" + objEstudiante.cedula + "' AND strCodTit='" + objEstudiante.codigotituloanterior + "' AND strCodInt='" + objEstudiante.codigoinstitucionanterior + "'"
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

 module.exports.EliminarCupoInscripcionEstuidante = async function (carrera,cedula,periodo) {

  var sentencia="";
  sentencia="DELETE FROM [" + carrera + "].[cupos].[tb_detalle_cupo] WHERE [dc_idcupo] IN ( SELECT c_id FROM [" + carrera + "].[cupos].[tb_cupos] WHERE [c_identificacion] = '" + cedula + "' AND [c_periodo] = '" + periodo + "' ); DELETE FROM [" + carrera + "].[cupos].[tb_cupos] WHERE [c_identificacion] = '" + cedula+ "' AND [c_periodo] = '" + periodo + "';"
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

 module.exports.EliminarEstuidanteCarrera = async function (carrera,cedula) {

  var sentencia="";
  sentencia="BEGIN TRANSACTION; WITH EstudianteSeleccionado AS ( SELECT strCodigo FROM [" + carrera + "].[dbo].[Estudiantes] WHERE strCedula='" + cedula + "' ) DELETE FROM [" + carrera + "].[dbo].[Estudiantefoto] WHERE strCodigo IN (SELECT strCodigo FROM EstudianteSeleccionado); DELETE FROM [" + carrera + "].[dbo].[Estudiantes] WHERE strCedula = '" + cedula + "'; COMMIT TRANSACTION;"
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

module.exports.EliminarInscripcionSolicitudEstuidante = async function (carrera,cedulaguion,cedulasinguion,periodo) {

  var sentencia="";
  sentencia="DELETE FROM [" + carrera + "].[dbo].[Inscripciones] WHERE [strCedEstud]='" + cedulaguion + "' AND [strCodPeriodo]='" + periodo + "'"
  sentencia1="DELETE FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud] WHERE [cm_identificacion]='" + cedulasinguion + "' AND [cm_periodo]='" + periodo + "'"
  try {
  if (sentencia != "") {
    const sqlConsulta = await execMaster(carrera,sentencia, "OK","OK");
    const sqlConsulta1 = await execMaster(carrera,sentencia1, "OK","OK");
   return (sqlConsulta1)
  } else {
    return {data:"vacio sql"}
  }
} catch (error) {
  return {data:"Error: "+ error}
}
}

 module.exports.ObtnerRecodAcademicoporNivel = async function (carrera,codEstudiante,nivel) {
   const sentencia = ` EXEC [${carrera}].[dbo].[getrecordpensumvigenteDecimales] @CodEstud = '${codEstudiante}', @CodNivel = ${nivel} `;
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
   module.exports.ObtnerExcepcionEstudianteMovilidad = async function (carrera,cedula,periodo) {
   const sentencia ="SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_estudiante_excepcion] WHERE mee_srtcedula='" + cedula + "' AND mee_periodo= '" + periodo + "' AND mee_estado=1";
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
     module.exports.ActualizarExcepcionEstudianteMovilidad = async function (carrera,cedula,periodo) {
   const sentencia ="UPDATE [" + carrera + "].[dbo].[tb_movilidad_estudiante_excepcion] SET mee_estado=0 WHERE mee_srtcedula='" + cedula + "' AND mee_periodo= '" + periodo + "'";
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
 module.exports.ActualizarInscripcionesEstudiante = async function (carrera,objEstudiante) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Inscripciones] SET [boolGratuidadT]=" + objEstudiante.boolGratuidadT + " ,[boolGratuidad30]=" + objEstudiante.boolGratuidad30 + ",[strObservaciones]='" + objEstudiante.strObservaciones + "' WHERE [strCedEstud]='" + objEstudiante.strCedEstud + "' AND [strCodPeriodo]='" + objEstudiante.strCodPeriodo + "' AND [strCodCarrera]='" + objEstudiante.strCodCarrera + "'"
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

 module.exports.CarrerasSlicitudesMovilidad = async function (carrera,periodo,estado) {
  var sentencia="";
  sentencia="SELECT [cm_dbcarrera_movilidad],[cm_nombrecarrera_movilidad],[cm_periodo] FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud] WHERE [cm_estado]=1 AND [cm_idtipo_estado]='" + estado + "' AND [cm_periodo]='" + periodo + "' GROUP BY [cm_dbcarrera_movilidad],[cm_nombrecarrera_movilidad],[cm_periodo]"
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

 module.exports.ListadoEstuidanteCarreraSolicitudes = async function (carrera,periodo,estado,carreramovilidad) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud] AS sm INNER JOIN [" + carrera + "].[dbo].[tb_movilidad_tipo_estado] AS mts ON mts.mte_strcodigo=sm.cm_idtipo_estado INNER JOIN [" + carrera + "].[dbo].[tb_movilidad_tipo_solicitud] AS mt ON mt.mte_strcodigo=sm.cm_idtipo_movilidad WHERE sm.[cm_estado]=1 AND sm.[cm_idtipo_estado]='" + estado + "' AND sm.[cm_periodo]='" + periodo + "' AND sm.[cm_dbcarrera_movilidad]='" + carreramovilidad + "'"
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

 module.exports.MallCarreraASignaturasporNivelPeriodo = async function (carrera,periodo,nivel) {
  var sentencia="";
  sentencia="SELECT m.strNombre as nombreasignatura, a.strNombre as nombrearea , t.strDescripcion as nombretipo,* FROM [" + carrera + "].[dbo].[Materias_Pensum] AS mp INNER JOIN [" + carrera + "].[dbo].[Materias] AS m ON m.strCodigo=mp.strCodMateria INNER JOIN [" + carrera + "].[dbo].[Areas] AS a ON a.strCodigo=mp.strCodArea INNER JOIN [" + carrera + "].[dbo].[Tipos_de_Materias] AS t ON t.strCodigo=mp.strCodTipo INNER JOIN [" + carrera + "].[dbo].[Periodos] AS pe ON pe.strCodPensum=mp.strCodPensum WHERE pe.strCodigo='" + periodo + "' AND mp.strCodNivel='" + nivel + "' ORDER BY mp.strCodMateria "
  
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



 module.exports.ObtenerUltimoPeriodMatriculaEstuidante = async function (carrera,cedula) {
  var sentencia="";
  sentencia="SELECT TOP 1 * FROM [" + carrera + "].[dbo].[Matriculas] AS m INNER JOIN [" + carrera + "].[dbo].[Estudiantes] AS e ON e.strCodigo=m.strCodEstud WHERE e.strCedula='" + cedula + "' AND m.[strCodEstado]='DEF' ORDER BY [dtFechaAutorizada] DESC"
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

 module.exports.ObtenerMatriculaEstuidanteCarrera = async function (carrera,cedula,periodo) {
  var sentencia="";
  sentencia="SELECT TOP 1 * FROM [" + carrera + "].[dbo].[Matriculas] AS m INNER JOIN [" + carrera + "].[dbo].[Estudiantes] AS e ON e.strCodigo=m.strCodEstud WHERE e.strCedula='" + cedula + "' AND m.[strCodPeriodo]='" + periodo + "' ORDER BY [dtFechaAutorizada] DESC"
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
 module.exports.ListadoASignaturasqNotieneqAprobar = async function (carrera,codigo) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Materias_Sin_Tener_Aprobar] WHERE [strCodEstud]='" + codigo + "'"
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
 module.exports.ObtenerNivelesMallaDadoPeriodo= async function (carrera,periodo) {
  var sentencia="";
 sentencia="SELECT mp.strCodNivel,n.strDescripcion FROM [" + carrera + "].[dbo].[Materias_Pensum] AS mp INNER JOIN [" + carrera + "].[dbo].[Periodos] AS pe ON pe.strCodPensum = mp.strCodPensum INNER JOIN [" + carrera + "].[dbo].[Niveles] AS n ON n.strCodigo = mp.strCodNivel WHERE pe.strCodigo = '" + periodo + "' GROUP BY mp.strCodNivel, n.strDescripcion ORDER BY CAST(mp.strCodNivel AS INT)"
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

module.exports.ObtenerDatosBaseMovilidad = async function (dbcarrera,carrera) {
  var sentencia="";
  sentencia="SELECT F.strNombre as strNombreFacultad, C.strNombre as strNombreCarrera, * FROM [" + dbcarrera + "].[dbo].Facultades AS F INNER JOIN [" + dbcarrera + "].[dbo].Escuelas AS E ON E.strCodFacultad=F.strCodigo INNER JOIN [" + dbcarrera + "].[dbo].Carreras AS C ON C.strCodEscuela=E.strCodigo  WHERE C.strBaseDatos='" + carrera + "' "
 
try {
  if (sentencia != "") {
    const sqlConsulta = await execDinamico(dbcarrera,sentencia, "OK","OK");
  
   return (sqlConsulta)
  } else {
    return {data:"vacio sql"}
  }
} catch (error) {
  return {data:"Error: "+ error}
}
}

module.exports.ListadoEstadoSolicitud = async function (dbcarrera) {
  var sentencia="";
  sentencia="SELECT * FROM [" + dbcarrera + "].[dbo].[tb_movilidad_tipo_estado] ORDER BY mte_strcodigo"
 
try {
  if (sentencia != "") {
    const sqlConsulta = await execDinamico(dbcarrera, "OK","OK");
  
   return (sqlConsulta)
  } else {
    return {data:"vacio sql"}
  }
} catch (error) {
  return {data:"Error: "+ error}
}
}
   module.exports.InsertarFacultad= async function (carrera,objFacultad) {
      const now = new Date().toISOString().slice(0, 10).replace('T', ' ');
    var sentencia=""; 
    sentencia = "INSERT INTO [" + carrera + "].[dbo].[Facultades]([strCodigo],[strNombre],[strDecano],[strCedulaDecano],[strClaveDecano], [strSudDecano],[strCedulaSubDecano],[strClaveSubDecano],[dtCreacion],[strUbicacion],[imgLogo],[strDatos],[strCodEstado],[strCodTipoEntidad]) VALUES ('" + objFacultad.strCodigo + "','" + objFacultad.strNombre + "','" + objFacultad.strDecano + "','" + objFacultad.strCedulaDecano + "','" + objFacultad.strClaveDecano + "','" + objFacultad.strSudDecano + "','" + objFacultad.strCedulaSubDecano + "','" + objFacultad.strClaveSubDecano + "'," + now+ ",'" + objFacultad.strUbicacion + "','" + objFacultad.imgLogo + "','" + objFacultad.strDatos + "','ABI','FAC')"; 
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
   module.exports.ActualizarFacultad = async function (carrera,objFacultad) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Facultades] SET [strNombre]='" + objFacultad.strNombre + "',[strDecano]='" + objFacultad.strDecano + "',[strCedulaDecano]='" + objFacultad.strCedulaDecano + "',[strClaveDecano]='" + objFacultad.strClaveDecano + "', [strSudDecano]='" + objFacultad.strSudDecano + "',[strCedulaSubDecano]='" + objFacultad.strCedulaSubDecano + "',[strClaveSubDecano]='" + objFacultad.strClaveSubDecano + "',[strUbicacion]='" + objFacultad.strUbicacion + "',[imgLogo]='" + objFacultad.imgLogo + "',[strDatos]='" + objFacultad.strDatos + "' WHERE [strCodigo]='" + objFacultad.strCodigo + "'"
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

   module.exports.CambiarEstadoFacultad = async function (carrera,codigo,estado) {
  var sentencia="";
  sentencia="UPDATE [" + carrera + "].[dbo].[Facultades] SET [strCodEstado]='" + estado+ "' WHERE [strCodigo]='" + codigo+ "'"
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
 module.exports.InsertarEstuidanteExcepcion = async function (carrera,objDatos) {
  var sentencia="";
  sentencia="INSERT INTO [" + carrera + "].[dbo].[tb_movilidad_estudiante_excepcion] ([mee_srtcedula],[mee_strdescripcion],[mee_periodo]) VALUES ( '" + objDatos.mee_srtcedula + "','" + objDatos.mee_strdescripcion + "','" + objDatos.mee_periodo + "')"
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

   module.exports.EstadoCivilListadoMaster = async function (carrera) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Estados_Civiles]"
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
   module.exports.SexoListadoMaster = async function (carrera) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Sexos]"
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
 module.exports.ListadoCiudadTodasMaster = async function (carrera) {

  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Ciudades]  ORDER BY strNombre"
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

module.exports.ObenterTodasEstudianteIncripcion = async function (carrera,cedula) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Inscripciones]  AS i INNER JOIN [" + carrera + "].[dbo].[Carreras] AS c on c.strCodigo=i.strCodCarrera where i.strCedEstud='" + cedula + "' ORDER BY i.dtFecha desc"
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


module.exports.ObenterNivelEstuidanteCarrera = async function (carrera,cedula) {
  var sentencia="";
  sentencia="SELECT	tbR.strCodigo,tbR.Nivel,MAX( tb1.strCodPeriodo ) AS strCodPeriodo FROM (SELECT	tbE.strCodigo,MAX( tbM.strCodNivel ) AS Nivel FROM [" + carrera + "].dbo.Matriculas tbM INNER JOIN [" + carrera + "].dbo.Estudiantes tbE ON tbM.strCodEstud = tbE.strCodigo WHERE tbM.strCodEstado = 'DEF' AND tbE.strCedula = '" + cedula + "' GROUP BY tbE.strCodigo) tbR inner join [" + carrera + "].dbo.Matriculas tb1 ON tbR.strCodigo = tb1.strCodEstud WHERE tbR.strCodigo = tb1.strCodEstud AND tbR.Nivel = tb1.strCodNivel group by tbR.strCodigo,tbR.Nivel"
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

 module.exports.ObenterDatosCarreraFacultadCodigo = async function (carrera,codigocarrera) {
  var sentencia="";
  sentencia="select c.strNombre as nombrecarrera,c.strCodigo as codigocarrera, f.strNombre as nombrefacultad ,f.strCodigo as codigofacultad, * from [" + carrera + "].[dbo].[Carreras] as c inner join [" + carrera + "].[dbo].[Escuelas] as e on e.[strCodigo]=c.strCodEscuela inner join [" + carrera + "].[dbo].[Facultades] as f on f.strCodigo=e.strCodFacultad where c.strCodigo='" + codigocarrera + "'"
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

 module.exports.InsertarMovilidadMalla = async function (carrera,objmalla) {
  var sentencia="";
  sentencia="INSERT INTO [" + carrera + "].[dbo].[tb_movilidad_solicitud_malla]([msm_idsolicitud],[msm_periodo],[msm_strdescripcion], [msm_mallaactualcodigo],[msm_mallaactualnombre],[msm_mallamovilidadcodigo],[msm_mallamovilidadnombre]) VALUES("+objmalla.msm_idSolicitud+",'"+objmalla.msm_periodo+"','"+objmalla.msm_strdescripcion+"','"+objmalla.msm_mallaactualcodigo+"','"+objmalla.msm_mallaactualnombre+"','"+objmalla.msm_mallamovilidadcodigo+"','"+objmalla.msm_mallamovilidadnombre+"')"
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


 module.exports.ObtenerMallaActivaCarrera = async function (carrera) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Pensums] WHERE [blnActivo]=1"
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

 module.exports.ObtenerSolicitudAprobadaEstudiante = async function (carrera,periodo,cedula) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud] WHERE [cm_estado]=1 AND [cm_idtipo_estado]='APRO' AND [cm_periodo]='" + periodo + "' AND cm_identificacion='" + cedula + "' "
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

 module.exports.ListadoCarreraTraspaso = async function (carrera,dbcarreraactual,periodo) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_carreras] WHERE [msm_estado]=1 AND [msca_periodo]='" + periodo + "' AND [msca_dbcarreraactual]='" + dbcarreraactual + "' AND [msca_tipo]='MOVTRASP' "
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

 module.exports.ListadoCarreraAprobadaSolicitud = async function (carrera,periodo) {
  var sentencia="";
  sentencia=" SELECT [cm_dbcarrera_movilidad] FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud] WHERE [cm_estado]=1 AND [cm_periodo]='" + periodo + "' AND [cm_idtipo_estado]='APRO' GROUP BY [cm_dbcarrera_movilidad]"
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
 module.exports.ListadoSolicitudesdadoCarreraAprobadas = async function (carrera,periodo,dbcarreramovilidad) {
  var sentencia="";
  sentencia=" SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud] WHERE [cm_estado]=1 AND [cm_periodo]='" + periodo + "' AND [cm_idtipo_estado]='APRO' AND [cm_dbcarrera_movilidad]='"+dbcarreramovilidad+"' ORDER BY [cm_puntaje] DESC "
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

 module.exports.ListadoSolicitudesdadoCarreraTipo = async function (carrera,periodo,dbcarreramovilidad,tipomovilidad) {
  var sentencia="";
  sentencia=" SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_solicitud] WHERE [cm_estado]=1 AND [cm_periodo]='" + periodo + "' AND [cm_idtipo_estado]='APRO' AND [cm_dbcarrera_movilidad]='"+dbcarreramovilidad+"' AND [cm_idtipo_movilidad]='"+tipomovilidad+"' ORDER BY [cm_puntaje] DESC "
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