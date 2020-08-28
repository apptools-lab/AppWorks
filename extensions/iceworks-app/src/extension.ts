import * as vscode from 'vscode';
import { window, ViewColumn } from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { getProjectType, checkIsPegasusProject } from '@iceworks/project-service';
import { Recorder, recordDAU } from '@iceworks/recorder';
import { initExtension, checkIsAliInternal, registerCommand } from '@iceworks/common-service';
import { createNpmScriptsTreeView } from './views/npmScriptsView';
import { createNodeDependenciesTreeView } from './views/nodeDependenciesView';
import { createComponentsTreeView } from './views/componentsView';
import { createPagesTreeView } from './views/pagesView';
import { createQuickEntriesTreeView } from './views/quickEntriesView';
import services from './services';
import { showExtensionsQuickPickCommandId } from './constants';
import showEntriesQuickPick from './quickPicks/showEntriesQuickPick';
import createEditorMenuAction from './createEditorMenuAction';
import createExtensionsStatusBar from './statusBar/createExtensionsStatusBar';
import autoSetViewContext from './autoSetViewContext';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

export async function activate(context: vscode.ExtensionContext) {
  const { subscriptions, extensionPath } = context;

  const projectType = await getProjectType();
  const isPegasusProject = await checkIsPegasusProject();
  vscode.commands.executeCommand('setContext', 'iceworks:isPegasusProject', isPegasusProject);
  // auto set configuration
  initExtension(context);

  // init statusBarItem
  const extensionsStatusBar = createExtensionsStatusBar();
  subscriptions.push(extensionsStatusBar);
  subscriptions.push(
    registerCommand(showExtensionsQuickPickCommandId, async () => {
      recorder.recordActivate();

      await showEntriesQuickPick();
    })
  );

  // init config webview
  let webviewPanel: vscode.WebviewPanel | undefined;
  function activeConfigWebview(focusField: string) {
    if (webviewPanel) {
      webviewPanel.reveal();
    } else {
      webviewPanel = window.createWebviewPanel(
        'iceworks',
        i18n.format('extension.iceworksApp.extension.title'),
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );
      const extraHtml = `<script>
        window.iceworksAutoFocusField = "${focusField}";
      </script>
      `;
      webviewPanel.webview.html = getHtmlForWebview(extensionPath, undefined, false, undefined, extraHtml);
      webviewPanel.onDidDispose(
        () => {
          webviewPanel = undefined;
        },
        null,
        context.subscriptions
      );
      connectService(webviewPanel, context, { services, recorder });
    }
  }
  subscriptions.push(
    registerCommand('iceworksApp.configHelper.start', function (focusField: string) {
      recorder.recordActivate();
      activeConfigWebview(focusField);
    })
  );

  // init tree view
  const treeViews: any[] = [];

  treeViews.push(createQuickEntriesTreeView(context));
  treeViews.push(createNpmScriptsTreeView(context));
  treeViews.push(createNodeDependenciesTreeView(context));
  if (!isPegasusProject) {
    treeViews.push(createComponentsTreeView(context));
    treeViews.push(createPagesTreeView(context));
  }
  let didSetViewContext;
  treeViews.forEach((treeView) => {
    const { title } = treeView;
    treeView.onDidChangeVisibility(({ visible }) => {
      if (visible) {
        recorder.record({
          module: 'treeView',
          action: 'visible',
          data: {
            title,
          },
        });
      }

      recorder.record({
        module: 'treeView',
        action: 'active',
      });
      if (visible && !didSetViewContext) {
        didSetViewContext = true;
        recordDAU();
        autoSetViewContext();
      }
    });
  });

  // init editor title menu
  if (projectType !== 'unknown') {
    vscode.commands.executeCommand('setContext', 'iceworks:isAliInternal', await checkIsAliInternal());
    vscode.commands.executeCommand('setContext', 'iceworks:showScriptIconInEditorTitleMenu', true);
    await createEditorMenuAction();
  }
}
