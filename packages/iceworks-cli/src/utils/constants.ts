import * as path from 'path';
import * as userHome from 'user-home';

export const DB_PATH = 'build/materials.json';
export const TEMP_PATH = path.join(process.cwd(), '.iceworks-tmp');
export const CONFIG_PATH = path.join(userHome || __dirname, '.iceworks/cli-config.json');
export const TOKEN_KEY = 'fusion-token';
export const TOKEN_ALI_KEY = 'fusion-token-ali';
