/**
 * Scripts to check unpublished version and run beta publish
 */
import * as oss from 'ali-oss';
import * as path from 'path';
import { spawnSync } from 'child_process';
import { IExtensionInfo, getExtensionInfos } from './getExtensionInfos';

const ossClient = oss({
  bucket: 'iceworks',
  endpoint: 'oss-cn-hangzhou.aliyuncs.com',
  accessKeyId: process.env.ACCESS_KEY_ID,
  accessKeySecret: process.env.ACCESS_KEY_SECRET,
  timeout: '120s',
});

function publish(extension: string, directory: string, version: string): void {
  // vsce package
  console.log('[VSCE] PACKAGE: ', `${extension}@${version}`);
  spawnSync('vsce', [
    'package',
  ], {
    stdio: 'inherit',
    cwd: directory,
  });

  // Upload to oss
  const extensionFile = `${extension}-${version}.vsix`;
  const extensionFilePath = path.resolve(directory, extensionFile);
  ossClient
    .put(`vscode-extensions/beta/${extensionFile}`, extensionFilePath)
    .then(() => {
      console.log(`[PUBLISH BETA] ${extensionFile} upload success.`);
    })
    .catch(() => {
      console.log(`[ERROR] ${extensionFile} upload failed.`);
    });
}

// Entry
console.log('[PUBLISH BETA] Start:');
getExtensionInfos().then((extensionInfos: IExtensionInfo[]) => {
  // Publish
  let publishedCount = 0;
  const publishedExtensions = [];
  for (let i = 0; i < extensionInfos.length; i++) {
    const { name, directory, localVersion, shouldPublish } = extensionInfos[i];
    if (shouldPublish) {
      publishedCount++;
      console.log(`--- ${name}@${localVersion} ---`);
      publish(name, directory, localVersion);
      publishedExtensions.push(`${name}@${localVersion}`);
    }
  }
  console.log(`[PUBLISH EXTENSION BETA] Complete (count=${publishedCount}):`);
  console.log(`${publishedExtensions.join('\n')}`);
});
