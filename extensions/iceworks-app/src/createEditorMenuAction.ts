import * as vscode from 'vscode';
import { createNpmCommand, checkPathExists, checkIsAliInternal, registerCommand } from '@iceworks/common-service';
import { dependencyDir, projectPath } from '@iceworks/project-service';
import { editorTitleRunDevCommandId, editorTitleRunBuildCommandId } from './constants';
import { ITerminalMap } from './types';
import showDefPublishEnvQuickPick from './quickPicks/showDefPublishEnvQuickPick';
import executeCommand from './commands/executeCommand';

export default async function createEditorMenuAction(
  terminals: ITerminalMap
) {
  const EDITOR_MENU_RUN_DEV = 'iceworksApp.editorMenu.runDev';
  registerCommand(EDITOR_MENU_RUN_DEV, async () => {
    const pathExists = await checkPathExists(projectPath, dependencyDir);
    const command: vscode.Command = {
      command: EDITOR_MENU_RUN_DEV,
      title: 'Run Dev',
      arguments: [projectPath, createNpmCommand('run', 'start')],
    };
    const commandId = editorTitleRunDevCommandId;
    if (!pathExists) {
      command.arguments = [projectPath, `${createNpmCommand('install')} && ${command.arguments![1]}`];
      executeCommand(terminals, command, commandId);
      return;
    }
    executeCommand(terminals, command, commandId);
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
