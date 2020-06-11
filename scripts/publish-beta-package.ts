/**
 * Scripts to check unpublished version and run publish
 */
import * as path from 'path';
import * as fs from 'fs-extra';
import { spawnSync } from 'child_process';
import { IPackageInfo, getPackageInfos } from './getPackageInfos';

const BETA_REG = /([^-]+)-beta\.(\d+)/; // '1.0.0-beta.1'

function publish(pkg: string, localVersion: string, directory: string): void {

  let version: string = localVersion;
  let betaVersion = 1;

  try {
    if (!BETA_REG.test(localVersion)) {
      // Add beta version
      const childProcess = spawnSync('npm', [
        'show', pkg, 'dist-tags',
        '--json',
      ], {
        encoding: 'utf-8'
      });
      const distTags = JSON.parse(childProcess.stdout) || {};
      const matched = (distTags.beta || '').match(BETA_REG);
      
      // 1.0.0-beta.1 -> ["1.0.0-beta.1", "1.0.0", "1"] -> 1.0.0-beta.2
      if (matched && matched[1] === localVersion && matched[2]) {
        betaVersion = Number(matched[2]) + 1;
      }
      version += `-beta.${betaVersion}`;
    }

    // Set beta version
    const packageFile = path.join(directory, 'package.json');
    const packageData = fs.readJsonSync(packageFile);
    packageData.version = version;
    fs.writeFileSync(packageFile, JSON.stringify(packageData, null, 2));

    console.log('[PUBLISH BETA]', `${pkg}@${version}`);

    spawnSync('npm', [
      'publish',
      '--tag=beta',
    ], {
      stdio: 'inherit',
      cwd: directory,
    });
  } catch (e) {
    console.log('[ERROR]', e);
  }
}

// Entry
console.log('[PUBLISH BETA] Start:');
getPackageInfos().then((packageInfos: IPackageInfo[]) => {
  // Publish
  let publishedCount = 0;
  for (let i = 0; i < packageInfos.length; i++) {
    const { name, directory, localVersion, shouldPublish } = packageInfos[i];
    if (shouldPublish) {
      publishedCount++;
      console.log(`--- ${name}@${localVersion} ---`);
      publish(name, localVersion, directory);
    }
  }
  console.log(`[PUBLISH BETA] Complete (count=${publishedCount}).`)
});