import * as path from 'path';
import * as fs from 'fs-extra';
import { downloadMaterialTemplate, generateMaterial } from '..';

jest.setTimeout(60 * 1000);

const registry = 'https://registry.npmjs.org';
const tmpPath = path.resolve(__dirname, '../../.tmp');
fs.removeSync(tmpPath);

test('generate component', async () => {
  const projectDir = path.resolve(tmpPath, 'ice-component');
  const materialTemplateDir = path.join(projectDir, '.tmp');
  await fs.ensureDir(projectDir);

  await downloadMaterialTemplate(materialTemplateDir, '@icedesign/ice-react-material-template', registry);
  await generateMaterial({
    rootDir: projectDir,
    materialTemplateDir,
    materialType: 'component',
    templateOptions: {
      npmName: '@ali/ice-label',
    },
    enableDefPublish: true,
    enablePegasus: true,
  });
});

test('generate block', async () => {
  const projectDir = path.resolve(tmpPath, 'ice-block');
  const materialTemplateDir = path.join(projectDir, '.tmp');
  await fs.ensureDir(projectDir);

  await downloadMaterialTemplate(materialTemplateDir, '@icedesign/ice-react-material-template', registry);
  await generateMaterial({
    rootDir: projectDir,
    materialTemplateDir,
    materialType: 'block',
    templateOptions: {
      npmName: '@ali/ice-label-block',
    },
  });
});

test('generate scaffold', async () => {
  const projectDir = path.resolve(tmpPath, 'ice-scaffold');
  const materialTemplateDir = path.join(projectDir, '.tmp');
  await fs.ensureDir(projectDir);

  await downloadMaterialTemplate(materialTemplateDir, '@icedesign/ice-react-material-template', registry);
  await generateMaterial({
    rootDir: projectDir,
    materialTemplateDir,
    materialType: 'scaffold',
    templateOptions: {
      npmName: '@ali/ice-label-scaffold',
    },
  });
});
