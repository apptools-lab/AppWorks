import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { pathExists, getPackageManager } from './utils';
import { NodeDepTypes } from './types';

const nodeDepTypes: NodeDepTypes[] = [
  'dependencies',
  'devDependencies'
];

export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {
  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot?: string) {
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    if (!this.workspaceRoot) {
      return Promise.resolve([]);
    }

    if (element) {
      const { label } = element;
      const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
      return Promise.resolve(this.getDepsInPackageJson(packageJsonPath, (label as NodeDepTypes)));
    } else {
      return Promise.resolve(nodeDepTypes.map(nodeDepType => new Dependency(nodeDepType, vscode.TreeItemCollapsibleState.Collapsed)));
    }
  }

  private getDepsInPackageJson(packageJsonPath: string, label: NodeDepTypes): Dependency[] {
    if (pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const workspaceDir: string = path.dirname(packageJsonPath);

      const toDep = (moduleName: string, version: string): Dependency => {
        return new Dependency(moduleName, vscode.TreeItemCollapsibleState.None, version, {
          command: 'nodeDependencies.upgradeEntry',
          title: 'Upgrade Dependency',
          arguments: [workspaceDir, `${getPackageManager()} update ${moduleName}`]
        });
      };
      return packageJson[label]
        ? Object.keys(packageJson[label]).map(dep => toDep(dep, packageJson[label][dep]))
        : [];
    } else {
      return [];
    }
  }

  public install() {
    if (!this.workspaceRoot) {
      vscode.window.showErrorMessage('The workspace root is Empty. Please open a project.');
      return;
    }
    const packageJsonPath = path.join(this.workspaceRoot, 'package.json');

    if (pathExists(packageJsonPath)) {
      const workspaceDir: string = path.dirname(packageJsonPath);
      return {
        command: {
          command: 'nodeDependencies.upgradeEntry',
          title: 'Install Dependencies',
          arguments: [workspaceDir, `${getPackageManager()} install`]
        }
      };
    }
  }

  public reinstall() {
    if (!this.workspaceRoot) {
      vscode.window.showErrorMessage('The workspace root is Empty. Please open a project.');
      return;
    }
    const packageJsonPath = path.join(this.workspaceRoot, 'package.json');

    if (pathExists(packageJsonPath)) {
      const workspaceDir: string = path.dirname(packageJsonPath);
      return {
        command: {
          command: 'nodeDependencies.upgradeEntry',
          title: 'Install Dependencies',
          arguments: [workspaceDir, `rm -rf node_modules && ${getPackageManager()} install`]
        }
      };
    }
  }
}

export class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly version?: string,
    public readonly command?: vscode.Command,
  ) {
    super(label, collapsibleState);
  }

  get description(): string {
    return this.version ? this.version : '';
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'assets', 'light', 'dependency.svg'),
    dark: path.join(__filename, '..', '..', 'assets', 'dark', 'dependency.svg')
  };

  contextValue = this.version ? 'dependency' : 'dependenciesDir';
}
