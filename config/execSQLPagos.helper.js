
const CONFIGPAGOS = require('./databasepagos');
const sql = require('mssql');
const { Connection, Request } = require('mssql');
const poolsPagosCache = new Map();
const getPoolPagos = async (carrera) => {
    if (poolsPagosCache.has(carrera)) {
        return poolsPagosCache.get(carrera);
    }
    const configClonada = { ...CONFIGPAGOS, database: carrera };
    const pool = new sql.ConnectionPool(configClonada);
    const connectPromise = pool.connect().catch(err => {
        poolsPagosCache.delete(carrera);
        throw err;
    });
    
    poolsPagosCache.set(carrera, connectPromise);
    return connectPromise;
};

const execPagos = async (carrera, SQL, OK = "", msgVacio = "", msgError = null) => {
    let pool;
    try {
        pool = await getPoolPagos(carrera);
        const conn = pool.request();
        const result = await conn.query(SQL);
        return buildResponse(result, OK, msgVacio, msgError);
    } catch (err) {
        console.error(`Error conexion Base Pagos (Carrera: ${carrera}):`, err);
        if (err && (err.code === 'ECONNCLOSED' || err.code === 'ETIMEOUT' || err.code === 'ESOCKET')) {
            if (pool) pool.close().catch(() => {});
            poolsPagosCache.delete(carrera);
        }
        return handleDatabaseError(err, msgError);
    } 
};
  const execPagosTransaccion = async (transaction,carrera, SQL, OK = "", msgVacio = "", msgError = null) => {
    
      try {
        // Ejecuta el SQL personalizado con los parámetros
        var res=  await transaction.request().query(SQL);
        return buildResponse(res, OK, msgVacio, msgError);
      } catch (error) {
        await transaction.rollback();
        return handleDatabaseError(error, msgError);
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
        message: "Error de conexión a la base de datos Pagos. " + err,
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
   const iniciarPagosTransaccion = async  (poolejcucion) =>{
    try {
        const transaction = new sql.Transaction(poolejcucion);
        return transaction;
    } catch (error) {
        throw error;
    }
  }

    // Función para iniciar un pool de pagos
    const iniciarPagosPool = async  (carrera) =>{
      try {
        const configClonada = { ...CONFIGPAGOS, database: carrera };
        const pool = new sql.ConnectionPool(configClonada);
        return pool;
      } catch (error) {
          throw error;
      }
    }
  module.exports = { execPagos,iniciarPagosPool,iniciarPagosTransaccion,execPagosTransaccion };
  