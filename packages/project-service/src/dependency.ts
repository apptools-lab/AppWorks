import { getProjectFramework } from '@iceworks/project-utils';
import { getPackageLocalVersion } from 'ice-npm-utils';
import latestVersion from 'latest-version';
// import * as fsExtra from 'fs-extra';
// import * as path from 'path';
import { getDataFromSettingJson } from '@iceworks/common-service';
import packageJSON from 'package-json';
import { projectPath } from './constant';
import { getProjectPackageJSON } from './utils';

export async function getCoreDependencies() {
  const framwork = await getProjectFramework(projectPath);
  const iceCoreDeps = [
    'react', 'ice.js',
  ];
  const raxCoreDeps = [
    'rax', 'rax-app',
  ];
  let coreDeps = [];
  if (framwork === 'rax-app') {
    coreDeps = raxCoreDeps;
  } else if (framwork === 'icejs') {
    coreDeps = iceCoreDeps;
  }

  return await Promise.all(coreDeps.map(async (dep) => await getLocalDependencyInfo(dep)));
}

export async function getComponentDependencies() {
  const framwork = await getProjectFramework(projectPath);
  async function checkIsReactComponent(packageName) {
    const peerDependencies = await getPackagePeerDependencies(packageName);
    return peerDependencies && peerDependencies.react;
  }
  async function checkIsRaxComponent(packageName) {
    const peerDependencies = await getPackagePeerDependencies(packageName);
    return peerDependencies && peerDependencies.rax;
  }
  // eslint-disable-next-line
  let checkIsComponent = async (packageName: string) => false;
  if (framwork === 'rax-app') {
    checkIsComponent = checkIsReactComponent;
  } else if (framwork === 'icejs') {
    checkIsComponent = checkIsRaxComponent;
  }

  const { devDependencies, dependencies } = await getProjectPackageJSON();
  const allDeps = { ...devDependencies, ...dependencies };
  return await Promise.all(
    Object.keys(allDeps)
      .filter(async (dep) => await checkIsComponent(dep))
      .map(async (dep) => await getLocalDependencyInfo(dep)),
  );
}

export async function getPluginDependencies() {
  async function checkIsPlugin(packageName: string) {
    const peerDependencies = await getPackagePeerDependencies(packageName);
    return (peerDependencies && peerDependencies['@alib/build-scripts']) ||
      packageName.startsWith('build-plugin-') ||
      packageName.startsWith('@ali/build-plugin-');
  }

  const { devDependencies, dependencies } = await getProjectPackageJSON();
  const allDeps = { ...devDependencies, ...dependencies };
  return await Promise.all(
    Object.keys(allDeps)
      .filter(async (dep) => await checkIsPlugin(dep))
      .map(async (dep) => await getLocalDependencyInfo(dep)),
  );
}

export async function getLocalDependencyInfo(moduleName) {
  const version = getLocalDependencyVersion(moduleName);
  let outdated = false;
  if (version === defaultVersion) {
    // when the package version is defaultVersion, don't show the outdated
    outdated = false;
  } else {
    outdated = await getNpmOutdated(moduleName, version);
  }

  return {
    name: moduleName,
    version,
    outdated,
  };
}

async function getPackagePeerDependencies(packageName) {
  const { peerDependencies } = await packageJSON(packageName, { version: 'latest', registryUrl: getDataFromSettingJson('npmRegistry') });
  // const packageJsonPath = path.join(projectPath, 'node_modules', packageName, 'package.json');
  // const { peerDependencies } = await fsExtra.readJson(packageJsonPath);
  return peerDependencies as any;
}

const defaultVersion = '-';
function getLocalDependencyVersion(moduleName: string): string {
  try {
    const version = getPackageLocalVersion(projectPath, moduleName);
    return version;
  } catch (err) {
    return defaultVersion; // when the package version is not found, it shows defaultVersion
  }
}

async function getNpmOutdated(moduleName: string, version: string) {
  try {
    const latest = await latestVersion(moduleName);
    return version !== latest;
  } catch (err) {
    return false;
  }
}
