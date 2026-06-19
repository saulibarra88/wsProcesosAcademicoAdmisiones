const {  execDinamico,execDinamicoTransaccion} = require("../config/execSQLDinamico.helper");
const {  execMaster,execMasterTransaccion} = require("../config/execSQLMaster.helper");
const CONFIGMASTER = require('../config/baseMaster');
const CONFIGACADEMICO = require('../config/databaseDinamico');

const sql = require("mssql");
var os = require('os');


