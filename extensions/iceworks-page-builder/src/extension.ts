import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { autoSetNpmConfiguration } from '@iceworks/common-service';
import services from './services/index';

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions } = context;

  console.log('Congratulations, your extension "iceworks-page-builder" is now active!');

  autoSetNpmConfiguration(context.globalState);

  function activeWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel('iceworks', '创建页面', ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    webviewPanel.webview.html = '';
    connectService(webviewPanel.webview, subscriptions, services);
  }
  context.subscriptions.push(vscode.commands.registerCommand('iceworks-page-builder.create', function () {
    activeWebview();
  }));
}

export function deactivate() { }
