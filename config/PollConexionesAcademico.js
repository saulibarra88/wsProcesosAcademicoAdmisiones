const sql = require('mssql');
const CONFIGACADEMICO = require('./../config/databaseAcademico');



const conPoolAcademico = new sql.ConnectionPool(CONFIGACADEMICO);
const reqAcademico = new sql.Request(conPoolAcademico);


const connectionAcademico = async (sentencia, accion, callback) => {
  await conPoolAcademico
    .connect()
    .then(async () => {
      await reqAcademico.query(sentencia, (err, recordset) => {
        if (err) {
          conPoolAcademico.close();
          accion ? callback(null, false) : callback(null, false);
      
        } else {
          conPoolAcademico.close();
          accion ? callback(true, recordset) : callback(true, recordset);
        }
      });
    })
    .catch((err) => {
      console.log("Error: "+err)
      conPoolAcademico.close();
      accion ? callback(null, false) : callback(null, false);
    
    })
    
    ;
};






// Exportar el pool de conexiones
module.exports = {
  connectionAcademico
};