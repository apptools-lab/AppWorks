import * as path from 'path';
import * as fse from 'fs-extra';
import * as moment from 'moment';
import { getAppDataDir, getAppDataDayDir } from '../utils/common';
import { getDashboardRow, getRangeDashboard, getDashboardHr } from '../utils/dashboard';

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

export function getUserFile() {
  return path.join(getAppDataDayDir(), 'user.json');
}

export function getUserSummary(): UserSummary {
  const file = getUserFile();
  let userSummary = new UserSummary();
  try {
    userSummary = fse.readJsonSync(file);
  } catch (e) {
    // ignore
  }
  return userSummary;
}

export function saveUserSummary(userSummary: UserSummary) {
  const file = getUserFile();
  fse.writeJsonSync(file, userSummary, { spaces: 4 });
}

export function clearUserSummary() {
  const userSummary = new UserSummary();
  saveUserSummary(userSummary);
}

export function updateUserSummary(user: UserSummary) {
  const { linesAdded, linesRemoved, keystrokes, sessionSeconds = 0, editorSeconds = 0 } = user;
  const userSummary = getUserSummary();
  userSummary.sessionSeconds += sessionSeconds;
  userSummary.editorSeconds += editorSeconds;
  userSummary.editorSeconds = Math.max(
    userSummary.editorSeconds,
    userSummary.sessionSeconds,
  );
  userSummary.linesAdded += linesAdded;
  userSummary.linesRemoved += linesRemoved;
  userSummary.keystrokes += keystrokes;
  saveUserSummary(userSummary);
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

  const formattedToday = moment().format('ddd, MMM Do');
  let todyStr = `🐻 Today (${formattedToday})\n`;
  todyStr += hrStr;
  todyStr += getDashboardRow(
    'Active code time',
    '1 min',
  );
  todyStr += getDashboardRow(
    '90-day avg',
    '5.2 hrs',
  );
  dashboardContent += todyStr;
  dashboardContent += lineBreakStr;

  const formattedYesterday = moment().format('ddd, MMM Do');
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
