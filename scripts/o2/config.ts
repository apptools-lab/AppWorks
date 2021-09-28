import * as camelCase from 'lodash.camelcase';

interface OtherExtension {
  packageName: string;
  assetsFolders: string[];
  isActiveNode: boolean;
  isActiveBrowser: boolean;
}

export const isBeta = !process.env.CI; // CI is true when running in GitHub action
export const pushExtension2Npm = false; // modify it to true when publish to tnpm
export const innerExtensions4pack = [
  {
    packageName: 'iceworks-team.iceworks-app',
    assetsFolders: ['assets', 'schemas'],
  },
  {
    packageName: 'iceworks-team.iceworks-config-helper',
    assetsFolders: ['assets', 'schemas'],
  },
  {
    packageName: 'iceworks-team.iceworks-material-helper',
    assetsFolders: ['assets', 'schemas'],
  },
  {
    packageName: 'iceworks-team.iceworks-style-helper',
    assetsFolders: ['assets', 'schemas'],
  },
  {
    packageName: 'iceworks-team.iceworks-time-master',
    assetsFolders: ['assets', 'schemas'],
  },
  {
    packageName: 'iceworks-team.iceworks-refactor',
    assetsFolders: ['assets', 'schemas'],
  },
  {
    packageName: 'iceworks-team.iceworks-generator',
    assetsFolders: ['assets', 'schemas'],
  },
];

const otherExtensions: OtherExtension[] = [
  // add tao.def-basic-kit the to extensionDependencies instead of @ali/publish-visual
  // {
  //   packageName: '@ali/publish-visual',
  //   assetsFolders: ['icons', 'resource'],
  //   isActiveNode: true,
  //   isActiveBrowser: true,
  // },
];

export const otherExtensions4pack = otherExtensions.map((otherExtension4pack) => (
  { ...otherExtension4pack, extensionName: camelCase(otherExtension4pack.packageName), isOther: true }
));

export const npmRegistry = process.env.REGISTRY ? process.env.REGISTRY : 'https://registry.npm.alibaba-inc.com';
