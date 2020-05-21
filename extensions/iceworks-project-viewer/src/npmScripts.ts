import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class NpmScriptsProvider implements vscode.TreeDataProvider<Script> {
  constructor(private workspaceRoot: string) { }

  getTreeItem(element: Script): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<Script[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No npm scripts found');
      return Promise.resolve([]);
    }
    const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
    if (this.pathExists(packageJsonPath)) {
      return Promise.resolve(this.getNpmScripts(packageJsonPath));
    } else {
      return Promise.resolve([]);
    }
  }

  private getNpmScripts(packageJsonPath: string): Script[] {
    if (this.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      const toScript = (scriptName: string, script: string): Script => {
        return new Script(scriptName, script, {
          command: 'extension.openPackageOnNpm',
          title: '',
          arguments: []
        });
      };

      const scripts = packageJson.scripts
        ? Object.keys(packageJson.scripts).map(script => toScript(script, packageJson.scripts[script]))
        : [];
      return scripts;
    } else {
      return [];
    }
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }
}

export class Script extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public script: string,
    public readonly command?: vscode.Command
  ) {
    super(label);
  }

  get tooltip(): string {
    return `${this.script}`;
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'assets', 'light', 'tool.svg'),
    dark: path.join(__filename, '..', '..', 'assets', 'dark', 'tool.svg')
  };

  contextValue = 'script';
}
