require('dotenv').config()




//SERVIDOR DE PRODUCCION
module.exports = {
  "user":process.env.DB_USER,
  "password": process.env.DB_PASSWORD,
  "server": process.env.DB_SERVER,
  "database":process.env.DB_NAMEMASTER,
  "portNumber": process.env.DB_PORT,
  pool: {
    max: 100000,
    min: 0,
    idleTimeoutMillis: 30000,  // Reducir el tiempo de espera en milisegundos
    acquireTimeoutMillis: 30000,  // Agregar tiempo de espera para adquirir una conexión
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false,
    requestTimeout: 60000, // Reducir el tiempo de espera de la consulta
  }
};




