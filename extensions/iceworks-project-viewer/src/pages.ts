import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { pathExists } from './utils';

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

  getChildren(): Thenable<Page[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No Page found');
      return Promise.resolve([]);
    }
    const pagesPath = path.join(this.workspaceRoot, 'src', 'pages');
    if (pathExists(pagesPath)) {
      return Promise.resolve(this.getPages(pagesPath));
    } else {
      return Promise.resolve([]);
    }
  }

  private getPages(pagesPath: string): Page[] {
    if (pathExists(pagesPath)) {
      const toPage = (pageName: string) => {
        const pageIndexPath = vscode.Uri.file(path.join(pagesPath, pageName, 'index.tsx'));

        const cmdObj = {
          command: 'pages.openFile',
          title: 'Open File',
          arguments: [pageIndexPath]
        };

        return new Page(pageName, cmdObj);
      };

      const pagesName = fs.readdirSync(pagesPath);
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

  contextValue = 'page';
}
