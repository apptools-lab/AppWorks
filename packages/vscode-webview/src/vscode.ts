import * as vscode from 'vscode';
import * as path from 'path';

const { window, ViewColumn } = vscode;

interface IMessage {
  service: string;
  method: string;
  eventId: string;
  [propName: string]: any;
}

interface IConfig {
  title: string;
  services?: any;
}

export function active(context: vscode.ExtensionContext, config?: IConfig) {
  const { extensionPath, subscriptions } = context;
  const { title, services } = config;

  const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel('iceworks', title, ViewColumn.One, {
    enableScripts: true,
    retainContextWhenHidden: false,
  });
  webviewPanel.webview.html = getHtmlForWebview(extensionPath);
  connectService(webviewPanel.webview, subscriptions, services);
}

export function connectService(webview, subscriptions, { services, logger }) {
  webview.onDidReceiveMessage(
    async (message: IMessage) => {
      const { service, method, eventId, args } = message;
      // @ts-ignore
      const api = services && services[service] && services[service][method];
      console.log('onDidReceiveMessage', message);
      if (api) {
        try {
          logger.log({
            module: service,
            action:method,
          });
          const result = args ? await api(...args) : await api();
          console.log('invoke service result', result);
          webview.postMessage({ eventId, result });
        } catch (err) {
          console.error('invoke service error', err);
          webview.postMessage({ eventId, errorMessage: err.message });
        }
      } else {
        vscode.window.showErrorMessage(`invalid command ${message}`);
      }
    },
    undefined,
    subscriptions
  );
}

export function getHtmlForWebview(extensionPath: string): string {
  const basePath = path.join(extensionPath, 'build/');

  const scriptPathOnDisk = vscode.Uri.file(path.join(basePath, 'js/index.js'));
  const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
  const stylePathOnDisk = vscode.Uri.file(path.join(basePath, 'css/index.css'));
  const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });

  // Use a nonce to whitelist which scripts can be run
  const nonce = getNonce();

  const fileContent = `<!DOCTYPE html>
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
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
  </html>`;
  return fileContent;
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
