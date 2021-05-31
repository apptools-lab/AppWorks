/**
 * Scripts to check unpublished version and run publish
 */
import * as path from 'path';
import { execSync } from 'child_process';
import uploadExtesions, { SKIP_PACK_EXTENSION_LIST } from './fn/upload-extensions';
import { IExtensionInfo, getExtensionInfos } from './fn/getExtensionInfos';
import sleep from './fn/sleep';
import checkPackagePublished from './fn/checkPackagePublished';
import extensionDepsInstall from './fn/extension-deps-install';
import updateExtensionDependencies from './fn/updateExtensionDependencies';

function packExtension(extension: string, directory: string, version: string) {
  if (SKIP_PACK_EXTENSION_LIST.indexOf(extension) > -1) {
    return;
  }
  console.log('[VSCE] PACK: ', `${extension}@${version}`);
  execSync('vsce package', {
    stdio: 'inherit',
    cwd: directory,
  });
}

function publish(extension: string, directory: string, version: string): void {
  // vsce publish
  console.log('[VSCE] PUBLISH: ', `${extension}@${version}`);
  execSync(`vsce publish -p ${process.env.VSCE_TOKEN}`, {
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
        updateExtensionDependencies(name, directory);
        // Update inside web project package json
        updateExtensionDependencies(name, path.join(directory, 'web'));

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
      const { name, directory, localVersion } = shouldPublishExtensions[i];
      // Production publish should zip all extensions.
      // Pack extension first.
      extensions.push(`${name}:${localVersion}:${directory}`);
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
