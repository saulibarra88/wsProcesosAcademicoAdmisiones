
const CONFIGMASTER = require('./../config/baseMaster');
const sql = require('mssql');
const { Connection, Request } = require('mssql');


const poolsCache = new Map();
const getPoolParaCarrera = async (carrera) => {
  if (poolsCache.has(carrera)) {
    return poolsCache.get(carrera);
  }
  const configClonada = { ...CONFIGMASTER, database: carrera };
  const pool = new sql.ConnectionPool(configClonada);
  const connectPromise = pool.connect().catch(err => {
    poolsCache.delete(carrera);
    throw err;
  });
  poolsCache.set(carrera, connectPromise);
  return connectPromise;
};
const execMaster = async (carrera, SQL, OK = "", msgVacio = "", msgError = null) => {
  let pool;
  try {
    pool = await getPoolParaCarrera(carrera);
    const conn = pool.request();
    const result = await conn.query(SQL);
    return buildResponse(result, OK, msgVacio, msgError);
  } catch (err) {
    console.error(`Error conexion Base Master (Carrera: ${carrera}):`, err);
    if (err && (err.code === 'ECONNCLOSED' || err.code === 'ETIMEOUT' || err.code === 'ESOCKET')) {
      if (pool) pool.close().catch(() => {});
      poolsCache.delete(carrera);
    }
    return handleDatabaseError(err, msgError);
  }
};

const execMasterTransaccion = async (transaction, carrera, SQL, OK = "", msgVacio = "", msgError = null) => {

  try {
    // Ejecuta el SQL personalizado con los parámetros
    var res = await transaction.request().query(SQL);
    return buildResponse(res, OK, msgVacio, msgError);
  } catch (error) {
    await transaction.rollback();
    return handleDatabaseError(error, msgError);
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
const iniciarMasterTransaccion = async (poolejcucion) => {
  try {
    const transaction = new sql.Transaction(poolejcucion);
    return transaction;
  } catch (error) {
    throw error;
  }
}

// Función para iniciar un pool master
const iniciarMasterPool = async (carrera) => {
  try {
    const configClonada = { ...CONFIGMASTER, database: carrera };
    const pool = new sql.ConnectionPool(configClonada);
    return pool;
  } catch (error) {
    throw error;
  }
}
module.exports = { execMaster, execMasterTransaccion, iniciarMasterTransaccion, iniciarMasterPool };
