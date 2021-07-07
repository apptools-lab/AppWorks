import * as vscode from 'vscode';
import * as rimraf from 'rimraf';
import * as fse from 'fs-extra';
import * as util from 'util';
import * as path from 'path';
import {
  createNpmCommand,
  checkPathExists,
  registerCommand,
  isYarnPackageManager,
  getAddDependencyAction,
} from '@appworks/common-service';
import { dependencyDir, projectPath, getLocalDependencyInfo } from '@appworks/project-service';
import runScript from '../terminal/runScript';
import { NodeDepTypes } from '../types';
import { nodeDepTypes } from '../constants';
import showDepsInputBox from '../inputBoxs/showDepsInputBox';
import showDepsQuickPick from '../quickPicks/showDepsQuickPick';
import { ItemData, TreeItem } from './treeItem';
import i18n from '../i18n';

const rimrafAsync = util.promisify(rimraf);

const upgradeDependencyCommandTitle = 'Upgrade Dependency';

class DepNodeProvider implements vscode.TreeDataProvider<ItemData> {
  private workspaceRoot: string;

  private extensionContext: vscode.ExtensionContext;

  private onDidChange: vscode.EventEmitter<ItemData | undefined> = new vscode.EventEmitter<
  ItemData | undefined
  >();

  readonly onDidChangeTreeData: vscode.Event<ItemData | undefined> = this.onDidChange.event;

  packageJsonPath: string;

  constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
    this.extensionContext = context;
    this.workspaceRoot = workspaceRoot;
    this.packageJsonPath = path.join(this.workspaceRoot, 'package.json');
  }

  refresh(): void {
    this.onDidChange.fire(undefined);
  }

  getTreeItem(p: ItemData): TreeItem {
    const treeItem = new TreeItem(p, p.initialCollapsibleState, this.extensionContext);
    return treeItem;
  }

  async getChildren(element: ItemData): Promise<ItemData[]> {
    let itemDataList: ItemData[] = [];
    if (element) {
      itemDataList = await this.buildDepsChildItems(element.contextValue as NodeDepTypes);
    } else {
      itemDataList = [
        ...this.buildQuickItems(),
        this.buildDividerItem(),
        ...await this.buildDepsParentItem(),
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

  private buildDividerItem(): ItemData {
    const item = this.buildActionItem('', '', 'blue-line-96.png');
    return item;
  }

  private buildParentItem(
    label: string,
    tooltip: string,
    children: ItemData[],
    initialCollapsibleState: vscode.TreeItemCollapsibleState,
    contextValue: string,
    icon: string,
  ): ItemData {
    const item: ItemData = new ItemData();
    item.label = label;
    item.tooltip = tooltip;
    item.id = `${label}_title`;
    item.contextValue = 'title_item';
    item.children = children;
    item.initialCollapsibleState = initialCollapsibleState;
    item.contextValue = contextValue;
    item.icon = icon;
    return item;
  }

  async buildDepsChildItems(nodeDepType: NodeDepTypes) {
    let depItems: ItemData[] = [];
    if (this.workspaceRoot && await checkPathExists(this.packageJsonPath)) {
      const packageJson = await fse.readJSON(this.packageJsonPath);
      const packageDeps = packageJson[nodeDepType];
      if (packageDeps) {
        depItems = await Promise.all(
          Object.keys(packageDeps).map(async (moduleName) => {
            const { outdated, version } = await getLocalDependencyInfo(moduleName, packageDeps[moduleName]);
            const command = outdated
              ? {
                command: 'applicationManager.nodeDependencies.upgrade',
                title: upgradeDependencyCommandTitle,
                arguments: [this.workspaceRoot, moduleName, outdated],
              }
              : undefined;
            const itemData = new ItemData();
            itemData.label = moduleName;
            itemData.contextValue = outdated ? 'outdatedDependency' : '';
            itemData.icon = 'dependency.svg';
            itemData.tooltip = version;
            itemData.description = version;
            itemData.command = command;
            return itemData;
          }),
        );
      }
    }
    return depItems;
  }

  private async buildDepsParentItem(): Promise<ItemData[]> {
    return await Promise.all(nodeDepTypes.map(
      async (nodeDepType) => {
        return this.buildParentItem(
          nodeDepType,
          nodeDepType,
          [],
          vscode.TreeItemCollapsibleState.Collapsed,
          nodeDepType,
          'dependency-entry.svg',
        );
      },
    ));
  }

  private buildQuickItems(): ItemData[] {
    const items: ItemData[] = [];
    const reinstallLabel = i18n.format('extension.applicationManager.showEntriesQuickPick.reinstall.label');
    const reinstallItem = this.buildActionItem(
      reinstallLabel,
      i18n.format('extension.applicationManager.showEntriesQuickPick.reinstall.detail'),
      'dep-reinstall.svg',
      {
        command: 'applicationManager.nodeDependencies.reinstall',
        title: reinstallLabel,
      },
    );
    items.push(reinstallItem);

    const addDepsLabel = i18n.format('extension.applicationManager.showEntriesQuickPick.addDepsAndDevDeps.label');
    const addDepsItem = this.buildActionItem(
      addDepsLabel,
      i18n.format('extension.applicationManager.showEntriesQuickPick.addDepsAndDevDeps.detail'),
      'install.svg',
      {
        command: 'applicationManager.nodeDependencies.addDepsAndDevDeps',
        title: addDepsLabel,
      },
    );
    items.push(addDepsItem);
    return items;
  }

  getAddDependencyScript(depType: NodeDepTypes, packageName: string) {
    const workspaceDir: string = path.dirname(this.packageJsonPath);
    const isYarn = isYarnPackageManager();
    const isDevDep = depType === 'devDependencies';
    const npmCommandAction = getAddDependencyAction(); // `add` or `install`

    let extraAction = '';
    if (isDevDep) {
      extraAction = '-D';
    } else if (isYarn) {
      extraAction = '-S';
    }
    const command = createNpmCommand(npmCommandAction, packageName, extraAction);
    return {
      title: 'Add Dependency',
      cwd: workspaceDir,
      command,
    };
  }
}

export function createNodeDependenciesTreeView(context) {
  const nodeDependenciesProvider = new DepNodeProvider(context, projectPath);
  const treeView = vscode.window.createTreeView('nodeDependencies', { treeDataProvider: nodeDependenciesProvider });

  registerCommand('applicationManager.nodeDependencies.refresh', () => nodeDependenciesProvider.refresh());

  registerCommand('applicationManager.nodeDependencies.upgrade', (node: ItemData) => {
    const { command } = node;
    if (command) {
      const [cwd, moduleName, outdated] = command?.arguments as any[];
      const isYarn = isYarnPackageManager();
      let updateScript = '';
      if (isYarn) {
        updateScript = createNpmCommand('upgrade', moduleName);
      } else {
        const uninstallScript = createNpmCommand('uninstall', moduleName, '--no-save');
        const installScript = createNpmCommand('install', outdated ? `${moduleName}@${outdated}` : moduleName);
        updateScript = `${uninstallScript} && ${installScript}`;
      }
      runScript(command.title || upgradeDependencyCommandTitle, cwd || projectPath, updateScript);
    }
  });
  registerCommand('applicationManager.nodeDependencies.reinstall', async () => {
    if (await checkPathExists(nodeDependenciesProvider.packageJsonPath)) {
      const workspaceDir: string = path.dirname(nodeDependenciesProvider.packageJsonPath);
      const nodeModulesPath = path.join(workspaceDir, 'node_modules');
      const nodeModulesExists = await checkPathExists(nodeModulesPath);
      if (nodeModulesExists) {
        await vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title: i18n.format('extension.applicationManager.nodeDependencies.delete.title', { nodeModulesPath }),
        }, async () => {
          try {
            await rimrafAsync(nodeModulesPath);
          } catch (error) {
            vscode.window.showErrorMessage(`Fail to delete ${nodeModulesPath}. Error: ${error.message}.`);
          }
          return Promise.resolve();
        });
      }
      const command = createNpmCommand('install');
      const title = 'Reinstall Dependencies';
      const cwd = workspaceDir;
      runScript(title, cwd, command);
    }
  });
  registerCommand('applicationManager.nodeDependencies.dependencies.add', () => showDepsInputBox(nodeDependenciesProvider, 'dependencies'));
  registerCommand('applicationManager.nodeDependencies.devDependencies.add', () => showDepsInputBox(nodeDependenciesProvider, 'devDependencies'));
  registerCommand('applicationManager.nodeDependencies.addDepsAndDevDeps', () => showDepsQuickPick(nodeDependenciesProvider));

  const pattern = new vscode.RelativePattern(path.join(projectPath, dependencyDir), '**');
  const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
  fileWatcher.onDidChange(() => nodeDependenciesProvider.refresh());
  fileWatcher.onDidCreate(() => nodeDependenciesProvider.refresh());
  fileWatcher.onDidDelete(() => nodeDependenciesProvider.refresh());

  return treeView;
}

