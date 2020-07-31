import * as vscode from 'vscode';
import { Terminal, window, ViewColumn } from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { getProjectType } from '@iceworks/project-service';
import { Recorder, recordDAU } from '@iceworks/recorder';
import { initExtension, checkIsAliInternal, registerCommand } from '@iceworks/common-service';
import { createNpmScriptsTreeView } from './views/npmScriptsView';
import { createNodeDependenciesTreeView } from './views/nodeDependenciesView';
import { createComponentsTreeView } from './views/componentsView';
import { createPagesTreeView } from './views/pagesView';
import { ITerminalMap } from './types';
import services from './services';
import { showExtensionsQuickPickCommandId } from './constants';
import showExtensionsQuickPick from './quickPicks/showExtensionsQuickPick';
import createEditorMenuAction from './createEditorMenuAction';
import createExtensionsStatusBar from './statusBar/createExtensionsStatusBar';
import autoSetViewContext from './autoSetViewContext';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

export async function activate(context: vscode.ExtensionContext) {
  const { subscriptions, extensionPath } = context;

  // auto set configuration
  initExtension(context);

  // init statusBarItem
  const extensionsStatusBar = createExtensionsStatusBar();
  subscriptions.push(extensionsStatusBar);
  subscriptions.push(registerCommand(showExtensionsQuickPickCommandId, () => {
    recorder.recordActivate();

    showExtensionsQuickPick();
  }));

  // init config webview
  let webviewPanel: vscode.WebviewPanel | undefined;
  function activeConfigWebview() {
    if (webviewPanel) {
      webviewPanel.reveal();
    } else {
      webviewPanel = window.createWebviewPanel(
        'iceworks',
        i18n.format('extension.iceworksApp.extension.title'),
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );
      webviewPanel.webview.html = getHtmlForWebview(extensionPath);
      webviewPanel.onDidDispose(
        () => {
          webviewPanel = undefined;
        },
        null,
        context.subscriptions
      );
      connectService(webviewPanel, context, { services, recorder });
    }
  }
  subscriptions.push(registerCommand('iceworksApp.configHelper.start', function () {
    recorder.recordActivate();
    activeConfigWebview();
  }));

  // init tree view
  const treeViews: any[] = [];
  const terminals: ITerminalMap = new Map<string, Terminal>();
  window.onDidCloseTerminal((terminal) => {
    terminals.delete(terminal.name);
  });
  treeViews.push(createNpmScriptsTreeView(context, terminals));
  treeViews.push(createComponentsTreeView(context));
  treeViews.push(createPagesTreeView(context));
  treeViews.push(createNodeDependenciesTreeView(context, terminals));
  let didSetViewContext;
  treeViews.forEach((treeView) => {
    treeView.onDidChangeVisibility(({ visible }) => {
      if (visible && !didSetViewContext) {
        didSetViewContext = true;
        autoSetViewContext();
      } 
    });
  });

  // init editor title menu
  const projectType = await getProjectType();
  if (projectType !== 'unknown') {
    vscode.commands.executeCommand('setContext', 'iceworks:isAliInternal', await checkIsAliInternal());
    vscode.commands.executeCommand('setContext', 'iceworks:showScriptIconInEditorTitleMenu', true);
    await createEditorMenuAction(terminals);
  }
}
