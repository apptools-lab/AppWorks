import * as vscode from 'vscode';
import * as path from 'path';
import getItemsFromStoreFile from './getItemsFromStoreFile';
import getItemsFromRoutesFile from './getItemsFromRoutesFile';

export default async (
  document: vscode.TextDocument,
  alreadyImportSet: Set<string>,
): Promise<vscode.CompletionItem[]> => {
  const items: vscode.CompletionItem[] = [];
  const currentFilename = path.basename(document.fileName);
  const currentFilePath = path.dirname(document.fileName);
  if (['store.js', 'store.ts'].includes(currentFilename)) {
    items.push(...await getItemsFromStoreFile(currentFilePath, alreadyImportSet));
  } else if (['routes.ts', 'routes.js'].includes(currentFilename)) {
    items.push(...await getItemsFromRoutesFile(currentFilePath, alreadyImportSet));
  }
  return items;
};
