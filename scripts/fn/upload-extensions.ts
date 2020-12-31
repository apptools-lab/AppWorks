/**
 * Scripts to upload extension pack to OSS
 */
import * as path from 'path';
import * as fs from 'fs-extra';
import * as AdmZip from 'adm-zip';
import upload from './uploadToIceworksOSS';

const zip = new AdmZip();


const ZIP_NAME = 'Iceworks.zip';
const ZIP_FILE = path.join(__dirname, ZIP_NAME);
const EXTENSIONS_DIR = path.join(__dirname, 'Iceworks');

// Beta publish only zip published extension.
// Production publish should zip all extensions.
export default function uploadExtesions(extensions: string[], production?: boolean) {
  extensions.forEach((extension) => {
    const info = extension.split(':');
    const name = info[0];
    const version = info[1];

    const extensionFile = `${name}-${version}.vsix`;
    const extensionFilePath = path.join(__dirname, '../../extensions', name, extensionFile);

    // Upload extension
    upload(`vscode-extensions/${production ? 'release' : 'beta'}/${extensionFile}`, extensionFilePath);
    fs.copySync(extensionFilePath, path.join(EXTENSIONS_DIR, extensionFile));
  });

  // Upload extensions zip
  zip.addLocalFolder(EXTENSIONS_DIR);
  zip.writeZip(ZIP_FILE);
  upload(`vscode-extensions/${production ? 'release' : 'beta'}/${ZIP_NAME}`, ZIP_FILE);
}
