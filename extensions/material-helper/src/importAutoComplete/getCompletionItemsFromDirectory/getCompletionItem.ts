import * as vscode from 'vscode';

export default function getCompletionItem(itemText: string): vscode.CompletionItem {
  const completionItem = new vscode.CompletionItem(`import './${itemText}'`, vscode.CompletionItemKind.Variable);
  completionItem.detail = 'AppWorks';
  completionItem.insertText = new vscode.SnippetString(`import \${1:moduleName} from './${itemText}';`);
  return completionItem;
}
