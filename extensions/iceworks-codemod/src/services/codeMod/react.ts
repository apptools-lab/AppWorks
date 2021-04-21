export default {
  name: 'React',
  packageName: 'react-codemod',
  description: 'A collection of codemod scripts that help update React APIs.',
  options: {
    'explicit-require': false,
  },
  applyTypes: ['react'],
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
  extensionsMap: [
    {
      languageType: 'js',
      value: ['jsx', 'js'],
    },
    {
      languageType: 'ts',
      value: ['tsx', 'ts', 'jsx', 'js'],
    },
  ],
  transforms: [
    {
      name: 'createElement to JSX',
      filename: 'create-element-to-jsx',
      description: 'Converts calls to `React.createElement` into JSX elements.',
    },
    {
      name: 'Error Boundaries',
      filename: 'error-boundaries',
      description: 'Renames the experimental `unstable_handleError` lifecycle hook to `componentDidCatch`.',
    },
    {
      name: 'findDOMNode',
      filename: 'findDOMNode',
      description: 'Updates `this.getDOMNode()` or `this.refs.foo.getDOMNode()` calls inside of `React.createClass` components to `React.findDOMNode(foo)`. Note that it will only look at code inside of `React.createClass` calls and only update calls on the component instance or its refs. You can use this script to update most calls to `getDOMNode` and then manually go through the remaining calls..',
    },
    {
      name: 'Manual bind to Arrow',
      filename: 'manual-bind-to-arrow',
      description: 'Converts manual function bindings in a class (e.g., `this.f = this.f.bind(this)`) to arrow property initializer functions (e.g., `f = () => {}`).',
    },
    {
      name: 'Pure Component',
      filename: 'pure-component',
      description: 'Converts ES6 classes that only have a render method, only have safe properties (statics and props), and do not have refs to Functional Components.',
    },
    {
      name: 'React PropTypes to prop-types',
      filename: 'React-PropTypes-to-prop-types',
      description: 'Replaces `React.PropTypes` references with `prop-types` and adds the appropriate `import` or `require` statement.',
    },
    {
      name: 'Rename unsafe lifecycles',
      filename: 'rename-unsafe-lifecycles',
      description: 'Adds "UNSAFE_" prefix for renamed lifecycle hooks.',
    },
    {
      name: 'React.DOM to React DOM Factories',
      filename: 'React-DOM-to-react-dom-factories',
      description: 'Converts calls like `React.DOM.div(...)` to `React.createElement(\'div\', ...)`.',
    },
    {
      name: 'Sort Component methods',
      filename: 'sort-comp',
      description: 'Reorders React component methods to match the ESLint react/sort-comp rule. (Defaults to ordering of the Airbnb style guide.',
    },
  ],
};
