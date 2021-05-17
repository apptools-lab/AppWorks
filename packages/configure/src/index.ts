import { Storage } from '@appworks/storage';

// Note: why not use `import`
// ref: https://github.com/sindresorhus/conf
// eslint-disable-next-line  @typescript-eslint/no-var-requires
const Conf = require('conf');

const storage = new Storage();

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
  cwd: storage.getPath(),
});

export default configure;
