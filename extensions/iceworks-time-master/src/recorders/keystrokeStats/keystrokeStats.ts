import { TextDocument } from 'vscode';
import * as path from 'path';
import { Project } from '../../storages/project';
import { FileChangeInfo, getTextInfo } from '../../storages/file';
import { getNowUTCSec } from '../../utils/time';
import { processData } from '../../managers/data';

import forIn = require('lodash.forin');

export class FileChange implements FileChangeInfo {
  public fileName: string;

  public fsPath: string;

  public projectDirectory: string;

  public length: number;

  public lineCount: number;

  public syntax: string;

  public keystrokes = 0;

  public charsAdded = 0;

  public charsDeleted = 0;

  public charsPasted = 0;

  public open = 0;

  public close = 0;

  public pasteTimes = 0;

  public addTimes = 0;

  public deleteTimes = 0;

  public update = 0;

  public linesAdded = 0;

  public linesRemoved = 0;

  public start = 0;

  public end = 0;

  public durationSeconds = 0;

  constructor(values?: Partial<FileChangeInfo>) {
    if (values) {
      Object.assign(this, values);
    }
  }

  static createInstance(fsPath: string, project: Project) {
    const baseName = path.basename(fsPath);
    const fileName = baseName;
    const projectDirectory = project.directory;
    const fileChange = new FileChange({ fileName, projectDirectory, fsPath });
    return fileChange;
  }

  updateTextInfo(textDocument: TextDocument) {
    const { syntax, length, lineCount } = getTextInfo(textDocument, this.fileName);
    this.syntax = syntax;
    this.length = length;
    this.lineCount = lineCount;
  }

  activate() {
    // placeholder
  }

  deactivate() {
    if (this.keystrokes) {
      this.update = 1;
    }
    if (this.start && this.end) {
      const durationSeconds = this.end - this.start;
      this.durationSeconds = durationSeconds > 0 ? durationSeconds : 0;
    }
  }

  setStart(time?: number) {
    this.start = time || getNowUTCSec();
  }

  setEnd(time?: number) {
    this.end = time || getNowUTCSec();
  }
}

export class KeystrokeStats {
  public keystrokes = 0;

  public start: number;

  public end: number;

  public files: { [filePath: string]: FileChange } = {};

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

  async processData() {
    const isHasData = this.hasData();
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
    forIn(this.files, (fileChange: FileChange, key: string) => {
      if (fileChange.start && fileChange.end) {
        fileChange.deactivate();
      } else {
        delete this.files[key];
      }
    });
  }
}