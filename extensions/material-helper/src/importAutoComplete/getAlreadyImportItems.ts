import * as vscode from 'vscode';
import getBabelParserPlugins from '../utils/getBabelParserPlugins';
import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { ImportDeclaration } from '@babel/types';

export default (doc: vscode.TextDocument): string[] => {
  const importItems: string[] = [];
  const documentText = doc.getText();
  try {
    const ast = parse(documentText, {
      sourceType: 'module',
      plugins: getBabelParserPlugins('jsx'),
    });
    traverse(ast, {
      ImportDeclaration(path: NodePath<ImportDeclaration>) {
        const { node } = path;
        const moduleName = node.source.value;
        importItems.push(moduleName);
      },
    });
  } catch (e) {
    // ignore
  }

  return importItems;
};
