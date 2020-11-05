import { setNowDay, isNewDay } from '../utils/common';
import { ONE_MIN_MILLISECONDS } from '../constants';
import { sendRecords } from '../utils/recorder';

export async function checkMidnight() {
  if (isNewDay()) {
    await sendRecords();
    setNowDay();
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
