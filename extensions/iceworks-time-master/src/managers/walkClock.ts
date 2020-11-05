import * as fse from 'fs-extra';
import * as path from 'path';
import { getDataFromSettingJson } from '@iceworks/common-service';
import { setNowDay, isNewDay, getAppDataDir, logIt } from '../utils/common';
import { ONE_MIN_MILLISECONDS } from '../constants';
import { sendRecords } from '../utils/recorder';
import orderBy = require('lodash.orderby');

const CONFIGURATION_KEY_TIME_STORAGE_LIMIT = 'timeLimit';
const DEFAULT_TIME_STORAGE_LIMIT = 7;

async function getStorageDirPaths() {
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

async function checkStorageIsLimited() {
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

export async function checkMidnight() {
  if (isNewDay()) {
    await sendRecords();
    setNowDay();
    checkStorageIsLimited().catch((e) => {
      logIt('check storage limited got error:', e);
    });
  }
}

let dayCheckTimer: NodeJS.Timeout;
let sendDataTimer: NodeJS.Timeout;

export async function activate() {
  dayCheckTimer = setInterval(() => {
    checkMidnight().catch(() => { /* ignore error */ });
  }, ONE_MIN_MILLISECONDS * 5);

  sendDataTimer = setInterval(() => {
    sendRecords().catch(() => { /* ignore error */ });
  }, ONE_MIN_MILLISECONDS * 15);

  await checkMidnight();
}

export function deactivate() {
  if (dayCheckTimer) {
    clearInterval(dayCheckTimer);
  }
  if (sendDataTimer) {
    clearInterval(sendDataTimer);
  }
}
