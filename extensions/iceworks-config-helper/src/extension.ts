import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension, registerCommand } from '@iceworks/common-service';
import { Recorder } from '@iceworks/recorder';
import { services, getIsUpdatingJsonFile } from './services';
import i18n from './i18n';
import {
  canEditInPanel,
  getFrameWorkFragement,
  setEditingJsonFileUri,
  getEditingJsonFileUri,
  getBaseNameFormUri,
  getEditingJsonEditor,
} from './utils';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

function setPanelActiveContext(value) {
  vscode.commands.executeCommand('setContext', 'iceworks.config-helper.panelAcitve', value);
}

export async function activate(context: vscode.ExtensionContext) {
  await setJsonValidationUrl();

  const { extensionPath, subscriptions } = context;

  initExtension(context, name);

  let configWebviewPanel: vscode.WebviewPanel | undefined;

  function activeConfigWebview(jsonFileUri: vscode.Uri) {
    recorder.recordActivate();
    if (!canEditInPanel(jsonFileUri)) {
      vscode.window.showWarningMessage(
        i18n.format('extension.iceworksConfigHelper.loadJson.cannotEditInPanel', {
          editingJsonBaseName: getBaseNameFormUri(jsonFileUri),
        }),
      );
    } else {
      setEditingJsonFileUri(jsonFileUri);
      recorder.record({
        module: 'main',
        action: 'activeConfigWebview',
      });

      if (configWebviewPanel) {
        configWebviewPanel.dispose();
      }

      setPanelActiveContext(true);
      configWebviewPanel = vscode.window.createWebviewPanel(
        'iceworks',
        i18n.format('extension.iceworksConfigHelper.index.webviewTitle'),
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );
      configWebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'jsonform');
      configWebviewPanel.onDidDispose(
        () => {
          configWebviewPanel = undefined;
          setPanelActiveContext(false);
        },
        null,
        context.subscriptions,
      );
      configWebviewPanel.onDidChangeViewState((webviewPanelOnDidChangeViewStateEvent) => {
        setPanelActiveContext(webviewPanelOnDidChangeViewStateEvent.webviewPanel.active);
      });
      connectService(configWebviewPanel, context, { services, recorder });
    }
  }

  subscriptions.push(
    registerCommand('iceworks-config-helper.configPanel.start', (uri?) => {
      uri = uri || vscode.window.activeTextEditor?.document.uri;
      if (uri) {
        activeConfigWebview(uri);
      } else {
        vscode.window.showWarningMessage(i18n.format('extension.iceworksConfigHelper.start.error'));
      }
    }),
    registerCommand('iceworks-config-helper.configPanel.showSource', async () => {
      recorder.record({
        module: 'main',
        action: 'activeShowSource',
      });

      const sourceFilePanel = getEditingJsonEditor();

      let textDocument: vscode.TextDocument;
      if (sourceFilePanel) {
        console.debug('sourceFilePanel', sourceFilePanel);
        textDocument = sourceFilePanel.document;
      } else {
        const editingJsonFileUri = getEditingJsonFileUri();
        console.debug('editingJsonFileUri', editingJsonFileUri);
        if (editingJsonFileUri) {
          try {
            textDocument = await vscode.workspace.openTextDocument(editingJsonFileUri);
          } catch (error) {
            // ignore ...
          }
        }
      }

      // @ts-ignore
      if (textDocument) {
        try {
          await vscode.window.showTextDocument(textDocument, {
            viewColumn: 2,
          });
        } catch (error) {
          console.error(error);
          vscode.window.showWarningMessage(
            i18n.format('extension.iceworksConfigHelper.showSource.error', {
              uri: textDocument.uri.fsPath,
            }),
          );
        }
      }
    }),
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
    }),
  );
}

export function deactivate() { }

async function setJsonValidationUrl() {
  try {
    const projectFrameworkFragment = await getFrameWorkFragement();

    vscode.extensions.all.forEach((extension) => {
      if (extension.id !== 'iceworks-team.iceworks-config-helper') {
        return;
      }

      const packageJson = extension.packageJSON;
      if (
        packageJson &&
        packageJson.contributes &&
        (projectFrameworkFragment === 'rax' || projectFrameworkFragment === 'ice')
      ) {
        const { jsonValidation } = packageJson.contributes;
        jsonValidation[0].url = `./schemas/${projectFrameworkFragment}.build.${vscode.env.language}.json`;
        if (projectFrameworkFragment === 'rax') {
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
