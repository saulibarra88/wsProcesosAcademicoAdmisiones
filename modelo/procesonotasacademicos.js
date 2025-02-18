const { connectionAcademico } = require('./../config/PollConexionesAcademico'); // Importa el pool de conexiones
const { execDinamico, execDinamicoTransaccion } = require("./../config/execSQLDinamico.helper");
const { execMaster, execMasterTransaccion } = require("./../config/execSQLMaster.helper");
const CONFIGACADEMICO = require('./../config/databaseDinamico');
const sql = require("mssql");
var os = require('os');
const fs = require('fs');
const path = require('path');

module.exports.ObtenerCarrerasMater = async function (carrera, estado) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Carreras] AS c WHERE c.strCodEstado= '" + estado + "';"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return (sqlConsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }

}

module.exports.ActualizarNotaExonerados = async function (carrera, periodo) {
  var sentencia = "";
  sentencia = "UPDATE [" + carrera + "].[dbo].[Notas_Examenes]  SET Notas_Examenes.bytNota=12 WHERE (strCodPeriodo = '" + periodo + "') AND (strCodTipoExamen = 'PRI') AND (strCodEquiv = 'E') AND (bytNota = 0)"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return (sqlConsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }

}
module.exports.ActualizarActasGeneradasAutomaticamenteFechas = async function (carrera, periodo, tipo) {
  var sentencia = "";
  sentencia = "UPDATE [" + carrera + "].[dbo].[Acta]  SET actestado=2 WHERE strCodPeriodo='" + periodo + "' AND tipcodigo='" + tipo + "' AND tipoactagenerado=2 AND actestado=1"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return (sqlConsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }

}

module.exports.ObtenerNotaPacialAsignatura = async function (transaction, carrera, idMatricula, periodo, asignatura) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Notas_Parciales] AS np WHERE np.strCodPeriodo= '" + periodo + "' and np.sintCodMatricula= " + idMatricula + " and np.strCodMateria= '" + asignatura + "';"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaction, carrera, sentencia, "OK", "OK");
      return (sqlConsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }

}
module.exports.ObtenerParametroCalificacionPorCodEquivalencia = async function (transaction, carrera, codEquivalencia, idreglemanto) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[equivalenciarendimiento] AS eqv WHERE eqv.eqrencualitativa= '" + codEquivalencia + "' and eqv.eqrenregid= " + idreglemanto + ";"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaction, carrera, sentencia, "OK", "OK");
      return (sqlConsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}
module.exports.ObtenerParametroCalificacionPromedioEquivalencia = async function (transaction, carrera, promedio, idreglemanto) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[equivalenciarendimiento] AS eqv WHERE (" + promedio + " BETWEEN eqv.eqrenminimo AND eqv.eqrenmaximo )and eqv.eqrenregid= " + idreglemanto + " and eqv.eqrencualitativa not in ('S','R')"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaction, carrera, sentencia, "OK", "OK");
      return (sqlConsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}
module.exports.ObtenerParametroEquivalenciaAsistencia = async function (transaction, carrera, promedio, idreglemanto) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[equivalenciarendimiento] AS eqv WHERE (" + promedio + " BETWEEN eqv.eqrenminimo AND eqv.eqrenmaximo )and eqv.eqrenregid= " + idreglemanto + " and eqv.eqrencualitativa in ('S')"
  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamicoTransaccion(transaction, carrera, sentencia, "OK", "OK");
      return (sqlConsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}
module.exports.ListadoEquivalenciaRendimentodadoReglamento = async function (carrera, idreglemanto) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[equivalenciarendimiento] AS eqv WHERE  eqv.eqrenregid= " + idreglemanto + " and eqrenestado=1;"

  try {
    if (sentencia != "") {
      const sqlConsulta = await execDinamico(carrera, sentencia, "OK", "OK");
      return (sqlConsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }


}
module.exports.VerificacionEstudianteProcesosMatriculas = async function (transaction, carrera, periodo, idmatricula, CodMateria, codEstudiante) {
  try {
    var consultaconvalidacion = "";
    var consultaretiros = ""
    var consultamateriasintenerqueaprobar = "";
    consultaconvalidacion = "SELECT * FROM [" + carrera + "].[dbo].[Convalidacion] WHERE sintCodMatricula=" + idmatricula + " and  strCodPeriodo='" + periodo + "' and  strCodMateria='" + CodMateria + "'"
    const sqlconsultabasevalidacion = await execDinamicoTransaccion(transaction, carrera, consultaconvalidacion, "OK", "OK");
    consultaretiros = "SELECT * FROM [" + carrera + "].[dbo].[Retiros] WHERE sintCodMatricula=" + idmatricula + " and  strCodPeriodo='" + periodo + "' and  strCodMateria='" + CodMateria + "'"
    const sqlconsultabaseretiro = await execDinamicoTransaccion(transaction, carrera, consultaretiros, "OK", "OK");
    //   consultasinaprobar = "SELECT * FROM [" + carrera + "].[dbo].[Materias_Sin_Tener_Aprobar] WHERE strCodEstud=" + codEstudiante + " and  strCodMat='" + CodMateria + "'"
    //   const sqlconsultabaseconsultasinaprobar = await execDinamicoTransaccion(transaction, carrera, consultasinaprobar, "OK", "OK");
    if (sqlconsultabasevalidacion.count == 0) {
      if (sqlconsultabaseretiro.count == 0) {
        /*  if (sqlconsultabamateriasintenerqueaprobar.count == 0) {
            resultado = true
          } else {
            resultado = false
          }*/
        resultado = false
      } else {
        resultado = false
      }
    } else {
      resultado = false
    }
    return resultado


  } catch (error) {
    return { data: "Error: " + error }
    throw error;
  }
}

module.exports.ObtenerConvalidacionesEstudiante = async function (transaction, carrera, periodo, idmatricula, CodMateria) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Convalidaciones] WHERE sintCodMatricula=" + idmatricula + " and  strCodPeriodo='" + periodo + "' and  strCodMateria='" + CodMateria + "'"
  try {
    if (sentencia != "") {
      const sqlconsulta = await execDinamicoTransaccion(transaction, carrera, sentencia, "OK", "OK");
      return (sqlconsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}

module.exports.ObtenerRetirosEstudiante = async function (transaction, carrera, periodo, idmatricula, CodMateria) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Retiros] WHERE sintCodMatricula=" + idmatricula + " and  strCodPeriodo='" + periodo + "' and  strCodMateria='" + CodMateria + "'"
  try {
    if (sentencia != "") {
      const sqlconsulta = await execDinamicoTransaccion(transaction, carrera, sentencia, "OK", "OK");
      return (sqlconsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}

module.exports.ObtenerMateriaNoAprobarEstudiante = async function (transaction, carrera, CodMateria, codEstudiante) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[Materias_Sin_Tener_Aprobar] WHERE strCodEstud=" + codEstudiante + " and  strCodMat='" + CodMateria + "'"
  try {
    if (sentencia != "") {
      const sqlconsulta = await execDinamicoTransaccion(transaction, carrera, sentencia, "OK", "OK");
      return (sqlconsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}

module.exports.ListadoNominaEstudianteDadoCedulaDocente = async function (transaction, carrera, periodo, nivel, paralelo, CodMateria, cedula) {
  var sentencia = "";
  sentencia = "SELECT m.sintCodigo,m.strCodEstado,m.dtFechaCreada,m.dtFechaAutorizada,m.strCodNivel as NivelMatricula,m.strCodEstud, e.strCedula,e.strApellidos,e.strNombres,e.strEmail,d.strApellidos as strApellidoDocente,d.strNombres as strNombreDocente, d.strCodigo as strCodigoDocente,ma.strCodMateria,ma.strCodNivel as strNivelMateria, ma.strCodParalelo,ma.strCodPeriodo as strCodPeriodoMateria,ma.bytNumMat,ma.bytAsistencia,ma.strObservaciones as strObservacionesMateria  FROM [" + carrera + "].[dbo].[Dictado_MateriasDocentes]  as md INNER JOIN [" + carrera + "].[dbo].[Docentes]  AS d on d.strCodigo=md.strCodDocente INNER JOIN [" + carrera + "].[dbo].[Materias_Asignadas]  AS ma on ma.strCodMateria=md.strCodMateria INNER JOIN [" + carrera + "].[dbo].[Matriculas] AS m on m.sintCodigo=ma.sintCodMatricula  INNER JOIN [" + carrera + "].[dbo].[Estudiantes] AS e on e.strCodigo=m.strCodEstud where md.strCodNivel='" + nivel + "' and md.strCodMateria='" + CodMateria + "' and md.strCodParalelo='" + paralelo + "' and md.strCodPeriodo='" + periodo + "' and ma.strCodPeriodo='" + periodo + "' and ma.strCodNivel='" + nivel + "' and ma.strCodParalelo='" + paralelo + "' and ma.strCodMateria='" + CodMateria + "' and  m.strCodPeriodo='" + periodo + "' and d.strCedula='" + cedula + "' and m.strCodEstado='DEF' Order by  e.strApellidos"

  try {
    if (sentencia != "") {
      const sqlconsulta = await execDinamicoTransaccion(transaction, carrera, sentencia, "OK", "OK");
      return (sqlconsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}

module.exports.ObtenerLinkActasCalificaciones = async function (transaction, carrera, periodo, nivel, paralelo, CodMateria, codDocente, idTipoActa) {
  var sentencia = "";
  sentencia = "SELECT * FROM [" + carrera + "].[dbo].[bandejaactas] AS ma WHERE ma.strCodParalelo= '" + paralelo + "' and ma.strCodPeriodo= '" + periodo + "' and ma.strCodNivel= '" + nivel + "'and ma.strCodMateria= '" + CodMateria + "' and ma.strCodDocente= '" + codDocente + "' and ma.tipoacta= " + idTipoActa + " and estado=3 and estadoeliminar=1"
  try {
    if (sentencia != "") {
      const sqlconsulta = await execDinamicoTransaccion(transaction, carrera, sentencia, "OK", "OK");
      return (sqlconsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }



}
module.exports.ObtenerMatriculaInternado = async function ( carrera, cedula) {
  var sentencia = "";
  sentencia = "select * from [" + carrera + "].[dbo].[Matriculas_Internado]  as m inner join [" + carrera + "].[dbo].[Estudiantes]  as e on e.strCodigo= m.strCodEstud inner join Cohertes_Internado as c on m.strCodCoherte=c.strCodigo where e.strCedula='" + cedula + "'"
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
module.exports.ObtenerMatriculaInternadoAsignaturas = async function ( carrera, cohorte,idMatricula,codEstudiante) {
  var sentencia = "";
  sentencia = " select * from [" + carrera + "].[dbo].[Matriculas_Internado] as m inner join [" + carrera + "].[dbo].[Materias_Asignadas_Internado]  as ma on ma.sintCodMatricula= m.sintCodigo inner join [" + carrera + "].[dbo].[Materias_Internado] as mai on mai.strCodigo=ma.strCodMateria where m.strCodCoherte='" + cohorte + "' and m.sintCodigo=" + idMatricula + " and m.strCodEstud=" + codEstudiante + ""
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
module.exports.ObtenerAsignaturasRetiroInternado = async function ( carrera, cohorte,idMatricula,codMateria) {
  var sentencia = "";
  sentencia = " select * from [" + carrera + "].[dbo].[Retiros_Internado] where sintCodMatricula=" + idMatricula + " and strCodCoherte='" + cohorte + "' and strCodMateria='" + codMateria + "'"
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
module.exports.ObtenerAsignaturasRetiroTodas = async function ( carrera, cohorte,idMatricula) {
  var sentencia = "";
  sentencia = " select * from [" + carrera + "].[dbo].[Retiros_Internado] as r inner join [" + carrera + "].[dbo].[Materias_Internado] as mi on mi.strCodigo=r.strCodMateria where r.sintCodMatricula=" + idMatricula + " and r.strCodCoherte='" + cohorte + "'"
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

module.exports.ListadoEstudiantePeriodoMatricula = async function (transaction, carrera,periodo,estado) {
  var sentencia = "";
  sentencia = " select * from [" + carrera + "].[dbo].[Matriculas] as m inner join [" + carrera + "].[dbo].[Estudiantes] as e on m.strCodEstud=e.strCodigo where m.strCodPeriodo='" + periodo + "' and m.strCodEstado='" + estado + "' order by m.strCodNivel"

  try {
    if (sentencia != "") {
      const sqlconsulta = await execDinamicoTransaccion(transaction, carrera, sentencia, "OK", "OK");
      return (sqlconsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}

module.exports.ListadoAsignaturasEstudiante = async function ( transaction,carrera,periodo,intMatricula) {
  var sentencia = "";
  sentencia = " select * from [" + carrera + "].[dbo].[Materias_Asignadas] as ma inner join [" + carrera + "].[dbo].[Materias] as m on ma.strCodMateria=m.strCodigo where  ma.strCodPeriodo='" + periodo + "' and ma.sintCodMatricula='" + intMatricula + "'"
  try {
    if (sentencia != "") {
      const sqlconsulta = await execDinamicoTransaccion( transaction,carrera, sentencia, "OK", "OK");
      return (sqlconsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}
module.exports.PeriodoDatosCarrera = async function (transaction,carrera,periodo) {
  var sentencia="";
  sentencia=" SELECT * FROM [" + carrera + "].dbo.Periodos WHERE strCodigo='" + periodo + "' "
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


module.exports.ObtenerSolicitudesRectifiaciones = async function (transaction,carrera,periodo) {
  var sentencia="";
  sentencia=" SELECT * FROM [" + carrera + "].dbo.Periodos WHERE strCodigo='" + periodo + "' "
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

module.exports.ObtenerMateriaConvalidacionConocimiento = async function (transaction, carrera, CodMateria, intMatricula,periodo) {
  var sentencia = "";
  sentencia = "select * from [" + carrera + "].[dbo].[solicitudvalidacion] as s inner join [dbo].[detallesolicitudval] as ds on ds.dsvidsolicitud=s.svalcod where s.svalidmatricula=" + intMatricula + " and ds.dsvcodmateria='" + CodMateria + "' and s.svalcodperiodo='" + periodo + "' and ds.dsvnota is not null"
  try {
    if (sentencia != "") {
      const sqlconsulta = await execDinamicoTransaccion(transaction, carrera, sentencia, "OK", "OK");
      return (sqlconsulta)
    } else {
      return { data: "vacio sql" }
    }
  } catch (error) {
    return { data: "Error: " + error }
  }
}