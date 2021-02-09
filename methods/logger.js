const winston = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp,  printf } = winston.format;

const transport = new winston.transports.DailyRotateFile({
    filename: 'application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    dirname: './log/',
    maxSize: '5m'
});

transport.on('rotate', function(oldFilename, newFilename) {
    console.log('new log file created');
});

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

const logger = winston.createLogger({
    format: combine(timestamp(), myFormat),
    transports: [transport]
});

module.exports = logger;
