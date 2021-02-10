import * as path from 'path';
import * as fse from 'fs-extra';
import { getLogsPath } from '../storage';
import { getNowDay } from '../time';
import FileTransport from './fileTransport';

const orderBy = require('lodash.orderby');
const { Logger, ConsoleTransport } = require('egg-logger');
const mkdirp = require('mkdirp');

function getLogPath() {
  const logsPath = getLogsPath();
  const lopPath = path.join(logsPath, getNowDay());
  if (!fse.existsSync(lopPath)) {
    mkdirp.sync(lopPath);
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

async function getLogDaysDirs() {
  const logsPath = getLogsPath();
  const fileNames = await fse.readdir(logsPath);
  const logDaysDirs = orderBy((await Promise.all(fileNames.map(async (fileName) => {
    const filePath = path.join(logsPath, fileName);
    const fileIsExists = await fse.pathExists(filePath);

    // TODO more rigorous
    return fileIsExists ?
      ((await fse.stat(filePath)).isDirectory() ? fileName : undefined) :
      undefined;
  }))).filter((isDirectory) => isDirectory));
  return logDaysDirs;
}

export async function checkLogsIsLimited() {
  const logStorageLimit = 30;
  const logDaysDirs = await getLogDaysDirs();
  const logStorageLength = logDaysDirs.length;
  const excess = logStorageLength - logStorageLimit;
  const isExcess = excess > 0;

  logger.info(`[logger][checkLogsIsLimited], logStorageLength(${logStorageLength}), logStorageLimit(${logStorageLimit}), isExcess(${isExcess})`);

  // over the limit, delete the earlier storage
  if (isExcess) {
    const logsPath = getLogsPath();
    await Promise.all(logDaysDirs.splice(0, excess).map(async (dayDir) => {
      await fse.remove(path.join(logsPath, dayDir));
    }));
  }
}

export default logger;
