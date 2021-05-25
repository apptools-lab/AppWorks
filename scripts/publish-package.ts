/**
 * Scripts to check unpublished version and run publish
 */
import { spawnSyncWithCatch } from './fn/spawnSyncWithCatch';
import { setPublishedPackages } from './fn/published-info';
import { IPackageInfo, getPackageInfos } from './fn/getPackageInfos';

function publish(pkg: string, version: string, directory: string): void {
  console.log('[PUBLISH]', `${pkg}@${version}`);

  spawnSyncWithCatch(
    'npm',
    [
      'publish',
      // use default registry
    ],
    directory,
  );
}

// Entry
console.log('[PUBLISH] Start:');
getPackageInfos().then((packageInfos: IPackageInfo[]) => {
  // Publish
  let publishedCount = 0;
  const publishedPackages = [];
  for (let i = 0; i < packageInfos.length; i++) {
    const { name, directory, localVersion, shouldPublish } = packageInfos[i];
    if (shouldPublish) {
      publishedCount++;
      console.log(`--- ${name}@${localVersion} ---`);
      publish(name, localVersion, directory);
      publishedPackages.push(`${name}:${localVersion}`);
    }
  }
  console.log(`[PUBLISH PACKAGE PRODUCTION] Complete (count=${publishedCount}):`);
  console.log(`${publishedPackages.join('\n')}`);
  setPublishedPackages(publishedPackages);
});
