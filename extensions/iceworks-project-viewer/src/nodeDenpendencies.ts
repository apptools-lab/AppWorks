import * as vscode from 'vscode';
import * as util from 'util';
import * as rimraf from 'rimraf';
import * as fs from 'fs';
import * as path from 'path';
// import latestVersion from 'latest-version';
import { pathExists, getNpmClient, getNpmRegister } from './utils';
import { NodeDepTypes, Command } from './types';
import { getNodeDepVersion } from 'ice-npm-utils';
import { nodeDepTypes, npmClients, npmRegisters } from './constants';

const rimrafAsync = util.promisify(rimraf);

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

      function toDep(moduleName: string, version: string) {
        return new Dependency(moduleName, vscode.TreeItemCollapsibleState.None, version, {
          command: 'nodeDependencies.upgrade',
          title: 'Upgrade Dependency',
          arguments: [workspaceDir, `${getNpmClient()} update ${moduleName} --registry=${getNpmRegister()}`]
        });
      };

      return packageJson[label]
        ? Object.keys(packageJson[label]).map((dep) => {
          return toDep(dep, this.getDepVersion(dep) || '');
        })
        : [];
    } else {
      return [];
    }
  }
  // const isOutdated = await this.getNpmOutdated(moduleName, version);

  // private async getNpmOutdated(moduleName: string, version: string) {
  //   const latest = await latestVersion(moduleName);
  //   return version === latest;
  // };

  public install() {
    if (pathExists(this.packageJsonPath)) {
      const workspaceDir: string = path.dirname(this.packageJsonPath);
      const command: Command = {
        command: 'nodeDependencies.install',
        title: 'Install Dependencies',
        arguments: [workspaceDir, `${getNpmClient()} install --registry=${getNpmRegister()}`]
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
      const command: Command = {
        command: 'nodeDependencies.reinstall',
        title: 'Reinstall Dependencies',
        arguments: [workspaceDir, `${getNpmClient()} install --registry=${getNpmRegister()}`]
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
    const command: Command = {
      command: 'nodeDependencies.addDependency',
      title: 'Add Dependency',
      arguments: [workspaceDir, `${npmClient} ${isYarn ? 'add' : 'install'} ${packageName} -${isDevDep ? 'D' : isYarn ? '' : 'S'}`]
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

  // private async getNpmOutdated(moduleName: string, version: string) {
  //   const latest = await latestVersion(moduleName);
  //   return version !== latest;
  // };

  get iconPath() {
    return {
      light: path.join(__filename, '..', '..', 'assets', 'light', this.version ? 'dependency.svg' : 'dependency-entry.svg'),
      dark: path.join(__filename, '..', '..', 'assets', 'dark', this.version ? 'dependency.svg' : 'dependency-entry.svg')
    };
  }

  contextValue = this.version ? 'dependency' : 'dependenciesDir';
}

export async function setNpmClient() {
  const quickPick = vscode.window.createQuickPick();
  const currentNpmClient = vscode.workspace.getConfiguration('iceworks').get('npmClient') || npmClients[0];
  quickPick.items = npmClients.map(label => ({ label, detail: `Use ${label} Client`, picked: label === currentNpmClient }));
  quickPick.onDidChangeSelection(async selection => {
    if (selection[0]) {
      await vscode.workspace.getConfiguration().update('iceworks.npmClient', selection[0].label, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`Setting ${selection[0].label} client successfully!`);
      quickPick.hide();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
};

export async function setNpmRegister() {
  const quickPick = vscode.window.createQuickPick();
  const currentNpmRegister = vscode.workspace.getConfiguration('iceworks').get('npmRegister') || npmRegisters[0];

  quickPick.items = npmRegisters.map(label => ({ label, picked: label === currentNpmRegister }));
  quickPick.onDidChangeSelection(async selection => {
    if (selection[0]) {
      // if not 
      await vscode.workspace.getConfiguration().update('iceworks.npmRegister', selection[0].label, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`Setting ${selection[0].label} register successfully!`);
      quickPick.hide();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
};