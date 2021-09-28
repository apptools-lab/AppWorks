import * as vscode from 'vscode';
import { registerCommand, executeCommand } from '@appworks/common-service';
import { recordDAU } from '@appworks/recorder';
import options from '../quickPicks/options';
import getOptions from '../utils/getOptions';
import { showExtensionsQuickPickCommandId } from '../constants';
import i18n from '../i18n';
import autoStart from '../utils/autoStart';

const entryOptions = options.filter(({ command }) => {
  return [
    'project-creator.create-project.start',
    'applicationManager.dashboard.start',
    'doctor.dashboard',
    'applicationManager.configHelper.start',
  ].includes(command);
}).concat([
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.more.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.more.detail'),
    command: showExtensionsQuickPickCommandId,
  },
]);

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
    return (await getOptions(entryOptions)).map((option) => {
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
  let didSetViewContext = false;
  treeView.onDidChangeVisibility(({ visible }) => {
    if (visible && !didSetViewContext) {
      didSetViewContext = true;
      recordDAU();
      autoStart(context);
    }
  });

  registerCommand('applicationManager.quickEntries.start', (quickEntry: QuickEntryItem) => {
    executeCommand(quickEntry.command.command);
  });

  return treeView;
}
