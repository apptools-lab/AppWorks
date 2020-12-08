export const isBeta = !process.env.CI;
export const pushExtension2NPM = true;
export const extensions4pack = [
  'iceworks-team.iceworks-app',
  'iceworks-team.iceworks-config-helper',
  'iceworks-team.iceworks-material-helper',
  // 'iceworks-team.iceworks-doctor',
  // 'iceworks-team.iceworks-project-creator',
  'iceworks-team.iceworks-style-helper',
  'iceworks-team.iceworks-ui-builder',
  'iceworks-team.iceworks-time-master',
];
export const npmRegistry = process.env.REGISTRY ? process.env.REGISTRY : 'https://registry.npm.alibaba-inc.com';
