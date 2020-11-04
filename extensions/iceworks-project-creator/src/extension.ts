import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension, registerCommand } from '@iceworks/common-service';
import { Recorder } from '@iceworks/recorder';
import services from './services/index';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions, globalState } = context;

  // auto set configuration
  initExtension(context, name);

  let webviewPanel: vscode.WebviewPanel | undefined;

  function activeWebview() {
    recorder.recordActivate();

    if (webviewPanel) {
      webviewPanel.reveal();
    } else {
      webviewPanel = window.createWebviewPanel(
        'iceworks',
        i18n.format('extension.iceworksProjectCreator.extension.webViewTitle'),
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );
      webviewPanel.webview.html = getHtmlForWebview(extensionPath, 'createproject');
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
    registerCommand('iceworks-project-creator.start', () => {
      activeWebview();
    }),
  );

  const stateKey = 'iceworks.projectCreator.autoActivedWebview';
  if (!globalState.get(stateKey)) {
    activeWebview();
    globalState.update(stateKey, true);
  }
}

export function deactivate() { }
