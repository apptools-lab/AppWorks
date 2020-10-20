import axios from 'axios';
import * as path from 'path';
import * as rimraf from 'rimraf';

const Generator = require('ice-scaffold-generator');

export async function getAll(source: string) {
  const response = await axios.get(source);
  return response.data.scaffolds;
}

export async function generateScaffold(projectPath: string) {
  // .template 目录的路径
  const templatePath = path.join(projectPath, '.template');
  rimraf.sync(path.join(projectPath, '!(template|node_modules|tmp)'));

  console.log('generate scaffold in', projectPath);
  try {
    const generate = new Generator({
      rootDir: projectPath,
      template: templatePath,
      useLocalBlocks: false,
    });
    await generate.init();
  } catch (e) {
    console.log('generateScaffold', e);
  }
}

// // 生成 scaffold 项目的路径
const projectPath = path.join('/Users/luhc228/workspace/test/R22');

async function createScaffold() {
  await generateScaffold(projectPath);
}

createScaffold();

