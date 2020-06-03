import * as path from 'path';
import * as fsExtra from 'fs-extra';
import * as prettier from 'prettier';
import { IMaterialBlock } from '@iceworks/material-utils';
import { pagesPath, COMPONENT_DIR_NAME } from '@iceworks/project-service';
import { bulkGenerate } from '@iceworks/block-service';
import * as upperCamelCase from 'uppercamelcase';
import * as ejs from 'ejs';
import { templateFileName } from './constant';

/**
 * Generate page code based on blocks
 *
 * @param pageName {string} page name
 * @param blocks {array} blocks information
 */
export const generate = async function({ pageName: name, blocks }: { pageName: string; blocks: IMaterialBlock[] }) {
  const pageName = upperCamelCase(name);
  const pagePath = path.join(pagesPath, pageName);

  // ensure that the root directory of the page store exists
  await fsExtra.mkdirp(pagePath);

  const isPagePathExists = await fsExtra.pathExists(pagePath);
  if (!isPagePathExists) {
    throw new Error(`${name} page already exists, cannot overwrite.`);
  }

  try {
    await addBlocks( blocks, pageName );

    const templatePath = path.join(__dirname, templateFileName);
    const fileStr = await fsExtra.readFile(templatePath, 'utf-8');
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

    const fileName = templateFileName.replace(/template/g, 'index').replace(/\.ejs$/g, '');
    const dist = path.join(pagePath, fileName);
    const rendered = prettier.format(fileContent, {
      singleQuote: true,
      trailingComma: 'es5',
      parser: 'babel',
    });

    await fsExtra.writeFile(dist, rendered, 'utf-8');
  } catch (error) {
    remove(pageName);
    throw error;
  }

  return pageName;
}

/**
 * Remove page files
 *
 * @param name {string} Page folder name
 */
export const remove = async function(name: string) {
  await fsExtra.remove(path.join(pagesPath, name));
}

export const addBlocks = async function(blocks: IMaterialBlock[], pageName: string) {
  return await bulkGenerate(blocks, path.join(pagesPath, pageName, COMPONENT_DIR_NAME));
}
