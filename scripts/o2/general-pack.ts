import * as execa from 'execa';
import { readJson, writeJson, copy, readdir, pathExists, writeFile, remove } from 'fs-extra';
import * as globSync from 'glob';
import * as merge from 'lodash.merge';
import * as unionBy from 'lodash.unionby';
import * as camelCase from 'lodash.camelcase';
import * as padStart from 'lodash.padstart';
import * as util from 'util';
import { join, basename } from 'path';
import { getLatestVersion } from 'ice-npm-utils';
import * as ejs from 'ejs';
import scanDirectory from '../fn/scanDirectory';
import { EXTENSIONS_DIRECTORY, PACKAGE_JSON_NAME, PACK_DIR, PACK_PACKAGE_JSON_PATH, PACKAGE_MANAGER } from './constant';
import { isBeta, pushExtension2NPM, extensions4pack, npmRegistry, packages4pack } from './config';

const renderFile = util.promisify(ejs.renderFile);
const glob = util.promisify(globSync);
const EXTENSION_NPM_NAME_PREFIX = !isBeta ? '@iceworks/extension' : '@ali/ide-extensions';
const TEMPLATE_DIR = join(__dirname, 'template');

const valuesAppendToExtensionPackageJSON = {
  scripts: {
    prepublishOnly: 'npm run vscode:prepublish',
  },
  publishConfig: !isBeta ?
    {
      access: 'public',
    } :
    {
      registry: npmRegistry,
    },
  files: [
    'build',
  ],
};

function getExtensionNpmName(name) {
  return `${EXTENSION_NPM_NAME_PREFIX}-${name}`;
}

async function getPackExtensions() {
  return extensions4pack;
}

async function publishExtensionsToNpm(extensionPack: string[]) {
  const publishedExtensions = [];
  const extensionNames = await scanDirectory(EXTENSIONS_DIRECTORY);
  await Promise.all(
    extensionNames.map(async (extensionName) => {
      const extensionFolderPath = join(EXTENSIONS_DIRECTORY, extensionName);
      const extensionPackagePath = join(extensionFolderPath, PACKAGE_JSON_NAME);
      const extensionPackageJSON = await readJson(extensionPackagePath);
      const { name, publisher, version } = extensionPackageJSON;
      if (extensionPack.includes(`${publisher}.${name}`)) {
        const newPackageName = getExtensionNpmName(name);
        if (pushExtension2NPM) {
          // compatible package.json
          let latestVersion = version;
          try {
            latestVersion = await getLatestVersion(newPackageName, npmRegistry);
          } catch (e) {
            // ignonre error
          }
          const nextVersion = padStart(String(parseInt(latestVersion.split('.').join('')) + 1), 3, '0').split('').join('.');
          merge(
            extensionPackageJSON,
            valuesAppendToExtensionPackageJSON,
            { name: newPackageName, version: nextVersion },
          );
          await writeJson(extensionPackagePath, extensionPackageJSON, { spaces: 2 });

          await execa(
            PACKAGE_MANAGER,
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
  async function mergePackageJSON2Pack(values) {
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
    let manifests: any = { contributes: { commands: [], views: { iceworksApp: [] } }, activationEvents: [] };
    let nlsContents = [];
    await Promise.all(extensions.map(async ({ extensionName }) => {
      const extensionFolderPath = join(EXTENSIONS_DIRECTORY, extensionName);

      // general manifests
      const extensionPackagePath = join(extensionFolderPath, PACKAGE_JSON_NAME);
      const extensionPackageJSON = await readJson(extensionPackagePath);
      const {
        contributes = {},
        activationEvents,
        name,
        version,
      } = extensionPackageJSON;
      const { commands = [], views = {} } = contributes;
      const { iceworksApp = [] } = views;
      manifests = merge(
        {},
        manifests,
        {
          contributes: {
            ...merge({}, manifests.contributes, contributes),
            views: {
              // TODO how to deep merge array?
              iceworksApp: unionBy(manifests.contributes.views.iceworksApp.concat(iceworksApp), 'id'),
            },
            commands: unionBy(manifests.contributes.commands.concat(commands), 'command'),
          },
          activationEvents: unionBy(manifests.activationEvents.concat(activationEvents)),
          dependencies: { [pushExtension2NPM ? name : getExtensionNpmName(name)]: !isBeta ? version : '*' },
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
  await mergePackageJSON2Pack(manifests);
  // set other packages to dependencies
  const dependencies = {};
  packages4pack.forEach(({ packageName }) => {
    dependencies[packageName] = '*';
  });
  await mergePackageJSON2Pack({ dependencies });
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

  const files = await glob('**', {
    cwd: packSourcePath,
    nodir: true,
  });
  const packages = [...extensions, ...packages4pack].map(({ packageName, isActiveNode, isActiveBrowser }) => {
    const func = camelCase(packageName);
    return {
      packageName,
      isActiveNode,
      isActiveBrowser,
      activateFunc: `${func}Active`,
      deactivateFunc: `${func}Deactivate`,
      activateNodeFunc: `${func}NodeActive`,
      deactivateNodeFunc: `${func}NodeDeactivate`,
    };
  });
  await Promise.all(files.map(async (file) => {
    const filePath = join(packSourcePath, file);
    const fileName = basename(filePath);
    const esMatchExpression = /\.ejs$/;
    if (esMatchExpression.test(fileName)) {
      const newFilePath = join(filePath, '../', fileName.replace(esMatchExpression, ''));
      const content = await renderFile(filePath, { packages });
      await writeFile(newFilePath, content);
      await remove(filePath);
    }
  }));
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
