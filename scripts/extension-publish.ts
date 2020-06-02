/**
 * Scripts to check unpublished version and run publish
 */
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';
import axios from 'axios';

const RETRY_LIMIT = 3;
const TIMEOUT = 5000; // ms
const TARGET_DIRECTORY = join(__dirname, '../extensions');

interface IExtensionInfo {
  name: string;
  directory: string;
  localVersion: string;
  shouldBuild: boolean; // If extension exists script build, need run build then publish.
  shouldPublish: boolean;
}

function checkVersionExists(extension: string, version: string, retry = 0): Promise<boolean> {
  return axios.get(
    // Use VS Code Extension assets icon check version.
    `http://rax.gallery.vsassets.io/_apis/public/gallery/publisher/Rax/extension/${encodeURIComponent(extension)}/${encodeURIComponent(version)}/assetbyname/Microsoft.VisualStudio.Services.Icons.Default`,
    { timeout: TIMEOUT },
  )
    .then(res => res.status === 200)
    .catch(err => {
      if (err.response && err.response.status === 404 || (retry && retry >= RETRY_LIMIT)) {
        return false;
      } else {
        console.log(`Retry check ${extension}@${version} Times: ${retry + 1}`);
        return checkVersionExists(extension, version, retry + 1);
      }
    });
}

function publish(extension: string, directory: string, version: string, shouldBuild: boolean): void {
  // npm install
  spawnSync('npm', [
    'install',
  ], {
    stdio: 'inherit',
    cwd: directory,
  });

  // npm run build
  if (shouldBuild) {
    spawnSync('npm', [
      'run',
      'build',
    ], {
      stdio: 'inherit',
      cwd: directory,
    });
  }

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

async function getExtensionInfos(): Promise<IExtensionInfo[]> {
  const extensionInfos: IExtensionInfo[] = [];

  if (!existsSync(TARGET_DIRECTORY)) {
    console.log(`[ERROR] Directory ${TARGET_DIRECTORY} not exist!`);
  } else {
    const extensionNames: string[] = readdirSync(TARGET_DIRECTORY).filter((filename) => filename[0] !== '.');

    console.log('[PUBLISH] Start check with following extensions:');
    await Promise.all(extensionNames.map(async (extensionName) => {
      console.log(`- ${extensionName}`);

      const directory = join(TARGET_DIRECTORY, extensionName);
      const packageInfoPath = join(directory, 'package.json');

      // Process extension info.
      if (existsSync(packageInfoPath)) {
        const packageInfo = JSON.parse(readFileSync(packageInfoPath, 'utf8'));
        try {
          extensionInfos.push({
            name: extensionName,
            directory,
            localVersion: packageInfo.version,
            shouldBuild: !!(packageInfo.scripts && packageInfo.scripts.build),
            // If localVersion not exist, publish it
            shouldPublish: !await checkVersionExists(extensionName, packageInfo.version)
          });
        } catch (e) {
          console.log(`[ERROR] get ${extensionName} information failed: `, e);
        }
      } else {
        console.log(`[ERROR] ${extensionName}'s package.json not found.`);
      }
    }));
  }
  return extensionInfos;
}

// Entry
getExtensionInfos().then((extensionInfos: IExtensionInfo[]) => {
  // Publish
  console.log('');
  if (extensionInfos.length === 0) {
    console.log('[PUBLISH] No diff with all extensions.');
  } else {
    console.log('[PUBLISH] Will publish following extensions:');
  }

  for (let i = 0; i < extensionInfos.length; i++) {
    const { name, directory, localVersion, shouldBuild, shouldPublish } = extensionInfos[i];
    if (shouldPublish) {
      console.log(`--- ${name}@${localVersion} ---`);
      publish(name, directory, localVersion, shouldBuild);
    }
  }
});