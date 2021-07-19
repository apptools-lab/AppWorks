import * as vscode from 'vscode';
import getCompletionItem from './getCompletionItem';

export default (
  projectFramework: string,
  alreadyImportSet: Set<string>,
): vscode.CompletionItem[] => {
  const items: vscode.CompletionItem[] = [];
  if (projectFramework === 'icejs' && !alreadyImportSet.has('ice')) {
    items.push(getCompletionItem('ice', '{ ${1} }'));
  } else if (['rax-app', 'rax-component'].includes(projectFramework) && !alreadyImportSet.has('rax')) {
    items.push(getCompletionItem('rax', '{ ${1} }'));
  }
  return items;
};
