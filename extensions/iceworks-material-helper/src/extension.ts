import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension, Logger } from '@iceworks/common-service';
import services from './services/index';
import propsAutoComplete from './propsAutoComplete';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions, globalState } = context;

  console.log('Congratulations, your extension "iceworks-material-helper" is now active!');

  // data collection
  const logger = new Logger(name, globalState);

  // auto set configuration
  initExtension(context);

  // set material importer
  let webviewPanel: vscode.WebviewPanel | undefined;
  function activeWebview() {
    logger.recordDAU();
    logger.recordActivate(version);
    if (webviewPanel) {
      webviewPanel.reveal();
    } else {
      let columnToShowIn = ViewColumn.One;
      let layout = { orientation: 0, groups: [{}] };
      if (window.activeTextEditor) {
        columnToShowIn = ViewColumn.Beside;
        layout = { orientation: 0, groups: [{ size: 0.7 }, { size: 0.3 }] };
      }

      webviewPanel = window.createWebviewPanel('Iceworks', i18n.format('extension.iceworksMaterialHelper.extension.title'), { viewColumn: columnToShowIn, preserveFocus: true }, {
        enableScripts: true,
        retainContextWhenHidden: true,
        enableFindWidget: true,
      });
      webviewPanel.webview.html = getHtmlForWebview(extensionPath);
      webviewPanel.onDidDispose(
        () => {
          webviewPanel = undefined;
        },
        null,
        context.subscriptions
      );

      vscode.commands.executeCommand('vscode.setEditorLayout', layout);

      connectService(webviewPanel, context, { services, logger });
    }
  }
  subscriptions.push(vscode.commands.registerCommand('iceworks-material-helper.start', function () {
    activeWebview();
  }));

  // set propsAutoCompleter
  propsAutoComplete();
}
