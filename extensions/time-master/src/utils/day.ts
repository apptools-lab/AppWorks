import configure from '@appworks/configure';
import * as moment from 'moment';

const DAY_FORMAT = 'YYYY-MM-DD';
const CURRENT_DAY_STORAGE_KEY = 'timeMasterCurrentDay';

export function getNowDay() {
  let currentDay = configure.get(CURRENT_DAY_STORAGE_KEY);
  if (!currentDay) {
    currentDay = setNowDay();
  }
  return currentDay;
}

export function setNowDay() {
  const day = getDay();
  configure.set(CURRENT_DAY_STORAGE_KEY, day);
  return day;
}

export function checkIsNewDay() {
  const day = getDay();
  const currentDay = configure.get(CURRENT_DAY_STORAGE_KEY);
  return currentDay !== day;
}

export function getDay(m?: moment.Moment) {
  const time = m || moment();
  return time.format(DAY_FORMAT);
}
