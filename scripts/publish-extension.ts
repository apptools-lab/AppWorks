/**
 * Scripts to check unpublished version and run publish
 */
import { spawnSync } from 'child_process';
import { getLatestVersion } from 'ice-npm-utils';
import uploadExtesions from './upload-extensions';
import { getPublishedPackages } from './published-info';
import { IExtensionInfo, getExtensionInfos } from './getExtensionInfos';
import extensionDepsInstall from './fn/extension-deps-install';

// Check published packages can be installed.
function checkPackagePublished() {
  const publishedPackages: string[] = getPublishedPackages();

  const timeout = 10000;
  const maxDetectTimes = 30;
  return Promise.all(publishedPackages.map((publishedPackage) => {
    return new Promise((resolve, retject) => {

      const info = publishedPackage.split(':');
      // Example: @iceworks/project-service:0.1.8
      const name = info[0];
      const version = info[1];

      let times = 0;
      const timer = setInterval(() => {
        if (times++ > maxDetectTimes) {
          // Exit if detect times over maxDetectTimes.
          clearInterval(timer);
          retject(new Error(`${name}@${version} publish failed! Please try again.`));
        } else {
          getLatestVersion(name).then((latestVersion) => {
            if (version === latestVersion) {
              // Can be installed.
              clearInterval(timer);
              resolve();
            }
          }).catch(() => {
            // ignore
          })
        }
      }, timeout);
    })
  }));
}
 
function packExtension(extension: string, directory: string, version: string) {
  console.log('[VSCE] PACK: ', `${extension}@${version}`);
  spawnSync('vsce', [
    'package',
  ], {
    stdio: 'inherit',
    cwd: directory,
  });
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

checkPackagePublished().then(() => {
  // Entry
  console.log('[PUBLISH] Start:');
  getExtensionInfos().then((extensionInfos: IExtensionInfo[]) => {
    // npm install
    extensionDepsInstall();

    // Publish
    let publishedCount = 0;
    const extensions = [];
    const publishedExtensions = [];
    for (let i = 0; i < extensionInfos.length; i++) {
      const { name, directory, localVersion, shouldPublish } = extensionInfos[i];
      // Production publish should zip all extensions.
      // Pack extension first.
      extensions.push(`${name}:${localVersion}`);
      packExtension(name, directory, localVersion);

      if (shouldPublish) {
        publishedCount++;
        console.log(`--- ${name}@${localVersion} ---`);
        publish(name, directory, localVersion);
        publishedExtensions.push(`${name}:${localVersion}`);
      }
    }
    uploadExtesions(extensions, true);
    console.log(`[PUBLISH EXTENSION PRODUCTION] Complete (count=${publishedCount}):`);
    console.log(`${publishedExtensions.join('\n')}`);
  });
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
