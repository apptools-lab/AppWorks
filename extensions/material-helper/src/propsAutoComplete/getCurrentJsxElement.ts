import { Node, JSXOpeningElement } from '@babel/types';
import traverse, { Scope, NodePath } from '@babel/traverse';
import originGetCurrentJsxElement from '../utils/getCurrentJsxElement';

// <Text | >...</Text>
function isCursorInJsxOpeningElement(cursorPosition: number, jsxOpeningElement: JSXOpeningElement): boolean {
  return !!(
    jsxOpeningElement.start &&
    cursorPosition > jsxOpeningElement.start &&
    jsxOpeningElement.end &&
    cursorPosition < jsxOpeningElement.end
  );
}

// <Text xxx={ | } >...</Text>
function isCursorInJsxAttribute(cursorPosition: number, node: Node, scope: Scope): boolean {
  let result = false;
  traverse(
    node,
    {
      JSXAttribute(path) {
        const jsxAttribute = path.node;

        if (
          jsxAttribute.start &&
          cursorPosition > jsxAttribute.start &&
          jsxAttribute.end &&
          cursorPosition < jsxAttribute.end
        ) {
          result = true;
        }
      },
    },
    scope,
  );
  return result;
}

// if <Text |> return Text
function conditionOfCompletion(
  cursorPosition,
  jsxOpeningElement: JSXOpeningElement,
  path: NodePath<JSXOpeningElement>,
) {
  return (
    isCursorInJsxOpeningElement(cursorPosition, jsxOpeningElement) &&
    !isCursorInJsxAttribute(cursorPosition, jsxOpeningElement, path.scope)
  );
}

export default function getCurrentJsxElement(documentType, cursorPosition) {
  return originGetCurrentJsxElement(documentType, cursorPosition, conditionOfCompletion);
}
