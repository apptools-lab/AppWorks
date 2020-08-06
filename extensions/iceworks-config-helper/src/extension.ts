import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension } from '@iceworks/common-service';
import { recordDAU, Recorder, record } from '@iceworks/recorder';
import { getProjectFramework } from '@iceworks/project-service';
import {
  updateJsonForWeb,
  clearCache,
  setEditingJSONFile,
  services,
} from './services';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

export async function activate(context: vscode.ExtensionContext) {
  await setJSONValidationUrl();
  recorder.recordActivate();

  const { extensionPath, subscriptions } = context;

  initExtension(context);

  let webviewPanel: vscode.WebviewPanel | undefined;

  function activeConfigWebview(JSONFileName: string) {
    recordDAU();
    recorder.record({
      module: 'main',
      action: 'activeConfigWebview'
    });

    setEditingJSONFile(JSONFileName);

    if (webviewPanel) {
      webviewPanel.dispose();
    }
    webviewPanel = vscode.window.createWebviewPanel(
      'iceworks',
      i18n.format('extension.iceworksConfigHelper.index.webviewTitle'),
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    webviewPanel.webview.html = getHtmlForWebview(extensionPath);
    webviewPanel.onDidDispose(
      () => {
        webviewPanel = undefined;
        clearCache();
      },
      null,
      context.subscriptions
    );
    connectService(webviewPanel, context, { services, recorder });
  }

  activePanelEntry();
  vscode.window.onDidChangeActiveTextEditor(() => {
    activePanelEntry();
  });

  subscriptions.push(
    vscode.commands.registerCommand('iceworks-config-helper.buildJson.start', () => {
      activeConfigWebview('build');
    }),
    vscode.commands.registerCommand('iceworks-config-helper.appJson.start', () => {
      activeConfigWebview('app');
    })
  );
  subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (isConfigJson(event.document, ['build.json', 'app.json'])) {
        updateJsonForWeb(event.document.getText(), webviewPanel);
      }
    })
  );
}

function activePanelEntry() {
  const currentActiveEditor = vscode.window.activeTextEditor;
  if (!currentActiveEditor) return;
  if (currentActiveEditor?.document.uri.fsPath.endsWith('build.json')) {
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForBuildJson', true);
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForAppJson', false);
  } else if (currentActiveEditor?.document.uri.fsPath.endsWith('app.json')) {
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForAppJson', true);
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForBuildJson', false);
  } else {
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForBuildJson', false);
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForAppJson', false);
  }
}

async function setJSONValidationUrl() {
  try {
    const projectFramework = await getProjectFramework();

    vscode.extensions.all.forEach((extension) => {
      if (extension.id !== 'iceworks-team.iceworks-config-helper') {
        return;
      }

      const packageJSON = extension.packageJSON;
      if (packageJSON && packageJSON.contributes && (projectFramework === 'rax-app' || projectFramework === 'icejs')) {
        const jsonValidation = packageJSON.contributes.jsonValidation;
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
