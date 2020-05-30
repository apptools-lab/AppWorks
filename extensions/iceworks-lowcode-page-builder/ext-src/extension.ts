// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import services from './services/index';

const { window, ViewColumn } = vscode;

interface IMessage {
  service: string;
  method: string;
  eventId: string;
  [propName: string]: any;
}

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath } = context;
  let webviewPanel: vscode.WebviewPanel;

	console.log('Congratulations, your extension "iceworks-lowcode-page-builder" is now active!');

  function activeWebview() {
    vscode.window.showInformationMessage('run iceworks example!');

    if (!webviewPanel) {
      webviewPanel = window.createWebviewPanel('iceworks', 'Create Page', ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: false,
      });
      webviewPanel.webview.html = getHtmlForWebview(extensionPath);
      webviewPanel.webview.onDidReceiveMessage(
        async (message: IMessage) => {
          const { service, method, eventId, args } = message;
          // @ts-ignore
          const api = services[service] && services[service][method];
          console.log('onDidReceiveMessage', message);
          if (api) {
            try {
              const result = args ? await api(...args) : await api();
              console.log('invoke service result', result);
              webviewPanel.webview.postMessage({ eventId, result });
            } catch(err) {
              console.error('invoke service error', err);
              webviewPanel.webview.postMessage({ eventId, errorMessage: err.message });
            }
          } else {
            vscode.window.showErrorMessage(`invalid command ${message}`);
          }
        },
        undefined,
        context.subscriptions
      );
    }
  }
  context.subscriptions.push(vscode.commands.registerCommand('iceworks-lowcode-page-builder.create', function() {
    activeWebview();
  }));
}

export function deactivate() {}

function getHtmlForWebview(extensionPath: string): string {
  const basePath = path.join(extensionPath, 'build/');

  const scriptPathOnDisk = vscode.Uri.file(path.join(basePath, 'js/index.js'));
  const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
  const stylePathOnDisk = vscode.Uri.file(path.join(basePath, 'css/index.css'));
  const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });

  // Use a nonce to whitelist which scripts can be run
  const nonce = getNonce();

  return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <title>React App</title>
      <link rel="stylesheet" type="text/css" href="${styleUri}">
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="ice-container"></div>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
