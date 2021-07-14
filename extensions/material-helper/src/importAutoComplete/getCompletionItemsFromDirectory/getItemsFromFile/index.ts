import * as vscode from 'vscode';
import getCompletionItem from '../../getCompletionItem';
import getFilenameWithoutExtname from '../../getFilenameWithoutExtname';

export default (
  currentFileName: string,
  fileName: string,
  alreadyImportSet: Set<string>,
): vscode.CompletionItem[] => {
  const items: vscode.CompletionItem[] = [];
  if (currentFileName !== fileName && !alreadyImportSet.has(fileName) && getFilenameWithoutExtname(fileName) !== 'index') {
    items.push(getCompletionItem(getFilenameWithoutExtname(fileName)));
  }
  return items;
};
