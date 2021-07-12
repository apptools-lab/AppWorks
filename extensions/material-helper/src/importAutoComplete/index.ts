import * as vscode from 'vscode';
import getAlreadyImportItems from './getAlreadyImportItems';
import getCompletionItemsFromDirectory from './getCompletionItemsFromDirectory';

async function provideCompletionItems(document: vscode.TextDocument): Promise<vscode.CompletionItem[]> {
  const items: vscode.CompletionItem[] = [];
  const alreadyImportItems = getAlreadyImportItems(document);
  items.push(...await getCompletionItemsFromDirectory(document, alreadyImportItems));
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

