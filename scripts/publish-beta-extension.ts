/**
 * Scripts to check unpublished version and run beta publish
 */
import * as path from 'path';
import * as fs from 'fs-extra';
import { spawnSync } from 'child_process';
import uploadExtesions from './upload-extensions';
import { getPublishedPackages } from './published-info';
import { IExtensionInfo, getExtensionInfos } from './getExtensionInfos';
import extensionDepsInstall from './fn/extension-deps-install';

function updateBetaDependencies(extension: string, directory: string) {
  try {
    const publishedPackages: string[] = getPublishedPackages();

    if (fs.existsSync(directory)) {
      const packageFile = path.join(directory, 'package.json');
      const packageData = fs.readJsonSync(packageFile);

      publishedPackages.forEach((publishedPackage: string) => {
        const info = publishedPackage.split(':');
        const name = info[0];
        const version = info[1];

        if (packageData.dependencies && packageData.dependencies[name]) {
          packageData.dependencies[name] = version;
        } else if (packageData.devDependencies && packageData.devDependencies[name]) {
          packageData.devDependencies[name] = version;
        }
      });
      fs.writeFileSync(packageFile, JSON.stringify(packageData, null, 2));
    }
  } catch (e) {
    console.log(`[ERROR] ${extension} update beta package dependencies failed.`, e);
  }
};

function publish(extension: string, directory: string, version: string): void {
  // vsce package
  console.log('[VSCE] PACKAGE: ', `${extension}@${version}`);
  spawnSync('vsce', [
    'package',
  ], {
    stdio: 'inherit',
    cwd: directory,
  });
}

// Entry
console.log('[PUBLISH BETA] Start:');
getExtensionInfos().then((extensionInfos: IExtensionInfo[]) => {
  const shouldPublishExtensions: IExtensionInfo[] = [];

  for (let i = 0; i < extensionInfos.length; i++) {
    const { name, directory, shouldPublish } = extensionInfos[i];
    if (shouldPublish) {
      // Update extension package json
      updateBetaDependencies(name, directory);
      // Update inside web project package json
      updateBetaDependencies(name, path.join(directory, 'web'));

      shouldPublishExtensions.push(extensionInfos[i]);
    }
  }

  // npm install
  extensionDepsInstall();

  // Publish
  let publishedCount = 0;
  const publishedExtensions = [];
  for (let i = 0; i < shouldPublishExtensions.length; i++) {
    const { name, directory, localVersion } = shouldPublishExtensions[i];
    publishedCount++;
    console.log(`--- ${name}@${localVersion} ---`);

    publish(name, directory, localVersion);
    publishedExtensions.push(`${name}:${localVersion}`);
  }
  uploadExtesions(publishedExtensions);
  console.log(`[PUBLISH EXTENSION BETA] Complete (count=${publishedCount}):`);
  console.log(`${publishedExtensions.join('\n')}`);
});
