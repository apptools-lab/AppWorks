import storage from '@iceworks/storage';
import * as moment from 'moment';
import { roundUp } from './common';

const CURRENT_DAY_STORAGE_KEY = 'timeMasterCurrentDay';
export function getNowDay() {
  const currentDay = storage.get(CURRENT_DAY_STORAGE_KEY);
  return currentDay;
}

export function setNowDay() {
  const { day } = getNowTimes();
  storage.set(CURRENT_DAY_STORAGE_KEY, day);
}

export function isNewDay() {
  const { day } = getNowTimes();
  const currentDay = storage.get(CURRENT_DAY_STORAGE_KEY);
  return currentDay !== day;
}


const DAY_FORMAT = 'YYYY-MM-DD';
const DAY_TIME_FORMAT = 'LLLL';
export interface NowTimes {
  /**
   * current time in UTC (Moment object), e.g. "2020-04-08T04:48:27.120Z"
   */
  now: moment.Moment;
  /**
   * current time in UTC, unix seconds, e.g. 1586321307
   */
  nowInSec: number;
  /**
   * timezone offset from UTC (sign = -420 for Pacific Time), e.g. -25200
   */
  offsetInSec: number;
  /**
   * current time in UTC plus the timezone offset, e.g. 1586296107
   */
  localNowInSec: number;
  /**
   * current day in UTC, e.g. "2020-04-08"
   */
  day: string;
  /**
   * current day in local TZ, e.g. "2020-04-07"
   */
  localDay: string;
  /**
   * current day time in local TZ, e.g. "Tuesday, April 7, 2020 9:48 PM"
   */
  localDayTime: string;
}
export function getNowTimes(): NowTimes {
  const now = moment.utc();
  const nowInSec = now.unix();
  const offsetInSec = moment().utcOffset() * 60;
  const day = now.format(DAY_FORMAT);
  const localNowInSec = nowInSec + offsetInSec;
  const localDay = moment().format(DAY_FORMAT);
  const localDayTime = moment().format(DAY_TIME_FORMAT);

  return {
    now,
    nowInSec,
    offsetInSec,
    day,
    localNowInSec,
    localDay,
    localDayTime,
  };
}

export function humanizeMinutes(min: number) {
  // @ts-ignore
  min = parseInt(min, 0) || 0;
  let str = '';
  if (min === 60) {
    str = '1 hr';
  } else if (min > 60) {
    // @ts-ignore
    const hrs = parseFloat(min) / 60;
    const roundedTime = roundUp(hrs, 1);
    str = `${roundedTime.toFixed(1) } hrs`;
  } else if (min === 1) {
    str = '1 min';
  } else {
    // less than 60 seconds
    str = `${min.toFixed(0) } min`;
  }
  return str;
}