const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Procesos Académicos y Admisiones',
      version: '1.0.0',
      description: 'Documentación de la API para la gestión de procesos académicos, admisiones, movilidad y reportes.',
    },
    servers: [
      {
        url: '/wsprocesosadmisiones',
        description: 'Servidor Principal (Prefijo base)'
      }
    ],
  },
  apis: ['./swagger/documentacion/*.js'], // Escanea los archivos de documentación independientes
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
