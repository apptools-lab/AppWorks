import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension, registerCommand } from '@iceworks/common-service';
import { recordDAU } from '@iceworks/recorder';
import services from './services/index';
import propsAutoComplete from './propsAutoComplete';
import i18n from './i18n';
import registerComponentDocSupport from './componentDocSupport';
import recorder from './utils/recorder';

const { name } = require('../package.json');

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions } = context;

  console.log('Congratulations, your extension "iceworks-material-helper" is now active!');

  // auto set configuration
  initExtension(context, name);

  // set material importer
  let webviewPanel: vscode.WebviewPanel | undefined;
  function activeWebview() {
    recordDAU();
    recorder.recordActivate();
    if (webviewPanel) {
      webviewPanel.reveal();
    } else {
      let columnToShowIn = ViewColumn.One;
      let layout = { orientation: 0, groups: [{}] };
      if (window.activeTextEditor) {
        columnToShowIn = ViewColumn.Beside;
        layout = { orientation: 0, groups: [{ size: 0.7 }, { size: 0.3 }] };
      }

      webviewPanel = window.createWebviewPanel(
        'Iceworks',
        i18n.format('extension.iceworksMaterialHelper.extension.title'),
        { viewColumn: columnToShowIn, preserveFocus: true },
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          enableFindWidget: true,
        },
      );
      webviewPanel.webview.html = getHtmlForWebview(extensionPath);
      webviewPanel.onDidDispose(
        () => {
          webviewPanel = undefined;
        },
        null,
        context.subscriptions,
      );

      vscode.commands.executeCommand('vscode.setEditorLayout', layout);

      connectService(webviewPanel, context, { services, recorder });
    }
  }
  subscriptions.push(
    registerCommand('iceworks-material-helper.start', () => {
      const { visibleTextEditors } = vscode.window;
      if (visibleTextEditors.length) {
        activeWebview();
      } else {
        vscode.window.showErrorMessage(i18n.format('extension.iceworksMaterialHelper.extension.start.errorMessage'));
      }
    }),
  );

  // set propsAutoCompleter
  propsAutoComplete();
  registerComponentDocSupport();
}
