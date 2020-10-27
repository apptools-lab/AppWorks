import * as os from 'os';
import * as path from 'path';
import * as fse from 'fs-extra';
import { window, workspace, TextDocument, WorkspaceFolder } from 'vscode';
import * as moment from 'moment';

export function isLinux() {
  return !(isWindows() || isMac());
}

export function isWindows() {
  return process.platform.indexOf('win32') !== -1;
}

export function isMac() {
  return process.platform.indexOf('darwin') !== -1;
}

export function getAppDataDir(autoCreate = true) {
  const homedir = os.homedir();
  const appDataDir = path.join(homedir, '.iceworks', 'TimeMaster');
  if (autoCreate && !fse.existsSync(appDataDir)) {
    fse.mkdirSync(appDataDir);
  }
  return appDataDir;
}

/**
 * @param num {number} The number to round
 * @param precision {number} The number of decimal places to preserve
 */
function roundUp(num: number, precision: number) {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}

export function humanizeMinutes(min: number) {
  // @ts-ignore
  min = parseInt(min, 0) || 0;
  let str = '';
  if (min === 60) {
    str = '1 hr';
  } else if (min > 60) {
    // @ts-ignore
    const hrs = parseFloat(min) / 60;
    const roundedTime = roundUp(hrs, 1);
    str = `${roundedTime.toFixed(1) } hrs`;
  } else if (min === 1) {
    str = '1 min';
  } else {
    // less than 60 seconds
    str = `${min.toFixed(0) } min`;
  }
  return str;
}

export async function openFileInEditor(file: string) {
  try {
    const doc = await workspace.openTextDocument(file);
    try {
      await window.showTextDocument(doc, 1, false);
    } catch (e) {
      // ignore error
    }
  } catch (error) {
    if (
      error.message &&
      error.message.toLowerCase().includes('file not found')
    ) {
      window.showErrorMessage(`Cannot open ${file}. File not found.`);
    } else {
      console.error(error);
    }
  }
}

export function isFileActive(file: string): boolean {
  if (workspace.textDocuments) {
    for (let i = 0; i < workspace.textDocuments.length; i++) {
      const doc: TextDocument = workspace.textDocuments[i];
      if (doc && doc.fileName === file) {
        return true;
      }
    }
  }
  return false;
}

export function getProjectPathForFile(fileName: string): string {
  const folder = getProjectFolder(fileName);
  return folder!.uri!.fsPath;
}

export function getProjectFolder(fileName: string): WorkspaceFolder {
  let liveShareFolder = null;
  if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
    for (let i = 0; i < workspace.workspaceFolders.length; i++) {
      const workspaceFolder = workspace.workspaceFolders[i];
      const folderUri = workspaceFolder.uri;
      if (folderUri) {
        const isVslsScheme = folderUri.scheme === 'vsls';
        if (isVslsScheme) {
          liveShareFolder = workspaceFolder;
        } else if (fileName.includes(folderUri.fsPath)) {
          return workspaceFolder;
        }
      }
    }
  }

  // wasn't found but if liveShareFolder was found, return that
  if (liveShareFolder) {
    return liveShareFolder;
  }
  return null;
}


const DAY_FORMAT = 'YYYY-MM-DD';
const DAY_TIME_FORMAT = 'LLLL';
export interface NowTimes {
  /**
   * current time in UTC (Moment object), e.g. "2020-04-08T04:48:27.120Z"
   */
  now: moment.Moment;
  /**
   * current time in UTC, unix seconds, e.g. 1586321307
   */
  nowInSec: number;
  /**
   * timezone offset from UTC (sign = -420 for Pacific Time), e.g. -25200
   */
  offsetInSec: number;
  /**
   * current time in UTC plus the timezone offset, e.g. 1586296107
   */
  localNowInSec: number;
  /**
   * current day in UTC, e.g. "2020-04-08"
   */
  day: string;
  /**
   * current day in local TZ, e.g. "2020-04-07"
   */
  localDay: string;
  /**
   * current day time in local TZ, e.g. "Tuesday, April 7, 2020 9:48 PM"
   */
  localDayTime: string;
}
export function getNowTimes(): NowTimes {
  const now = moment.utc();
  const nowInSec = now.unix();
  const offsetInSec = moment().utcOffset() * 60;
  const day = now.format(DAY_FORMAT);
  const localNowInSec = nowInSec + offsetInSec;
  const localDay = moment().format(DAY_FORMAT);
  const localDayTime = moment().format(DAY_TIME_FORMAT);

  return {
    now,
    nowInSec,
    offsetInSec,
    day,
    localNowInSec,
    localDay,
    localDayTime,
  };
}