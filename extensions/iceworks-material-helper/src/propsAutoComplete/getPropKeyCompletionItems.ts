import * as vscode from 'vscode';
import getCompletionItem from './getCompletionItem';
import getPropKeysFromCode from './getPropKeysFromCode';
import getPropKeysFromDefinition from './getPropKeysFromDefinition';


export default function getPropKeys(componentPath, componentName): vscode.CompletionItem[] {
  let propKeys: string[] = [];

  // Use Identifier
  if (/\.(js|jsx)$/.test(componentPath)) {
    propKeys = getPropKeysFromCode(componentPath, componentName);
  }

  // Use .d.ts
  if (componentPath.endsWith('.d.ts')) {
    propKeys = getPropKeysFromDefinition(componentPath);
  }

  return propKeys.map(propKey => getCompletionItem(propKey));
};