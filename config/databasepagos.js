
require('dotenv').config()
module.exports = {
  user: process.env.DB_USERPAGOS,
   password:process.env.DB_PASSWORDPAGOS,
  server:process.env.DB_SERVERPAGOS, 
  database:process.env.DB_NAMEPAGOS,
  portNumber:process.env.DB_PORTPAGOS,
  pool: {
   max: 300,
    min: 10,
    idleTimeoutMillis: 30000 // Reducir el tiempo de espera en milisegundos
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false,
      appName: 'SERVICIOSPROCESOSACADEMICOS',
    enableArithAbort: true,
  }
};
