import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { checkPathExists } from '@iceworks/common-service';
import { componentsPath } from '@iceworks/project-service';
import openEntryFile from '../openEntryFile';

class ComponentsProvider implements vscode.TreeDataProvider<ComponentTreeItem> {
  private workspaceRoot: string;

  private extensionContext: vscode.ExtensionContext;

  private onDidChange: vscode.EventEmitter<ComponentTreeItem | undefined> = new vscode.EventEmitter<
    ComponentTreeItem | undefined
  >();

  readonly onDidChangeTreeData: vscode.Event<ComponentTreeItem | undefined> = this.onDidChange.event;

  constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
    this.extensionContext = context;
    this.workspaceRoot = workspaceRoot;
  }

  refresh(): void {
    this.onDidChange.fire(undefined);
  }

  getTreeItem(element: ComponentTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren() {
    if (!this.workspaceRoot) {
      return Promise.resolve([]);
    }
    const componentsPath = path.join(this.workspaceRoot, 'src', 'components');
    try {
      const isComponentPathExists = await checkPathExists(componentsPath);
      if (isComponentPathExists) {
        const components = this.getComponents(componentsPath);
        return Promise.resolve(components);
      } else {
        return Promise.resolve([]);
      }
    } catch (error) {
      return Promise.resolve([]);
    }
  }

  private async getComponents(componentsPath: string) {
    try {
      const isComponentPathExists = await checkPathExists(componentsPath);
      if (isComponentPathExists) {
        const toComponent = (componentName: string) => {
          const componentPath = path.join(componentsPath, componentName);

          const command: vscode.Command = {
            command: 'iceworksApp.components.openFile',
            title: 'Open File',
            arguments: [componentPath],
          };

          return new ComponentTreeItem(this.extensionContext, componentName, command, componentPath);
        };
        const dirNames = await fse.readdir(componentsPath);
        // except file
        const componentNames = dirNames.filter((dirname) => {
          const stat = fse.statSync(path.join(componentsPath, dirname));
          return stat.isDirectory();
        });
        return componentNames.map((componentName) => toComponent(componentName));
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  }
}

class ComponentTreeItem extends vscode.TreeItem {
  constructor(
    public readonly extensionContext: vscode.ExtensionContext,
    public readonly label: string,
    public readonly command: vscode.Command,
    public readonly path: string
  ) {
    super(label);
  }

  iconPath = {
    dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/component.svg')),
    light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/component.svg')),
  };

  contextValue = 'component';
}

export function createComponentsTreeProvider(context: vscode.ExtensionContext, rootPath: string) {
  const componentsProvider = new ComponentsProvider(context, rootPath);
  vscode.window.registerTreeDataProvider('components', componentsProvider);
  vscode.commands.registerCommand('iceworksApp.components.add', () => {
    console.log('iceworksApp: activate iceworks-ui-builder.create-component');
    vscode.commands.executeCommand('iceworks-ui-builder.create-component');
  });
  vscode.commands.registerCommand('iceworksApp.components.refresh', () => componentsProvider.refresh());
  vscode.commands.registerCommand('iceworksApp.components.openFile', (componentPath) => openEntryFile(componentPath));
  vscode.commands.registerCommand('iceworksApp.components.delete', async (component) => {
    await fse.remove(component.path);
  });

  const pattern = new vscode.RelativePattern(componentsPath, '**');
  const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
  fileWatcher.onDidChange(() => componentsProvider.refresh());
  fileWatcher.onDidCreate(() => componentsProvider.refresh());
  fileWatcher.onDidDelete(() => componentsProvider.refresh());
}
