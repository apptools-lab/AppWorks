import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { autoSetNpmConfiguration, Logger } from '@iceworks/common-service';
import services from './services/index';

// eslint-disable-next-line
const packageJSON = require('../package.json');

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions, globalState } = context;
  const logger = new Logger(globalState, { namespace: packageJSON.name, version: packageJSON.version });
  logger.dau();
  logger.log({
    module: 'main',
    action: 'activate'
  });

  console.log('Congratulations, your extension "iceworks-page-builder" is now active!');

  autoSetNpmConfiguration(globalState);

  function activeWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel('iceworks', '创建页面', ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    webviewPanel.webview.html = getHtmlForWebview(extensionPath);
    connectService(webviewPanel.webview, subscriptions, { services, logger });
  }
  subscriptions.push(vscode.commands.registerCommand('iceworks-page-builder.create', function () {
    activeWebview();
  }));
}

export function deactivate() { }
