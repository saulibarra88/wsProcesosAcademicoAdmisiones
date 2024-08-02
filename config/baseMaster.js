require('dotenv').config()



//SERVIDOR DE PRODUCCION
module.exports = {
  "user":process.env.DB_USERMASTER,
  "password": process.env.DB_PASSWORDMASTER,
  "server": process.env.DB_SERVERMASTER,
  "database":process.env.DB_NAMEMASTER,
  "portNumber": process.env.DB_PORTMASTER,
  pool: {
    max: 9000000,
    min: 0,
    idleTimeoutMillis: 600,  // Reducir el tiempo de espera en milisegundos
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false
  }
};




