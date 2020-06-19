/**
 * Scripts to check unpublished version and run beta publish
 */
import * as oss from 'ali-oss';
import * as path from 'path';
import * as fs from 'fs-extra';
import { spawnSync } from 'child_process';
import { IExtensionInfo, getExtensionInfos } from './getExtensionInfos';
import extensionDepsInstall from './fn/extension-deps-install';

const ossClient = oss({
  bucket: 'iceworks',
  endpoint: 'oss-cn-hangzhou.aliyuncs.com',
  accessKeyId: process.env.ACCESS_KEY_ID,
  accessKeySecret: process.env.ACCESS_KEY_SECRET,
  timeout: '120s',
});

function updateBetaDependencies(extension: string, directory: string) {
  try {
    const publishedPackages: string[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'publishedPackages.temp.json'), 'utf-8'));
    const packageFile = path.join(directory, 'package.json');
    const packageData = fs.readJsonSync(packageFile);

    publishedPackages.forEach((publishedPackage: string) => {
      const info = publishedPackage.split(':');
      const name = info[0];
      const version = info[1];

      if (packageData.dependencies[name]) {
        packageData.dependencies[name] = version;
      } else if (packageData.devDependencies[name]) {
        packageData.devDependencies[name] = version;
      }
    });
    fs.writeFileSync(packageFile, JSON.stringify(packageData, null, 2));

  } catch (e) {
    console.log(`[ERROR] ${extension} upload beta package dependencies failed.`, e);
  }
};

function publish(extension: string, directory: string, version: string): void {
  // npm install
  extensionDepsInstall();

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
      updateBetaDependencies(name, directory);
      publish(name, directory, localVersion);
      publishedExtensions.push(`${name}:${localVersion}`);
    }
  }
  console.log(`[PUBLISH EXTENSION BETA] Complete (count=${publishedCount}):`);
  console.log(`${publishedExtensions.join('\n')}`);
});
