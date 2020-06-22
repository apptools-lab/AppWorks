/**
 * Scripts to check unpublished version and run publish
 */
import { spawnSync } from 'child_process';
import { IExtensionInfo, getExtensionInfos } from './getExtensionInfos';
import extensionDepsInstall from './fn/extension-deps-install';

// Wait for npm module publish and sync.
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function publish(extension: string, directory: string, version: string): void {
  // vsce publish
  console.log('[VSCE] PUBLISH: ', `${extension}@${version}`);
  spawnSync('vsce', [
    'publish',
    '-p',
    process.env.VSCE_TOKEN
  ], {
    stdio: 'inherit',
    cwd: directory,
  });
}

// Wait 10s for npm
sleep(10000).then(() => {
  // Entry
  console.log('[PUBLISH] Start:');
  getExtensionInfos().then((extensionInfos: IExtensionInfo[]) => {
    // npm install
    extensionDepsInstall();

    // Publish
    let publishedCount = 0;
    const publishedExtensions = [];
    for (let i = 0; i < extensionInfos.length; i++) {
      const { name, directory, localVersion, shouldPublish } = extensionInfos[i];
      if (shouldPublish) {
        publishedCount++;
        console.log(`--- ${name}@${localVersion} ---`);
        publish(name, directory, localVersion);
        publishedExtensions.push(`${name}:${localVersion}`);
      }
    }
    console.log(`[PUBLISH EXTENSION PRODUCTION] Complete (count=${publishedCount}):`);
    console.log(`${publishedExtensions.join('\n')}`);
  });
});
