import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension, registerCommand } from '@iceworks/common-service';
import { autoSetContext as autoSetContextByProject } from '@iceworks/project-service';
import services from './services/index';
import propsAutoComplete from './propsAutoComplete';
import i18n from './i18n';
import registerComponentDocSupport from './componentDocSupport';
import recorder from './utils/recorder';
import { registerDebugCommand } from './utils/debugMaterials';
import { createComponentsTreeView } from './views/componentsView';
import { createPagesTreeView } from './views/pagesView';

const { name } = require('../package.json');

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions } = context;

  console.log('Congratulations, your extension "iceworks-material-helper" is now active!');
  recorder.recordActivate();

  // auto set configuration
  initExtension(context, name);
  autoSetContextByProject();

  // set material importer
  let materialImporterWebviewPanel: vscode.WebviewPanel | undefined;
  function activeMaterialImporterWebview() {
    if (materialImporterWebviewPanel) {
      materialImporterWebviewPanel.reveal();
    } else {
      let columnToShowIn = ViewColumn.One;
      let layout = { orientation: 0, groups: [{}] };
      if (window.activeTextEditor) {
        columnToShowIn = ViewColumn.Beside;
        layout = { orientation: 0, groups: [{ size: 0.7 }, { size: 0.3 }] };
      }

      materialImporterWebviewPanel = window.createWebviewPanel(
        'Iceworks',
        i18n.format('extension.iceworksMaterialHelper.materailImporter.title'),
        { viewColumn: columnToShowIn, preserveFocus: true },
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          enableFindWidget: true,
        },
      );
      materialImporterWebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'materialimporter');
      materialImporterWebviewPanel.onDidDispose(
        () => {
          materialImporterWebviewPanel = undefined;
        },
        null,
        context.subscriptions,
      );

      vscode.commands.executeCommand('vscode.setEditorLayout', layout);

      connectService(materialImporterWebviewPanel, context, { services, recorder });
    }
  }
  subscriptions.push(
    registerCommand('iceworks-material-helper.material-importer.start', () => {
      const { visibleTextEditors } = vscode.window;
      if (visibleTextEditors.length) {
        activeMaterialImporterWebview();
      } else {
        vscode.window.showErrorMessage(i18n.format('extension.iceworksMaterialHelper.extension.start.errorMessage'));
      }
    }),
  );

  function activeComponentCreatorWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel(
      'iceworks',
      i18n.format('extension.iceworksMaterialHelper.componentCreator.webviewTitle'),
      ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      },
    );
    webviewPanel.webview.html = getHtmlForWebview(extensionPath, 'componentcreator');
    connectService(webviewPanel, context, { services, recorder });
  }
  subscriptions.push(
    registerCommand('iceworks-material-helper.component-creator.start', () => {
      activeComponentCreatorWebview();
    }),
  );

  function activePageGeneratorWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel(
      'iceworks',
      i18n.format('extension.iceworksMaterialHelper.pageGenerator.webViewTitle'),
      ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      },
    );
    webviewPanel.webview.html = getHtmlForWebview(extensionPath, 'pagegenerator');
    connectService(webviewPanel, context, { services, recorder });
  }
  subscriptions.push(
    registerCommand('iceworks-material-helper.page-generator.start', () => {
      activePageGeneratorWebview();
    }),
  );

  function activePageCreatorWebview() {
    const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel(
      'iceworks',
      i18n.format('extension.iceworksMaterialHelper.pageCreator.webViewTitle'),
      ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      },
    );
    webviewPanel.webview.html = getHtmlForWebview(extensionPath, 'pagecreator');
    connectService(webviewPanel, context, { services, recorder });
  }
  subscriptions.push(
    registerCommand('iceworks-material-helper.page-creator.start', () => {
      activePageCreatorWebview();
    }),
  );

  registerDebugCommand(subscriptions);

  // set propsAutoCompleter
  propsAutoComplete();
  registerComponentDocSupport();

  // views
  createComponentsTreeView(context);
  createPagesTreeView(context);
}

export function deactivate() { }
