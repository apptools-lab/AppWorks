import * as path from 'path';
import * as fs from 'fs-extra';
import { generateMaterial } from '..';

jest.setTimeout(60 * 1000);

const tmpPath = path.resolve(__dirname, '../../.tmp');
fs.removeSync(tmpPath);

test.only('generate component', async () => {
  const projectDir = path.resolve(tmpPath, 'ice-js');
  await fs.ensureDir(projectDir);

  await generateMaterial({
    rootDir: projectDir,
    template: '@icedesign/ice-react-material-template',
    registry: 'https://registry.npmjs.org',
    templateOptions: {
      npmName: '@ali/ice-label',
    },
    enableDefPublish: true,
    enablePegasus: true,
  });
});

