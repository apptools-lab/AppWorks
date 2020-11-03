/**
 * O2 is a Ali internal editor,
 * This script is for compatible with O2 by modifying extensions at build time.
 */
// import { spawnSync } from 'child_process';
import { readJson, writeJson } from 'fs-extra';
import * as merge from 'lodash.merge';
import * as unionBy from 'lodash.unionby';
import { join } from 'path';
import scanDirectory from './fn/scanDirectory';

const EXTENSION_NPM_NAME_PREFIX = '@iceworks/extension';
const EXTENSIONS_DIRECTORY = join(__dirname, '../extensions');
const EXTENSIONS_PACK = [
  'iceworks-team.iceworks-ui-builder',
  'iceworks-team.iceworks-project-creator',
];
const valuesAppendToExtensionPackageJSON = {
  publishConfig: {
    access: 'public',
  },
  files: [
    'build',
  ],
};
const EXTENSION_PACK = 'iceworks';
const PACKAGE_JSON_NAME = 'package.json';
const valuesAppendToPackPackageJSON = {
  engines: {
    kaitian: '^1.20.0',
  },
  contributes: {
    configuration: {
      title: 'Iceworks',
    },
  },
  dependencies: {
    '@ali/kit-runner': '^0.1.0',
  },
  devDependencies: {
    'css-loader': '^3.6.0',
    'file-loader': '^6.0.0',
    less: '^3.11.3',
    'less-loader': '^5.0.0',
    'style-loader': '^1.2.1',
    'ts-loader': '^8.0.6',
    typescript: '^3.4.5',
    'url-loader': '^4.1.0',
    vscode: '^1.1.28',
    webpack: '^4.43.0',
  },
  scripts: {
    prepublishOnly: 'npm run compile',
    compile: 'kit-builder compile',
  },
  kaitianContributes: {
    nodeMain: './out/node/index.js',
  },
};

async function getExtensionPack() {
  // const { extensionPack } = await readJson(join(EXTENSIONS_DIRECTORY, EXTENSION_PACK, PACKAGE_JSON_NAME));
  return EXTENSIONS_PACK; // extensionPack;
}

async function mergePackPackageJSON(values) {
  const extensionFolderPath = join(EXTENSIONS_DIRECTORY, EXTENSION_PACK);
  const extensionPackagePath = join(extensionFolderPath, PACKAGE_JSON_NAME);
  let extensionPackageJSON = await readJson(extensionPackagePath);
  extensionPackageJSON = merge({}, extensionPackageJSON, values, valuesAppendToPackPackageJSON);
  delete extensionPackageJSON.extensionPack;
  await writeJson(extensionPackagePath, extensionPackageJSON, { spaces: 2 });
}

async function publishExtensionsToNpm(extensionPack: string[]) {
  const publishedExtensions = [];
  const extensionNames = await scanDirectory(EXTENSIONS_DIRECTORY);
  await Promise.all(
    extensionNames.map(async (extensionName) => {
      const extensionFolderPath = join(EXTENSIONS_DIRECTORY, extensionName);
      const extensionPackagePath = join(extensionFolderPath, PACKAGE_JSON_NAME);
      let extensionPackageJSON = await readJson(extensionPackagePath);

      if (extensionPack.includes(`${extensionPackageJSON.publisher}.${extensionPackageJSON.name}`)) {
        // compatible package.json
        extensionPackageJSON = merge({}, extensionPackageJSON, valuesAppendToExtensionPackageJSON, { name: `${EXTENSION_NPM_NAME_PREFIX}-${extensionPackageJSON.name}` });
        // await writeJson(extensionPackagePath, extensionPackageJSON, { spaces: 2 });

        // publish extension
        // spawnSync(
        //   'npm',
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

  // async function processingBuildLogic() {

  // }

  let extensionsManifest: any = { contributes: { commands: [] }, activationEvents: [] };
  await Promise.all(extensions.map(async (extensionName) => {
    const extensionFolderPath = join(EXTENSIONS_DIRECTORY, extensionName);

    // general extensionsManifest
    const extensionPackagePath = join(extensionFolderPath, PACKAGE_JSON_NAME);
    const extensionPackageJSON = await readJson(extensionPackagePath);
    const {
      contributes = {}, activationEvents,
      // name, version
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
        // dependencies: { [name]: version }
      },
    );
    // general package.nls.json
  }));

  mergePackPackageJSON(extensionsManifest);
}

(async function () {
  const extensionPack = await getExtensionPack();
  const publishedExtensions = await publishExtensionsToNpm(extensionPack);
  await mergeExtensionsToPack(publishedExtensions);
})().catch((error) => {
  console.error(error);
});
