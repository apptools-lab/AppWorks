import { eslint, deepmerge } from '@ice/spec';

const defaultEslintConfig = Object.assign({}, eslint);

if (!defaultEslintConfig.overrides) {
  defaultEslintConfig.overrides = [];
}

// Recommended security practices eslint config
module.exports = deepmerge(defaultEslintConfig, {
  plugins: ['@iceworks/security-practices'],
  overrides: [
    {
      files: ['package.json'],
      processor: '@iceworks/security-practices/.json',
      rules: {
        quotes: 'off',
        '@iceworks/security-practices/no-patent-licenses': 'warn',
      },
    },
  ],
  rules: {
    'react/react-in-jsx-scope': 'off', // For rax
    '@iceworks/security-practices/no-http-url': 'warn',
    '@iceworks/security-practices/no-internal-url': ['warn', ['taobao.net']],
    '@iceworks/security-practices/no-secret-info': 'error',
    '@iceworks/security-practices/no-sensitive-word': ['warn', ['fuck']],
  },
});
