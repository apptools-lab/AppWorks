import * as vscode from 'vscode';
import { createNpmCommand, checkPathExists } from '@iceworks/common-service';
import { dependencyDir } from '@iceworks/project-service';
import { editorTitleRunDevCommandId, editorTitleRunBuildCommandId } from './constants';
import { ITerminalMap } from './types';
import showDefPublishEnvQuickPick from './quickPicks/showDefPublishEnvQuickPick';
import executeCommand from './commands/executeCommand';
import stopCommand from './commands/stopCommand';

export default function createEditorMenuAction(
  rootPath: string,
  terminals: ITerminalMap,
  isAliInternal: boolean,
) {
  vscode.commands.registerCommand('iceworksApp.npmScripts.runDev', async () => {
    const pathExists = await checkPathExists(rootPath, dependencyDir);
    const command: vscode.Command = {
      command: 'iceworksApp.npmScripts.runDev',
      title: 'Run Dev',
      arguments: [rootPath, createNpmCommand('run', 'start')],
    };
    const commandId = editorTitleRunDevCommandId;
    if (!pathExists) {
      command.arguments = [rootPath, `${createNpmCommand('install')} && ${command.arguments![1]}`];
      executeCommand(terminals, command, commandId);
      return;
    }
    executeCommand(terminals, command, commandId);
    vscode.commands.executeCommand('setContext', 'iceworks:isRunningDev', true);
  });

  vscode.commands.registerCommand('iceworksApp.npmScripts.stopDev', () => {
    stopCommand(terminals, editorTitleRunDevCommandId);
    vscode.commands.executeCommand('setContext', 'iceworks:isRunningDev', false);
  });

  if (isAliInternal) {
    vscode.commands.registerCommand('iceworksApp.DefPublish', () => {
      showDefPublishEnvQuickPick(terminals, rootPath);
    })
  } else {
    vscode.commands.registerCommand('iceworksApp.npmScripts.runBuild', async () => {
      const pathExists = await checkPathExists(rootPath, dependencyDir);
      const command: vscode.Command = {
        command: 'iceworksApp.npmScripts.runBuild',
        title: 'Run Build',
        arguments: [rootPath, createNpmCommand('run', 'build')],
      };
      const commandId = editorTitleRunBuildCommandId;
      if (!pathExists) {
        command.arguments = [rootPath, `${createNpmCommand('install')} && ${command.arguments![1]}`];
        executeCommand(terminals, command, commandId);
        return;
      }
      executeCommand(terminals, command, commandId);
    });
  }
}