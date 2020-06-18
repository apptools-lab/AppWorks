/**
 * Scripts to check unpublished version and run publish
 */
import { spawnSync } from 'child_process';
import { IExtensionInfo, getExtensionInfos } from './getExtensionInfos';

function publish(extension: string, directory: string, version: string): void {
  // npm install
  spawnSync('npm', [
    'install',
  ], {
    stdio: 'inherit',
    cwd: directory,
  });

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

// Entry
console.log('[PUBLISH] Start:');
getExtensionInfos().then((extensionInfos: IExtensionInfo[]) => {
  // Publish
  let publishedCount = 0;
  for (let i = 0; i < extensionInfos.length; i++) {
    const { name, directory, localVersion, shouldPublish } = extensionInfos[i];
    if (shouldPublish) {
      publishedCount++;
      console.log(`--- ${name}@${localVersion} ---`);
      publish(name, directory, localVersion);
    }
  }
  console.log(`[PUBLISH] Complete (count=${publishedCount}).`);
});
