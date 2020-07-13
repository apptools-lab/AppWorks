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
  function activeWebview() {
    let columnToShowIn = ViewColumn.One;
    let layout = { orientation: 0, groups: [{}] };

    if (window.activeTextEditor) {
      columnToShowIn = ViewColumn.Beside;
      layout = { orientation: 0, groups: [{ size: 0.7 }, { size: 0.3 }] };
    }

    const webviewPanel = window.createWebviewPanel('Iceworks', '使用物料 - Iceworks', { viewColumn: columnToShowIn, preserveFocus: true }, {
      enableScripts: true,
      retainContextWhenHidden: true,
      enableFindWidget: true,
    });
    webviewPanel.webview.html = getHtmlForWebview(extensionPath);

    vscode.commands.executeCommand('vscode.setEditorLayout', layout);

    connectService(webviewPanel, context, { services, logger });
  }
  subscriptions.push(vscode.commands.registerCommand('iceworks-material-import.start', function () {
    activeWebview();
  }));
}
