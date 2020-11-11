import * as fs from 'fs-extra';
import * as path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export default function getCustomESLintConfig(directory: string) {

  let config = {};
  const configFilePath = path.join(directory, '.eslintrc.js');

  if (fs.existsSync(configFilePath)) {
    const source = fs.readFileSync(configFilePath, { encoding: 'utf-8' });
    const ast = parse(source, {
      sourceType: 'module',
      plugins: ['flow', 'exportDefaultFrom', 'exportNamespaceFrom'],
    });

    traverse(ast, {
      CallExpression(path: any) {
        const { node } = path;
        if (node.callee.name === 'getESLintConfig' && node.arguments && node.arguments[1]) {
          const configNode = node.arguments[1];
          const configSource = source.substring(configNode.start, configNode.end);
          config = eval(`(${configSource})`);
        }
      },
    });
  }

  return config;
}
