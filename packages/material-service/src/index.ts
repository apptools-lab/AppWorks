import * as vscode from 'vscode';
import * as kebabCase from 'lodash.kebabcase';
import axios from 'axios';
import { checkAliInternal } from 'ice-npm-utils';
import { IMaterialSource, IMaterialData, IMaterialBase } from '@iceworks/material-utils';
import { getProjectType } from '@iceworks/project-service';

const ICE_MATERIAL_SOURCE = 'https://ice.alicdn.com/assets/materials/react-materials.json';
const MATERIAL_BASE_HOME_URL = 'https://ice.work/component';
const MATERIAL_BASE_REPOSITORY_URL = 'https://github.com/alibaba-fusion/next/tree/master/src';
const ICE_BASE_COMPONENTS_SOURCE = 'https://ice.alicdn.com/assets/base-components-1.x.json';
const OFFICE_MATERIAL_SOURCES = [
  {
    name: 'PC Web',
    type: 'react',
    source: ICE_MATERIAL_SOURCE,
    description: '基于 Fusion 基础组件和 ice 脚手架的官方物料'
  },
  {
    name: '无线跨端',
    type: 'rax',
    source: 'https://ice.alicdn.com/assets/materials/rax-materials.json',
    description: '基于 Rax 组件和 Rax 脚手架的官方物料'
  }
]
const VUE_MATERIAL_SOURCES = {
  name: 'Vue 物料源',
  type: 'vue',
  source: 'https://ice.alicdn.com/assets/materials/vue-materials.json',
  description: '基于 Element, Vue CLI 的 Vue 官方物料'
}

const dataCache: { [source: string]: IMaterialData } = {};

const isIceMaterial = (source: string) => {
  return source === ICE_MATERIAL_SOURCE;
};

export const getSourcesByProjectType = async function () {
  const type = await getProjectType();
  return getSources(type);
}

export const getOfficalMaterialSources = () => OFFICE_MATERIAL_SOURCES;

/**
 * Get material sources list
 *
 * @param specifiedType {string} react/rax/other...
 */
export function getSources(specifiedType?: string): IMaterialSource[] {
  const officalsources: IMaterialSource[] = getOfficalMaterialSources();
  if (!checkAliInternal()) {
    officalsources.push(VUE_MATERIAL_SOURCES);
  }
  const userSources: IMaterialSource[] = vscode.workspace.getConfiguration('iceworks').get('materialSources', []);
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
