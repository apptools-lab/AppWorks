import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { isObjectExpression, CallExpression } from '@babel/types';
import checkIsMtopRequestAPI from './checkIsMtopRequestAPI';
import getBabelParserPlugins from '../utils/getBabelParserPlugins';

function isCursorInObjectExpression(callExpression: CallExpression, cursorPosition: number): boolean {
  const callArguments = callExpression.arguments;
  const node = callArguments?.[0];
  return isObjectExpression(node) && (<number>node.start < cursorPosition && cursorPosition < <number>node.end);
}

function conditionOfCompletion(callExpression: CallExpression, cursorPosition: number): boolean {
  return isCursorInObjectExpression(callExpression, cursorPosition) && checkIsMtopRequestAPI(callExpression);
}

/**
 * 解析code，根据条件判断是否返回CallExpression
 * @param code
 * @param cursorPosition
 * @param conditionOfComplete
 * @returns
 */
function getOriginCurrentCallExpress(
  code: string,
  cursorPosition: number,
  conditionOfComplete: (callExpression: CallExpression, cursorPostion: number) => boolean,
): CallExpression | null {
  let callExpression: CallExpression | null = null;
  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: getBabelParserPlugins('ts'),
    });
    traverse(ast, {
      CallExpression(path: NodePath<CallExpression>) {
        const { node } = path;
        if (conditionOfComplete(node, cursorPosition)) {
          callExpression = node;
        }
      },
    });
  } catch (e) {
    console.error(e);
  }
  return callExpression;
}

export default function getCurrentCallExpress(code: string, cursorPosition: number): CallExpression | null {
  return getOriginCurrentCallExpress(code, cursorPosition, conditionOfCompletion);
}
