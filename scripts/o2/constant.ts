import { join } from 'path';
import { isBeta } from './config';

const { version: iceworksVersion, publisher, name } = require('../../extensions/appworks/package.json');

export const INNER_EXTENSIONS_DIRECTORY = join(__dirname, '..', '..', 'extensions');
export const PACK_NAME = 'appworks';
export const PACKAGE_JSON_NAME = 'package.json';
export const NODE_MODULES_DIR_NAME = 'node_modules';
export const PACK_DIR = join(INNER_EXTENSIONS_DIRECTORY, PACK_NAME);
export const PACK_PACKAGE_JSON_PATH = join(PACK_DIR, PACKAGE_JSON_NAME);
export const EXTENSION_NAME = `${publisher}-${name}-${iceworksVersion}`;
export const ZIP_NAME = `${EXTENSION_NAME}.zip`;
export const EXTENSION_ZIP_FILE_PATH = join(PACK_DIR, ZIP_NAME);
export const PACKAGE_MANAGER = isBeta ? 'tnpm' : 'npm';
