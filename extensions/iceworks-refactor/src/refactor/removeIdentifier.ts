import updateIdentifierMap from './updateIdentifierMap';

const removeIdentifierInFunctionVisitor = {
  Identifier(nodePath) {
    const { node, scope } = nodePath;
    const identifierName = node.name;
    // @ts-ignore
    const identifierCount = updateIdentifierMap(identifierName, this.identifierMap);
    // @ts-ignore
    removeIdentifier(scope, identifierName, identifierCount, this.identifierMap);
  },
};

function removeIdentifier(
  scope: any,
  identifierName: string,
  identifierNums: number,
  identifierMap: Map<string, number>,
) {
  if (scope && scope.bindings) {
    if (
      scope.bindings[identifierName] &&
      scope.bindings[identifierName].referenced &&
      scope.bindings[identifierName].references === identifierNums
    ) {
      const { path } = scope.bindings[identifierName];
      const { type, parentPath, node } = path;
      if (
        type === 'ImportDefaultSpecifier' ||
        type === 'ImportSpecifier'
      ) {
        if (
          parentPath.node &&
          parentPath.node.specifiers &&
          parentPath.node.specifiers.length === 1 &&
          parentPath.node.specifiers[0].local.name === identifierName
        ) {
          // remove ImportDeclaration
          parentPath.remove();
          return;
        }
      } else if (
        type === 'FunctionDeclaration' ||
        (type === 'VariableDeclarator' && node.init.type === 'ArrowFunctionExpression')
      ) {
        // remove Identifier in the function
        path.traverse(removeIdentifierInFunctionVisitor, { identifierMap });
      }

      if (path.node) {
        // remove identifier
        path.remove();
      }
    } else {
      removeIdentifier(scope.parent, identifierName, identifierNums, identifierMap);
    }
  }
}

export default removeIdentifier;
