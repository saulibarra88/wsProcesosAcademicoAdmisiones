const sql = require("mssql");
const CONFIGACADEMICO = require('./../config/');



const sqlConfig = {
  user: CONFIGACADEMICO.user,
  password:CONFIGACADEMICO.password,
  database:CONFIGACADEMICO.database,
  server: CONFIGACADEMICO.server,
  pool: {
   max: 300,
    min: 10,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true,
    appName: 'SERVICIOSPROCESOSACADEMICOS',
    enableArithAbort: true,
  }
};

class DatabaseSingleton {
  constructor() {
    if (!DatabaseSingleton.instance) {
      this.pool = new sql.ConnectionPool(sqlConfig);
      DatabaseSingleton.instance = this;
    }
    return DatabaseSingleton.instance;
  }

  async connect() {
    try {
      
      await this.pool.connect();

    } catch (error) {
      console.log(
        `Error conectando a la base de datos SQL SERVER ${sqlConfig.database}, ${error}`
      );
      await this.pool.close();
    }
    return this.pool;
  }
}

module.exports = { DatabaseSingleton };
