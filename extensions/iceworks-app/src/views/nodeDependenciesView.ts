import * as vscode from 'vscode';
import * as rimraf from 'rimraf';
import * as fse from 'fs-extra';
import * as util from 'util';
import * as path from 'path';
import { getDataFromSettingJson, createNpmCommand, checkPathExists, registerCommand } from '@iceworks/common-service';
import { dependencyDir, projectPath, getLocalDependencyInfo } from '@iceworks/project-service';
import runScript from '../terminal/runScript';
import { NodeDepTypes } from '../types';
import { nodeDepTypes } from '../constants';
import showDepsInputBox from '../inputBoxs/showDepsInputBox';
import showDepsQuickPick from '../quickPicks/showDepsQuickPick';

const rimrafAsync = util.promisify(rimraf);

class DepNodeProvider implements vscode.TreeDataProvider<DependencyTreeItem> {
  private workspaceRoot: string;

  private extensionContext: vscode.ExtensionContext;

  private onDidChange: vscode.EventEmitter<DependencyTreeItem | undefined> = new vscode.EventEmitter<
  DependencyTreeItem | undefined
  >();

  readonly onDidChangeTreeData: vscode.Event<DependencyTreeItem | undefined> = this.onDidChange.event;

  packageJsonPath: string;

  constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
    this.extensionContext = context;
    this.workspaceRoot = workspaceRoot;
    this.packageJsonPath = path.join(this.workspaceRoot, 'package.json');
  }

  refresh(): void {
    this.onDidChange.fire(undefined);
  }

  getTreeItem(element: DependencyTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: DependencyTreeItem) {
    if (!this.workspaceRoot) {
      return Promise.resolve([]);
    }

    if (element) {
      const { label } = element;
      const deps = this.getDepsInPackageJson(this.packageJsonPath, label as NodeDepTypes);
      return deps;
    } else {
      return Promise.resolve(
        nodeDepTypes.map(
          (nodeDepType) => new DependencyTreeItem(
            this.extensionContext,
            nodeDepType,
            vscode.TreeItemCollapsibleState.Collapsed,
            nodeDepType,
          ),
        ),
      );
    }
  }

  private async getDepsInPackageJson(packageJsonPath: string, label: NodeDepTypes) {
    if (await checkPathExists(packageJsonPath)) {
      const packageJson = JSON.parse(await fse.readFile(packageJsonPath, 'utf-8'));
      const workspaceDir: string = path.dirname(packageJsonPath);

      let deps: DependencyTreeItem[] = [];
      if (packageJson[label]) {
        deps = await Promise.all(
          Object.keys(packageJson[label]).map(async (dep) => {
            const { outdated, version } = await getLocalDependencyInfo(dep);
            return toDep(this.extensionContext, workspaceDir, dep, version, outdated);
          }),
        );
      }

      return deps;
    } else {
      return [];
    }
  }

  public async packageJsonExists() {
    return await checkPathExists(this.packageJsonPath);
  }

  public async getReinstallScript() {
    const workspaceDir: string = path.dirname(this.packageJsonPath);
    const nodeModulesPath = path.join(workspaceDir, 'node_modules');
    if (await checkPathExists(nodeModulesPath)) {
      await rimrafAsync(nodeModulesPath);
    }
    const command = createNpmCommand('install');
    return {
      title: 'Reinstall Dependencies',
      cwd: workspaceDir,
      command,
    };
  }

  public getAddDependencyScript(depType: NodeDepTypes, packageName: string) {
    const workspaceDir: string = path.dirname(this.packageJsonPath);
    const packageManager = getDataFromSettingJson('packageManager');
    const isYarn = packageManager === 'yarn';
    const isDevDep = depType === 'devDependencies';
    const npmCommandAction = isYarn ? 'add' : 'install';

    let extraAction = '';
    if (isDevDep) {
      extraAction = '-D';
    } else if (isYarn) {
      extraAction = '-S';
    }
    const command = createNpmCommand(npmCommandAction, packageName, extraAction);
    return {
      title: 'Add Dependency',
      cwd: workspaceDir,
      command,
    };
  }
}

class DependencyTreeItem extends vscode.TreeItem {
  constructor(
    public readonly extensionContext: vscode.ExtensionContext,
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly id: string,
    public readonly command?: vscode.Command,
    public readonly version?: string,
    public readonly outDated?: boolean,
  ) {
    super(label, collapsibleState);
    this.id = id;
  }

  get description(): string {
    return this.version ? this.version : '';
  }

  get contextValue(): string {
    if (this.version) {
      return this.outDated ? 'outdatedDependency' : 'dependency';
    } else {
      return this.label;
    }
  }

  iconPath = {
    dark: vscode.Uri.file(
      this.extensionContext.asAbsolutePath(`assets/dark/${this.version ? 'dependency' : 'dependency-entry'}.svg`),
    ),
    light: vscode.Uri.file(
      this.extensionContext.asAbsolutePath(`assets/light/${this.version ? 'dependency' : 'dependency-entry'}.svg`),
    ),
  };
}

export function createNodeDependenciesTreeView(context) {
  const nodeDependenciesProvider = new DepNodeProvider(context, projectPath);
  const treeView = vscode.window.createTreeView('nodeDependencies', { treeDataProvider: nodeDependenciesProvider });

  registerCommand('iceworksApp.nodeDependencies.refresh', () => nodeDependenciesProvider.refresh());

  // TODO
  registerCommand('iceworksApp.nodeDependencies.upgrade', (node: DependencyTreeItem) => {
    const { command } = node;
    if (command) {
      const [cwd, moduleName] = command?.arguments as any[];
      const packageManager = getDataFromSettingJson('packageManager');
      const commandScript = createNpmCommand(packageManager === 'yarn' ? 'upgrade' : 'update', moduleName);
      runScript(command.title || upgradeDependencyCommandTitle, cwd || projectPath, commandScript);
    }
  });
  registerCommand('iceworksApp.nodeDependencies.reinstall', async () => {
    if (await nodeDependenciesProvider.packageJsonExists()) {
      const { title, cwd, command } = await nodeDependenciesProvider.getReinstallScript();

      runScript(title, cwd, command);
    }
  });
  registerCommand('iceworksApp.nodeDependencies.dependencies.add', () => showDepsInputBox(nodeDependenciesProvider, 'dependencies'));
  registerCommand('iceworksApp.nodeDependencies.devDependencies.add', () => showDepsInputBox(nodeDependenciesProvider, 'devDependencies'));
  registerCommand('iceworksApp.nodeDependencies.addDepsAndDevDeps', () => showDepsQuickPick(nodeDependenciesProvider));

  const pattern = new vscode.RelativePattern(path.join(projectPath, dependencyDir), '**');
  const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
  fileWatcher.onDidChange(() => nodeDependenciesProvider.refresh());
  fileWatcher.onDidCreate(() => nodeDependenciesProvider.refresh());
  fileWatcher.onDidDelete(() => nodeDependenciesProvider.refresh());

  return treeView;
}

const upgradeDependencyCommandTitle = 'Upgrade Dependency';
function toDep(
  extensionContext: vscode.ExtensionContext,
  workspaceDir: string,
  moduleName: string,
  version: string,
  outdated: boolean,
) {
  const command = outdated
    ? {
      command: 'iceworksApp.nodeDependencies.upgrade',
      title: upgradeDependencyCommandTitle,
      arguments: [workspaceDir, moduleName],
    }
    : undefined;
  return new DependencyTreeItem(
    extensionContext,
    moduleName,
    vscode.TreeItemCollapsibleState.None,
    `nodeDependencies-${moduleName}`,
    command,
    version,
    outdated,
  );
}
