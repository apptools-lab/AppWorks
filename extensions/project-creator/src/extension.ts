import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@appworks/connector/lib/vscode';
import { initExtension, registerCommand } from '@appworks/common-service';
import { ICEWORKS_ICON_PATH } from '@appworks/constant';
import { Recorder } from '@appworks/recorder';
import services from './services/index';
import { Base64 } from 'js-base64';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions, globalState } = context;

  console.log('Congratulations, your extension "project-creator" is now active!');
  recorder.recordActivate();

  // auto set configuration
  initExtension(context);

  let projectCreatorwebviewPanel: vscode.WebviewPanel | undefined;

  function activeProjectCreatorWebview() {
    if (projectCreatorwebviewPanel) {
      projectCreatorwebviewPanel.reveal();
    } else {
      projectCreatorwebviewPanel = window.createWebviewPanel(
        'appworks',
        i18n.format('extension.iceworksProjectCreator.createProject.webViewTitle'),
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );
      projectCreatorwebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'createproject', false);
      projectCreatorwebviewPanel.iconPath = vscode.Uri.parse(ICEWORKS_ICON_PATH);
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
    registerCommand('project-creator.create-project.start', () => {
      activeProjectCreatorWebview();
    }),
  );

  let customScaffoldWebviewPanel: vscode.WebviewPanel | undefined;

  function activeCustomScaffoldWebview() {
    if (customScaffoldWebviewPanel) {
      customScaffoldWebviewPanel.reveal();
    } else {
      customScaffoldWebviewPanel = window.createWebviewPanel(
        'appworks',
        i18n.format('extension.iceworksProjectCreator.customScaffold.webViewTitle'),
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );
      const extraScaffoldTemplateHtml = `
        <style>
          body {
            background-color: #fff;
            color: #000;
            margin: 0;
          }
        </style>
      `;

      const iframeContent = getHtmlForWebview(
        extensionPath,
        'scaffoldtemplate',
        false,
        undefined,
        extraScaffoldTemplateHtml,
        (resourceUrl) => {
          return customScaffoldWebviewPanel!.webview.asWebviewUri(vscode.Uri.file(resourceUrl));
        },
      );
      const extraCustomScaffoldHtml = `
        <script>
          window.iframeContent = '${Base64.encode(iframeContent)}'
        </script>
      `;
      customScaffoldWebviewPanel.webview.html = getHtmlForWebview(
        extensionPath,
        'customscaffold',
        false,
        undefined,
        extraCustomScaffoldHtml,
      );
      customScaffoldWebviewPanel.iconPath = vscode.Uri.parse(ICEWORKS_ICON_PATH);
      customScaffoldWebviewPanel.onDidDispose(
        () => {
          customScaffoldWebviewPanel = undefined;
        },
        null,
        context.subscriptions,
      );
      connectService(customScaffoldWebviewPanel, context, { services, recorder });
    }
  }

  subscriptions.push(
    registerCommand('project-creator.custom-scaffold.start', () => {
      activeCustomScaffoldWebview();
    }),
  );

  const stateKey = 'appworks.projectCreator.autoActivedWebview';
  if (!globalState.get(stateKey)) {
    activeProjectCreatorWebview();
    globalState.update(stateKey, true);
  }
}

export function deactivate() {}
