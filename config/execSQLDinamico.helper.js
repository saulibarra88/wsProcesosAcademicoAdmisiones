
const CONFIGACADEMICO = require('./../config/databaseDinamico');
const sql = require('mssql');
const { Connection, Request } = require('mssql');

const execDinamico = async (carrera, SQL, OK = "", msgVacio = "", msgError = null) => {

  var conex = CONFIGACADEMICO;
  conex.database = carrera;
  //console.log("*********************************************************************")
 // console.log("conexxion Dinamica:", conex.database)
 // console.log("SQL:", SQL)
  let pool; // Utilizaremos un grupo de conexiones en lugar de una conexión única
  //let conn;

  try {
    if (!pool) {
      pool = await new sql.ConnectionPool(conex).connect();
    }
    // Obtener una conexión del grupo de conexiones
    const conn = pool.request();
    // Ejecutar la consulta
    const result = await conn.query(SQL);
    return buildResponse(result, OK, msgVacio, msgError);
  } catch (err) {
    console.log("Error conexion Base Academico:" + err);
    return handleDatabaseError(err, msgError);
  } finally {
    if (pool) {
      await pool.close();
    }
  }

 
};


const execDinamicoTransaccion = async (transaction,carrera, SQL, OK = "", msgVacio = "", msgError = null) => {
  try {
    // Ejecuta el SQL personalizado con los parámetros
   // console.log(SQL)
    var res=  await transaction.request().query(SQL);
    return buildResponse(res, OK, msgVacio, msgError);
  } catch (error) {
    await transaction.rollback();
    return handleDatabaseError(error, msgError);
    throw error;
  
  }

  let pool; // Utilizaremos un grupo de conexiones en lugar de una conexión única
  //let conn;

  try {

    if (!pool) {
      pool = await new sql.ConnectionPool(conex).connect();
    }
    // Obtener una conexión del grupo de conexiones
    const conn = pool.request();

    // Ejecutar la consulta
    const result = await conn.query(SQL);
    return buildResponse(result, OK, msgVacio, msgError);
  } catch (err) {
    console.log("Error conexion Base Academico:" + err);
    return handleDatabaseError(err, msgError);
  } finally {
    if (pool) {
      await pool.close();
    }
  }


};
const buildResponse = (res, OK, msgVacio, msgError) => {
  const count = res.recordset == undefined ? 0 : res.recordset.length;
  const message = count > 0 ? OK : msgVacio;
  const data = res.recordset ?? [];
  return { count, message, data };
};

const handleDatabaseError = (err, msgError) => {
  if (err instanceof sql.ConnectionError) {
    return {
      count: -1,
      message: "Error de conexión a la base de datos. " + err,
      data: [],
    };
  } else {
    return {
      count: -1,
      message: msgError ?? err.originalError.info.message,
      data: [],
    };
  }
};
  // Función para iniciar una transacción
  const iniciarDinamicoTransaccion = async  (poolejcucion) =>{
    try {
        const sql = require("mssql");
        const transaction = new sql.Transaction(poolejcucion);
        return transaction;
  
    } catch (error) {
        throw error;
    }
  }

    // Función para iniciar una transacción
    const iniciarDinamicoPool = async  (carrera) =>{
      try {
        const sql = require("mssql");
        var conex = CONFIGACADEMICO;
        var resultado = false;
        conex.database = carrera;
        const pool = new sql.ConnectionPool(conex);
        return pool;
      } catch (error) {
          throw error;
      }
    }

module.exports = { execDinamico,execDinamicoTransaccion,iniciarDinamicoTransaccion,iniciarDinamicoPool };
