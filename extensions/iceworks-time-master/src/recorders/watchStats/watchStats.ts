import * as path from 'path';
import { Project } from '../../storages/project';
import { FileWatchInfo } from '../../storages/file';
import { getNowUTCSec } from '../../utils/time';
import logger from '../../utils/logger';

import forIn = require('lodash.forin');

export class FileWatch implements FileWatchInfo {
  public fileName: string;

  public fsPath: string;

  public projectDirectory: string;

  public length: number;

  public lineCount: number;

  public syntax: string;

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

  activate() {
    // placeholder
  }

  deactivate() {
    const durationSeconds = this.end - this.start;
    this.durationSeconds = durationSeconds > 0 ? durationSeconds : 0;
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
    return false;
  }

  hasFile(fsPath: string): boolean {
    return !!this.files[fsPath];
  }

  addFile(fsPath: string): void {
    const fileWatch = FileWatch.createInstance(fsPath, this.project);
    fileWatch.activate();
    this.files[fsPath] = fileWatch;
  }

  setStart(time?: number) {
    this.start = time || getNowUTCSec();
  }

  setEnd(time?: number) {
    this.end = time || getNowUTCSec();
  }

  async sendData() {
    const isHasData = this.hasData();
    logger.debug('[WatchStats][sendData]isHasData', isHasData);
    if (isHasData) {
      this.deactivate();
      // await processData(this);
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
