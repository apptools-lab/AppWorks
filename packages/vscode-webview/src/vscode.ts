/* eslint-disable prefer-template */
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
  const { extensionPath } = context;
  const { title, services } = config;

  const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel('iceworks', title, ViewColumn.One, {
    enableScripts: true,
    retainContextWhenHidden: false,
  });
  webviewPanel.webview.html = getHtmlForWebview(extensionPath);
  connectService(webviewPanel, context, services);
}

export function connectService(
  webviewPanel: vscode.WebviewPanel,
  context: vscode.ExtensionContext,
  { services, recorder }
) {
  const { subscriptions } = context;
  const { webview } = webviewPanel;
  webview.onDidReceiveMessage(
    async (message: IMessage) => {
      const { service, method, eventId, args } = message;
      // @ts-ignore
      const api = services && services[service] && services[service][method];
      console.log('onDidReceiveMessage', message);
      if (api) {
        try {
          recorder.record({
            module: service,
            action: method,
            data: args.length === 1 ? args[0] : args,
          });
          // set the optional param to undefined
          const fillApiArgLength = api.length - args.length;
          const newArgs = fillApiArgLength > 0 ? args.concat(Array(fillApiArgLength).fill(undefined)) : args;
          /**
           how to get the context and webviewPanel params? for examples
             api(arg1, ...args) {
              const [context, webviewPanel] = args;
             }
          */
          const result = await api(...newArgs, context, webviewPanel);
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

const DEFAULT_ENTRY = 'index';
export function getHtmlForWebview(extensionPath: string, entryName?: string, needVendor?: boolean): string {
  entryName = entryName || DEFAULT_ENTRY;
  const basePath = path.join(extensionPath, 'build/');
  const scriptPathOnDisk = vscode.Uri.file(path.join(basePath, `js/${entryName}.js`));
  const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
  const stylePathOnDisk = vscode.Uri.file(path.join(basePath, `css/${entryName}.css`));
  const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });

  // vendor for MPA
  const vendorStylePathOnDisk = vscode.Uri.file(path.join(basePath, 'css/vendor.css'));
  const vendorStyleUri = vendorStylePathOnDisk.with({ scheme: 'vscode-resource' });
  const vendorScriptPathOnDisk = vscode.Uri.file(path.join(basePath, 'js/vendor.js'));
  const vendorScriptUri = vendorScriptPathOnDisk.with({ scheme: 'vscode-resource' });

  // Use a nonce to whitelist which scripts can be run
  const nonce = getNonce();

  const fileContent =
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <title>Iceworks</title>
      ` +
    (needVendor ? `<link rel="stylesheet" type="text/css" href="${vendorStyleUri}" />` : '') +
    `
      <link rel="stylesheet" type="text/css" href="${styleUri}">
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="ice-container"></div>
      <script nonce="${nonce}" src="${vendorScriptUri}"></script>
      ` +
    (needVendor ? `<script nonce="${nonce}" src="${scriptUri}"></script>` : '') +
    `
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
