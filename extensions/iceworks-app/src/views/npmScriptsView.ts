import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { createNpmCommand } from '@iceworks/common-service'
import { pathExists } from '../utils';

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
    if (pathExists(packageJsonPath)) {
      return Promise.resolve(this.getNpmScripts(packageJsonPath));
    } else {
      return Promise.resolve([]);
    }
  }

  private async getNpmScripts(packageJsonPath: string) {
    if (pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(await fse.readFile(packageJsonPath, 'utf-8'));
      const workspaceDir: string = path.dirname(packageJsonPath);

      const toScript = (scriptName: string, scriptCommand: string): Script => {
        const cmdObj: vscode.Command = {
          command: 'iceworksApp.npmScripts.executeCommand',
          title: 'Run Script',
          arguments: [workspaceDir, createNpmCommand('run', scriptName)]
        };
        return new Script(
          this.extensionContext,
          scriptName,
          scriptCommand,
          cmdObj
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

export class Script extends vscode.TreeItem {
  constructor(
    public readonly extensionContext: vscode.ExtensionContext,
    public readonly label: string,
    public readonly tooltip: string,
    public readonly command?: vscode.Command
  ) {
    super(label);
  }

  iconPath = {
    dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/tool.svg')),
    light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/tool.svg'))
  };

  contextValue = 'script';
}
