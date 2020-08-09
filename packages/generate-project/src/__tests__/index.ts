import * as path from 'path';
import * as fs from 'fs-extra';
import { downloadAndGenerateProject } from '..';

jest.setTimeout(60 * 1000);

const registry = 'https://registry.npmjs.org';
const tmpPath = path.resolve(__dirname, '../../.tmp');
fs.removeSync(tmpPath);

test('downloadAndGenerateProject build-scripts', async () => {
  const projectDir = path.resolve(tmpPath, 'build-scripts');
  await fs.ensureDir(projectDir);

  await downloadAndGenerateProject(projectDir, '@alifd/scaffold-lite', null, registry);
  // await fs.remove(projectDir);
});

test('downloadAndGenerateProject raxjs with ejs options', async () => {
  const projectDir = path.resolve(tmpPath, 'raxjs-ejs');
  await fs.ensureDir(projectDir);

  await downloadAndGenerateProject(
    projectDir,
    '@rax-materials/scaffolds-web-app-js',
    null,
    registry,
    null,
    {
      targets: ['web', 'miniapp'],
      mpa: true,
    }
  );
  // await fs.remove(projectDir);
});

test('downloadAndGenerateProject ice-scripts@2.x', async () => {
  const projectDir = path.resolve(tmpPath, 'ice-scripts-2.x');
  await fs.ensureDir(projectDir);

  await downloadAndGenerateProject(projectDir, '@icedesign/pro-scaffold', '3.0.12', registry);
  // await fs.remove(projectDir);
});

test('downloadAndGenerateProject ice-scripts@1.x', async () => {
  const projectDir = path.resolve(tmpPath, 'ice-scripts-1.x');
  await fs.ensureDir(projectDir);

  await downloadAndGenerateProject(projectDir, '@icedesign/pro-scaffold', '2.0.12', registry);
  // await fs.remove(projectDir);
});
