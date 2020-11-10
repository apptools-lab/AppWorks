import * as fse from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { getDataFromSettingJson } from '@iceworks/common-service';
import { getNowDay } from './time';

import orderBy = require('lodash.orderby');

const CONFIGURATION_KEY_TIME_STORAGE_LIMIT = 'timeLimit';
const DEFAULT_TIME_STORAGE_LIMIT = 7;

export function getAppDataDirPath() {
  const homedir = os.homedir();
  const appDataDir = path.join(homedir, '.iceworks', 'TimeMaster');
  if (!fse.existsSync(appDataDir)) {
    fse.mkdirSync(appDataDir);
  }
  return appDataDir;
}

export function getAppDataDayDirPath(day?: string) {
  const appDataDir = getAppDataDirPath();
  const appDataDayDir = path.join(appDataDir, day || getNowDay());
  if (!fse.existsSync(appDataDayDir)) {
    fse.mkdirSync(appDataDayDir);
  }
  return appDataDayDir;
}

export async function getStorageDirs() {
  const appDataDir = getAppDataDirPath();
  const fileNames = await fse.readdir(appDataDir);
  const dayDirPaths = orderBy((await Promise.all(fileNames.map(async (fileName) => {
    const filePath = path.join(appDataDir, fileName);
    const fileStat = await fse.stat(filePath);

    // TODO more rigorous
    return fileStat.isDirectory() ? fileName : undefined;
  }))).filter((isDirectory) => isDirectory));
  return dayDirPaths;
}

export async function checkStorageIsLimited() {
  const timeStorageLimit = getDataFromSettingJson(CONFIGURATION_KEY_TIME_STORAGE_LIMIT) || DEFAULT_TIME_STORAGE_LIMIT;
  const storageDirs = await getStorageDirs();
  const excess = storageDirs.length - timeStorageLimit;

  // over the limit, delete the earlier storage
  if (excess) {
    const appDataDir = getAppDataDirPath();
    await Promise.all(storageDirs.splice(0, excess).map(async (storageDir) => {
      await fse.remove(path.join(appDataDir, storageDir));
    }));
  }
}
