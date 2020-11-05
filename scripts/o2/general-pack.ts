import { spawnSync } from 'child_process';
import { readJson, writeJson, copy, readdir, pathExists, writeFile, mkdirp, remove } from 'fs-extra';
import * as merge from 'lodash.merge';
import * as unionBy from 'lodash.unionby';
import * as camelCase from 'lodash.camelcase';
import * as padStart from 'lodash.padstart';
import * as util from 'util';
import { join } from 'path';
import { getLatestVersion } from 'ice-npm-utils';
import * as ejs from 'ejs';
import scanDirectory from '../fn/scanDirectory';

const renderFile = util.promisify(ejs.renderFile);

const isPublish2Npm = true;
const isBeta = true;
const EXTENSIONS_DIRECTORY = join(__dirname, '..', '..', 'extensions');
const PACK_NAME = 'iceworks';
const PACKAGE_JSON_NAME = 'package.json';
const PACK_DIR = join(EXTENSIONS_DIRECTORY, PACK_NAME);
const PACK_PACKAGE_JSON_PATH = join(PACK_DIR, PACKAGE_JSON_NAME);
const PACK_EXTENSIONS = [
  'iceworks-team.iceworks-app',
  'iceworks-team.iceworks-config-helper',
  // 'iceworks-team.iceworks-doctor',
  'iceworks-team.iceworks-material-helper',
  'iceworks-team.iceworks-project-creator',
  'iceworks-team.iceworks-style-helper',
  'iceworks-team.iceworks-ui-builder',
];
const EXTENSION_NPM_NAME_PREFIX = !isBeta ? '@iceworks/extension' : '@ali/ide-extensions';
const TEMPLATE_DIR = join(__dirname, 'template');

const aliRegistry = 'https://registry.npm.alibaba-inc.com';

const valuesAppendToExtensionPackageJSON = {
  scripts: {
    prepublishOnly: 'npm run vscode:prepublish',
  },
  publishConfig: !isBeta ?
    {
      access: 'public',
    } :
    {
      registry: aliRegistry,
    },
  files: [
    'build',
  ],
};

function getExtensionNpmName(name) {
  return `${EXTENSION_NPM_NAME_PREFIX}-${name}`;
}

async function getPackExtensions() {
  return PACK_EXTENSIONS;
}

async function publishExtensionsToNpm(extensionPack: string[]) {
  const publishedExtensions = [];
  const extensionNames = await scanDirectory(EXTENSIONS_DIRECTORY);
  await Promise.all(
    extensionNames.map(async (extensionName) => {
      const extensionFolderPath = join(EXTENSIONS_DIRECTORY, extensionName);
      const extensionPackagePath = join(extensionFolderPath, PACKAGE_JSON_NAME);
      const extensionPackageJSON = await readJson(extensionPackagePath);
      const { name, publisher } = extensionPackageJSON;
      if (extensionPack.includes(`${publisher}.${name}`)) {
        const newPackageName = getExtensionNpmName(name);
        if (isPublish2Npm) {
          // compatible package.json
          const latestVersion = await getLatestVersion(newPackageName, aliRegistry);
          const nextVersion = padStart(String(parseInt(latestVersion.split('.').join('')) + 1), 3, '0').split('').join('.');
          merge(
            extensionPackageJSON,
            valuesAppendToExtensionPackageJSON,
            { name: newPackageName, version: nextVersion },
          );
          await writeJson(extensionPackagePath, extensionPackageJSON, { spaces: 2 });

          spawnSync(
            !isBeta ? 'npm' : 'tnpm',
            ['publish'],
            { stdio: 'inherit', cwd: extensionFolderPath },
          );
        }

        publishedExtensions.push({
          extensionName,
          packageName: newPackageName,
        });
      }
    }),
  );
  return publishedExtensions;
}

async function mergeExtensionsToPack(extensions) {
  async function mergeExtensionsPackageJSON2Pack(values) {
    const extensionPackageJSON = await readJson(PACK_PACKAGE_JSON_PATH);
    merge(extensionPackageJSON, values);
    await writeJson(PACK_PACKAGE_JSON_PATH, extensionPackageJSON, { spaces: 2 });
  }
  async function mergeExtensionsNlsJSON2Pack(values) {
    for (let index = 0; index < values.length; index++) {
      const { fileName, content } = values[index];
      const nlsPath = join(PACK_DIR, fileName);
      let nlsJSON = {};
      try {
        nlsJSON = await readJson(nlsPath);
      } catch (e) {
        // ignore error
      }
      merge(nlsJSON, content);
      await writeJson(nlsPath, nlsJSON, { spaces: 2 });
    }
  }
  async function copyExtensionAssets2Pack() {
    const folders = ['assets', 'schemas'];
    for (let i = 0; i < folders.length; i++) {
      const assetsFolderName = folders[i];
      const packAssetsFolderPath = join(PACK_DIR, assetsFolderName);
      try {
        await remove(packAssetsFolderPath);
      } catch (e) {
        // ignore error
      }

      for (let index = 0; index < extensions.length; index++) {
        const { extensionName } = extensions[index];
        const extensionFolderPath = join(EXTENSIONS_DIRECTORY, extensionName);
        const assetsFolderPath = join(extensionFolderPath, assetsFolderName);
        const assetsPathIsExists = await pathExists(assetsFolderPath);
        if (assetsPathIsExists) {
          await copy(assetsFolderPath, packAssetsFolderPath, { overwrite: true });
        }
      }
    }
  }
  async function copyExtensionWebviewFiles2Pack() {
    const buildFolderName = 'build';
    const packBuildFolderPath = join(PACK_DIR, buildFolderName);
    await remove(packBuildFolderPath);
    for (let index = 0; index < extensions.length; index++) {
      const { extensionName } = extensions[index];
      const extensionFolderPath = join(EXTENSIONS_DIRECTORY, extensionName);
      const assetsFolderPath = join(extensionFolderPath, buildFolderName);
      const assetsPathIsExists = await pathExists(assetsFolderPath);
      if (assetsPathIsExists) {
        await copy(assetsFolderPath, packBuildFolderPath, { overwrite: true });
      }
    }
  }
  async function getExtensionsRelatedInfo() {
    let manifests: any = { contributes: { commands: [] }, activationEvents: [] };
    let nlsContents = [];
    await Promise.all(extensions.map(async ({ extensionName }) => {
      const extensionFolderPath = join(EXTENSIONS_DIRECTORY, extensionName);

      // general manifests
      const extensionPackagePath = join(extensionFolderPath, PACKAGE_JSON_NAME);
      const extensionPackageJSON = await readJson(extensionPackagePath);
      const {
        contributes = {}, activationEvents,
        name, version,
      } = extensionPackageJSON;
      const { commands = [] } = contributes;
      manifests = merge(
        {},
        manifests,
        {
          contributes: {
            ...merge({}, manifests.contributes, contributes),
            commands: unionBy(manifests.contributes.commands.concat(commands), 'command'),
          },
          activationEvents: unionBy(manifests.activationEvents.concat(activationEvents)),
          dependencies: { [ isPublish2Npm ? name : getExtensionNpmName(name)]: !isBeta ? version : '*' },
        },
      );

      // general package.nls.json
      const extensionNlsFiles = (await readdir(extensionFolderPath)).filter((fileName) => {
        return fileName.indexOf('package.nls') === 0;
      });
      const extensionNlsContent = await Promise.all(extensionNlsFiles.map(async (fileName) => {
        return {
          fileName,
          content: await readJson(join(extensionFolderPath, fileName)),
        };
      }));
      nlsContents = nlsContents.concat(extensionNlsContent);
    }));
    return {
      manifests,
      nlsContents,
    };
  }

  const { manifests, nlsContents } = await getExtensionsRelatedInfo();
  await mergeExtensionsPackageJSON2Pack(manifests);
  await mergeExtensionsNlsJSON2Pack(nlsContents);
  await copyExtensionAssets2Pack();
  await copyExtensionWebviewFiles2Pack();
}

async function customPackPackageJSON() {
  const extensionPackageJSON = await readJson(PACK_PACKAGE_JSON_PATH);
  const valuesAppendToPackPackageJSON = await readJson(join(TEMPLATE_DIR, 'package.json'));
  merge(extensionPackageJSON, valuesAppendToPackPackageJSON);
  delete extensionPackageJSON.extensionPack;
  await writeJson(PACK_PACKAGE_JSON_PATH, extensionPackageJSON, { spaces: 2 });

  // copy tsconfig
  const tsconfigJsonName = 'tsconfig.json';
  await copy(join(TEMPLATE_DIR, tsconfigJsonName), join(PACK_DIR, tsconfigJsonName));
}

async function generalPackSource(extensions) {
  const sourceName = 'src';
  const templateSourcePath = join(TEMPLATE_DIR, sourceName);
  const packSourcePath = join(PACK_DIR, sourceName);
  await remove(packSourcePath);
  await copy(templateSourcePath, packSourcePath);

  // general node entry
  const templateNodeEntryFileName = 'index.ts.ejs';
  const templateNodeEntryPath = join(join(TEMPLATE_DIR, templateNodeEntryFileName));
  const packages = extensions.map(({ packageName }) => {
    const func = camelCase(packageName);
    return {
      packageName,
      activateFunc: `${func}Active`,
      deactivateFunc: `${func}Deactivate`,
    };
  });
  // @ts-ignore
  const nodeEntryContent = await renderFile(templateNodeEntryPath, { packages });
  const nodeEntryFileName = templateNodeEntryFileName.replace(/\.ejs$/, '');
  const nodeEntryDir = join(packSourcePath, 'node');
  await mkdirp(nodeEntryDir);
  await writeFile(join(nodeEntryDir, nodeEntryFileName), nodeEntryContent);
}

async function generalPack() {
  const extensionPack = await getPackExtensions();
  const publishedExtensions = await publishExtensionsToNpm(extensionPack);
  await mergeExtensionsToPack(publishedExtensions);
  await customPackPackageJSON();
  await generalPackSource(publishedExtensions);
}

generalPack().catch((e) => {
  console.error(e);
});
