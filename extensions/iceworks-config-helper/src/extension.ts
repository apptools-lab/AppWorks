import * as vscode from 'vscode';
import { getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension } from '@iceworks/common-service';
import {
  isBuildJson,
  updateJsonForWeb,
  updateJsonFile,
  clearCache,
  activePanelEntry,
  setSourceJSON,
  setJSONFileName,
} from './loadJson';
import i18n from './i18n';

export async function activate(context: vscode.ExtensionContext) {
  await setSourceJSON();
  const { extensionPath, subscriptions } = context;

  // auto set configuration
  initExtension(context);

  let webviewPanel: vscode.WebviewPanel | undefined;

  function activeWebview(execJsonFileName: string) {
    setJSONFileName(execJsonFileName);
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
    console.log(webviewPanel.webview.html);
    webviewPanel.onDidDispose(
      () => {
        webviewPanel = undefined;
        clearCache();
      },
      null,
      context.subscriptions
    );
    webviewPanel.webview.onDidReceiveMessage(
      (message) => {
        updateJsonFile(message, webviewPanel);
      },
      undefined,
      context.subscriptions
    );
    // connectService(webviewPanel, context, { services, logger})
  }
  activePanelEntry(vscode.window.activeTextEditor);
  console.log('activeTextEditor', vscode.window.activeTextEditor);

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
      if (isBuildJson(event.document)) {
        updateJsonForWeb(event.document.getText(), webviewPanel);
      }
    })
  );
  vscode.window.onDidChangeActiveTextEditor((e) => {
    activePanelEntry(e);
  });
  console.log('confighelper active');
}
