import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, json } = format;

const DailyRotateTransport: DailyRotateFile = new DailyRotateFile({
    filename: 'logs/%DATE%.log',
    // datePattern: 'YYYY-MM-DD-HH-MM',
    // zippedArchive: true,
    frequency: '1d',
    // maxSize: '20m',
    // maxFiles: '14d',
});

const logger = winston.createLogger({
    level: 'silly',
    format: combine(timestamp(), json()),
    transports: [new winston.transports.Console(), DailyRotateTransport],
});

// logger.error('TMP Error', new Error('My Error'));
// logger.warn('warn');
// logger.info('info');
// logger.http('http');
// logger.verbose('verbose');
// logger.debug('debug');
// logger.silly('silly');

// const levels = {
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     verbose: 4,
//     debug: 5,
//     silly: 6,
// };

export default logger;
