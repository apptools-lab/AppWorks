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

  if (!rootPath) {
    vscode.window.showInformationMessage('当前工作区为空，请打开项目或新建项目。');
    vscode.commands.executeCommand('setContext', 'iceworks:isNotTargetProject', true);
    return;
  }
  try {
    const projectType = await getProjectType();
    vscode.commands.executeCommand('setContext', 'iceworks:isNotTargetProject', projectType === 'unknown');
  } catch (e) {
    vscode.commands.executeCommand('setContext', 'iceworks:isNotTargetProject', true);
  }

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
  // auto set configuration
  initExtensionConfiguration(globalState);

  const terminals: ITerminalMap = new Map<string, Terminal>();
  // init tree data providers
  createNpmScriptsTreeProvider(context, rootPath, terminals);
  createComponentsTreeProvider(context, rootPath);
  createPagesTreeProvider(context, rootPath);
  createNodeDependenciesTreeProvider(context, rootPath, terminals);
  function activeWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel('iceworks', '设置面板', ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    webviewPanel.webview.html = getHtmlForWebview(extensionPath);
    connectService(webviewPanel.webview, subscriptions, { services, logger });
  }

  subscriptions.push(vscode.commands.registerCommand('iceworksApp.configHelper.start', function () {
    activeWebview();
  }));
}
