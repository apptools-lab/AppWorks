import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtensionConfiguration, Logger } from '@iceworks/common-service';
import { setActiveTextEditorId } from '@iceworks/block-service';
import services from './services/index';

// eslint-disable-next-line
const { name, version } = require('../package.json');

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions, globalState } = context;

  console.log('Congratulations, your extension "iceworks-material-import" is now active!');
  // data collection
  const logger = new Logger(name, globalState);
  logger.recordDAU();
  logger.recordOnce({
    module: 'main',
    action: 'activate',
    data: {
      version,
    }
  });
  // auto set configuration
  initExtensionConfiguration(globalState);
  // init webview
  const columnToShowIn = vscode.window.activeTextEditor
    ? ViewColumn.Beside
    : ViewColumn.One;

  vscode.window.onDidChangeActiveTextEditor(
    editor => {
      if (editor) {
        // save active text editor id to localstorage
        const { id } = editor as any;
        console.log('activeTextEditor Id', id);
        setActiveTextEditorId(globalState, id);
      }
    },
    null,
    context.subscriptions
  );

  function activeWebview() {
    const webviewPanel = window.createWebviewPanel('iceworks', '导入物料', columnToShowIn, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });
    webviewPanel.webview.html = getHtmlForWebview(extensionPath);
    connectService(webviewPanel.webview, context, { services, logger });
  }
  subscriptions.push(vscode.commands.registerCommand('iceworks-material-import.start', function () {
    activeWebview();
  }));
}
