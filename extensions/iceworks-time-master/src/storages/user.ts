import * as path from 'path';
import * as fse from 'fs-extra';
import * as moment from 'moment';
import { getAppDataDir } from '../utils/common';

export class UserSummary {
  /**
   * 编程时间
   */
  sessionSeconds: number = 0;
  /**
   * 编辑器使用时间
   */
  editorSeconds?: number = 0;

  keystrokes: number = 0;
  linesAdded: number = 0;
  linesRemoved: number = 0;

  // 个人平均数据
  averageDailySessionSeconds?: number = 0;
  averageDailyKeystrokes?: number = 0;
  averageDailyLinesAdded?: number = 0;
  averageDailyLinesRemoved?: number = 0;

  // 全局数据
  globalAverageDailySessionSeconds?: number = 0;
  globalAverageDailyKeystrokes?: number = 0;
  globalAverageDailyLinesAdded?: number = 0;
  globalAverageDailyLinesRemoved?: number = 0;
}

export function getUserFile() {
  return path.join(getAppDataDir(), 'user.json');
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
  const dashboardContent = `TIME MASTER - User Summary (Last updated on ${formattedDate})`;
  const dashboardFile = getUserDashboardFile();
  await fse.writeFile(dashboardFile, dashboardContent, 'utf8');
  return dashboardFile;
}