import * as vscode from 'vscode';
import { window, ViewColumn } from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import {
  getProjectType,
  checkIsPegasusProject,
  checkIsNotTarget,
  autoSetContext as autoSetContextByProject,
  projectPath,
} from '@iceworks/project-service';
import { Recorder, recordDAU } from '@iceworks/recorder';
import { initExtension, registerCommand, getFolderExistsTime, getDataFromSettingJson } from '@iceworks/common-service';
import { createNpmScriptsTreeView } from './views/npmScriptsView';
import { createNodeDependenciesTreeView } from './views/nodeDependenciesView';
import { createComponentsTreeView } from './views/componentsView';
import { createPagesTreeView } from './views/pagesView';
import { createQuickEntriesTreeView } from './views/quickEntriesView';
import services from './services';
import { showExtensionsQuickPickCommandId, projectExistsTime } from './constants';
import showEntriesQuickPick from './quickPicks/showEntriesQuickPick';
import createEditorMenuAction from './utils/createEditorMenuAction';
import createExtensionsStatusBar from './statusBar/createExtensionsStatusBar';
import autoStart, { didShowWelcomePageBySidebarStateKey } from './utils/autoStart';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

export async function activate(context: vscode.ExtensionContext) {
  const { subscriptions, extensionPath, globalState } = context;

  // auto set configuration & context
  initExtension(context, name);
  autoSetContextByProject();

  const projectType = await getProjectType();
  const isPegasusProject = await checkIsPegasusProject();

  // init statusBarItem
  const extensionsStatusBar = createExtensionsStatusBar();
  subscriptions.push(extensionsStatusBar);
  subscriptions.push(
    registerCommand(showExtensionsQuickPickCommandId, async () => {
      await showEntriesQuickPick();
      recorder.recordActivate();
    }),
  );

  // init config webview
  let configWebviewPanel: vscode.WebviewPanel | undefined;
  function activeConfigWebview(focusField: string) {
    if (configWebviewPanel) {
      configWebviewPanel.reveal();
    } else {
      configWebviewPanel = window.createWebviewPanel(
        'iceworks',
        i18n.format('extension.iceworksApp.configHelper.extension.webviewTitle'),
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );
      const extraHtml = `<script>
        window.iceworksAutoFocusField = "${focusField}";
      </script>
      `;
      configWebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'confighelper', true, undefined, extraHtml);
      configWebviewPanel.onDidDispose(
        () => {
          configWebviewPanel = undefined;
        },
        null,
        context.subscriptions,
      );
      connectService(configWebviewPanel, context, { services, recorder });
    }
  }
  subscriptions.push(
    registerCommand('iceworksApp.configHelper.start', (focusField: string) => {
      activeConfigWebview(focusField);
      recorder.recordActivate();
    }),
  );
  // init welcome webview
  let welcomeWebviewPanel: vscode.WebviewPanel | undefined;
  function activeWelcomeWebview() {
    if (welcomeWebviewPanel) {
      welcomeWebviewPanel.reveal();
    } else {
      welcomeWebviewPanel = window.createWebviewPanel(
        'iceworks',
        i18n.format('extension.iceworksApp.welcome.extension.webviewTitle'),
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );

      welcomeWebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'welcome', true);
      welcomeWebviewPanel.onDidDispose(
        () => {
          welcomeWebviewPanel = undefined;
        },
        null,
        context.subscriptions,
      );
      connectService(welcomeWebviewPanel, context, { services, recorder });
    }
  }
  subscriptions.push(
    registerCommand('iceworksApp.welcome.start', () => {
      activeWelcomeWebview();
      recorder.recordActivate();
    }),
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
        autoStart(context);
      }
    });
  });

  // init editor title menu
  if (projectType !== 'unknown') {
    vscode.commands.executeCommand('setContext', 'iceworks:showScriptIconInEditorTitleMenu', true);
    await createEditorMenuAction();
  }

  // TODO auto start welcome page when the application is new
  const isNotTargetProject = await checkIsNotTarget();
  const isShowWelcomePage = await getDataFromSettingJson('showWelcomePage', true);
  if (projectPath && !isNotTargetProject && isShowWelcomePage && !vscode.window.activeTextEditor) {
    const curProjectExistsTime = getFolderExistsTime(projectPath);
    if (projectExistsTime > curProjectExistsTime) {
      // vscode.commands.executeCommand('iceworksApp.welcome.start');
      // globalState.update(didShowWelcomePageBySidebarStateKey, true);
    }
  }
}
