import * as path from 'path';
import * as fse from 'fs-extra';
import { getAppDataDir } from '../utils/common';

export class UserSummary {
  /**
   * 编辑器使用时间
   */
  editorSeconds = 0;

  /**
   * 编程时间
   */
  sessionSeconds = 0;

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
