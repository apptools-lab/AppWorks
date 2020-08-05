const repoUrl = 'https://github.com/ice-lab/iceworks/tree/master/packages/eslint-plugin-security-practices';

export default function docsUrl(ruleName: string) {
  return `${repoUrl}/docs/rules/${ruleName}.md`;
}
