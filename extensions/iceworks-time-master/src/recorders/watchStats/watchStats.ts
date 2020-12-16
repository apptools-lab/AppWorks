import * as path from 'path';
import { TextDocument } from 'vscode';
import { Project } from '../../storages/project';
import { FileWatchInfo, getTextInfo } from '../../storages/file';
import { getNowUTCSec } from '../../utils/time';
import { processData } from '../../managers/data';

import forIn = require('lodash.forin');

export class FileWatch implements FileWatchInfo {
  public fileName: string;

  public fsPath: string;

  public projectDirectory: string;

  public syntax: string;

  public length = 0;

  public lineCount = 0;

  public start = 0;

  public end = 0;

  public durationSeconds = 0;

  constructor(values?: Partial<any>) {
    if (values) {
      Object.assign(this, values);
    }
  }

  static createInstance(fsPath: string, project: Project) {
    const baseName = path.basename(fsPath);
    const fileName = baseName;
    const projectDirectory = project.directory;
    const fileChange = new FileWatch({ fileName, projectDirectory, fsPath });
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
    // placeholder
  }

  setStart(time?: number) {
    this.start = time || getNowUTCSec();
  }

  setEnd(time?: number) {
    const end = time || getNowUTCSec();
    let durationSeconds = 0;
    if (this.start) {
      durationSeconds = end - this.start;
    }

    this.end = end;
    this.incrementDurationSeconds(durationSeconds);
  }

  incrementDurationSeconds(durationSeconds: number) {
    const increment = durationSeconds > 0 ? durationSeconds : 0;
    this.durationSeconds += increment;
  }
}

export class WatchStats {
  public start: number;

  public end: number;

  public files: { [filePath: string]: FileWatch } = {};

  public project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  hasData(): boolean {
    const keys = Object.keys(this.files);
    return keys.length > 0;
  }

  getFile(fsPath: string): FileWatch {
    return this.files[fsPath];
  }

  addFile(fsPath: string): FileWatch {
    const fileWatch = FileWatch.createInstance(fsPath, this.project);
    fileWatch.activate();
    this.files[fsPath] = fileWatch;
    return fileWatch;
  }

  setStart(time?: number) {
    this.start = time || getNowUTCSec();
  }

  setEnd(time?: number) {
    this.end = time || getNowUTCSec();
  }

  async sendData() {
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
    forIn(this.files, (fileWatch: FileWatch) => {
      fileWatch.deactivate();
    });
  }
}
