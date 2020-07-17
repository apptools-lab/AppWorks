import * as vscode from 'vscode';
import _i18n from '@iceworks/i18n';
import { Terminal, window, ViewColumn } from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { getProjectType } from '@iceworks/project-service';
import { initExtension, Logger, checkIsAliInternal } from '@iceworks/common-service';
import { createNpmScriptsTreeProvider } from './views/npmScriptsView';
import { createNodeDependenciesTreeProvider } from './views/nodeDependenciesView';
import { createComponentsTreeProvider } from './views/componentsView';
import { createPagesTreeProvider } from './views/pagesView';
import { ITerminalMap } from './types';
import services from './services';
import { showExtensionsQuickPickCommandId } from './constants';
import showExtensionsQuickPick from './quickPicks/showExtensionsQuickPick';
import showDefPublishEnvQuickPick from './quickPicks/showDefPublishEnvQuickPick';
import createExtensionsStatusBar from './statusBar/createExtensionsStatusBar';

import * as zhCNTextMap from './locales/zh-CN.json';
import * as enUSTextMap from './locales/en-US.json';

// eslint-disable-next-line
const { name, version } = require('../package.json');
export const i18n = _i18n;
export async function activate(context: vscode.ExtensionContext) {
  const { globalState, subscriptions, extensionPath } = context;
  const rootPath = vscode.workspace.rootPath;
  
  // set I18n
  i18n.registry('zh-CN',zhCNTextMap);
  i18n.registry('en',enUSTextMap);
  i18n.setLocal(vscode.env.language);
  
  // data collection
  const logger = new Logger(name, globalState);
  logger.recordDAU();
  logger.recordActivate(version);

  // auto set configuration
  initExtension(context);

  // init statusBarItem
  const extensionsStatusBar = createExtensionsStatusBar();
  subscriptions.push(vscode.commands.registerCommand(showExtensionsQuickPickCommandId, showExtensionsQuickPick));
  subscriptions.push(extensionsStatusBar);
  // init webview
  function activeWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel('iceworks', '设置 - Iceworks', ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    webviewPanel.webview.html = getHtmlForWebview(extensionPath);
    connectService(webviewPanel, context, { services, logger });
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
    if (isNotTargetProject) {
      vscode.commands.executeCommand('iceworks-project-creator.start');
    }
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
  // show script icons in editor title menu
  vscode.commands.executeCommand('setContext', 'iceworks:showScriptIconInEditorTitleMenu', true);
  const isAliInternal = await checkIsAliInternal();
  // DEF publish command in editor title
  vscode.commands.executeCommand('setContext', 'iceworks:isAliInternal', isAliInternal);
  if (isAliInternal) {
    context.subscriptions.push(vscode.commands.registerCommand('iceworksApp.DefPublish', () => showDefPublishEnvQuickPick(terminals, rootPath)));
  }
}
