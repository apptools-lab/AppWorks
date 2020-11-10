import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import axios from 'axios';

const RETRY_LIMIT = 3;
const TIMEOUT = 8000; // ms
const TARGET_DIRECTORY = join(__dirname, '../../extensions');

export interface IExtensionInfo {
  name: string;
  directory: string;
  localVersion: string;
  shouldPublish: boolean;
}

function checkVersionExists(extension: string, version: string, retry = 0): Promise<boolean> {
  return axios
    .get(
      // Use VS Code Extension assets icon check version.
      `http://iceworks-team.gallery.vsassets.io/_apis/public/gallery/publisher/iceworks-team/extension/${encodeURIComponent(
        extension,
      )}/${encodeURIComponent(version)}/assetbyname/Microsoft.VisualStudio.Services.Icons.Default`,
      { timeout: TIMEOUT },
    )
    .then((res) => res.status === 200)
    .catch((err) => {
      if ((err.response && err.response.status === 404) || (retry && retry >= RETRY_LIMIT)) {
        return false;
      } else {
        console.log(`Retry check ${extension}@${version} Times: ${retry + 1}`);
        return checkVersionExists(extension, version, retry + 1);
      }
    });
}

export async function getExtensionInfos(): Promise<IExtensionInfo[]> {
  const extensionInfos: IExtensionInfo[] = [];

  if (!existsSync(TARGET_DIRECTORY)) {
    console.log(`[ERROR] Directory ${TARGET_DIRECTORY} not exist!`);
  } else {
    const extensionFolders: string[] = readdirSync(TARGET_DIRECTORY).filter((filename) => filename[0] !== '.');

    console.log('[PUBLISH] Start check with following extensions:');
    await Promise.all(
      extensionFolders.map(async (extensionFolder) => {
        const directory = join(TARGET_DIRECTORY, extensionFolder);
        const packageInfoPath = join(directory, 'package.json');

        // Process extension info.
        if (existsSync(packageInfoPath)) {
          const packageInfo = JSON.parse(readFileSync(packageInfoPath, 'utf8'));
          const extensionName = packageInfo.name || extensionFolder;

          console.log(`- ${extensionName}`);

          try {
            extensionInfos.push({
              name: extensionName,
              directory,
              localVersion: packageInfo.version,
              // If localVersion not exist, publish it
              shouldPublish: !(await checkVersionExists(extensionName, packageInfo.version)),
            });
          } catch (e) {
            console.log(`[ERROR] get ${extensionName} information failed: `, e);
          }
        } else {
          console.log(`[ERROR] ${extensionFolder}'s package.json not found.`);
        }
      }),
    );
  }
  return extensionInfos;
}
