import * as vscode from 'vscode';
import * as path from 'path';
import getCompletionItem from './getCompletionItem';

function checkHasImportItem(alreadyImportItems: string[], targetItem: string): boolean {
  let hasImportItem = false;
  for (let i = 0, len = alreadyImportItems.length; i < len; i++) {
    if (path.join(alreadyImportItems[i]) === targetItem) {
      hasImportItem = true;
      break;
    }
  }
  return hasImportItem;
}

export default async (document: vscode.TextDocument, alreadyImportItems: string[]): Promise<vscode.CompletionItem[]> => {
  const items: vscode.CompletionItem[] = [];
  try {
    const directoryPath = path.dirname(document.fileName);
    const directoryUri = vscode.Uri.parse(directoryPath);
    const directories = await vscode.workspace.fs.readDirectory(directoryUri);
    const currentFileName = path.basename(document.fileName);
    directories.forEach((directory) => {
      if (currentFileName !== directory[0] && !checkHasImportItem(alreadyImportItems, directory[0])) {
        items.push(getCompletionItem(directory[0]));
      }
    });
  } catch (e) {
    // ignore
  }

  return items;
};
