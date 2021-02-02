/* eslint-disable */
const fs = require('fs-extra');
const { join } = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;

module.exports = function getCustomESLintConfig(directory) {
  let config = {};
  const configFilePath = join(directory, '.eslintrc.js');

  if (fs.existsSync(configFilePath)) {
    const source = fs.readFileSync(configFilePath, { encoding: 'utf-8' });
    const ast = parse(source, {
      sourceType: 'module',
      plugins: ['flow', 'exportDefaultFrom', 'exportNamespaceFrom'],
    });

    traverse(ast, {
      CallExpression(nodePath) {
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
};
