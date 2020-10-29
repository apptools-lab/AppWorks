import { workspace, WorkspaceFolder } from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { UNTITLED, NO_PROJ_NAME } from '../constants';
import { getAppDataDir } from '../utils/common';
import { getResource } from '../utils/git';

export interface ProjectResource {
  repository: string;
  branch: string;
  tag?: string;
}

export function getProjectFolder(fsPath: string): WorkspaceFolder {
  let liveShareFolder = null;
  if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
    for (let i = 0; i < workspace.workspaceFolders.length; i++) {
      const workspaceFolder = workspace.workspaceFolders[i];
      const folderUri = workspaceFolder.uri;
      if (folderUri) {
        const isVslsScheme = folderUri.scheme === 'vsls';
        if (isVslsScheme) {
          liveShareFolder = workspaceFolder;
        } else if (fsPath.includes(folderUri.fsPath)) {
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

export class Project {
  // public id: string = '';
  public name: string = '';
  public directory: string = '';
  public resource: ProjectResource;

  constructor(values?: any) {
    // const { resource, directory } = values;
    // this.id = resource!.repository || directory;
    if (values) {
      Object.assign(this, values);
    }
  }

  static async createInstance(fsPath: string) {
    const workspaceFolder: WorkspaceFolder = getProjectFolder(fsPath);
    const directory = workspaceFolder ? workspaceFolder.uri.fsPath : UNTITLED;
    const name = workspaceFolder ? workspaceFolder.name : NO_PROJ_NAME;
    const resource = await getResource(directory);
    const project = new Project({ name, directory, resource });
    return project;
  }
}

export interface ProjectSummary {
  // id?: string;
  name: string;
  directory: string;
  editorSeconds: number;
  sessionSeconds: number;
  resource?: ProjectResource;
}

export interface ProjectsSummary {
  [path: string]: ProjectSummary;
}

export function getProjectsFile() {
  return path.join(getAppDataDir(), 'projects.json');
}

export function getProjectsSummary(): ProjectsSummary {
  const file = getProjectsFile();
  let projectsSummary = {};
  try {
    projectsSummary = fse.readJsonSync(file);
  } catch (e) {
    // ignore errors
  }
  return projectsSummary;
}

export function saveProjectsSummary(values: ProjectsSummary) {
  const file = getProjectsFile();
  fse.writeJsonSync(file, values, { spaces: 4 });
}

export function clearProjectsSummary() {
  saveProjectsSummary({});
}