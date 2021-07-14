import * as vscode from 'vscode';
import * as path from 'path';
import getItemsFromFile from './getItemsFromFile';
import getItemsFromFolder from './getItemsFromFolder';

export default async (document: vscode.TextDocument, alreadyImportSet: Set<string>): Promise<vscode.CompletionItem[]> => {
  const items: vscode.CompletionItem[] = [];
  try {
    const directoryPath = path.dirname(document.fileName);
    const directoryUri = vscode.Uri.parse(directoryPath);
    const files = await vscode.workspace.fs.readDirectory(directoryUri);
    const currentFileName = path.basename(document.fileName);
    for (const file of files) {
      const [fileName, fileType] = [file[0], file[1]];
      if (fileType === vscode.FileType.File) {
        items.push(...getItemsFromFile(currentFileName, fileName, alreadyImportSet));
      } else if (fileType === vscode.FileType.Directory) {
        items.push(...await getItemsFromFolder(currentFileName, directoryPath, fileName, alreadyImportSet));
      }
    }
  } catch (e) {
    // ignore
  }
  return items;
};
