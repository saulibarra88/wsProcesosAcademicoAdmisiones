
const CONFIGCENTRALIZADA = require('./../config/databaseCentral');
const { Client } = require('pg');
const execCentralizada = async (SQL, OK = "", msgVacio = "", msgError = null) => {
    // Usar const en lugar de var
    const conex = CONFIGCENTRALIZADA;
    const client = new Client(conex);
  
    try {
        // 1. FUNDAMENTAL: Esperar a que la conexión se establezca
        await client.connect(); 
        
        const result = await client.query(SQL);
        return buildResponse(result, OK, msgVacio, msgError);
        
    } catch (err) {
        // Usar console.error para mejor trazabilidad en logs
        console.error("Error conexion Base Centralizada:", err); 
        return handleDatabaseError(err, msgError);
        
    } finally {
        // Asegurarnos de que cerramos la conexión de forma segura
        if (client) {
            try {
                await client.end();
            } catch (closeErr) {
                // Capturamos cualquier error al intentar cerrar para que no rompa el flujo
                console.error("Error al intentar cerrar la conexión Base Centralizada:", closeErr);
            }
        }
    }
};


  const execCentralizadaTransaccion = async (transaction,carrera, SQL, OK = "", msgVacio = "", msgError = null) => {
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
  
    const buildResponseMejroada = (res, OK, msgVacio, msgError) => {
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
  
  module.exports = { execCentralizada,execCentralizadaTransaccion, };
  