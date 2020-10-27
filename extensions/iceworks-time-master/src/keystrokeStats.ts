import { Project } from './storages/project';
import { FileChangeSummary } from './storages/filesChange';

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
  // public localStart: number;
  public end: number;
  public editor: Editor;
  public project: Project;
  public user: User;
  public files: {[name: string]: FileChangeSummary};
  constructor(project: Project) {
    this.project = project;
  }
}