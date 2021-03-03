import { setNowDay, checkIsNewDay } from '../utils/time';
import { sendPayload, checkPayloadIsLimited } from '../utils/sender';
import { checkStorageDaysIsLimited } from '../utils/storage';
import logger, { checkLogsIsLimited, reloadLogger } from '../utils/logger';
import { checkMidnightDurationMins, sendPayloadDurationMins } from '../config';

export async function checkMidnight() {
  const isNewDay = checkIsNewDay();
  logger.info('[walkClock][checkMidnight] run, isNewDay:', isNewDay);

  if (isNewDay) {
    setNowDay();
    reloadLogger();
    try {
      await Promise.all([
        checkLogsIsLimited(),
        checkStorageDaysIsLimited(),
        (async function () {
          await checkPayloadIsLimited();
          await sendPayload(true);
        })(),
      ]);
    } catch (e) {
      logger.error('[walkClock][checkMidnight] got error:', e);
    }
  }
}

let dayCheckTimer: NodeJS.Timeout;
let sendPayloadTimer: NodeJS.Timeout;

export async function activate() {
  dayCheckTimer = setInterval(checkMidnight, checkMidnightDurationMins);

  sendPayloadTimer = setInterval(() => {
    sendPayload().catch((e) => {
      logger.error('[walkClock][activate][setInterval]sendPayload got error:', e);
    });
  }, sendPayloadDurationMins);

  await checkMidnight();
  await sendPayload();
}

export async function deactivate() {
  if (dayCheckTimer) {
    clearInterval(dayCheckTimer);
  }
  await checkMidnight();

  if (sendPayloadTimer) {
    clearInterval(sendPayloadTimer);
  }
  await sendPayload(true);
}
