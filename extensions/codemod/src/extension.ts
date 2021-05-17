import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@appworks/connector/lib/vscode';
import { initExtension, registerCommand } from '@appworks/common-service';
import { ICEWORKS_ICON_PATH } from '@appworks/constant';
import { Recorder } from '@appworks/recorder';
import services from './services/index';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions } = context;

  console.log('Congratulations, your extension "codemod" is now active!');
  recorder.recordActivate();

  // auto set configuration
  initExtension(context);

  let webviewPanel: vscode.WebviewPanel | undefined;
  function activeWebview() {
    if (webviewPanel) {
      webviewPanel.reveal();
    } else {
      webviewPanel = window.createWebviewPanel(
        'appworks',
        i18n.format('extension.iceworksCodeMod.start.title'),
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );
      webviewPanel.webview.html = getHtmlForWebview(extensionPath, 'home', false);
      webviewPanel.iconPath = vscode.Uri.parse(ICEWORKS_ICON_PATH);
      webviewPanel.onDidDispose(
        () => {
          webviewPanel = undefined;
        },
        null,
        context.subscriptions,
      );
      connectService(webviewPanel, context, { services, recorder });
    }
  }
  subscriptions.push(
    registerCommand('codemod.start', () => {
      activeWebview();
    }),
  );
}

export function deactivate() { }
