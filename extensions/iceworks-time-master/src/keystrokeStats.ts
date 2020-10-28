import { Project } from './storages/project';
import { FileChangeSummary } from './storages/filesChange';
import { getNowTimes } from '../utils/common';

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
  public os: string;
  public hostname: string;
  public timezone: string;
  public keystrokes: number = 0;
  public start: number;
  public end: number;
  public editor: Editor;
  public user: User;
  private files: {[name: string]: FileChangeSummary};
  private project: Project;

  constructor(project: Project) {
    const { nowInSec } = getNowTimes();

    this.project = project;
    this.start = nowInSec;
  }

  hasFile(fileName: string): boolean {
    return !!this.files[fileName];
  }

  addFile(fileName: string): void {
    const fileChangeSummary = new FileChangeSummary(fileName, this.project);
    this.files[fileName] = fileChangeSummary;
  }

  getFile(fileName: string): FileChangeSummary {
    return this.files[fileName];
  }

  setFilesEndAsNow(excludes: string[] = []): void {
    const nowTimes = getNowTimes();
    const fileKeys = Object.keys(this.files);
    fileKeys.forEach((key) => {
      const fileChangeSummary = this.files[key];
      if (fileChangeSummary.end === 0 && !excludes.includes(key)) {
        fileChangeSummary.end = nowTimes.nowInSec;
      }
    });
  }
}