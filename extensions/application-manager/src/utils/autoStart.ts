import * as vscode from 'vscode';
import { checkIsTargetProjectType } from '@appworks/project-service';
import { didShowWelcomePageStateKey } from '@appworks/common-service';

export const didShowWelcomePageBySidebarStateKey = 'appworks.didShowWelcomePageBySidebar';

export default async function (context: vscode.ExtensionContext) {
  const { globalState } = context;
  const isTargetProjectType = await checkIsTargetProjectType();
  if (!isTargetProjectType) {
    vscode.commands.executeCommand('project-creator.create-project.start');
  } else if (!globalState.get(didShowWelcomePageStateKey) && !globalState.get(didShowWelcomePageBySidebarStateKey)) {
    vscode.commands.executeCommand('applicationManager.welcome.start');
    globalState.update(didShowWelcomePageBySidebarStateKey, true);
  }
}
