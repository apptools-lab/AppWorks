import { parse } from '@babel/parser';
import { JSXOpeningElement } from '@babel/types';
import traverse from '@babel/traverse';
import getBabelParserPlugins from './getBabelParserPlugins';

type CurrentJsxElement = JSXOpeningElement | null;
export default function getJsxElements(
  documentText: string,
  condition: (jsxOpeningElement: JSXOpeningElement) => boolean,
): CurrentJsxElement[] {
  const targetJsxElements: CurrentJsxElement[] = [];

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
          const jsxOpeningElement: any = path.node;

          if (condition(jsxOpeningElement)) {
            targetJsxElements.push(jsxOpeningElement);
          }
        },
      });
    }
  } catch (error) {
    // ignore
  }

  return targetJsxElements;
}
