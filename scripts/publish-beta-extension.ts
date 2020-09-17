/**
 * Scripts to check unpublished version and run beta publish
 */
import * as path from 'path';
import { spawnSync } from 'child_process';
import uploadExtesions from './upload-extensions';
import { IExtensionInfo, getExtensionInfos } from './getExtensionInfos';
import extensionDepsInstall from './fn/extension-deps-install';
import updateExtensionDependencies from './fn/updateExtensionDependencies';

// Wait for npm module publish and sync.
function sleep(time) {
  console.log(`start sleep: ${time} ms`);
  return new Promise((resolve) => setTimeout(resolve, time));
}

function publish(extension: string, directory: string, version: string): void {
  // vsce package
  console.log('[VSCE] PACKAGE: ', `${extension}@${version}`);
  spawnSync('vsce', ['package'], {
    stdio: 'inherit',
    cwd: directory,
  });
}

// Entry
sleep(30000).then(() => {
  console.log('[PUBLISH BETA] Start:');
  getExtensionInfos().then((extensionInfos: IExtensionInfo[]) => {
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

      publish(name, directory, localVersion);
      publishedExtensions.push(`${name}:${localVersion}`);
    }
    uploadExtesions(publishedExtensions);
    console.log(`[PUBLISH EXTENSION BETA] Complete (count=${publishedCount}):`);
    console.log(`${publishedExtensions.join('\n')}`);
  });
});
