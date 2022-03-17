import * as path from 'path';
import * as userHome from 'user-home';

export const DB_PATH = 'build/materials.json';
export const TEMP_PATH = path.join(process.cwd(), '.appworks-tmp');
export const CONFIG_PATH = path.join(userHome || __dirname, '.appworks/cli-config.json');
// eslint-disable-next-line
export const TOKEN_KEY = 'fusion-token';
// eslint-disable-next-line
export const TOKEN_ALI_KEY = 'fusion-token-ali';
