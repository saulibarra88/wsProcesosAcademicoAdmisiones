
//SERVIDOR DE PRODUCCION

require('dotenv').config()

module.exports = {
    user: process.env.DB_USERCENTRALIZADA,
    host: process.env.DB_SERVERCENTRALIZADA,
    database: process.env.DB_NAMECENTRALIZADA,
    password: process.env.DB_PASSWORDCENTRALIZADA,
    port: process.env.DB_PORTCENTRALIZADA,
};