import { getTarballURLByMaterielSource, IMaterialPage, IMaterialBlock } from '@appworks/material-utils';
import * as upperCamelCase from 'uppercamelcase';
import * as path from 'path';
import * as vscode from 'vscode';
import { getAndExtractTarball, readPackageJSON } from 'ice-npm-utils';
import * as fse from 'fs-extra';
import i18n from './i18n';
import { createNpmCommand, executeCommand } from './command';
import { getAddDependencyAction } from './packageManager';
import { getIceworksTerminal } from './terminal';

export const bulkDownloadMaterials = async function (
  materials: IMaterialPage[] | IMaterialBlock[],
  tmpPath: string,
  log?: (text: string) => void,
) {
  if (!log) {
    log = (text) => console.log(text);
  }

  const result = await Promise.all(
    // @ts-ignore
    materials.map(async (material: any) => {
      await fse.mkdirp(tmpPath);
      const materialName: string = upperCamelCase(material.name);
      const downloadPath = path.join(tmpPath, materialName);
      // debug local material application
      if (material.source.type === 'debug') {
        try {
          await fse.copy(material.source.path, downloadPath, {
            filter: (srcPath) => {
              return !srcPath.includes('node_modules');
            },
          });
        } catch (err) {
          log(i18n.format('package.common-service.downloadMaterial.debugDownloadError', { errMessage: err.message }));
        }
      } else {
        let tarballURL: string;
        try {
          log(i18n.format('package.common-service.downloadMaterial.getDownloadUrl'));
          tarballURL = await getTarballURLByMaterielSource(material.source);
        } catch (error) {
          error.message = i18n.format('package.common-service.downloadMaterial.downloadError', {
            materialName,
            tarballURL,
          });
          throw error;
        }
        log(i18n.format('package.common-service.downloadMaterial.unzipCode'));
        try {
          await getAndExtractTarball(downloadPath, tarballURL, ({ percent }) => {
            log(i18n.format('package.common-service.downloadMaterial.process', { percent: (percent * 100).toFixed(2) }));
          });
        } catch (error) {
          error.message = i18n.format('package.common-service.uzipError', { materialName, tarballURL });
          if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
            error.message = i18n.format('package.common-service.uzipOutTime', { materialName, tarballURL });
          }
          await fse.remove(tmpPath);
          throw error;
        }
      }
    }),
  );

  return result;
};

export function openMaterialsSettings() {
  if (vscode.extensions.getExtension('iceworks-team.iceworks-app')) {
    executeCommand('applicationManager.configHelper.start', 'appworks.materialSources');
  } else {
    executeCommand('workbench.action.openSettings', 'appworks.materialSources');
  }
}

export const bulkInstallMaterialsDependencies = async function (
  materials: IMaterialPage[] | IMaterialBlock[],
  projectPath: string,
) {
  const projectPackageJSON = await readPackageJSON(projectPath);

  // get all dependencies from templates
  const pagesDependencies: { [packageName: string]: string } = {};
  materials.forEach(({ dependencies }: any) => Object.assign(pagesDependencies, dependencies));

  // filter existing dependencies of project
  const filterDependencies: Array<{ [packageName: string]: string }> = [];
  Object.keys(pagesDependencies).forEach((packageName) => {
    // eslint-disable-next-line no-prototype-builtins
    if (projectPackageJSON.dependencies && !projectPackageJSON.dependencies.hasOwnProperty(packageName)) {
      filterDependencies.push({
        [packageName]: pagesDependencies[packageName],
      });
    }
  });

  if (filterDependencies.length > 0) {
    const deps = filterDependencies.map((dependency) => {
      const [packageName, version]: [string, string] = Object.entries(dependency)[0];
      return `${packageName}@${version}`;
    });

    const addDependencyAction = getAddDependencyAction(); // `add` or `install`
    const terminal = getIceworksTerminal();
    terminal.show();
    terminal.sendText(`cd '${projectPath}'`, true);
    terminal.sendText(createNpmCommand(addDependencyAction, deps.join(' '), '--save'), true);
  } else {
    return [];
  }
};
