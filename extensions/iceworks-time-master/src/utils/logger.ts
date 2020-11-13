import * as path from 'path';
import * as fse from 'fs-extra';
import { getLogsPath } from './storage';
import { getNowDay } from './time';
const { Logger, FileTransport, ConsoleTransport } = require('egg-logger').Logger;

function getLogPath() {
  const logsPath = getLogsPath();
  const lopPath = path.join(logsPath, getNowDay());
  if (!fse.existsSync(lopPath)) {
    fse.mkdirSync(lopPath);
  }
  return lopPath;
}

function getFileTransport() {
  return new FileTransport({
    file: path.join(getLogPath(), 'main.log'),
    level: 'INFO',
  });
}

const logger = new Logger();
logger.set('file', getFileTransport());
logger.set('console', new ConsoleTransport({
  level: 'DEBUG',
}));

/**
 * Using new file transport
 */
export function reloadLogger() {
  logger.set('file', getFileTransport());
}

export default logger;