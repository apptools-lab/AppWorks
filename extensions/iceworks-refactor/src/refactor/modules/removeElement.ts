import traverse from '@babel/traverse';
import * as t from '@babel/types';

export function removeElement(ast: any, importSpecifiers: string[]) {
  traverse(ast, {
    JSXElement(path) {
      const { openingElement } = path.node;
      const elementName = getElementName(openingElement);
      if (importSpecifiers.includes(elementName)) {
        if (t.isConditionalExpression(path.parent) || t.isJSXExpressionContainer(path.parent)) {
          // {true ? <Detail /> : <div />}
          // <Detail comp={<Page />}></Detail>
          path.replaceWith(t.nullLiteral());
        } else {
          path.remove();
        }
      }
    },
  });
}

function getElementName(openingElement) {
  let elementName;
  if (t.isJSXMemberExpression(openingElement.name)) {
    elementName = openingElement.name.object.name;
  } else if (t.isJSXIdentifier(openingElement.name)) {
    elementName = openingElement.name.name;
  }

  return elementName;
}

export default function parse(parsed, options) {
  removeElement(parsed.ast, options.importSpecifiers);
}
