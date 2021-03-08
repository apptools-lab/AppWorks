import axios from 'axios';
import * as path from 'path';
import * as fsExtra from 'fs-extra';
import { formatScaffoldToProject } from '@iceworks/generate-project';
import generateBuildConfig from './utils/generateBuildConfig';
import generateLayoutConfig from './utils/generateLayoutConfig';
import generateMenuConfig from './utils/generateMenuConfig';

const Generator = require('ice-scaffold-generator');

export async function getAll(source: string) {
  const response = await axios.get(source);
  return response.data.scaffolds;
}

export async function generate(scaffoldField) {
  // generate scaffold.json file
  const { projectPath, projectName, scaffold } = scaffoldField;
  const projectDir = path.join(projectPath, projectName);
  const scaffoldJSONPath = path.join(projectDir, '.template', 'scaffold.json');
  await fsExtra.ensureFile(scaffoldJSONPath);

  const { build = {}, layout = {}, menu = {}, advance = {} } = scaffold;
  const buildConfig = await generateBuildConfig(build);
  const layoutsConfig = generateLayoutConfig(layout);
  const { menuConfig, routersConfig } = generateMenuConfig(menu);

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
    menu: menuConfig,
    routers: routersConfig,
  };

  // generate advance config
  Object.keys(advance).forEach(item => {
    scaffoldConfig[item] = advance[item];
  });

  fsExtra.writeJsonSync(scaffoldJSONPath, scaffoldConfig, { spaces: 2 });
  const templatePath = path.join(projectDir, '.template');

  console.log('generate scaffold in', projectDir);

  const scaffoldGenerator = new Generator({
    rootDir: projectDir,
    template: templatePath,
    useLocalBlocks: false,
  });
  await scaffoldGenerator.init();

  formatScaffoldToProject(projectDir);

  return projectDir;
}
