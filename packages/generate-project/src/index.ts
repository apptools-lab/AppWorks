import { isAliNpm, getNpmTarball, getAndExtractTarball } from 'ice-npm-utils';
import { ALI_NPM_REGISTRY } from '@appworks/constant';
import formatProject from './writeAbcJson';
import checkEmpty from './checkEmpty';
import formatScaffoldToProject from './formatScaffoldToProject';
import type { ExtraDependencies } from './addDependenciesToPkgJson';

import ora = require('ora');

export { formatProject, checkEmpty, formatScaffoldToProject };

interface Options {
  version?: string;
  registry?: string;
  projectName?: string;
  extraDependencies?: ExtraDependencies;
  ejsOptions?: Record<string, any>;
}

export async function downloadAndGenerateProject(
  projectDir: string,
  scaffoldNpmName: string,
  {
    version,
    registry,
    extraDependencies,
    projectName,
    ejsOptions,
  }: Options,
): Promise<void> {
  registry = registry || (await getNpmRegistry(scaffoldNpmName));

  let tarballURL: string;
  try {
    tarballURL = await getNpmTarball(scaffoldNpmName, version || 'latest', registry);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return Promise.reject(new Error(`获取模板 npm 信息失败，当前的模板地址是：${registry}/${scaffoldNpmName}。`));
    } else {
      return Promise.reject(error);
    }
  }

  console.log('download tarballURL', tarballURL);

  const spinner = ora('download npm tarball start').start();
  await getAndExtractTarball(
    projectDir,
    tarballURL,
    (state) => {
      spinner.text = `download npm tarball progress: ${Math.floor(state.percent * 100)}%`;
    },
  );
  spinner.succeed('download npm tarball successfully.');

  try {
    await formatScaffoldToProject(
      projectDir,
      {
        projectName,
        ejsOptions,
        extraDependencies,
      },
    );
  } catch (err) {
    console.warn('format scaffold to project error', err);
  }
}

async function getNpmRegistry(npmName: string): Promise<string> {
  if (process.env.REGISTRY) {
    return process.env.REGISTRY;
  } else if (isAliNpm(npmName)) {
    return ALI_NPM_REGISTRY;
  } else {
    return 'https://registry.npmmirror.com';
  }
}
