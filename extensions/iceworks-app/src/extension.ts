import * as vscode from 'vscode';
import { window, ViewColumn } from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import {
  checkIsPegasusProject,
  checkIsTargetProjectType,
  autoSetContext as autoSetContextByProject,
  projectPath,
} from '@iceworks/project-service';
import { Recorder, recordDAU } from '@iceworks/recorder';
import { initExtension, registerCommand, getFolderExistsTime, getDataFromSettingJson } from '@iceworks/common-service';
import { createActionsTreeView } from './views/actionsView';
import { createNodeDependenciesTreeView } from './views/nodeDependenciesView';
import { createQuickEntriesTreeView } from './views/quickEntriesView';
import services from './services';
import { showExtensionsQuickPickCommandId, projectExistsTime } from './constants';
import showAllQuickPick from './quickPicks/showAllQuickPick';
import createScriptsCommands from './utils/createScriptsCommands';
import createExtensionsStatusBar from './statusBar/createExtensionsStatusBar';
import autoStart from './utils/autoStart';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

export async function activate(context: vscode.ExtensionContext) {
  const { subscriptions, extensionPath } = context;

  console.log('Congratulations, your extension "iceworks-app" is now active!');
  recorder.recordActivate();

  // auto set configuration & context
  initExtension(context, name);
  autoSetContextByProject();

  const isPegasusProject = await checkIsPegasusProject();

  // init statusBarItem
  const extensionsStatusBar = createExtensionsStatusBar();
  subscriptions.push(extensionsStatusBar);
  subscriptions.push(
    registerCommand(showExtensionsQuickPickCommandId, async () => {
      await showAllQuickPick();
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
      configWebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'confighelper', false, undefined, extraHtml);
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

      welcomeWebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'welcome');
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
    }),
  );

  // init dashboard webview
  let dashboardWebviewPanel: vscode.WebviewPanel | undefined;
  function activeDashboardWebview() {
    if (dashboardWebviewPanel) {
      dashboardWebviewPanel.reveal();
    } else {
      dashboardWebviewPanel = window.createWebviewPanel(
        'iceworks',
        i18n.format('extension.iceworksApp.dashboard.extension.webviewTitle'),
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );

      dashboardWebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'dashboard');
      dashboardWebviewPanel.onDidDispose(
        () => {
          dashboardWebviewPanel = undefined;
        },
        null,
        context.subscriptions,
      );
      connectService(dashboardWebviewPanel, context, { services, recorder });
    }
  }
  subscriptions.push(
    registerCommand('iceworksApp.dashboard.start', () => {
      activeDashboardWebview();
    }),
  );

  // init tree view
  const treeViews: any[] = [];
  treeViews.push(createQuickEntriesTreeView(context));
  treeViews.push(createActionsTreeView(context));
  treeViews.push(createNodeDependenciesTreeView(context));
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
        if (!(['npmScripts', 'nodeDependencies'].includes(title))) {
          didSetViewContext = true;
          recordDAU();
          autoStart(context);
        }
      }
    });
  });

  await createScriptsCommands(context, recorder);

  // TODO auto start welcome page when the application is new
  const isTargetProjectType = await checkIsTargetProjectType();
  const isShowWelcomePage = await getDataFromSettingJson('showWelcomePage', true);
  if (projectPath && isTargetProjectType && isShowWelcomePage && !vscode.window.activeTextEditor) {
    const curProjectExistsTime = getFolderExistsTime(projectPath);
    if (projectExistsTime > curProjectExistsTime) {
      // vscode.commands.executeCommand('iceworksApp.welcome.start');
      // globalState.update(didShowWelcomePageBySidebarStateKey, true);
    }
  }
}

export function deactivate() { }
