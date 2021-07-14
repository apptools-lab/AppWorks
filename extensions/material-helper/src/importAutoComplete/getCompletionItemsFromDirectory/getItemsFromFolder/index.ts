import * as vscode from 'vscode';
import getItemsFromComponentsFolder from './getItemsFromComponentsFolder';
import * as path from 'path';

export default async (
  currentFileName: string,
  currentDirectoryPath: string,
  directoryName: string,
  alreadyImportSet: Set<string>,
): Promise<vscode.CompletionItem[]> => {
  const items: vscode.CompletionItem[] = [];
  switch (directoryName) {
    case 'components': {
      const componentsDirectoryPath = path.join(currentDirectoryPath, directoryName);
      items.push(...await getItemsFromComponentsFolder(componentsDirectoryPath, currentFileName, alreadyImportSet));
      break;
    }
    default:
  }
  return items;
};
