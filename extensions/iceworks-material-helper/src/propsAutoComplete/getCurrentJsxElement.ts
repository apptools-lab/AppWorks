import { parse } from '@babel/parser';
import { Node, JSXOpeningElement } from '@babel/types';
import traverse, { Scope } from '@babel/traverse';
import getBabelParserPlugins from './getBabelParserPlugins';

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
    scope
  );
  return result;
}

type CurrentJsxElement = JSXOpeningElement | null;
export default function getCurrentJsxElement(documentText: string, cursorPosition): CurrentJsxElement {
  let currentJsxElement: CurrentJsxElement = null;

  try {
    // https://babeljs.io/docs/en/babel-parser
    const ast = parse(documentText, {
      sourceType: 'module',
      plugins: getBabelParserPlugins('jsx'),
    });

    if (ast) {
      // https://babeljs.io/docs/en/babel-traverse
      traverse(ast, {
        JSXOpeningElement(path) {
          const jsxOpeningElement = path.node;

          if (
            // if <Text |> return Text
            isCursorInJsxOpeningElement(cursorPosition, jsxOpeningElement) &&
            !isCursorInJsxAttribute(cursorPosition, jsxOpeningElement, path.scope)
          ) {
            currentJsxElement = jsxOpeningElement;
          }
        },
      });
    }
  } catch (error) {
    // ignore
  }

  return currentJsxElement;
}
