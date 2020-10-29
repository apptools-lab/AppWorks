import storage from '@iceworks/storage';
import { cleanFilesChangeSummary } from '../storages/filesChange';
import { clearProjectsSummary } from '../storages/project';
import { clearUserSummary } from '../storages/user';
import { getNowTimes } from '../utils/common';
import { DEFAULT_DURATION_MILLISECONDS } from '../constants';

const CURRENT_DAY_STORAGE_KEY = 'timeMasterCurrentDay';

export function isNewDay(): boolean {
  const { day } = getNowTimes();
  const currentDay = storage.get(CURRENT_DAY_STORAGE_KEY);
  return currentDay !== day;
}

export function checkMidnight() {
  if (isNewDay()) {
    clearUserSummary();
    clearProjectsSummary();
    cleanFilesChangeSummary();
    const { day } = getNowTimes();
    storage.set(CURRENT_DAY_STORAGE_KEY, day);
  }
}

let dayCheckTimer: NodeJS.Timeout;

export function activate() {
  dayCheckTimer = setInterval(() => {
    checkMidnight();
  }, DEFAULT_DURATION_MILLISECONDS * 2);

  checkMidnight();
}

export function deactivate() {
  if (dayCheckTimer) {
    clearInterval(dayCheckTimer);
  }
}