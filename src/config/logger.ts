import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info', // Set default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Include stack trace for errors
    format.splat(),
    format.json() // Output logs in JSON format
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to error.log
    new transports.File({ filename: 'logs/combined.log' }) // Log all levels to combined.log
  ]
});

export default logger;