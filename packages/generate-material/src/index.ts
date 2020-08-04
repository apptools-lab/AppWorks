import * as ora from 'ora';
import * as fse from 'fs-extra';
import * as path from 'path';
import {
  isAliNpm, getNpmTarball, getAndExtractTarball
} from 'ice-npm-utils';
import * as decamelize from 'decamelize';

import ejsRenderDir from './ejsRenderDir';


/**
 * iceworks init component
 */
export async function generateComponent() {

}

/**
 * iceworks add block
 */
export async function addSingleMaterial() {

}

interface IOptions {
  projectDir: string;
  // template npmName
  template: string;
  type: 'material-collection' | 'component';
  registry?: string;
  templateOptions?: templateOptions;
};

interface templateOptions {
  aliInternal: boolean;
  npmScope?: '@ali' | '@alife' | '@alipay' | '@kaola' | string;
  // material collection
  projectName: string;
  description?: string;
  // component
};

/**
 * iceworks init material
 */
export async function generateMaterial({
  projectDir, template, registry, templateOptions
}: IOptions): Promise<void> {
  registry = registry || await getNpmRegistry(template);

  const templateTmpDir = path.join(projectDir, '.tmp');
  await downloadMaterialTemplate(templateDir, template, registry);

  const templatePkg = await fse.readJson(path.join(templateDir, 'package.json'));
  const { npmScope, projectName, description = '' } = templateOptions;

  const npmName = generateNpmName(projectName, npmScope);

  // copy .eslintrc and so on
  const templatePath = path.join(__dirname, '../../template/initMaterial');
  await fse.copy(templatePath, projectDir);

  // generate files by template
  await ejsRenderDir(projectDir, {
    npmName, description, template,
    version: '0.1.0',
    materialConfig: templatePkg.materialConfig,
  });

  fse.removeSync(templateTmpDir);

  const { npmScope, projectName, description } = await initMaterialAsk(cwd, projectType);


  // 根据模板创建项目支持的参数
  ejsOptions = {
    targets: ['web'],
    miniappType: 'runtime',
    mpa: false,
    ...ejsOptions
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
    formatFilename
  );
  spinner.succeed('download npm tarball successfully.');

  await ejsRenderDir(projectDir, ejsOptions);

  try {
    await formatProject(projectDir, projectName);
  } catch (err) {
    console.warn('formatProject error', err.message);
  }
};

async function getNpmRegistry(npmName: string): Promise<string> {
  if (process.env.REGISTRY) {
    return process.env.REGISTRY;
  } else if (isAliNpm(npmName)) {
    return 'https://registry.npm.alibaba-inc.com';
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

async function downloadMaterialTemplate(dir: string, template: string, registry: string): Promise<void> {
  await fse.emptyDir(dir);

  const isLocalPath = /^[./]|(^[a-zA-Z]:)/.test(template);
  if (isLocalPath) {
    await fse.copy(template, dir);
  } else {
    const tarballURL = await getNpmTarball(template, 'latest', registry);
    console.log('download template tarball', tarballURL);
    const spinner = ora('download npm tarball start').start();
    await getAndExtractTarball(
      dir,
      tarballURL,
      (state) => {
        spinner.text = `download npm tarball progress: ${Math.floor(state.percent * 100)}%`;
      },
      formatFilename
    );
    spinner.succeed('download npm tarball successfully.');
  }
}


function generateNpmName(name: string, npmScope?: string): string {
  // WebkitTransform -> webkit-transform
  name = decamelize(name, '-');
  return npmScope ? `${npmScope}/${name}` : name;
};
