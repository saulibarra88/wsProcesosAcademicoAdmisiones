
const CONFIGACADEMICO = require('./../config/databaseDinamico');
const sql = require('mssql');
const { Connection, Request } = require('mssql');

// Caché exclusivo para bases "Académicas"
const poolsAcademicoCache = new Map();
const getPoolAcademico = async (carrera) => {
    if (poolsAcademicoCache.has(carrera)) {
        try {
            const pool = await poolsAcademicoCache.get(carrera);
            if (pool && pool.connected) {
                return pool;
            }
        } catch (e) {
            // Si la promesa falló, limpiamos el caché
        }
        poolsAcademicoCache.delete(carrera);
    }
    const configClonada = { ...CONFIGACADEMICO, database: carrera };
    const pool = new sql.ConnectionPool(configClonada);
    const connectPromise = pool.connect().catch(err => {
        poolsAcademicoCache.delete(carrera);
        throw err;
    });
    
    poolsAcademicoCache.set(carrera, connectPromise);
    return connectPromise;
};
const execDinamico = async (carrera, SQL, OK = "", msgVacio = "", msgError = null, isRetry = false) => {
    let pool;
    try {
        pool = await getPoolAcademico(carrera);
        const conn = pool.request();
        const result = await conn.query(SQL);
        return buildResponse(result, OK, msgVacio, msgError);
    } catch (err) {
        console.error(`Error conexion Base Academico (Carrera: ${carrera}):`, err);
        const isConnErr = err && (
            err.code === 'ECONNCLOSED' || 
            err.code === 'ENOTOPEN' || 
            err.code === 'ETIMEOUT' || 
            err.code === 'ESOCKET' || 
            (err.message && err.message.toLowerCase().includes('closed'))
        );
        if (isConnErr) {
            if (pool) pool.close().catch(() => {});
            poolsAcademicoCache.delete(carrera);
            if (!isRetry) {
                console.warn(`[RETRY] Reintentando consulta en Base Academico para Carrera: ${carrera}`);
                return execDinamico(carrera, SQL, OK, msgVacio, msgError, true);
            }
        }
        return handleDatabaseError(err, msgError);
    } 
};


const execDinamicoTransaccion = async (transaction,carrera, SQL, OK = "", msgVacio = "", msgError = null) => {
  try {
    var res=  await transaction.request().query(SQL);
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
  const iniciarDinamicoTransaccion = async  (poolejcucion) =>{
    try {
        const transaction = new sql.Transaction(poolejcucion);
        return transaction;
    } catch (error) {
        throw error;
    }
  }

    // Función para iniciar un pool dinámico
    const iniciarDinamicoPool = async  (carrera) =>{
      try {
        const configClonada = { ...CONFIGACADEMICO, database: carrera };
        const pool = new sql.ConnectionPool(configClonada);
        return pool;
      } catch (error) {
          throw error;
      }
    }

module.exports = { execDinamico,execDinamicoTransaccion,iniciarDinamicoTransaccion,iniciarDinamicoPool };
