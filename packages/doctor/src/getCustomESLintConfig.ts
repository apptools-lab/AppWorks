import * as fs from 'fs-extra';
import { join } from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export default function getCustomESLintConfig(directory: string) {
  let config = {};
  const configFilePath = join(directory, '.eslintrc.js');

  if (fs.existsSync(configFilePath)) {
    const source = fs.readFileSync(configFilePath, { encoding: 'utf-8' });
    const ast = parse(source, {
      sourceType: 'module',
      plugins: ['flow', 'exportDefaultFrom', 'exportNamespaceFrom'],
    });

    traverse(ast as any, {
      CallExpression(nodePath: any) {
        const { node } = nodePath;
        if (node.callee.name === 'getESLintConfig' && node.arguments && node.arguments[1]) {
          const configNode = node.arguments[1];
          const configSource = source.substring(configNode.start, configNode.end);
          // eslint-disable-next-line no-eval
          config = eval(`(${configSource})`);
        }
      },
    });
  }

  return config;
}
