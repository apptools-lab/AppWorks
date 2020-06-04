import * as path from 'path';
import * as vscode from 'vscode';
import * as fsExtra from 'fs-extra';
import { getAndExtractTarball, readPackageJSON } from 'ice-npm-utils';
import { getTarballURLByMaterielSource, IMaterialBlock } from '@iceworks/material-utils';
import { projectPath } from '@iceworks/project-service';
import * as upperCamelCase from 'uppercamelcase';

/**
 * Generate block code
 */
export const bulkGenerate = async function(blocks: IMaterialBlock[], localPath: string) {
  await bulkDownload(blocks, localPath);
  await bulkInstallDependencies(blocks);
}

/**
 * Download blocks code to page
 */
export const bulkDownload = async function(blocks: IMaterialBlock[], localPath: string) {
  return await Promise.all(
    blocks.map(async (block: any) => {
      const blockSourceNpm = block.source.npm;

      await fsExtra.mkdirp(localPath);
      const blockName: string = upperCamelCase(block.name);

      let tarballURL: string;
      try {
        tarballURL = await getTarballURLByMaterielSource(block.source);
      } catch (error) {
        error.message = `Failed to get tarball URL of ${blockSourceNpm}, you can copy ${block.repository}`;
        throw error;
      }

      const blockDir = path.join(localPath, blockName);
      const blockTempDir = path.join(localPath, `.${blockName}.temp`);

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
    }),
  );
}

/**
 * Installation block dependencies
 */
export const bulkInstallDependencies = async function(blocks: IMaterialBlock[]) {
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
    const deps = filterDependencies.map(dependency => {
      const [packageName, version]: [string, string] = Object.entries(dependency)[0];
      return `${packageName}@${version}`;
    });
    const packageManager = vscode.workspace.getConfiguration('iceworks').get('packageManager', 'npm');
    const npmRegistry = vscode.workspace.getConfiguration('iceworks').get('npmRegistry', 'https://registry.npm.taobao.org');

    let terminal: vscode.Terminal;
    if (activeTerminal) {
      terminal = activeTerminal;
    } else {
      terminal = vscode.window.createTerminal();
    }

    terminal.show();
    terminal.sendText(`cd ${projectPath}`, true);
    terminal.sendText(`${packageManager} install ${deps.join(' ')} --registry ${npmRegistry} --save`, true);
  } else {
    return [];
  }
}
