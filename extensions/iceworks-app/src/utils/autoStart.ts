import * as vscode from 'vscode';
import { getFolderExistsTime } from '@iceworks/common-service';
import { projectExistsTime } from '../constants';
import { checkIsNotTarget, projectPath } from '@iceworks/project-service';

export default async function () {
  const isNotTargetProject = await checkIsNotTarget();

  if (isNotTargetProject) {
    vscode.commands.executeCommand('iceworks-project-creator.start');
  }
  if (projectPath) {
    const curProjectExistsTime = getFolderExistsTime(projectPath);
    if (curProjectExistsTime > projectExistsTime && !isNotTargetProject) {
      vscode.commands.executeCommand('iceworksApp.welcome.start');
    }
  }
}
