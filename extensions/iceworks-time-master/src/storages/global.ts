import * as path from 'path';
import * as fse from 'fs-extra';
import { getAppDataDir } from '../utils/common';

export class GlobalSummary {
  dailySessionSeconds?: number = 0;

  dailyKeystrokes?: number = 0;

  dailyLinesAdded?: number = 0;

  dailyLinesRemoved?: number = 0;
}

export function getGlobalFile() {
  return path.join(getAppDataDir(), 'global.json');
}

export function getGlobalSummary(): GlobalSummary {
  const file = getGlobalFile();
  let globalSummary = new GlobalSummary();
  try {
    globalSummary = fse.readJsonSync(file);
  } catch (e) {
    // ignore
  }
  return globalSummary;
}

export function saveGlobalSummary(globalSummary: GlobalSummary) {
  const file = getGlobalFile();
  fse.writeJsonSync(file, globalSummary, { spaces: 4 });
}

export function clearGlobalSummary() {
  const globalSummary = new GlobalSummary();
  saveGlobalSummary(globalSummary);
}
