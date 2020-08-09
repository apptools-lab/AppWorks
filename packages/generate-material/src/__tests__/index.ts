import * as path from 'path';
import * as fs from 'fs-extra';
import { generateComponent } from '..';

jest.setTimeout(60 * 1000);

const tmpPath = path.resolve(__dirname, '../../.tmp');
fs.removeSync(tmpPath);

test.only('generate component', async () => {
  const projectDir = path.resolve(tmpPath, 'ice-js');
  await fs.ensureDir(projectDir);

  await generateComponent({
    rootDir: projectDir,
    template: '@icedesign/ice-react-material-template',
    registry: 'https://registry.npmjs.org',
    templateOptions: {
      npmName: '@ali/ice-label',
    },
    enableDefPublish: true,
    enablePegasus: true,
  });
  // await fs.remove(projectDir);
});

// test('downloadAndGenerateProject raxjs with ejs options', async () => {
//   const projectDir = path.resolve(tmpPath, 'raxjs-ejs');
//   await fs.ensureDir(projectDir);

//   await downloadAndGenerateProject(projectDir, '@rax-materials/scaffolds-web-app-js', null, 'https://registry.npmjs.org/', null, {
//     targets: ['web', 'miniapp'],
//     mpa: true,
//   });
//   // await fs.remove(projectDir);
// });

// test('downloadAndGenerateProject ice-scripts@2.x', async () => {
//   const projectDir = path.resolve(tmpPath, 'ice-scripts-2.x');
//   await fs.ensureDir(projectDir);

//   await downloadAndGenerateProject(projectDir, '@icedesign/pro-scaffold', '3.0.12');
//   // await fs.remove(projectDir);
// });

// test('downloadAndGenerateProject ice-scripts@1.x', async () => {
//   const projectDir = path.resolve(tmpPath, 'ice-scripts-1.x');
//   await fs.ensureDir(projectDir);

//   await downloadAndGenerateProject(projectDir, '@icedesign/pro-scaffold', '2.0.12');
//   // await fs.remove(projectDir);
// });
