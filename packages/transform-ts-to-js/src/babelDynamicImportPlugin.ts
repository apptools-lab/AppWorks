import DynamicImport from '@babel/plugin-syntax-dynamic-import';

export default function () {
  return {
    name: 'syntax-dynamic-import',
    inherits: DynamicImport,
    visitor: {},
  };
}
