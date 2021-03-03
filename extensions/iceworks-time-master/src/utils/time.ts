import * as moment from 'moment';
import { ONE_MIN_SECONDS } from '../constants';
import i18n from '../i18n';

/**
 * @param num {number} The number to round
 * @param precision {number} The number of decimal places to preserve
 */
function roundUp(num: number, precision: number) {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}

export function getLastWeekDays(m?: moment.Moment): moment.Moment[] {
  const lastWeekSameDay = (m ? m.clone() : moment()).subtract(1, 'w');
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

function getNowUTCMoment() {
  const utcMoment = moment.utc();
  return utcMoment;
}

export function getNowUTCSec() {
  const utc = getNowUTCMoment();
  const nowInSec = utc.unix();
  return nowInSec;
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
