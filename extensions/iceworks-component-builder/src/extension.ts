import * as vscode from 'vscode';
import * as path from 'path';
import { connectService } from '@iceworks/vscode-webview/lib/vscode';
import { autoSetNpmConfiguration } from '@iceworks/common-service';
import services from './services/index';

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions } = context;

  console.log('Congratulations, your extension "iceworks-component-builder" is now active!');

  autoSetNpmConfiguration(context.globalState);

  function activeWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel('iceworks', '生成组件', ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    const basePath = path.join(extensionPath, 'build/');

    const scriptPathOnDisk = vscode.Uri.file(path.join(basePath, 'js/index.js'));
    const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
    const stylePathOnDisk = vscode.Uri.file(path.join(basePath, 'css/index.css'));
    const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });
    webviewPanel.webview.html = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <title>Iceworks</title>
      <link rel="stylesheet" type="text/css" href="${styleUri}">
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="ice-container"></div>
      <script nonce="${getNonce()}" src="${scriptUri}"></script>
    </body>
    </html>
    `;
    connectService(webviewPanel.webview, subscriptions, services);
  }
  context.subscriptions.push(vscode.commands.registerCommand('iceworks-component-builder.generate', function () {
    activeWebview();
  }));
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function deactivate() { }
