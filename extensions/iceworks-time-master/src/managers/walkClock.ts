import { commands, window, WindowState } from 'vscode';
import { logIt } from '../utils/common';
import { setNowDay, isNewDay } from '../utils/time';
import { ONE_MIN_MILLISECONDS } from '../constants';
import { sendPayload } from '../utils/sender';
import { checkStorageIsLimited } from '../utils/storage';

export function checkMidnight() {
  if (isNewDay()) {
    setNowDay();
    checkStorageIsLimited().catch((e) => {
      logIt('[walkClock][checkMidnight]checkStorageIsLimited got error:', e);
    });
    sendPayload().catch((e) => {
      logIt('[walkClock][checkMidnight]sendPayload got error:', e);
    });
  }
}

let dayCheckTimer: NodeJS.Timeout;
let sendDataTimer: NodeJS.Timeout;

export function activate() {
  dayCheckTimer = setInterval(() => {
    checkMidnight();
  }, ONE_MIN_MILLISECONDS * 5);

  sendDataTimer = setInterval(() => {
    sendPayload().catch((e) => {
      logIt('[walkClock][activate][setInterval]sendPayload got error:', e);
    });
  }, ONE_MIN_MILLISECONDS * 15);

  window.onDidChangeWindowState((windowState: WindowState) => {
    if (windowState.focused) {
      refreshViews();
    }
  });

  checkMidnight();
  sendPayload().catch((e) => {
    logIt('[walkClock][activate]sendPayload got error:', e);
  });
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