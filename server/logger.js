const winston = require('winston');
const { logsDir } = require('./config');
const fs = require('fs');
const moment = require('moment');

const logFileName = 'server.log';
const logPath = `${logsDir}/${logFileName}`;

// Create logs dir if it's not exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const formatter = (args) => {
  const date = moment().format('D/MM/YYYY hh:mm:ss');
  let stack;

  // Вынимаем stack, потому что после json.stringify он выглядит некрасиво
  if (args.meta && args.meta.stack) {
    stack = args.meta.stack;
    delete args.meta.stack;
  }

  let msg = `${args.level} ${date} ${args.message} ${JSON.stringify(args.meta, null, 2)}`;

  if (stack) {
    msg += `\nStack: ${stack}`;
    msg += '\n============================================================\n';
  }

  return msg;
};

const transports = [
  new winston.transports.File({
    timestamp: true,
    filename: logPath,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    maxsize: 100000000,
    maxFiles: 1,
    level: 'warn',
    json: false,
    formatter,
  }),
];

if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      colorize: true,
      timestamp: true,
      handleExceptions: true,
    })
  );
}

module.exports = new (winston.Logger)({
  transports,
});
