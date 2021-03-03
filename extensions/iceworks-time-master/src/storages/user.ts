import * as path from 'path';
import * as fse from 'fs-extra';
import * as moment from 'moment';
import { getStorageReportsPath, getStorageDayPath } from '../utils/storage';
import { getRangeReport } from '../utils/report';
import { getLastWeekDays } from '../utils/time';
import { getDay } from '../utils/day';
import { updateAverageSummary } from './average';
import { jsonSpaces } from '../config';
import logger from '../utils/logger';

export class UserSummary {
  /**
   * Active code time
   */
  sessionSeconds = 0;

  /**
   * Editor usage time
   */
  editorSeconds = 0;

  keystrokes = 0;

  linesAdded = 0;

  linesRemoved = 0;
}

function getUserFile(day?: string) {
  return path.join(getStorageDayPath(day), 'user.json');
}

async function getOriginUserSummary(day?: string) {
  const file = getUserFile(day);
  const fileIsExists = await fse.pathExists(file);
  return fileIsExists ? await fse.readJson(file) : new UserSummary();
}

export async function getUserSummary(day?: string): Promise<UserSummary> {
  try {
    return await getOriginUserSummary(day);
  } catch (e) {
    logger.error('[userStorage][getUserSummary] got error', e);
    return new UserSummary();
  }
}

async function saveUserSummary(userSummary: UserSummary) {
  const file = getUserFile();
  await fse.writeJson(file, userSummary, { spaces: jsonSpaces });
}

export async function updateUserSummary(increment: Partial<UserSummary>) {
  const { linesAdded = 0, linesRemoved = 0, keystrokes = 0, sessionSeconds = 0, editorSeconds = 0 } = increment;
  // always make sure user summary is correct
  let userSummary;
  try {
    userSummary = await getOriginUserSummary();
  } catch (e) {
    logger.error('[userStorage][updateUserSummary] getOriginUserSummary got error', e);
  }
  if (!userSummary) {
    return;
  }

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

function getUserReportFile() {
  return path.join(getStorageReportsPath(), 'UserSummary.txt');
}

async function getUserSummaryByDays(dayMoments: moment.Moment[]): Promise<UserSummary> {
  const { count } = await getCountAndAverage4UserSummary(dayMoments.map((dayMoment => getDay(dayMoment))));
  return count;
}

export async function getCountAndAverage4UserSummary(days: string[]): Promise<{count: UserSummary; average: UserSummary}> {
  let countSessionSeconds = 0;
  let countEditorSeconds = 0;
  let countKeystrokes = 0;
  let countLinesAdded = 0;
  let countLinesRemoved = 0;
  let sessionSecondsDays = 0;
  let editorSecondsDays = 0;
  let keystrokesDays = 0;
  let linesAddedDays = 0;
  let linesRemovedDays = 0;
  await Promise.all(days.map(async (day) => {
    const { sessionSeconds, editorSeconds, keystrokes, linesAdded, linesRemoved } = await getUserSummary(day);
    if (sessionSeconds) {
      countSessionSeconds += sessionSeconds;
      sessionSecondsDays++;
    }
    if (editorSeconds) {
      countEditorSeconds += editorSeconds;
      editorSecondsDays++;
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
  const dailyEditorSeconds = countEditorSeconds / editorSecondsDays;
  const dailyKeystrokes = countKeystrokes / keystrokesDays;
  const dailyLinesAdded = countLinesAdded / linesAddedDays;
  const dailyLinesRemoved = countLinesRemoved / linesRemovedDays;
  const countSummary = {
    sessionSeconds: countSessionSeconds,
    editorSeconds: countEditorSeconds,
    keystrokes: countKeystrokes,
    linesAdded: countLinesAdded,
    linesRemoved: countLinesRemoved,
  };
  const averageSummary = {
    sessionSeconds: dailySessionSeconds,
    editorSeconds: dailyEditorSeconds,
    keystrokes: dailyKeystrokes,
    linesAdded: dailyLinesAdded,
    linesRemoved: dailyLinesRemoved,
  };
  return {
    average: averageSummary,
    count: countSummary,
  };
}

export async function generateUserReport() {
  const nowMoment = moment();
  const formattedDate = nowMoment.format('ddd, MMM Do h:mma');
  const lineBreakStr = '\n';
  let reportContent = `User Summary (Last updated on ${formattedDate})\n`;
  reportContent += lineBreakStr;

  const formattedToday = nowMoment.format('ddd, MMM Do');
  const todayUserSummary = await getUserSummary();
  const todyStr = getRangeReport(todayUserSummary, `🐻 Today (${formattedToday})`);
  reportContent += todyStr;
  reportContent += lineBreakStr;

  const yesterdayMoment = nowMoment.clone().subtract(1, 'days');
  const formattedYesterday = yesterdayMoment.format('ddd, MMM Do');
  const yesterdayUserSummary = await getUserSummary(getDay(yesterdayMoment));
  const yesterdayStr = getRangeReport(yesterdayUserSummary, `🦁 Yesterday (${formattedYesterday})`);
  reportContent += yesterdayStr;
  reportContent += lineBreakStr;

  const lastWeekDays = getLastWeekDays();
  const lastWeekMonday = lastWeekDays[0];
  const lastWeekFriday = lastWeekDays[4];
  const formattedLastWeek = `${getDay(lastWeekMonday)} to ${getDay(lastWeekFriday)}`;
  const lastWeekUserSummary = await getUserSummaryByDays(lastWeekDays);
  const lastWeekStr = getRangeReport(lastWeekUserSummary, `🐯 Last week (${formattedLastWeek})`);
  reportContent += lastWeekStr;
  reportContent += lineBreakStr;

  const averageSummary = await updateAverageSummary();
  const { dailyKeystrokes, dailyEditorSeconds, dailyLinesAdded, dailyLinesRemoved, dailySessionSeconds } = averageSummary;
  const avgStr = getRangeReport({
    sessionSeconds: dailySessionSeconds,
    editorSeconds: dailyEditorSeconds,
    keystrokes: dailyKeystrokes,
    linesAdded: dailyLinesAdded,
    linesRemoved: dailyLinesRemoved,
  }, '🐲 Average of Day');
  reportContent += avgStr;
  reportContent += lineBreakStr;

  const reportFile = getUserReportFile();
  await fse.writeFile(reportFile, reportContent, 'utf8');
  return reportFile;
}
