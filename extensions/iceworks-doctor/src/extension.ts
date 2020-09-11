import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { Recorder, recordDAU } from '@iceworks/recorder';
import { registerCommand } from '@iceworks/common-service';
import { services } from './services';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

function activate(context: vscode.ExtensionContext) {
  const { extensionPath } = context;

  registerCommand('iceworks-doctor.scan', () => {
    recordDAU();

    let reportWebviewPanel: vscode.WebviewPanel | undefined;
    if (reportWebviewPanel) {
      reportWebviewPanel.dispose();
    }

    reportWebviewPanel = vscode.window.createWebviewPanel('iceworks', 'Iceworks Doctor', vscode.ViewColumn.Two, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });

    reportWebviewPanel.webview.html = getHtmlForWebview(extensionPath);
    reportWebviewPanel.onDidDispose(
      () => {
        reportWebviewPanel = undefined;
      },
      null,
      context.subscriptions
    );

    connectService(reportWebviewPanel, context, { services, recorder });

    console.log(1111);
  });

  recorder.recordActivate();
}

exports.activate = activate;
