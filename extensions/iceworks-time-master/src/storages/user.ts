import * as path from 'path';
import * as fse from 'fs-extra';
import { getAppDataDir } from '../utils/common';

export class UserSummary {
  /**
   * 编程时间
   */
  sessionSeconds: number = 0;
  /**
   * 编辑器使用时间
   */
  editorSeconds?: number = 0;

  keystrokes: number = 0;
  linesAdded: number = 0;
  linesRemoved: number = 0;

  // 个人平均数据
  averageDailySessionSeconds?: number = 0;
  averageDailyKeystrokes?: number = 0;
  averageDailyLinesAdded?: number = 0;
  averageDailyLinesRemoved?: number = 0;

  // 全局数据
  globalAverageDailySessionSeconds?: number = 0;
  globalAverageDailyKeystrokes?: number = 0;
  globalAverageDailyLinesAdded?: number = 0;
  globalAverageDailyLinesRemoved?: number = 0;
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
