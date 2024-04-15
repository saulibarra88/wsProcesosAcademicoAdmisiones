
//SERVIDOR DE PRODUCCION
/*
module.exports = {
    user: "sa",
     password: "BDSqlAdmin111",
    server: "172.17.102.218",    
    database: "SistemaAcademico",
    portNumber: "1435",
    pool: {
      max: 10000,
      min: 0,
      idleTimeoutMillis: 60000,
      idleTimeoutMillis: 30000,  // Reducir el tiempo de espera en milisegundos
      acquireTimeoutMillis: 30000  // Agregar tiempo de espera para adquirir una conexión
    },
    options: {
      encrypt: false, // for azure
      trustServerCertificate: false // change to true for local dev / self-signed certs
    }
};
*/

//SERVIDOR DE PRUEBA


module.exports = {
  user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
  server:process.env.DB_SERVER,
  database:process.env.DB_NAMESISTEMAACADEMICO,
  portNumber:process.env.DB_USERCENTRALIZADA,
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


