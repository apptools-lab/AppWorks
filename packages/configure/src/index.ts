import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as userHome from 'user-home';

// Note: why not use `import`
// ref: https://github.com/sindresorhus/conf
// eslint-disable-next-line  @typescript-eslint/no-var-requires
const Conf = require('conf');

const confPath = path.join(userHome, '.iceworks');

if (!fs.existsSync(confPath)) {
  mkdirp(confPath);
}

export const recordKey = 'records';

const schema = {
  [recordKey]: {
    type: 'object',
    default: {},
  },
};

const configure = new Conf({
  schema,
  configName: 'database',
  cwd: confPath,
});

export default configure;
