import { setNowDay, checkIsNewDay } from '../utils/day';
import { sendPayload, checkPayloadIsLimited } from '../utils/sender';
import { checkStorageDaysIsLimited } from '../utils/storage';
import logger from '../utils/logger';
import { checkMidnightDurationMins, sendPayloadDurationMins } from '../config';

async function checkIsLimited() {
  try {
    await Promise.all([
      checkStorageDaysIsLimited(),
      checkPayloadIsLimited(),
    ]);
  } catch (e) {
    logger.error('[walkClock][checkIsLimited] got error:', e);
  }
}

export async function checkMidnight() {
  const isNewDay = checkIsNewDay();
  logger.info('[walkClock][checkMidnight] run, isNewDay:', isNewDay);

  if (isNewDay) {
    setNowDay();
    try {
      await checkIsLimited();
      await sendPayload();
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
  await sendPayload();
}
