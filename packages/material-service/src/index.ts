import * as kebabCase from 'lodash.kebabcase';
import axios from 'axios';
import { checkAliInternal } from 'ice-npm-utils';
import { saveDataToSettingJson, getDataFromSettingJson, CONFIGURATION_KEY_MATERIAL_SOURCES } from '@iceworks/common-service';
import { IMaterialSource, IMaterialData, IMaterialBase } from '@iceworks/material-utils';
import { getProjectType } from '@iceworks/project-service';
import i18n from './i18n';

const ICE_MATERIAL_SOURCE = 'https://ice.alicdn.com/assets/materials/react-materials.json';
const MATERIAL_BASE_HOME_URL = 'https://ice.work/component';
const MATERIAL_BASE_REPOSITORY_URL = 'https://github.com/alibaba-fusion/next/tree/master/src';
const ICE_BASE_COMPONENTS_SOURCE = 'https://ice.alicdn.com/assets/base-components-1.x.json';
const OFFICAL_MATERIAL_SOURCES = [
  {
    name: 'PC Web',
    type: 'react',
    client: 'pc',
    source: ICE_MATERIAL_SOURCE,
    description: i18n.format('package.materialService.index.webDescription')
  },
  {
    name: i18n.format('package.materialService.index.raxTitle'),
    type: 'rax',
    client: 'wireless',
    source: 'https://ice.alicdn.com/assets/materials/rax-materials.json',
    description: i18n.format('package.materialService.index.raxDescription')
  }
]
const OFFICAL_MATERIAL_SOURCES_FOR_EXTERNAL = [
  {
    name: i18n.format('package.materialService.index.vueTitle'),
    type: 'vue',
    source: 'https://ice.alicdn.com/assets/materials/vue-materials.json',
    description: i18n.format('package.materialService.index.vueDescription')
  }
]
const dataCache: { [source: string]: IMaterialData } = {};

const isIceMaterial = (source: string) => {
  return source === ICE_MATERIAL_SOURCE;
};

export const getSourcesByProjectType = async function () {
  const type = await getProjectType();
  console.log('project type is:', type);
  return getSources(type);
}

export const getOfficalMaterialSources = () => OFFICAL_MATERIAL_SOURCES;
export const getUserSources = () => getDataFromSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES);
/**
 * Get material sources list
 *
 * @param specifiedType {string} react/rax/other...
 */
export async function getSources(specifiedType?: string): Promise<IMaterialSource[]> {
  if (specifiedType === 'unknown') {
    // if the project type is unknown, set the default project type 
    specifiedType = 'react'
  }
  let officalsources: IMaterialSource[] = getOfficalMaterialSources();
  if (!await checkAliInternal()) {
    officalsources = officalsources.concat(OFFICAL_MATERIAL_SOURCES_FOR_EXTERNAL);
  }
  const userSources: IMaterialSource[] = getUserSources();
  const sources = officalsources.concat(userSources);
  return specifiedType ? sources.filter(({ type }) => type === specifiedType) : sources;
}

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
    const result = await axios({ url: source });
    const materialData = result.data;

    let bases: IMaterialBase[];
    if (isIceMaterial(source)) {
      try {
        const result = await axios({ url: ICE_BASE_COMPONENTS_SOURCE });
        bases = result.data.map((base: any) => {
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
}

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
}

export const updateSource = async function (newMaterialSource: IMaterialSource, originSource: IMaterialSource) {
  const sources: IMaterialSource[] = await getSources();
  const existedSource = sources.some(({ source: defaultSource }) => defaultSource === newMaterialSource.source && defaultSource !== originSource.source);
  if (existedSource) {
    throw Error(i18n.format('package.materialService.index.materialSourceExistError'));
  }
  const existedName = sources.some(({ name: defaultName }) => defaultName === newMaterialSource.name && defaultName !== originSource.name);
  if (existedName) {
    throw Error(i18n.format('package.materialService.index.materialNameExistError'));
  }

  const { type } = await getData(newMaterialSource.source);
  if (!type) {
    throw Error(i18n.format('package.materialService.index.materialDataError'));
  }

  const materialSources = getDataFromSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES);
  const newSources = materialSources.map(item => {
    if (item.source === newMaterialSource.source) {
      return {
        ...item,
        ...newMaterialSource,
        type
      };
    }
    return item;
  });
  saveDataToSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES, newSources);
  return newSources;
}

export async function removeSource(source: string): Promise<IMaterialSource[]> {
  const materialSources = getDataFromSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES);
  const newSources = materialSources.filter(item => item.source !== source);
  saveDataToSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES, newSources);
  return newSources;
}
