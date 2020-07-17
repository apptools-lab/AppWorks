import syntaxDecorators from '@babel/plugin-syntax-decorators';

export default function () {
  return {
    name: 'sylvanas-decorators',
    inherits: syntaxDecorators,
    visitor: {},
  };
}
