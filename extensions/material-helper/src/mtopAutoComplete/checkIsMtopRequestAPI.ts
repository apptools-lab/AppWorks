
import {
  CallExpression,
  Expression,
  isCallExpression,
  MemberExpression,
} from '@babel/types';


function getCalleeStack(expression: Expression, calleeStack: string[]): void {
  if (expression.type === 'Identifier') {
    calleeStack.push(expression.name);
  } else if (expression.type === 'MemberExpression') {
    const { property, object } = expression as MemberExpression;
    getCalleeStack(property as Expression, calleeStack);
    getCalleeStack(object, calleeStack);
  }
}

function checkIsEqualArray<T>(sourceArray: T[], targetArray: T[]): boolean {
  if (sourceArray.length !== targetArray.length) {
    return false;
  }
  let flag = true;
  for (let i = 0; i < sourceArray.length; i++) {
    if (sourceArray[i] !== targetArray[i]) {
      flag = false;
    }
  }
  return flag;
}

/**
 * 判断函数表达式是否为 lib.mtop.request 或  Mtop.request
 * @param callExpression
 * @returns
 */
export default (callExpression: CallExpression): boolean => {
  if (!isCallExpression(callExpression)) {
    return false;
  }
  const { callee } = callExpression;
  const libMtopRequestStack = ['request', 'mtop', 'lib'];
  const mtopRequestStack = ['request', 'Mtop'];
  const calleeStack: string[] = [];
  getCalleeStack(callee as Expression, calleeStack);
  return checkIsEqualArray(libMtopRequestStack, calleeStack) || checkIsEqualArray(mtopRequestStack, calleeStack);
};
