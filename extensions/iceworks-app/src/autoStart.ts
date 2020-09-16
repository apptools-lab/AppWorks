import * as vscode from 'vscode';
import { checkIsNotTarget } from '@iceworks/project-service';

export default async function () {
  const isNotTargetProject = await checkIsNotTarget();
  if (isNotTargetProject) {
    vscode.commands.executeCommand('iceworks-project-creator.start');
  } else {
    vscode.commands.executeCommand('iceworks-doctor.dashboard');
  }
}
