import * as vscode from 'vscode';
import getCurrentCallExpress from './getCurrentCallExpress';
import getArgumentsList from './getArgumentsList';
import getDefinitions from './getDefinitions';
function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
  let items: vscode.CompletionItem[] = [];
  const documentText = document.getText();
  const cursorPosition = document.offsetAt(position);
  const currentCallExpression = getCurrentCallExpress(documentText, cursorPosition);
  items.push({ label: 'abc' });
  if (currentCallExpression) {
    const argumentsList = getArgumentsList(currentCallExpression);
    items = items.concat(getDefinitions(argumentsList));
  }
  return items;
}

export default function mtopAutoComplete() {
  vscode.languages.registerCompletionItemProvider(['javascript', 'javascriptreact', 'typescript', 'typescriptreact'], {
    provideCompletionItems,
  });
}
