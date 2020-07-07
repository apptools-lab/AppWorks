import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension, Logger } from '@iceworks/common-service';
import services from './services/index';

// eslint-disable-next-line
const { name, version } = require('../package.json');

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions, globalState } = context;

  console.log('Congratulations, your extension "iceworks-material-import" is now active!');
  // data collection
  const logger = new Logger(name, globalState);
  logger.recordDAU();
  logger.recordActivate(version);
  // auto set configuration
  initExtension(context);
  // init webview
  const columnToShowIn = vscode.window.activeTextEditor
    ? ViewColumn.Two
    : ViewColumn.One;
  const layout = { orientation: 0, groups: [{ size: 0.8 }, { size: 0.2 }] };
  vscode.commands.executeCommand('vscode.setEditorLayout', layout);
  function activeWebview() {
    const webviewPanel = window.createWebviewPanel('Iceworks', '使用物料 - Iceworks', { viewColumn: columnToShowIn, preserveFocus: true }, {
      enableScripts: true,
      retainContextWhenHidden: true,
      enableFindWidget: true,
    });
    webviewPanel.webview.html = getHtmlForWebview(extensionPath);
    webviewPanel.onDidChangeViewState((e: vscode.WebviewPanelOnDidChangeViewStateEvent) => {

    })
    webviewPanel.onDidDispose(() => {
      vscode.window.showInformationMessage('1234567890')
    })
    connectService(webviewPanel, context, { services, logger });
  }
  subscriptions.push(vscode.commands.registerCommand('iceworks-material-import.start', function () {
    activeWebview();
  }));
}
