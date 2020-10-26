import * as path from 'path';
import * as fse from 'fs-extra';
import { getAppDataDir } from '../utils';

export class UserSummary {
  editorSeconds = 0; // Editor usage time

  sessionSeconds = 0; // Active programming time

  keystrokes = 0;

  linesAdded = 0;

  linesRemoved = 0;

  // 个人平均数据
  averageDailySessionSeconds = 0;

  averageDailyKeystrokes = 0;

  averageDailyLinesAdded = 0;

  averageDailyLinesRemoved = 0;

  // 全局数据
  globalAverageDailySessionSeconds = 0;

  globalAverageDailyKeystrokes = 0;

  globalAverageDailyLinesAdded = 0;

  globalAverageDailyLinesRemoved = 0;
}

function coalesceMissingAttributes(data: any): UserSummary {
  // ensure all attributes are defined
  const template: UserSummary = new UserSummary();
  Object.keys(template).forEach((key) => {
    if (!data[key]) {
      data[key] = 0;
    }
  });
  return data;
}

function getOriginUserSummary(): UserSummary {
  const file = getUserFile();
  let userSummary = fse.readJsonSync(file);
  if (!userSummary) {
    userSummary = new UserSummary();
    saveUserSummary(userSummary);
  }
  return userSummary;
}

export function getUserFile() {
  return path.join(getAppDataDir(), 'user.json');
}

export function getUserSummary(): UserSummary {
  const userSummary = coalesceMissingAttributes(getOriginUserSummary());
  return userSummary;
}

export function saveUserSummary(userSummary: UserSummary) {
  const file = getUserFile();
  fse.writeJsonSync(file, userSummary, { spaces: 4 });
}
