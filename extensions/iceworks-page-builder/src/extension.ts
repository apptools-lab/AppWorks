import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension, Logger } from '@iceworks/common-service';
import services from './services/index';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions, globalState } = context;

  console.log('Congratulations, your extension "iceworks-page-builder" is now active!');

  // data collection
  const logger = new Logger(name, globalState);
  logger.recordMainDAU();
  logger.recordExtensionActivate(version);

  // auto set configuration
  initExtension(context);

  function activeWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel('iceworks', i18n.format('extension.iceworksPageBuilder.extensnion.webViewTitle'), ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    webviewPanel.webview.html = getHtmlForWebview(extensionPath);
    connectService(webviewPanel, context, { services, logger });
  }
  subscriptions.push(vscode.commands.registerCommand('iceworks-page-builder.create', function () {
    activeWebview();
  }));
}

export function deactivate() { }
