import updateIdentifierMap from './updateIdentifierMap';

const removeReferenceInFunctionVisitor = {
  Identifier(nodePath) {
    const { node, scope } = nodePath;
    const identifierName = node.name;
    // @ts-ignore
    const identifierNum = updateIdentifierMap(identifierName, this.identifierMap);
    // @ts-ignore
    removeReference(scope, identifierName, identifierNum, this.identifierMap);
  },
};

function removeReference(
  scope: any,
  referenceName: string,
  referenceNum: number,
  identifierMap: Map<string, number>,
) {
  if (scope && scope.bindings) {
    if (
      scope.bindings[referenceName] &&
      scope.bindings[referenceName].referenced &&
      scope.bindings[referenceName].references === referenceNum
    ) {
      const { path } = scope.bindings[referenceName];
      const { type, parentPath, node } = path;
      if (
        type === 'ImportDefaultSpecifier' ||
        type === 'ImportSpecifier'
      ) {
        if (
          parentPath.node &&
          parentPath.node.specifiers &&
          parentPath.node.specifiers.length === 1 &&
          parentPath.node.specifiers[0].local.name === referenceName
        ) {
          // remove ImportDeclaration
          parentPath.remove();
          return;
        }
      } else if (
        type === 'FunctionDeclaration' ||
        (type === 'VariableDeclarator' && node.init.type === 'ArrowFunctionExpression')
      ) {
        // remove reference in the function
        path.traverse(removeReferenceInFunctionVisitor, { identifierMap });
      }

      if (path.node) {
        // remove reference
        path.remove();
      }
    } else {
      removeReference(scope.parent, referenceName, referenceNum, identifierMap);
    }
  }
}

export default removeReference;
