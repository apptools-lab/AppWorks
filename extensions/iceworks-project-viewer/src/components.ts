import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ComponentsProvider implements vscode.TreeDataProvider<Component> {
  constructor(private workspaceRoot: string) { }

  getTreeItem(element: Component): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Component): Thenable<Component[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No component found');
      return Promise.resolve([]);
    }
    const componentsPath = path.join(this.workspaceRoot, 'src', 'components');
    if (this.pathExists(componentsPath)) {
      return Promise.resolve(this.getComponents(componentsPath));
    } else {
      return Promise.resolve([]);
    }
  }

  private getComponents(componentsPath: string): Component[] {
    if (this.pathExists(componentsPath)) {

      const toComponent = (componentName: string) => {
        return new Component(componentName);
      };

      const componentsName = fs.readdirSync(componentsPath);
      return componentsName.map(componentName => toComponent(componentName));
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

class Component extends vscode.TreeItem {
  constructor(
    public readonly label: string
  ) {
    super(label);
  }
}
