import { CompletionItem, CompletionItemKind, MarkdownString, SnippetString, TextEdit } from 'vscode';

export default function getCompletionItem(
  showText: string,
  itemKind: string,
  insertText?: string | SnippetString,
  documentation?: string | MarkdownString,
  additionalTextEdits?: TextEdit[],
): CompletionItem {
  const completionItem = new CompletionItem(showText, CompletionItemKind[itemKind]);
  if (insertText) {
    completionItem.insertText = insertText;
  }
  if (documentation) {
    completionItem.documentation = documentation;
  }
  if (additionalTextEdits) {
    completionItem.additionalTextEdits = additionalTextEdits;
  }
  completionItem.detail = 'AppWorks';
  completionItem.command = { command: 'style-helper.recordCompletionItemSelect', title: '' };
  return completionItem;
}
