/**
 * Scripts to upload extension pack to OSS
 */
import * as path from 'path';
import * as fs from 'fs-extra';
import * as AdmZip from 'adm-zip';
import upload from './uploadToIceworksOSS';

const zip = new AdmZip();

const ZIP_NAME = 'AppWorks.zip';
const ZIP_FILE = path.join(__dirname, ZIP_NAME);
const EXTENSIONS_DIR = path.join(__dirname, 'AppWorks');

export const SKIP_PACK_EXTENSION_LIST = [
  // Doctor publish failed after pack command, because some script will delete file in node_modules.
  // Only publish it.
  'iceworks-doctor',
];

// Beta publish only zip published extension.
// Production publish should zip all extensions.
export default function uploadExtesions(extensions: string[], production?: boolean) {
  extensions.forEach((extension) => {
    const info = extension.split(':');
    const name = info[0];
    const version = info[1];
    const directory = info[2];

    if (production && SKIP_PACK_EXTENSION_LIST.indexOf(name) > -1) {
      return;
    }

    const extensionFile = `${name}-${version}.vsix`;
    const extensionFilePath = path.join(directory, extensionFile);

    // Upload extension
    upload(`vscode-extensions/${production ? 'release' : 'beta'}/${extensionFile}`, extensionFilePath);
    fs.copySync(extensionFilePath, path.join(EXTENSIONS_DIR, extensionFile));
  });

  // Upload extensions zip
  zip.addLocalFolder(EXTENSIONS_DIR);
  zip.writeZip(ZIP_FILE);
  upload(`vscode-extensions/${production ? 'release' : 'beta'}/${ZIP_NAME}`, ZIP_FILE);
}
