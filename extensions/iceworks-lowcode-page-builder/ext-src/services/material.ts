import * as vscode from 'vscode';
export * from '@iceworks/material/lib/node';

export const getSources = function (type: string) {
  const sources = vscode.workspace.getConfiguration('iceworks').get('materialSources');

  // @ts-ignore
  return type ? sources.filter(({ type: originType }) => originType === type) : sources;
}
