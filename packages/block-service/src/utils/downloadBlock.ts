import * as path from 'path';
import * as fsExtra from 'fs-extra';
import * as vscode from 'vscode';
import { getAndExtractTarball } from 'ice-npm-utils';
import { IMaterialBlock, getTarballURLByMaterielSource } from '@iceworks/material-utils';
import { getIceVersion, packageJSONFilename, getPackageJSON } from '@iceworks/project-service';

const { workspace } = vscode;

const projectPath = workspace.rootPath!;
const packagePath = path.join(projectPath, packageJSONFilename);

export async function downloadBlock(block: IMaterialBlock, targetDir: string, log: (text: string) => void): Promise<string> {
  const { name: blockName, source, repository } = block;
  const projectPackageJSON = await getPackageJSON(packagePath);
  await fsExtra.mkdirp(targetDir);

  const iceVersion: string = getIceVersion(projectPackageJSON);

  let tarballURL: string;
  try {
    log('获取区块代码包下载地址');
    tarballURL = await getTarballURLByMaterielSource(source, iceVersion);
  } catch (error) {
    error.message = `获取区块代码包地址失败，请手动拷贝代码仓库：${repository}`;
    throw error;
  }

  log('下载区块代码包并解压');
  const blockDir = path.join(targetDir, blockName);
  const blockTempDir = path.join(targetDir, `.${blockName}.temp`);
  try {
    await getAndExtractTarball(
      blockTempDir,
      tarballURL,
      ({ percent }) => {
        log(`===>>> 进度：${(percent * 100).toFixed(2)}%`);
      }
    );
  } catch (error) {
    error.message = `解压区块${blockName}出错，请手动下载区块：${tarballURL}`;
    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
      error.message = `区块${blockName}下载超时，请手动下载区块：${tarballURL}`;
    }
    await fsExtra.remove(blockTempDir);
    throw error;
  }

  await fsExtra.move(path.join(blockTempDir, 'src'), blockDir);
  await fsExtra.remove(blockTempDir);
  return blockDir;
}