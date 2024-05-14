
//SERVIDOR DE PRODUCCION

require('dotenv').config()

module.exports = {
  user: process.env.DB_USERSISTEMAACADEMICO,
   password: process.env.DB_PASSWORDSISTEMAACADEMICO,
  server:process.env.DB_SERVERSISTEMAACADEMICO,
  database:process.env.DB_NAMESISTEMAACADEMICO,
  portNumber:process.env.DB_PORTSISTEMAACADEMICO,
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


