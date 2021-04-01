import * as parser from '@babel/parser';

const defaultOptions: parser.ParserOptions = {
  sourceType: 'module',
  plugins: [
    'jsx',
    'typescript',
    'decorators-legacy',
    'dynamicImport',
    'classProperties',
  ],
};

function parse(code, options = defaultOptions) {
  return parser.parse(code, options);
}

export default parse;
