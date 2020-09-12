import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { Recorder, recordDAU } from '@iceworks/recorder';
import { registerCommand } from '@iceworks/common-service';
import * as zhCNTextMap from './locales/zh-CN.json';
import * as enUSTextMap from './locales/en-US.json';
import { services } from './services';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

function activate(context: vscode.ExtensionContext) {
  const { workspace } = vscode;
  const { extensionPath } = context;
  const useEn = vscode.env.language !== 'zh-cn';

  let reportWebviewPanel: vscode.WebviewPanel | undefined;

  registerCommand('iceworks-doctor.dashboard', () => {
    recordDAU();

    if (!fse.existsSync(path.join(workspace.rootPath || '', 'package.json'))) {
      vscode.window.showErrorMessage(
        useEn
          ? enUSTextMap['extension.iceworksDoctor.dashboard.error.illegalDirectory']
          : zhCNTextMap['extension.iceworksDoctor.dashboard.error.illegalDirectory']
      );
      return;
    }

    if (reportWebviewPanel) {
      reportWebviewPanel.reveal();
      vscode.window.showWarningMessage(
        useEn
          ? enUSTextMap['extension.iceworksDoctor.dashboard.error.twiceOpen']
          : zhCNTextMap['extension.iceworksDoctor.dashboard.error.twiceOpen']
      );
      return;
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
  });

  recorder.recordActivate();
}

exports.activate = activate;
