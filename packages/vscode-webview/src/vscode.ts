import * as vscode from 'vscode';
import * as path from 'path';
import * as fsExtra from 'fs-extra';
const ejs = require('ejs');

const { window, ViewColumn } = vscode;

interface IMessage {
  service: string;
  method: string;
  eventId: string;
  [propName: string]: any;
}

interface IConfig {
  title: string;
  services?: any
}

const templateFileName = 'template.html.ejs';

export function active(context: vscode.ExtensionContext, config?: IConfig) {
  const { extensionPath } = context;
  const { title, services } = config;

  const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel('iceworks', title, ViewColumn.One, {
    enableScripts: true,
    retainContextWhenHidden: false,
  });
  webviewPanel.webview.html = getHtmlForWebview(extensionPath);
  webviewPanel.webview.onDidReceiveMessage(
    async (message: IMessage) => {
      const { service, method, eventId, args } = message;
      // @ts-ignore
      const api = services && services[service] && services[service][method];
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

function getHtmlForWebview(extensionPath: string): string {
  const basePath = path.join(extensionPath, 'build/');

  const scriptPathOnDisk = vscode.Uri.file(path.join(basePath, 'js/index.js'));
  const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
  const stylePathOnDisk = vscode.Uri.file(path.join(basePath, 'css/index.css'));
  const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });

  // Use a nonce to whitelist which scripts can be run
  const nonce = getNonce();

  const templatePath = path.join(__dirname, templateFileName);
  const fileStr = fsExtra.readFileSync(templatePath, 'utf-8');
  const fileContent = ejs.compile(fileStr)({styleUri, scriptUri, nonce});
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
