import { join } from 'path';
import { isBeta } from './config';

export const INNER_EXTENSIONS_DIRECTORY = join(__dirname, '..', '..', 'extensions');
export const PACK_NAME = 'iceworks';
export const PACKAGE_JSON_NAME = 'package.json';
export const NODE_MODULES_DIR_NAME = 'node_modules';
export const PACK_DIR = join(INNER_EXTENSIONS_DIRECTORY, PACK_NAME);
export const PACK_PACKAGE_JSON_PATH = join(PACK_DIR, PACKAGE_JSON_NAME);
export const PACK_PACKAGE_NODE_MODULES_PATH = join(PACK_DIR, NODE_MODULES_DIR_NAME);
export const PACKAGE_MANAGER = isBeta ? 'tnpm' : 'npm';

export const OSS_PACKAGES = [
  '@ali/common-di',
  '@ali/ide-extension-installer',
  '@ali/kaitian-cli',
];
