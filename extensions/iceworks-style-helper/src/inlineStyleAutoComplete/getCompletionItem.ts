import * as vscode from 'vscode';

export default function getCompletionItem(
  text: string,
  description: string,
  documentation = '',
  insertText = '',
  itemKind = 'Property'
): vscode.CompletionItem {
  const completionItem = new vscode.CompletionItem(text, vscode.CompletionItemKind[itemKind]);
  completionItem.detail = 'Iceworks';
  completionItem.insertText = insertText;
  completionItem.command = { command: 'iceworksApp.recorder.recordCompletionItemSelect', title: '' };
  if (documentation) {
    completionItem.documentation = new vscode.MarkdownString(`**${description}** \n ${documentation}`);
  }
  return completionItem;
}
