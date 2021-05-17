import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { checkPathExists, registerCommand } from '@appworks/common-service';
import { pagesPath as projectPagesPath, projectPath } from '@appworks/project-service';
import openEntryFile from '../utils/openEntryFile';
import i18n from '../i18n';
import { ItemData, TreeItem } from './treeItem';

const addPageQuickPickItems: any[] = [
  {
    label: i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.generatePage.label'),
    detail: i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.generatePage.detail'),
    command: 'material-helper.page-generator.start',
  },
];
function showAddPageQuickPicks() {
  const quickPick = vscode.window.createQuickPick();
  quickPick.items = addPageQuickPickItems;
  quickPick.onDidChangeSelection((change) => {
    // @ts-ignore
    vscode.commands.executeCommand(change[0].command);
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}

class PagesProvider implements vscode.TreeDataProvider<ItemData> {
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
        ...await this.buildPageItems(),
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
    const generatePageLabel = i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.generatePage.label');
    const generatePageItem = this.buildActionItem(
      generatePageLabel,
      i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.generatePage.detail'),
      'order.svg',
      {
        command: 'material-helper.page-generator.start',
        title: generatePageLabel,
      },
    );
    items.push(generatePageItem);
    return items;
  }

  private async buildPageItems(): Promise<ItemData[]> {
    if (this.workspaceRoot) {
      const pagesPath = path.join(this.workspaceRoot, 'src', 'pages');
      const isPagePathExists = await checkPathExists(pagesPath);
      if (isPagePathExists) {
        const toPage = (pageName: string) => {
          const pagePath = path.join(pagesPath, pageName);
          const command: vscode.Command = {
            command: 'material-helper.pages.openFile',
            title: 'Open File',
            arguments: [pagePath],
          };
          const itemData = new ItemData();
          itemData.label = pageName;
          itemData.command = command;
          itemData.contextValue = 'page';
          itemData.icon = 'page.svg';
          // @ts-ignore
          itemData.fsPath = pagePath;
          return itemData;
        };
        const dirNames = await fse.readdir(pagesPath);
        const pageNames = dirNames.filter((dirname) => {
          const stat = fse.statSync(path.join(pagesPath, dirname));
          return stat.isDirectory();
        });
        return pageNames.map((pageName) => toPage(pageName));
      }
    }
    return [];
  }
}

export function createPagesTreeView(context: vscode.ExtensionContext) {
  const pagesProvider = new PagesProvider(context, projectPath);
  const treeView = vscode.window.createTreeView('pages', { treeDataProvider: pagesProvider });

  registerCommand('material-helper.pages.add', () => {
    showAddPageQuickPicks();
  });
  registerCommand('material-helper.pages.refresh', () => pagesProvider.refresh());
  registerCommand('material-helper.pages.openFile', (pagePath) => openEntryFile(pagePath));
  registerCommand('material-helper.pages.delete', async (page) => await fse.remove(page.fsPath));

  const pattern = new vscode.RelativePattern(projectPagesPath, '**');
  const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
  fileWatcher.onDidChange(() => pagesProvider.refresh());
  fileWatcher.onDidCreate(() => pagesProvider.refresh());
  fileWatcher.onDidDelete(() => pagesProvider.refresh());

  return treeView;
}
