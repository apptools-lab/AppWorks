import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtensionConfiguration, Logger } from '@iceworks/common-service';
import services from './services/index';

// eslint-disable-next-line
const { name, version } = require('../package.json');

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions, globalState } = context;

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

  function activeWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel('iceworks', '创建应用', ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    webviewPanel.webview.html = getHtmlForWebview(extensionPath);
    connectService(webviewPanel.webview, context, { services, logger });
  }

  subscriptions.push(vscode.commands.registerCommand('iceworks-project-creator.start', function () {
    activeWebview();
  }));
}
