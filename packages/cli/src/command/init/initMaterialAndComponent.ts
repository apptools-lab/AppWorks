/* eslint-disable @typescript-eslint/indent */
/**
 * init material&component
 *
 * init material:
 *  1. download npm（不转换文件名）
 *  2. ask and generate pkg/readme/lint files（转换文件名）
 *  3. add block（转换文件名，具体参考 addSingleMaterial）
 *
 * init component:
 *  1. download npm
 *  2. add component（转换文件名，具体参考 addSingleMaterial）
 */
import * as path from 'path';
import * as fse from 'fs-extra';
import * as chalk from 'chalk';
import * as inquirer from 'inquirer';
import { checkAliInternal } from 'ice-npm-utils';
import { downloadMaterialTemplate } from '@iceworks/generate-material';

import addSingleMaterial from './addSingleMaterial';
import ejsRenderDir from './ejsRenderDir';
import generateNpmName from './generateNpmName';
import getNpmRegistry from '../../utils/getNpmRegistry';
import log from '../../utils/log';
import { TEMP_PATH } from '../../utils/constants';

interface IOptions {
  cwd: string;
  projectType: string;
  template: string;
  templateFramework: string;
  templateLanguage: string;
}

export default async function ({
  cwd,
  projectType,
  template,
  templateFramework,
  templateLanguage,
}: IOptions): Promise<void> {
  log.verbose('initMaterialAndComponent', projectType, template);

  const registry = await getNpmRegistry(template, null, null, true);
  const tempMaterialDir = TEMP_PATH;

  await downloadMaterialTemplate(tempMaterialDir, template, registry);
  const templatePkg = await fse.readJson(path.join(tempMaterialDir, 'package.json'));
  const { npmScope, projectName, description } = await initMaterialAsk(cwd, projectType);

  if (projectType === 'material') {
    // 1. 生成根目录文件 package.json/README/eslint 等
    const npmName = generateNpmName(projectName, npmScope);
    const templatePath = path.join(__dirname, '../../template/initMaterial');

    const tempRootFilesDir = path.join(tempMaterialDir, 'temp');
    await fse.copy(templatePath, tempRootFilesDir);
    if (templateLanguage !== 'ts') {
      await fse.remove(path.join(tempRootFilesDir, 'tsconfig.json'));
    }

    await ejsRenderDir(tempRootFilesDir, {
      npmName,
      description,
      template,
      templateFramework,
      templateLanguage,
      version: '0.1.0',
      materialConfig: templatePkg.materialConfig,
    });
    await fse.copy(tempRootFilesDir, cwd);

    // 2. add block
    await Promise.all(
      ['block'].map((item) => {
        return addSingleMaterial({
          materialDir: tempMaterialDir,
          cwd,
          useDefaultOptions: true,
          npmScope,
          materialType: item,
          projectType,
        });
      }),
    );
    console.log(`
      Initialize material successfully!
      Inside that directory, you can run several commands:

        Install dependencies
      ${chalk.cyan('    npm install')}

        Starts the block development server.
      ${chalk.cyan('    cd blocks/ExampleBlock')}
      ${chalk.cyan('    npm install')}
      ${chalk.cyan('    npm start')}

        Generate materials json.
      ${chalk.cyan('    npm run generate')}

        You can upload the JSON file to a static web server and put the URL at appworks settings panel.
        You will see your materials in appworks

        We suggest that you can sync the materials json to fusion.design by run:
      ${chalk.cyan('    npm run sync')}

      Happy hacking!
    `);
    console.log();
  } else if (projectType === 'component') {
    // add component
    await addSingleMaterial({
      materialDir: tempMaterialDir,
      cwd,
      useDefaultOptions: false,
      npmScope,
      materialType: 'component',
      projectType: 'component',
    });
    console.log();
    console.log('Initialize component successfully.');
    console.log();
    console.log('Starts the development server.');
    console.log();
    console.log(chalk.cyan('    npm install'));
    console.log(chalk.cyan('    npm start'));
    console.log();
  }

  // remove temp dir
  await fse.remove(tempMaterialDir);
}

interface IResult {
  npmScope: string;
  projectName: string;
  description: string;
}

async function initMaterialAsk(cwd, projectType): Promise<IResult> {
  const isInnerNet = await checkAliInternal();
  const result: IResult = {
    npmScope: '',
    projectName: '',
    description: '',
  };

  if (process.env.NODE_ENV === 'unittest') {
    result.projectName = 'test';
    return result;
  }

  const { forInnerNet } = await (isInnerNet
    ? inquirer.prompt([
        {
          type: 'confirm',
          message: '当前处于阿里内网环境，生成只在内网可用的物料',
          name: 'forInnerNet',
        },
      ])
    : { forInnerNet: false });

  const { npmScope } = forInnerNet
    ? await inquirer.prompt([
        {
          type: 'list',
          message: 'please select the npm scope',
          name: 'npmScope',
          default: '@ali',
          choices: ['@ali', '@alife', '@alipay', '@kaola'],
        },
      ])
    : await inquirer.prompt([
        {
          type: 'input',
          message: 'npm scope (eg: @ice)',
          name: 'npmScope',
          validate: (value) => {
            if (value && !/^@/.test(value)) {
              return 'npm scope should starts with @, eg: @ice';
            }
            return true;
          },
        },
      ]);
  result.npmScope = npmScope;

  // 初始化单个组件无需关心
  if (projectType === 'material') {
    const { projectName, description } = await inquirer.prompt([
      {
        type: 'input',
        message: 'materials name',
        name: 'projectName',
        default: path.basename(cwd),
        require: true,
      },
      {
        name: 'description',
        type: 'string',
        label: 'description',
        message: 'description',
        default: 'This is a ice material project',
      },
    ]);
    result.projectName = projectName;
    result.description = description;
  }

  return result;
}
