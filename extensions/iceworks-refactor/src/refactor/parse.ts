import * as parser from '@babel/parser';

const options: parser.ParserOptions = {
  sourceType: 'module',
  plugins: [
    'jsx',
    'typescript',
    'decorators-legacy',
    'dynamicImport',
    'classProperties',
  ],
};

function parse(code) {
  return parser.parse(code, options);
}

export default parse;
