import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as lineColumn from 'line-column';

import { IProblem } from '../types/Problem';
import getBabelParserPlugins from '../getBabelParserPlugins';

// 检查 JSX 文件 window 变量使用
// import { createElement, useEffect, useState } from 'rax';
// import { isNode } from 'universal-env';
//
// 危险代码：全局调用 window
// const t = location.href;
// export default function Home() {
//
//   危险代码：全局调用 window
//   const [test, setTest] = useState(location.href);
//
//   if(isNode){
//    安全
// 	  location.href = '';
//   }
//
//   useEffect(() => {
//     安全
//     location.href = '';
//   }, []);
//
//   function t (){
//     安全
//     location.href = '';
//   }
//
//   return (
//     危险代码：全局调用 window
//     <p>{location.href}</p>
//   );
// }
// 检查思路：在函数和 if 条件作用域中使用 window 变量 可以近似认为是安全的

interface ISafeScopeNodes {
  id: string | null;
  node: any;
}

const RULE_NAME = 'wrong-global-variable-usage';
const GLOBAL_VARIABLES = ['document', 'history', 'location', 'localStorage', 'navigator', 'sessionStorage', 'window'];

export default function checker(code: string, uri: string): IProblem[] {
  const problems: IProblem[] = [];

  if (/\.(js|jsx|ts|tsx)$/.test(uri)) {
    try {
      const ast = parse(code, {
        sourceType: 'module',
        plugins: getBabelParserPlugins(/\.(js|jsx)$/.test(uri) ? 'js' : 'ts'),
      });

      if (ast) {
        let exportComponent: any;
        const safeScopeNodes: ISafeScopeNodes[] = [];

        // 首先圈出所有的安全区域（函数和 if 作用域内）
        traverse(ast, {
          FunctionDeclaration(path: any) {
            const { node } = path;
            safeScopeNodes.push({
              // function Component() {
              id: (node.id && node.id.name) || '',
              node,
            });
          },
          ArrowFunctionExpression(path: any) {
            const { parent, node } = path;
            safeScopeNodes.push({
              // const Component = () => {
              id: (parent.id && parent.id.name) || '',
              node,
            });
          },
          IfStatement(path: any) {
            // if(isNode) {
            const { node } = path;
            safeScopeNodes.push({
              // const Component = () => {
              id: '',
              node,
            });
          },
          ExportDefaultDeclaration(path: any) {
            exportComponent = path.node;
          },
        });

        // 去除 export 的 JSX 函数后，粗略认为剩下安全区域中出现的 window 变量是安全的
        if (exportComponent && exportComponent.declaration) {
          // export default Component;
          safeScopeNodes.splice(
            safeScopeNodes.findIndex((path: ISafeScopeNodes) => {
              if (path.id === exportComponent.declaration.name) {
                // export default Component;
                return true;
              } else if (
                // export default function ...
                path.node.start === exportComponent.declaration.start &&
                path.node.end === exportComponent.declaration.end
              ) {
                return true;
              }
              return false;
            }),
            1
          );
        }

        // 开始检测 window 全局变量的使用
        const unSafeGlobalVariableNodes: any[] = [];
        traverse(ast, {
          Identifier(path: any) {
            const { node = {} } = path;
            const isGlobalVariable = !!GLOBAL_VARIABLES.find((variable) => variable === node.name);
            let isSafeGlobalVariable = false;
            if (isGlobalVariable) {
              for (let i = 0; i < safeScopeNodes.length; i++) {
                if (
                  // 在安全函数区域内的全局变量，SSR 可正常运行
                  node.start >= safeScopeNodes[i].node.start &&
                  node.end <= safeScopeNodes[i].node.end
                ) {
                  isSafeGlobalVariable = true;
                  break;
                }
              }

              if (!isSafeGlobalVariable) {
                unSafeGlobalVariableNodes.push(node);
              }
            }
          },
        });

        unSafeGlobalVariableNodes.forEach((unSafeGlobalVariableNode) => {
          const startPositionInfo = lineColumn(code).fromIndex(unSafeGlobalVariableNode.start);
          const endPositionInfo = lineColumn(code).fromIndex(unSafeGlobalVariableNode.end);

          problems.push({
            uri,
            rule: RULE_NAME,
            range: {
              start: {
                line: startPositionInfo.line - 1,
                col: startPositionInfo.col - 1,
              },
              end: {
                line: endPositionInfo.line - 1,
                col: endPositionInfo.col - 1,
              },
            },
            source: unSafeGlobalVariableNode.name,
          });
        });
      }
    } catch (e) {
      // ignore
      console.log(e);
    }
  }
  return problems;
}
