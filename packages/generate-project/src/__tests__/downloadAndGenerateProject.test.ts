import * as path from 'path';
import * as fs from 'fs-extra';
import { downloadAndGenerateProject } from '..';
import { test, beforeAll, expect } from 'vitest';

const tmpPath = path.resolve(__dirname, '../../.tmp');

beforeAll(async () => {
  await fs.ensureDir(tmpPath);
})

test('generate ice3-lite scaffold', async () => {
  const projectDir = path.resolve(tmpPath, 'ice-lite');
  await fs.ensureDir(projectDir);

  await downloadAndGenerateProject(
    projectDir,
    '@ice/lite-scaffold',
    {
      version: 'beta',
      ejsOptions: {
        appConfig: {
          importDeclarationsStr: `import type { Manifest } from '@ice/plugin-pha/types';
import { defineSpmConfig } from '@ali/ice-plugin-spm/types';
          `,
          exportDeclarationsStr: `
export const spmConfig = defineSpmConfig(() => {
  return {
    spmA: 'spmA',
  }
});

export const phaManifest: Manifest = {
  routes: [
    'index',
  ],
}
          `,
        },
        iceConfig: {
          importDeclarationsStr: `import def from '@ali/ice-plugin-def';
import pha from '@ice/plugin-pha';
import spm from '@ali/ice-plugin-spm';\n`,
          optionsStr: `
plugins: [
  def(),
  pha(),
  spm(),
],
          `,
        },
        esLintConfigOptions: `{
          extends: ['@ali/eslint-config-att']
        }`,
      },
      extraDependencies: {
        devDependencies: {
          '@ali/ice-plugin-def': '^1.0.0',
          '@ali/ice-plugin-spm': '^1.0.0',
          '@ice/plugin-pha': '^2.0.0',
        },
      },
    }
  );

  const pkgJsonPath = path.join(projectDir, 'package.json');
  const pkgJsonContent = await fs.readJSON(pkgJsonPath);
  expect(pkgJsonContent.version).toBe('0.1.0');
  expect(Object.keys(pkgJsonContent.devDependencies).includes('@ali/ice-plugin-def')).toBeTruthy();
  expect(Object.keys(pkgJsonContent.devDependencies).includes('@ali/ice-plugin-spm')).toBeTruthy();
  expect(Object.keys(pkgJsonContent.devDependencies).includes('@ice/plugin-pha')).toBeTruthy();

  const appConfigPath = path.join(projectDir, 'src/app.ts');
  const appConfigContent = await fs.readFile(appConfigPath, 'utf-8');
  expect(appConfigContent.includes('export const phaManifest')).toBeTruthy();
  expect(appConfigContent.includes('export const spmConfig')).toBeTruthy();
  expect(appConfigContent.includes(`import type { Manifest } from '@ice/plugin-pha/types';
import { defineSpmConfig } from '@ali/ice-plugin-spm/types';`)).toBeTruthy();

  const configPath = path.join(projectDir, 'ice.config.mts');
  const configContent = await fs.readFile(configPath, 'utf-8');
  expect(configContent.includes(`import def from '@ali/ice-plugin-def';
import pha from '@ice/plugin-pha';
import spm from '@ali/ice-plugin-spm';`)).toBeTruthy();
  expect(configContent.includes('plugins: [def(), pha(), spm()]')).toBeTruthy();

  const eslintConfig = path.join(projectDir, '.eslintrc.cjs');
  const eslintConfigContent = await fs.readFile(eslintConfig, 'utf-8');
  expect(eslintConfigContent.includes("extends: ['@ali/eslint-config-att'],")).toBeTruthy();
})

test('generate antd-pro scaffold', async () => {
  const projectDir = path.resolve(tmpPath, 'antd-pro');
  await fs.ensureDir(projectDir);

  await downloadAndGenerateProject(
    projectDir,
    '@ice/antd-pro-scaffold',
    {
      version: 'beta',
      ejsOptions: {
        appConfig: {
          configStr: `router: {
            type: 'hash',
          },`,
        },
        iceConfig: {
          importDeclarationsStr: `import def from '@ali/ice-plugin-def';\n`,
          options: {
            pluginItemsStr: `def(),`
          },
        },
        esLintConfigOptions: `{
          extends: ['@ali/eslint-config-att']
        }`,
      },
      extraDependencies: {
        devDependencies: {
          '@ali/ice-plugin-def': '^1.0.0',
        },
      }
    }
  );

  const pkgJsonPath = path.join(projectDir, 'package.json');
  const pkgJsonContent = await fs.readJSON(pkgJsonPath);
  expect(pkgJsonContent.version).toBe('0.1.0');
  expect(Object.keys(pkgJsonContent.devDependencies).includes('@ali/ice-plugin-def')).toBeTruthy();

  const appConfigPath = path.join(projectDir, 'src/app.ts');
  const appConfigContent = await fs.readFile(appConfigPath, 'utf-8');
  expect(appConfigContent.includes(`router: {
    type: 'hash',
  },`)).toBeTruthy();

  const configPath = path.join(projectDir, 'ice.config.mts');
  const configContent = await fs.readFile(configPath, 'utf-8');
  expect(configContent.includes(`import def from '@ali/ice-plugin-def';`)).toBeTruthy();
  expect(configContent.includes('plugins: [request(), store(), auth(), def()]')).toBeTruthy();

  const eslintConfig = path.join(projectDir, '.eslintrc.cjs');
  const eslintConfigContent = await fs.readFile(eslintConfig, 'utf-8');
  expect(eslintConfigContent.includes("extends: ['@ali/eslint-config-att'],")).toBeTruthy();
})

test('generate fusion-pro scaffold', async () => {
  const projectDir = path.resolve(tmpPath, 'fusion-pro');
  await fs.ensureDir(projectDir);

  await downloadAndGenerateProject(
    projectDir,
    '@ice/fusion-pro-scaffold',
    {
      version: 'beta',
      ejsOptions: {
        appConfig: {
          configStr: `router: {
            type: 'hash',
          },`,
        },
        iceConfig: {
          importDeclarationsStr: `import def from '@ali/ice-plugin-def';\n`,
          options: {
            pluginItemsStr: `def(),`
          },
        },
        esLintConfigOptions: `{
          extends: ['@ali/eslint-config-att']
        }`,
      },
      extraDependencies: {
        devDependencies: {
          '@ali/ice-plugin-def': '^1.0.0',
        },
      }
    }
  );

  const pkgJsonPath = path.join(projectDir, 'package.json');
  const pkgJsonContent = await fs.readJSON(pkgJsonPath);
  expect(pkgJsonContent.version).toBe('0.1.0');
  expect(Object.keys(pkgJsonContent.devDependencies).includes('@ali/ice-plugin-def')).toBeTruthy();

  const appConfigPath = path.join(projectDir, 'src/app.ts');
  const appConfigContent = await fs.readFile(appConfigPath, 'utf-8');
  expect(appConfigContent.includes(`router: {
    type: 'hash',
  },`)).toBeTruthy();

  const configPath = path.join(projectDir, 'ice.config.mts');
  const configContent = await fs.readFile(configPath, 'utf-8');
  expect(configContent.includes(`import def from '@ali/ice-plugin-def';`)).toBeTruthy();
  expect(configContent.includes('plugins: [request(), store(), auth(), def()]')).toBeTruthy();

  const eslintConfig = path.join(projectDir, '.eslintrc.cjs');
  const eslintConfigContent = await fs.readFile(eslintConfig, 'utf-8');
  expect(eslintConfigContent.includes("extends: ['@ali/eslint-config-att'],")).toBeTruthy();
})
