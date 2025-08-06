require('dotenv').config()



//SERVIDOR DE PRODUCCION
module.exports = {
  "user":process.env.DB_USERMASTER,
  "password": process.env.DB_PASSWORDMASTER,
  "server": process.env.DB_SERVERMASTER,
  "database":process.env.DB_NAMEMASTER,
  "portNumber": process.env.DB_PORTMASTER,
  pool: {
   max: 300000,
    min: 10,
    idleTimeoutMillis: 30000 // Reducir el tiempo de espera en milisegundos
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false,
    appName: 'SERVICIOSPROCESOSACADEMICOS',
    enableArithAbort: true,
    requestTimeout: 30000, // 30 segundos
        connectionTimeout: 30000 // 30 segundos
  }
};




