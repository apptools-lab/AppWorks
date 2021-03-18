const path = require('path');
const fs = require('fs');
const parse = require('./parse');
const t = require('@babel/types');
const traverse = require('@babel/traverse').default;
const generate = require('./generate');

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
  const JSXElementMap = new Map();

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
          // TODO 使用 nodePath.traverse(JSXExpressionContainerVisitor);
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
        if (
          scope.bindings[identifierName] &&
          scope.bindings[identifierName].referenced &&
          scope.bindings[identifierName].references === identifierNums
        ) {
          // 当前作用域
          // remove reference
          // TODO 删除引用前同样需要删除未引用的变量和 import
          scope.bindings[identifierName].path.remove();
        } else if (
          scope.parent.bindings[identifierName] &&
          scope.parent.bindings[identifierName].referenced &&
          scope.parent.bindings[identifierName].references === identifierNums
        ) {
          // 父级作用域
          scope.parent.bindings[identifierName].path.remove();
        }
      }
    },
    JSXIdentifier(nodePath) {
      if (isSelectionTraversing && nodePath.isReferencedIdentifier) {
        const { node, scope } = nodePath;
        const elementName = node.name;
        let JSXElementNums = JSXElementMap.get(elementName);

        if (!JSXElementNums) {
          JSXElementNums = 1;
          JSXElementMap.set(elementName, JSXElementNums);
        } else {
          JSXElementNums += 1;
          JSXElementMap.set(elementName, JSXElementNums);
        }

        if (
          scope.bindings[elementName] &&
          scope.bindings[elementName].referenced &&
          scope.bindings[elementName].references === JSXElementNums
        ) {
          // 当前作用域
          // remove reference
          // TODO 删除引用前同样需要删除未引用的变量和 import
          scope.bindings[node.name].path.remove();
        } else if (
          scope.parent.bindings[elementName] &&
            scope.parent.bindings[elementName].referenced &&
            scope.parent.bindings[elementName].references === JSXElementNums
        ) {
          // 父级作用域
          if (scope.parent.bindings[elementName].path.type === 'ImportDefaultSpecifier') {
            // TODO 删除引用

          } else {
            scope.parent.bindings[elementName].path.remove();
          }
        }
      }
    },
  });
}

