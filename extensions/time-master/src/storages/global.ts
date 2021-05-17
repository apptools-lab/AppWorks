import * as path from 'path';
import * as fse from 'fs-extra';
import { getStoragePath } from '../utils/storage';
import { jsonSpaces } from '../config';

export class GlobalSummary {
  dailySessionSeconds?: number = 0;

  dailyEditorSeconds?: number = 0;

  dailyKeystrokes?: number = 0;

  dailyLinesAdded?: number = 0;

  dailyLinesRemoved?: number = 0;
}

export function getGlobalFile() {
  return path.join(getStoragePath(), 'global.json');
}

export async function getGlobalSummary(): Promise<GlobalSummary> {
  const file = getGlobalFile();
  let globalSummary = new GlobalSummary();
  try {
    globalSummary = await fse.readJson(file);
  } catch (e) {
    // ignore
  }
  return globalSummary;
}

export async function saveGlobalSummary(globalSummary: GlobalSummary) {
  const file = getGlobalFile();
  await fse.writeJson(file, globalSummary, { spaces: jsonSpaces });
}

export async function clearGlobalSummary() {
  const globalSummary = new GlobalSummary();
  await saveGlobalSummary(globalSummary);
}
