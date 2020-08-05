import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension } from '@iceworks/common-service';
import { recordDAU, Recorder } from '@iceworks/recorder';
import {
  isConfigJson,
  updateJsonForWeb,
  clearCache,
  activePanelEntry,
  setSourceJSON,
  setJSONFileName,
  services,
} from './services';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

export async function activate(context: vscode.ExtensionContext) {
  await setSourceJSON();
  const { extensionPath, subscriptions } = context;

  initExtension(context);

  let webviewPanel: vscode.WebviewPanel | undefined;

  function activeWebview(execJsonFileName: string) {
    setJSONFileName(execJsonFileName);
    recordDAU();

    if (webviewPanel) {
      webviewPanel.dispose();
    }
    webviewPanel = vscode.window.createWebviewPanel(
      'iceworks',
      i18n.format('extension.iceworksConfigHelper.index.webviewTitle'),
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    webviewPanel.webview.html = getHtmlForWebview(extensionPath);
    webviewPanel.onDidDispose(
      () => {
        webviewPanel = undefined;
        clearCache();
      },
      null,
      context.subscriptions
    );
    connectService(webviewPanel, context, { services, recorder });
  }

  activePanelEntry();

  subscriptions.push(
    vscode.commands.registerCommand('iceworks-config-helper.buildJson.start', () => {
      activeWebview('build');
    }),
    vscode.commands.registerCommand('iceworks-config-helper.appJson.start', () => {
      activeWebview('app');
    })
  );
  subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (isConfigJson(event.document, ['build.json', 'app.json'])) {
        updateJsonForWeb(event.document.getText(), webviewPanel);
      }
    })
  );
  vscode.window.onDidChangeActiveTextEditor(() => {
    activePanelEntry();
  });
  console.log('confighelper active');
}
