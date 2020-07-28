import * as vscode from 'vscode';
import getCompletionItem from './getCompletionItem';
import getPropKeysFromCode from './getPropKeysFromCode';
import getPropKeysFromDefinition from './getPropKeysFromDefinition';

export default function getPropKeys(componentPath, componentName): vscode.CompletionItem[] {
  let propKeys: string[] = [];

  if (/\.(js|jsx)$/.test(componentPath)) {
    // Use Identifier
    propKeys = getPropKeysFromCode(componentPath, componentName);
  } else if (componentPath.endsWith('.d.ts')) {
    // Use .d.ts
    propKeys = getPropKeysFromDefinition(componentPath);
  }

  return propKeys.map((propKey) => getCompletionItem(propKey));
}
