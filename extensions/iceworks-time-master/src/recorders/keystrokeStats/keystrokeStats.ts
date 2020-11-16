import { Project } from '../../storages/project';
import { FileChange } from '../../storages/filesChange';
import { getNowUTCSec } from '../../utils/time';
import { processData } from '../../managers/data';
import logger from '../../utils/logger';
import forIn = require('lodash.forin');

export interface KeystrokeStatsInfo {
  /**
   * Time to start keystroke
   */
  start: number;
  /**
   * Time to end keystroke
   */
  end: number;
  /**
   * Number of keystrokes
   */
  keystrokes: number;
  /**
   * Interval between the end of the update and the start of the update
   */
  durationSeconds: number;
}

export class KeystrokeStats {
  public keystrokes = 0;

  public start: number;

  public end: number;

  public files: {[filePath: string]: FileChange} = {};

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
    this.start = time || getNowUTCSec();
  }

  setEnd(time?: number) {
    this.end = time || getNowUTCSec();
  }

  async sendData() {
    const isHasData = this.hasData();
    logger.debug('[KeystrokeStats][sendData]isHasData', isHasData);
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