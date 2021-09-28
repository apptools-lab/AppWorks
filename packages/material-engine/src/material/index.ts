import * as kebabCase from 'lodash.kebabcase';
import * as lowerCase from 'lodash.lowercase';
import axios from 'axios';
import {
  checkIsAliInternal,
  saveDataToSettingJson,
  getDataFromSettingJson,
  CONFIGURATION_KEY_MATERIAL_SOURCES,
} from '@appworks/common-service';
import { FUSION_MOBILE_MATERIAL_BASE_HOME_URL } from '@appworks/constant';
import { IMaterialSource, IMaterialData, IMaterialBase } from '@appworks/material-utils';
import { getProjectType } from '@appworks/project-service';
import i18n from './i18n';
import generateDebugMaterialData from './generateDebugMaterialData';
import { DEBUG_PREFIX } from './constants';

export { generateDebugMaterialData };
export * from './getProjectComponentType';
export * from './getComponentTypeOptionsByProjectType';

// material source
const ICE_MATERIAL_SOURCE = 'https://ice.alicdn.com/assets/materials/react-materials.json';
const VUE_MATERIAL_SOURCE = 'https://ice.alicdn.com/assets/materials/vue-materials.json';
// const MINI_PROGRAM_MATERIAL_SOURCE = 'https://ice.alicdn.com/assets/materials/miniprogram-materials.json';
const RAX_MATERIAL_SOURCE = 'https://ice.alicdn.com/assets/materials/rax-materials.json';
// base component source
const FUSION_PC_COMPONENTS_SOURCE = 'https://ice.alicdn.com/assets/base-components-1.x.json';
const RAX_BASE_COMPONENTS_SOURCE = 'https://ice.alicdn.com/assets/rax-base-components.json';
const ANTD_PC_COMPONENTS_SOURCE = 'https://iceworks.oss-cn-hangzhou.aliyuncs.com/assets/antd-components.json';
// base home url
const FUSION_PC_MATERIAL_BASE_HOME_URL = 'https://fusion.design/pc/component';
const ANTD_PC_MATERIAL_BASE_HOME_URL = 'https://ant.design/components';
// base repository url
const FUSION_PC_MATERIAL_BASE_REPOSITORY_URL = 'https://github.com/alibaba-fusion/next/tree/master/src';
const ANTD_PC_MATERIAL_BASE_REPOSITORY_URL = 'https://github.com/ant-design/ant-design/tree/master/components';

const componentSourceDetails = [
  {
    npm: '@alifd/next',
    homeUrl: FUSION_PC_MATERIAL_BASE_HOME_URL,
    componentNameFormatFunc: kebabCase,
    repositoryUrl: FUSION_PC_MATERIAL_BASE_REPOSITORY_URL,
  },
  {
    npm: '@alifd/meet',
    homeUrl: FUSION_MOBILE_MATERIAL_BASE_HOME_URL,
    componentNameFormatFunc: kebabCase,
  },
  {
    npm: 'antd',
    homeUrl: ANTD_PC_MATERIAL_BASE_HOME_URL,
    componentNameFormatFunc: lowerCase,
    repositoryUrl: ANTD_PC_MATERIAL_BASE_REPOSITORY_URL,
  },
];

const OFFICIAL_MATERIAL_SOURCES = [
  {
    name: i18n.format('package.materialService.index.webTitle'),
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

const OFFICIAL_MATERIAL_SOURCES_FOR_EXTERNAL = [
  // {
  //   name: i18n.format('package.materialService.index.miniProgramTitle'),
  //   type: 'miniProgram',
  //   client: 'wireless',
  //   source: MINI_PROGRAM_MATERIAL_SOURCE,
  //   description: i18n.format('package.materialService.index.miniProgramDescription'),
  // },
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

const isRaxMaterial = (source: string) => {
  return source === RAX_MATERIAL_SOURCE;
};

export const getSourcesByProjectType = async function () {
  const type = await getProjectType();
  console.log('project type is:', type);
  return getSources(type);
};

export const getOfficialMaterialSources = () => [].concat(OFFICIAL_MATERIAL_SOURCES);

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
  let sources: IMaterialSource[] = getOfficialMaterialSources();
  const isAliInternal = await checkIsAliInternal();
  if (!isAliInternal) {
    sources = sources.concat(OFFICIAL_MATERIAL_SOURCES_FOR_EXTERNAL);
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

    if (isRaxMaterial(source)) {
      // handle with fusion-mobile components
      materialData.components = getBaseMaterials(materialData.components, '@alifd/meet', '2.x', 'fusion-mobile');
    }

    // base materials
    let bases: IMaterialBase[];
    try {
      if (isIceMaterial(source)) {
        const fusionBaseResult = await axios({ url: FUSION_PC_COMPONENTS_SOURCE });
        const fusionBaseMaterials = getBaseMaterials(fusionBaseResult.data, '@alifd/next', '1.x', 'fusion');
        const antdBaseResult = await axios({ url: ANTD_PC_COMPONENTS_SOURCE });
        const antdBaseMaterials = getBaseMaterials(antdBaseResult.data, 'antd', '4.x', 'antd');
        bases = [...fusionBaseMaterials, ...antdBaseMaterials];
      } else if (isRaxMaterial(source)) {
        const baseResult = await axios({ url: RAX_BASE_COMPONENTS_SOURCE });
        bases = baseResult.data;
      }
    } catch (error) {
      console.log('get base materials error:', error);
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

function getBaseMaterials(data: any[], npm: string, version: string, componentType: string) {
  const componentSourceDetail = componentSourceDetails.find((item) => item.npm === npm) || {} as any;
  const { homeUrl, repositoryUrl, componentNameFormatFunc } = componentSourceDetail;

  return data.map((base: any) => {
    const { name, title, type, importStatement, source } = base;
    return {
      name,
      title,
      categories: [type],
      importStatement,
      homepage: homeUrl ? `${homeUrl}/${componentNameFormatFunc(name)}` : '',
      repository: repositoryUrl ? `${repositoryUrl}/${componentNameFormatFunc(name)}` : '',
      source: source || {
        type: 'npm',
        npm,
        version,
        registry: 'https://registry.npmjs.com',
      },
      componentType,
    };
  });
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
  materialSources.unshift({ ...materialSource, type });
  saveDataToSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES, materialSources);
  return materialSources;
};

export const updateSource = async function (newMaterialSource: IMaterialSource, originSource: IMaterialSource) {
  const sources: IMaterialSource[] = await getSources();
  // don't update source when the source has already existed
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
    if (item.source === originSource.source) {
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
