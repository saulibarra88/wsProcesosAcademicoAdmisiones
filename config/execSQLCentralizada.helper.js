
const CONFIGCENTRALIZADA = require('./../config/databaseCentral');
const { Client } = require('pg');
const execCentralizada = async (SQL, OK = "", msgVacio = "", msgError = null) => {

    var conex = CONFIGCENTRALIZADA;
    var client = new Client(conex);
  
    try {
       
        client.connect();
      //  const client = await Client.connect(CONFIGCENTRALIZADA);
        const result = await client.query(SQL);
      return buildResponse(result, OK, msgVacio, msgError);
    } catch (err) {
      console.log("Error conexion Base Centralizada:" + err);
      return handleDatabaseError(err, msgError);
    } finally {
      if (client) {
        await client.end();
      }
    }
   /* let conn;

    try {
      await sql.close();
      conn = await sql.connect(conex);
      const req = await conn.request();
      const res = await req.query(SQL);
      return buildResponse(res, OK, msgVacio, msgError);
    } catch (err) {
      await conn.close();
      console.log("Error conexion Base Academico:" + err);
      return handleDatabaseError(err, msgError);
    } finally {
      if (conn) {
        await conn.close();
      }
    }*/
  };
  
  const buildResponse = (res, OK, msgVacio, msgError) => {
    const count = res.rowCount ==undefined?0:res.rowCount.length;
    const message = res.rowCount  > 0 ? OK : msgVacio;
    //const data = multiple ? res.rows : res.rows[0] ?? [];
    const data = res.rows[0] ?? [];
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
  
  module.exports = { execCentralizada };
  