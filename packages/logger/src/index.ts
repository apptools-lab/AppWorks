import * as path from 'path';
import { storagePath } from '@iceworks/storage';
import FileTransport from './fileTransport';

const { Logger, ConsoleTransport } = require('egg-logger');

function getLogger(namespace: string) {
  const logger = new Logger();
  const file = path.join(storagePath, 'logs', `${namespace}.log`);
  logger.set('file', new FileTransport({
    file,
    level: 'INFO',
  }));
  logger.set('console', new ConsoleTransport({
    level: 'DEBUG',
  }));

  return logger;
}

export default getLogger('TimeMaster');
