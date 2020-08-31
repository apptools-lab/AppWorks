/**
 * Scripts to check unpublished version and run publish
 */
import * as path from 'path';
import { spawnSync } from 'child_process';
import { getLatestVersion } from 'ice-npm-utils';
import uploadExtesions from './upload-extensions';
import { getPublishedPackages } from './published-info';
import { IExtensionInfo, getExtensionInfos } from './getExtensionInfos';
import extensionDepsInstall from './fn/extension-deps-install';
import updateBetaDependencies from './fn/updateExtensionDependencies';

// Wait for npm module publish and sync.
function sleep(time) {
  console.log(`start sleep: ${time} ms`);
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Check published packages can be installed.
function checkPackagePublished() {
  const publishedPackages: string[] = getPublishedPackages();

  const timeout = 10000;
  const maxDetectTimes = 30;
  return Promise.all(
    publishedPackages.map((publishedPackage) => {
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
            getLatestVersion(name)
              .then((latestVersion) => {
                if (version === latestVersion) {
                  // Can be installed.
                  clearInterval(timer);
                  resolve();
                }
              })
              .catch(() => {
                // ignore
              });
          }
        }, timeout);
      });
    })
  );
}

function packExtension(extension: string, directory: string, version: string) {
  console.log('[VSCE] PACK: ', `${extension}@${version}`);
  spawnSync('vsce', ['package'], {
    stdio: 'inherit',
    cwd: directory,
  });
}

function publish(extension: string, directory: string, version: string): void {
  // vsce publish
  console.log('[VSCE] PUBLISH: ', `${extension}@${version}`);
  spawnSync('vsce', ['publish', '-p', process.env.VSCE_TOKEN], {
    stdio: 'inherit',
    cwd: directory,
  });
}

async function start() {
  try {
    await checkPackagePublished();
    await sleep(50000);
    console.log('[PUBLISH] Start:');

    const extensionInfos: IExtensionInfo[] = await getExtensionInfos();
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
    const extensions = [];
    const publishedExtensions = [];
    for (let i = 0; i < shouldPublishExtensions.length; i++) {
      const { name, directory, localVersion } = extensionInfos[i];
      // Production publish should zip all extensions.
      // Pack extension first.
      extensions.push(`${name}:${localVersion}`);
      packExtension(name, directory, localVersion);
        publishedCount++;
        console.log(`--- ${name}@${localVersion} ---`);
        publish(name, directory, localVersion);
        publishedExtensions.push(`${name}:${localVersion}`);
    }
    uploadExtesions(extensions, true);
    console.log(`[PUBLISH EXTENSION PRODUCTION] Complete (count=${publishedCount}):`);
    console.log(`${publishedExtensions.join('\n')}`);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

start();
