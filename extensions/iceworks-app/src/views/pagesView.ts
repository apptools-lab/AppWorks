import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { checkPathExists, registerCommand } from '@iceworks/common-service';
import { pagesPath, projectPath } from '@iceworks/project-service';
import openEntryFile from '../openEntryFile';

export class PagesProvider implements vscode.TreeDataProvider<PageTreeItem> {
  private workspaceRoot: string;

  private extensionContext: vscode.ExtensionContext;

  private onDidChange: vscode.EventEmitter<PageTreeItem | undefined> = new vscode.EventEmitter<
    PageTreeItem | undefined
  >();

  readonly onDidChangeTreeData: vscode.Event<PageTreeItem | undefined> = this.onDidChange.event;

  constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
    this.extensionContext = context;
    this.workspaceRoot = workspaceRoot;
  }

  getTreeItem(element: PageTreeItem): vscode.TreeItem {
    return element;
  }

  refresh(): void {
    this.onDidChange.fire(undefined);
  }

  async getChildren() {
    if (!this.workspaceRoot) {
      return Promise.resolve([]);
    }
    const pagesPath = path.join(this.workspaceRoot, 'src', 'pages');
    if (await checkPathExists(pagesPath)) {
      const pages = this.getPages(pagesPath);
      return Promise.resolve(pages);
    } else {
      return Promise.resolve([]);
    }
  }

  private async getPages(pagesPath: string) {
    if (await checkPathExists(pagesPath)) {
      const toPage = (pageName: string) => {
        const pagePath = path.join(pagesPath, pageName);

        const command: vscode.Command = {
          command: 'iceworksApp.pages.openFile',
          title: 'Open File',
          arguments: [pagePath],
        };
        return new PageTreeItem(this.extensionContext, pageName, command, pagePath);
      };
      const dirNames = await fse.readdir(pagesPath);
      // except the file
      const pageNames = dirNames.filter((dirname) => {
        const stat = fse.statSync(path.join(pagesPath, dirname));
        return stat.isDirectory();
      });
      return pageNames.map((pageName) => toPage(pageName));
    } else {
      return [];
    }
  }
}

class PageTreeItem extends vscode.TreeItem {
  constructor(
    public readonly extensionContext: vscode.ExtensionContext,
    public readonly label: string,
    public readonly command: vscode.Command,
    public readonly path: string
  ) {
    super(label);
  }

  iconPath = {
    dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/page.svg')),
    light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/page.svg')),
  };

  contextValue = 'page';
}

const addPageQuickPickItems: any[] = [
  {
    label: '创建页面',
    detail: '通过配置模板的方式创建页面',
    command: 'iceworks-ui-builder.create-page',
  },
  {
    label: '生成页面',
    detail: '通过区块组装的方式生成页面',
    command: 'iceworks-ui-builder.generate-page',
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

export function createPagesTreeView(context: vscode.ExtensionContext) {
  const pagesProvider = new PagesProvider(context, projectPath);
  const treeView = vscode.window.createTreeView('pages', { treeDataProvider: pagesProvider });

  registerCommand('iceworksApp.pages.add', () => {
    console.log('iceworksApp: activate iceworks-ui-builder.generate-page');
    showAddPageQuickPicks();
  });
  registerCommand('iceworksApp.pages.refresh', () => pagesProvider.refresh());
  registerCommand('iceworksApp.pages.openFile', (pagePath) => openEntryFile(pagePath));
  registerCommand('iceworksApp.pages.delete', async (page) => await fse.remove(page.path));

  const pattern = new vscode.RelativePattern(pagesPath, '**');
  const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
  fileWatcher.onDidChange(() => pagesProvider.refresh());
  fileWatcher.onDidCreate(() => pagesProvider.refresh());
  fileWatcher.onDidDelete(() => pagesProvider.refresh());

  return treeView;
}
