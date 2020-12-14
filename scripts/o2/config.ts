export const isBeta = !process.env.CI; // CI is true when running in GitHub action
export const pushExtension2NPM = false;
export const extensions4pack = [
  'iceworks-team.iceworks-app',
  'iceworks-team.iceworks-config-helper',
  'iceworks-team.iceworks-material-helper',
  'iceworks-team.iceworks-style-helper',
  'iceworks-team.iceworks-ui-builder',
  'iceworks-team.iceworks-time-master',
  // 'iceworks-team.iceworks-doctor',
  // 'iceworks-team.iceworks-project-creator',
];
export const packages4pack = [
  {
    packageName: '@ali/publish-visual',
    isActiveNode: true,
    isActiveBrowser: true,
  },
];
export const npmRegistry = process.env.REGISTRY ? process.env.REGISTRY : 'https://registry.npm.alibaba-inc.com';
