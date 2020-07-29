import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { checkPathExists } from '@iceworks/common-service';
import { pagesPath } from '@iceworks/project-service';
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
        const pageEntryPath = path.join(pagesPath, pageName);

        const command: vscode.Command = {
          command: 'iceworksApp.pages.openFile',
          title: 'Open File',
          arguments: [pageEntryPath],
        };
        return new PageTreeItem(this.extensionContext, pageName, command);
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
    public readonly command: vscode.Command
  ) {
    super(label);
  }

  iconPath = {
    dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/page.svg')),
    light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/page.svg')),
  };

  contextValue = 'page';
}

export function createPagesTreeProvider(context: vscode.ExtensionContext, rootPath: string) {
  const pagesProvider = new PagesProvider(context, rootPath);
  vscode.window.registerTreeDataProvider('pages', pagesProvider);
  vscode.commands.registerCommand('iceworksApp.pages.add', () => {
    console.log('iceworksApp: activate iceworks-page-builder.create');
    vscode.commands.executeCommand('iceworks-page-builder.create');
  });
  vscode.commands.registerCommand('iceworksApp.pages.refresh', () => pagesProvider.refresh());
  vscode.commands.registerCommand('iceworksApp.pages.openFile', (p) => openEntryFile(p));

  const pattern = path.join(pagesPath);
  const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);
  fileWatcher.onDidChange(() => pagesProvider.refresh());
  fileWatcher.onDidCreate(() => pagesProvider.refresh());
  fileWatcher.onDidDelete(() => pagesProvider.refresh());
}
