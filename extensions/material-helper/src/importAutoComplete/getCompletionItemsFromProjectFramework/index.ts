import * as vscode from 'vscode';
import getCompletionItem from '../getCompletionItem';
import { getProjectFramework } from '@appworks/project-service';

export default async (alreadyImportSet: Set<string>): Promise<vscode.CompletionItem[]> => {
  const items: vscode.CompletionItem[] = [];
  const projectFramework = await getProjectFramework();
  if (projectFramework === 'icejs' && !alreadyImportSet.has('ice')) {
    items.push(getCompletionItem('ice', '{ ${1} }'));
  } else if (['rax-app', 'rax-component'].includes(projectFramework) && !alreadyImportSet.has('rax')) {
    items.push(getCompletionItem('rax', '{ ${1} }'));
  }
  return items;
};
