import * as fs from 'fs';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import getBabelParserPlugins from '../utils/getBabelParserPlugins';

// Get props keys from component code,
// * propTypes
// * assignment: const { xxx } = props
// * expression: props.xxx
export default function getPropKeysFromCode(componentPath: string, componentName: string): string[] {
  const propKeys: string[] = [];
  try {
    const ast = parse(fs.readFileSync(componentPath, 'utf-8'), {
      sourceType: 'module',
      plugins: getBabelParserPlugins('jsx'),
    });

    if (ast) {
      // https://babeljs.io/docs/en/babel-traverse
      traverse(ast, {
        // Get propTypes
        ExpressionStatement(path) {
          const expression: any = path.node.expression;
          const { left, right } = expression;

          if (left && right) {
            const leftObject = left.object;
            const leftProperty = left.property;

            if (leftObject.name === componentName && leftProperty.name === 'propTypes') {
              (right.properties || []).forEach((property) => {
                propKeys.push(property.key.name);
              });
            }
          }
        },

        // Get props destructuring assignment.
        // Example: const { xxx } = props;
        VariableDeclarator(path) {
          const id: any = path.node.id;
          const init: any = path.node.init;

          if (init.name === 'props') {
            (id.properties || []).forEach((property) => {
              propKeys.push(property.key.name);
            });
          }
        },

        // Get props member expression.
        // Example: props.xxx
        MemberExpression(path) {
          const { property } = path.node;
          const object: any = path.node;
          if (object.name === 'props') {
            propKeys.push(property.name);
          }
        },
      });
    }
  } catch (error) {
    // ignore
  }

  return propKeys;
}
