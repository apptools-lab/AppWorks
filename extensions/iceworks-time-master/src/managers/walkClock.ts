import storage from '@iceworks/storage';
import { cleanFilesChangeSummary } from '../storages/filesChange';
import { clearProjectsSummary } from '../storages/project';
import { clearUserSummary } from '../storages/user';
import { getNowTimes } from '../utils/common';
import { ONE_MIN_MILLISECONDS } from '../constants';
import { sendRecords } from '../utils/recorder';

const CURRENT_DAY_STORAGE_KEY = 'timeMasterCurrentDay';

export function isNewDay(): boolean {
  const { day } = getNowTimes();
  const currentDay = storage.get(CURRENT_DAY_STORAGE_KEY);
  return currentDay !== day;
}

export async function checkMidnight() {
  if (isNewDay()) {
    await sendRecords();
    clearUserSummary();
    clearProjectsSummary();
    cleanFilesChangeSummary();
    const { day } = getNowTimes();
    storage.set(CURRENT_DAY_STORAGE_KEY, day);
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