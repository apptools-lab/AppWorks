const { getCommitlintConfig } = require('@iceworks/spec');

// getCommitlintConfig(rule: 'rax'|'react'|'vue', customConfig?);
module.exports = getCommitlintConfig('react');