
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
  const connectPromise = pool.connect();
  poolsCache.set(carrera, connectPromise);
  return connectPromise;
};
const execMaster = async (carrera, SQL, OK = "", msgVacio = "", msgError = null) => {
  try {
    const pool = await getPoolParaCarrera(carrera);
    const conn = pool.request();
    const result = await conn.query(SQL);
    return buildResponse(result, OK, msgVacio, msgError);
  } catch (err) {
    console.error(`Error conexion Base Master (Carrera: ${carrera}):`, err);
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
    console.log("Error conexion Base Master:" + err);
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
const iniciarMasterTransaccion = async (poolejcucion) => {
  try {
    const sql = require("mssql");
    const transaction = new sql.Transaction(poolejcucion);
    return transaction;

  } catch (error) {
    throw error;
  }
}

// Función para iniciar una transacción
const iniciarMasterPool = async (carrera) => {
  try {
    const sql = require("mssql");
    var conex = CONFIGMASTER;
    var resultado = false;
    conex.database = carrera;
    const pool = new sql.ConnectionPool(conex);
    return pool;
  } catch (error) {
    throw error;
  }
}
module.exports = { execMaster, execMasterTransaccion, iniciarMasterTransaccion, iniciarMasterPool };
