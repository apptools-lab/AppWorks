import traverse, { NodePath, Scope } from '@babel/traverse';
import * as t from '@babel/types';
import addIdentifierCount from '../utils/addIdentifierCount';
import handleValidIdentifier from '../utils/handleValidIdentifier';
import handleValidJSXIdentifier from '../utils/handleValidJSXIdentifier';

/**
 * remove useless references from code
 * e.g.:
 * before:
 * const uri = 'uri', b = 2;
 * <View uri={uri}></View>
 * after:
 * const uri = 'uri';
 * <View uri={uri}></View>
 */
export function removeUselessReferences(ast: any, originUnrefIdentifiers: string[]) {
  // collect Identifier occurs times
  const identifierMap = new Map<string, number>();
  // collect JSXIdentifier occurs times
  const JSXIdentifierMap = new Map<string, number>();
  // collect import specifiers
  const importSpecifiers = {};
  // collect remove import specifiers
  const removeImportSpecifiers = {};

  traverse(ast, {
    ImportDeclaration(path) {
      removeSpecifier(path);
    },
    VariableDeclaration(path) {
      removeVariableAndReference(path);
    },
    ClassDeclaration(path) {
      removeClassAndReference(path);
    },
    FunctionDeclaration(path) {
      removeFunctionAndReference(path);
    },
  });

  function removeSpecifier(importDeclarationPath: NodePath<t.ImportDeclaration>, map?: Map<string, number>) {
    const { node: { source } } = importDeclarationPath;
    const sourceValue = source.value;
    if (!importSpecifiers[sourceValue]) {
      importSpecifiers[sourceValue] = new Set();
    }
    if (!removeImportSpecifiers[sourceValue]) {
      removeImportSpecifiers[sourceValue] = new Set();
    }
    importDeclarationPath.traverse({
      enter(nodePath) {
        if (t.isImportSpecifier(nodePath.node) ||
          t.isImportDefaultSpecifier(nodePath.node) ||
          t.isImportNamespaceSpecifier(nodePath.node)
        ) {
          const { node: { local: { name } }, scope } = nodePath;
          importSpecifiers[sourceValue].add(name);
          const binding = scope.bindings[name];
          if (
            (isUnreferencedNode(scope, name) || (map && map.get(name) === binding.references)) &&
              !originUnrefIdentifiers.includes(name)
          ) {
            removeImportSpecifiers[sourceValue].add(name);
            nodePath.remove();
          }
        }
      },
    });
    if ([...removeImportSpecifiers[sourceValue]].sort().join('') === [...importSpecifiers[sourceValue]].sort().join('')) {
      importDeclarationPath.remove();
    }
  }

  function removeVariableAndReference(variableDeclarationPath: NodePath<t.VariableDeclaration>) {
    variableDeclarationPath.traverse({
      VariableDeclarator(path) {
        const { node, scope } = path;
        const { name } = node.id as any;
        if (isUnreferencedNode(scope, name) && !originUnrefIdentifiers.includes(name)) {
          removeIdentifier(path);
          path.remove();
        }
      },
    });
  }

  function removeClassAndReference(classDeclarationPath: NodePath<t.ClassDeclaration>) {
    const { node: { id }, scope } = classDeclarationPath;

    if (t.isIdentifier(id)) {
      const { name } = id;
      if (isUnreferencedNode(scope, name) && !originUnrefIdentifiers.includes(name)) {
        removeIdentifier(classDeclarationPath);
        classDeclarationPath.remove();
      }
    }
  }

  function removeFunctionAndReference(functionDeclarationPath: NodePath<t.FunctionDeclaration>) {
    const { node: { id }, scope } = functionDeclarationPath;

    if (t.isIdentifier(id)) {
      const { name } = id;
      if (isUnreferencedNode(scope, name) && !originUnrefIdentifiers.includes(name)) {
        removeIdentifier(functionDeclarationPath);
        functionDeclarationPath.remove();
      }
    }
  }

  function removeIdentifier(path: NodePath<any>) {
    path.traverse({
      Identifier(nodePath) {
        handleValidIdentifier(nodePath, () => {
          const { node, scope } = nodePath;
          const { name } = node;
          const count = addIdentifierCount(name, identifierMap);
          removeScopeIdentifier(scope, name, count, identifierMap);
        });
      },
      JSXIdentifier(nodePath) {
        handleValidJSXIdentifier(nodePath, () => {
          const { node, scope } = nodePath;
          const { name } = node;
          const count = addIdentifierCount(name, JSXIdentifierMap);
          removeScopeIdentifier(scope, name, count, JSXIdentifierMap);
        });
      },
    });
  }

  function removeScopeIdentifier(scope: Scope, name: string, count: number, map: Map<string, number>) {
    if (scope && scope.bindings) {
      const binding = scope.bindings[name];
      if (binding && binding.referenced && binding.references === count) {
        const { path } = binding;

        if (t.isVariableDeclarator(path.node) ||
            t.isClassDeclaration(path.node) ||
            t.isFunctionDeclaration(path.node)
        ) {
          // recursive call remove identifier
          removeIdentifier(path);
        } else if (t.isImportDefaultSpecifier(path.node) || t.isImportSpecifier(path.node)) {
          const parentPath = path.parentPath as NodePath<t.ImportDeclaration>;
          // recursive call remove specifier
          removeSpecifier(parentPath, identifierMap);
          removeSpecifier(parentPath, JSXIdentifierMap);
        }

        if (path && path.node) {
          const { id } = path.node as any;
          if (id && (t.isArrayPattern(id) || t.isObjectPattern(id))) {
            // const [a, b] = [1, 2]
            // const { a, b } = obj;
            const { properties, elements } = id as any;
            if (properties) {
              const propertyIndex = properties.findIndex(({ key }) => key.name === name);
              if (propertyIndex) {
                properties.splice(propertyIndex, 1);
              }
            }
            if (elements) {
              const elementIndex = elements.findIndex((item) => item.name === name);
              if (elementIndex) {
                elements.splice(elementIndex, 1);
              }
            }
          } else {
            binding.path.remove();
          }
        }
      } else {
        // remove identifier in the parent scope
        removeScopeIdentifier(scope.parent, name, count, map);
      }
    }
  }
}

function isUnreferencedNode(scope: Scope, name: string) {
  if (scope && scope.bindings) {
    const binding = scope.bindings[name];
    if (binding) {
      return !binding.referenced;
    } else {
      // find binding in the parent scope
      return isUnreferencedNode(scope.parent, name);
    }
  }
}

export default function parse(parsed) {
  removeUselessReferences(parsed.ast, parsed.unreferencedIdentifiers);
}
