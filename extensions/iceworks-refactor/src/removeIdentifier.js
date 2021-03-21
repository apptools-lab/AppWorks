// const removeIdentifierInFunctionVisitor = {
//   Identifier(nodePath) {

//   },
// };

function removeIdentifier(scope, identifierName, identifierNums) {
  if (scope && scope.bindings) {
    if (
      scope.bindings[identifierName] &&
      scope.bindings[identifierName].referenced &&
      scope.bindings[identifierName].references === identifierNums
    ) {
      // TODO 删除引用前同样需要删除未引用的变量和 import
      const { path } = scope.bindings[identifierName];
      const { type, parentPath } = path;
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
      } else if (type === 'FunctionDeclaration') {
        // path.traverse(removeIdentifierInFunctionVisitor);

      }
      // remove identifier
      path.remove();
    } else {
      removeIdentifier(scope.parent, identifierName, identifierNums);
    }
  }
}

module.exports = removeIdentifier;
