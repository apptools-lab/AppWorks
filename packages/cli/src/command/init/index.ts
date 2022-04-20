import * as inquirer from 'inquirer';
import log from '../../utils/log';
import goldlog from '../../utils/goldlog';
import checkEmpty from '../../utils/checkEmpty';
import initMaterialAndComponent from './initMaterialAndComponent';

interface IOptions {
  rootDir?: string;
  npmName?: string;
  type?: string;
}

interface ITemplate {
  npmName: string;
  description?: String;
  default?: boolean;
  framework: 'rax' | 'react' | 'vue';
  language: 'ts' | 'js';
}

export default async function (options: IOptions = {}): Promise<void> {
  const cwd = options.rootDir || process.cwd();
  let { npmName, type } = options;
  let framework = 'react';
  let language = 'js';

  log.verbose('appworks init options', options as string);

  if (options.type && options.type === 'project') {
    console.log('');
    log.warn('', 'Please use `npm init ice ice-example` init icejs project.');
    console.log('');
    process.exit(-1);
  }

  const go = await checkEmpty(cwd);
  if (!go) process.exit(1);

  if (!options.type) {
    type = await selectType();
  }
  if (!options.npmName) {
    const template = await selectTemplate(type);
    npmName = template.npmName;
    framework = template.framework;
    language = template.language;
  }

  goldlog('init', { npmName, type });
  log.verbose('appworks init', type, npmName);

  await initMaterialAndComponent({
    cwd,
    projectType: type,
    template: npmName,
    templateFramework: framework,
    templateLanguage: language,
  });
}

/**
 * 选择初始项目类型
 */
async function selectType(): Promise<string> {
  const DEFAULT_TYPE = 'material';
  return inquirer
    .prompt({
      type: 'list',
      name: 'type',
      message: 'Please select a type',
      default: DEFAULT_TYPE,
      choices: [
        {
          name: 'material collection(component&scaffold&block)',
          value: 'material',
        },
        {
          name: 'component',
          value: 'component',
        },
      ],
    })
    .then((answer) => answer.type);
}

/**
 * 选择使用的模板
 *
 * @param {String} type project|material|component
 */
async function selectTemplate(type: string): Promise<ITemplate> {
  // 针对不同 init 类型的内置模板
  const typeToTemplates = {
    material: [
      {
        npmName: '@icedesign/ice-react-ts-material-template',
        description: 'React + TypeScript',
        default: true,
        framework: 'react',
        language: 'ts',
      },
      {
        npmName: '@icedesign/ice-react-material-template',
        description: 'React + JavaScript',
        framework: 'react',
        language: 'js',
      },
      {
        npmName: '@icedesign/template-rax',
        description: 'Rax + TypeScript',
        framework: 'rax',
        language: 'ts',
      },
    ],
    component: [
      {
        npmName: '@icedesign/ice-react-ts-material-template',
        description: 'React + TypeScript',
        default: true,
        framework: 'react',
        language: 'ts',
      },
      {
        npmName: '@icedesign/ice-react-material-template',
        description: 'React + JavaScript',
        framework: 'react',
        language: 'js',
      },
      {
        npmName: '@icedesign/template-rax',
        description: 'Rax + TypeScript',
        framework: 'rax',
        language: 'ts',
      },
      {
        npmName: '@icedesign/template-rax-js',
        description: 'Rax + JavaScript',
        framework: 'rax',
        language: 'js',
      },
    ],
  };
  const templates = typeToTemplates[type] as ITemplate[];
  const defaultTemplate = templates.find((item) => item.default === true);

  return inquirer
    .prompt({
      type: 'list',
      name: 'template',
      message: 'Please select a template',
      default: defaultTemplate,
      choices: templates.map((item) => {
        return {
          name: item.description,
          value: item,
        };
      }),
    })
    .then((answer) => answer.template);
}
