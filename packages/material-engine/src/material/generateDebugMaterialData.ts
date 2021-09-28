import * as fse from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import * as BluebirdPromise from 'bluebird';
import { IMaterialData } from '@appworks/material-utils';
import { DEBUG_PREFIX } from './constants';
import { getProjectLanguageType } from '@appworks/project-service';
import * as imageToBase64 from 'image-to-base64';

export default async function generateDebugMaterialData(materialPath: string): Promise<IMaterialData> {
  const isPathExists = await fse.pathExists(materialPath);
  if (!isPathExists) {
    throw new Error(`${materialPath} does not exists`);
  }
  const materialPkgPath = path.join(materialPath, 'package.json');
  const { materialConfig } = await fse.readJSON(materialPkgPath);
  if (!materialConfig) {
    throw new Error(`${materialPath} is not a material folder!`);
  }

  const pkg = await fse.readJson(materialPkgPath);
  const [blocks, components, scaffolds, pages] = await Promise.all(
    ['block', 'component', 'scaffold', 'page'].map((item) => {
      return globMaterials(materialPath, item);
    }),
  );
  // @ts-ignore
  const allMaterials = [].concat(blocks).concat(components).concat(scaffolds).concat(pages);

  const concurrency = Number(process.env.CONCURRENCY) || 30;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let index = 0;
  let materialsData = [];

  try {
    materialsData = await BluebirdPromise.map(
      allMaterials,
      (materialItem) => {
        return generateMaterialData(materialItem.pkgPath, materialItem.materialType)
          .then((data) => {
            index += 1;
            return data;
          });
      },
      {
        concurrency,
      },
    );
  } catch (err) {
    console.error(err);
  }

  const blocksData: any[] = [];
  const componentsData: any[] = [];
  const scaffoldsData: any[] = [];
  const pagesData: any[] = [];
  materialsData.forEach((item) => {
    const { materialType, materialData } = item;
    if (materialType === 'block') {
      blocksData.push(materialData);
    } else if (materialType === 'component') {
      componentsData.push(materialData);
    } else if (materialType === 'scaffold') {
      scaffoldsData.push(materialData);
    } else if (materialType === 'page') {
      pagesData.push(materialData);
    }
  });

  const debugMaterialData = {
    ...materialConfig,
    name: `${DEBUG_PREFIX}${pkg.name}`,
    description: pkg.description,
    homepage: pkg.homepage || 'debugPage',
    author: pkg.author,
    blocks: blocksData,
    components: componentsData,
    scaffolds: scaffoldsData,
    pages: pagesData,
  };

  return debugMaterialData;
}

function globMaterials(materialDir: string, materialType: string) {
  return new Promise((resolve, reject) => {
    glob(
      `${materialType}s/*/package.json`,
      {
        cwd: materialDir,
        nodir: true,
      },
      (err, files) => {
        if (err) {
          reject(err);
        } else {
          const data = files.map((item) => {
            return {
              pkgPath: path.join(materialDir, item),
              materialType,
            };
          });
          resolve(data);
        }
      },
    );
  });
}

async function generateMaterialData(pkgPath: string, materialType: string) {
  const projectPath = path.dirname(pkgPath);
  const pkg = await fse.readJson(pkgPath);

  const materialItem = pkg[`${materialType}Config`] || {};

  const screenshot = materialItem.screenshot
    || materialItem.snapshot
    || (fse.existsSync(path.join(projectPath, 'screenshot.png')) && `data:image/png;base64,${await imageToBase64(path.join(projectPath, 'screenshot.png'))}`)
    || (fse.existsSync(path.join(projectPath, 'screenshot.jpg')) && `data:image/png;base64,${await imageToBase64(path.join(projectPath, 'screenshot.jgg'))}`)
    || '';

  const screenshots = materialItem.screenshots || (screenshot && [screenshot]);

  const { categories: originCategories, category: originCategory } = materialItem;
  // categories 字段：即将废弃，但是展示端还依赖该字段，因此短期内不能删除，同时需要兼容新的物料无 categories 字段
  const categories = originCategories || (originCategory ? [originCategory] : []);
  // category 字段：兼容老的物料无 category 字段
  const category = originCategory || ((originCategories && originCategories[0]) ? originCategories[0] : '');

  let languageType = 'js';
  try {
    languageType = await getProjectLanguageType();
  } catch (err) {
    // ignore
  }

  const materialData = {
    // 允许（但不推荐）自定义单个物料的数据
    ...materialItem,
    name: materialItem.name,
    title: materialItem.title,
    description: pkg.description,
    languageType,
    homepage: 'localhost:3333',
    categories,
    category,
    repository: (pkg.repository && pkg.repository.url) || pkg.repository,
    source: {
      type: 'debug',
      version: pkg.version,
      author: pkg.author,
      path: path.join(pkgPath, '../'),
    },
    dependencies: pkg.dependencies || {},
    screenshot,
    screenshots,
    publishTime: new Date('2020/1/1'),
    updateTime: new Date('2020/1/1'),
  };

  if (materialItem === 'block') {
    // iceworks 2.x 依赖该字段，下个版本删除
    materialData.source.sourceCodeDirectory = 'src/';
  }

  return { materialData, materialType };
}

