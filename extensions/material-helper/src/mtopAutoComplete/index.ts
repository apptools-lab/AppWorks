import * as vscode from 'vscode';
import getCurrentMtopRequestCall from './getCurrentMtopRequestCall';
import getArgumentsList from './getArgumentsList';
import getDefinitions from './getDefinitions';

function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
  let items: vscode.CompletionItem[] = [];
  const documentText = document.getText();
  const cursorPosition = document.offsetAt(position);
  const currentMtopRequestCall = getCurrentMtopRequestCall(documentText, cursorPosition);
  if (currentMtopRequestCall) {
    const mtopRequestExistArguments = getArgumentsList(currentMtopRequestCall);
    items = items.concat(getDefinitions(mtopRequestExistArguments));
  }
  return items;
}

export default function mtopAutoComplete() {
  vscode.languages.registerCompletionItemProvider(['javascript', 'javascriptreact', 'typescript', 'typescriptreact'], {
    provideCompletionItems,
  });
}
