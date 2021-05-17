const path = require('path');
const { Logger, ConsoleTransport } = require('egg-logger');
const { storagePath } = require('@appworks/storage');
const FileTransport = require('./fileTransport');

function createLogger(namespace) {
  const logger = new Logger();
  logger.set('file', new FileTransport({
    file: path.join(storagePath, 'logs', `${namespace}.log`),
    level: 'INFO',
  }));
  logger.set('console', new ConsoleTransport({
    level: 'DEBUG',
  }));

  return logger;
}

exports.default = createLogger;
