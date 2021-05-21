import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { isObjectExpression, CallExpression } from '@babel/types';
import isLibMtopRequestAPI from './isLibMtopRequestAPI';
function isCursorInObjectExpression(callExpression: CallExpression, cursorPosition: number): boolean {
  const callArguments = callExpression.arguments;
  const node = callArguments?.[0];
  return isObjectExpression(node) && (node.start < cursorPosition && cursorPosition < node.end);
}

function conditionOfCompletion(callExpression: CallExpression, cursorPosition: number): boolean {
  return isCursorInObjectExpression(callExpression, cursorPosition) && isLibMtopRequestAPI(callExpression);
}
/**
 * 解析code，根据条件判断是否返回CallExpression
 * @param code
 * @param cursorPosition
 * @param conditionOfComplete
 * @returns
 */
function originGetCurrentCallExpress(
  code: string,
  cursorPosition: number,
  conditionOfComplete: (callExpression: CallExpression, cursorPostion: number) => boolean
): CallExpression | null {
  let callExpression: CallExpression = null;
  try {
    const ast = parse(code, {
      sourceType: 'module',
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
    console.log(e);
  }
  return callExpression;
}

export default function getCurrentCallExpress(code: string, cursorPosition: number): CallExpression | null {
  return originGetCurrentCallExpress(code, cursorPosition, conditionOfCompletion);
}