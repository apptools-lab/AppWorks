import * as path from 'path';
import * as vscode from 'vscode';
import * as fsExtra from 'fs-extra';
import * as prettier from 'prettier';
import { getAndExtractTarball, readPackageJSON } from 'ice-npm-utils';
import { getTarballURLByMaterielSource, IMaterialBlock } from '@iceworks/material-utils';
import * as upperCamelCase from 'uppercamelcase';
import * as ejs from 'ejs';
import {
  pagesPath,
  componentDirName,
  templateFileName,
  projectPath,
} from './constant';

/**
 * Generate page code based on blocks
 *
 * @param pageName {string} page name
 * @param blocks {array} blocks information
 */
export const create = async function({ pageName: name, blocks }: { pageName: string, blocks: IMaterialBlock[] }) {
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
          relativePath: `./${componentDirName}/${blockName}`,
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

/**
 * Generate block code
 */
export const addBlocks = async function(blocks: IMaterialBlock[], pageName: string) {
  await downloadBlocksToPage(blocks, pageName);
  await installBlocksDependencies(blocks);
}

/**
 * Download blocks code to page
 */
export const downloadBlocksToPage = async function(blocks: IMaterialBlock[], pageName: string) {
  return await Promise.all(
    blocks.map(async (block: any) => await downloadBlockToPage(block, pageName)),
  );
}

/**
 * Download block code to page
 */
export const downloadBlockToPage = async function(block: IMaterialBlock, pageName: string){
  const blockSourceNpm = block.source.npm;
  const pagePath = path.join(pagesPath, pageName);
  const componentsPath = path.join(pagePath, componentDirName);

  await fsExtra.mkdirp(componentsPath);
  const blockName: string = upperCamelCase(block.name);

  let tarballURL: string;
  try {
    tarballURL = await getTarballURLByMaterielSource(block.source);
  } catch (error) {
    error.message = `Failed to get tarball URL of ${blockSourceNpm}, you can copy ${block.repository}`;
    throw error;
  }

  const blockDir = path.join(componentsPath, blockName);
  const blockTempDir = path.join(componentsPath, `.${blockName}.temp`);

  try {
    await getAndExtractTarball(blockTempDir, tarballURL);
  } catch (error) {
    error.message = `Error decompressing block: ${blockName}, tarballURL is: ${tarballURL}`;
    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
      error.message = `Decompress ${blockName} timed out, tarballURL is: ${tarballURL}`;
    }
    await fsExtra.remove(blockTempDir);
    throw error;
  }

  await fsExtra.move(path.join(blockTempDir, 'src'), blockDir);
  await fsExtra.remove(blockTempDir);
  return blockDir;
}

/**
 * Installation block dependencies
 */
export const installBlocksDependencies = async function(blocks: IMaterialBlock[]) {
  const projectPackageJSON = await readPackageJSON(projectPath);
  const { activeTerminal } = vscode.window;

  // get all dependencies from blocks
  const blocksDependencies: { [packageName: string]: string } = {};
  blocks.forEach(({ dependencies }: any) => Object.assign(blocksDependencies, dependencies));

  // filter existing dependencies of project
  const filterDependencies: { [packageName: string]: string }[] = [];
  Object.keys(blocksDependencies).forEach(packageName => {
    if (!projectPackageJSON.dependencies.hasOwnProperty(packageName)) {
      filterDependencies.push({
        [packageName]: blocksDependencies[packageName],
      });
    }
  });

  if (filterDependencies.length > 0) {
    let terminal: vscode.Terminal;
    if (activeTerminal) {
      terminal = activeTerminal;
    } else {
      terminal = vscode.window.createTerminal();
    }

    const npmClient = vscode.workspace.getConfiguration('iceworks').get('packageManager') || 'npm';

    terminal.show();
    terminal.sendText(`cd ${projectPath}`, true);

    return await Promise.all(
      filterDependencies.map(async dependency => {
        const [packageName, version]: [string, string] = Object.entries(dependency)[0];
        await terminal.sendText(`${npmClient} install ${packageName}@${version}`, true);
      }),
    );
  } else {
    return [];
  }
}
