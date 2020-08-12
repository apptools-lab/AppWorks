import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension } from '@iceworks/common-service';
import { recordDAU, Recorder } from '@iceworks/recorder';
import { getProjectFramework } from '@iceworks/project-service';
import { services, getIsUpdatingJsonFile } from './services';
import i18n from './i18n';
import {
  getEditingFileBaseName,
  canEditInPanel,
  getFrameWorkFragement,
  setEditingJsonFileUri,
  getEditingJsonFileUri,
  getVisibleTextEditor,
  getBaseNameFormUri,
  getEditingJsonEditor,
} from './utils';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

export async function activate(context: vscode.ExtensionContext) {
  await setJsonValidationUrl();
  recorder.recordActivate();

  const { extensionPath, subscriptions } = context;

  initExtension(context);

  let configWebviewPanel: vscode.WebviewPanel | undefined;

  // TODO: 是否需要将这个函数从 active 中剥离出来？
  function activeConfigWebview(jsonFileUri: vscode.Uri) {
    if (!canEditInPanel(jsonFileUri)) {
      vscode.window.showWarningMessage(
        i18n.format('extension.iceworksConfigHelper.loadJson.cannotEditInPanel', {
          editingJsonBaseName: getBaseNameFormUri(jsonFileUri),
        })
      );
    } else {
      setEditingJsonFileUri(jsonFileUri);
      if (configWebviewPanel) {
        configWebviewPanel.dispose();
      }

      configWebviewPanel = vscode.window.createWebviewPanel(
        'iceworks',
        i18n.format('extension.iceworksConfigHelper.index.webviewTitle'),
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );
      configWebviewPanel.webview.html = getHtmlForWebview(extensionPath);
      configWebviewPanel.onDidDispose(
        () => {
          configWebviewPanel = undefined;
          vscode.commands.executeCommand('setContext', 'iceworks.config-helper.panelAcitve', false);
        },
        null,
        context.subscriptions
      );
      connectService(configWebviewPanel, context, { services, recorder });

      vscode.commands.executeCommand('setContext', 'iceworks.config-helper.panelAcitve', true);
      recordDAU();
      recorder.record({
        module: 'main',
        action: 'activeConfigWebview',
      });
    }
  }

  subscriptions.push(
    vscode.commands.registerCommand('iceworks-config-helper.configPanel.start', (uri) => {
      activeConfigWebview(uri);
    }),
    vscode.commands.registerCommand('iceworks-config-helper.configPanel.showSource', () => {
      const sourceFilePanel = getEditingJsonEditor();
      if (sourceFilePanel) {
        sourceFilePanel.show();
      } else {
        vscode.window.showTextDocument(getEditingJsonFileUri(), {
          viewColumn: 2,
        });
      }
    })
  );

  subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (
        configWebviewPanel &&
        isJsonFile(event.document) &&
        event.contentChanges.length > 0 &&
        !getIsUpdatingJsonFile()
      ) {
        console.log('do update webview Json', event.contentChanges);
        try {
          const jsonContent = JSON.parse(event.document.getText());
          configWebviewPanel.webview.postMessage({
            command: 'iceworks-config-helper:updateJson',
            jsonContent,
          });
        } catch (error) {
          // ignore
        }
      }
    })
  );
}

async function setJsonValidationUrl() {
  try {
    const projectFramework = await getProjectFramework();

    vscode.extensions.all.forEach((extension) => {
      if (extension.id !== 'iceworks-team.iceworks-config-helper') {
        return;
      }

      const packageJson = extension.packageJSON;
      if (packageJson && packageJson.contributes && (projectFramework === 'rax-app' || projectFramework === 'icejs')) {
        const jsonValidation = packageJson.contributes.jsonValidation;
        jsonValidation[0].url = `./schemas/${getFrameWorkFragement()}.build.${vscode.env.language}.json`;
        if (projectFramework === 'rax-app') {
          jsonValidation[1].url = `./schemas/rax.app.${vscode.env.language}.json`;
        }
      }
    });
  } catch (e) {
    // ignore
  }
}

function isJsonFile(document: vscode.TextDocument) {
  return document.fileName.endsWith('.json');
}
