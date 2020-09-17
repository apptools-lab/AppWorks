import * as vscode from 'vscode';
import { registerCommand, executeCommand } from '@iceworks/common-service';
import getQuickEntryOptions from '../utils/getQuickEntryOptions';

export class QuickEntriesProvider implements vscode.TreeDataProvider<QuickEntryItem> {
  private extensionContext: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.extensionContext = context;
  }

  getTreeItem(element: QuickEntryItem): vscode.TreeItem {
    return element;
  }

  async getChildren() {
    const quickEntries = await this.getEntries();
    return Promise.resolve(quickEntries);
  }

  private async getEntries() {
    const entryOptions = await getQuickEntryOptions();
    return entryOptions.map((option) => {
      const { label, detail, command } = option;
      const entryCommand: vscode.Command = {
        command,
        title: label,
      };
      return new QuickEntryItem(this.extensionContext, label, detail, entryCommand);
    });
  }
}

class QuickEntryItem extends vscode.TreeItem {
  constructor(
    public readonly extensionContext: vscode.ExtensionContext,
    public readonly label: string,
    public readonly tooltip: string,
    public readonly command: vscode.Command,
  ) {
    super(label);
  }

  iconPath = {
    dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/entry.svg')),
    light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/entry.svg')),
  };

  contextValue = 'quickEntry';
}

export function createQuickEntriesTreeView(context: vscode.ExtensionContext) {
  const quickEntriesProvider = new QuickEntriesProvider(context);
  const treeView = vscode.window.createTreeView('quickEntries', { treeDataProvider: quickEntriesProvider });

  registerCommand('iceworksApp.quickEntries.start', (quickEntry: QuickEntryItem) => {
    executeCommand(quickEntry.command.command);
  });

  return treeView;
}
