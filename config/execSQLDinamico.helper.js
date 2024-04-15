
const CONFIGACADEMICO = require('./../config/databaseDinamico');
const sql = require('mssql');
const { Connection, Request } = require('mssql');

const execDinamico = async (carrera, SQL, OK = "", msgVacio = "", msgError = null) => {

  var conex = CONFIGACADEMICO;
  conex.database = carrera;
  console.log("*********************************************************************")
  console.log("conexxion Dinamica:", conex.database)
  console.log("SQL:", SQL)

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

  /*
      try {
        // Crea una nueva instancia de la conexión a la base de datos
        const pool = await sql.connect(conex);
    
        // Inicia una transacción
        const transaction = new sql.Transaction(pool);
    
        // Inicia la transacción
        await transaction.begin();
    
        try {
          // Ejecuta el SQL personalizado con los parámetros
          const request = new sql.Request(transaction);
    
          var res=  await request.query(SQL);
        
          // Confirma la transacción
          await transaction.commit();
    
          console.log('Transacción exitosa');
          return buildResponse(res, OK, msgVacio, msgError);
        } catch (error) {
          // Si ocurre un error, deshace la transacción
          await transaction.rollback();
          return handleDatabaseError(error, msgError);
          throw error;
        }
      } catch (error) {
        console.error('Error de conexión:', error);
    
      } finally {
        // Cierra la conexión
        await sql.close();
      }
  */
  /*   let conn;

     try {
       await sql.close();
       if (conn) {
         await conn.close();
       }
       conn = await sql.connect(conex);
       const req = await conn.request();
       const res = await req.query(SQL);
       return buildResponse(res, OK, msgVacio, msgError);
     } catch (err) {
       console.log("Error conexion Base Academico:" + err);
       return handleDatabaseError(err, msgError);
     } finally {
       if (conn) {
         await conn.close();
       }
     }*/
};
const execDinamicoTransaccion = async (transaction,carrera, SQL, OK = "", msgVacio = "", msgError = null) => {
  try {
    // Ejecuta el SQL personalizado con los parámetros
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

module.exports = { execDinamico,execDinamicoTransaccion };
