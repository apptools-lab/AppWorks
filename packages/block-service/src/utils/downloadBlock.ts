import * as path from 'path';
import * as fsExtra from 'fs-extra';
import { getAndExtractTarball } from 'ice-npm-utils';
import { IMaterialBlock, getTarballURLByMaterielSource } from '@iceworks/material-utils';
import { getIceVersion, getPackageJSON, packageJSONPath } from '@iceworks/project-service';
import i18n from './i18n';

export async function downloadBlock(block: IMaterialBlock, targetDir: string, log: (text: string) => void): Promise<string> {
  const { name: blockName, source, repository } = block;
  const projectPackageJSON = await getPackageJSON(packageJSONPath);
  await fsExtra.mkdirp(targetDir);

  const iceVersion: string = getIceVersion(projectPackageJSON);

  let tarballURL: string;
  try {
    log(i18n.format('entension.block-service.downloadBlock.getDownloadUrl'));
    tarballURL = await getTarballURLByMaterielSource(source, iceVersion);
  } catch (error) {
    error.message = i18n.format('entension.block-service.downloadBlock.getDownloadUrlError',{_repository:repository});
    throw error;
  }

  log(i18n.format('entension.block-service.downloadBlock.unzipCode'));
  const blockDir = path.join(targetDir, blockName);
  const blockTempDir = path.join(targetDir, `.${blockName}.temp`);
  try {
    await getAndExtractTarball(
      blockTempDir,
      tarballURL,
      ({ percent }) => {
        log(i18n.format('entension.block-service.downloadBlock.process',{_percent:(percent * 100).toFixed(2)}));
      }
    );
  } catch (error) {
    error.message = i18n.format('entension.block-service.downloadBlock.unzipCodeError',{_blockName:blockName,_tarballURL:tarballURL});
    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
      error.message = i18n.format('entension.block-service.downloadBlock.downloadError',{_blockName:blockName,_tarballURL:tarballURL}); 
    }
    await fsExtra.remove(blockTempDir);
    throw error;
  }

  await fsExtra.move(path.join(blockTempDir, 'src'), blockDir);
  await fsExtra.remove(blockTempDir);
  return blockDir;
}