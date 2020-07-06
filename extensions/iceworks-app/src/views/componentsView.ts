import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { checkPathExists } from '@iceworks/common-service';
import { openEntryFile } from '../utils';

class ComponentsProvider implements vscode.TreeDataProvider<Component> {
  private workspaceRoot: string;

  private extensionContext: vscode.ExtensionContext;

  private onDidChange: vscode.EventEmitter<Component | undefined> = new vscode.EventEmitter<Component | undefined>();

  readonly onDidChangeTreeData: vscode.Event<Component | undefined> = this.onDidChange.event;

  constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
    this.extensionContext = context;
    this.workspaceRoot = workspaceRoot;
  }

  refresh(): void {
    this.onDidChange.fire(undefined);
  }

  getTreeItem(element: Component): vscode.TreeItem {
    return element;
  }

  async getChildren() {
    if (!this.workspaceRoot) {
      return Promise.resolve([]);
    }
    const componentsPath = path.join(this.workspaceRoot, 'src', 'components');
    if (await checkPathExists(componentsPath)) {
      const components = this.getComponents(componentsPath);
      return Promise.resolve(components);
    } else {
      return Promise.resolve([]);
    }
  }

  private async getComponents(componentsPath: string) {
    if (await checkPathExists(componentsPath)) {
      const toComponent = (componentName: string) => {
        const pageEntryPath = path.join(componentsPath, componentName);

        const cmdObj: vscode.Command = {
          command: 'iceworksApp.components.openFile',
          title: 'Open File',
          arguments: [pageEntryPath]
        };

        return new Component(this.extensionContext, componentName, cmdObj);
      };
      const dirNames = await fse.readdir(componentsPath);
      // except file
      const componentNames = dirNames.filter(dirname => {
        const stat = fse.statSync(path.join(componentsPath, dirname));
        return stat.isDirectory();
      });
      return componentNames.map(componentName => toComponent(componentName));
    } else {
      return [];
    }
  }
}

class Component extends vscode.TreeItem {
  constructor(
    public readonly extensionContext: vscode.ExtensionContext,
    public readonly label: string,
    public readonly command?: vscode.Command
  ) {
    super(label);
  }

  iconPath = {
    dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/component.svg')),
    light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/component.svg'))
  };

  contextValue = 'component';
}

export function createComponentsTreeProvider(context: vscode.ExtensionContext, rootPath: string) {
  const componentsProvider = new ComponentsProvider(context, rootPath);
  vscode.window.registerTreeDataProvider('components', componentsProvider);
  vscode.commands.registerCommand('iceworksApp.components.add', () => {
    console.log('iceworksApp: activate iceworks-component-builder.generate');
    vscode.commands.executeCommand('iceworks-component-builder.generate');
  });
  vscode.commands.registerCommand('iceworksApp.components.refresh', () => componentsProvider.refresh());
  vscode.commands.registerCommand('iceworksApp.components.openFile', (p) => openEntryFile(p));
}