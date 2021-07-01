import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { connectService, getHtmlForWebview } from '@appworks/connector/lib/vscode';
import { ICEWORKS_ICON_PATH } from '@appworks/constant';
import { registerCommand, initExtension, getDataFromSettingJson } from '@appworks/common-service';
import { activateCodemod, runCodemod } from './codemod';
import recorder from './recorder';
import getScanReport from './getScanReport';
import setDiagnostics from './setDiagnostics';
import * as zhCNTextMap from './locales/zh-CN.json';
import * as enUSTextMap from './locales/en-US.json';
import { services } from './services';

// eslint-disable-next-line
const { name } = require('../package.json');

interface IWebvieOptions {
  autoScan?: boolean;
  autoFix?: boolean;
}

export function activate(context: vscode.ExtensionContext) {
  const { window, workspace } = vscode;

  console.log('Congratulations, your extension "doctor" is now active!');
  recorder.recordActivate();

  const { extensionPath } = context;
  const useEn = vscode.env.language !== 'zh-cn';

  // auto set configuration
  initExtension(context);

  let reportWebviewPanel: vscode.WebviewPanel | undefined;

  // Check code when save
  vscode.workspace.onDidSaveTextDocument(
    (editor) => {
      if (editor && editor.fileName) {
        if (
          getDataFromSettingJson('enableCheckSecurityPracticesOnSave') &&
          // Only check js file
          /(jsx|js|tsx|ts)$/.test(editor.fileName)
        ) {
          getScanReport({
            targetPath: editor.fileName,
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
            .catch(() => {
              // ignore
            });
        }
      }
    },
    null,
    context.subscriptions,
  );

  const openWebview = (options?: IWebvieOptions) => {
    if (!fse.existsSync(path.join(workspace.rootPath || '', 'package.json'))) {
      window.showErrorMessage(
        useEn
          ? enUSTextMap['extension.iceworksDoctor.doctor.error.illegalDirectory']
          : zhCNTextMap['extension.iceworksDoctor.doctor.error.illegalDirectory'],
      );
      return;
    }

    if (reportWebviewPanel) {
      reportWebviewPanel.reveal();
      window.showWarningMessage(
        useEn
          ? enUSTextMap['extension.iceworksDoctor.doctor.error.twiceOpen']
          : zhCNTextMap['extension.iceworksDoctor.doctor.error.twiceOpen'],
      );
      return;
    }

    reportWebviewPanel = window.createWebviewPanel('appworks', 'AppWorks Doctor', vscode.ViewColumn.Two, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });

    let extraHtml = '';
    if (options?.autoScan) {
      extraHtml = `
      <script>
        window.AUTO_SCAN = true;
      </script>
      `;
    } else if (options?.autoFix) {
      extraHtml = `
      <script>
        window.AUTO_FIX = true;
      </script>
      `;
    }

    reportWebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'dashboard', false, '', extraHtml);
    reportWebviewPanel.iconPath = vscode.Uri.parse(ICEWORKS_ICON_PATH);
    reportWebviewPanel.onDidDispose(
      () => {
        reportWebviewPanel = undefined;
      },
      null,
      context.subscriptions,
    );

    connectService(reportWebviewPanel, context, { services, recorder });
  };

  // Code Quality Dashboard
  registerCommand('doctor.dashboard', () => {
    openWebview();
  });

  // Scan project
  registerCommand('doctor.scan', () => {
    openWebview({ autoScan: true });
  });

  // Fix project
  registerCommand('doctor.fix', () => {
    openWebview({ autoFix: true });
  });

  // Codemod
  activateCodemod(context);
  registerCommand('doctor.codemod', (options) => {
    if (options?.transform) {
      runCodemod(options.transform);
    }
  });
}

export function deactivate() { }
