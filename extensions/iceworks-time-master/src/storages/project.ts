import { workspace, WorkspaceFolder } from 'vscode';
import { UNTITLED, NO_PROJ_NAME } from '../constants';
import { getResource } from '../utils/git';

export interface ProjectResource {
  repository: string;
  branch: string;
  tag?: string;
}

export function getProjectPathForFile(fileName: string): string {
  const folder = getProjectFolder(fileName);
  return folder!.uri!.fsPath;
}

export function getProjectFolder(fileName: string): WorkspaceFolder {
  let liveShareFolder = null;
  if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
    for (let i = 0; i < workspace.workspaceFolders.length; i++) {
      const workspaceFolder = workspace.workspaceFolders[i];
      const folderUri = workspaceFolder.uri;
      if (folderUri) {
        const isVslsScheme = folderUri.scheme === 'vsls';
        if (isVslsScheme) {
          liveShareFolder = workspaceFolder;
        } else if (fileName.includes(folderUri.fsPath)) {
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

  constructor(fileName: string) {
    const workspaceFolder: WorkspaceFolder = getProjectFolder(fileName);
    this.directory = workspaceFolder!.uri!.fsPath || UNTITLED;
    this.name = workspaceFolder!.name || NO_PROJ_NAME;
  }

  async ready() {
    this.resource = await getResource(this.directory);
    this.id = this.resource!.repository || this.directory;
    return this;
  }
}

export class ProjectSummary extends Project {
  public editorSeconds: number = 0;
  public sessionSeconds: number = 0;
}