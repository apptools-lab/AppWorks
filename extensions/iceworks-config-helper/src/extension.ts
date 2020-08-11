import * as vscode from 'vscode';
import * as path from 'path';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension } from '@iceworks/common-service';
import { recordDAU, Recorder } from '@iceworks/recorder';
import { getProjectFramework } from '@iceworks/project-service';
import { setEditingJsonFile, services, getIsUpdatingJsonFile } from './services';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);
const CANNOT_EDIT_FILE_NAMES = ['package-lock'];

export async function activate(context: vscode.ExtensionContext) {
  await setJsonValidationUrl();
  recorder.recordActivate();

  const { extensionPath, subscriptions } = context;

  initExtension(context);

  let configWebviewPanel: vscode.WebviewPanel | undefined;

  function activeConfigWebview(JsonFileUri: vscode.Uri) {
    recordDAU();
    recorder.record({
      module: 'main',
      action: 'activeConfigWebview',
    });

    const fileName = getFileNameFromUri(JsonFileUri);

    if(CANNOT_EDIT_FILE_NAMES.includes(fileName)){
      vscode.window.showWarningMessage(`请不要在面板中编辑 ${fileName}`);
      return;
    }else{
      setEditingJsonFile(fileName);
    }

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
      },
      null,
      context.subscriptions
    );
    connectService(configWebviewPanel, context, { services, recorder });
  }

  // activePanelEntry();
  // vscode.window.onDidChangeActiveTextEditor(() => {
  //   // activePanelEntry();
  // });

  subscriptions.push(
    vscode.commands.registerCommand('iceworks-config-helper.configPanel.start', (uri) => {
      activeConfigWebview(uri);
    })
  );

  subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (
        configWebviewPanel &&
        isConfigJson(event.document, ['build.json', 'app.json']) &&
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

// function activePanelEntry() {
//   const currentActiveEditor = vscode.window.activeTextEditor;
//   if (!currentActiveEditor) return;
//   if (currentActiveEditor?.document.uri.fsPath.endsWith('build.json')) {
//     vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForBuildJson', true);
//     vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForAppJson', false);
//   } else if (currentActiveEditor?.document.uri.fsPath.endsWith('app.json')) {
//     vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForAppJson', true);
//     vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForBuildJson', false);
//   } else {
//     vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForBuildJson', false);
//     vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForAppJson', false);
//   }
// }

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
        jsonValidation[0].url = `./schemas/${projectFramework === 'icejs' ? 'ice' : 'rax'}.build.${
          vscode.env.language
        }.json`;
        if (projectFramework === 'rax-app') {
          jsonValidation[1].url = `./schemas/rax.app.${vscode.env.language}.json`;
        }
      }
    });
  } catch (e) {
    // ignore
  }
}

function isConfigJson(document: vscode.TextDocument, filenames: string[]) {
  return filenames.find((e) => {
    return document.uri.fsPath.endsWith(e);
  });
}

function getFileNameFromUri(uri: vscode.Uri){
  return path.parse(uri.fsPath).name;
}
