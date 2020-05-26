import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { pathExists } from '../utils';

const readdir = util.promisify(fs.readdir);

export class PagesProvider implements vscode.TreeDataProvider<Page> {
  private _onDidChangeTreeData: vscode.EventEmitter<Page | undefined> = new vscode.EventEmitter<Page | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Page | undefined> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) { }

  getTreeItem(element: Page): vscode.TreeItem {
    return element;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
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
          command: 'pages.openFile',
          title: 'Open File',
          arguments: [pageEntryPath]
        };

        return new Page(pageName, cmdObj);
      };

      const pagesName = await readdir(pagesPath);
      return pagesName.map(pageName => toPage(pageName));
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
