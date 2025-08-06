
require('dotenv').config()
module.exports = {
  user: process.env.DB_USERSISTEMAACADEMICO,
   password:process.env.DB_PASSWORDSISTEMAACADEMICO,
  server:process.env.DB_SERVERSISTEMAACADEMICO, 
  database:process.env.DB_NAMESISTEMAACADEMICO,
  portNumber:process.env.DB_PORTSISTEMAACADEMICO,
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
  }
};

