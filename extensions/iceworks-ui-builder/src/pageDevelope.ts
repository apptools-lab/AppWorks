import { vscode } from '@iceworks/vscode-webview';
import { QuickPick, QuickPickItem, window, workspace } from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import * as util from 'util';

const defaultQuickPicks: QuickPickItem[] = [
  {
    label: 'No page Found',
    detail: 'Please Create Page Thorough Iceworks-CLI',
  },
];
export async function showPageDevelopQuickPicks() {
  try {
    let pageQuickItems = await getPageQuickPickItems();
    if (pageQuickItems.length === 0) {
      pageQuickItems = defaultQuickPicks;
    }
    const quickPicks = window.createQuickPick();
    quickPicks.items = pageQuickItems;
    quickPicks.onDidChangeSelection(async (selection) => {
      try {
        const schemaPath = path.join(selection[0].detail!, 'config', 'settings.json');
        const schema = await fse.readJSON(schemaPath);
        console.log('schema', schema);
      } catch (err) {
        window.showErrorMessage(`无法调试此页面 ${err.message}`);
      }
    });
    quickPicks.onDidHide(() => quickPicks.dispose());
    quickPicks.show();
  } catch (err) {
    window.showErrorMessage(err.message);
  }
}

async function getPageQuickPickItems() {
  const rootDir = workspace.workspaceFolders?.[0].uri.fsPath;
  const pageFolderDir = rootDir && path.join(rootDir, 'pages');
  const isPageFolderExists = pageFolderDir && (await fse.pathExists(pageFolderDir));

  if (isPageFolderExists) {
    const asyncGlob = util.promisify(glob);
    const pagePkgPaths = await asyncGlob('**/package.json', {
      cwd: pageFolderDir,
      ignore: ['**/node_modules/**'],
      nodir: true,
    });
    return pagePkgPaths.reduce((quickPickItems, pkgPath) => {
      const absolutePkgPath = path.join(pageFolderDir!, pkgPath);
      const content = fse.readJSONSync(absolutePkgPath);
      if (content && content.pageConfig) {
        quickPickItems.push({
          label: content.name || 'No name Of This Page',
          description: content.description || 'No Description Of This Page',
          detail: path.join(absolutePkgPath, '../'),
        });
      }
      return quickPickItems;
    }, [] as QuickPickItem[]);
  } else {
    throw new Error('所在的工作区不是 ice 物料工作区或不存在页面物料开发文件夹！');
  }
}
