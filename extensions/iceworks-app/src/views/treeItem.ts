
import * as vscode from 'vscode';

export class ItemData {
  label = '';

  id = '';

  description = '';

  tooltip = '';

  command;

  contextValue = '';

  icon = '';

  children: ItemData[] = [];

  initialCollapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None;
}

export class TreeItem extends vscode.TreeItem {
  constructor(
    itemData: ItemData,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly extensionContext: vscode.ExtensionContext,
  ) {
    super(itemData.label, collapsibleState);

    if (itemData.command) {
      this.command = itemData.command;
    }
    if (itemData.description) {
      this.description = itemData.description;
    }
    if (itemData.tooltip) {
      this.tooltip = itemData.tooltip;
    }
    if (itemData.id) {
      this.id = itemData.id;
    }

    const { lightPath, darkPath } = this.getTreeItemIcon(itemData);
    if (lightPath && darkPath) {
      // @ts-ignore
      this.iconPath.light = lightPath;
      // @ts-ignore
      this.iconPath.dark = darkPath;
    } else {
      // @ts-ignore no matching tag, remove the tree item icon path
      delete this.iconPath;
    }

    this.contextValue = this.getTreeItemContextValue(itemData);
  }

  iconPath = {
    light: '',
    dark: '',
  };

  contextValue = 'treeItem';

  private getTreeItemIcon(itemData: ItemData) {
    const iconName = itemData.icon;
    const lightPath =
      iconName ?
        vscode.Uri.file(this.extensionContext.asAbsolutePath(`assets/light/${iconName}`)) :
        null;
    const darkPath =
      iconName ?
        vscode.Uri.file(this.extensionContext.asAbsolutePath(`assets/dark/${iconName}`)) :
        null;
    return { lightPath, darkPath };
  }

  private getTreeItemContextValue(itemData: ItemData): string {
    if (itemData.contextValue) {
      return itemData.contextValue;
    }
    if (itemData.children.length) {
      return 'parent';
    }
    return 'child';
  }
}
