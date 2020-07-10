import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension, Logger } from '@iceworks/common-service';
import services from './services/index';

// eslint-disable-next-line
const { name, version } = require('../package.json');

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions, globalState } = context;

  // data collection
  const logger = new Logger(name, globalState);

  // auto set configuration
  initExtension(context);

  let webviewPanel: vscode.WebviewPanel;

  function activeWebview() {
    logger.recordDAU();
    logger.recordActivate(version);

    if (webviewPanel) {
      webviewPanel.reveal();
    } else {
      webviewPanel = window.createWebviewPanel('iceworks', '创建应用 - Iceworks', ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true,
      });
      webviewPanel.webview.html = getHtmlForWebview(extensionPath);
      connectService(webviewPanel, context, { services, logger });
    }
  }

  subscriptions.push(vscode.commands.registerCommand('iceworks-project-creator.start', function () {
    activeWebview();
  }));

  const stateKey = 'iceworks.projectCreator.autoActivedWebview';
  if (!globalState.get(stateKey)) {
    activeWebview();
    globalState.update(stateKey, true);
  }
}
