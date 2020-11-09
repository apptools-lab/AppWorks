import * as path from 'path';
import * as fse from 'fs-extra';
import { getAppDataDirPath, getStorageDirs } from '../utils/storage';
import { getCountAndAverage4UserSummary } from './user';

export class AverageSummary {
  dailySessionSeconds?: number = 0;

  dailyKeystrokes?: number = 0;

  dailyLinesAdded?: number = 0;

  dailyLinesRemoved?: number = 0;
}

export function getAverageFile() {
  return path.join(getAppDataDirPath(), 'average.json');
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
  const storageDirs = await getStorageDirs();

  // Don't add today to the average
  storageDirs.splice(storageDirs.length - 1);

  const { average } = await getCountAndAverage4UserSummary(storageDirs);
  const { sessionSeconds, keystrokes, linesAdded, linesRemoved } = average;
  const averageSummary = {
    dailySessionSeconds: sessionSeconds,
    dailyKeystrokes: keystrokes,
    dailyLinesAdded: linesAdded,
    dailyLinesRemoved: linesRemoved,
  };
  await saveAverageSummary(averageSummary);
  return averageSummary;
}
