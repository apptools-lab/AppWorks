import traverse, { NodePath, Scope } from '@babel/traverse';
import * as t from '@babel/types';
import addIdentifierCount from '../utils/addIdentifierCount';

function removeDeadReferences(ast: any, originUnrefIdentifiers: string[]) {
  const identifierMap = new Map<string, number>();

  traverse(ast, {
    enter(path: NodePath) {
      const { node, scope } = path;
      if (t.isVariableDeclaration(node)) {
        if (!Array.isArray(node.declarations)) return;
        node.declarations.forEach(declaration => {
          removeReference(path, scope, declaration.id, originUnrefIdentifiers, identifierMap);
        });
      } else if (t.isClassDeclaration(node) || t.isFunctionDeclaration(node)) {
        if (node.id) {
          removeReference(path, scope, node.id, originUnrefIdentifiers, identifierMap);
        }
      } else if (t.isImportDeclaration(node)) {
        const { specifiers } = node;
        specifiers.forEach(specifier => {
          removeReference(path, scope, specifier.local, originUnrefIdentifiers, identifierMap);
        });
      }
    },
  });
}

function removeReference(
  path: NodePath,
  scope: Scope,
  node: t.LVal | t.Identifier,
  originUnrefIdentifiers: string[],
  identifierMap: Map<string, number>,
) {
  if (!t.isIdentifier(node)) return;

  const { name } = node;
  if (isUnreferenced(scope, name) && !originUnrefIdentifiers.includes(name)) {
    /**
     * remove identifier reference in the function body or expression
     * const d = 1;
     * function fn() { console.log(d) }
     */
    removeIdentifierReference(path, identifierMap);
    path.remove();
  }
}

function isUnreferenced(scope: Scope, name: string) {
  if (scope && scope.bindings) {
    if (scope.bindings[name]) {
      return !scope.bindings[name].referenced;
    } else {
      // find in the parent scope
      return isUnreferenced(scope.parent, name);
    }
  }
}

function removeIdentifierReference(path: NodePath, map: Map<string, number>) {
  path.traverse({
    Identifier(nodePath) {
      const { node, scope } = nodePath;
      const { name } = node;
      const count = addIdentifierCount(name, map);
      removeIdentifier(scope, name, count, map);
    },
  });
}

function removeIdentifier(scope, name, count, map) {
  if (scope && scope.bindings) {
    const binding = scope.bindings[name];
    if (binding && binding.referenced && binding.references === count) {
      const { path } = binding;
      const { type } = path;
      if (type === 'FunctionDeclaration' ||
        type === 'VariableDeclarator' ||
        type === 'ClassDeclaration'
      ) {
        removeIdentifierReference(path, map);
      }
      if (path && path.node) {
        binding.path.remove();
      }
    } else {
      removeIdentifier(scope.parent, name, count, map);
    }
  }
}

export default {
  parse(parsed, options) {
    removeDeadReferences(parsed.ast, options.unreferencedIdentifiers);
  },
  // for test export
  _removeDeadReferences: removeDeadReferences,
};
