import * as fse from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { getDataFromSettingJson } from '@iceworks/common-service';
import { getNowDay } from './time';
import logger from './logger';

const orderBy = require('lodash.orderby');
const mkdirp = require('mkdirp');

const CONFIGURATION_KEY_TIME_STORAGE_LIMIT = 'timeLimit';
const DEFAULT_TIME_STORAGE_LIMIT = 7;

const homedir = os.homedir();
const iceworksStoragePath = path.join(homedir, '.iceworks');
const EXTENSION_TAG = 'TimeMaster';

export function getStoragePath() {
  const storagePath = path.join(iceworksStoragePath, EXTENSION_TAG);
  if (!fse.existsSync(storagePath)) {
    mkdirp.sync(storagePath);
  }
  return storagePath;
}

export function getLogsPath() {
  const logsPath = path.join(iceworksStoragePath, 'logs', EXTENSION_TAG);
  if (!fse.existsSync(logsPath)) {
    mkdirp.sync(logsPath);
  }
  return logsPath;
}

export function getStorageDaysPath() {
  const storagePath = getStoragePath();
  const storageDaysPath = path.join(storagePath, 'days');
  if (!fse.existsSync(storageDaysPath)) {
    mkdirp.sync(storageDaysPath);
  }
  return storageDaysPath;
}

export function getStoragePayloadsPath() {
  const storagePath = getStoragePath();
  const storagePayloadsPath = path.join(storagePath, 'payloads');
  if (!fse.existsSync(storagePayloadsPath)) {
    mkdirp.sync(storagePayloadsPath);
  }
  return storagePayloadsPath;
}

export function getStorageReportsPath() {
  const storagePath = getStoragePath();
  const storagePayloadsPath = path.join(storagePath, 'reports');
  if (!fse.existsSync(storagePayloadsPath)) {
    mkdirp.sync(storagePayloadsPath);
  }
  return storagePayloadsPath;
}

export function getStorageDayPath(day?: string) {
  const storageDaysPath = getStorageDaysPath();
  const storageDayPath = path.join(storageDaysPath, day || getNowDay());
  if (!fse.existsSync(storageDayPath)) {
    mkdirp.sync(storageDayPath);
  }
  return storageDayPath;
}

export async function getStorageDaysDirs() {
  const storageDaysPath = getStorageDaysPath();
  const fileNames = await fse.readdir(storageDaysPath);
  const dayDirPaths = orderBy((await Promise.all(fileNames.map(async (fileName) => {
    const filePath = path.join(storageDaysPath, fileName);
    const fileStat = await fse.stat(filePath);

    // TODO more rigorous
    return fileStat.isDirectory() ? fileName : undefined;
  }))).filter((isDirectory) => isDirectory));
  return dayDirPaths;
}

export async function checkStorageDaysIsLimited() {
  const timeStorageLimit = getDataFromSettingJson(CONFIGURATION_KEY_TIME_STORAGE_LIMIT) || DEFAULT_TIME_STORAGE_LIMIT;
  const storageDaysDirs = await getStorageDaysDirs();
  const timeStorageLength = storageDaysDirs.length;
  const excess = timeStorageLength - timeStorageLimit > 0;

  logger.info(`[storage][checkStorageDaysIsLimited], timeStorageLength(${timeStorageLength}), timeStorageLimit(${timeStorageLimit})`);

  // over the limit, delete the earlier storage
  if (excess) {
    const storageDaysPath = getStorageDaysPath();
    await Promise.all(storageDaysDirs.splice(0, excess).map(async (dayDir) => {
      await fse.remove(path.join(storageDaysPath, dayDir));
    }));
  }
}
