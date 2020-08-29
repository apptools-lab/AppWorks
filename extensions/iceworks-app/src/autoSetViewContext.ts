import * as vscode from 'vscode';
import { getProjectType } from '@iceworks/project-service';

export default async function () {
  let isNotTargetProject;
  if (!vscode.workspace.rootPath) {
    isNotTargetProject = true;
  } else {
    try {
      const projectType = await getProjectType();
      isNotTargetProject = projectType === 'unknown';
    } catch (e) {
      isNotTargetProject = true;
    }
  }
  vscode.commands.executeCommand('setContext', 'iceworks:isNotTargetProject', isNotTargetProject);
  if (isNotTargetProject) {
    vscode.commands.executeCommand('iceworks-project-creator.start');
  }
}
