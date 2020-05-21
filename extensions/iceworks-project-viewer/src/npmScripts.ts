import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { pathExists } from './utils';

export class NpmScriptsProvider implements vscode.TreeDataProvider<Script> {
  private _onDidChangeTreeData: vscode.EventEmitter<Script | undefined> = new vscode.EventEmitter<Script | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Script | undefined> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) { }

  getTreeItem(element: Script): vscode.TreeItem {
    return element;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getChildren(): Thenable<Script[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No npm scripts found');
      return Promise.resolve([]);
    }
    const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
    if (pathExists(packageJsonPath)) {
      return Promise.resolve(this.getNpmScripts(packageJsonPath));
    } else {
      return Promise.resolve([]);
    }
  }

  private getNpmScripts(packageJsonPath: string): Script[] {
    if (pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const workspaceDir: string = path.dirname(packageJsonPath);

      const toScript = (scriptName: string, scriptCommand: string): Script => {
        const cmdObj = {
          command: 'npmScripts.executeCommand',
          title: 'Run Script',
          arguments: [scriptName, workspaceDir]
        };
        return new Script(
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
    public readonly label: string,
    public readonly tooltip: string,
    public readonly command?: vscode.Command
  ) {
    super(label);
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'assets', 'light', 'tool.svg'),
    dark: path.join(__filename, '..', '..', 'assets', 'dark', 'tool.svg')
  };

  contextValue = 'script';
}
