import * as vscode from 'vscode';
import * as rimraf from 'rimraf';
import * as fse from 'fs-extra';
import * as util from 'util';
import * as path from 'path';
import {
  createNpmCommand,
  checkPathExists,
  registerCommand,
  isYarnPackageManager,
  getAddDependencyAction,
  getUpdateDependencyAction,
} from '@iceworks/common-service';
import { dependencyDir, projectPath, getLocalDependencyInfo } from '@iceworks/project-service';
import runScript from '../terminal/runScript';
import { NodeDepTypes } from '../types';
import { nodeDepTypes } from '../constants';
import showDepsInputBox from '../inputBoxs/showDepsInputBox';
import showDepsQuickPick from '../quickPicks/showDepsQuickPick';

const rimrafAsync = util.promisify(rimraf);

class DependencyTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly extensionContext: vscode.ExtensionContext,
    public readonly id: string,
    public readonly contextValue: string,
    icon: string,
    public readonly description?: string,
    public readonly command?: vscode.Command,
  ) {
    super(label, collapsibleState);

    // @ts-ignore
    this.iconPath.light = vscode.Uri.file(this.extensionContext.asAbsolutePath(`assets/light/${icon}`));
    // @ts-ignore
    this.iconPath.dark = vscode.Uri.file(this.extensionContext.asAbsolutePath(`assets/dark/${icon}`));
  }

  iconPath = {
    light: '',
    dark: '',
  };
}

class DepNodeProvider implements vscode.TreeDataProvider<DependencyTreeItem> {
  private workspaceRoot: string;

  private extensionContext: vscode.ExtensionContext;

  private onDidChange: vscode.EventEmitter<DependencyTreeItem | undefined> = new vscode.EventEmitter<
  DependencyTreeItem | undefined
  >();

  readonly onDidChangeTreeData: vscode.Event<DependencyTreeItem | undefined> = this.onDidChange.event;

  public packageJsonPath: string;

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
    if (this.workspaceRoot) {
      if (element) {
        const { label } = element;
        const deps = this.getDepsInPackageJson(this.packageJsonPath, label as NodeDepTypes);
        return deps;
      } else {
        return nodeDepTypes.map(
          (nodeDepType) => new DependencyTreeItem(
            nodeDepType,
            vscode.TreeItemCollapsibleState.Collapsed,
            this.extensionContext,
            `parent-${nodeDepType}`,
            nodeDepType,
            'dependency-entry.svg',
          ),
        );
      }
    }
  }

  private async getDepsInPackageJson(packageJsonPath: string, depType: NodeDepTypes) {
    if (await checkPathExists(packageJsonPath)) {
      const packageJson = JSON.parse(await fse.readFile(packageJsonPath, 'utf-8'));
      const workspaceDir: string = path.dirname(packageJsonPath);

      const packageDeps = packageJson[depType];
      let deps: DependencyTreeItem[] = [];
      if (packageDeps) {
        deps = await Promise.all(
          Object.keys(packageDeps).map(async (dep) => {
            const { outdated, version } = await getLocalDependencyInfo(dep, packageDeps[dep]);
            return toDep(depType, this.extensionContext, workspaceDir, dep, version, outdated);
          }),
        );
      }

      return deps;
    }
  }

  public getAddDependencyScript(depType: NodeDepTypes, packageName: string) {
    const workspaceDir: string = path.dirname(this.packageJsonPath);
    const isYarn = isYarnPackageManager();
    const isDevDep = depType === 'devDependencies';
    const npmCommandAction = getAddDependencyAction(); // `add` or `install`

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

export function createNodeDependenciesTreeView(context) {
  const nodeDependenciesProvider = new DepNodeProvider(context, projectPath);
  const treeView = vscode.window.createTreeView('nodeDependencies', { treeDataProvider: nodeDependenciesProvider });

  registerCommand('iceworksApp.nodeDependencies.refresh', () => nodeDependenciesProvider.refresh());

  // TODO
  registerCommand('iceworksApp.nodeDependencies.upgrade', (node: DependencyTreeItem) => {
    const { command } = node;
    if (command) {
      const [cwd, moduleName] = command?.arguments as any[];
      const updateDependencyAction = getUpdateDependencyAction(); // `upgrade` or `update`
      const commandScript = createNpmCommand(updateDependencyAction, moduleName);
      runScript(command.title || upgradeDependencyCommandTitle, cwd || projectPath, commandScript);
    }
  });
  registerCommand('iceworksApp.nodeDependencies.reinstall', async () => {
    if (await checkPathExists(nodeDependenciesProvider.packageJsonPath)) {
      const workspaceDir: string = path.dirname(nodeDependenciesProvider.packageJsonPath);
      const nodeModulesPath = path.join(workspaceDir, 'node_modules');
      if (await checkPathExists(nodeModulesPath)) {
        await rimrafAsync(nodeModulesPath);
      }
      const command = createNpmCommand('install');
      const title = 'Reinstall Dependencies';
      const cwd = workspaceDir;
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
  depType: NodeDepTypes,
  extensionContext: vscode.ExtensionContext,
  workspaceDir: string,
  moduleName: string,
  version: string,
  outdated: string,
) {
  const command = outdated
    ? {
      command: 'iceworksApp.nodeDependencies.upgrade',
      title: upgradeDependencyCommandTitle,
      arguments: [workspaceDir, moduleName],
    }
    : undefined;
  return new DependencyTreeItem(
    moduleName,
    vscode.TreeItemCollapsibleState.None,
    extensionContext,
    `child-${depType}-${moduleName}`,
    outdated ? 'outdatedDependency' : '',
    'dependency.svg',
    version,
    command,
  );
}
