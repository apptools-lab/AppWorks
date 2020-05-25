import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { pathExists, getPackageManager } from './utils';
import { NodeDepTypes, Command } from './types';
import { getNodeDepVersion } from 'ice-npm-utils';
import { nodeDepTypes } from './constants';

export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {
  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

  packageJsonPath: string;

  constructor(private workspaceRoot: string) {
    this.packageJsonPath = path.join(this.workspaceRoot, 'package.json');
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
      return Promise.resolve(this.getDepsInPackageJson(this.packageJsonPath, (label as NodeDepTypes)));
    } else {
      return Promise.resolve(nodeDepTypes.map(nodeDepType => new Dependency(nodeDepType, vscode.TreeItemCollapsibleState.Collapsed)));
    }
  }

  private getDepVersion(moduleName: string) {
    const nodeModulesPath = path.join(this.workspaceRoot, 'node_modules');

    if (!pathExists(nodeModulesPath)) {
      vscode.window.showErrorMessage('The node_modules folder is empty. Please run `npm install` first.');
    }

    return getNodeDepVersion(nodeModulesPath, moduleName);
  };

  private getDepsInPackageJson(packageJsonPath: string, label: NodeDepTypes): Dependency[] {
    if (pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const workspaceDir: string = path.dirname(packageJsonPath);

      const toDep = (moduleName: string, version: string): Dependency => {
        return new Dependency(moduleName, vscode.TreeItemCollapsibleState.None, version, {
          command: 'nodeDependencies.upgrade',
          title: 'Upgrade Dependency',
          arguments: [workspaceDir, `${getPackageManager()} update ${moduleName}`]
        });
      };

      return packageJson[label]
        ? Object.keys(packageJson[label]).map(dep => toDep(dep, this.getDepVersion(dep) || ''))
        : [];
    } else {
      return [];
    }
  }

  public install() {
    if (pathExists(this.packageJsonPath)) {
      const workspaceDir: string = path.dirname(this.packageJsonPath);
      const command: Command = {
        command: 'nodeDependencies.upgrade',
        title: 'Install Dependencies',
        arguments: [workspaceDir, `${getPackageManager()} install`]
      };
      return {
        command
      };
    }
  }

  public reinstall() {
    if (pathExists(this.packageJsonPath)) {
      const workspaceDir: string = path.dirname(this.packageJsonPath);
      const command: Command = {
        command: 'nodeDependencies.upgrade',
        title: 'Install Dependencies',
        arguments: [workspaceDir, `rm -rf node_modules && ${getPackageManager()} install`]
      };
      return {
        command
      };
    }
  }

  public installDependency(depType: NodeDepTypes, packageName: string) {
    const workspaceDir: string = path.dirname(this.packageJsonPath);
    const packageManager = getPackageManager();
    const isYarn = packageManager === 'yarn';
    const isDevDep = depType === 'devDependencies';
    const command: Command = {
      command: 'nodeDependencies.addDependency',
      title: 'Add Dependency',
      arguments: [workspaceDir, `${packageManager} ${isYarn ? 'add' : 'install'} ${packageName} -${isDevDep ? 'D' : isYarn ? '' : 'S'}`]
    };
    return {
      command
    };
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
    light: path.join(__filename, '..', '..', 'assets', 'light', this.version ? 'dependency.svg' : 'dependency-entry.svg'),
    dark: path.join(__filename, '..', '..', 'assets', 'dark', this.version ? 'dependency.svg' : 'dependency-entry.svg')
  };

  contextValue = this.version ? 'dependency' : 'dependenciesDir';
}
