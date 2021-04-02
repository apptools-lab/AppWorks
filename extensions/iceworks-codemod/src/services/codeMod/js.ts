export default {
  name: 'Generation JS',
  packageName: 'js-codemod',
  description: 'Codemod scripts to transform code to next generation JS.',
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
  ],
};
