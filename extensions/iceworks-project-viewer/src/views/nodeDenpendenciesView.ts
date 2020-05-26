import * as vscode from 'vscode';
import * as util from 'util';
import * as rimraf from 'rimraf';
import * as fs from 'fs';
import * as path from 'path';
import latestVersion from 'latest-version';
import { pathExists, getNpmClient, createNpmCommand } from '../utils';
import { NodeDepTypes } from '../types';
import { getNodeDepVersion } from 'ice-npm-utils';
import { nodeDepTypes, npmClients, npmRegisters } from '../constants';

const rimrafAsync = util.promisify(rimraf);

export class DepNodeProvider implements vscode.TreeDataProvider<DependencyNode> {
  private _onDidChangeTreeData: vscode.EventEmitter<DependencyNode | undefined> = new vscode.EventEmitter<DependencyNode | undefined>();
  readonly onDidChangeTreeData: vscode.Event<DependencyNode | undefined> = this._onDidChangeTreeData.event;

  packageJsonPath: string;

  constructor(private workspaceRoot: string) {
    this.packageJsonPath = path.join(this.workspaceRoot, 'package.json');
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: DependencyNode): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: DependencyNode) {
    if (!this.workspaceRoot) {
      return Promise.resolve([]);
    }

    if (element) {
      const { label } = element;
      const deps = await this.getDepsInPackageJson(this.packageJsonPath, (label as NodeDepTypes));
      return deps;
    } else {
      return Promise.resolve(nodeDepTypes.map(nodeDepType => new DependencyNode(nodeDepType, vscode.TreeItemCollapsibleState.Collapsed)));
    }
  }

  private getDepVersion(moduleName: string) {
    const nodeModulesPath = path.join(this.workspaceRoot, 'node_modules');
    if (!pathExists(nodeModulesPath)) {
      vscode.window.showErrorMessage('The node_modules folder is empty. Please run `npm install` first.');
      return;
    }
    return getNodeDepVersion(nodeModulesPath, moduleName);
  };

  private async getDepsInPackageJson(packageJsonPath: string, label: NodeDepTypes) {
    if (pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const workspaceDir: string = path.dirname(packageJsonPath);

      function toDep(moduleName: string, version: string, outdated: boolean) {
        const npmCommand = createNpmCommand('update', moduleName);
        const command = outdated ?
          {
            command: 'nodeDependencies.upgrade',
            title: 'Upgrade Dependency',
            arguments: [workspaceDir, npmCommand]
          } :
          undefined;
        return new DependencyNode(moduleName, vscode.TreeItemCollapsibleState.None, version, command, outdated);
      };

      let deps: DependencyNode[] = [];
      if (packageJson[label]) {
        for (const dep of Object.keys(packageJson[label])) {
          const version = this.getDepVersion(dep) || '';
          const outdated = await this.getNpmOutdated(dep, version);
          deps.push(toDep(dep, version, outdated));
        }
      }

      return deps;
    } else {
      return [];
    }
  }

  private async getNpmOutdated(moduleName: string, version: string) {
    try {
      const latest = await latestVersion(moduleName);
      return version !== latest;
    } catch (err) {
      console.error(err);
      return false;
    };
  };

  public install() {
    if (pathExists(this.packageJsonPath)) {
      const workspaceDir: string = path.dirname(this.packageJsonPath);
      const npmCommand = createNpmCommand('install');
      const command: vscode.Command = {
        command: 'nodeDependencies.install',
        title: 'Install Dependencies',
        arguments: [workspaceDir, npmCommand]
      };
      return {
        command
      };
    }
  }

  public async reinstall() {
    if (pathExists(this.packageJsonPath)) {
      const workspaceDir: string = path.dirname(this.packageJsonPath);
      const nodeModulesPath = path.join(workspaceDir, 'node_modules');
      if (pathExists(nodeModulesPath)) {
        await rimrafAsync(nodeModulesPath);
      }
      const npmCommand = createNpmCommand('install');
      const command: vscode.Command = {
        command: 'nodeDependencies.reinstall',
        title: 'Reinstall Dependencies',
        arguments: [workspaceDir, npmCommand]
      };
      return {
        command
      };
    }
  }

  public addDependency(depType: NodeDepTypes, packageName: string) {
    const workspaceDir: string = path.dirname(this.packageJsonPath);
    const npmClient = getNpmClient();
    const isYarn = npmClient === 'yarn';
    const isDevDep = depType === 'devDependencies';

    const npmCommandAction = isYarn ? 'add' : 'install';
    const extraAction = isDevDep ? '-D' : isYarn ? '' : '-S';
    const npmCommand = createNpmCommand(npmCommandAction, packageName, extraAction);
    const command: vscode.Command = {
      command: 'nodeDependencies.addDependency',
      title: 'Add Dependency',
      arguments: [workspaceDir, npmCommand]
    };
    return {
      command
    };
  }
}

export class DependencyNode extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly version?: string,
    public readonly command?: vscode.Command,
    public readonly outDated?: boolean
  ) {
    super(label, collapsibleState);
  }

  get description(): string {
    return this.version ? this.version : '';
  }

  iconPath = {
    light: path.join(__filename, '..', '..', '..', 'assets', 'light', this.version ? 'dependency.svg' : 'dependency-entry.svg'),
    dark: path.join(__filename, '..', '..', '..', 'assets', 'dark', this.version ? 'dependency.svg' : 'dependency-entry.svg')
  };

  contextValue = this.version ? this.outDated ? 'outdatedDependency' : 'dependency' : 'dependenciesDir';
}

export async function setNpmClient() {
  const quickPick = vscode.window.createQuickPick();
  const currentNpmClient = vscode.workspace.getConfiguration('iceworks').get('npmClient', npmClients[0]);
  quickPick.items = npmClients.map(label => ({ label, picked: label === currentNpmClient }));
  quickPick.onDidChangeSelection(async selection => {
    if (selection[0]) {
      await vscode.workspace.getConfiguration().update('iceworks.npmClient', selection[0].label, true);
      vscode.window.showInformationMessage(`Setting ${selection[0].label} client successfully!`);
      quickPick.hide();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
};

export async function setNpmRegister() {
  const quickPick = vscode.window.createQuickPick();
  const currentNpmRegister = vscode.workspace.getConfiguration('iceworks').get('npmRegister', npmRegisters[0]);
  const addOtherRegisterLabel = 'Add Other Register...';
  quickPick.items = [...npmRegisters, addOtherRegisterLabel].map(label => ({ label, picked: label === currentNpmRegister }));
  quickPick.onDidChangeSelection(async selection => {
    if (selection[0]) {
      if (selection[0].label === addOtherRegisterLabel) {
        vscode.commands.executeCommand('workbench.action.openSettings', 'iceworks.npmRegister');
      } else {
        await vscode.workspace.getConfiguration().update('iceworks.npmRegister', selection[0].label, true);
        vscode.window.showInformationMessage(`Setting ${selection[0].label} register successfully!`);
      }

      quickPick.hide();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
};
