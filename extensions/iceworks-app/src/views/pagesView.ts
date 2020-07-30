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

export function createPagesTreeProvider(context: vscode.ExtensionContext, rootPath: string) {
  const pagesProvider = new PagesProvider(context, rootPath);
  vscode.window.registerTreeDataProvider('pages', pagesProvider);
  vscode.commands.registerCommand('iceworksApp.pages.add', () => {
    console.log('iceworksApp: activate iceworks-ui-builder.generate-page');
    vscode.commands.executeCommand('iceworks-ui-builder.generate-page');
  });
  vscode.commands.registerCommand('iceworksApp.pages.refresh', () => pagesProvider.refresh());
  vscode.commands.registerCommand('iceworksApp.pages.openFile', (pagePath) => openEntryFile(pagePath));
  vscode.commands.registerCommand('iceworksApp.pages.delete', async (page) => {
    await fse.remove(page.path);
  });

  const pattern = new vscode.RelativePattern(pagesPath, '**');
  const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
  fileWatcher.onDidChange(() => pagesProvider.refresh());
  fileWatcher.onDidCreate(() => pagesProvider.refresh());
  fileWatcher.onDidDelete(() => pagesProvider.refresh());
}
