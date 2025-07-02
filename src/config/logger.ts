import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;


const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
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
        colorize(), 
        logFormat
      ),
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    }),
  ],
  exitOnError: false,
});


logger.exceptions.handle(
  new transports.Console({
    format: combine(
      colorize(),
      logFormat
    )
  })
);

export default logger;