import * as path from 'path';
import * as t from '@babel/types';
import babelTraverse from '@babel/traverse';
// import { jsxFileExtnames } from '@iceworks/project-service';
import removeReference from './removeReference';
import updateIdentifierMap from './updateIdentifierMap';

const jsxFileExtnames = ['.js', '.jsx', '.tsx'];

function traverseCode(ast: t.File, refactoredSourcePath: string, componentSourcePath: string) {
  const componentNameList: string[] = [];

  const identifierMap = new Map();
  const JSXIdentifierMap = new Map();

  const removeReferenceVisitor = {
    Identifier(nodePath) {
      if (nodePath.isReferencedIdentifier()) {
        const { node, scope } = nodePath;
        const identifierName = node.name;
        const identifierCount = updateIdentifierMap(identifierName, identifierMap);

        removeReference(scope, identifierName, identifierCount, identifierMap);
      }
    },
    JSXIdentifier(nodePath) {
      if (nodePath.isReferencedIdentifier()) {
        const { node, scope } = nodePath;
        const identifierName = node.name;
        const JSXIdentifierCount = updateIdentifierMap(identifierName, JSXIdentifierMap);

        removeReference(scope, identifierName, JSXIdentifierCount, identifierMap);
      }
    },
  };

  babelTraverse(ast, {
    ImportDeclaration(nodePath) {
      const { node } = nodePath;
      const sourceValue = node.source.value;
      let match = false;
      if (/^\./.test(sourceValue)) {
        // relative path
        const refactoredSourceDir = path.dirname(refactoredSourcePath);
        const importSourcePath: string = path.relative(refactoredSourceDir, componentSourcePath);
        const importSourceDir: string = path.dirname(importSourcePath);
        const ext = jsxFileExtnames.find(jsxExt => {
          return importSourcePath.includes(jsxExt);
        });

        const basename: string = path.basename(importSourcePath, ext);

        const regexp = new RegExp(`${importSourceDir}(\\/${basename})?`);

        if (regexp.test(sourceValue)) {
          match = true;
        }
      }
      if (match) {
        const { specifiers } = node;
        specifiers.forEach(specifier => {
          const { local } = specifier;
          const { name } = local;
          componentNameList.push(name);
        });
        // remove import declaration
        nodePath.remove();
      }
    },
    JSXElement: {
      enter(nodePath) {
        const { node } = nodePath;
        const { openingElement } = node;
        if (
          t.isJSXMemberExpression(openingElement.name) ||
          t.isJSXNamespacedName(openingElement.name)
        ) {
          return;
        }
        const elementName = openingElement.name.name;

        if (componentNameList.includes(elementName)) {
          nodePath.traverse(removeReferenceVisitor);
        }
      },
      exit(nodePath) {
        const { node } = nodePath;
        const { openingElement } = node;
        if (
          t.isJSXMemberExpression(openingElement.name) ||
          t.isJSXNamespacedName(openingElement.name)
        ) {
          return;
        }
        if (componentNameList.includes(openingElement.name.name)) {
          nodePath.remove();
        }
      },
    },
  });
}

export default traverseCode;
