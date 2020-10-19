import * as vscode from 'vscode';
import i18n from './i18n';

class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  private extensionContext: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.extensionContext = context;
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren() {
    const options = [
      {
        label: i18n.format('extension.timeMaster.entries.test.label'),
        detail: i18n.format('extension.timeMaster.entries.test.detail'),
        command: 'iceworks-project-creator.start',
      },
    ];
    return options.map((option) => {
      const { label, detail, command } = option;
      const entryCommand: vscode.Command = {
        command,
        title: label,
      };
      return new TreeItem(this.extensionContext, label, detail, entryCommand);
    });
  }
}

class TreeItem extends vscode.TreeItem {
  constructor(
    public readonly extensionContext: vscode.ExtensionContext,
    public readonly label: string,
    public readonly tooltip: string,
    public readonly command: vscode.Command,
  ) {
    super(label);
  }
}

export default function createTreeView(context: vscode.ExtensionContext) {
  const treeDataProvider = new TreeDataProvider(context);
  const treeView = vscode.window.createTreeView('timeMaster', { treeDataProvider });
  return treeView;
}
