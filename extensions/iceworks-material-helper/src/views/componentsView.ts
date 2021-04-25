import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { checkPathExists, registerCommand } from '@iceworks/common-service';
import { componentsPath, projectPath } from '@iceworks/project-service';
import openEntryFile from '../utils/openEntryFile';
import i18n from '../i18n';
import getOptions from '../utils/getOptions';
import { ItemData, TreeItem } from './treeItem';

const { window, commands } = vscode;

const addComponentTypeOptions = [
  {
    label: i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.imgcook.label'),
    detail: i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.imgcook.detail'),
    command: 'imgcook.showPanel',
    args: { fromIceworks: true },
    async condition() {
      return vscode.extensions.getExtension('imgcook.imgcook');
    },
  },
  {
    label: i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.generateComponent.label'),
    detail: i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.generateComponent.detail'),
    command: 'iceworks-ui-builder.design-component',
    async condition() {
      return vscode.extensions.getExtension('iceworks-team.iceworks-ui-builder');
    },
  },
  {
    label: i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.createComponent.label'),
    detail: i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.createComponent.detail'),
    command: 'iceworks-material-helper.component-creator.start',
  },
];

async function showAddComponentQuickPick() {
  const quickPick = window.createQuickPick();
  quickPick.items = await getOptions(addComponentTypeOptions);
  quickPick.onDidChangeSelection((selection) => {
    if (selection[0]) {
      const currentExtension = addComponentTypeOptions.find((option) => option.label === selection[0].label)!;
      if (currentExtension) {
        const { command, args } = currentExtension;
        commands.executeCommand(command, args);
        quickPick.dispose();
      }
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}

class ComponentsProvider implements vscode.TreeDataProvider<ItemData> {
  private workspaceRoot: string;

  private extensionContext: vscode.ExtensionContext;

  private onDidChange: vscode.EventEmitter<ItemData | undefined> = new vscode.EventEmitter<
  ItemData | undefined
  >();

  readonly onDidChangeTreeData: vscode.Event<ItemData | undefined> = this.onDidChange.event;

  constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
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
        ...this.buildQuickItems(),
        this.buildDividerItem(),
        ...await this.buildComponentItems(),
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

  private buildQuickItems(): ItemData[] {
    const items: ItemData[] = [];
    const createComponentLabel = i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.createComponent.label');
    const createComponentItem = this.buildActionItem(
      createComponentLabel,
      i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.createComponent.detail'),
      'download.svg',
      {
        command: 'iceworks-material-helper.component-creator.start',
        title: createComponentLabel,
      },
    );
    items.push(createComponentItem);

    if (vscode.extensions.getExtension('iceworks-team.iceworks-ui-builder')) {
      const generateComponentLabel = i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.generateComponent.label');
      const generateComponentItem = this.buildActionItem(
        generateComponentLabel,
        i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.generateComponent.detail'),
        'image.svg',
        {
          command: 'iceworks-ui-builder.design-component',
          title: generateComponentLabel,
        },
      );
      items.push(generateComponentItem);
    }
    return items;
  }

  async buildComponentItems(): Promise<ItemData[]> {
    if (this.workspaceRoot) {
      const isComponentPathExists = await checkPathExists(componentsPath);
      if (isComponentPathExists) {
        const toComponent = (componentName: string) => {
          const componentPath = path.join(componentsPath, componentName);
          const command: vscode.Command = {
            command: 'iceworks-material-helper.components.openFile',
            title: 'Open File',
            arguments: [componentPath],
          };
          const itemData = new ItemData();
          itemData.label = componentName;
          itemData.command = command;
          itemData.contextValue = 'component';
          itemData.icon = 'component.svg';
          // @ts-ignore
          itemData.fsPath = componentPath;
          return itemData;
        };
        const dirNames = await fse.readdir(componentsPath);
        const componentNames = dirNames.filter((dirname) => {
          const stat = fse.statSync(path.join(componentsPath, dirname));
          return stat.isDirectory();
        });
        return componentNames.map((componentName) => toComponent(componentName));
      }
    }

    return [];
  }
}

export function createComponentsTreeView(context: vscode.ExtensionContext) {
  const componentsProvider = new ComponentsProvider(context, projectPath);
  const treeView = vscode.window.createTreeView('components', { treeDataProvider: componentsProvider });

  registerCommand('iceworks-material-helper.components.add', async () => {
    await showAddComponentQuickPick();
  });
  registerCommand('iceworks-material-helper.components.refresh', () => componentsProvider.refresh());
  registerCommand('iceworks-material-helper.components.openFile', (componentPath) => openEntryFile(componentPath));
  registerCommand('iceworks-material-helper.components.delete', async (component) => {
    const confirmTitle = i18n.format('extension.iceworksMaterialHelper.confirm');
    const choice = await vscode.window.showInformationMessage(
      i18n.format('extension.iceworksMaterialHelper.removeComponentAndReferences.title'),
      confirmTitle,
      i18n.format('extension.iceworksMaterialHelper.cancel'),
    );
    if (choice === confirmTitle) {
      if (vscode.extensions.getExtension('iceworks-team.iceworks-refactor')) {
        await vscode.commands.executeCommand('iceworks-refactor.component.file-and-reference.remove', { path: component.fsPath });
      }
    }
  });

  const pattern = new vscode.RelativePattern(componentsPath, '**');
  const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
  fileWatcher.onDidChange(() => componentsProvider.refresh());
  fileWatcher.onDidCreate(() => componentsProvider.refresh());
  fileWatcher.onDidDelete(() => componentsProvider.refresh());

  return treeView;
}
