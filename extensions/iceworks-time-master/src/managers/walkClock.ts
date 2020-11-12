import { commands, window, WindowState } from 'vscode';
import { logIt } from '../utils/common';
import { setNowDay, isNewDay } from '../utils/time';
import { ONE_MIN_MILLISECONDS } from '../constants';
import { sendPayload } from '../utils/sender';
import { checkStorageIsLimited } from '../utils/storage';

export async function checkMidnight() {
  if (isNewDay()) {
    await sendPayload();
    setNowDay();
    checkStorageIsLimited().catch((e) => {
      logIt('[walkClock]check storage limited got error:', e);
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
    sendPayload().catch(() => { /* ignore error */ });
  }, ONE_MIN_MILLISECONDS * 15);

  window.onDidChangeWindowState((windowState: WindowState) => {
    if (windowState.focused) {
      refreshViews();
    }
  });

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

export function refreshViews() {
  logIt('[walkClock][refreshViews] run');
  commands.executeCommand('iceworks-time-master.refreshTimerTree');
  commands.executeCommand('iceworks-time-master.refreshTimerStatusBar');
}