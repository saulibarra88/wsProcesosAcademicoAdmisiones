
//const { Client } = require('pg')
const sql = require('pg')
var os = require('os');
const { Client } = require('pg');
const { execCentralizadaMejorada,execCentralizadaTransaccionMejorada } = require('./../config/execSQLCentralizadaMejorada.helper');
const { execCentralizada,execCentralizadaTransaccion } = require('./../config/execSQLCentralizada.helper');



module.exports.obtenerdocumento = async function (cedula) {
    var sentencia;
    sentencia = "SELECT p.per_id, p.per_nombres, p.\"per_primerApellido\", p.\"per_segundoApellido\", p.per_email, p.\"per_emailAlternativo\", p.\"per_telefonoOficina\", p.\"per_telefonoCelular\", \"per_fechaNacimiento\", \"per_afiliacionIESS\", tsa_id, etn_id,  p.eci_id, gen_id, p.\"per_creadoPor\", p.\"per_fechaCreacion\", p.\"per_modificadoPor\",   p.\"per_fechaModificacion\", p.\"per_telefonoCasa\", p.lugarprocedencia_id,     p.sex_id, p.per_procedencia FROM central.persona p INNER JOIN central.\"documentoPersonal\" d ON p.per_id=d.per_id WHERE d.pid_valor= '" + cedula + "'  "
    try {
  
      if (sentencia != "") {
        const resp = await execCentralizada(sentencia, "OK", "OK");
        return (resp)
      } else {
        return { data: "vacio sql" }
      }
    } catch (error) {
      return { data: "Error: " + error }
    }
  
  }







