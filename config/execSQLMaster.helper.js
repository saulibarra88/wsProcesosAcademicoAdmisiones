
const CONFIGMASTER = require('./../config/baseMaster');
const sql = require('mssql');
const execMaster = async (carrera, SQL, OK = "", msgVacio = "", msgError = null) => {

  var conex = CONFIGMASTER;
  conex.database = carrera;
 // console.log("*********************************************************************")
 // console.log("conexxion Master:", conex.database)
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
  const execMasterTransaccion = async (transaction,carrera, SQL, OK = "", msgVacio = "", msgError = null) => {
    try {
      // Ejecuta el SQL personalizado con los parámetros
     // console.log(SQL)
      const request = new sql.Request(transaction);
      var res=  await request.query(SQL);
      return buildResponse(res, OK, msgVacio, msgError);
    } catch (error) {
      // Si ocurre un error, deshace la transacción
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
    const count = res.recordset==undefined?0:res.recordset.length;
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
  
  module.exports = { execMaster,execMasterTransaccion };
  