import * as vscode from 'vscode';
import * as path from 'path';
import getItemsFromStoreFile from './getItemsFromStoreFile';
import getItemsFromRoutesFile from './getItemsFromRoutesFile';
import { getProjectFramework } from '@appworks/project-service';

export default async (
  document: vscode.TextDocument,
  alreadyImportSet: Set<string>,
): Promise<vscode.CompletionItem[]> => {
  const items: vscode.CompletionItem[] = [];
  const currentFilename = path.basename(document.fileName);
  const currentFilePath = path.dirname(document.fileName);
  const projectFramework = await getProjectFramework();
  if (['store.js', 'store.ts'].includes(currentFilename) && ['icejs', 'rax-app'].includes(projectFramework)) {
    items.push(...await getItemsFromStoreFile(currentFilePath, alreadyImportSet));
  } else if (['routes.ts', 'routes.js'].includes(currentFilename) && ['icejs'].includes(projectFramework)) {
    items.push(...await getItemsFromRoutesFile(currentFilePath, alreadyImportSet));
  }
  return items;
};
