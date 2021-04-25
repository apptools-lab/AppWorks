import traverse, { NodePath, Scope } from '@babel/traverse';
import * as t from '@babel/types';

/**
 * return the unreferenced identifiers in the source code
 * e.g.:
 * import { name, About } from '@/components/About';
 * var b = 2;
 * console.log(name);
 *
 * the function will return ['About', 'b']
 */
export function findUnreferencedIdentifiers(ast) {
  const unreferencedIdentifiers = [];

  traverse(ast, {
    enter(path: NodePath) {
      const { node, scope } = path;
      if (t.isVariableDeclaration(node)) {
        if (!Array.isArray(node.declarations)) return;
        node.declarations.forEach(declaration => {
          collectUnrefIdentifiers(scope, declaration.id, unreferencedIdentifiers);
        });
      } else if (t.isClassDeclaration(node) || t.isFunctionDeclaration(node)) {
        if (node.id) {
          collectUnrefIdentifiers(scope, node.id, unreferencedIdentifiers);
        }
      } else if (t.isImportDeclaration(node)) {
        const { specifiers } = node;
        specifiers.forEach(specifier => {
          collectUnrefIdentifiers(scope, specifier.local, unreferencedIdentifiers);
        });
      }
    },
  });

  return unreferencedIdentifiers;
}

function collectUnrefIdentifiers(
  scope: Scope,
  node: t.LVal | t.Identifier,
  unreferencedIdentifiers: string[],
) {
  if (scope && scope.bindings) {
    if (!t.isIdentifier(node)) return;
    const { name } = node;
    if (scope.bindings[name]) {
      if (!scope.bindings[name].referenced) {
        unreferencedIdentifiers.push(name);
      }
    } else {
      // find in the parentScope
      collectUnrefIdentifiers(scope.parent, node, unreferencedIdentifiers);
    }
  }
}

export default function parse(parsed) {
  const unreferencedIdentifiers = findUnreferencedIdentifiers(parsed.ast);
  parsed.unreferencedIdentifiers = unreferencedIdentifiers;
}

