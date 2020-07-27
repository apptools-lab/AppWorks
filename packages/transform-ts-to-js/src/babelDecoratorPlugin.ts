import syntaxDecorators from '@babel/plugin-syntax-decorators';

export default function () {
  return {
    name: 'syntax-decorators',
    inherits: syntaxDecorators,
    visitor: {},
  };
}
