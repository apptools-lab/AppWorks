import * as path from 'path';
import * as fse from 'fs-extra';
import * as prettier from 'prettier';
import * as glob from 'glob';
import { IMaterialBlock, IMaterialPage } from '@iceworks/material-utils';
import {
  pagesPath,
  COMPONENT_DIR_NAME,
  getProjectLanguageType,
  getProjectFramework,
  projectPath,
} from '@iceworks/project-service';
import { bulkGenerate } from '@iceworks/block-service';
import { bulkDownload, bulkInstallDependencies, getFileType } from '@iceworks/common-service';
import * as upperCamelCase from 'uppercamelcase';
import * as ejs from 'ejs';
import * as transfromTsToJs from 'transform-ts-to-js';
import reactPageTemplate from './templates/template.react';
import vuePageTemplate from './templates/template.vue';
import { bulkCreate } from './router';
import i18n from './i18n';
import renderEjsTemplates from './utils/renderEjsTemplates';

export * from './router';

/**
 * Generate page code based on blocks
 *
 * @param pageName {string} page name
 * @param blocks {array} blocks information
 */
export const generate = async function ({
  pageName: name,
  blocks = [],
}: {
  pageName: string;
  blocks: IMaterialBlock[];
}) {
  const pageName = upperCamelCase(name);
  const pagePath = path.join(pagesPath, pageName);

  // ensure that the root directory of the page store exists
  await fse.mkdirp(pagePath);

  const isPagePathExists = await fse.pathExists(pagePath);
  if (!isPagePathExists) {
    throw new Error(i18n.format('package.pageService.index.pagePathExistError', { name }));
  }

  try {
    await addBlocks(blocks, pageName);
    const projectFramework = await getProjectFramework();
    const isVueProjectFramework = projectFramework === 'vue';
    const fileStr = isVueProjectFramework ? vuePageTemplate : reactPageTemplate;

    const fileContent = ejs.compile(fileStr)({
      blocks: blocks.map((block: any) => {
        const blockName = upperCamelCase(block.name);
        return {
          ...block,
          className: blockName,
          relativePath: `./${COMPONENT_DIR_NAME}/${blockName}`,
        };
      }),
      className: pageName,
      pageName,
    });
    const projectLanguageType = await getProjectLanguageType();
    const fileName = isVueProjectFramework ? 'index.vue' : `index.${projectLanguageType}x`;
    const dist = path.join(pagePath, fileName);
    const prettierParserType = isVueProjectFramework ? 'vue' : 'babel';
    const rendered = prettier.format(fileContent, {
      singleQuote: true,
      trailingComma: 'es5',
      parser: prettierParserType,
    });

    await fse.writeFile(dist, rendered, 'utf-8');
  } catch (error) {
    remove(pageName);
    throw error;
  }

  return pageName;
};

/**
 *  write the router config
 */
export async function createRouter(data) {
  const { path, pageName, parent } = data;
  await bulkCreate(projectPath, [{ path, component: pageName }], { parent });
}

/**
 * Remove page files
 *
 * @param name {string} Page folder name
 */
export const remove = async function (name: string) {
  await fse.remove(path.join(pagesPath, name));
};

export const addBlocks = async function (blocks: IMaterialBlock[], pageName: string) {
  return await bulkGenerate(blocks, path.join(pagesPath, pageName, COMPONENT_DIR_NAME));
};

export const getTemplateSchema = async (templates: IMaterialPage[]) => {
  const templateTempDir = path.join(pagesPath, '.template');
  await bulkDownload(templates, templateTempDir);
  return fse.readJSONSync(path.join(pagesPath, '.template', templates[0].name, 'config', 'settings.json'));
};

export const createPage = async (selesctPage) => {
  const templateDirPath: string = path.join(pagesPath, '.template');
  await renderTemplate(selesctPage);
  await bulkInstallDependencies(selesctPage, projectPath);
  await fse.remove(templateDirPath);
};

export const renderTemplate = async (pages: IMaterialPage[]) => {
  const templateName = pages[0].templateName;
  const pageName: string = upperCamelCase(pages[0].name);
  const templatePath: string = path.join(pagesPath, '.template', `${templateName}`);
  const targetPath: string = path.join(pagesPath, `${pageName}`);
  const templateData = pages[0].templateData;

  if (fse.existsSync(targetPath)) {
    throw new Error(i18n.format('package.pageService.index.pagePathExistError', { name: pageName }));
  }

  await renderEjsTemplates(templateData, templatePath);
  const pageSourceSrcPath = path.join(templatePath, 'src');
  const pageType = getFileType(pageSourceSrcPath);
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

  return targetPath;
};
