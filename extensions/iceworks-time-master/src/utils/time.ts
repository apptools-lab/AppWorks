import storage from '@iceworks/storage';
import * as moment from 'moment';
import { ONE_MIN_SECONDS } from '../constants';
import { roundUp } from './common';
import i18n from '../i18n';

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

export function getDay(m?: moment.Moment) {
  const time = m || moment.utc();
  return time.format(DAY_FORMAT);
}

export function getLastWeekDays(m?: moment.Moment): moment.Moment[] {
  const lastWeekSameDay = (m || moment()).subtract(1, 'w');
  const weekday = lastWeekSameDay.weekday();
  const preDays = [];
  const nextDays = [];
  for (let monday = 1, preDay = weekday - 1, nowDay = lastWeekSameDay.clone(); preDay >= monday; preDay--) {
    nowDay.subtract(1, 'd');
    preDays.push(nowDay);
  }
  for (let friday = 5, nextDay = weekday + 1, nowDay = lastWeekSameDay.clone(); friday >= nextDay; nextDay++) {
    nowDay.add(1, 'd');
    nextDays.push(nowDay);
  }
  return [...preDays, lastWeekSameDay, ...nextDays];
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
  const offsetInSec = moment().utcOffset() * 60;
  const now = moment.utc();
  const nowInSec = now.unix();
  const day = getDay(now);
  const localNowInSec = nowInSec + offsetInSec;
  const localDay = getDay(moment());
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
    str = `1 ${i18n.format('extension.timeMaster.time.hour')}`;
  } else if (min > 60) {
    // @ts-ignore
    const hrs = parseFloat(min) / 60;
    const roundedTime = roundUp(hrs, 1);
    str = `${roundedTime.toFixed(1) } ${i18n.format('extension.timeMaster.time.hours')}`;
  } else if (min === 1) {
    str = `1 ${i18n.format('extension.timeMaster.time.min')}`;
  } else {
    // less than 60 seconds
    str = `${min.toFixed(0) } ${i18n.format('extension.timeMaster.time.min')}`;
  }
  return str;
}

export function seconds2minutes(value: number) {
  return value / ONE_MIN_SECONDS;
}
