import { File, ImportDeclaration } from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';

export default (ast: File, dependent: string): boolean => {
  let isImportReact = false;
  traverse(ast, {
    ImportDeclaration(path: NodePath<ImportDeclaration>) {
      const { node } = path;
      if (node.source.value === dependent) {
        isImportReact = true;
      }
    },
  });
  return isImportReact;
};
