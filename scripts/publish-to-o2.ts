/**
 * O2 is a Ali internal editor,
 * This script is for compatible with O2 by modifying extensions at build time.
 */
import { spawnSync } from 'child_process';
import { readJson, writeJson, copy, readdir } from 'fs-extra';
import * as merge from 'lodash.merge';
import * as unionBy from 'lodash.unionby';
import * as camelCase from 'lodash.camelcase';
import * as util from 'util';
import { join } from 'path';
import * as ejs from 'ejs';
import scanDirectory from './fn/scanDirectory';

const renderFile = util.promisify(ejs.renderFile);

const isPublish2Npm = false;
const isBeta = true;
const EXTENSIONS_DIRECTORY = join(__dirname, '../extensions');
const PACK_NAME = 'iceworks';
const PACKAGE_JSON_NAME = 'package.json';
const PACK_DIR = join(EXTENSIONS_DIRECTORY, PACK_NAME);
const PACK_PACKAGE_JSON_PATH = join(PACK_DIR, PACKAGE_JSON_NAME);
const PACK_EXTENSIONS = [
  'iceworks-team.iceworks-ui-builder',
  'iceworks-team.iceworks-project-creator',
  'iceworks-team.iceworks-app',
  'iceworks-team.iceworks-config-helper',
];
const EXTENSION_NPM_NAME_PREFIX = !isBeta ? '@iceworks/extension' : '@ali/ide-extensions';
const TEMPLATE_DIR = join(__dirname, 'o2-template');

const valuesAppendToExtensionPackageJSON = {
  publishConfig: !isBeta ?
    {
      access: 'public',
    } :
    {
      registry: 'https://registry.npm.alibaba-inc.com',
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
      if (extensionPack.includes(`${extensionPackageJSON.publisher}.${extensionPackageJSON.name}`)) {
        const newPackageName = getExtensionNpmName(extensionPackageJSON.name);
        if (isPublish2Npm) {
          // compatible package.json
          merge(extensionPackageJSON, valuesAppendToExtensionPackageJSON, { name: newPackageName });
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
    // TODO
  }
  async function copyExtensionWebviewFiles2Pack() {
    // TODO
  }

  let extensionsManifest: any = { contributes: { commands: [] }, activationEvents: [] };
  let nlsContents = [];
  await Promise.all(extensions.map(async ({ extensionName }) => {
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
        dependencies: { [name]: !isBeta ? version : '*' },
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
  await copyExtensionAssets2Pack();
  await copyExtensionWebviewFiles2Pack();
}

async function customPackPackageJSON() {
  const extensionPackageJSON = await readJson(PACK_PACKAGE_JSON_PATH);
  const valuesAppendToPackPackageJSON = await readJson(join(TEMPLATE_DIR, 'package.json'));
  merge(extensionPackageJSON, valuesAppendToPackPackageJSON);
  delete extensionPackageJSON.extensionPack;
  await writeJson(PACK_PACKAGE_JSON_PATH, extensionPackageJSON, { spaces: 2 });

  // copy
  const tsconfigJsonName = 'tsconfig.json';
  await copy(join(TEMPLATE_DIR, tsconfigJsonName), join(PACK_DIR, tsconfigJsonName));
}

async function generalPackSource(extensions) {
  const sourceName = 'src';
  await copy(join(TEMPLATE_DIR, sourceName), join(PACK_DIR, sourceName));

  const nodeEntryPath = join(join(TEMPLATE_DIR, 'index.ts.ejs'));
  const packages = extensions.map(({ packageName }) => {
    return {
      packageName,
      funcName: camelCase(packageName),
    };
  });
  // @ts-ignore
  await renderFile(nodeEntryPath, { packages });
}

async function installPackDeps() {
  // TODO
}

async function compilePack() {
  // TODO
}

async function packagePack() {
  // TODO
}

async function generalPack() {
  const extensionPack = await getPackExtensions();
  const publishedExtensions = await publishExtensionsToNpm(extensionPack);
  await mergeExtensionsToPack(publishedExtensions);
  await customPackPackageJSON();
  await generalPackSource(publishedExtensions);
}

async function buildPack() {
  await installPackDeps();
  await compilePack();
  await packagePack();
}

(async function () {
  await generalPack();
  await buildPack();
})().catch((error) => {
  console.error(error);
});
