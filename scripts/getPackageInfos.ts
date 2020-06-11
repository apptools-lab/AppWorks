import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import axios from 'axios';

const TIMEOUT = 8000; // ms
const TARGET_DIRECTORY = join(__dirname, '../packages');

export interface IPackageInfo {
  name: string;
  directory: string;
  localVersion: string;
  mainFile: string; // package.json main file
  shouldPublish: boolean;
}

function checkBuildSuccess(directory: string, mainFile: string): boolean {
  return existsSync(join(directory, mainFile));
}

function checkVersionExists(pkg: string, version: string, mainFile: string): Promise<boolean> {
  return axios(
    `https://unpkg.com/${pkg}@${version}/${mainFile}`,
    { timeout: TIMEOUT }
  )
    .then((res) => res.status === 200)
    .catch(() => false);
}

export async function getPackageInfos(): Promise<IPackageInfo[]> {
  const packageInfos: IPackageInfo[] = [];
  if (!existsSync(TARGET_DIRECTORY)) {
    console.log(`[ERROR] Directory ${TARGET_DIRECTORY} not exist!`);
  } else {
    const packageFolders: string[] = readdirSync(TARGET_DIRECTORY).filter((filename) => filename[0] !== '.');
    console.log('[PUBLISH] Start check with following packages:');
    await Promise.all(packageFolders.map(async (packageFolder) => {

      const directory = join(TARGET_DIRECTORY, packageFolder);
      const packageInfoPath = join(directory, 'package.json');

      // Process package info.
      if (existsSync(packageInfoPath)) {

        const packageInfo = JSON.parse(readFileSync(packageInfoPath, 'utf8'));
        const packageName = packageInfo.name || packageFolder;

        console.log(`- ${packageName}`);

        try {
          packageInfos.push({
            name: packageName,
            directory,
            localVersion: packageInfo.version,
            mainFile: packageInfo.main,
            // If localVersion not exist, publish it
            shouldPublish:
              checkBuildSuccess(directory, packageInfo.main) &&
              !await checkVersionExists(packageName, packageInfo.version, packageInfo.main)
          });
        } catch (e) {
          console.log(`[ERROR] get ${packageName} information failed: `, e);
        }
      } else {
        console.log(`[ERROR] ${packageFolder}'s package.json not found.`);
      }
    }));
  }
  return packageInfos;
}