require('dotenv').config()



//SERVIDOR DE PRODUCCION
module.exports = {
  "user":process.env.DB_USERMASTER,
  "password": process.env.DB_PASSWORDMASTER,
  "server": process.env.DB_SERVERMASTER,
  "database":process.env.DB_NAMEMASTER,
  "portNumber": process.env.DB_PORTMASTER,
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




