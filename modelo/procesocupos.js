const { connectionAcademico } = require('./../config/PollConexionesAcademico'); // Importa el pool de conexiones
const {  execDinamico,execDinamicoTransaccion} = require("./../config/execSQLDinamico.helper");
const {  execMaster} = require("./../config/execSQLMaster.helper");
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
  module.exports.InsertarCupoConfirmadoTrasnsaccion = async function (carrera,datosCupo,datosDetalle,strperiodo) {
    try {
        var sentencia="";
        var sentenciasecuencial=""
        var sentenciadetalle="";
        var conex = CONFIGACADEMICO;
        conex.database = carrera;
        let dbConn = new sql.ConnectionPool(conex);
        await dbConn.connect();
        let transaction = new sql.Transaction(dbConn);
        await transaction.begin()
            .then(async () => {

                consultabase="SELECT * FROM [" + carrera + "].[dbo].[homologacioncarreras] WHERE hmbdbaseinsc='" + datosCupo.carCusId + "' and  periodo='" + strperiodo + "' "
                    const sqlconsultabase = await execDinamicoTransaccion(transaction,carrera,consultabase, "OK","OK");
                    if(sqlconsultabase.count>0){
                    sentencia = "INSERT INTO [" + carrera + "].[dbo].[Cupo]([acu_id],[identificacion],[per_id],[tipoinsc],[per_niv],[per_carrera],[carrera],[fechacreacion],[cup_estado])"
                    + "VALUES('" + datosCupo.acu_id + "','" + datosCupo.identificacion + "','" + datosCupo.per_id + "','" + datosCupo.tipoinsc + "','" + datosCupo.per_niv + "','" + datosCupo.per_carrera + "','" + sqlconsultabase.data[0].hmbdbaseniv + "','" + datosCupo.fechacreacion + "', '" + datosCupo.cup_estado + "');";
        
                    sentenciasecuencial="SELECT TOP 1 * FROM [" + carrera + "].[dbo].[Cupo] ORDER BY cup_id DESC"
                    let ingresoCupo = await execDinamicoTransaccion(transaction,carrera,sentencia, "OK","OK");
                    let SecuencialCupo = await execDinamicoTransaccion(transaction,carrera,sentenciasecuencial, "OK","OK");
                    sentenciadetalle = "INSERT INTO [" + carrera + "].[dbo].[Detallecupo]([cup_id],[estcup_id],[per_carrera],[dcupfechacreacion],[dcupobservacion])"
                    + "VALUES('" + SecuencialCupo.data[0].cup_id + "','" + datosDetalle.estcup_id + "','" + datosDetalle.per_carrera + "','" + datosDetalle.dcupfechacreacion + "','" + datosDetalle.dcupobservacion + "');";
                    const IngresoDetalle = await execDinamicoTransaccion(transaction,carrera,sentenciadetalle, "OK","OK");
                    let resultado = await Promise.all([ingresoCupo, SecuencialCupo,IngresoDetalle]);
                    await transaction.commit();
                    dbConn.close();
                    return (null, "OK");

                }
         
            })
            .catch(async (err) => {
                await transaction.rollback();
                dbConn.close();
                console.log(err);
                return {data:"Error: "+ error}
                throw err;
            });
    } catch (error) {
        return {data:"Error: "+ error}
        throw error;
    }
}

module.exports.ListadoEstudianteConfirmados = async function (carrera,periodo) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[Cupo] WHERE per_carrera='" + periodo + "' "
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
module.exports.ObenterEstudianteIncripcionMaster = async function (carrera,cedula,periodo) {
  var sentencia="";
  sentencia=" SELECT* FROM [" + carrera + "].[dbo].[Inscripciones]  AS i INNER JOIN [" + carrera + "].[dbo].[Carreras] AS c on c.strCodigo=i.strCodCarrera  where i.strCedEstud='" + cedula + "' and i.strCodPeriodo='" + periodo + "' "
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
module.exports.ListadoEstudiantesRetiroParcial = async function (carrera,estado) {
    var sentencia="";
  sentencia="SELECT c.acu_id,c.cup_id,c.per_carrera,c.per_id,c.identificacion,c.carrera,c.cup_estado,dc.per_carrera as per_detalle,dc.estcup_id FROM [" + carrera + "].[dbo].[Cupo] as c INNER JOIN [" + carrera + "].[dbo].[Detallecupo] as dc on dc.cup_id =c.cup_id WHERE dc.dcup_id in (SELECT MAX(dc.dcup_id) FROM [" + carrera + "].[dbo].[Cupo] as c INNER JOIN [" + carrera + "].[dbo].[Detallecupo] as dc on dc.cup_id =c.cup_id group by identificacion, dc.per_carrera)  and estcup_id='" + estado + "'"
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
      const sqlConsulta = await execDinamico(carrera,sentenciadetalle, "OK","OK");
     return (sqlConsulta)
    } else {
      return {data:"vacio sql"}
    }
  } catch (error) {
    return {data:"Error: "+ error}
  }

}

module.exports.ObenterDictadoMateriasNivel = async function (carrera,periodo,nivel) {
    var sentencia="";
    sentencia="SELECT DISTINCT dm.strCodMateria,m.strNombre,dm.strCodNivel FROM  [" + carrera + "].[dbo].[Dictado_Materias] as dm INNER JOIN [" + carrera + "].[dbo].[Materias] as m on dm.strCodMateria=m.strCodigo WHERE strCodNivel='" + nivel + "' and strCodPeriodo='" + periodo + "'"
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

module.exports.AsignaturasMatriculadaEstudiante = async function (carrera,periodo,cedula) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matriculas] as m INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on m.strCodEstud=e.strCodigo INNER JOIN [" + carrera + "].[dbo].[Materias_Asignadas] as ma on m.sintCodigo= ma.sintCodMatricula WHERE e.strCedula='" + cedula + "' and m.strCodPeriodo='" + periodo + "' and m.strCodEstado='DEF' and ma.strCodPeriodo='" + periodo + "'"
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

module.exports.AsignaturasRetiroEstudiante = async function (carrera,periodo,cedula) {
    var sentencia="";
    sentencia="SELECT * FROM [" + carrera + "].[dbo].[Matriculas] as m INNER JOIN [" + carrera + "].[dbo].[Estudiantes] as e on m.strCodEstud=e.strCodigo INNER JOIN [" + carrera + "].[dbo].[Retiros] as r on r.sintCodMatricula=m.sintCodigo  INNER JOIN [" + carrera + "].[dbo].[Materias] as ma on ma.strCodigo=r.strCodMateria  WHERE m.strCodPeriodo='" + periodo + "' and r.strCodPeriodo='" + periodo + "' and e.strCedula='" + cedula + "'"
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


module.exports.ObtenerEstudianteCupo = async function (cedula,periodo,carrera) {
  var sentencia="";
  sentencia="SELECT * FROM [OAS_Master].[dbo].[Cupo] WHERE identificacion='" + cedula + "' and per_carrera= '" + periodo + "' and cup_estado=1"
 
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
