import packageJSON from 'package-json';
import {
  IMaterialData,
  IMaterialTypeDatum,
  IMaterialBase,
  IMaterialItem,
  IMaterialCategoryDatum,
  IMaterialNpmSource,
} from './types';
import { CUSTOM_CATEGORY } from './constant';

export function convertMaterialData(materialData: IMaterialData): IMaterialTypeDatum[] {
  const { blocks, scaffolds, components, bases, pages } = materialData;
  const hasBase = bases && bases.length > 0;
  const componentName = hasBase ? '业务组件' : '组件';
  const materialGroup: IMaterialTypeDatum[] = [];

  if (scaffolds) {
    materialGroup.push({
      name: '模板',
      id: 'scaffolds',
      categoryData: getMaterialCategoryData(scaffolds),
    });
  }

  if (blocks) {
    materialGroup.push({
      name: '区块',
      id: 'blocks',
      categoryData: getMaterialCategoryData(blocks),
    });
  }

  if (pages) {
    materialGroup.push({
      name: '页面',
      id: 'pages',
      categoryData: getMaterialCategoryData(pages),
    });
  }

  if (components) {
    materialGroup.push({
      name: componentName,
      id: 'components',
      categoryData: getMaterialCategoryData(components),
    });
  }

  if (hasBase) {
    materialGroup.push({
      name: '基础组件',
      id: 'bases',
      categoryData: getMaterialCategoryData(bases as IMaterialBase[]),
    });
  }
  console.log('materialGroup', materialGroup);
  return materialGroup;
}

export function getMaterialCategoryData(components: IMaterialItem[]): IMaterialCategoryDatum[] {
  const materialCategoryData: IMaterialCategoryDatum[] = [];
  const otherMaterialCategoryDatum: IMaterialCategoryDatum = {
    name: CUSTOM_CATEGORY,
    list: [],
  };
  components.forEach((component: IMaterialItem) => {
    const { categories } = component;
    if (categories.length) {
      categories.forEach((category: string) => {
        const cateogryDatum = materialCategoryData.find(({ name }) => name === category);
        if (!cateogryDatum) {
          materialCategoryData.push({
            name: category,
            list: [component],
          });
        } else {
          cateogryDatum.list.push(component);
        }
      });
    } else {
      otherMaterialCategoryDatum.list.push(component);
    }
  });
  if (otherMaterialCategoryDatum.list.length) {
    materialCategoryData.unshift(otherMaterialCategoryDatum);
  }
  return materialCategoryData;
}

export const getTarballURLByMaterielSource = async function (
  source: IMaterialNpmSource,
  iceVersion?: string,
): Promise<string> {
  let { version } = source;

  if (iceVersion === '1.x') {
    version = source['version-0.x'] || source.version;
  }
  let registryUrl = source.registry;

  // Using taobao registry to increase download speed
  if (registryUrl === 'https://registry.npmjs.org') {
    registryUrl = 'https://registry.npm.taobao.org';
  }

  const packageData: any = await packageJSON(source.npm, {
    version,
    registryUrl,
  });

  return packageData.dist.tarball;
};
