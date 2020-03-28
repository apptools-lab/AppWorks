import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as ejs from 'ejs';

interface IMessage {
  command: string;
  [propName: string]: any;
}

export function activate(context: vscode.ExtensionContext): void {
  const { extensionPath } = context;
  const { env, commands, window, ProgressLocation, Uri, ViewColumn } = vscode;

  // function disposeWebview() {
  //   if (webviewPanel) {
  //     webviewPanel.dispose();
  //     webviewPanel = null;
  //   }
  // }
  // context.subscriptions.push(vscode.commands.registerCommand('iceworks', function() {
  vscode.window.showInformationMessage('run iceworks example!');

  // disposeWebview();

  let webviewPanel: vscode.WebviewPanel = null;
  webviewPanel = window.createWebviewPanel('react', 'React', ViewColumn.One, {
    // Enable javascript in the webview
    enableScripts: true,
    // And restric the webview to only loading content from our extension's `media` directory.
    // localResourceRoots: [vscode.Uri.file(path.join(this._extensionPath, 'build'))]
  });
  webviewPanel.webview.html = getHtmlForWebview(extensionPath);

  webviewPanel.webview.onDidReceiveMessage(
    (message: IMessage) => {
      if (message.command === 'alert') {
        vscode.window.showErrorMessage(message.text);
      }
    },
    undefined,
    context.subscriptions
  );
  // }));
}

function getHtmlForWebview(extensionPath) {
  const basePath = path.join(extensionPath, 'out/assets/');

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

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
