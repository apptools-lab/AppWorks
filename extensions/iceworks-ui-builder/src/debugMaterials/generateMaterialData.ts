import * as path from 'path';
import * as fse from 'fs-extra';

export default async function generateMaterialData(pkgPath: string, materialType: string) {
  const projectPath = path.dirname(pkgPath);
  const pkg = await fse.readJson(pkgPath);

  const materialItemConfig = pkg[`${materialType}Config`] || {};

  const screenshot = materialItemConfig.screenshot
    || materialItemConfig.snapshot
    || (fse.existsSync(path.join(projectPath, 'screenshot.png')) && path.join(projectPath, 'screenshot.png'))
    || (fse.existsSync(path.join(projectPath, 'screenshot.jpg')) && path.join(projectPath, 'screenshot.jpg'))
    || '';
  const screenshots = materialItemConfig.screenshots || (screenshot && [screenshot]);

  const { categories: originCategories, category: originCategory } = materialItemConfig;
  // categories 字段：即将废弃，但是展示端还依赖该字段，因此短期内不能删除，同时需要兼容新的物料无 categories 字段
  const categories = originCategories || (originCategory ? [originCategory] : []);
  // category 字段：兼容老的物料无 category 字段
  const category = originCategory || ((originCategories && originCategories[0]) ? originCategories[0] : '');

  let languageType = 'js';
  try {
    languageType = await getProjectLanguageType(projectPath, pkg);
  } catch (err) {
    // ignore
  }

  const materialData = {
    // 允许（但不推荐）自定义单个物料的数据
    ...materialItemConfig,
    name: materialItemConfig.name,
    title: materialItemConfig.title,
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
      path: pkgPath,
    },
    dependencies: pkg.dependencies || {},
    screenshot,
    screenshots,
    publishTime: new Date('2020/1/1'),
    updateTime: new Date('2020/1/1'),
  };

  if (materialItemConfig === 'block') {
    // iceworks 2.x 依赖该字段，下个版本删除
    materialData.source.sourceCodeDirectory = 'src/';
  }

  return { materialData, materialType };
}

async function getProjectLanguageType(projectPath: string, pkgData: any) {
  const hasTsconfig = fse.existsSync(path.join(projectPath, 'tsconfig.json'));

  if (!hasTsconfig) {
    return 'js';
  } else {
    const { dependencies = {}, devDependencies = {} } = pkgData;
    const isIcejs = devDependencies['ice.js'] || dependencies['ice.js'];
    const isRaxjs = devDependencies['rax.js'] || dependencies['rax.js'];

    if (isIcejs || isRaxjs) {
      // icejs&raxjs 都有 tsconfig，因此需要通过 src/app.js[x] 进一步区分
      const hasAppJs = fse.existsSync(path.join(projectPath, 'src/app.js')) || fse.existsSync(path.join(projectPath, 'src/app.jsx'));
      if (hasAppJs) {
        return 'js';
      }
    }

    return 'ts';
  }
}
