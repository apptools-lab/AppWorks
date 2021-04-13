export default {
  name: 'React',
  packageName: 'react-codemod',
  description: 'A collection of codemod scripts that help update React APIs.',
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
      name: 'React PropTypes to prop-types',
      filename: 'React-PropTypes-to-prop-types',
      description: 'Replaces React.PropTypes references with prop-types.',
    },
    {
      name: 'Rename unsafe lifecycles',
      filename: 'rename-unsafe-lifecycles',
      description: 'Adds "UNSAFE_" prefix for renamed lifecycle hooks.',
    },
  ],
};
