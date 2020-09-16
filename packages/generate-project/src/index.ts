import * as ora from 'ora';
import { isAliNpm, getNpmTarball, getAndExtractTarball } from 'ice-npm-utils';
import { ALI_NPM_REGISTRY } from '@iceworks/constant';
import ejsRenderDir from './ejsRenderDir';
import formatProject from './fommatProject';
import checkEmpty from './checkEmpty';

export { formatProject, checkEmpty };

export interface IEjsOptions {
  targets?: string[];
  miniappType?: 'runtime' | 'compile';
  mpa?: boolean;
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
    ...ejsOptions,
  };

  let tarballURL: string;
  try {
    tarballURL = await getNpmTarball(npmName, version || 'latest', registry);
  } catch (error) {
    if (error.statusCode === 404) {
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
    formatFilename,
  );
  spinner.succeed('download npm tarball successfully.');

  await ejsRenderDir(projectDir, ejsOptions);

  try {
    await formatProject(projectDir, projectName);
  } catch (err) {
    console.warn('formatProject error', err.message);
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

/**
 * 下载 npm 后的文件名处理
 */
function formatFilename(filename) {
  // 只转换特定文件，防止误伤
  const dotFilenames = [
    '_eslintrc.js',
    '_eslintrc',
    '_eslintignore',
    '_gitignore',
    '_stylelintrc.js',
    '_stylelintrc',
    '_stylelintignore',
    '_editorconfig',
    '_prettierrc.js',
    '_prettierignore',
  ];
  if (dotFilenames.indexOf(filename) !== -1) {
    // _eslintrc.js -> .eslintrc.js
    filename = filename.replace(/^_/, '.');
  }

  return filename;
}
