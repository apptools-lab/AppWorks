import * as vscode from 'vscode';
import { createNpmCommand, checkPathExists } from '@iceworks/common-service';
import { Recorder, recordDAU } from '@iceworks/recorder';
import { dependencyDir } from '@iceworks/project-service';
import { editorTitleRunDevCommandId, editorTitleRunBuildCommandId } from './constants';
import { ITerminalMap } from './types';
import showDefPublishEnvQuickPick from './quickPicks/showDefPublishEnvQuickPick';
import executeCommand from './commands/executeCommand';

export default function createEditorMenuAction(rootPath: string, terminals: ITerminalMap, isAliInternal: boolean, recorder: Recorder) {
  vscode.commands.registerCommand('iceworksApp.npmScripts.runDev', async () => {
    // data collection
    recordDAU();
    recorder.recordActivate();

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
  });

  if (isAliInternal) {
    vscode.commands.registerCommand('iceworksApp.DefPublish', () => {
      // data collection
      recordDAU();
      recorder.recordActivate();

      showDefPublishEnvQuickPick(terminals, rootPath);
    });
  } else {
    vscode.commands.registerCommand('iceworksApp.npmScripts.runBuild', async () => {
      // data collection
      recordDAU();
      recorder.recordActivate();

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
