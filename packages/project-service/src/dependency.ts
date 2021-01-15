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

  const deps = await Promise.all(coreDeps.map(async (dep) => {
    const info = await getLocalDependencyInfo(dep);
    return info;
  }));
  return deps;
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
    checkIsComponent = checkIsRaxComponent;
  } else if (framwork === 'icejs') {
    checkIsComponent = checkIsReactComponent;
  }

  const { dependencies } = await getProjectPackageJSON();
  const componentDeps = (await Promise.all(
    Object.keys(dependencies)
      .map(async (dep) => {
        const isComponent = await checkIsComponent(dep);
        return { name: dep, value: dependencies[dep], isComponent };
      }),
  )).filter(({ isComponent }) => isComponent);
  const depInfos = await Promise.all(
    componentDeps.map(async ({ name }) => {
      const info = await getLocalDependencyInfo(name);
      return info;
    }),
  );
  return depInfos;
}

export async function getPluginDependencies() {
  async function checkIsPlugin(packageName: string) {
    const peerDependencies = await getPackagePeerDependencies(packageName);
    return (peerDependencies && peerDependencies['@alib/build-scripts']) ||
      packageName.startsWith('build-plugin-') ||
      packageName.startsWith('@ali/build-plugin-');
  }

  const { devDependencies } = await getProjectPackageJSON();
  const pluginDeps = (await Promise.all(
    Object.keys(devDependencies)
      .map(async (dep) => {
        const isPlugin = await checkIsPlugin(dep);
        return { name: dep, value: devDependencies[dep], isPlugin };
      }),
  )).filter(({ isPlugin }) => isPlugin);
  const deps = await Promise.all(
    pluginDeps.map(async ({ name }) => {
      const info = await getLocalDependencyInfo(name);
      return info;
    }),
  );
  return deps;
}

/**
 * TODO better return latest compatible version
 */
export async function getLocalDependencyInfo(moduleName) {
  const version = getLocalDependencyVersion(moduleName);
  let outdated = '';
  if (version !== defaultVersion) {
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
    return version !== latest ? latest : '';
  } catch (err) {
    return '';
  }
}
