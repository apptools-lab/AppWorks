import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import { checkPathExists, registerCommand } from '@iceworks/common-service';
import { pagesPath as projectPagesPath, projectPath } from '@iceworks/project-service';
import openEntryFile from '../utils/openEntryFile';
import i18n from '../i18n';

const addPageQuickPickItems: any[] = [
  {
    label: i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.createPage.label'),
    detail: i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.createPage.detail'),
    command: 'iceworks-material-helper.page-creator.start',
  },
  {
    label: i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.generatePage.label'),
    detail: i18n.format('extension.iceworksMaterialHelper.showEntriesQuickPick.generatePage.detail'),
    command: 'iceworks-material-helper.page-generator.start',
  },
];
function showAddPageQuickPicks() {
  const quickPick = vscode.window.createQuickPick();
  quickPick.items = addPageQuickPickItems;
  quickPick.onDidChangeSelection((change) => {
    // @ts-ignore
    vscode.commands.executeCommand(change[0].command);
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}

class PagesProvider implements vscode.TreeDataProvider<PageTreeItem> {
  private workspaceRoot: string;

  private extensionContext: vscode.ExtensionContext;

  private onDidChange: vscode.EventEmitter<PageTreeItem | undefined> = new vscode.EventEmitter<
  PageTreeItem | undefined
  >();

  readonly onDidChangeTreeData: vscode.Event<PageTreeItem | undefined> = this.onDidChange.event;

  constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
    this.extensionContext = context;
    this.workspaceRoot = workspaceRoot;
  }

  getTreeItem(element: PageTreeItem): vscode.TreeItem {
    return element;
  }

  refresh(): void {
    this.onDidChange.fire(undefined);
  }

  async getChildren() {
    if (!this.workspaceRoot) {
      return Promise.resolve([]);
    }
    const pagesPath = path.join(this.workspaceRoot, 'src', 'pages');
    if (await checkPathExists(pagesPath)) {
      const pages = this.getPages(pagesPath);
      return Promise.resolve(pages);
    } else {
      return Promise.resolve([]);
    }
  }

  private async getPages(pagesPath: string) {
    if (await checkPathExists(pagesPath)) {
      const toPage = (pageName: string) => {
        const pagePath = path.join(pagesPath, pageName);

        const command: vscode.Command = {
          command: 'iceworks-material-helper.pages.openFile',
          title: 'Open File',
          arguments: [pagePath],
        };
        return new PageTreeItem(this.extensionContext, pageName, command, pagePath);
      };
      const dirNames = await fse.readdir(pagesPath);
      // except the file
      const pageNames = dirNames.filter((dirname) => {
        const stat = fse.statSync(path.join(pagesPath, dirname));
        return stat.isDirectory();
      });
      return pageNames.map((pageName) => toPage(pageName));
    } else {
      return [];
    }
  }
}

class PageTreeItem extends vscode.TreeItem {
  constructor(
    public readonly extensionContext: vscode.ExtensionContext,
    public readonly label: string,
    public readonly command: vscode.Command,
    // eslint-disable-next-line no-shadow
    public readonly path: string,
  ) {
    super(label);
  }

  iconPath = {
    dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/page.svg')),
    light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/page.svg')),
  };

  contextValue = 'page';
}

export function createPagesTreeView(context: vscode.ExtensionContext) {
  const pagesProvider = new PagesProvider(context, projectPath);
  const treeView = vscode.window.createTreeView('pages', { treeDataProvider: pagesProvider });

  registerCommand('iceworks-material-helper.pages.add', () => {
    showAddPageQuickPicks();
  });
  registerCommand('iceworks-material-helper.pages.refresh', () => pagesProvider.refresh());
  registerCommand('iceworks-material-helper.pages.openFile', (pagePath) => openEntryFile(pagePath));
  registerCommand('iceworks-material-helper.pages.delete', async (page) => await fse.remove(page.path));

  const pattern = new vscode.RelativePattern(projectPagesPath, '**');
  const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
  fileWatcher.onDidChange(() => pagesProvider.refresh());
  fileWatcher.onDidCreate(() => pagesProvider.refresh());
  fileWatcher.onDidDelete(() => pagesProvider.refresh());

  return treeView;
}
