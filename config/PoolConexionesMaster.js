const sql = require('mssql');
const CONFIG = require('./../config/baseMaster');


// Crear un pool de conexiones
const pool = new sql.ConnectionPool(CONFIG);
const poolConnect = pool.connect();

// Manejar errores de conexión
poolConnect.catch(err => {
  console.error('Error al conectar al pool de conexiones', err);
});

// Exportar el pool de conexiones
module.exports = {
  sql,
  poolConnect,
};