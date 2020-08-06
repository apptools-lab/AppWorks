import { eslint, deepmerge } from '@ice/spec';

// Sugget security practices eslint config
module.exports = deepmerge(eslint, {
  plugins: ['@iceworks/security-practices'],
  rules: {
    'react/react-in-jsx-scope': 'off', // For rax
    '@iceworks/security-practices/no-bsd-licenses': 'warn',
    '@iceworks/security-practices/no-http-url': 'warn',
    '@iceworks/security-practices/no-internal-url': ['warn', ['taobao.net']],
    '@iceworks/security-practices/no-secret-info': 'error',
    '@iceworks/security-practices/no-sensitive-word': ['warn', ['fuck']],
  },
});
