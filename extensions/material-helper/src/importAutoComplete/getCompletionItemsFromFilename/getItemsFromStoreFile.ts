import * as vscode from 'vscode';
import getFilenameWithoutExtname from '../getFilenameWithoutExtname';
import getCompletionItem from '../getCompletionItem';
import * as path from 'path';

export default async (
  filePath: string,
  alreadyImportSet: Set<string>,
): Promise<vscode.CompletionItem[]> => {
  const items: vscode.CompletionItem[] = [];
  try {
    const modelsDirectoryPath = path.resolve(filePath, 'models');
    const modelsDirectoryUri = vscode.Uri.parse(modelsDirectoryPath);
    // if modelsDirectoryUri is not exist, the error will be thrown and this complete is not work.
    const files = await vscode.workspace.fs.readDirectory(modelsDirectoryUri);
    for (const file of files) {
      const importSourceValue = `./models/${getFilenameWithoutExtname(file[0])}`;
      if (!alreadyImportSet.has(path.join(importSourceValue))) {
        items.push(getCompletionItem(importSourceValue));
      }
    }
  } catch (e) {
    // ignore
  }
  return items;
};
