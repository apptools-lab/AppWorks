import { commands, window, WindowState } from 'vscode';
import { setNowDay, isNewDay } from '../utils/time';
import { sendPayload, checkPayloadIsLimited } from '../utils/sender';
import { checkStorageDaysIsLimited } from '../utils/storage';
import logger, { reloadLogger } from '../utils/logger';
import { getInterface as getWathStatsRecorder } from '../recorders/watchStats';
import { checkMidnightDurationMins, snedPayloadDurationMins, processWatchStatsDurationMins } from '../config';

const wathStatsRecorder = getWathStatsRecorder();

export async function checkMidnight() {
  if (isNewDay()) {
    setNowDay();
    reloadLogger();
    try {
      await Promise.all([
        async function () {
          await checkStorageDaysIsLimited();
        },
        async function () {
          await checkPayloadIsLimited();
          await sendPayload(true);
        },
      ]);
    } catch (e) {
      logger.error('[walkClock][checkMidnight] got error:', e);
    }
  }
}

let dayCheckTimer: NodeJS.Timeout;
let sendDataTimer: NodeJS.Timeout;
let processWatchStatsTimmer: NodeJS.Timeout;

export async function activate() {
  dayCheckTimer = setInterval(() => {
    checkMidnight();
  }, checkMidnightDurationMins);

  sendDataTimer = setInterval(() => {
    sendPayload().catch((e) => {
      logger.error('[walkClock][activate][setInterval]sendPayload got error:', e);
    });
  }, snedPayloadDurationMins);

  processWatchStatsTimmer = setInterval(() => {
    if (window.state.focused) {
      wathStatsRecorder.sendData().catch((e) => {
        logger.error('[walkClock][activate][setInterval]wathStatsRecorder got error:', e);
      });
    }
  }, processWatchStatsDurationMins);

  window.onDidChangeWindowState((windowState: WindowState) => {
    if (windowState.focused) {
      refreshViews();
    }
  });

  await checkMidnight();
  try {
    await sendPayload();
  } catch (e) {
    logger.error('[walkClock][activate]sendPayload got error:', e);
  }
}

export function deactivate() {
  if (dayCheckTimer) {
    clearInterval(dayCheckTimer);
  }
  if (sendDataTimer) {
    clearInterval(sendDataTimer);
  }
  if (processWatchStatsTimmer) {
    clearInterval(processWatchStatsTimmer);
  }
}

export function refreshViews() {
  logger.debug('[walkClock][refreshViews] run');
  commands.executeCommand('iceworks-time-master.refreshTimerTree');
  commands.executeCommand('iceworks-time-master.refreshTimerStatusBar');
}
