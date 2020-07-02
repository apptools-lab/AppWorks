/**
 * Scripts to check unpublished version and run publish
 */
import * as path from 'path';
import * as fs from 'fs-extra';
import axios from 'axios';
import { spawnSync } from 'child_process';
import { IExtensionInfo, getExtensionInfos } from './getExtensionInfos';
import extensionDepsInstall from './fn/extension-deps-install';

// Check published packages can be installed.
function checkPackagePublished() {
  const publishedPackages: string[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'publishedPackages.temp.json'), 'utf-8'));

  const timeout = 1000;
  const maxDetectTimes = 3; 
  return Promise.all(publishedPackages.map((publishedPackage) => {
    return new Promise((resolve, retject) => {
      
      const info = publishedPackage.split(':');
      // Example: @iceworks/project-service:0.1.8:lib/index.js
      const name = info[0];
      const version = info[1];
      const mainFile = info[2];

      let times = 0;
      const timer = setInterval(() => {
        if (times++ > maxDetectTimes) {
          // Exit if detect times over maxDetectTimes.
          clearInterval(timer);
          retject(new Error(`${name}@${version} publish failed! Please try again.`));
        } else {
          axios(
            `https://unpkg.com/${name}@${version}/${mainFile}`
          ).then(() => {
            // Can be installed.
            clearInterval(timer);
            resolve();
          }).catch(() => {
            // ignore
          })
        }
      }, timeout);
    })
  }));
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
}).catch((e) => {
  console.error(e);
});
