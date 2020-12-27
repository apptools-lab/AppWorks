import * as path from 'path';
import upload from '../fn/uploadToIceworksOSS';
import { PACK_DIR } from './constant';

const { version: iceworksVersion, publisher, name } = require('../../extensions/iceworks/package.json');

function uploadPack() {
  const ZIP_NAME = `${publisher}-${name}-${iceworksVersion}.zip`;
  const EXTENSION_ZIP_FILE_PATH = path.join(PACK_DIR, ZIP_NAME);

  upload(`o2-packages/${ZIP_NAME}`, EXTENSION_ZIP_FILE_PATH);
}

uploadPack();
