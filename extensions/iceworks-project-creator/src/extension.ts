import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import services from './services/index';

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions } = context;

  function activeWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel('iceworks', '创建项目', ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    webviewPanel.webview.html = getHtmlForWebview(extensionPath);
    connectService(webviewPanel.webview, subscriptions, services);
  }

  context.subscriptions.push(vscode.commands.registerCommand('iceworks-project-creator.start', function () {
    activeWebview();
  }));
}
