import { eslint, deepmerge } from '@ice/spec';

const MAX_LINES = 400;

const defaultEslintConfig = Object.assign({}, eslint);

if (!defaultEslintConfig.overrides) {
  defaultEslintConfig.overrides = [];
}

// Recommended security practices eslint config
module.exports = deepmerge(defaultEslintConfig, {
  plugins: ['@iceworks/best-practices'],
  overrides: [
    {
      files: ['package.json'],
      processor: '@iceworks/best-practices/.json',
      rules: {
        quotes: 'off',
        '@iceworks/best-practices/deps-no-resolutions': 'warn',
        '@iceworks/best-practices/no-broad-semantic-versioning': 'error',
      },
    },
  ],
  rules: {
    'react/react-in-jsx-scope': 'off', // For rax
    'react/jsx-filename-extension': 0, // For ts
    'max-lines': ['warn', { max: MAX_LINES }],
    'no-unused-vars': ['warn', { varsIgnorePattern: 'createElement' }],
    '@iceworks/best-practices/no-js-in-ts-project': 'warn',
    '@iceworks/best-practices/recommend-functional-component': 'warn',
  },
});
