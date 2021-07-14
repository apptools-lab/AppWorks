import * as vscode from 'vscode';
import * as path from 'path';
import getCompletionItem from '../../getCompletionItem';
import getFilenameWithoutExtname from '../../getFilenameWithoutExtname';

function checkIsProvideItems(currentFileName: string, alreadyImportSet: Set<string>): boolean {
  return (
    ['.jsx', '.tsx'].includes(path.extname(currentFileName)) ||
    alreadyImportSet.has('react')
  );
}

export default async (
  componentsDirectoryPath: string,
  currentFileName: string,
  alreadyImportSet: Set<string>,
): Promise<vscode.CompletionItem[]> => {
  const items: vscode.CompletionItem[] = [];
  try {
    if (checkIsProvideItems(currentFileName, alreadyImportSet)) {
      const componentsDirectoryUri = vscode.Uri.parse(componentsDirectoryPath);
      const files = await vscode.workspace.fs.readDirectory(componentsDirectoryUri);
      files.forEach((file) => {
        if (!alreadyImportSet.has(file[0])) {
          items.push(getCompletionItem(`./components/${getFilenameWithoutExtname(file[0])}`));
        }
      });
    }
  } catch (err) {
    // ignore;
  }
  return items;
};
