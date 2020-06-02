import * as vscode from 'vscode';
import { downloadAndGenerateProject } from '@iceworks/generate-project';
import * as path from 'path';
import * as fse from 'fs-extra';
import axios from 'axios';

export async function getScaffolds(source: string) {
  const response = await axios.get(source);
  return response.data.scaffolds;
}

export async function getProjectPath(): Promise<string> {
  const options: vscode.OpenDialogOptions = {
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: 'Open',
  };
  const selectFolderUri = await vscode.window.showOpenDialog(options);
  const { fsPath } = selectFolderUri[0];
  return fsPath;
}

export async function createProject(data): Promise<string> {
  const { projectPath, projectName, scaffold } = data;
  const projectDir: string = path.join(projectPath, projectName);
  const { npm, registry, version } = scaffold.source;
  await downloadAndGenerateProject(projectDir, npm, version, registry);
  return projectDir;
}

export async function openLocalProjectFolder(projectDir: string): Promise<void> {
  const isProjectDirExists = await fse.pathExists(projectDir);
  if (!isProjectDirExists) {
    throw new Error('The project directory does not exist.')
  }
  vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(projectDir), true);
}
