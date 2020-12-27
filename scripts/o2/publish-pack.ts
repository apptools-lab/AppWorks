import * as path from 'path';
import upload from '../fn/uploadToIceworksOSS';

const { version: iceworksVersion, publisher, name } = require('../../extensions/iceworks/package.json');

function uploadPack() {
  const ZIP_NAME = `${publisher}-${name}-${iceworksVersion}.zip`;
  const EXTENSION_ZIP_FILE_PATH = path.join(process.cwd(), 'extensions', 'iceworks', ZIP_NAME);

  upload(`o2-packages/${ZIP_NAME}`, EXTENSION_ZIP_FILE_PATH);
}

uploadPack();
