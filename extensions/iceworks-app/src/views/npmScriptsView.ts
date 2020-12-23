import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { createNpmCommand, checkPathExists, registerCommand } from '@iceworks/common-service';
import { dependencyDir, packageJSONFilename, projectPath } from '@iceworks/project-service';
import runScript from '../terminal/runScript';
import stopScript from '../terminal/stopScript';

export class NpmScriptsProvider implements vscode.TreeDataProvider<ScriptTreeItem> {
  private workspaceRoot: string | undefined;

  private extensionContext: vscode.ExtensionContext;

  private onDidChange: vscode.EventEmitter<ScriptTreeItem | undefined> = new vscode.EventEmitter<
  ScriptTreeItem | undefined
  >();

  readonly onDidChangeTreeData: vscode.Event<ScriptTreeItem | undefined> = this.onDidChange.event;

  constructor(context: vscode.ExtensionContext, workspaceRoot: string | undefined) {
    this.extensionContext = context;
    this.workspaceRoot = workspaceRoot;
  }

  getTreeItem(element: ScriptTreeItem): vscode.TreeItem {
    return element;
  }

  refresh(): void {
    this.onDidChange.fire(undefined);
  }

  async getChildren() {
    if (!this.workspaceRoot) {
      return Promise.resolve([]);
    }
    const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
    if (await checkPathExists(packageJsonPath)) {
      return Promise.resolve(this.getNpmScripts(packageJsonPath));
    } else {
      return Promise.resolve([]);
    }
  }

  private async getNpmScripts(packageJsonPath: string) {
    if (await checkPathExists(packageJsonPath)) {
      const packageJson = JSON.parse(await fse.readFile(packageJsonPath, 'utf-8'));

      const toScript = (scriptName: string, scriptCommand: string, id: string): ScriptTreeItem => {
        const command: vscode.Command = {
          command: 'iceworksApp.npmScripts.run',
          title: 'Run Script',
          arguments: [this.workspaceRoot, createNpmCommand('run', scriptName)],
        };
        return new ScriptTreeItem(this.extensionContext, scriptName, scriptCommand, command, id);
      };

      const scripts = packageJson.scripts
        ? Object.keys(packageJson.scripts).map((script) => toScript(script, packageJson.scripts[script], `npmScripts-${script}`))
        : [];
      return scripts;
    } else {
      return [];
    }
  }
}

export class ScriptTreeItem extends vscode.TreeItem {
  constructor(
    public readonly extensionContext: vscode.ExtensionContext,
    public readonly label: string,
    public readonly tooltip: string,
    public readonly command: vscode.Command,
    public readonly id: string,
  ) {
    super(label);
    this.id = id;
  }

  iconPath = {
    dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/tool.svg')),
    light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/tool.svg')),
  };

  contextValue = 'script';
}

export function createNpmScriptsTreeView(context: vscode.ExtensionContext) {
  const npmScriptsProvider = new NpmScriptsProvider(context, projectPath);
  const treeView = vscode.window.createTreeView('npmScripts', { treeDataProvider: npmScriptsProvider });

  registerCommand('iceworksApp.npmScripts.run', async (script: ScriptTreeItem) => {
    const { command } = script;
    const { title } = command;
    const [cwd, scriptCommand] = command.arguments as any[];
    if (!(await checkPathExists(projectPath, dependencyDir))) {
      runScript(title, cwd, createNpmCommand('install'));
      runScript(title, cwd, scriptCommand);
      return;
    }
    runScript(title, cwd, scriptCommand);
  });
  registerCommand('iceworksApp.npmScripts.stop', (script: ScriptTreeItem) => {
    const { command: { title } } = script;
    stopScript(title);
  });
  registerCommand('iceworksApp.npmScripts.refresh', () => npmScriptsProvider.refresh());

  const pattern = new vscode.RelativePattern(projectPath, packageJSONFilename);
  const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
  fileWatcher.onDidChange(() => npmScriptsProvider.refresh());
  fileWatcher.onDidCreate(() => npmScriptsProvider.refresh());
  fileWatcher.onDidDelete(() => npmScriptsProvider.refresh());

  return treeView;
}
