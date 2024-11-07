const { connectionAcademico } = require('./../config/PollConexionesAcademico'); // Importa el pool de conexiones
const {  execDinamico,execDinamicoTransaccion} = require("./../config/execSQLDinamico.helper");
const {  execMaster,execMasterTransaccion} = require("./../config/execSQLMaster.helper");
const CONFIGMASTER = require('./../config/baseMaster');
const CONFIGACADEMICO = require('./../config/databaseDinamico');

const sql = require("mssql");
var os = require('os');


module.exports.InsertarCupoConfirmado = async function (carrera,datosCupo,datosDetalle) {
   
   
        var sentencia="";
        var sentenciasecuencial=""
        var sentenciadetalle="";
       sentencia = "INSERT INTO [" + carrera + "].[dbo].[Cupo]([acu_id],[identificacion],[per_id],[tipoinsc],[per_niv],[per_carrera],[carrera],[fechacreacion],[cup_estado])"
      + "VALUES('" + datosCupo.acu_id + "','" + datosCupo.identificacion + "','" + datosCupo.per_id + "','" + datosCupo.tipoinsc + "','" + datosCupo.per_niv + "','" + datosCupo.per_carrera + "','" + datosCupo.carrera + "','" + datosCupo.fechacreacion + "', '" + datosCupo.cup_estado + "');";
 
      sentenciasecuencial="SELECT TOP 1 * FROM [" + carrera + "].[dbo].[Cupo] ORDER BY cup_id DESC"
     
      try {
          
        if (sentencia != "") {
          const IngresoCupo = await execDinamico(carrera,sentencia, "OK","OK");
          const secuencial = await execDinamico(carrera,sentenciasecuencial, "OK","OK");

          sentenciadetalle = "INSERT INTO [" + carrera + "].[dbo].[Detallecupo]([cup_id],[estcup_id],[per_carrera],[dcupfechacreacion],[dcupobservacion])"
         + "VALUES('" + secuencial.data[0].cup_id + "','" + datosDetalle.estcup_id + "','" + datosDetalle.per_carrera + "','" + datosDetalle.dcupfechacreacion + "','" + datosDetalle.dcupobservacion + "');";
         const IngresoDetalle = await execDinamico(carrera,sentenciadetalle, "OK","OK");
       
         return (IngresoDetalle)
        } else {
          return {data:"vacio sql"}
        }
      } catch (error) {
        return {data:"Error: "+ error}
      }
  
  }
  module.exports.InsertarCupoConfirmadoTrasnsaccion = async function (transaction,carrera,datosCupo,datosDetalle,strperiodo) {
    try {
        var sentencia="";
        var sentenciasecuencial=""
        var sentenciadetalle="";
        consultabase="SELECT * FROM [" + carrera + "].[dbo].[homologacioncarreras] WHERE hmbdbaseinsc='" + datosCupo.carCusId + "' and  periodo='" + strperiodo + "' "
        const sqlconsultabase = await execMasterTransaccion(transaction,carrera,consultabase, "OK","OK");
        if(sqlconsultabase.count>0){
        sentencia = "INSERT INTO [" + carrera + "].[dbo].[Cupo]([acu_id],[identificacion],[per_id],[tipoinsc],[per_niv],[per_carrera],[carrera],[fechacreacion],[cup_estado])"
        + "VALUES('" + datosCupo.acu_id + "','" + datosCupo.identificacion + "','" + datosCupo.per_id + "','" + datosCupo.tipoinsc + "','" + datosCupo.per_niv + "','" + datosCupo.per_carrera + "','" + sqlconsultabase.data[0].hmbdbaseniv + "','" + datosCupo.fechacreacion + "', '" + datosCupo.cup_estado + "');";

        sentenciasecuencial="SELECT TOP 1 * FROM [" + carrera + "].[dbo].[Cupo] ORDER BY cup_id DESC"
        let ingresoCupo = await execMasterTransaccion(transaction,carrera,sentencia, "OK","OK");
        let SecuencialCupo = await execMasterTransaccion(transaction,carrera,sentenciasecuencial, "OK","OK");
        sentenciadetalle = "INSERT INTO [" + carrera + "].[dbo].[Detallecupo]([cup_id],[estcup_id],[per_carrera],[dcupfechacreacion],[dcupobservacion])"
        + "VALUES('" + SecuencialCupo.data[0].cup_id + "','" + datosDetalle.estcup_id + "','" + datosDetalle.per_carrera + "','" + datosDetalle.dcupfechacreacion + "','" + datosDetalle.dcupobservacion + "');";
        const IngresoDetalle = await execMasterTransaccion(transaction,carrera,sentenciadetalle, "OK","OK");
      
      }
        return (null, "OK");
       
    } catch (error) {
        return {data:"Error: "+ error}
        throw error;
    }
}
module.exports.InsertarCupoConfirmadoTrasnsaccionGeneral = async function (transaction,carrera,datosCupo,datosDetalle,strperiodo) {
  try {
    var sentencia="";
    var sentenciasecuencial=""
    var sentenciadetalle="";
    sentencia = "INSERT INTO [" + carrera + "].[dbo].[Cupo]([acu_id],[identificacion],[per_id],[tipoinsc],[per_niv],[per_carrera],[carrera],[fechacreacion],[cup_estado])"
    + "VALUES('" + datosCupo.acu_id + "','" + datosCupo.identificacion + "','" + datosCupo.per_id + "','" + datosCupo.tipoinsc + "','" + datosCupo.per_niv + "','" + datosCupo.per_carrera + "','" + datosCupo.carrera + "','" + datosCupo.fechacreacion + "', '" + datosCupo.cup_estado + "');";

    sentenciasecuencial="SELECT TOP 1 * FROM [" + carrera + "].[dbo].[Cupo] ORDER BY cup_id DESC"
    let ingresoCupo = await execMasterTransaccion(transaction,carrera,sentencia, "OK","OK");
    let SecuencialCupo = await execMasterTransaccion(transaction,carrera,sentenciasecuencial, "OK","OK");
    sentenciadetalle = "INSERT INTO [" + carrera + "].[dbo].[Detallecupo]([cup_id],[estcup_id],[per_carrera],[dcupfechacreacion],[dcupobservacion])"
    + "VALUES('" + SecuencialCupo.data[0].cup_id + "','" + datosDetalle.estcup_id + "','" + datosDetalle.per_carrera + "','" + datosDetalle.dcupfechacreacion + "','" + datosDetalle.dcupobservacion + "');";
    const IngresoDetalle = await execMasterTransaccion(transaction,carrera,sentenciadetalle, "OK","OK");
    return (null,"OK")
  } catch (error) {
      return {data:"Error: "+ error}
      throw error;
  }
}
module.exports.ListadoEstudianteConfirmados = async function (carrera,periodo) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[Cupo] WHERE per_carrera='" + periodo + "' and NOT (carrera LIKE '%DES%')  and cup_estado=1"
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

module.exports.ListadoEstudianteCuposCasoEspecial = async function (carrera,periodo) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Cupo] WHERE per_carrera='" + periodo + "' and carrera LIKE '%DESCO%' "
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

module.exports.ObtnerEstudianteCupoPeriodo = async function (transaction,carrera,periodo,cedula) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Cupo] WHERE per_carrera='" + periodo + "' and  identificacion='" + cedula + "' "
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
module.exports.ListadoEstudiantesPerdidaCupodesdeAdmisiones = async function (carrera,periodo) {
  var sentencia="";
  sentencia="WITH UltimosRegistros AS ( SELECT dc.cup_id, MAX(dc.dcup_id) AS ultimo_dcup_id,per_carrera,dcupobservacion FROM [" + carrera + "].[dbo].[Detallecupo]  dc WHERE dc.dcupobservacion LIKE '%PERDIDA DE CUPO PROCESO MIGRACION DESDE ADMISIONES%' and dc.per_carrera = '" + periodo + "'  GROUP BY dc.cup_id,per_carrera,dcupobservacion ) SELECT * FROM UltimosRegistros AS ur INNER JOIN [" + carrera + "].[dbo].[Cupo] C ON c.cup_id = ur.cup_id "
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
module.exports.ObenterEstudianteIncripcion = async function (carrera,cedula,periodo) {
  var sentencia="";
  sentencia=" SELECT* FROM [" + carrera + "].[dbo].[Inscripciones]  AS i INNER JOIN [" + carrera + "].[dbo].[Carreras] AS c on c.strCodigo=i.strCodCarrera INNER JOIN [" + carrera + "].[dbo].[homologacioncarreras] AS h on h.hmbdbaseniv=c.strBaseDatos where i.strCedEstud='" + cedula + "' and i.strCodPeriodo='" + periodo + "' and  h.periodo='" + periodo + "' "
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

module.exports.ObenterEstudianteIncripcionP0039 = async function (transaction,carrera,cedula,periodo) {
  var sentencia="";
  sentencia="SELECT* FROM [" + carrera + "].[dbo].[Inscripciones]  AS i INNER JOIN [" + carrera + "].[dbo].[Carreras] AS c on c.strCodigo=i.strCodCarrera  where i.strCedEstud='" + cedula + "' and i.strCodPeriodo='" + periodo + "'  "
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
module.exports.ObenterTodasEstudianteIncripcion = async function (carrera,cedula) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Inscripciones]  AS i INNER JOIN [" + carrera + "].[dbo].[Carreras] AS c on c.strCodigo=i.strCodCarrera where i.strCedEstud='" + cedula + "' "
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
module.exports.ObenterEstudianteIncripcionMaster = async function (carrera,cedula,periodo) {
  var sentencia="";
  sentencia=" SELECT * FROM [" + carrera + "].[dbo].[Inscripciones]  AS i INNER JOIN [" + carrera + "].[dbo].[Carreras] AS c on c.strCodigo=i.strCodCarrera  where i.strCedEstud='" + cedula + "' and i.strCodPeriodo='" + periodo + "' "
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

module.exports.ObtenerUltimoDetalleCupoRegistrado = async function (carrera,cedula) {
  var sentencia="";
  sentencia="SELECT  dc.cup_id as cup_iddetalle,ec.estcup_id as idEstadoCupo ,*  FROM  [" + carrera + "].[dbo].[Detallecupo] dc  INNER JOIN (SELECT cup_id, MAX(dcup_id) AS ultimo FROM [" + carrera + "].[dbo].[Detallecupo] GROUP BY cup_id) ultimos_detalles ON dc.cup_id = ultimos_detalles.cup_id AND dc.dcup_id = ultimos_detalles.ultimo INNER JOIN [OAS_Master].[dbo].[Estadocupos] ec ON ec.estcup_id=dc.estcup_id INNER JOIN [" + carrera + "].[dbo].[Cupo] c ON dc.cup_id = c.cup_id INNER JOIN [" + carrera + "].[dbo].[Estudiantes] e ON e.strCedula=c.identificacion where c.identificacion  in ('" + cedula + "');"
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
module.exports.ObtenerDetalleCupoDadoEstadoCupo = async function (transaction,carrera,idEstadoCupo,cedula) {
  var sentencia="";
  sentencia=" SELECT c.acu_id,c.cup_id,c.per_carrera,c.per_id,c.identificacion,c.carrera,c.cup_estado,dc.per_carrera as per_detalle,dc.estcup_id FROM OAS_Master.dbo.Cupo as c INNER JOIN OAS_Master.dbo.Detallecupo as dc on dc.cup_id =c.cup_id WHERE dc.estcup_id =" + idEstadoCupo + " and c.identificacion='" + cedula + "' and c.carrera='" + carrera + "'"
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
module.exports.ListadoEstudiantesRetiroParcial = async function (transaction,carrera,estado) {
    var sentencia="";
  sentencia="SELECT c.acu_id,c.cup_id,c.per_carrera,c.per_id,c.identificacion,c.carrera,c.cup_estado,dc.per_carrera as per_detalle,dc.estcup_id FROM [" + carrera + "].[dbo].[Cupo] as c INNER JOIN [" + carrera + "].[dbo].[Detallecupo] as dc on dc.cup_id =c.cup_id WHERE dc.dcup_id in (SELECT MAX(dc.dcup_id) FROM [" + carrera + "].[dbo].[Cupo] as c INNER JOIN [" + carrera + "].[dbo].[Detallecupo] as dc on dc.cup_id =c.cup_id group by identificacion, dc.per_carrera)  and estcup_id='" + estado + "'"
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
module.exports.ObtenerPeriodoVigenteMaster = async function (carrera) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[Periodos] AS p WHERE p.dtFechaInic <= GETDATE() AND p.dtFechaFin >= GETDATE(); "
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
module.exports.ListadoPeriodoVigenteMaster = async function (carrera) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Periodos] AS p "
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
module.exports.EncontrarEstudianteMatriculadodadoCodigo = async function (transaction,carrera,periodo,codigo) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matriculas] as m  INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on m.strCodEstud=e.strCodigo WHERE m.strCodEstud='" + codigo + "' and  m.strCodPeriodo='" + periodo + "' and m.strCodEstado='DEF' ORDER BY m.strCodNivel,e.strApellidos"
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
module.exports.EncontrarEstudianteMatriculaTodas = async function (transaction,carrera,cedula) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matriculas] as m  INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on m.strCodEstud=e.strCodigo WHERE e.strCedula='" + cedula + "' and  m.strCodEstado='DEF' "
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

module.exports.ObtenerConvalidacionesEstudiante = async function (transaction,carrera,matricula,periodo) {
  var sentencia="";
  sentencia="select * from [" + carrera + "].[dbo].[Convalidaciones] as c inner join [" + carrera + "].[dbo].[Materias]  as mt on mt.strCodigo=c.strCodMateria inner join [" + carrera + "].[dbo].[Formas_Convalidacion] as fc on fc.strCodigo=c.strCodForma where sintCodMatricula='" + matricula + "' and strCodPeriodo='" + periodo + "'"
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
module.exports.EncontrarEstudianteMatriculadoAsignaturas = async function (carrera,periodo,cedula) {
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

module.exports.InsertarDetalleCupo = async function (carrera,datosDetalle) {
    var sentenciadetalle="";
    sentenciadetalle = "INSERT INTO [" + carrera + "].[dbo].[Detallecupo]([cup_id],[estcup_id],[per_carrera],[dcupfechacreacion],[dcupobservacion])"
    + "VALUES('" + datosDetalle.cup_id + "','" + datosDetalle.estcup_id + "','" + datosDetalle.per_carrera + "','" + datosDetalle.dcupfechacreacion + "','" + datosDetalle.dcupobservacion + "');";
  try {
    if (sentenciadetalle != "") {
      const sqlConsulta = await execMaster(carrera,sentenciadetalle, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }

}

module.exports.ObenterDictadoMateriasNivel = async function (transaction,carrera,periodo,nivel) {
    var sentencia="";
    sentencia="SELECT DISTINCT dm.strCodMateria,m.strNombre,dm.strCodNivel FROM  [" + carrera + "].[dbo].[Dictado_Materias] as dm INNER JOIN [" + carrera + "].[dbo].[Materias] as m on dm.strCodMateria=m.strCodigo WHERE strCodNivel='" + nivel + "' and strCodPeriodo='" + periodo + "'"
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

module.exports.AsignaturasMatriculadaEstudiante = async function (transaction,carrera,periodo,cedula) {
    var sentencia="";
    sentencia="SELECT m.strCodPeriodo as strCodPeriodoMatricula, m.strCodNivel as strCodNivelMatricula, m.strObservaciones as strObservacionesMatricula,ma.strObservaciones as strObservacionesAsignatura,ma.strCodNivel as strCodNivelAsignatura , * FROM [" + carrera + "].[dbo].[Matriculas] as m INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on m.strCodEstud=e.strCodigo INNER JOIN [" + carrera + "].[dbo].[Materias_Asignadas] as ma on m.sintCodigo= ma.sintCodMatricula INNER JOIN [" + carrera + "].[dbo].[Materias] as mat on mat.strCodigo= ma.strCodMateria WHERE e.strCedula='" + cedula + "' and m.strCodPeriodo='" + periodo + "' and m.strCodEstado='DEF' and ma.strCodPeriodo='" + periodo + "'"
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

module.exports.AsignaturasAprobadaEstudiante = async function (transaction,carrera,CodEstudiante) {
  var sentencia="";
  sentencia=" SELECT * FROM [" + carrera + "].dbo.Materias_Aprobadas WHERE strCodEstud='" + CodEstudiante + "' "
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

module.exports.MatriculasCarrerasPeriodo = async function (transaction,carrera,periodo) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matriculas] as m INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on m.strCodEstud=e.strCodigo WHERE  m.strCodPeriodo='" + periodo + "' and m.strCodEstado='DEF' ORDER BY m.strCodNivel,e.strApellidos"
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

module.exports.MatriculasCarrerasPeriodoSinTransaccion = async function (carrera,periodo) {
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

module.exports.MatriculasCarrerasValidacionConocimiento = async function (carrera) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matriculas] as m INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on m.strCodEstud=e.strCodigo WHERE strCodEstado LIKE 'VC%' "
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

module.exports.AsignaturasRetiroEstudiante = async function (transaction,carrera,periodo,cedula) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matriculas] as m INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on m.strCodEstud=e.strCodigo INNER JOIN [" + carrera + "].[dbo].[Retiros] as r on r.sintCodMatricula=m.sintCodigo  INNER JOIN [" + carrera + "].[dbo].[Materias] as ma on ma.strCodigo=r.strCodMateria  WHERE m.strCodPeriodo='" + periodo + "' and r.strCodPeriodo='" + periodo + "' and e.strCedula='" + cedula + "'"
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


module.exports.ObtenerEstudianteCupo = async function (transaction,cedula,periodo,carrera) {
  var sentencia="";
  sentencia="SELECT * FROM [OAS_Master].[dbo].[Cupo] WHERE identificacion='" + cedula + "' and carrera= '" + carrera + "' and cup_estado=1"
 
try {
  if (sentencia != "") {
    const sqlConsulta = await execMasterTransaccion(transaction,"OAS_Master",sentencia, "OK","OK");
   return (sqlConsulta)
  } else {
    return {data:"vacio sql"}
  }
} catch (error) {
  return {data:"Error: "+ error}
}

}
module.exports.InsertarCupoProceso = async function (idTipo,nombre,periodo) {
  var sentencia="";
//  sentencia="SELECT * FROM [OAS_Master].[dbo].[Cupo] WHERE identificacion='" + cedula + "' and per_carrera= '" + periodo + "' and cup_estado=1"

  sentencia = "INSERT INTO [OAS_Master].[dbo].[Cupo]([acu_id],[identificacion],[per_id],[tipoinsc],[per_niv],[per_carrera],[carrera],[fechacreacion],[cup_estado])"
      + "VALUES('" + datosCupo.acu_id + "','" + datosCupo.identificacion + "','" + datosCupo.per_id + "','" + datosCupo.tipoinsc + "','" + datosCupo.per_niv + "','" + datosCupo.per_carrera + "','" + datosCupo.carrera + "','" + datosCupo.fechacreacion + "', '" + datosCupo.cup_estado + "');";
 
try {
  if (sentencia != "") {
    const sqlConsulta = await execMaster("OAS_Master",sentencia, "OK","OK");
   return (sqlConsulta)
  } else {
    return {data:"vacio sql"}
  }
} catch (error) {
  return {data:"Error: "+ error}
}

}

module.exports.ObtenerCusIdBaseNivelacion = async function (carrera,periodo) {
  var sentencia="";
  sentencia="SELECT * FROM [OAS_Master].[dbo].[homologacioncarreras] WHERE hmbdbaseniv='" + carrera + "' and periodo= '" + periodo + "' "
 
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

module.exports.ObtenerBaseNivelacionDadoCusidPeriodo = async function (transaction,carrera,cusid,periodo) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[homologacioncarreras] WHERE hmbdbaseinsc='" + cusid + "' and periodo= '" + periodo + "' "
 
try {
  if (sentencia != "") {
    const sqlConsulta = await execDinamicoTransaccion(transaction,"OAS_Master",sentencia, "OK","OK");
   return (sqlConsulta)
  } else {
    return {data:"vacio sql"}
  }
} catch (error) {
  return {data:"Error: "+ error}
}

}

module.exports.ObtenerDatosBase = async function (carrera) {
  var sentencia="";
  sentencia="SELECT F.strNombre as strNombreFacultad, C.strNombre as strNombreCarrera, * FROM [OAS_Master].[dbo].Facultades AS F INNER JOIN [OAS_Master].[dbo].Escuelas AS E ON E.strCodFacultad=F.strCodigo INNER JOIN [OAS_Master].[dbo].Carreras AS C ON C.strCodEscuela=E.strCodigo  WHERE C.strBaseDatos='" + carrera + "' "
 
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

module.exports.ObtenerVerificacionHomologacionCarreraIngreso = async function (periodo,bsCarrera) {
  var sentencia="";
  sentencia="SELECT * FROM  [OAS_Master].[dbo].[Homologacioncarreras] WHERE periodo= '" + periodo + "' AND hmbdbasecar= '" + bsCarrera + "' AND homestado= 1"
 
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

module.exports.InsertarCupoProcesoTabla = async function (idTipo,strNombre,strPeriodo,cedula) {
  var sentencia="";
 
  sentencia = "INSERT INTO [OAS_Master].[dbo].[CupoProcesos]([idTipo],[nombreProceso],[strPeriodo],[blestado],[cedulausuario],[cedulamodifica])"
  + "VALUES(" + idTipo + ",'" + strNombre + "','" + strPeriodo+ "',1,'" + cedula+ "','" + cedula+ "');";


  try {
  if (sentencia != "") {
    const sqlConsulta = await execMaster("OAS_Master",sentencia, "OK","OK");
   return (sqlConsulta)
  } else {
    return {data:"vacio sql"}
  }
} catch (error) {
  return {data:"Error: "+ error}
}

}
module.exports.ObtenerDatosCupoProcesoTabla = async function (strPeriodo,idTipo) {
  var sentencia="";
  sentencia = "SELECT * FROM  [OAS_Master].[dbo].[CupoProcesos] WHERE idTipo=" + idTipo+ " and blestado=1 and strPeriodo='" + strPeriodo+ "'"
 
  try {
  if (sentencia != "") {
    const sqlConsulta = await execMaster("OAS_Master",sentencia, "OK","OK");
   return (sqlConsulta)
  } else {
    return {data:"vacio sql"}
  }
} catch (error) {
  return {data:"Error: "+ error}
}

}
module.exports.ListadoProcesoPeriodos = async function (strPeriodo) {
  var sentencia="";
  sentencia = "SELECT * FROM  [OAS_Master].[dbo].[CupoProcesos] WHERE  strPeriodo='" + strPeriodo+ "'"
 
  try {
  if (sentencia != "") {
    const sqlConsulta = await execMaster("OAS_Master",sentencia, "OK","OK");
   return (sqlConsulta)
  } else {
    return {data:"vacio sql"}
  }
} catch (error) {
  return {data:"Error: "+ error}
}

}
module.exports.ListadoPeriodoEjecutados = async function () {
  var sentencia="";
  sentencia = "SELECT distinct strPeriodo FROM  [OAS_Master].[dbo].[CupoProcesos]  ORDER BY  strPeriodo DESC"
  try {
  if (sentencia != "") {
    const sqlConsulta = await execMaster("OAS_Master",sentencia, "OK","OK");
   return (sqlConsulta)
  } else {
    return {data:"vacio sql"}
  }
} catch (error) {
  return {data:"Error: "+ error}
}
}
module.exports.ObtenerPeriodoDadoCodigo = async function (strPeriodo) {
  var sentencia="";
  sentencia = "SELECT * FROM  [OAS_Master].[dbo].[Periodos] WHERE strCodigo='" + strPeriodo+ "'"
  try {
  if (sentencia != "") {
    const sqlConsulta = await execMaster("OAS_Master",sentencia, "OK","OK");
   return (sqlConsulta)
  } else {
    return {data:"vacio sql"}
  }
} catch (error) {
  return {data:"Error: "+ error}
}
}

module.exports.ListadoCarreraNivelacion = async function (transaction,carrera,strCodfigoFacultad) {
  var sentencia="";
  sentencia="SELECT F.strNombre as strNombreFacultad, C.strNombre as strNombreCarrera, * FROM [" + carrera + "].[dbo].Facultades AS F INNER JOIN [OAS_Master].[dbo].Escuelas AS E ON E.strCodFacultad=F.strCodigo INNER JOIN [OAS_Master].[dbo].Carreras AS C ON C.strCodEscuela=E.strCodigo  WHERE F.strCodigo='" + strCodfigoFacultad + "' "
 
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
module.exports.ListadoCarreraTodas = async function (transaction,carrera) {
  var sentencia="";
  sentencia="SELECT F.strNombre as strNombreFacultad, C.strNombre as strNombreCarrera, * FROM [" + carrera + "].[dbo].Facultades AS F INNER JOIN [OAS_Master].[dbo].Escuelas AS E ON E.strCodFacultad=F.strCodigo INNER JOIN [OAS_Master].[dbo].Carreras AS C ON C.strCodEscuela=E.strCodigo "
 
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
module.exports.ListadoCarreraTodasSinTransaccion = async function (carrera) {
  var sentencia="";
  sentencia="SELECT F.strNombre as strNombreFacultad, C.strNombre as strNombreCarrera,C.strCodEstado  as estadoCarrera,C.strCodTipoEntidad as strCodTipoCarrera,* FROM [" + carrera + "].[dbo].Facultades AS F INNER JOIN [OAS_Master].[dbo].Escuelas AS E ON E.strCodFacultad=F.strCodigo INNER JOIN [OAS_Master].[dbo].Carreras AS C ON C.strCodEscuela=E.strCodigo "
 
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

module.exports.NotasExamenesEstudianteDadoMateria = async function (transaction,carrera,periodo,intMatricula,strCodmteria) {
  var sentencia="";
  sentencia="SELECT * FROM [" + carrera + "].[dbo].[Notas_Examenes]  WHERE  strCodPeriodo='" + periodo + "' and sintCodMatricula=" + intMatricula + " and strCodMateria='" + strCodmteria + "' "
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
module.exports.AsignaturasDatos = async function (carrera,codMateria) {
  var sentencia="";
  sentencia=" SELECT * FROM [" + carrera + "].dbo.Materias WHERE strCodigo='" + codMateria + "' "
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
module.exports.DocentesDatos = async function (carrera,cedula) {
  var sentencia="";
  sentencia=" SELECT * FROM [" + carrera + "].dbo.Docentes WHERE strCedula='" + cedula + "' "
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
module.exports.PeriodoDatos = async function (carrera,periodo) {
  var sentencia="";
  sentencia=" SELECT * FROM [" + carrera + "].dbo.Periodos WHERE strCodigo='" + periodo + "' "
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
