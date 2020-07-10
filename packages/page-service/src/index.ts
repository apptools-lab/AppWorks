import * as path from 'path';
import * as fsExtra from 'fs-extra';
import * as prettier from 'prettier';
import { IMaterialBlock } from '@iceworks/material-utils';
import { pagesPath, COMPONENT_DIR_NAME, getProjectLanguageType } from '@iceworks/project-service';
import { bulkGenerate } from '@iceworks/block-service';
import * as upperCamelCase from 'uppercamelcase';
import * as ejs from 'ejs';

/**
 * Generate page code based on blocks
 *
 * @param pageName {string} page name
 * @param blocks {array} blocks information
 */
export const generate = async function ({ pageName: name, blocks = [] }: { pageName: string; blocks: IMaterialBlock[] }) {
  const pageName = upperCamelCase(name);
  const pagePath = path.join(pagesPath, pageName);

  // ensure that the root directory of the page store exists
  await fsExtra.mkdirp(pagePath);

  const isPagePathExists = await fsExtra.pathExists(pagePath);
  if (!isPagePathExists) {
    throw new Error(`页面文件夹「${name}」已存在，无法覆盖，请输入新的页面名称。`);
  }

  try {
    await addBlocks(blocks, pageName);

    const fileStr = `import React, { Component } from 'react';
<% for(var i = 0; i < blocks.length; i++) { -%>
import <%= blocks[i].className %> from '<%= blocks[i].relativePath -%>';
<% } -%>

export default function () {
  return (
    <div className="<%= pageName %>-page">
      <% for(var i = 0; i < blocks.length; i++){ -%>
      <% if (blocks[i].description) { %>{/* <%= blocks[i].description -%> */}<% } %>
      <<%= blocks[i].className -%> />
      <% } -%>
    </div>
  );
}`
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

    const fileName = `index.${getProjectLanguageType()}x`;
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
export const remove = async function (name: string) {
  await fsExtra.remove(path.join(pagesPath, name));
}

export const addBlocks = async function (blocks: IMaterialBlock[], pageName: string) {
  return await bulkGenerate(blocks, path.join(pagesPath, pageName, COMPONENT_DIR_NAME));
}
