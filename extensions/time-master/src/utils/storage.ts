import * as fse from 'fs-extra';
import * as path from 'path';
import { storagePath as iceworksStoragePath } from '@appworks/storage';
import { getDataFromSettingJson } from '@appworks/common-service';
import { getNowDay } from './day';

const orderBy = require('lodash.orderby');
const mkdirp = require('mkdirp');

const CONFIGURATION_KEY_TIME_STORAGE_LIMIT = 'timeLimit';
const DEFAULT_TIME_STORAGE_LIMIT = 7;

const EXTENSION_TAG = 'TimeMaster';

export function getStoragePath() {
  const storagePath = path.join(iceworksStoragePath, EXTENSION_TAG);
  if (!fse.existsSync(storagePath)) {
    mkdirp.sync(storagePath);
  }
  return storagePath;
}

export function getStorageDaysPath() {
  const storagePath = getStoragePath();
  const storageDaysPath = path.join(storagePath, 'days');
  if (!fse.existsSync(storageDaysPath)) {
    mkdirp.sync(storageDaysPath);
  }
  return storageDaysPath;
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
    const fileIsExists = await fse.pathExists(filePath);

    // TODO more rigorous
    if (fileIsExists) {
      return (await fse.stat(filePath)).isDirectory() ? fileName : undefined;
    }
  }))).filter((isDirectory) => isDirectory));
  return dayDirPaths;
}

export async function checkStorageDaysIsLimited() {
  const timeStorageLimit = getDataFromSettingJson(CONFIGURATION_KEY_TIME_STORAGE_LIMIT) || DEFAULT_TIME_STORAGE_LIMIT;
  const storageDaysDirs = await getStorageDaysDirs();
  const timeStorageLength = storageDaysDirs.length;
  const excess = timeStorageLength - timeStorageLimit;
  const isExcess = excess > 0;

  // over the limit, delete the earlier storage
  if (isExcess) {
    const storageDaysPath = getStorageDaysPath();
    await Promise.all(storageDaysDirs.splice(0, excess).map(async (dayDir) => {
      const dayPath = path.join(storageDaysPath, dayDir);
      if (await fse.pathExists(dayPath)) {
        await fse.remove(dayPath);
      }
    }));
  }
}
