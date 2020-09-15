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
  const { extensionPath, subscriptions } = context;

  console.log('Congratulations, your extension "iceworks-component-builder" is now active!');

  // data collection
  recorder.recordActivate();

  // auto set configuration
  initExtension(context);

  function activeComponentGeneratorWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel(
      'iceworks',
      i18n.format('extension.iceworksComponentGenerator.extension.webviewTitle'),
      ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    const cdnUrl = 'https://g.alicdn.com/ice/iceworks-component-generator/0.1.7';
    const extraHtml = `<script>
      window.__assets = {
        ideUrl: '${cdnUrl}',
        canvasUrl: '${cdnUrl}',
        vendorUrl: '${cdnUrl}',
        vendorEntry: 'vendor',
      }
    </script>
    `;
    webviewPanel.webview.html = getHtmlForWebview(extensionPath, 'componentgenerator', true, cdnUrl, extraHtml);
    connectService(webviewPanel, context, { services, recorder });
  }
  subscriptions.push(
    registerCommand('iceworks-ui-builder.generate-component', function () {
      activeComponentGeneratorWebview();
    })
  );

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
    registerCommand('iceworks-ui-builder.create-component', function () {
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
    registerCommand('iceworks-ui-builder.generate-page', function () {
      activePageGeneraterWebview();
    })
  );
  function activePageCreatorWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel(
      'iceworks',
      i18n.format('extension.iceworksPageCreator.extensnion.webViewTitle'),
      ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    webviewPanel.webview.html = getHtmlForWebview(extensionPath, 'pagecreator', true);
    connectService(webviewPanel, context, { services, recorder });
  }
  subscriptions.push(
    registerCommand('iceworks-ui-builder.create-page', function () {
      activePageCreatorWebview();
    })
  );
}

export function deactivate() {}
