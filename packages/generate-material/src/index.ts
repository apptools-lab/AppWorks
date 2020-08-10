import * as ora from 'ora';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as camelcase from 'camelcase';
import { getNpmTarball, getAndExtractTarball } from 'ice-npm-utils';

import ejsRenderDir from './ejsRenderDir';
import formatProject from './formatProject';

export interface ITemplateOptions {
  npmName: string; // @icedesign/ice-label
  name?: string; // ice-label (english and variable)
  kebabCaseName?: string; // ice-label
  npmScope?: string; // @icedesign
  title?: string; //
  description?: string;
  className?: string;
  version?: string;
  category?: string;
  // web, miniapp...
  projectTargets?: string[];
  adapter?: boolean;
}

export interface IOptions {
  rootDir: string;
  // template npmName or relative path
  template: string;
  registry?: string;
  templateOptions: ITemplateOptions;
  enablePegasus?: boolean;
  enableDefPublish?: boolean;
  materialType?: 'component' | 'block' | 'scaffold';
  disbaleDownloadTemplate?: boolean;
}

/**
 * init component by template
 */
export async function generateMaterial({
  rootDir,
  template,
  registry,
  templateOptions,
  enablePegasus,
  enableDefPublish,
  materialType = 'component',
  disbaleDownloadTemplate,
}: IOptions): Promise<void> {
  const templateTmpDir = disbaleDownloadTemplate ? template: path.join(rootDir, '.tmp');
  if (!disbaleDownloadTemplate) {
    await downloadMaterialTemplate(templateTmpDir, template, registry);
  }

  const templateTmpComponentDir = path.join(templateTmpDir, 'template', materialType);
  if (!fse.existsSync(templateTmpComponentDir)) {
    throw new Error(`当前物料模板不存在 ${materialType} 类型的物料`);
  }

  // generate files by template
  const { npmName } = templateOptions;
  const name = /^@/.test(npmName) ? npmName.split('/')[1] : npmName;
  const npmScope = /^@/.test(npmName) ? npmName.split('/')[0] : '';

  const options: ITemplateOptions = {
    name,
    kebabCaseName: name,
    npmScope,
    title: '示例组件',
    description: '这个组件的功能是 balabala',
    className: camelcase(name, { pascalCase: true }),
    version: '0.1.0',
    category: '',
    projectTargets: ['web'],
    adapter: false,
    ...templateOptions,
  };
  // TODO: scaffold 不转换某些类型
  await ejsRenderDir(templateTmpComponentDir, options);

  await fse.copy(templateTmpComponentDir, rootDir);
  await fse.remove(templateTmpDir);

  try {
    await formatProject({
      rootDir,
      templateOptions,
      enablePegasus,
      enableDefPublish,
      materialType,
    });
  } catch (err) {
    console.warn('[Warning] formatProject error', err.message);
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

export async function downloadMaterialTemplate(dir: string, template: string, registry?: string): Promise<void> {
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
