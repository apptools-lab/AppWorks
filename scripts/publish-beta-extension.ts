/**
 * Scripts to check unpublished version and run beta publish
 */
import * as path from 'path';
import { execSync } from 'child_process';
import uploadExtesions from './fn/upload-extensions';
import { IExtensionInfo, getExtensionInfos } from './fn/getExtensionInfos';
import sleep from './fn/sleep';
import checkPackagePublished from './fn/checkPackagePublished';
import extensionDepsInstall from './fn/extension-deps-install';
import updateExtensionDependencies from './fn/updateExtensionDependencies';

function packExtension(extension: string, directory: string, version: string): void {
  // vsce package
  console.log('[VSCE] PACKAGE: ', `${extension}@${version}`);
  execSync('vsce package', {
    stdio: 'inherit',
    cwd: directory,
  });
}

async function start() {
  try {
    await checkPackagePublished(true);
    await sleep(50000);
    console.log('[PUBLISH BETA] Start:');
    const extensionInfos: IExtensionInfo[] = await getExtensionInfos();
    const shouldPublishExtensions: IExtensionInfo[] = [];

    for (let i = 0; i < extensionInfos.length; i++) {
      const { name, directory, shouldPublish } = extensionInfos[i];
      if (shouldPublish) {
        // Update extension package json
        updateExtensionDependencies(name, directory);
        // Update inside web project package json
        updateExtensionDependencies(name, path.join(directory, 'web'));

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

      packExtension(name, directory, localVersion);
      publishedExtensions.push(`${name}:${localVersion}:${directory}`);
    }
    uploadExtesions(publishedExtensions);
    console.log(`[PUBLISH EXTENSION BETA] Complete (count=${publishedCount}):`);
    console.log(`${publishedExtensions.join('\n')}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

start();
