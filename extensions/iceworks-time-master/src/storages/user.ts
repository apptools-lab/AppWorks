import * as path from 'path';
import * as fse from 'fs-extra';
import * as moment from 'moment';
import { getAppDataDirPath, getAppDataDayDirPath } from '../utils/storage';
import { getRangeDashboard } from '../utils/dashboard';
import { getDay, getLastWeekDays } from '../utils/time';
import { updateAverageSummary } from './average';

export class UserSummary {
  /**
   * 编程时间w
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
  return path.join(getAppDataDayDirPath(day), userFileName);
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

export async function updateUserSummary(increment: UserSummary) {
  const { linesAdded, linesRemoved, keystrokes, sessionSeconds = 0, editorSeconds = 0 } = increment;
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
  return path.join(getAppDataDirPath(), 'UserSummaryDashboard.txt');
}

export async function getUserSummaryByDays(dayMoments: moment.Moment[]): Promise<UserSummary> {
  const { count } = await getCountAndAverage4UserSummary(dayMoments.map((dayMoment => getDay(dayMoment))));
  return count;
}

export async function getCountAndAverage4UserSummary(days: string[]): Promise<{count: UserSummary; average: UserSummary}> {
  let countSessionSeconds = 0;
  let countKeystrokes = 0;
  let countLinesAdded = 0;
  let countLinesRemoved = 0;
  let sessionSecondsDays = 0;
  let keystrokesDays = 0;
  let linesAddedDays = 0;
  let linesRemovedDays = 0;
  await Promise.all(days.map(async (day) => {
    const { sessionSeconds, keystrokes, linesAdded, linesRemoved } = await getUserSummary(day);
    if (sessionSeconds) {
      countSessionSeconds += sessionSeconds;
      sessionSecondsDays++;
    }
    if (keystrokes) {
      countKeystrokes += keystrokes;
      keystrokesDays++;
    }
    if (linesAdded) {
      countLinesAdded += linesAdded;
      linesAddedDays++;
    }
    if (linesRemoved) {
      countLinesRemoved += linesRemoved;
      linesRemovedDays++;
    }
  }));
  const dailySessionSeconds = countSessionSeconds / sessionSecondsDays;
  const dailyKeystrokes = countKeystrokes / keystrokesDays;
  const dailyLinesAdded = countLinesAdded / linesAddedDays;
  const dailyLinesRemoved = countLinesRemoved / linesRemovedDays;
  const countSummary = {
    sessionSeconds: countSessionSeconds,
    keystrokes: countKeystrokes,
    linesAdded: countLinesAdded,
    linesRemoved: countLinesRemoved,
  };
  const averageSummary = {
    sessionSeconds: dailySessionSeconds,
    keystrokes: dailyKeystrokes,
    linesAdded: dailyLinesAdded,
    linesRemoved: dailyLinesRemoved,
  };
  return {
    average: averageSummary,
    count: countSummary,
  };
}

export async function generateUserDashboard() {
  const formattedDate = moment().format('ddd, MMM Do h:mma');
  const lineBreakStr = '\n';
  let dashboardContent = `User Summary (Last updated on ${formattedDate})\n`;
  dashboardContent += lineBreakStr;

  const formattedToday = moment().format('ddd, MMM Do');
  const todayUserSummary = await getUserSummary();
  const todyStr = getRangeDashboard(todayUserSummary, `🐻 Today (${formattedToday})`);
  dashboardContent += todyStr;
  dashboardContent += lineBreakStr;

  const yesterdayMoment = moment().subtract(1, 'days');
  const formattedYesterday = yesterdayMoment.format('ddd, MMM Do');
  const yesterdayUserSummary = await getUserSummary(getDay(yesterdayMoment));
  const yesterdayStr = getRangeDashboard(yesterdayUserSummary, `🦁 Yesterday (${formattedYesterday})`);
  dashboardContent += yesterdayStr;
  dashboardContent += lineBreakStr;

  const lastWeekDays = getLastWeekDays();
  const lastWeekMonday = lastWeekDays[0];
  const lastWeekFriday = lastWeekDays[4];
  const formattedLastWeek = `${getDay(lastWeekMonday)} - ${getDay(lastWeekFriday)}`;
  const lastWeekUserSummary = await getUserSummaryByDays(lastWeekDays);
  const lastWeekStr = getRangeDashboard(lastWeekUserSummary, `🐯 Last week (${formattedLastWeek})`);
  dashboardContent += lastWeekStr;
  dashboardContent += lineBreakStr;

  const averageSummary = await updateAverageSummary();
  const { dailyKeystrokes, dailyLinesAdded, dailyLinesRemoved, dailySessionSeconds } = averageSummary;
  const avgStr = getRangeDashboard({
    sessionSeconds: dailySessionSeconds,
    keystrokes: dailyKeystrokes,
    linesAdded: dailyLinesAdded,
    linesRemoved: dailyLinesRemoved,
  }, '🐲 Average');
  dashboardContent += avgStr;
  dashboardContent += lineBreakStr;

  const dashboardFile = getUserDashboardFile();
  await fse.writeFile(dashboardFile, dashboardContent, 'utf8');
  return dashboardFile;
}
