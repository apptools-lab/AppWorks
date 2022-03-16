import * as ora from 'ora';
import { isAliNpm, getNpmTarball, getAndExtractTarball } from 'ice-npm-utils';
import { ALI_NPM_REGISTRY } from '@appworks/constant';
import formatProject from './formatProject';
import checkEmpty from './checkEmpty';
import formatScaffoldToProject from './formatScaffoldToProject';

export { formatProject, checkEmpty, formatScaffoldToProject };

export interface IEjsOptions {
  targets?: string[];
  miniappType?: 'runtime' | 'compile';
  mpa?: boolean;
  pha?: boolean;
}

export async function downloadAndGenerateProject(
  projectDir: string,
  npmName: string,
  version?: string,
  registry?: string,
  projectName?: string,
  ejsOptions?: IEjsOptions,
): Promise<void> {
  registry = registry || (await getNpmRegistry(npmName));

  // 根据模板创建项目支持的参数
  ejsOptions = {
    targets: ['web'],
    miniappType: 'runtime',
    mpa: false,
    pha: false,
    ...ejsOptions,
  };

  let tarballURL: string;
  try {
    tarballURL = await getNpmTarball(npmName, version || 'latest', registry);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return Promise.reject(new Error(`获取模板 npm 信息失败，当前的模板地址是：${registry}/${npmName}。`));
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
    await formatScaffoldToProject(projectDir, projectName, ejsOptions);
  } catch (err) {
    console.warn('format scaffold to project error', err.message);
  }
}

async function getNpmRegistry(npmName: string): Promise<string> {
  if (process.env.REGISTRY) {
    return process.env.REGISTRY;
  } else if (isAliNpm(npmName)) {
    return ALI_NPM_REGISTRY;
  } else {
    return 'https://registry.npm.taobao.org';
  }
}
