import { join } from 'path';
import { isBeta } from './config';

export const EXTENSIONS_DIRECTORY = join(__dirname, '..', '..', 'extensions');
export const PACK_NAME = 'iceworks';
export const PACKAGE_JSON_NAME = 'package.json';
export const PACK_DIR = join(EXTENSIONS_DIRECTORY, PACK_NAME);
export const PACK_PACKAGE_JSON_PATH = join(PACK_DIR, PACKAGE_JSON_NAME);
export const PACKAGE_MANAGER = isBeta ? 'tnpm' : 'npm';
