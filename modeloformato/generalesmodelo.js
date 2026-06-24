const { execDinamico, execDinamicoTransaccion } = require("../config/execSQLDinamico.helper");
const { execMaster, execMasterTransaccion } = require("../config/execSQLMaster.helper");
const CONFIGMASTER = require('../config/baseMaster');
const CONFIGACADEMICO = require('../config/databaseDinamico');
const { sendResponseModelo } = require('../herramientas/responseservice');
const logger = require('./../herramientas/logger.js');

const sql = require("mssql");



module.exports.ListadoCarrerasDadoFacultad = async function (carrera, facultad) {
  var sentencia = "";
  sentencia = "SELECT c.* FROM [" + carrera + "].[dbo].[Carreras] AS c INNER JOIN [" + carrera + "].[dbo].[Escuelas] AS e ON e.strCodigo=c.strCodEscuela INNER JOIN [" + carrera + "].[dbo].[Facultades] AS f ON e.strCodFacultad=f.strCodigo WHERE F.strCodigo='" + facultad + "'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
        return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
       return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ListadoCarrerasDadoFacultad', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ListadoDocumentosfirmadosLegalizados = async function (carrera, periodo) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[solicitardocumento]  WHERE periodo='" + periodo + "' AND estadodocumento=3 AND tipoflujo='MAT'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ListadoDocumentosfirmadosLegalizados', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }

}

module.exports.ActualizarDocumentosfirmadosLegalizadosRuta = async function (carrera, periodo, iddocumento, ruta) {
  var sentencia = "";
  sentencia = "UPDATE [" + carrera + "].[dbo].[solicitardocumento] SET ruta='" + ruta + "' WHERE periodo='" + periodo + "' AND estadodocumento=3 AND tipoflujo='MAT' AND iddocumento='" + iddocumento + "'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ActualizarDocumentosfirmadosLegalizadosRuta', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}


module.exports.EstadisticasMatriculasPeriodo = async function (carrera, periodo) {
  var sentencia = "";
  sentencia = "SELECT SUM(CASE WHEN [strCodEstado] = 'DEF' THEN 1 ELSE 0 END) AS MatriculasDefinitivas, SUM(CASE WHEN [strCodEstado] = 'PEN' THEN 1 ELSE 0 END) AS MatriculasPendientes, SUM(CASE WHEN [strCodEstado] NOT IN ('PEN','DEF')  THEN 1 ELSE 0 END) AS MatriculasOtras, COUNT(*) AS TotalMatriculas, CAST( SUM(CASE WHEN [strCodEstado] = 'DEF' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS DECIMAL(5,2) ) AS PorcentajeDefinitivas, CAST( SUM(CASE WHEN [strCodEstado] = 'PEN' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS DECIMAL(5,2) ) AS PorcentajePendientes, CAST( SUM(CASE WHEN [strCodEstado] NOT IN ('PEN','DEF') THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS DECIMAL(5,2) ) AS PorcentajeOtras FROM [" + carrera + "].[dbo].[Matriculas] WHERE [strCodPeriodo] = '" + periodo + "'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error EstadisticasMatriculasPeriodo', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.TotalMatriculaDefinitvaCarrera = async function (carrera, periodo) {
  var sentencia = "";
  //sentencia = "SELECT COUNT(*) AS TotalDEF, SUM(CASE WHEN [strCodNivel] = '1' THEN 1 ELSE 0 END) AS TotalDEF_Nivel1 FROM [" + carrera + "].[dbo].[Matriculas] WHERE [strCodPeriodo] = '" + periodo + "' AND [strCodEstado] = 'DEF'"
  sentencia = "SELECT ISNULL(COUNT(*), 0) AS TotalDEF, ISNULL(SUM(CASE WHEN [strCodNivel] = '1' THEN 1 ELSE 0 END), 0) AS TotalDEF_Nivel1 FROM [" + carrera + "].[dbo].[Matriculas] WHERE [strCodPeriodo] = '" + periodo + "' AND [strCodEstado] = 'DEF'"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error TotalMatriculaDefinitvaCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.DocenteDictadoAsignaturas = async function (carrera, cedula) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Dictado_Materias] AS DM INNER JOIN [" + carrera + "].[dbo].[Periodos] AS P ON P.strCodigo=DM.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Docentes] AS D ON D.strCodigo=DM.strCodDocente INNER JOIN [" + carrera + "].[dbo].[Materias] AS M ON M.strCodigo=DM.strCodMateria WHERE D.strCedula='" + cedula + "' ORDER BY P.dtFechaInic DESC"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error DocenteDictadoAsignaturas', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.DictadoAsignaturasPeriodo = async function (carrera, periodo) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Dictado_Materias] AS DM INNER JOIN [" + carrera + "].[dbo].[Periodos] AS P ON P.strCodigo=DM.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Docentes] AS D ON D.strCodigo=DM.strCodDocente INNER JOIN [" + carrera + "].[dbo].[Materias] AS M ON M.strCodigo=DM.strCodMateria WHERE p.strCodigo='" + periodo + "' ORDER BY DM.strCodNivel,M.strNombre"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error DictadoAsignaturasPeriodo', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.PromediosGeneralesParcialesPorAsignatura = async function (carrera, periodo, nivel, paralelo, CodMateria) {
  var sentencia = "";
  sentencia = "SELECT CAST(ROUND(AVG(ISNULL(np.dcParcial1, 0)), 2) AS DECIMAL(10,2)) AS PromedioGeneral_Parcial1, CAST(ROUND(AVG(ISNULL(np.dcParcial2, 0)), 2) AS DECIMAL(10,2)) AS PromedioGeneral_Parcial2, CAST(ROUND(AVG((ISNULL(np.dcParcial1, 0) + ISNULL(np.dcParcial2, 0)) / 2.0), 2) AS DECIMAL(10,2)) AS PromedioGeneral_Total FROM [" + carrera + "].[dbo].[Dictado_MateriasDocentes] AS md INNER JOIN [" + carrera + "].[dbo].[Materias_Asignadas] AS ma ON ma.strCodMateria = md.strCodMateria INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS m ON m.sintCodigo = ma.sintCodMatricula LEFT JOIN [" + carrera + "].[dbo].[Notas_Parciales] AS np ON np.strCodPeriodo = ma.strCodPeriodo AND np.strCodMateria = ma.strCodMateria AND np.sintCodMatricula = m.sintCodigo WHERE md.strCodNivel = '" + nivel + "' AND md.strCodMateria = '" + CodMateria + "' AND md.strCodParalelo = '" + paralelo + "' AND md.strCodPeriodo = '" + periodo + "' AND ma.strCodPeriodo = '" + periodo + "' AND ma.strCodNivel = '" + nivel + "' AND ma.strCodParalelo = '" + paralelo + "' AND ma.strCodMateria = '" + CodMateria + "' AND m.strCodPeriodo = '" + periodo + "' AND m.strCodEstado = 'DEF' AND (ma.strObservaciones NOT LIKE '%VALIDA%') AND (ma.strObservaciones NOT LIKE '%RETIRA%');"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error DictadoAsignaturasPeriodo', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ListadoCarrerasMovilidadesPeriodo = async function (carrera, periodo) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_carreras] AS MC  WHERE MC.msca_periodo='" + periodo + "' AND  [msm_estado]=1 ORDER BY MC.msca_tipo DESC"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ListadoCarrerasMovilidadesPeriodo', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ListadoCarrerasHomologacionPeriodo = async function (carrera, periodo) {
  var sentencia = "";
  sentencia = "SELECT HC.*,C.strNombre AS nombrecarrera, C.strCodigo AS codigocarrera,CN.strNombre AS nombrenivelacion,  CN.strCodigo AS codigonivelacion FROM [" + carrera + "].[dbo].[homologacioncarreras] AS HC INNER JOIN [" + carrera + "].[dbo].[Carreras] AS C ON C.strBaseDatos=HC.hmbdbasecar INNER JOIN [" + carrera + "].[dbo].[Carreras] AS CN ON CN.strBaseDatos=HC.hmbdbaseniv WHERE [periodo]='" + periodo + "' ORDER BY C.strNombre"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ListadoCarrerasHomologacionPeriodo', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ObtenerModilidadCarreraPeriodoBase = async function (carrera, periodo,dbcarreaactual,dbcarreramovilidad, tipo) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[tb_movilidad_carreras] WHERE [msca_dbcarreraactual] ='" + dbcarreaactual + "' AND [msca_periodo]='" + periodo + "' AND [msca_dbcarreramovilidad]='" + dbcarreramovilidad + "' AND [msca_tipo]='" + tipo + "' "
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ObtenerModilidadCarreraPeriodoBase', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}
module.exports.IngresarMoviliadCarrera = async function (carrera, objmovilidad) {
  var sentencia = "";
  sentencia = "INSERT INTO [" + carrera + "].[dbo].[tb_movilidad_carreras]([msca_codigocarreraactual],[msca_dbcarreraactual], [msca_admisionesactual],[msca_nombrecarreraactual],[msca_codigocarreramovilidad],[msca_dbcarreramovilidad], [msca_admisionesmovilidad],[msca_nombrecarreramovilidad],[msca_periodo],[msca_tipo],[msca_codfacultad],[msca_campo],[msca_campo_descripcion]) VALUES('" + objmovilidad.msca_codigocarreraactual + "','" + objmovilidad.msca_dbcarreraactual + "','" + objmovilidad.msca_admisionesactual + "','" + objmovilidad.msca_nombrecarreraactual + "','" + objmovilidad.msca_codigocarreramovilidad + "','" + objmovilidad.msca_dbcarreramovilidad + "','" + objmovilidad.msca_admisionesmovilidad + "','" + objmovilidad.msca_nombrecarreramovilidad + "','" + objmovilidad.msca_periodo + "','" + objmovilidad.msca_tipo + "','" + objmovilidad.msca_codfacultad + "','" + objmovilidad.msca_campo + "','" + objmovilidad.msca_campo_descripcion + "')"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error IngresarMoviliadCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}
module.exports.ClonarCarrerasMoviliadPeriodo = async function (carrera, periodonuevo,periodoanterior) {
  var sentencia = "";
  sentencia = "IF NOT EXISTS (SELECT 1 FROM [" + carrera + "].[dbo].[tb_movilidad_carreras] WHERE [msca_periodo] = '" + periodonuevo + "') BEGIN INSERT INTO [" + carrera + "].[dbo].[tb_movilidad_carreras]( [msca_codigocarreraactual], [msca_dbcarreraactual], [msca_admisionesactual], [msca_nombrecarreraactual], [msca_codigocarreramovilidad], [msca_dbcarreramovilidad], [msca_admisionesmovilidad], [msca_nombrecarreramovilidad], [msca_periodo], [msca_tipo], [msca_codfacultad], [msca_campo], [msca_campo_descripcion] ) SELECT t.[msca_codigocarreraactual], t.[msca_dbcarreraactual], (SELECT TOP 1 hmbdbaseinsc FROM [" + carrera + "].[dbo].[homologacioncarreras] h WHERE h.[hmbdbasecar] = t.[msca_dbcarreraactual] AND h.[periodo] = '" + periodonuevo + "') AS [msca_admisionesactual], t.[msca_nombrecarreraactual], t.[msca_codigocarreramovilidad], t.[msca_dbcarreramovilidad], (SELECT TOP 1 hmbdbaseinsc FROM [" + carrera + "].[dbo].[homologacioncarreras] h WHERE h.[hmbdbasecar] = t.[msca_dbcarreramovilidad] AND h.[periodo] = '" + periodonuevo + "') AS [msca_admisionesmovilidad], t.[msca_nombrecarreramovilidad], '" + periodonuevo + "', t.[msca_tipo], t.[msca_codfacultad], t.[msca_campo], t.[msca_campo_descripcion] FROM [" + carrera + "].[dbo].[tb_movilidad_carreras] t WHERE t.[msca_periodo] = '" + periodoanterior + "' PRINT 'Registros duplicados exitosamente del periodo P0045 al P0046' END ELSE BEGIN PRINT 'Ya existen registros con el periodo P0046. No se realizó la inserción para evitar duplicados.' END"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error IngresarMoviliadCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}
module.exports.ClonarCarrerasHomologacionGeneralPeriodo = async function (carrera, periodonuevo,periodoanterior) {
  var sentencia = "";
  sentencia = " IF NOT EXISTS (SELECT 1 FROM [OAS_Master].[dbo].[homologacioncarreras] WHERE [periodo] = '" + periodonuevo + "') BEGIN INSERT INTO [OAS_Master].[dbo].[homologacioncarreras]( [hmbdbasecar],[hmbdbaseniv],[hmbdbaseinsc],[homfechainicio], [homfechacreacion],[homfechafin],[periodo],[periodonivelacion],[homestado] ) SELECT t.[hmbdbasecar], t.[hmbdbaseniv], ISNULL( (SELECT TOP 1 AD.cca_cus_id FROM [SAI_Admision].[admision].[cuposcarrera] ad WHERE t.[hmbdbasecar] COLLATE Modern_Spanish_CI_AS = ad.cca_db_carrera AND ad.percodigo=t.[periodonivelacion]), 0  -- o algún valor por defecto válido ) AS hmbdbaseinsc, (SELECT TOP 1 [dtFechaInic] FROM [OAS_Master].[dbo].[Periodos] WHERE [strCodigo]='" + periodonuevo + "'), GETDATE(), (SELECT TOP 1 [dtFechaFin] FROM [OAS_Master].[dbo].[Periodos] WHERE [strCodigo]='" + periodonuevo + "'), '" + periodonuevo + "', t.[periodonivelacion] + 1, 1 FROM [OAS_Master].[dbo].[homologacioncarreras] t WHERE t.[periodo] = '" + periodoanterior + "' PRINT 'Registros duplicados exitosamente del periodo P0045 al P0046' END ELSE BEGIN PRINT 'Ya existen registros con el periodo P0046. No se realizó la inserción para evitar duplicados.' END "
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ClonarCarrerasHomologacionGeneralPeriodo', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ActualizarDatosHomologacionesCarrera = async function (carrera, objDatos) {
  var sentencia = "";
  sentencia = "UPDATE [" + carrera + "].[dbo].[homologacioncarreras] SET [hmbdbaseinsc]='" + objDatos.hmbdbaseinsc + "',[homestado]='" + objDatos.homestado + "' WHERE [homid]='" + objDatos.homid + "' AND [periodo]='" + objDatos.periodo + "'"
    try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ActualizarDatosHomologacionesCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}


module.exports.ObtenerAsignaturaMovilidadCarrera = async function (carrera,dbcarrera, objDatos) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Materias_Asignadas_Movilidad] WHERE [mam_bdorigen]='" + dbcarrera + "' AND  [mam_periodo]='" + objDatos.strCodPeriodo + "' AND [mam_nivelorigen]='" + objDatos.strCodNivel + "' AND [mam_paraleloorigen]='" + objDatos.strCodParalelo + "' AND [mam_codmateriaorigen]='" + objDatos.strCodMateria + "' AND [mam_estado]=1"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ObtenerAsignaturaMovilidadCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ObtenerMejorEstudianteDosCalificacionesAsignaturaCarrera = async function (carrera,periodo, codasignatura) {
  var sentencia = "";
  sentencia = "SELECT TOP 1 M.sintCodigo AS sintCodMatricula, M.strCodPeriodo, P.strDescripcion, E.*, CAST(NP.dcParcial1 AS DECIMAL(10,2)) AS dcParcial1, CAST(NP.dcParcial2 AS DECIMAL(10,2)) AS dcParcial2, CAST((NP.dcParcial1 + NP.dcParcial2)/2 AS DECIMAL(10,2)) AS CalificacionTotal, NP.strCodEquiv, NP.strObservaciones AS NotaObservacion, MA.strObservaciones AS MatAsignadaObservacion FROM [" + carrera + "].[dbo].[Matriculas] AS M INNER JOIN [" + carrera + "].[dbo].[Materias_Asignadas] AS MA ON MA.sintCodMatricula = M.sintCodigo AND MA.strCodPeriodo = M.strCodPeriodo INNER JOIN [dbo].[Notas_Parciales] AS NP ON NP.sintCodMatricula = M.sintCodigo AND NP.strCodPeriodo = M.strCodPeriodo AND NP.strCodMateria = MA.strCodMateria INNER JOIN [" + carrera + "].[dbo].[Estudiantes] AS E ON E.strCodigo = M.strCodEstud INNER JOIN [" + carrera + "].[dbo].[Periodos] AS P ON P.strCodigo=M.strCodPeriodo WHERE MA.strCodMateria = '" + codasignatura + "' AND MA.strCodPeriodo = '" + periodo + "' AND MA.strObservaciones NOT LIKE '%RETIRA%' AND MA.strObservaciones NOT LIKE '%VALIDA%' AND MA.bytNumMat = 1 AND NP.strCodTipoExamen = 'PAR' ORDER BY (NP.dcParcial1 + NP.dcParcial2)/2 DESC;"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ObtenerMejorEstudianteDosCalificacionesAsignaturaCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ObtenerMejorEstudianteTresCalificacionesAsignaturaCarrera = async function (carrera,periodo, codasignatura) {
  var sentencia = "";
  sentencia = "SELECT TOP 1 M.sintCodigo AS sintCodMatricula, M.strCodPeriodo, P.strDescripcion, E.strCodigo, E.strNombres, E.strApellidos, CAST(NX.bytAcumulado AS DECIMAL(10,2)) AS acumulado, CAST(NX.bytNota AS DECIMAL(10,2)) AS nota, CAST((NX.bytAcumulado + NX.bytNota) AS DECIMAL(10,2)) AS CalificacionTotal, NX.strCodEquiv, NX.strObservaciones AS NotaObservacion, NX.strObservaciones AS MatAsignadaObservacion FROM [" + carrera + "].[dbo].[Matriculas] AS M INNER JOIN [" + carrera + "].[dbo].[Materias_Asignadas] AS MA ON MA.sintCodMatricula = M.sintCodigo AND MA.strCodPeriodo = M.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Notas_Examenes] AS NX ON NX.sintCodMatricula = M.sintCodigo AND NX.strCodPeriodo = M.strCodPeriodo AND NX.strCodMateria = MA.strCodMateria INNER JOIN [" + carrera + "].[dbo].[Estudiantes] AS E ON E.strCodigo = M.strCodEstud INNER JOIN [" + carrera + "].[dbo].[Periodos] AS P ON P.strCodigo=M.strCodPeriodo WHERE MA.strCodMateria = '" + codasignatura + "' AND MA.strCodPeriodo = '" + periodo + "' AND MA.strObservaciones NOT LIKE '%RETIRA%' AND MA.strObservaciones NOT LIKE '%VALIDA%' AND MA.bytNumMat = 1 AND NX.strCodTipoExamen = 'PRI' ORDER BY (NX.bytAcumulado + NX.bytNota) DESC;"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ObtenerMejorEstudianteTresCalificacionesAsignaturaCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ObtenerDosCalificacionesAsignarutasEstudiantePeriodo = async function (carrera,periodo, cedula) {
  var sentencia = "";
  sentencia = "WITH NotasFinales AS ( SELECT NP.sintCodMatricula, NP.strCodPeriodo, NP.strCodMateria, NP.strCodTipoExamen, ISNULL(NP.dcParcial1, 0) AS dcParcial1,   ISNULL(NP.dcParcial2, 0) AS dcParcial2, NP.strCodEquiv, NP.strObservaciones, ROW_NUMBER() OVER ( PARTITION BY NP.sintCodMatricula, NP.strCodPeriodo, NP.strCodMateria ORDER BY CASE WHEN NP.strCodTipoExamen = 'REC' THEN 1 ELSE 2 END ) AS rn FROM [" + carrera + "].[dbo].[Notas_Parciales] AS NP ) SELECT MA.strCodNivel,MA.strCodParalelo,MA.bytNumMat ,M.sintCodigo AS sintCodMatricula, M.strCodPeriodo, P.strDescripcion, E.strCodigo, E.strNombres, E.strApellidos, MA.strCodMateria, MAT.strNombre, CAST(NF.dcParcial1 AS DECIMAL(10,2)) AS dcParcial1, CAST(NF.dcParcial2 AS DECIMAL(10,2)) AS dcParcial2, CAST((NF.dcParcial1 + NF.dcParcial2)/2 AS DECIMAL(10,2)) AS CalificacionTotal, NF.strCodEquiv, NF.strObservaciones AS NotaObservacion, MA.strObservaciones AS MatAsignadaObservacion, NF.strCodTipoExamen AS TipoExamen FROM [" + carrera + "].[dbo].[Matriculas] AS M INNER JOIN [" + carrera + "].[dbo].[Materias_Asignadas] AS MA ON MA.sintCodMatricula = M.sintCodigo AND MA.strCodPeriodo = M.strCodPeriodo INNER JOIN NotasFinales AS NF ON NF.sintCodMatricula = M.sintCodigo AND NF.strCodPeriodo = M.strCodPeriodo AND NF.strCodMateria = MA.strCodMateria AND NF.rn = 1 INNER JOIN [" + carrera + "].[dbo].[Estudiantes] AS E ON E.strCodigo = M.strCodEstud INNER JOIN [" + carrera + "].[dbo].[Periodos] AS P ON P.strCodigo = M.strCodPeriodo INNER JOIN [" + carrera + "].[dbo].[Materias] AS MAT ON MAT.strCodigo = MA.strCodMateria WHERE E.strCedula = '" + cedula + "' AND MA.strCodPeriodo = '" + periodo + "' AND MA.strObservaciones NOT LIKE '%RETIRA%' AND MA.strObservaciones NOT LIKE '%VALIDA%' AND MA.bytNumMat = 1 ;"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ObtenerDosCalificacionesAsignarutasEstudiantePeriodo', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ObtenerMallaAcademicaCarrera = async function (carrera,periodo) {
  var sentencia = "";
  sentencia = "WITH MateriasPensum AS ( SELECT MP.*, P.strCodigo AS strPeriodo, M.strNombre AS strNombreMateria, M.strCodigo AS strCodMateriaPensum FROM [" + carrera + "].[dbo].[Materias_Pensum] AS MP INNER JOIN [" + carrera + "].[dbo].[Periodos] AS P ON P.strCodPensum = MP.strCodPensum INNER JOIN [" + carrera + "].[dbo].[Materias] AS M ON M.strCodigo = MP.strCodMateria WHERE P.strCodigo = '" + periodo + "' AND (MP.strcodPadreIti IS NULL OR MP.strcodPadreIti = 'ITI') ), PrerrequisitosMateria AS ( SELECT MP.strCodMateriaPensum, MP.strNombreMateria, MP.strPeriodo, MP.strCodPensum, MP.strCodPadreIti, MP.strCodNivel, MP.bytHorasAut, MP.bytHorasPrac, MP.bytHorasSeman, MP.bytHorasTeo, MP.fltCreditos, MP.strCodArea, MP.strCodFormaDict, STUFF(( SELECT '; ' + PR.strCodMatPre FROM [" + carrera + "].[dbo].[Prerrequisitos] PR WHERE PR.strCodMateria = MP.strCodMateriaPensum AND PR.strCodTipo = 'PRE' FOR XML PATH('') ), 1, 2, '') AS strPrerrequisitosCodigos, STUFF(( SELECT '; ' + M2.strNombre FROM [" + carrera + "].[dbo].[Prerrequisitos] PR INNER JOIN [" + carrera + "].[dbo].[Materias] M2 ON M2.strCodigo = PR.strCodMatPre WHERE PR.strCodMateria = MP.strCodMateriaPensum AND PR.strCodTipo = 'PRE' FOR XML PATH('') ), 1, 2, '') AS strPrerrequisitosNombres FROM MateriasPensum MP ) SELECT * FROM PrerrequisitosMateria ORDER BY strCodNivel, strCodMateriaPensum;"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ObtenerMallaAcademicaCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ObtenerMallaAcademicaCarreraPesum = async function (carrera,pesum) {
  var sentencia = "";
  sentencia = "WITH MateriasPensum AS ( SELECT MP.*, P.strCodigo AS strPeriodo, M.strNombre AS strNombreMateria, M.strCodigo AS strCodMateriaPensum FROM [" + carrera + "].[dbo].[Materias_Pensum] AS MP INNER JOIN [" + carrera + "].[dbo].[Periodos] AS P ON P.strCodPensum = MP.strCodPensum INNER JOIN [" + carrera + "].[dbo].[Materias] AS M ON M.strCodigo = MP.strCodMateria WHERE MP.strCodPensum = '" + pesum + "' AND (MP.strcodPadreIti IS NULL OR MP.strcodPadreIti = 'ITI') ), PrerrequisitosMateria AS ( SELECT MP.strCodMateriaPensum, MP.strNombreMateria, MP.strPeriodo, MP.strCodPensum, MP.strCodPadreIti, MP.strCodNivel, MP.bytHorasAut, MP.bytHorasPrac, MP.bytHorasSeman, MP.bytHorasTeo, MP.fltCreditos, MP.strCodArea, MP.strCodFormaDict, STUFF(( SELECT '; ' + PR.strCodMatPre FROM [" + carrera + "].[dbo].[Prerrequisitos] PR WHERE PR.strCodMateria = MP.strCodMateriaPensum AND PR.strCodTipo = 'PRE' FOR XML PATH('') ), 1, 2, '') AS strPrerrequisitosCodigos, STUFF(( SELECT '; ' + M2.strNombre FROM [" + carrera + "].[dbo].[Prerrequisitos] PR INNER JOIN [" + carrera + "].[dbo].[Materias] M2 ON M2.strCodigo = PR.strCodMatPre WHERE PR.strCodMateria = MP.strCodMateriaPensum AND PR.strCodTipo = 'PRE' FOR XML PATH('') ), 1, 2, '') AS strPrerrequisitosNombres FROM MateriasPensum MP ) SELECT * FROM PrerrequisitosMateria ORDER BY strCodNivel, strCodMateriaPensum;"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ObtenerMallaAcademicaCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}

module.exports.ListadoApellidosDocentesCarrera = async function (carrera,apellido) {
  var sentencia = "";
  sentencia ="SELECT * FROM [" + carrera + "].[dbo].[Docentes] WHERE [strApellidos] LIKE '%" + apellido + "%'"
  console.log(sentencia)
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return sendResponseModelo(true, sqlConsulta, 'OK')
    } else {
      return sendResponseModelo(false, [], 'VACIO SQL')
    }
  } catch (error) {
    logger.error('Error ListadoApellidosDocentesCarrera', { message: error.message, stack: error.stack });
    return sendResponseModelo(false, [], error.message)
  }
}