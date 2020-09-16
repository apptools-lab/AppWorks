import * as ora from 'ora';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as camelcase from 'camelcase';
import { getNpmTarball, getAndExtractTarball } from 'ice-npm-utils';

import ejsRenderDir from './ejsRenderDir';
import formatProject from './formatProject';

/**
 * init component by template
 */
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
  adaptor?: boolean;
}

export interface IOptions {
  rootDir: string;
  materialTemplateDir: string;
  templateOptions: ITemplateOptions;
  enablePegasus?: boolean;
  enableDefPublish?: boolean;
  materialType: 'component' | 'block' | 'scaffold';
}

export async function generateMaterial({
  rootDir,
  materialTemplateDir,
  templateOptions,
  enablePegasus,
  enableDefPublish,
  materialType = 'component',
}: IOptions): Promise<void> {
  const templateDir = path.join(materialTemplateDir, 'template', materialType);
  if (!fse.existsSync(templateDir)) {
    throw new Error(`当前物料模板不存在 ${materialType} 类型的物料`);
  }

  const templateTmpDir = path.join(materialTemplateDir, '.tmp');
  await fse.emptyDir(templateTmpDir);
  await fse.copy(templateDir, templateTmpDir);

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
    adaptor: false,
    ...templateOptions,
  };

  await ejsRenderDir(templateTmpDir, options);
  await fse.copy(templateTmpDir, rootDir);
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
      // format filename
      (filename) => {
        if (filename === '_package.json') {
          // 兼容
          filename = 'package.json.ejs';
        }
        return filename;
      },
    );
    spinner.succeed('download npm tarball successfully.');
  }
}
