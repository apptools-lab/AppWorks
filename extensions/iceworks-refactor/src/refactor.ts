const path = require('path');
const fs = require('fs');
const parse = require('./parse');
const t = require('@babel/types');
const traverse = require('@babel/traverse').default;
const generate = require('./generate');
const removeIdentifier = require('./removeIdentifier');

const srcPath = path.resolve('./demo');
const componentName = 'TodoWithChildren';
const TodoCompPath = path.join(srcPath, 'components', componentName);
const pagesPath = path.join(srcPath, 'pages');
const detailPagePath = path.join(pagesPath, 'Detail1');

main();

function main() {
  const source = fs.readFileSync(path.join(detailPagePath, 'index.tsx'), { encoding: 'utf-8' });
  const sourceAST = parse(source);
  traverseCode(sourceAST);
  const code = generate(sourceAST);
  console.log('code: ', code);
}

function traverseCode(ast) {
  const relativePath = path.relative(detailPagePath, TodoCompPath);
  const componentNameList: string[] = [];
  let isSelectionTraversing = false;

  const identifierMap = new Map();
  const JSXIdentifierMap = new Map();

  const removeReferenceVisitor = {
    Identifier(nodePath) {
      if (isSelectionTraversing && nodePath.isReferencedIdentifier) {
        const { node, scope } = nodePath;
        const identifierName = node.name;
        let identifierNums = identifierMap.get(identifierName);

        if (!identifierNums) {
          identifierNums = 1;
          identifierMap.set(identifierName, identifierNums);
        } else {
          identifierNums += 1;
          identifierMap.set(identifierName, identifierNums);
        }
        removeIdentifier(scope, identifierName, identifierNums);
      }
    },
    JSXIdentifier(nodePath) {
      if (isSelectionTraversing && nodePath.isReferencedIdentifier) {
        const { node, scope } = nodePath;
        const identifierName = node.name;
        let JSXIdentifierNums = JSXIdentifierMap.get(identifierName);

        if (!JSXIdentifierNums) {
          JSXIdentifierNums = 1;
          JSXIdentifierMap.set(identifierName, JSXIdentifierNums);
        } else {
          JSXIdentifierNums += 1;
          JSXIdentifierMap.set(identifierName, JSXIdentifierNums);
        }
        removeIdentifier(scope, identifierName, JSXIdentifierNums);
      }
    },
  };
  traverse(ast, {
    ImportDeclaration(nodePath) {
      const { node } = nodePath;
      if (t.isStringLiteral(node.source, { value: relativePath })) {
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
        if (isSelectionTraversing && componentNameList.includes(openingElement.name.name)) {
          nodePath.remove();
          isSelectionTraversing = false;
          console.log('target exit');
        }
      },
    },
  });
}

