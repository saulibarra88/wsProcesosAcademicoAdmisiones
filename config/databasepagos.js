
require('dotenv').config()
module.exports = {
  user: process.env.DB_USERPAGOS,
   password:process.env.DB_PASSWORDPAGOS,
  server:process.env.DB_SERVERPAGOS, 
  database:process.env.DB_NAMEPAGOS,
  port: parseInt(process.env.DB_PORTPAGOS, 10),
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 30000 // Reducir el tiempo de espera en milisegundos
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false,
      appName: 'SERVICIOSPROCESOSACADEMICOS',
    enableArithAbort: true,
  }
};
