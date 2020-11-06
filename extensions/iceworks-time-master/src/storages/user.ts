import * as path from 'path';
import * as fse from 'fs-extra';
import * as moment from 'moment';
import { getAppDataDir, getAppDataDayDir } from '../utils/storage';
import { getDashboardRow, getRangeDashboard, getDashboardHr } from '../utils/dashboard';
import { humanizeMinutes, seconds2minutes } from '../utils/time';
import { updateAverageSummary } from './average';

export class UserSummary {
  /**
   * 编程时间
   */
  sessionSeconds = 0;

  /**
   * 编辑器使用时间
   */
  editorSeconds?: number = 0;

  keystrokes = 0;

  linesAdded = 0;

  linesRemoved = 0;
}

export const userFileName = 'user.json';

export function getUserFile(day?: string) {
  return path.join(getAppDataDayDir(day), userFileName);
}

export async function getUserSummary(day?: string): Promise<UserSummary> {
  const file = getUserFile(day);
  let userSummary = new UserSummary();
  try {
    userSummary = await fse.readJson(file);
  } catch (e) {
    // ignore
  }
  return userSummary;
}

export async function saveUserSummary(userSummary: UserSummary) {
  const file = getUserFile();
  await fse.writeJson(file, userSummary, { spaces: 4 });
}

export async function clearUserSummary() {
  const userSummary = new UserSummary();
  await saveUserSummary(userSummary);
}

export async function updateUserSummary(user: UserSummary) {
  const { linesAdded, linesRemoved, keystrokes, sessionSeconds = 0, editorSeconds = 0 } = user;
  const userSummary = await getUserSummary();
  userSummary.sessionSeconds += sessionSeconds;
  userSummary.editorSeconds += editorSeconds;
  userSummary.editorSeconds = Math.max(
    userSummary.editorSeconds,
    userSummary.sessionSeconds,
  );
  userSummary.linesAdded += linesAdded;
  userSummary.linesRemoved += linesRemoved;
  userSummary.keystrokes += keystrokes;
  await saveUserSummary(userSummary);
}

export function getUserDashboardFile() {
  return path.join(getAppDataDir(), 'UserSummaryDashboard.txt');
}

export async function generateUserDashboard() {
  const formattedDate = moment().format('ddd, MMM Do h:mma');
  const lineBreakStr = '\n';
  const hrStr = getDashboardHr();
  let dashboardContent = `User Summary (Last updated on ${formattedDate})\n`;
  dashboardContent += lineBreakStr;

  const { sessionSeconds } = await getUserSummary();
  const todySessionStr = humanizeMinutes(seconds2minutes(sessionSeconds));

  const { dailySessionSeconds } = await updateAverageSummary();
  const averageSessionStr = humanizeMinutes(seconds2minutes(dailySessionSeconds));

  const formattedToday = moment().format('ddd, MMM Do');
  let todyStr = `🐻 Today (${formattedToday})\n`;
  todyStr += hrStr;
  todyStr += getDashboardRow(
    'Active code time',
    todySessionStr,
  );
  todyStr += getDashboardRow(
    'Average',
    averageSessionStr,
  );
  dashboardContent += todyStr;
  dashboardContent += lineBreakStr;

  const yesterdayMoment = moment().subtract(1, 'days');
  const formattedYesterday = yesterdayMoment.format('ddd, MMM Do');
  const yesterdayStr = getRangeDashboard(`🦁 Yesterday (${formattedYesterday})`);
  dashboardContent += yesterdayStr;
  dashboardContent += lineBreakStr;

  const formattedLastWeek = 'Sun, Oct 25th - Sat, Oct 31st';
  const lastWeekStr = getRangeDashboard(`🐯 Last week (${formattedLastWeek})`);
  dashboardContent += lastWeekStr;
  dashboardContent += lineBreakStr;

  const avgStr = getRangeDashboard('🐲 90-day avg');
  dashboardContent += avgStr;
  dashboardContent += lineBreakStr;

  const dashboardFile = getUserDashboardFile();
  await fse.writeFile(dashboardFile, dashboardContent, 'utf8');
  return dashboardFile;
}
