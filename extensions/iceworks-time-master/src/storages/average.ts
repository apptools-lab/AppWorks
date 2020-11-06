import * as path from 'path';
import * as fse from 'fs-extra';
import { getAppDataDir, getStorageDirPaths } from '../utils/storage';
import { getUserSummary } from './user';

export class AverageSummary {
  dailySessionSeconds?: number = 0;

  dailyKeystrokes?: number = 0;

  dailyLinesAdded?: number = 0;

  dailyLinesRemoved?: number = 0;
}

export function getAverageFile() {
  return path.join(getAppDataDir(), 'average.json');
}

export async function getAverageSummary(): Promise<AverageSummary> {
  const file = getAverageFile();
  let averageSummary = new AverageSummary();
  try {
    averageSummary = await fse.readJson(file);
  } catch (e) {
    // ignore
  }
  return averageSummary;
}

export async function saveAverageSummary(averageSummary: AverageSummary) {
  const file = getAverageFile();
  await fse.writeJson(file, averageSummary, { spaces: 4 });
}

export async function clearAverageSummary() {
  const averageSummary = new AverageSummary();
  await saveAverageSummary(averageSummary);
}

export async function updateAverageSummary(): Promise<AverageSummary> {
  const storageDirPaths = await getStorageDirPaths();

  // Don't add today to the average
  storageDirPaths.splice(storageDirPaths.length - 1);

  let countSessionSeconds = 0;
  let countKeystrokes = 0;
  let countLinesAdded = 0;
  let countLinesRemoved = 0;
  let sessionSecondsDays = 0;
  let keystrokesDays = 0;
  let linesAddedDays = 0;
  let linesRemovedDays = 0;
  await Promise.all(storageDirPaths.map(async (storageDirPath) => {
    const { sessionSeconds, keystrokes, linesAdded, linesRemoved } = await getUserSummary(path.basename(storageDirPath));
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
  const averageSummary = {
    dailySessionSeconds,
    dailyKeystrokes,
    dailyLinesAdded,
    dailyLinesRemoved,
  };
  await saveAverageSummary(averageSummary);
  return averageSummary;
}
