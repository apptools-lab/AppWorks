import * as forIn from 'lodash.forin';
import { Project } from './storages/project';
import { FileChange } from './storages/filesChange';
import { getNowTimes } from './utils/common';

export interface Editor {
  id: string;
  name: string;
  version: string;
  extensionId: string;
  extensionVersion: string;
}

export interface User {
  id: string;
  email: string;
}

export class KeystrokeStats {
  // public os: string;
  // public hostname: string;
  // public timezone: string;
  // public editor: Editor;
  // public user: User;
  public keystrokes: number = 0;
  public start: number;
  public end: number;
  public files: {[name: string]: FileChange};
  public project: Project;

  constructor(project: Project) {
    this.project = project;
    this.setStart();
  }

  hasData(): boolean {
    const keys = Object.keys(this.files);
    if (keys.length === 0) {
      return false;
    }

    // delete files that don't have any kpm data
    let foundKpmData = false;
    if (this.keystrokes > 0) {
      foundKpmData = true;
    }

    // Now remove files that don't have any keystrokes
    // that only have an open or close associated with them.
    // If they have open and close then it's ok, keep it.
    let keystrokesTally = 0;
    keys.forEach((key) => {
      const fileChange: FileChange = this.files[key];
      const hasOpen = fileChange.open > 0;
      const hasClose = fileChange.close > 0;
      const hasKeystrokes = fileChange.keystrokes > 0;
      keystrokesTally += fileChange.keystrokes;
      if ((hasOpen && !hasClose && !hasKeystrokes) || (hasClose && !hasOpen && !hasKeystrokes)) {
        // delete it, no keystrokes and only an open
        delete this.files[key];
      } else if (!foundKpmData && hasOpen && hasClose) {
        foundKpmData = true;
      }
    });

    if (keystrokesTally > 0 && keystrokesTally !== this.keystrokes) {
      // use the keystrokes tally
      foundKpmData = true;
      this.keystrokes = keystrokesTally;
    }
    return foundKpmData;
  }

  hasFile(fsPath: string): boolean {
    return !!this.files[fsPath];
  }

  addFile(fsPath: string): void {
    const fileChange = FileChange.createInstance(fsPath, this.project);
    this.files[fsPath] = fileChange;
  }

  getFile(fsPath: string): FileChange {
    return this.files[fsPath];
  }

  setFilesEndAsNow(excludes: string[] = []): void {
    const { nowInSec } = getNowTimes();
    const fileKeys = Object.keys(this.files);
    fileKeys.forEach((key) => {
      const fileChange = this.files[key];
      if (fileChange.end === 0 && !excludes.includes(key)) {
        fileChange.setEnd(nowInSec);
      }
    });
  }

  setStart(time?: number) {
    this.start = time || getNowTimes().nowInSec;
  }

  setEnd(time?: number) {
    this.end = time || getNowTimes().nowInSec;
  }

  getSessionSeconds(): number {
    let sessionSeconds = 0;
    forIn(this.files, (fileChange) => {
      sessionSeconds += fileChange.sessionSeconds;
    });
    return sessionSeconds;
  }
}