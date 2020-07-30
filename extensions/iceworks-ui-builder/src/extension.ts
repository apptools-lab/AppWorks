import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension } from '@iceworks/common-service';
import { Recorder } from '@iceworks/recorder';
import services from './services/index';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions, globalState } = context;

  console.log('Congratulations, your extension "iceworks-component-builder" is now active!');

  // data collection
  recorder.recordMainDAU();
  recorder.recordExtensionActivate();

  // auto set configuration
  initExtension(context);

  function activeComponentCreatorWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel(
      'iceworks',
      i18n.format('extension.iceworksComponentBuilder.extension.webviewTitle'),
      ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    webviewPanel.webview.html = getHtmlForWebview(extensionPath, 'componentcreator', true);
    connectService(webviewPanel, context, { services, recorder });
  }
  subscriptions.push(
    vscode.commands.registerCommand('iceworks-ui-builder.create-component', function () {
      activeComponentCreatorWebview();
    })
  );

  function activePageGeneraterWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel(
      'iceworks',
      i18n.format('extension.iceworksPageBuilder.extensnion.webViewTitle'),
      ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    webviewPanel.webview.html = getHtmlForWebview(extensionPath, 'pagegenerater', true);
    connectService(webviewPanel, context, { services, recorder });
  }
  subscriptions.push(
    vscode.commands.registerCommand('iceworks-ui-builder.generate-page', function () {
      activePageGeneraterWebview();
    })
  );
}

export function deactivate() {}
