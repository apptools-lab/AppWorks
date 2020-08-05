import { eslint, deepmerge } from '@ice/spec';

// Sugget security practices eslint config
module.exports = deepmerge(eslint, {
  plugins: ['@iceworks/security-practices'],
  rules: {
    'react/react-in-jsx-scope': 'off', // For rax
    '@iceworks/security-practices/no-http-url': 'warn'
  }
});
