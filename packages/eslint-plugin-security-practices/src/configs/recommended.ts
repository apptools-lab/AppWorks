import { eslint, deepmerge } from '@ice/spec';

const defaultEslintConfig = Object.assign({}, eslint);

if (!defaultEslintConfig.overrides) {
  defaultEslintConfig.overrides = [];
}

// Recommended security practices eslint config
const config = deepmerge(defaultEslintConfig, {
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
});

config.plugins = ['@iceworks/security-practices'];

config.rules = {
  'no-unused-vars': 0,
  'react/react-in-jsx-scope': 'off', // For rax
  '@iceworks/security-practices/no-http-url': 'warn',
  '@iceworks/security-practices/no-internal-url': ['warn', ['taobao.net']],
  '@iceworks/security-practices/no-secret-info': 'error',
  '@iceworks/security-practices/no-sensitive-word': ['warn', ['fuck']],
  // Ignore these rules when check security practices.
  // @iceworks/eslint-plugin-best-practices will check
  camelcase: 0,
  'dot-notation': 0,
  indent: 0,
  'no-empty': 0,
  'no-var': 0,
  'no-underscore-dangle': 0,
  'object-shorthand': 0,
  'prefer-template': 0,
  quotes: 0,
  'spaced-comment': 0,
  'vars-on-top': 0,
  'comma-dangle': 0,
  'no-console': 1,
  'no-cond-assign': 0,
  'no-unreachable': 0,
  'no-extra-boolean-cast': 0,
  'no-extra-semi': 0,
};

// Remove rules which is not relevant security
delete config.extends;

module.exports = config;
