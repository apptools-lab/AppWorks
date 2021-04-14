export default {
  name: 'Next Generation JS',
  packageName: 'next-js-codemod',
  description: 'Codemod scripts to transform code to next generation JS.',
  applyTypes: ['react', 'rax'],
  parserMap: [
    {
      languageType: 'js',
      value: 'babel',
    },
    {
      languageType: 'ts',
      value: 'tsx',
    },
  ],
  transforms: [
    {
      name: 'No vars',
      filename: 'no-vars',
      description: 'Conservatively converts var to const or let.',
    },
    {
      name: 'Arrow Function',
      filename: 'arrow-function',
      description: 'Transforms callbacks only when it can guarantee it won\'t break this context in the function. Also transforms `function() { }.bind(this)` calls to `() => {}`.',
    },
    {
      name: 'Object Shorthand',
      filename: 'object-shorthand',
      description: 'Transforms object literals to use ES6 shorthand for properties and methods.',
    },
    {
      name: 'Remove Object.assign',
      filename: 'rm-object-assign',
      description: 'Replace Object.assign to Destructuring.',
    },
    {
      name: 'Remove requires',
      filename: 'rm-requires',
      description: 'Removes any requires where the imported value is not referenced. Additionally if any module is required more than once the two requires will be merged.',
    },
    {
      name: 'Template Literals',
      filename: 'template-literals',
      description: 'Replaces string concatenation with template literals.',
    },
  ],
};
