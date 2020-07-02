import * as vscode from 'vscode';
import { Terminal, window, ViewColumn } from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { getProjectType } from '@iceworks/project-service';
import { initExtensionConfiguration, Logger } from '@iceworks/common-service';
import { createNpmScriptsTreeProvider } from './views/npmScriptsView';
import { createNodeDependenciesTreeProvider } from './views/nodeDependenciesView';
import { createComponentsTreeProvider } from './views/componentsView';
import { createPagesTreeProvider } from './views/pagesView';
import { ITerminalMap } from './types';
import services from './services';

// eslint-disable-next-line
const { name, version } = require('../package.json');

export async function activate(context: vscode.ExtensionContext) {
  const { globalState, subscriptions, extensionPath } = context;
  const rootPath = vscode.workspace.rootPath;
  // auto set configuration
  initExtensionConfiguration(globalState);
  // data collection
  const logger = new Logger(name, globalState);
  logger.recordDAU();
  logger.recordOnce({
    module: 'main',
    action: 'activate',
    data: {
      version,
    }
  });
  // init webview
  function activeWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel('iceworks', 'Iceworks 设置', ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    webviewPanel.webview.html = getHtmlForWebview(extensionPath);
    connectService(webviewPanel.webview, subscriptions, { services, logger });
  }

  subscriptions.push(vscode.commands.registerCommand('iceworksApp.configHelper.start', function () {
    activeWebview();
  }));

  if (!rootPath) {
    vscode.window.showInformationMessage('当前工作区为空，请打开应用或新建应用。');
    vscode.commands.executeCommand('setContext', 'iceworks:isNotTargetProject', true);
    vscode.commands.executeCommand('iceworks-project-creator.start');
    return;
  }
  try {
    const projectType = await getProjectType();
    const isNotTargetProject = projectType === 'unknown';
    vscode.commands.executeCommand('setContext', 'iceworks:isNotTargetProject', isNotTargetProject);
    if (isNotTargetProject)
      vscode.commands.executeCommand('iceworks-project-creator.start');
  } catch (e) {
    vscode.commands.executeCommand('setContext', 'iceworks:isNotTargetProject', true);
    vscode.commands.executeCommand('iceworks-project-creator.start');
  }
  const terminals: ITerminalMap = new Map<string, Terminal>();
  // init tree data providers
  createNpmScriptsTreeProvider(context, rootPath, terminals);
  createComponentsTreeProvider(context, rootPath);
  createPagesTreeProvider(context, rootPath);
  createNodeDependenciesTreeProvider(context, rootPath, terminals);
}
