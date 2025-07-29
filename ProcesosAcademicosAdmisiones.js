const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const sql = require('mssql');
var fs = require('fs');
var http = require('http');
var https = require('https');
const procesoMigracion = require('./rutas/ProcesosMigracionNivelacion');
const ProcesoAcademico = require('./rutas/ProcesoNotasAcademico');
const procesosAdmisiones = require('./rutas/rutaadmisiones');
const rutaAcademicoNotas = require('./rutas/rutaAcademicoNotas');
const rutaprocesos = require('./rutas/rutaprocesos');
const rutagraficos = require('./rutas/rutaGraficos');
const rutaadministrativa = require('./rutas/rutaadministrativo');
const rutacarrera = require('./rutas/rutaCarreras');
const rutascript = require('./rutas/rutascriptgeneralescarreras');
const rutasalta = require('./rutas/rutaaltatransaccionalidad');
const rutamovilidad = require('./rutas/rutamovilidad');
const rutamovilidadconfiguraciones = require('./rutas/rutamovilidadconfiguraciones');

const url='/wsprocesosadmisiones'
//Port Number
const port = 8119;


//Cors Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));//
//app.use(helmet());
//app.use(limiter);




//Rutas de Servicios Web
app.use(url+'/rutaadmision',procesosAdmisiones);
app.use(url+'/rutaprocesos',rutaprocesos);
app.use(url+'/rutaacademiconotas',rutaAcademicoNotas);
app.use(url+'/rutagraficos',rutagraficos);
app.use(url+'/rutaadministrativa',rutaadministrativa);
app.use(url+'/rutacarrera',rutacarrera);
app.use(url+'/rutascript',rutascript);
app.use(url+'/rutasalta',rutasalta);
app.use(url+'/rutamovilidad',rutamovilidad);
app.use(url+'/rutamovilidadconfiguraciones',rutamovilidadconfiguraciones);


//Index Router
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

var options = {
     key: fs.readFileSync('Certificados/STAR_espoch_edu_ec.key'),
    cert: fs.readFileSync('Certificados/STAR_espoch_edu_ec.crt'),
    ca: fs.readFileSync('Certificados/STAR_espoch_edu_ec.crt')
};

app.use(function (req, resp, next) {
    if (req.headers['x-forwarded-proto'] == 'http') {
        return resp.redirect(301, 'https://' + req.headers.host + '/');
    } else {
        return next();
    }
});


https.createServer(options, app).listen(port,()=>{
    console.log("Servicios Procesos Academicos levantados exitosamente: ",port)
});