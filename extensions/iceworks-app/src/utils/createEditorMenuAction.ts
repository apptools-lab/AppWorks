import * as vscode from 'vscode';
import { createNpmCommand, checkPathExists, checkIsAliInternal, registerCommand } from '@iceworks/common-service';
import { dependencyDir, projectPath } from '@iceworks/project-service';
import showDefPublishEnvQuickPick from '../quickPicks/showDefPublishEnvQuickPick';
import executeCommand from '../commands/executeCommand';

export default async function createEditorMenuAction() {
  const EDITOR_MENU_RUN_DEBUG = 'iceworksApp.editorMenu.runDebug';
  registerCommand(EDITOR_MENU_RUN_DEBUG, async () => {
    // Check dependences
    if (!(await checkPathExists(projectPath, dependencyDir))) {
      vscode.window.showInformationMessage('"node_modules" directory not found! Install dependencies first.');
      executeCommand({
        command: EDITOR_MENU_RUN_DEBUG,
        title: 'Run Install',
        arguments: [projectPath, createNpmCommand('install')],
      });
      return;
    }

    // npm run start.
    // Debug in VS Code move to iceworks docs.
    executeCommand({
      command: EDITOR_MENU_RUN_DEBUG,
      title: 'Run Start',
      arguments: [projectPath, createNpmCommand('run', 'start')],
    });
  });

  const EDITOR_MENU_RUN_BUILD = 'iceworksApp.editorMenu.runBuild';
  registerCommand(EDITOR_MENU_RUN_BUILD, async () => {
    const pathExists = await checkPathExists(projectPath, dependencyDir);
    const command: vscode.Command = {
      command: EDITOR_MENU_RUN_BUILD,
      title: 'Run Build',
      arguments: [projectPath, createNpmCommand('run', 'build')],
    };
    if (!pathExists) {
      command.arguments = [projectPath, `${createNpmCommand('install')} && ${command.arguments![1]}`];
      executeCommand(command);
      return;
    }
    executeCommand(command);
  });

  const isAliInternal = await checkIsAliInternal();
  if (isAliInternal) {
    registerCommand('iceworksApp.editorMenu.DefPublish', () => {
      showDefPublishEnvQuickPick();
    });
  }
}
