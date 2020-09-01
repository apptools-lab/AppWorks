import * as path from 'path';
import * as fse from 'fs-extra';
import * as prettier from 'prettier';
import * as glob from 'glob';
import { IMaterialBlock, IMaterialPage } from '@iceworks/material-utils';
import {
  findIndexFile,
  bulkDownloadMaterials,
  bulkInstallMaterialsDependencies,
  getFolderLanguageType,
} from '@iceworks/common-service';
import {
  pagesPath,
  COMPONENT_DIR_NAME,
  getProjectLanguageType,
  getProjectFramework,
  projectPath,
} from '@iceworks/project-service';
import { bulkGenerate } from '@iceworks/block-service';

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

  const isPagePathExists = await fse.pathExists(pagePath);
  if (isPagePathExists) {
    throw new Error(i18n.format('package.pageService.index.pagePathExistError', { name }));
  } else {
    // ensure that the root directory of the page store exists
    await fse.mkdirp(pagePath);
    const projectFramework = await getProjectFramework();
    const isVueProjectFramework = projectFramework === 'vue';
    const projectLanguageType = await getProjectLanguageType();
    const fileName = isVueProjectFramework ? 'index.vue' : `index.${projectLanguageType}x`;
    const dist = path.join(pagePath, fileName);

    try {
      await addBlocks(blocks, pageName);
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

    return dist;
  }
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

export const getTemplateSchema = async (selectPage: IMaterialPage) => {
  const templateTempDir = path.join(pagesPath, '.template');
  try {
    await bulkDownloadMaterials([selectPage], templateTempDir);
    const templateSchema = await fse.readJSON(
      path.join(pagesPath, '.template', selectPage.name, 'config', 'settings.json')
    );
    await fse.remove(templateTempDir);
    return templateSchema;
  } catch (err) {
    await fse.remove(templateTempDir);
    throw err;
  }
};

export const createPage = async (selectPage: IMaterialPage) => {
  const templateTempDir: string = path.join(pagesPath, '.template');
  try {
    await bulkDownloadMaterials([selectPage], templateTempDir);
    const pageIndexPath = await renderPage(selectPage);
    await bulkInstallMaterialsDependencies([selectPage], projectPath);
    await fse.remove(templateTempDir);
    return pageIndexPath;
  } catch (err) {
    await fse.remove(templateTempDir);
    throw err;
  }
};

export const renderPage = async (page: IMaterialPage) => {
  console.log('renderPage', page);
  const templateName = page.name;
  const pageName: string = upperCamelCase(page.pageName);
  const templatePath: string = path.join(pagesPath, '.template', `${templateName}`);
  const targetPath: string = path.join(pagesPath, `${pageName}`);
  const templateData = page.templateData;

  if (fse.existsSync(targetPath)) {
    throw new Error(i18n.format('package.pageService.index.pagePathExistError', { name: pageName }));
  }

  await renderEjsTemplates(templateData, templatePath);
  const pageSourceSrcPath = path.join(templatePath, 'src');
  const pageType = getFolderLanguageType(pageSourceSrcPath);
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

  return findIndexFile(targetPath);
};
