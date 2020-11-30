import * as vscode from 'vscode';
import { createNpmCommand, checkPathExists, checkIsAliInternal, registerCommand } from '@iceworks/common-service';
import { dependencyDir, getProjectFramework, projectPath } from '@iceworks/project-service';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import services from '../services';
import { setDebugConfig } from '../debugConfig/index';
import showDefPublishEnvQuickPick from '../quickPicks/showDefPublishEnvQuickPick';
import executeCommand from '../commands/executeCommand';

let previewWebviewPanel: vscode.WebviewPanel | undefined;

export default async function createEditorMenuAction(context: vscode.ExtensionContext, recorder) {
  const EDITOR_MENU_RUN_DEBUG = 'iceworksApp.editorMenu.runDebug';
  registerCommand(EDITOR_MENU_RUN_DEBUG, async () => {
    // Check dependences
    if (!(await checkPathExists(projectPath, dependencyDir))) {
      vscode.window.showInformationMessage('"node_modules" directory not found! Install dependencies first.');
      executeCommand({
        command: EDITOR_MENU_RUN_DEBUG,
        title: 'Run Install',
        arguments: [projectPath, createNpmCommand('run', 'start')],
      });
      return;
    }

    if (await getProjectFramework() === 'rax-app') {
      // Rax project preview
      const { window } = vscode;
      const { extensionPath } = context;

      executeCommand({
        command: EDITOR_MENU_RUN_DEBUG,
        title: 'Run Start',
        arguments: [projectPath, createNpmCommand('run', 'start')],
      });

      setTimeout(() => {
        if (previewWebviewPanel) {
          previewWebviewPanel.reveal();
        }

        previewWebviewPanel = window.createWebviewPanel('iceworks', 'Preview', vscode.ViewColumn.Two, {
          enableScripts: true,
          retainContextWhenHidden: true,
        });

        const extraHtml = '<script>window.__URL__ = \'http://localhost:3334\';</script>';

        previewWebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'preview', false, undefined, extraHtml);
        previewWebviewPanel.onDidDispose(
          () => {
            previewWebviewPanel = undefined;
          },
          null,
          context.subscriptions,
        );
        connectService(previewWebviewPanel, context, { services, recorder });
      }, 5000);
    } else {
      // Prepare VS Code debug config
      await setDebugConfig();

      // Run Debug
      let workspaceFolder;
      if (vscode.workspace.workspaceFolders) {
        workspaceFolder = vscode.workspace.workspaceFolders[0];
      }
      vscode.debug.startDebugging(workspaceFolder, 'Iceworks Debug');
    }
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
