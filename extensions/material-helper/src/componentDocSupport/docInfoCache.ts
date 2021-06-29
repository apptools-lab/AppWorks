/* eslint-disable dot-notation */
import { IMaterialData, IMaterialComponent, IMaterialBase } from '@appworks/material-utils';
import { material } from '@appworks/material-engine';
import { window } from 'vscode';
import { IComponentDocInfo } from './type';
import i18n from '../i18n';

let loading = true;
let docInfoCache: IComponentDocInfo[] = [];

const { getSourcesByProjectType, getData } = material;

export function getDocInfos(): IComponentDocInfo[] {
  if (!loading) {
    return docInfoCache;
  } else {
    window.showInformationMessage(i18n.format('extension.iceworksMaterialHelper.getAllDocsInfo.sourceLoading'));
    return [];
  }
}

export async function initDocInfos() {
  docInfoCache = await originGetDocInfos();
  loading = false;
}

async function originGetDocInfos() {
  const getDocInfoFromMaterial = (sourceJson: IMaterialData) => {
    return [...sourceJson.components, ...(sourceJson.bases || [])].map(({ name, title, homepage, source, ...rest }: IMaterialComponent | IMaterialBase) => {
      return {
        label: name,
        detail: title,
        description: rest['description'] || '',
        url: homepage,
        source,
      };
    });
  };

  const projectSource = await getSourcesByProjectType();
  const componentInfos = await Promise.all(projectSource.map(({ source }) => getData(source)));
  return componentInfos.reduce((componentDocInfos, materialInfo) => {
    return componentDocInfos.concat(getDocInfoFromMaterial(materialInfo));
  }, [] as IComponentDocInfo[]);
}
