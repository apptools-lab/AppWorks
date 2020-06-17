import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { pathExists } from '../utils';

export class PagesProvider implements vscode.TreeDataProvider<Page> {
  private workspaceRoot: string;

  private extensionContext: vscode.ExtensionContext;

  private onDidChange: vscode.EventEmitter<Page | undefined> = new vscode.EventEmitter<Page | undefined>();

  readonly onDidChangeTreeData: vscode.Event<Page | undefined> = this.onDidChange.event;

  constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
    this.extensionContext = context;
    this.workspaceRoot = workspaceRoot;
  }

  getTreeItem(element: Page): vscode.TreeItem {
    return element;
  }

  refresh(): void {
    this.onDidChange.fire(undefined);
  }

  getChildren() {
    if (!this.workspaceRoot) {
      return Promise.resolve([]);
    }
    const pagesPath = path.join(this.workspaceRoot, 'src', 'pages');
    if (pathExists(pagesPath)) {
      const pages = this.getPages(pagesPath);
      return Promise.resolve(pages);
    } else {
      return Promise.resolve([]);
    }
  }

  private async getPages(pagesPath: string) {
    if (pathExists(pagesPath)) {
      const toPage = (pageName: string) => {
        const pageEntryPath = path.join(pagesPath, pageName);

        const cmdObj: vscode.Command = {
          command: 'iceworksApp.pages.openFile',
          title: 'Open File',
          arguments: [pageEntryPath]
        };
        return new Page(this.extensionContext, pageName, cmdObj);
      };
      const dirNames = await fse.readdir(pagesPath);
      // except the file
      const pageNames = dirNames.filter(dirname => {
        const stat = fse.statSync(path.join(pagesPath, dirname))
        return stat.isDirectory();
      })
      return pageNames.map(pageName => toPage(pageName));
    } else {
      return [];
    }
  }
}

class Page extends vscode.TreeItem {
  constructor(
    public readonly extensionContext: vscode.ExtensionContext,
    public readonly label: string,
    public readonly command?: vscode.Command
  ) {
    super(label);
  }

  iconPath = {
    dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/page.svg')),
    light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/page.svg'))
  };

  contextValue = 'page';
}
