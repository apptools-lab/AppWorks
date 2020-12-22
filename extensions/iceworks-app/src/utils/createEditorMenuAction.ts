import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';
import { createNpmCommand, checkPathExists, checkIsAliInternal, registerCommand } from '@iceworks/common-service';
import { checkIsPegasusProject, dependencyDir, getProjectFramework, projectPath } from '@iceworks/project-service';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { DEFAULT_START_URL, IDevServerStartInfo, getDevServerStartInfo } from './getDevServerStartInfo';
import services from '../services';
import showDefPublishEnvQuickPick from '../quickPicks/showDefPublishEnvQuickPick';
import executeCommand from '../commands/executeCommand';

let previewWebviewPanel: vscode.WebviewPanel | undefined;

export default async function createEditorMenuAction(context: vscode.ExtensionContext, recorder) {
  const { window } = vscode;
  const { extensionPath } = context;

  function openPreview(startInfo?: IDevServerStartInfo) {
    if (!startInfo) {
      return;
    }

    if (previewWebviewPanel) {
      previewWebviewPanel.reveal();
    }

    previewWebviewPanel = window.createWebviewPanel('iceworks', 'Preview', vscode.ViewColumn.Two, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });

    const extraHtml = `<script>window.__PREVIEW__DATA__ = ${JSON.stringify(startInfo || { startUrl: DEFAULT_START_URL })};</script>`;

    previewWebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'preview', false, undefined, extraHtml);
    previewWebviewPanel.onDidDispose(
      () => {
        previewWebviewPanel = undefined;
      },
      null,
      context.subscriptions,
    );
    connectService(previewWebviewPanel, context, { services, recorder });
  }

  const EDITOR_MENU_RUN_DEBUG = 'iceworksApp.editorMenu.runDebug';
  registerCommand(EDITOR_MENU_RUN_DEBUG, async () => {
    let shouldInstall = false;
    const isPegasusProject = await checkIsPegasusProject();

    // Check dependences
    if (!(await checkPathExists(projectPath, dependencyDir))) {
      shouldInstall = true;
      vscode.window.showInformationMessage('"node_modules" directory not found! Install dependencies first.');
      executeCommand({
        command: 'iceworksApp.npmScripts.run',
        title: 'Run Install',
        arguments: [projectPath, createNpmCommand('install'), 'Run Start'],
      });
    }

    // npm run start.
    // Debug in VS Code move to iceworks docs.
    executeCommand({
      command: 'iceworksApp.npmScripts.run',
      title: 'Run Start',
      arguments: [projectPath, createNpmCommand('run', 'start'), 'Run Start'],
    });

    if (await getProjectFramework() === 'rax-app') {
      const devServerStartInfo: IDevServerStartInfo | undefined = await getDevServerStartInfo(projectPath, shouldInstall ? 4 * 60000 : 2 * 60000);
      openPreview(devServerStartInfo);
    } else if (isPegasusProject) {
      // Set pegasus service url
      try {
        const abcConfigFile = path.join(projectPath, 'abc.json');
        if (fs.existsSync(abcConfigFile)) {
          const abcConfig = fs.readJSONSync(abcConfigFile);
          if (abcConfig.type === 'pegasus' && abcConfig.group && abcConfig.name) {
            setTimeout(() => {
              openPreview({ startUrl: `${DEFAULT_START_URL}${abcConfig.group}/${abcConfig.name}` });
            }, 10000);
          }
        }
      } catch (e) {
        // ignore
      }
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
      command.arguments = [projectPath, `${createNpmCommand('install')
      } && ${command.arguments![1]}`];
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
