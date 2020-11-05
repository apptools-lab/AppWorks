import * as path from 'path';
import * as fse from 'fs-extra';
import { getAppDataDir } from '../utils/common';

export class AverageSummary {
  dailySessionSeconds?: number = 0;

  dailyKeystrokes?: number = 0;

  dailyLinesAdded?: number = 0;

  dailyLinesRemoved?: number = 0;
}

export function getAverageFile() {
  return path.join(getAppDataDir(), 'average.json');
}

export function getAverageSummary(): AverageSummary {
  const file = getAverageFile();
  let averageSummary = new AverageSummary();
  try {
    averageSummary = fse.readJsonSync(file);
  } catch (e) {
    // ignore
  }
  return averageSummary;
}

export function saveAverageSummary(averageSummary: AverageSummary) {
  const file = getAverageFile();
  fse.writeJsonSync(file, averageSummary, { spaces: 4 });
}

export function clearAverageSummary() {
  const averageSummary = new AverageSummary();
  saveAverageSummary(averageSummary);
}
