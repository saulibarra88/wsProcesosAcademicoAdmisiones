
const CONFIGACADEMICO = require('./../config/databaseAcademico');
const sql = require('mssql');
const exec = async (SQL, OK = "", msgVacio = "", msgError = null) => {

    var conex = CONFIGACADEMICO;
    let conn;

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
    if (err) {
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
  
  module.exports = { exec };
  