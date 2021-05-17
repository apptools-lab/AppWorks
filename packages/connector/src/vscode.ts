/* eslint-disable prefer-template */
import * as vscode from 'vscode';
import * as path from 'path';
import { record } from '@appworks/recorder';

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

interface IConnectServiceOptions {
  services: any;
  recorder?: any;
}

export function active(context: vscode.ExtensionContext, config?: IConfig) {
  const { extensionPath } = context;
  const { title, services } = config;

  const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel('appworks', title, ViewColumn.One, {
    enableScripts: true,
    retainContextWhenHidden: false,
  });
  webviewPanel.webview.html = getHtmlForWebview(extensionPath);
  connectService(webviewPanel, context, services);
}

export function connectService(
  webviewPanel: vscode.WebviewPanel,
  context: vscode.ExtensionContext,
  options: IConnectServiceOptions,
) {
  const { subscriptions } = context;
  const { webview } = webviewPanel;
  const { services, recorder } = options;
  webview.onDidReceiveMessage(
    async (message: IMessage) => {
      const { service, method, eventId, args } = message;
      // @ts-ignore
      const api = services && services[service] && services[service][method];
      console.log('onDidReceiveMessage', message);
      if (api) {
        try {
          const extra = args.length > 0 ? { data: args.length === 1 ? args[0] : args } : undefined;
          if (recorder) {
            // record for extension
            recorder.record({
              module: service,
              action: method,
              ...extra,
            });

            // record for service
            record({
              namespace: `@appworks/${service}-service`,
              module: 'callMethod',
              action: method,
              ...extra,
            });
          }

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
        webview.postMessage({ eventId, errorMessage: 'No responsive API was found' });
      }
    },
    undefined,
    subscriptions,
  );
}

function originResourceProcess(url: string) {
  return vscode.Uri.file(url).with({ scheme: 'vscode-resource' });
}

const DEFAULT_ENTRY = 'index';
export function getHtmlForWebview(
  extensionPath: string,
  entryName?: string,
  needVendor?: boolean,
  cdnBasePath?: string,
  extraHtml?: string,
  resourceProcess?: (url: string) => vscode.Uri,
): string {
  entryName = entryName || DEFAULT_ENTRY;
  resourceProcess = resourceProcess || originResourceProcess;
  const localBasePath = path.join(extensionPath, 'build');
  const rootPath = cdnBasePath || localBasePath;
  const scriptPath = path.join(rootPath, `js/${entryName}.js`);
  const scriptUri = cdnBasePath ?
    scriptPath :
    resourceProcess(scriptPath);
  const stylePath = path.join(rootPath, `css/${entryName}.css`);
  const styleUri = cdnBasePath ?
    stylePath :
    resourceProcess(stylePath);

  // vendor for MPA
  const vendorStylePath = path.join(rootPath, 'css/vendor.css');
  const vendorStyleUri = cdnBasePath
    ? vendorStylePath
    : resourceProcess(vendorStylePath);
  const vendorScriptPath = path.join(rootPath, 'js/vendor.js');
  const vendorScriptUri = cdnBasePath
    ? vendorScriptPath
    : resourceProcess(vendorScriptPath);

  // Use a nonce to whitelist which scripts can be run
  const nonce = getNonce();

  const fileContent =
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <title>AppWorks</title>
      <link rel="stylesheet" type="text/css" href="${styleUri}">
      ${extraHtml || ''}
      ` +
    (needVendor ? `<link rel="stylesheet" type="text/css" href="${vendorStyleUri}" />` : '') +
    `
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="ice-container"></div>
      ` +
    (needVendor ? `<script nonce="${nonce}" src="${vendorScriptUri}"></script>` : '') +
    `<script nonce="${nonce}" src="${scriptUri}"></script>
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
