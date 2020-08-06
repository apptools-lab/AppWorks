import * as vscode from 'vscode';
import { createNpmCommand, checkPathExists, checkIsAliInternal, registerCommand } from '@iceworks/common-service';
import { dependencyDir, projectPath } from '@iceworks/project-service';
import { setDebugConfig } from './debugConfig/index';
import { editorTitleRunDebugCommandId, editorTitleRunBuildCommandId } from './constants';
import { ITerminalMap } from './types';
import showDefPublishEnvQuickPick from './quickPicks/showDefPublishEnvQuickPick';
import executeCommand from './commands/executeCommand';

export default async function createEditorMenuAction(terminals: ITerminalMap) {
  const EDITOR_MENU_RUN_DEBUG = 'iceworksApp.editorMenu.runDebug';
  registerCommand(EDITOR_MENU_RUN_DEBUG, async () => {
    // Check dependences
    if (!(await checkPathExists(projectPath, dependencyDir))) {
      vscode.window.showInformationMessage('"node_modules" directory not found! Install dependencies first.');
      executeCommand(
        terminals,
        {
          command: EDITOR_MENU_RUN_DEBUG,
          title: 'Run Install',
          arguments: [projectPath, createNpmCommand('install')],
        },
        editorTitleRunDebugCommandId
      );
      return;
    }

    // Prepare VS Code debug config
    setDebugConfig();

    // Run Debug
    let workspaceFolder;
    if (vscode.workspace.workspaceFolders) {
      workspaceFolder = vscode.workspace.workspaceFolders[0];
    }
    vscode.debug.startDebugging(workspaceFolder, 'Iceworks Debug');
  });

  const isAliInternal = await checkIsAliInternal();
  if (isAliInternal) {
    registerCommand('iceworksApp.editorMenu.DefPublish', () => {
      showDefPublishEnvQuickPick(terminals);
    });
  } else {
    const EDITOR_MENU_RUN_BUILD = 'iceworksApp.editorMenu.runBuild';
    registerCommand(EDITOR_MENU_RUN_BUILD, async () => {
      const pathExists = await checkPathExists(projectPath, dependencyDir);
      const command: vscode.Command = {
        command: EDITOR_MENU_RUN_BUILD,
        title: 'Run Build',
        arguments: [projectPath, createNpmCommand('run', 'build')],
      };
      const commandId = editorTitleRunBuildCommandId;
      if (!pathExists) {
        command.arguments = [projectPath, `${createNpmCommand('install')} && ${command.arguments![1]}`];
        executeCommand(terminals, command, commandId);
        return;
      }
      executeCommand(terminals, command, commandId);
    });
  }
}
