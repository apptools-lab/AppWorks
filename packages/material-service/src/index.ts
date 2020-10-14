import * as kebabCase from 'lodash.kebabcase';
import axios from 'axios';
import {
  checkIsAliInternal,
  saveDataToSettingJson,
  getDataFromSettingJson,
  CONFIGURATION_KEY_MATERIAL_SOURCES,
} from '@iceworks/common-service';
import { IMaterialSource, IMaterialData, IMaterialBase } from '@iceworks/material-utils';
import { getProjectType } from '@iceworks/project-service';
import i18n from './i18n';
import generateDebugMaterialData from './generateDebugMaterialData';

export const DEBUG_PREFIX = 'DEBUG:';
export { generateDebugMaterialData };

const ICE_MATERIAL_SOURCE = 'https://ice.alicdn.com/assets/materials/react-materials.json';
const VUE_MATERIAL_SOURCE = 'https://ice.alicdn.com/assets/materials/vue-materials.json';
const MINI_PROGRAM_MATERIAL_SOURCE = 'https://ice.alicdn.com/assets/materials/miniprogram-materials.json';
const RAX_MATERIAL_SOURCE = 'https://ice.alicdn.com/assets/materials/rax-materials.json';

const MATERIAL_BASE_HOME_URL = 'https://ice.work/component';
const MATERIAL_BASE_REPOSITORY_URL = 'https://github.com/alibaba-fusion/next/tree/master/src';
const ICE_BASE_COMPONENTS_SOURCE = 'https://ice.alicdn.com/assets/base-components-1.x.json';

const OFFICAL_MATERIAL_SOURCES = [
  {
    name: 'PC Web',
    type: 'react',
    client: 'pc',
    source: ICE_MATERIAL_SOURCE,
    description: i18n.format('package.materialService.index.webDescription'),
  },
  {
    name: i18n.format('package.materialService.index.raxTitle'),
    type: 'rax',
    client: 'wireless',
    source: RAX_MATERIAL_SOURCE,
    description: i18n.format('package.materialService.index.raxDescription'),
  },
];

const OFFICAL_MATERIAL_SOURCES_FOR_EXTERNAL = [
  {
    name: i18n.format('package.materialService.index.miniProgramTitle'),
    type: 'miniProgram',
    client: 'wireless',
    source: MINI_PROGRAM_MATERIAL_SOURCE,
    description: i18n.format('package.materialService.index.miniProgramDescription'),
  },
  {
    name: i18n.format('package.materialService.index.vueTitle'),
    type: 'vue',
    source: VUE_MATERIAL_SOURCE,
    description: i18n.format('package.materialService.index.vueDescription'),
  },
];
let dataCache: { [source: string]: IMaterialData } = {};

const isIceMaterial = (source: string) => {
  return source === ICE_MATERIAL_SOURCE;
};

export const getSourcesByProjectType = async function () {
  const type = await getProjectType();
  console.log('project type is:', type);
  return getSources(type);
};

export const getOfficalMaterialSources = () => [].concat(OFFICAL_MATERIAL_SOURCES);

export const getUserSources = () => getDataFromSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES);

/**
 * Get material sources list
 *
 * @param specifiedType {string} react/rax/other...
 */
export async function getSources(specifiedType?: string): Promise<IMaterialSource[]> {
  if (specifiedType === 'unknown') {
    // if the project type is unknown, set the default project type
    specifiedType = 'react';
  }
  let sources: IMaterialSource[] = getOfficalMaterialSources();
  const isAliInternal = await checkIsAliInternal();
  if (!isAliInternal) {
    sources = sources.concat(OFFICAL_MATERIAL_SOURCES_FOR_EXTERNAL);
  }
  const userSources: IMaterialSource[] = getUserSources();
  sources.unshift(...userSources);
  return specifiedType ? sources.filter(({ type }) => type === specifiedType) : sources;
}

export const cleanCache = function () {
  dataCache = {};
};

/**
 * Get material source data
 *
 * @param source {string} source URL
 */
export const getData = async function (source: string): Promise<IMaterialData> {
  let data: IMaterialData;
  if (dataCache[source]) {
    data = dataCache[source];
  }

  if (!data) {
    let materialData = {} as IMaterialData;
    if (isDebugSource(source)) {
      materialData = await generateDebugMaterialData(source.replace(DEBUG_PREFIX, ''));
    } else {
      const result = await axios({ url: source });
      materialData = result.data;
    }

    let bases: IMaterialBase[];
    if (isIceMaterial(source)) {
      try {
        const baseResult = await axios({ url: ICE_BASE_COMPONENTS_SOURCE });
        bases = baseResult.data.map((base: any) => {
          const { name, title, type, importStatement } = base;
          return {
            name,
            title,
            categories: [type],
            importStatement,
            homepage: `${MATERIAL_BASE_HOME_URL}/${name.toLowerCase()}`,
            repository: `${MATERIAL_BASE_REPOSITORY_URL}/${kebabCase(name)}`,
            source: {
              type: 'npm',
              npm: '@alifd/next',
              version: '1.18.16',
              registry: 'http://registry.npmjs.com',
            },
          };
        });
      } catch (error) {
        // ignore error
      }
    }

    data = {
      ...materialData,
      blocks: materialData.blocks || [],
      components: materialData.components || [],
      scaffolds: materialData.scaffolds || [],
      bases,
    };

    dataCache[source] = data;
  }

  return data;
};

export const addSource = async function (materialSource: IMaterialSource) {
  const { source, name } = materialSource;
  const sources: IMaterialSource[] = await getSources();
  const existedSource = sources.some(({ source: defaultSource }) => defaultSource === source);
  if (existedSource) {
    throw Error(i18n.format('package.materialService.index.materialSourceExistError'));
  }
  const existedName = sources.some(({ name: defaultName }) => defaultName === name);
  if (existedName) {
    throw Error(i18n.format('package.materialService.index.materialNameExistError'));
  }

  const { type } = await getData(source);
  if (!type) {
    throw Error(i18n.format('package.materialService.index.materialDataError'));
  }
  const materialSources = getDataFromSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES);
  materialSources.push({ ...materialSource, type });
  saveDataToSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES, materialSources);
  return materialSources;
};

export const updateSource = async function (newMaterialSource: IMaterialSource, originSource: IMaterialSource) {
  const sources: IMaterialSource[] = await getSources();
  const existedSource = sources.some(
    ({ source: defaultSource }) => defaultSource === newMaterialSource.source && defaultSource !== originSource.source,
  );
  if (existedSource) {
    throw Error(i18n.format('package.materialService.index.materialSourceExistError'));
  }
  const existedName = sources.some(
    ({ name: defaultName }) => defaultName === newMaterialSource.name && defaultName !== originSource.name,
  );
  if (existedName) {
    throw Error(i18n.format('package.materialService.index.materialNameExistError'));
  }

  const { type } = await getData(newMaterialSource.source);
  if (!type) {
    throw Error(i18n.format('package.materialService.index.materialDataError'));
  }

  const materialSources = getDataFromSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES);
  const newSources = materialSources.map((item) => {
    if (item.source === newMaterialSource.source) {
      return {
        ...item,
        ...newMaterialSource,
        type,
      };
    }
    return item;
  });
  saveDataToSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES, newSources);
  return newSources;
};

export async function removeSource(source: string): Promise<IMaterialSource[]> {
  const materialSources = getDataFromSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES);
  const newSources = materialSources.filter((item) => item.source !== source);
  saveDataToSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES, newSources);
  return newSources;
}

export function isDebugSource(source: string) {
  return source.startsWith(DEBUG_PREFIX);
}
