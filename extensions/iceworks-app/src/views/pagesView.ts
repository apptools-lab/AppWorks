import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { pathExists } from '../utils';

export class PagesProvider implements vscode.TreeDataProvider<Page> {
  private workspaceRoot: string;

  private onDidChange: vscode.EventEmitter<Page | undefined> = new vscode.EventEmitter<Page | undefined>();

  readonly onDidChangeTreeData: vscode.Event<Page | undefined> = this.onDidChange.event;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot
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
        return new Page(pageName, cmdObj);
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
    public readonly label: string,
    public readonly command?: vscode.Command
  ) {
    super(label);
  }

  iconPath = {
    light: path.join(__filename, '..', '..', '..', 'assets', 'light', 'page.svg'),
    dark: path.join(__filename, '..', '..', '..', 'assets', 'dark', 'page.svg')
  };

  contextValue = 'page';
}
