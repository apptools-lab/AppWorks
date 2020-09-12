import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { Recorder, recordDAU } from '@iceworks/recorder';
import { registerCommand } from '@iceworks/common-service';
import getScanReport from './getScanReport';
import setDiagnostics from './setDiagnostics';
import * as zhCNTextMap from './locales/zh-CN.json';
import * as enUSTextMap from './locales/en-US.json';
import { services } from './services';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

function activate(context: vscode.ExtensionContext) {
  const { window, workspace } = vscode;
  const { extensionPath } = context;
  const useEn = vscode.env.language !== 'zh-cn';

  let reportWebviewPanel: vscode.WebviewPanel | undefined;

  // Check code when save
  vscode.workspace.onDidSaveTextDocument(
    (editor) => {
      if (editor && editor.fileName) {
        const configuration = workspace.getConfiguration();

        if (
          configuration.get('Iceworks.Doctor.enableCheckSecurityPracticesOnSave') &&
          // Only check js file
          /(jsx|js|tsx|ts)$/.test(editor.fileName)
        ) {
          getScanReport(editor.fileName, {
            disableAliEslint: true,
            disableBestPractices: true,
            disableMaintainability: true,
            disableRepeatability: true,
          })
            .then((report) => {
              if (report.securityPractices) {
                setDiagnostics(report.securityPractices);
              }
            })
            .catch((e) => {
              // ignore
            });
        }
      }
    },
    null,
    context.subscriptions
  );

  // Code Quality Dashboard
  registerCommand('iceworks-doctor.dashboard', () => {
    recordDAU();

    if (!fse.existsSync(path.join(workspace.rootPath || '', 'package.json'))) {
      window.showErrorMessage(
        useEn
          ? enUSTextMap['extension.iceworksDoctor.dashboard.error.illegalDirectory']
          : zhCNTextMap['extension.iceworksDoctor.dashboard.error.illegalDirectory']
      );
      return;
    }

    if (reportWebviewPanel) {
      reportWebviewPanel.reveal();
      window.showWarningMessage(
        useEn
          ? enUSTextMap['extension.iceworksDoctor.dashboard.error.twiceOpen']
          : zhCNTextMap['extension.iceworksDoctor.dashboard.error.twiceOpen']
      );
      return;
    }

    reportWebviewPanel = window.createWebviewPanel('iceworks', 'Iceworks Doctor', vscode.ViewColumn.Two, {
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
