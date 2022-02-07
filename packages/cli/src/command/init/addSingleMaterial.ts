/**
 * material add [block|component|scaffold|page]:
 *  1. get options by materialType
 *  2. copy and ejsRender，文件名称转换：
 *    - _package.json -> package.json
 *    - xxx.js.ejs -> xxx.js
 *    - _eslintxxx -> .eslintxxx (scaffold 不转换)
 *  3. 仅 component：remove eslint 相关文件，只有 component/scaffold 会有这些文件（因为有单独开发的需求）
 *
 * init component:
 *  1. get options by materialType
 *  2. copy and ejsRender，文件名称转换
 *
 */
import * as path from 'path';
import * as fse from 'fs-extra';
import * as inquirer from 'inquirer';
import * as decamelize from 'decamelize';
import * as validateName from 'validate-npm-package-name';
import * as uppercamelcase from 'uppercamelcase';
import { generateMaterial, ITemplateOptions } from '@iceworks/generate-material';

import log from '../../utils/log';
import generateNpmName from './generateNpmName';

export default async function ({
  materialDir, // temp dir
  cwd,
  useDefaultOptions,
  npmScope,
  materialType, // scaffold | block | component | page
  projectType, // material | component
}): Promise<void> {
  log.verbose('addSingleMaterial args', materialDir, cwd, useDefaultOptions, npmScope, materialType);

  const questions = getQuestions(npmScope, cwd)[materialType];
  // eslint-disable-next-line
  let options: ITemplateOptions = {} as ITemplateOptions;

  if (useDefaultOptions || process.env.NODE_ENV === 'unittest') {
    // inquire
    questions.forEach((item) => {
      options[item.name] = item.default;
    });
  } else {
    options = await inquirer.prompt(questions);
  }

  // @ali
  options.npmScope = npmScope;
  // TestComponent
  options.className = options.name;
  // test-component
  options.kebabCaseName = decamelize(options.name, '-');
  // @ali/test-component
  options.npmName = generateNpmName(options.name, npmScope);

  const targetPath = projectType === 'material' ? path.join(cwd, `${materialType}s`, options.name) : cwd;
  await fse.ensureDir(targetPath);

  await generateMaterial({
    rootDir: targetPath,
    templateOptions: options,
    materialTemplateDir: materialDir,
    materialType,
  });

  if (projectType === 'material') {
    // 物料集合场景下需要删除掉物料自身的 eslint 等文件
    await Promise.all(
      ['.eslintignore', '.eslintrc.js', '.stylelintignore', '.stylelintrc.js', '.editorconfig', '.gitignore'].map(
        (filename) => {
          return fse.remove(path.join(targetPath, filename)).catch(() => { });
        },
      ),
    );
  }
}

const COMPONENT_CATEGORIES = [
  'Table',
  'Form',
  'Chart',
  'List',
  'Modal',
  'Filter',
  'DataDisplay',
  'Information',
  'Others',
];

const PAGE_CATEGORIES = ['Basic', 'Others'];

const BLOCK_CATEGORIES = [
  'Table',
  'Form',
  'Chart',
  'List',
  'Modal',
  'Filter',
  'DataDisplay',
  'Information',
  'Exception',
  'Landing',
  'video',
  'Others',
];

const SCAFFOLD_CATEGORIES = ['Basic', 'Pro', 'Others'];

function nameQuestion(type, npmScope, cwd) {
  const defaultName = `Example${uppercamelcase(type)}`;
  return {
    type: 'input',
    name: 'name',
    message: `${type} name`,
    default: defaultName,
    validate: (value) => {
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
        return `Name must be a Upper Camel Case word, e.g. Example${uppercamelcase(type)}.`;
      }
      if (fse.existsSync(path.join(cwd, `${type}s`, value))) {
        return `${value} is exist, please try another name.`;
      }

      const npmName = generateNpmName(value, npmScope);
      if (!validateName(npmName).validForNewPackages) {
        return `NPM package name ${npmName} not validate, please retry`;
      }
      return true;
    },
  };
}

function getQuestions(npmScope, cwd) {
  return {
    component: [
      nameQuestion('component', npmScope, cwd),
      {
        type: 'input',
        name: 'title',
        message: 'title',
        default: 'demo component',
        validate: (value) => {
          if (!value) {
            return 'title cannot be empty';
          }
          return true;
        },
        filter(value) {
          return value.trim();
        },
      },
      {
        type: 'string',
        required: true,
        name: 'version',
        message: 'version',
        default: '1.0.0',
      },
      {
        type: 'string',
        required: true,
        name: 'description',
        message: 'description',
        default: 'intro component',
        filter(value) {
          return value.trim();
        },
        validate: (value) => {
          if (!value) {
            return 'description cannot be empty';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'category',
        message: 'category',
        default: 'Information',
        choices: COMPONENT_CATEGORIES,
        filter: (answer) => {
          return answer;
        },
      },
    ],
    block: [
      nameQuestion('block', npmScope, cwd),
      {
        type: 'input',
        name: 'title',
        message: 'title',
        default: 'demo block',
        filter(value) {
          return value.trim();
        },
        validate: (value) => {
          if (!value) {
            return 'title cannot be empty';
          }
          return true;
        },
      },
      {
        type: 'string',
        required: true,
        name: 'version',
        message: 'version',
        default: '0.1.0',
      },
      {
        type: 'string',
        required: true,
        name: 'description',
        message: 'description',
        default: 'intro block',
        filter(value) {
          return value.trim();
        },
        validate: (value) => {
          if (!value) {
            return 'description cannot be empty';
          }
          return true;
        },
      },
      {
        type: 'list',
        message: 'category',
        name: 'category',
        default: 'Information',
        choices: BLOCK_CATEGORIES,
        validate: (answer) => {
          if (answer.length < 1) {
            return 'It must be at least one';
          }
          return true;
        },
        filter: (answer) => {
          return answer;
        },
      },
    ],
    scaffold: [
      nameQuestion('scaffold', npmScope, cwd),
      {
        type: 'input',
        name: 'title',
        message: 'title',
        default: 'demo scaffold',
        filter(value) {
          return value.trim();
        },
        validate: (value) => {
          if (!value) {
            return 'title cannot be empty';
          }
          return true;
        },
      },
      {
        type: 'string',
        required: true,
        name: 'version',
        message: 'version',
        default: '0.1.0',
      },
      {
        type: 'string',
        required: true,
        name: 'description',
        message: 'description',
        default: 'intro scaffold',
        filter(value) {
          return value.trim();
        },
        validate: (value) => {
          if (!value) {
            return 'description cannot be empty';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'category',
        message: 'category',
        default: 'Basic',
        choices: SCAFFOLD_CATEGORIES,
        filter: (answer) => {
          return answer;
        },
      },
    ],
    page: [
      nameQuestion('page', npmScope, cwd),
      {
        type: 'input',
        name: 'title',
        message: 'title',
        default: 'demo page',
        validate: (value) => {
          if (!value) {
            return 'title cannot be empty';
          }
          return true;
        },
        filter(value) {
          return value.trim();
        },
      },
      {
        type: 'string',
        required: true,
        name: 'version',
        message: 'version',
        default: '1.0.0',
      },
      {
        type: 'string',
        required: true,
        name: 'description',
        message: 'description',
        default: 'intro page',
        filter(value) {
          return value.trim();
        },
        validate: (value) => {
          if (!value) {
            return 'description cannot be empty';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'category',
        message: 'category',
        default: 'Information',
        choices: PAGE_CATEGORIES,
        filter: (answer) => {
          return answer;
        },
      },
    ],
  };
}
