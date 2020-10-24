import axios from 'axios';
import * as path from 'path';
import * as fsExtra from 'fs-extra';
import * as rimraf from 'rimraf';
import generateLayoutConfig from './utils/generateLayoutConfig';

const Generator = require('ice-scaffold-generator');

export async function getAll(source: string) {
  const response = await axios.get(source);
  return response.data.scaffolds;
}

export async function generateScaffold(projectDir: string, projectName: string, scaffold: any) {
  const scaffoldJSONPath = path.join(projectDir, '.template', 'scaffold.json');
  await fsExtra.ensureFile(scaffoldJSONPath);

  const { theme } = scaffold;

  const build = {
    theme: { package: theme, version: 'latest' },
  };

  const pkgData = {
    name: projectName,
    version: '0.1.0',
    description: '',
    scaffoldConfig: {
      name: projectName,
      title: projectName,
    },
  };

  const layouts = generateLayoutConfig(scaffold.layouts);

  const asideMenu = [];
  const headerMenu = [];
  const basicLayoutRouter = { path: '/', component: 'BasicLayout', children: [] };
  if (scaffold.asideMenu) {
    scaffold.asideMenu.forEach(item => {
      asideMenu.push({ name: item.pageName, path: item.path });
      basicLayoutRouter.children.push({
        path: item.path,
        exact: true,
        page: {
          name: item.pageName,
          blocks: {
            packages: item.blocks.map(block => block.source.npm),
          },
        },
      });
    });
  }
  if (scaffold.headerMenu) {
    scaffold.headerMenu.forEach(item => {
      headerMenu.push({ name: item.pageName, path: item.path });
      basicLayoutRouter.children.push({
        path: item.path,
        exact: true,
        page: {
          name: item.pageName,
          blocks: {
            packages: item.blocks.map(block => block.source.npm),
          },
        },
      });
    });
  }
  const scaffoldConfig = {
    pkgData,
    build,
    layouts,
    menu: { asideMenu, headerMenu },
    routers: [basicLayoutRouter],

  };
  if (scaffold.config && scaffold.config instanceof Array) {
    scaffold.config.forEach(item => { scaffoldConfig[item] = true; });
  }
  fsExtra.writeJsonSync(scaffoldJSONPath, scaffoldConfig, { spaces: 2 });

  // .template 目录的路径
  const templatePath = path.join(projectDir, '.template');
  rimraf.sync(path.join(projectDir, '!(template|node_modules|tmp)'));

  console.log('generate scaffold in', projectDir);
  const generate = new Generator({
    rootDir: projectDir,
    template: templatePath,
    useLocalBlocks: false,
  });
  await generate.init();
}
// test
// const projectDir = '/Users/luhc228/workspace/test', projectName = 'Page13';
// createScaffold();

