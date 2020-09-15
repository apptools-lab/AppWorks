import * as vscode from 'vscode';
import { checkIsNotTarget } from '@iceworks/project-service';

export default async function () {
  const isNotTargetProject = await checkIsNotTarget();
  vscode.commands.executeCommand('iceworksApp.welcome.start');
  if (isNotTargetProject) {
    vscode.commands.executeCommand('iceworks-project-creator.start');
  }
}
