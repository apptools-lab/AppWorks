import * as vscode from 'vscode';
import getAlreadyImportSet from './getAlreadyImportSet';
import getCompletionItemsFromDirectory from './getCompletionItemsFromDirectory';
import getCompletionItemsFromProjectType from './getCompletionItemsFromProjectType';
import getCompletionItemsFromFilename from './getCompletionItemsFromFilename';

async function provideCompletionItems(document: vscode.TextDocument): Promise<vscode.CompletionItem[]> {
  const items: vscode.CompletionItem[] = [];
  const alreadyImportSet = getAlreadyImportSet(document);
  items.push(...await getCompletionItemsFromDirectory(document, alreadyImportSet));
  items.push(...await getCompletionItemsFromProjectType(alreadyImportSet));
  items.push(...await getCompletionItemsFromFilename(document, alreadyImportSet));
  return items;
}

export default () => {
  vscode.languages.registerCompletionItemProvider(
    ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'],
    {
      provideCompletionItems,
    },
    'import',
  );
};

