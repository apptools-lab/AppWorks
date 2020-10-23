import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension, registerCommand } from '@iceworks/common-service';
import { Recorder } from '@iceworks/recorder';
import services from './services/index';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions, globalState } = context;

  // auto set configuration
  initExtension(context, name);

  let projectCreatorwebviewPanel: vscode.WebviewPanel | undefined;

  function activeProjectCreatorWebview() {
    recorder.recordActivate();

    if (projectCreatorwebviewPanel) {
      projectCreatorwebviewPanel.reveal();
    } else {
      projectCreatorwebviewPanel = window.createWebviewPanel(
        'iceworks',
        i18n.format('extension.iceworksProjectCreator.createProject.webViewTitle'),
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );
      projectCreatorwebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'createproject', true);
      projectCreatorwebviewPanel.onDidDispose(
        () => {
          projectCreatorwebviewPanel = undefined;
        },
        null,
        context.subscriptions,
      );
      connectService(projectCreatorwebviewPanel, context, { services, recorder });
    }
  }

  subscriptions.push(
    registerCommand('iceworks-project-creator.create-project.start', () => {
      activeProjectCreatorWebview();
    }),
  );

  let customScaffoldwebviewPanel: vscode.WebviewPanel | undefined;

  function activeCustomScaffoldWebview() {
    recorder.recordActivate();

    if (customScaffoldwebviewPanel) {
      customScaffoldwebviewPanel.reveal();
    } else {
      customScaffoldwebviewPanel = window.createWebviewPanel(
        'iceworks',
        i18n.format('extension.iceworksProjectCreator.customScaffold.webViewTitle'),
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );
      customScaffoldwebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'customscaffold', true);
      customScaffoldwebviewPanel.onDidDispose(
        () => {
          customScaffoldwebviewPanel = undefined;
        },
        null,
        context.subscriptions,
      );
      connectService(customScaffoldwebviewPanel, context, { services, recorder });
    }
  }

  subscriptions.push(
    registerCommand('iceworks-project-creator.custom-scaffold.start', () => {
      activeCustomScaffoldWebview();
    }),
  );

  const stateKey = 'iceworks.projectCreator.autoActivedWebview';
  if (!globalState.get(stateKey)) {
    activeProjectCreatorWebview();
    globalState.update(stateKey, true);
  }
}
