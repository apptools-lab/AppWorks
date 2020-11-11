import axios from 'axios';
import * as path from 'path';
import * as fsExtra from 'fs-extra';
import generateBuildConfig from './utils/generateBuildConfig';
import generateLayoutConfig from './utils/generateLayoutConfig';
import generateMenuConfig from './utils/generateMenuConfig';

const Generator = require('ice-scaffold-generator');

export async function getAll(source: string) {
  const response = await axios.get(source);
  return response.data.scaffolds;
}

export async function generate(scaffoldField) {
  const { projectPath, projectName, scaffold } = scaffoldField;
  const projectDir = path.join(projectPath, projectName);
  const scaffoldJSONPath = path.join(projectDir, '.template', 'scaffold.json');
  await fsExtra.ensureFile(scaffoldJSONPath);

  console.log('scaffold ==>', scaffold);

  const buildConfig = await generateBuildConfig(scaffold.build || {});
  const layoutsConfig = generateLayoutConfig(scaffold.layout);
  const { menu, routers } = generateMenuConfig(scaffold.menu);

  const pkgData = {
    name: projectName,
    version: '0.1.0',
    description: '',
    scaffoldConfig: {
      name: projectName,
      title: projectName,
    },
  };

  const scaffoldConfig = {
    pkgData,
    build: buildConfig,
    layouts: layoutsConfig,
    menu,
    routers,
  };

  // generate advance config
  const { advance } = scaffold;
  if (advance) {
    Object.keys(advance).forEach(item => {
      scaffoldConfig[item] = advance[item];
    });
  }

  fsExtra.writeJsonSync(scaffoldJSONPath, scaffoldConfig, { spaces: 2 });
  // .template 目录的路径
  const templatePath = path.join(projectDir, '.template');

  console.log('generate scaffold in', projectDir);

  const scaffoldGenerator = new Generator({
    rootDir: projectDir,
    template: templatePath,
    useLocalBlocks: false,
  });
  await scaffoldGenerator.init();

  return projectDir;
}
// test
// const projectDir = '/Users/luhc228/workspace/test';
// const projectName = 'Page13';
// const data = { name: 'customScaffold', theme: '@alifd/theme-design-pro', config: ['typescript'], asideMenu: [{ pageName: 'Page1', path: '/page1', blocks: [{ appId: null, baseUrl: 'https://mc.fusion.design/unpkg/icejs-login-form-demo@0.1.0/', browses: 79, bu: null, buCount: 0, category: 'Form', componentLibrary: 1, configure: null, dependencies: { '@alifd/next': '^1.20.16', '@alifd/theme-button': '^0.1.2', 'core-js': '^3.6.5', 'prop-types': '^15.5.8' }, description: '简单的登录表单', designable: 0, devMode: 2, downloads: 0, errorMessage: null, extends: null, gmtCreate: '2020-06-30T06:09:19.000Z', gmtModified: '2020-07-02T03:19:42.000Z', homepage: 'https://mc.fusion.design/unpkg/icejs-login-form-demo@0.1.0/build/index.html', id: 807, jsLibrary: 1, level: 1, materialSchema: null, name: 'LoginForm', npm: 'icejs-login-form-demo', owners: null, packageId: null, platform: 1, projectCount: 0, registry: '', relateId: null, repository: null, reuseScore: 0, score: 0, screenshot: 'https://mc.fusion.design/unpkg/icejs-login-form-demo@0.1.0/screenshot.png', seed: null, source: { author: null, npm: 'icejs-login-form-demo', registry: '', version: '0.1.0', type: 'npm' }, standardScore: 0, stars: 0, tags: null, team: null, teamCount: 0, title: '简单的登录表单', type: 2, userScore: 0, version: '0.1.0', views: false, updateTime: '2020-07-02T03:19:42.000Z', publishTime: '2020-06-30T06:09:19.000Z', categories: ['Form'] }] }], headerMenu: [], layouts: ['branding', 'headerAvatar', 'footer'] };

// generateScaffold({ projectPath: projectDir, projectName, scaffold: data });

