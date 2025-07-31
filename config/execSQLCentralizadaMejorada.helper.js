
const CONFIGCENTRALIZADA = require('./databaseCentral');
const { Client } = require('pg');
const execCentralizadaMejorada = async (SQL, OK = "", msgVacio = "", msgError = null) => {

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

  };

  const execCentralizadaTransaccionMejorada = async (transaction,carrera, SQL, OK = "", msgVacio = "", msgError = null) => {
    try {
      // Ejecuta el SQL personalizado con los parámetros

      var res=  await transaction.request().query(SQL);
      return buildResponse(res, OK, msgVacio, msgError);
    } catch (error) {
      await transaction.rollback();
      return handleDatabaseError(error, msgError);
      throw error;
    
    }
    }
  
  const buildResponse = (res, OK, msgVacio, msgError) => {
    const count = res.rowCount ==undefined?0:res.rowCount;
    const message = res.rowCount  > 0 ? OK : msgVacio;
    const data = res.rows ?? [];
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
  
  module.exports = { execCentralizadaMejorada,execCentralizadaTransaccionMejorada };
  