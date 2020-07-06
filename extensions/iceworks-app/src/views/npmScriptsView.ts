import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { createNpmCommand, checkPathExists } from '@iceworks/common-service';
import { dependencyDir, packageJSONFilename } from '@iceworks/project-service';
import { executeCommand, stopCommand } from '../utils';
import { ITerminalMap } from '../types';

export class NpmScriptsProvider implements vscode.TreeDataProvider<ScriptNode> {
  private workspaceRoot: string;

  private extensionContext: vscode.ExtensionContext;

  private onDidChange: vscode.EventEmitter<ScriptNode | undefined> = new vscode.EventEmitter<ScriptNode | undefined>();

  readonly onDidChangeTreeData: vscode.Event<ScriptNode | undefined> = this.onDidChange.event;

  constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
    this.extensionContext = context;
    this.workspaceRoot = workspaceRoot;
  }

  getTreeItem(element: ScriptNode): vscode.TreeItem {
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

      const toScript = (scriptName: string, scriptCommand: string, id: string): ScriptNode => {
        const command: vscode.Command = {
          command: 'iceworksApp.npmScripts.run',
          title: 'Run Script',
          arguments: [this.workspaceRoot, createNpmCommand('run', scriptName)]
        };
        return new ScriptNode(
          this.extensionContext,
          scriptName,
          scriptCommand,
          command,
          id,
        );
      };

      const scripts = packageJson.scripts
        ? Object.keys(packageJson.scripts).map((script) => toScript(script, packageJson.scripts[script], `script-${script}`))
        : [];
      return scripts;
    } else {
      return [];
    }
  }
}

export class ScriptNode extends vscode.TreeItem {
  constructor(
    public readonly extensionContext: vscode.ExtensionContext,
    public readonly label: string,
    public readonly tooltip: string,
    public readonly command: vscode.Command,
    public readonly id: string
  ) {
    super(label);
    this.id = id;
  }

  iconPath = {
    dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/tool.svg')),
    light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/tool.svg'))
  };

  contextValue = 'script';
}

export function createNpmScriptsTreeProvider(context: vscode.ExtensionContext, rootPath: string, terminals: ITerminalMap) {
  vscode.window.onDidCloseTerminal(term => terminals.delete(term.name));

  const npmScriptsProvider = new NpmScriptsProvider(context, rootPath);
  vscode.window.registerTreeDataProvider('npmScripts', npmScriptsProvider);
  vscode.commands.registerCommand('iceworksApp.npmScripts.run', async (script: ScriptNode) => {
    if (!await checkPathExists(rootPath, dependencyDir)) {
      script.command.arguments = [rootPath, `${createNpmCommand('install')} && ${script.command.arguments![1]}`]
      executeCommand(terminals, script.command, script.id);
      return;
    }
    executeCommand(terminals, script.command, script.id);
  });
  vscode.commands.registerCommand('iceworksApp.npmScripts.stop', (script: ScriptNode) => stopCommand(terminals, script.id));
  vscode.commands.registerCommand('iceworksApp.npmScripts.refresh', () => npmScriptsProvider.refresh());

  const pattern = path.join(rootPath, packageJSONFilename);
  const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);
  fileWatcher.onDidChange(() => npmScriptsProvider.refresh());
  fileWatcher.onDidCreate(() => npmScriptsProvider.refresh());
  fileWatcher.onDidDelete(() => npmScriptsProvider.refresh());
}