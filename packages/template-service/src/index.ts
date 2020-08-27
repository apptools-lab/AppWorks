import * as path from 'path';
import * as fse from 'fs-extra';
import * as glob from 'glob';
import * as readFiles from 'fs-readdir-recursive';
import { getAndExtractTarball, readPackageJSON } from 'ice-npm-utils';
import { getTarballURLByMaterielSource, IMaterialPage } from '@iceworks/material-utils';
import { projectPath, getProjectLanguageType, pagesPath } from '@iceworks/project-service';
import { createNpmCommand, getIceworksTerminal } from '@iceworks/common-service';
import * as upperCamelCase from 'uppercamelcase';
import * as transfromTsToJs from 'transform-ts-to-js';
import i18n from './i18n';
import renderEjsTemplates from './utils/renderEjsTemplates';

function getPageType(templateSourceSrcPath) {
  const files = readFiles(templateSourceSrcPath);

  const index = files.findIndex((item) => {
    return /\.ts(x)/.test(item);
  });

  return index >= 0 ? 'ts' : 'js';
}

export const getTemplateSchema = async (templates: IMaterialPage[]) => {
  await bulkDownload(templates);
  return fse.readJSONSync(
    path.join(pagesPath, '.template', upperCamelCase(templates[0].name), 'config', 'settings.json')
  );
};

export const bulkDownload = async function (templates: IMaterialPage[], log?: (text: string) => void) {
  if (!log) {
    log = (text) => console.log(text);
  }

  return await Promise.all(
    templates.map(async (template: any) => {
      await fse.mkdirp(pagesPath);
      const templateName: string = upperCamelCase(template.name);

      let tarballURL: string;
      try {
        log(i18n.format('package.template-service.downloadTemplate.getDownloadUrl'));
        tarballURL = await getTarballURLByMaterielSource(template.source);
      } catch (error) {
        error.message = i18n.format('package.template-service.downloadTemplate.downloadError', {
          templateName,
          tarballURL,
        });
        throw error;
      }
      log(i18n.format('package.template-service.downloadTemplate.unzipCode'));
      const templateTempDir = path.join(pagesPath, '.template', `${templateName}`);

      try {
        await getAndExtractTarball(templateTempDir, tarballURL, ({ percent }) => {
          log(
            i18n.format('package.template-service.downloadTemplate.process', { percent: (percent * 100).toFixed(2) })
          );
        });
        log(i18n.format('package.template-service.obtainDone', { templateDir: templateTempDir }));
      } catch (error) {
        error.message = i18n.format('package.template-service.uzipError', { templateName, tarballURL });
        if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
          error.message = i18n.format('package.template-service.uzipOutTime', { templateName, tarballURL });
        }
        await fse.remove(templateTempDir);
        throw error;
      }
      return templateTempDir;
    })
  );
};

export const createPage = (selesctPage) => {
  renderTemplate(selesctPage);
  bulkInstallDependencies(selesctPage);
};

export const renderTemplate = async (templates: IMaterialPage[]) => {
  const templateName: string = upperCamelCase(templates[0].name);
  const templatePath: string = path.join(pagesPath, '.template', `${templateName}`);
  const targetPath: string = path.join(pagesPath, `${templateName}`);
  const templateData = templates[0].templateData;

  await renderEjsTemplates(templateData, templatePath);
  const pageSourceSrcPath = path.join(templatePath, 'src');
  const pageType = getPageType(pageSourceSrcPath);
  const projectType = await getProjectLanguageType();

  if (pageType === 'ts' && projectType === 'js') {
    const files = glob.sync('**/*.@(ts|tsx)', {
      cwd: pageSourceSrcPath,
    });

    console.log('transfrom ts to js', files.join(','));

    transfromTsToJs(files, {
      cwd: pageSourceSrcPath,
      outDir: pageSourceSrcPath,
      action: 'overwrite',
    });
  }

  await fse.move(pageSourceSrcPath, targetPath);
  await fse.remove(path.resolve(templatePath, '../'));
  return targetPath;
};

/**
 * Installatio template dependencies
 */
export const bulkInstallDependencies = async function (pages: IMaterialPage[]) {
  const projectPackageJSON = await readPackageJSON(projectPath);

  // get all dependencies from templates
  const pagesDependencies: { [packageName: string]: string } = {};
  pages.forEach(({ dependencies }: any) => Object.assign(pagesDependencies, dependencies));

  // filter existing dependencies of project
  const filterDependencies: { [packageName: string]: string }[] = [];
  Object.keys(pagesDependencies).forEach((packageName) => {
    if (!projectPackageJSON.dependencies.hasOwnProperty(packageName)) {
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

    const terminal = getIceworksTerminal();
    terminal.show();
    terminal.sendText(`cd '${projectPath}'`, true);
    terminal.sendText(createNpmCommand('install', deps.join(' '), '--save'), true);
  } else {
    return [];
  }
};
