import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { pathExists } from './utils';
import { entryFileSuffix } from './constants';

export class ComponentsProvider implements vscode.TreeDataProvider<Component> {
  private _onDidChangeTreeData: vscode.EventEmitter<Component | undefined> = new vscode.EventEmitter<Component | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Component | undefined> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot?: string) {
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: Component): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<Component[]> {
    if (!this.workspaceRoot) {
      return Promise.resolve([]);
    }
    const componentsPath = path.join(this.workspaceRoot, 'src', 'components');
    if (pathExists(componentsPath)) {
      return Promise.resolve(this.getComponents(componentsPath));
    } else {
      return Promise.resolve([]);
    }
  }

  private getComponents(componentsPath: string): Component[] {
    if (pathExists(componentsPath)) {
      const toComponent = (componentName: string) => {
        const pageEntryPath = path.join(componentsPath, componentName);

        const cmdObj = {
          command: 'components.openFile',
          title: 'Open File',
          arguments: [pageEntryPath]
        };

        return new Component(componentName, cmdObj);
      };

      const componentsName = fs.readdirSync(componentsPath);
      return componentsName.map(componentName => toComponent(componentName));
    } else {
      return [];
    }
  }
}

class Component extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly command?: vscode.Command
  ) {
    super(label);
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'assets', 'light', 'component.svg'),
    dark: path.join(__filename, '..', '..', 'assets', 'dark', 'component.svg')
  };

  contextValue = 'component';
}
