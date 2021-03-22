import * as path from 'path';
import * as fs from 'fs';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import generate from './generate';
import parse from './parse';
import removeIdentifier from './removeIdentifier';
import updateIdentifierMap from './updateIdentifierMap';

const jsxFileExtnames = ['.js', '.jsx', '.tsx'];

const testPath = path.resolve('./test/examples/');
const componentName = 'TodoWithChildren';
const componentPath = path.join(testPath, 'components', componentName, 'index.tsx');
const pagesPath = path.join(testPath, 'pages');
const pagePath = path.join(pagesPath, 'FunctionComponent', 'index.tsx');

refactorCode(pagePath, componentPath);

function refactorCode(refactoredSourcePath: string, removeComponentName: string) {
  const source = fs.readFileSync(refactoredSourcePath, { encoding: 'utf-8' });
  const sourceAST = parse(source);
  traverseCode(sourceAST, refactoredSourcePath, removeComponentName);
  const code = generate(sourceAST);
  console.log('code: ', code);
  return code;
}

function traverseCode(ast: t.File, refactoredSourcePath: string, removedSourcePath: string) {
  // const refactoredSourceDir = path.dirname(refactoredSourcePath);
  // const importSourcePath: string = path.relative(refactoredSourceDir, removedSourcePath);
  const componentNameList: string[] = [];
  let isSelectionTraversing = false;

  const identifierMap = new Map();
  const JSXIdentifierMap = new Map();

  const removeReferenceVisitor = {
    Identifier(nodePath) {
      if (isSelectionTraversing && nodePath.isReferencedIdentifier) {
        const { node, scope } = nodePath;
        const identifierName = node.name;
        const identifierCount = updateIdentifierMap(identifierName, identifierMap);

        removeIdentifier(scope, identifierName, identifierCount, identifierMap);
      }
    },
    JSXIdentifier(nodePath) {
      if (isSelectionTraversing && nodePath.isReferencedIdentifier) {
        const { node, scope } = nodePath;
        const identifierName = node.name;
        const JSXIdentifierCount = updateIdentifierMap(identifierName, JSXIdentifierMap);

        removeIdentifier(scope, identifierName, JSXIdentifierCount, identifierMap);
      }
    },
  };

  traverse(ast, {
    ImportDeclaration(nodePath) {
      const { node } = nodePath;
      const sourceValue = node.source.value;
      let match = false;
      if (/^\./.test(sourceValue)) {
        // relative path
        const refactoredSourceDir = path.dirname(refactoredSourcePath);
        const importSourcePath: string = path.relative(refactoredSourceDir, removedSourcePath);
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
        console.log('enter');
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
          console.log('target enter');
          isSelectionTraversing = true;
          nodePath.traverse(removeReferenceVisitor);
        }
      },
      exit(nodePath) {
        console.log('exited');
        const { node } = nodePath;
        const { openingElement } = node;
        if (
          t.isJSXMemberExpression(openingElement.name) ||
          t.isJSXNamespacedName(openingElement.name)
        ) {
          return;
        }
        if (isSelectionTraversing && componentNameList.includes(openingElement.name.name)) {
          nodePath.remove();
          isSelectionTraversing = false;
          console.log('target exit');
        }
      },
    },
  });
}
