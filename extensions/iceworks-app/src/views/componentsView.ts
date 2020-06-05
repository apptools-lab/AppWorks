import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as util from 'util';
import { pathExists } from '../utils';

export class ComponentsProvider implements vscode.TreeDataProvider<Component> {
  private _onDidChangeTreeData: vscode.EventEmitter<Component | undefined> = new vscode.EventEmitter<Component | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Component | undefined> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) {
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: Component): vscode.TreeItem {
    return element;
  }

  getChildren() {
    if (!this.workspaceRoot) {
      return Promise.resolve([]);
    }
    const componentsPath = path.join(this.workspaceRoot, 'src', 'components');
    if (pathExists(componentsPath)) {
      const components = this.getComponents(componentsPath);
      return Promise.resolve(components);
    } else {
      return Promise.resolve([]);
    }
  }

  private async getComponents(componentsPath: string) {
    if (pathExists(componentsPath)) {
      const toComponent = (componentName: string) => {
        const pageEntryPath = path.join(componentsPath, componentName);

        const cmdObj: vscode.Command = {
          command: 'iceworksApp.components.openFile',
          title: 'Open File',
          arguments: [pageEntryPath]
        };

        return new Component(componentName, cmdObj);
      };
      const dirNames = await fse.readdir(componentsPath);
      // except file
      const componentNames = dirNames.filter(dirname => {
        const stat = fse.statSync(path.join(componentsPath, dirname))
        return stat.isDirectory();
      })
      return componentNames.map(componentName => toComponent(componentName));
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
    light: path.join(__filename, '..', '..', '..', 'assets', 'light', 'component.svg'),
    dark: path.join(__filename, '..', '..', '..', 'assets', 'dark', 'component.svg')
  };

  contextValue = 'component';
}
