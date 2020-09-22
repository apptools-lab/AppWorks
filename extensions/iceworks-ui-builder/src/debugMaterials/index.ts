import { addSource } from '@iceworks/material-service';
import { IMaterialSource } from '@iceworks/material-utils';
import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import * as BluebirdPromise from 'bluebird';
import generateMaterialData from './generateMaterialData';

// const debugQuickPicks : vscode.QuickPickItem[] = [
//   {
//     label: '添加调试物料文件夹',
//     description: '',
//   },
//   {
//     label: '编辑物料文件夹信息',
//     description: '',
//   },
//   {
//     label: '停止物料调试',
//     description: '',
//   },
// ];

export default function initDebugMaterials() {
  showDebugInputBox();
}

async function showDebugInputBox() {
  const result = await vscode.window.showInputBox({
    placeHolder: '/path/to/materials',
    prompt: 'Input Material Folder Path',
  });
  if (result) {
    try {
      const debugMaterials = await getDebugMaterialJson(result);
      addSource(debugMaterials);
    } catch (err) {
      vscode.window.showErrorMessage('init Debug Err', err.message);
    }
  }
}

async function getDebugMaterialJson(materialPath: string): Promise<IMaterialSource> {
  const pathExists = await fse.pathExists(materialPath);
  if (!pathExists) {
    throw new Error(`${materialPath} does not exists`);
  }
  const materialPkgPath = path.join(materialPath, 'package.json');
  const { materialConfig } = await fse.readJSON(materialPkgPath);
  if (!materialConfig) {
    throw new Error(`${materialPath} is not a material folder!`);
  }

  const pkg = await fse.readJson(path.join(materialPath, 'package.json'));
  const [blocks, components, scaffolds, pages] = await Promise.all(
    ['block', 'component', 'scaffold', 'page'].map((item) => {
      return globMaterials(materialPath, item);
    }),
  );
  // @ts-ignore
  const allMaterials = [].concat(blocks).concat(components).concat(scaffolds).concat(pages);

  const concurrency = Number(process.env.CONCURRENCY) || 30;
  let index = 0;
  // const total = allMaterials.length;

  let materialsData;

  try {

    materialsData = await BluebirdPromise.map(
      allMaterials,
      (materialItem) => {
        return generateMaterialData(materialItem.pkgPath, materialItem.materialType)
          .then((data) => {
            index = index + 1;
            return data;
          });
      },
      {
        concurrency,
      },
    );
  } catch (err) {
    // ignore
  }

  const blocksData: any[] = [];
  const componentsData: any[] = [];
  const scaffoldsData: any[] = [];
  const pagesData: any[] = [];
  materialsData.forEach(item => {
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

  const debugMaterialJson = {
    ...materialConfig,
    name: pkg.name,
    description: pkg.description,
    homepage: pkg.homepage,
    author: pkg.author,
    blocks: blocksData,
    components: componentsData,
    scaffolds: scaffoldsData,
    pages: pagesData,
  };

  return debugMaterialJson;
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
