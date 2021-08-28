import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { createNpmCommand, checkPathExists, registerCommand, checkIsAliInternal } from '@appworks/common-service';
import { dependencyDir, packageJSONFilename, projectPath } from '@appworks/project-service';
import runScript from '../terminal/runScript';
import stopScript from '../terminal/stopScript';
import { ItemData, TreeItem } from './treeItem';
import i18n from '../i18n';

export class ActionsProvider implements vscode.TreeDataProvider<ItemData> {
  private workspaceRoot: string | undefined;

  private extensionContext: vscode.ExtensionContext;

  private onDidChange: vscode.EventEmitter<ItemData | undefined> = new vscode.EventEmitter<
  ItemData | undefined
  >();

  readonly onDidChangeTreeData: vscode.Event<ItemData | undefined> = this.onDidChange.event;

  constructor(context: vscode.ExtensionContext, workspaceRoot: string | undefined) {
    this.extensionContext = context;
    this.workspaceRoot = workspaceRoot;
  }

  refresh(): void {
    this.onDidChange.fire(undefined);
  }

  getTreeItem(p: ItemData): TreeItem {
    let treeItem;
    if (p.children.length) {
      treeItem = new TreeItem(p, p.initialCollapsibleState, this.extensionContext);
    } else {
      treeItem = new TreeItem(p, vscode.TreeItemCollapsibleState.None, this.extensionContext);
    }
    return treeItem;
  }

  async getChildren(element): Promise<ItemData[]> {
    let itemDataList: ItemData[] = [];
    if (element) {
      itemDataList = element.children;
    } else {
      itemDataList = [
        ...(await this.buildQuickItems()),
        this.buildDividerItem(),
        await this.buildScriptParentItem(),
      ];
    }
    return itemDataList;
  }

  private buildActionItem(
    label: string,
    tooltip: string,
    icon = '',
    command?: vscode.Command,
  ): ItemData {
    const item = new ItemData();
    item.label = label;
    item.tooltip = tooltip;
    item.id = label;
    item.contextValue = 'action_button';
    item.command = command;
    item.icon = icon;
    return item;
  }

  private buildParentItem(
    label: string,
    tooltip: string,
    children: ItemData[],
    initialCollapsibleState: vscode.TreeItemCollapsibleState,
  ): ItemData {
    const item: ItemData = new ItemData();
    item.label = label;
    item.tooltip = tooltip;
    item.id = `${label}_title`;
    item.contextValue = 'title_item';
    item.children = children;
    item.initialCollapsibleState = initialCollapsibleState;
    return item;
  }

  private async buildQuickItems(): Promise<ItemData[]> {
    const items: ItemData[] = [];
    const debugLabel = i18n.format('extension.applicationManager.showEntriesQuickPick.runDebug.label');
    const debugItem = this.buildActionItem(
      debugLabel,
      i18n.format('extension.applicationManager.showEntriesQuickPick.runDebug.detail'),
      'runDev.svg',
      {
        command: 'applicationManager.scripts.runDebug',
        title: debugLabel,
      },
    );
    items.push(debugItem);

    if (vscode.extensions.getExtension('iceworks-team.iceworks-material-helper')) {
      const createPageLabel = i18n.format('extension.applicationManager.showEntriesQuickPick.generatePage.label');
      const createPageItem = this.buildActionItem(
        createPageLabel,
        i18n.format('extension.applicationManager.showEntriesQuickPick.generatePage.detail'),
        'add.svg',
        {
          command: 'material-helper.page-generator.start',
          title: createPageLabel,
        },
      );
      items.push(createPageItem);
    }

    const isAliInternal = await checkIsAliInternal();
    if (isAliInternal) {
      const publishLabel = i18n.format('extension.applicationManager.showEntriesQuickPick.DefPublish.label');
      const publishItem = this.buildActionItem(
        publishLabel,
        i18n.format('extension.applicationManager.showEntriesQuickPick.DefPublish.detail'),
        'publish.svg',
        {
          command: 'applicationManager.scripts.DefPublish',
          title: publishLabel,
        },
      );
      items.push(publishItem);
    } else {
      const buildLabel = i18n.format('extension.applicationManager.showEntriesQuickPick.runBuild.label');
      const buildItem = this.buildActionItem(
        buildLabel,
        i18n.format('extension.applicationManager.showEntriesQuickPick.runBuild.detail'),
        'build.svg',
        {
          command: 'applicationManager.scripts.runBuild',
          title: buildLabel,
        },
      );
      items.push(buildItem);
    }

    return items;
  }

  private buildDividerItem(): ItemData {
    const item = this.buildActionItem('', '', 'blue-line-96.png');
    return item;
  }

  private async buildScriptParentItem(): Promise<ItemData> {
    let scriptItems: ItemData[] = [];
    if (this.workspaceRoot) {
      const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
      scriptItems = await this.buildScriptItems(packageJsonPath);
    }
    const scriptParent = this.buildParentItem(
      'package.json',
      'scripts',
      scriptItems,
      vscode.TreeItemCollapsibleState.Expanded,
    );
    return scriptParent;
  }

  private async buildScriptItems(packageJsonPath: string): Promise<ItemData[]> {
    if (await checkPathExists(packageJsonPath)) {
      const packageJson = await fse.readJSON(packageJsonPath);
      const scripts = packageJson?.scripts || {};
      return Object.keys(scripts).map((scriptName) => {
        const id = `npmScripts-${scriptName}`;
        const scriptCommand = scripts[scriptName];
        const npmScript: string = createNpmCommand('run', scriptName);
        const command: vscode.Command = {
          command: 'applicationManager.npmScripts.run',
          title: npmScript,
          arguments: [this.workspaceRoot, npmScript],
        };
        const itemData = new ItemData();
        itemData.label = scriptName;
        itemData.tooltip = scriptCommand;
        itemData.command = command;
        itemData.id = id;
        itemData.contextValue = 'script';
        itemData.icon = 'tool.svg';
        return itemData;
      });
    }

    return [];
  }
}

export function createActionsTreeView(context: vscode.ExtensionContext) {
  const npmScriptsProvider = new ActionsProvider(context, projectPath);
  const treeView = vscode.window.createTreeView('npmScripts', { treeDataProvider: npmScriptsProvider });

  registerCommand('applicationManager.npmScripts.run', async (treeItem: TreeItem) => {
    const { command } = treeItem;
    if (command) {
      const { title } = command;
      const [cwd, scriptCommand] = command?.arguments as any[];
      if (!(await checkPathExists(projectPath, dependencyDir))) {
        runScript(title, cwd, createNpmCommand('install'));
        runScript(title, cwd, scriptCommand);
        return;
      }
      runScript(title, cwd, scriptCommand);
    }
  });
  registerCommand('applicationManager.npmScripts.stop', (treeItem: TreeItem) => {
    if (treeItem?.command?.title) {
      stopScript(treeItem?.command?.title);
    }
  });
  registerCommand('applicationManager.npmScripts.refresh', () => npmScriptsProvider.refresh());

  const pattern = new vscode.RelativePattern(projectPath, packageJSONFilename);
  const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
  fileWatcher.onDidChange(() => npmScriptsProvider.refresh());
  fileWatcher.onDidCreate(() => npmScriptsProvider.refresh());
  fileWatcher.onDidDelete(() => npmScriptsProvider.refresh());

  return treeView;
}
