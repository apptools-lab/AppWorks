import { parse } from '@babel/parser';
import { JSXOpeningElement } from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';
import getBabelParserPlugins from './getBabelParserPlugins';

type CurrentJsxElement = JSXOpeningElement | null;

export default function getCurrentJsxElement(
  documentText: string,
  cursorPosition,
  condition: (cursorPosition, jsxOpeningElement: JSXOpeningElement, path: NodePath<JSXOpeningElement>) => boolean,
): CurrentJsxElement {
  let currentJsxElement: CurrentJsxElement = null;

  try {
    // https://babeljs.io/docs/en/babel-parser
    const ast = parse(documentText, {
      sourceType: 'module',
      plugins: getBabelParserPlugins('ts'),
    });

    if (ast) {
      // https://babeljs.io/docs/en/babel-traverse
      traverse(ast, {
        JSXOpeningElement(path) {
          const jsxOpeningElement = path.node;

          if (condition(cursorPosition, jsxOpeningElement, path)) {
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
