import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class PagesProvider implements vscode.TreeDataProvider<Page> {
  constructor(private workspaceRoot: string) { }

  getTreeItem(element: Page): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<Page[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No Page found');
      return Promise.resolve([]);
    }
    const pagesPath = path.join(this.workspaceRoot, 'src', 'pages');
    if (this.pathExists(pagesPath)) {
      return Promise.resolve(this.getPages(pagesPath));
    } else {
      return Promise.resolve([]);
    }
  }

  private getPages(pagesPath: string): Page[] {
    if (this.pathExists(pagesPath)) {

      const toPage = (pageName: string) => {
        return new Page(pageName);
      };

      const pagesName = fs.readdirSync(pagesPath);
      return pagesName.map(pageName => toPage(pageName));
    } else {
      return [];
    }
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }
}

class Page extends vscode.TreeItem {
  constructor(
    public readonly label: string
  ) {
    super(label);
  }
}
