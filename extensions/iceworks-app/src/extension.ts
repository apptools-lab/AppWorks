import * as vscode from 'vscode';
import { Terminal, window, ViewColumn } from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { getProjectType } from '@iceworks/project-service';
import { Recorder, recordDAU } from '@iceworks/recorder';
import { initExtension, checkIsAliInternal } from '@iceworks/common-service';
import { createNpmScriptsTreeProvider } from './views/npmScriptsView';
import { createNodeDependenciesTreeProvider } from './views/nodeDependenciesView';
import { createComponentsTreeProvider } from './views/componentsView';
import { createPagesTreeProvider } from './views/pagesView';
import { ITerminalMap } from './types';
import services from './services';
import { showExtensionsQuickPickCommandId } from './constants';
import showExtensionsQuickPick from './quickPicks/showExtensionsQuickPick';
import createEditorMenuAction from './createEditorMenuAction';
import createExtensionsStatusBar from './statusBar/createExtensionsStatusBar';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

export async function activate(context: vscode.ExtensionContext) {
  const { subscriptions, extensionPath } = context;
  const rootPath = vscode.workspace.rootPath;

  // auto set configuration
  initExtension(context);

  // init statusBarItem
  const extensionsStatusBar = createExtensionsStatusBar();
  subscriptions.push(vscode.commands.registerCommand(showExtensionsQuickPickCommandId, () => {
    // data collection
    recordDAU();
    recorder.recordActivate();

    showExtensionsQuickPick();
  }));

  subscriptions.push(extensionsStatusBar);
  // init webview
  function activeWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel(
      'iceworks',
      i18n.format('extension.iceworksApp.extension.title'),
      ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    webviewPanel.webview.html = getHtmlForWebview(extensionPath);
    connectService(webviewPanel, context, { services, recorder });
  }

  subscriptions.push(
    vscode.commands.registerCommand('iceworksApp.configHelper.start', function () {
      activeWebview();
    })
  );

  if (!rootPath) {
    window.showInformationMessage(i18n.format('extension.iceworksApp.extebsion.emptyWorkplace'));
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
  // remove terminal from terminals map
  window.onDidCloseTerminal((terminal) => {
    terminals.delete(terminal.name);
  });

  // init tree data providers
  createNpmScriptsTreeProvider(context, rootPath, terminals);
  createComponentsTreeProvider(context, rootPath);
  createPagesTreeProvider(context, rootPath);
  createNodeDependenciesTreeProvider(context, rootPath, terminals);

  // show script icons in editor title menu
  vscode.commands.executeCommand('setContext', 'iceworks:showScriptIconInEditorTitleMenu', true);
  const isAliInternal = await checkIsAliInternal();
  vscode.commands.executeCommand('setContext', 'iceworks:isAliInternal', isAliInternal);
  createEditorMenuAction(rootPath, terminals, isAliInternal, recorder);
}
