import * as path from 'path';
import * as fse from 'fs-extra';
import { getStoragePath, getStorageDaysDirs } from '../utils/storage';
import { getCountAndAverage4UserSummary } from './user';
import { jsonSpaces } from '../config';

export class AverageSummary {
  dailySessionSeconds?: number = 0;

  dailyEditorSeconds?: number = 0;

  dailyKeystrokes?: number = 0;

  dailyLinesAdded?: number = 0;

  dailyLinesRemoved?: number = 0;
}

export function getAverageFile() {
  return path.join(getStoragePath(), 'average.json');
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
  await fse.writeJson(file, averageSummary, { spaces: jsonSpaces });
}

export async function clearAverageSummary() {
  const averageSummary = new AverageSummary();
  await saveAverageSummary(averageSummary);
}

export async function updateAverageSummary(): Promise<AverageSummary> {
  const storageDirs = await getStorageDaysDirs();

  // Don't add today to the average
  if (storageDirs.length > 0) {
    storageDirs.splice(storageDirs.length - 1);
  }

  const { average } = await getCountAndAverage4UserSummary(storageDirs);
  const { sessionSeconds, editorSeconds, keystrokes, linesAdded, linesRemoved } = average;
  const averageSummary = {
    dailySessionSeconds: sessionSeconds,
    dailyEditorSeconds: editorSeconds,
    dailyKeystrokes: keystrokes,
    dailyLinesAdded: linesAdded,
    dailyLinesRemoved: linesRemoved,
  };
  await saveAverageSummary(averageSummary);
  return averageSummary;
}
