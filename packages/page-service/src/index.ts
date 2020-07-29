import * as path from 'path';
import * as fsExtra from 'fs-extra';
import * as prettier from 'prettier';
import { IMaterialBlock } from '@iceworks/material-utils';
import { pagesPath, COMPONENT_DIR_NAME, getProjectLanguageType, getProjectFramework, projectPath } from '@iceworks/project-service';
import { bulkGenerate } from '@iceworks/block-service';
import * as upperCamelCase from 'uppercamelcase';
import * as ejs from 'ejs';
import reactPageTemplate from './templates/template.react';
import vuePageTemplate from './templates/template.vue';
import { bulkCreate } from './router';
import i18n from './i18n';

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
  await fsExtra.mkdirp(pagePath);

  const isPagePathExists = await fsExtra.pathExists(pagePath);
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

    await fsExtra.writeFile(dist, rendered, 'utf-8');
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
  await fsExtra.remove(path.join(pagesPath, name));
};

export const addBlocks = async function (blocks: IMaterialBlock[], pageName: string) {
  return await bulkGenerate(blocks, path.join(pagesPath, pageName, COMPONENT_DIR_NAME));
};
