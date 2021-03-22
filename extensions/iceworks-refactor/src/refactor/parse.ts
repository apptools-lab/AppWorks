import * as parser from '@babel/parser';

function parse(code) {
  return parser.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript',
      'decorators-legacy',
      'dynamicImport',
      'classProperties',
    ],
  });
}

export default parse;
