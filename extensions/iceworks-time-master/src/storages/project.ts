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
  public id: string = '';
  public name: string = '';
  public directory: string = '';
  public resource: ProjectResource;
  public editorSeconds: number = 0;
  public sessionSeconds: number = 0;

  constructor(values: ProjectSummary) {
    const { resource, directory } = values;
    this.id = resource!.repository || directory;
    Object.assign(this, values);
  }

  static async createInstance(fsPath: string) {
    const workspaceFolder: WorkspaceFolder = getProjectFolder(fsPath);
    const directory = workspaceFolder!.uri!.fsPath || UNTITLED;
    const name = workspaceFolder!.name || NO_PROJ_NAME;
    const resource = await getResource(directory);
    const project = new Project({ name, directory, resource });
    return project;
  }
}

export interface ProjectSummary {
  name: string;
  directory: string;
  id?: string;
  resource?: ProjectResource;
  editorSeconds?: number;
  sessionSeconds?: number;
}

export function getProjectFile() {
  return path.join(getAppDataDir(), 'project.json');
}

export function getProjectSummary(): Project {
  const file = getProjectFile();
  let projectSummary;
  try {
    projectSummary = fse.readJsonSync(file);
  } catch (e) {
    // ignore errors
  }
  return new Project(projectSummary);
}

export function saveProjectSummary(values: ProjectSummary) {
  const file = getProjectFile();
  fse.writeJsonSync(file, values, { spaces: 4 });
}