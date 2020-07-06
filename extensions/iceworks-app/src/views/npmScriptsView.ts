import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { createNpmCommand, checkPathExists } from '@iceworks/common-service';
import { dependencyDir, packageJSONFilename } from '@iceworks/project-service';
import { executeCommand, stopCommand } from '../utils';
import { ITerminalMap } from '../types';

export class NpmScriptsProvider implements vscode.TreeDataProvider<Script> {
  private workspaceRoot: string;

  private extensionContext: vscode.ExtensionContext;

  private onDidChange: vscode.EventEmitter<Script | undefined> = new vscode.EventEmitter<Script | undefined>();

  readonly onDidChangeTreeData: vscode.Event<Script | undefined> = this.onDidChange.event;

  constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
    this.extensionContext = context;
    this.workspaceRoot = workspaceRoot;
  }

  getTreeItem(element: Script): vscode.TreeItem {
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

      const toScript = (scriptName: string, scriptCommand: string): Script => {
        const command: vscode.Command = {
          command: 'iceworksApp.npmScripts.run',
          title: 'Run Script',
          arguments: [this.workspaceRoot, createNpmCommand('run', scriptName)]
        };
        return new Script(
          this.extensionContext,
          scriptName,
          scriptCommand,
          command
        );
      };

      const scripts = packageJson.scripts
        ? Object.keys(packageJson.scripts).map(script => toScript(script, packageJson.scripts[script]))
        : [];
      return scripts;
    } else {
      return [];
    }
  }
}

class Script extends vscode.TreeItem {
  constructor(
    public readonly extensionContext: vscode.ExtensionContext,
    public readonly label: string,
    public readonly tooltip: string,
    public readonly command: vscode.Command
  ) {
    super(label);
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
  vscode.commands.registerCommand('iceworksApp.npmScripts.run', async (script: Script) => {
    if (!await checkPathExists(rootPath, dependencyDir)) {
      const command: vscode.Command = {
        command: 'iceworksApp.npmScripts.run',
        title: 'Run Script',
        arguments: [rootPath, `${createNpmCommand('install')} && ${script.command.arguments![1]}`]
      };
      executeCommand(terminals, command);
      return;
    }
    executeCommand(terminals, script.command)
  });
  vscode.commands.registerCommand('iceworksApp.npmScripts.stop', (script: Script) => stopCommand(terminals, script.command));
  vscode.commands.registerCommand('iceworksApp.npmScripts.refresh', () => npmScriptsProvider.refresh());

  const pattern = path.join(rootPath, packageJSONFilename);
  const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);
  fileWatcher.onDidChange(() => npmScriptsProvider.refresh());
  fileWatcher.onDidCreate(() => npmScriptsProvider.refresh());
  fileWatcher.onDidDelete(() => npmScriptsProvider.refresh());
}