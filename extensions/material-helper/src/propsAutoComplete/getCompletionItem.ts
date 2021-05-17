import * as vscode from 'vscode';

export default function getCompletionItem(itemText: string): vscode.CompletionItem {
  const completionItem = new vscode.CompletionItem(itemText, vscode.CompletionItemKind.Variable);
  completionItem.detail = 'AppWorks';
  completionItem.insertText = `${itemText}={}`;
  return completionItem;
}
