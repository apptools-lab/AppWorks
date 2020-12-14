import * as camelCase from 'lodash.camelcase';

export const isBeta = !process.env.CI; // CI is true when running in GitHub action
export const pushExtension2NPM = false;
export const innerExtensions4pack = [
  {
    packageName: 'iceworks-team.iceworks-app',
    assetsFolders: ['assetsFolders', 'schemas'],
  },
  {
    packageName: 'iceworks-team.iceworks-config-helper',
    assetsFolders: ['assetsFolders', 'schemas'],
  },
  {
    packageName: 'iceworks-team.iceworks-material-helper',
    assetsFolders: ['assetsFolders', 'schemas'],
  },
  {
    packageName: 'iceworks-team.iceworks-style-helper',
    assetsFolders: ['assetsFolders', 'schemas'],
  },
  {
    packageName: 'iceworks-team.iceworks-ui-builder',
    assetsFolders: ['assetsFolders', 'schemas'],
  },
  {
    packageName: 'iceworks-team.iceworks-time-master',
    assetsFolders: ['assetsFolders', 'schemas'],
  },
  // 'iceworks-team.iceworks-doctor',
  // 'iceworks-team.iceworks-project-creator',
];
export const otherExtensions4pack = [
  {

    packageName: '@ali/publish-visual',
    assetsFolders: ['icons', 'resource'],
    isActiveNode: true,
    isActiveBrowser: true,
  },
].map((otherExtension4pack) => ({ ...otherExtension4pack, extensionName: camelCase(otherExtension4pack.packageName), isOther: true }));
export const npmRegistry = process.env.REGISTRY ? process.env.REGISTRY : 'https://registry.npm.alibaba-inc.com';
