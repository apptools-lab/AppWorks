import { Project } from '../storages/project';
import { FileChange } from '../storages/filesChange';
import { logIt } from '../utils/common';
import { getNowTimes } from '../utils/time';
import { processData } from './data';
import forIn = require('lodash.forin');

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
  public keystrokes = 0;

  public start: number;

  public end: number;

  public files: {[name: string]: FileChange} = {};

  public project: Project;

  constructor(project: Project) {
    this.project = project;
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
      keystrokesTally += fileChange.keystrokes;
      if (hasOpen && hasClose) {
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
    fileChange.activate();
    this.files[fsPath] = fileChange;
  }

  setStart(time?: number) {
    this.start = time || getNowTimes().nowInSec;
  }

  setEnd(time?: number) {
    this.end = time || getNowTimes().nowInSec;
  }

  async sendData() {
    const isHasData = this.hasData();
    logIt('[KeystrokeStats][sendData]isHasData', isHasData);
    if (isHasData) {
      this.deactivate();
      await processData(this);
    }
  }

  activate() {
    this.setStart();
  }

  deactivate() {
    this.setEnd();
    forIn(this.files, (fileChange: FileChange) => {
      fileChange.deactivate();
    });
  }
}
