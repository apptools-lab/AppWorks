import * as vscode from 'vscode';

export default function getCompletionItem(
  text: string,
  detail: string,
  documentation = '',
  insertText = '',
  itemKind = 'Property'
): vscode.CompletionItem {
  const completionItem = new vscode.CompletionItem(text, vscode.CompletionItemKind[itemKind]);
  completionItem.detail = detail;
  completionItem.insertText = insertText;
  if (documentation) {
    completionItem.documentation = documentation;
  }
  return completionItem;
};
