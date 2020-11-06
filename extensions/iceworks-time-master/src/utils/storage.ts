import * as fse from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { getDataFromSettingJson } from '@iceworks/common-service';
import { getNowDay } from './time';

import orderBy = require('lodash.orderby');

const CONFIGURATION_KEY_TIME_STORAGE_LIMIT = 'timeLimit';
const DEFAULT_TIME_STORAGE_LIMIT = 7;

export function getAppDataDir() {
  const homedir = os.homedir();
  const appDataDir = path.join(homedir, '.iceworks', 'TimeMaster');
  if (!fse.existsSync(appDataDir)) {
    fse.mkdirSync(appDataDir);
  }
  return appDataDir;
}

export function getAppDataDayDir(day?: string) {
  const appDataDir = getAppDataDir();
  const appDataDayDir = path.join(appDataDir, day || getNowDay());
  if (!fse.existsSync(appDataDayDir)) {
    fse.mkdirSync(appDataDayDir);
  }
  return appDataDayDir;
}

export async function getStorageDirPaths() {
  const appDataDir = getAppDataDir();
  const fileNames = await fse.readdir(appDataDir);
  const dayDirPaths = orderBy((await Promise.all(fileNames.map(async (fileName) => {
    const filePath = path.join(appDataDir, fileName);
    const fileStat = await fse.stat(filePath);

    // TODO more rigorous
    return fileStat.isDirectory() ? filePath : undefined;
  }))).filter((isDirectory) => isDirectory));
  return dayDirPaths;
}

export async function checkStorageIsLimited() {
  const timeStorageLimit = getDataFromSettingJson(CONFIGURATION_KEY_TIME_STORAGE_LIMIT) || DEFAULT_TIME_STORAGE_LIMIT;
  const storageDirPaths = await getStorageDirPaths();
  const excess = storageDirPaths.length - timeStorageLimit;

  // over the limit, delete the earlier storage
  if (excess) {
    await Promise.all(storageDirPaths.splice(0, excess).map(async (storageDirPath) => {
      await fse.remove(storageDirPath);
    }));
  }
}
