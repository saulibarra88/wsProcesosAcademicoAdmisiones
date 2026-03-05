const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors, colorize } = format;

// Colorizar toda la línea del log
const allColorizer = colorize({ all: true });
// Formato personalizado del log
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${level}] [${timestamp}]  : ${message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
      errors({ stack: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    ),
    transports: [
      new transports.Console({
        format: combine(
          allColorizer,   // << Coloriza todo
          logFormat
        )
      }),
  
      // Archivos (sin color)
      new transports.File({ filename: 'logs/error.log', level: 'error' }),
      new transports.File({ filename: 'logs/warn.log', level: 'warn' }),
      new transports.File({ filename: 'logs/info.log', level: 'info' })
    ],
    exitOnError: false,
  });

// Ejemplo de uso
//logger.info('Se inició el proceso ListadoRolActivos');
//logger.warn('Advertencia: estado inválido');
//logger.error('Error grave: base de datos no disponible', { extraData: 'más info si quieres' });

module.exports = logger;