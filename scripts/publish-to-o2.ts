/**
 * O2 is a Ali internal editor,
 * This script is for compatible with O2 by modifying extensions at build time.
 */
// import { spawnSync } from 'child_process';
import { readJson, writeJson, copy, readdir } from 'fs-extra';
import * as merge from 'lodash.merge';
import * as unionBy from 'lodash.unionby';
import { join } from 'path';
import scanDirectory from './fn/scanDirectory';

const isBeta = true;
const EXTENSION_NPM_NAME_PREFIX = !isBeta ? '@iceworks/extension' : '@ali/ide-extensions';
const EXTENSIONS_DIRECTORY = join(__dirname, '../extensions');
const EXTENSION_PACK_NAME = 'iceworks';
const PACKAGE_JSON_NAME = 'package.json';
const EXTENSION_PACK_DIR = join(EXTENSIONS_DIRECTORY, EXTENSION_PACK_NAME);
const EXTENSION_PACK_JSON_PATH = join(EXTENSION_PACK_DIR, PACKAGE_JSON_NAME);
const EXTENSIONS_PACK = [
  'iceworks-team.iceworks-ui-builder',
  'iceworks-team.iceworks-project-creator',
  'iceworks-team.iceworks-app',
];
const valuesAppendToExtensionPackageJSON = {
  publishConfig: !isBeta ? {
    access: 'public',
  } : {
    registry: 'https://registry.npm.alibaba-inc.com',
  },
  files: [
    'build',
  ],
};
const TEMPLATE_DIR = join(__dirname, 'o2-template');

async function getExtensionPack() {
  // const { extensionPack } = await readJson(EXTENSION_PACK_JSON_PATH);
  return EXTENSIONS_PACK; // extensionPack;
}

async function mergeExtensionsPackageJSON2Pack(values) {
  const extensionPackageJSON = await readJson(EXTENSION_PACK_JSON_PATH);
  merge(extensionPackageJSON, values);
  await writeJson(EXTENSION_PACK_JSON_PATH, extensionPackageJSON, { spaces: 2 });
}

async function mergeExtensionsNlsJSON2Pack(values) {
  await Promise.all(values.map(async ({ fileName, content }) => {
    const nlsPath = join(EXTENSION_PACK_DIR, fileName);
    let nlsJSON = {};
    try {
      nlsJSON = await readJson(nlsPath);
    } catch (e) {
      // ignore error
    }
    merge(nlsJSON, content);
    await writeJson(nlsPath, nlsJSON);
  }));
}

async function customPackPackageJSON() {
  const extensionPackageJSON = await readJson(EXTENSION_PACK_JSON_PATH);
  const valuesAppendToPackPackageJSON = await readJson(join(TEMPLATE_DIR, 'package.json'));
  merge(extensionPackageJSON, valuesAppendToPackPackageJSON);
  delete extensionPackageJSON.extensionPack;
  await writeJson(EXTENSION_PACK_JSON_PATH, extensionPackageJSON, { spaces: 2 });

  // copy
  const tsconfigJsonName = 'tsconfig.json';
  await copy(join(TEMPLATE_DIR, tsconfigJsonName), join(EXTENSION_PACK_DIR, tsconfigJsonName));
}

async function generalPackSource() {
  const sourceName = 'src';
  await copy(join(TEMPLATE_DIR, sourceName), join(EXTENSION_PACK_DIR, sourceName));
}

function getExtensionPackageName(name) {
  return `${EXTENSION_NPM_NAME_PREFIX}-${name}`;
}

async function publishExtensionsToNpm(extensionPack: string[]) {
  const publishedExtensions = [];
  const extensionNames = await scanDirectory(EXTENSIONS_DIRECTORY);
  await Promise.all(
    extensionNames.map(async (extensionName) => {
      const extensionFolderPath = join(EXTENSIONS_DIRECTORY, extensionName);
      const extensionPackagePath = join(extensionFolderPath, PACKAGE_JSON_NAME);
      const extensionPackageJSON = await readJson(extensionPackagePath);

      if (extensionPack.includes(`${extensionPackageJSON.publisher}.${extensionPackageJSON.name}`)) {
        // compatible package.json
        merge(extensionPackageJSON, valuesAppendToExtensionPackageJSON, { name: getExtensionPackageName(extensionPackageJSON.name) });
        // await writeJson(extensionPackagePath, extensionPackageJSON, { spaces: 2 });

        // publish extension
        // spawnSync(
        //   !isBeta ? 'npm' : 'tnpm',
        //   ['publish'],
        //   { stdio: 'inherit', cwd: extensionFolderPath },
        // );

        publishedExtensions.push(extensionName);
      }
    }),
  );
  return publishedExtensions;
}

async function mergeExtensionsToPack(extensions: string[]) {
  /**
   * General /src for O2
   */
  // async function generalSrcFiles() {

  // }

  let extensionsManifest: any = { contributes: { commands: [] }, activationEvents: [] };
  let nlsContents = [];
  await Promise.all(extensions.map(async (extensionName) => {
    const extensionFolderPath = join(EXTENSIONS_DIRECTORY, extensionName);

    // general extensionsManifest
    const extensionPackagePath = join(extensionFolderPath, PACKAGE_JSON_NAME);
    const extensionPackageJSON = await readJson(extensionPackagePath);
    const {
      contributes = {}, activationEvents,
      name, version,
    } = extensionPackageJSON;
    const { commands = [] } = contributes;
    extensionsManifest = merge(
      {},
      extensionsManifest,
      {
        contributes: {
          ...merge({}, extensionsManifest.contributes, contributes),
          commands: unionBy(extensionsManifest.contributes.commands.concat(commands), 'command'),
        },
        activationEvents: unionBy(extensionsManifest.activationEvents.concat(activationEvents)),
        dependencies: { [getExtensionPackageName(name)]: !isBeta ? version : '*' },
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

  await mergeExtensionsPackageJSON2Pack(extensionsManifest);
  await mergeExtensionsNlsJSON2Pack(nlsContents);
}

(async function () {
  const extensionPack = await getExtensionPack();
  const publishedExtensions = await publishExtensionsToNpm(extensionPack);
  await mergeExtensionsToPack(publishedExtensions);
  await customPackPackageJSON();
  await generalPackSource();
})().catch((error) => {
  console.error(error);
});
