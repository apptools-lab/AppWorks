import * as vscode from 'vscode';
import { checkIsTargetProjectType } from '@iceworks/project-service';
import { didShowWelcomePageStateKey } from '@iceworks/common-service';

export const didShowWelcomePageBySidebarStateKey = 'iceworks.didShowWelcomePageBySidebar';

export default async function (context: vscode.ExtensionContext) {
  const { globalState } = context;
  const isTargetProjectType = await checkIsTargetProjectType();
  if (!isTargetProjectType) {
    vscode.commands.executeCommand('iceworks-project-creator.create-project.start');
  } else if (!globalState.get(didShowWelcomePageStateKey) && !globalState.get(didShowWelcomePageBySidebarStateKey)) {
    vscode.commands.executeCommand('iceworksApp.welcome.start');
    globalState.update(didShowWelcomePageBySidebarStateKey, true);
  }
}
