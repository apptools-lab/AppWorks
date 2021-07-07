import * as util from 'util';
import * as execa from 'execa';
import * as globSync from 'glob';
import * as mergeWith from 'lodash.mergewith';
import * as unionBy from 'lodash.unionby';
import * as camelCase from 'lodash.camelcase';
import * as padStart from 'lodash.padstart';
import packageJSON from 'package-json';
import * as ejs from 'ejs';
import { join, basename } from 'path';
import { readJson, writeJson, copy, readdir, pathExists, writeFile, remove, mkdirp } from 'fs-extra';
import { getLatestVersion, getAndExtractTarball } from 'ice-npm-utils';
import scanDirectory from '../fn/scanDirectory';
import { INNER_EXTENSIONS_DIRECTORY, PACKAGE_JSON_NAME, PACK_PACKAGE_JSON_PATH, PACK_DIR, PACKAGE_MANAGER } from './constant';
import { isBeta, pushExtension2Npm, npmRegistry, innerExtensions4pack, otherExtensions4pack } from './config';

const renderFile = util.promisify(ejs.renderFile);
const glob = util.promisify(globSync);

const EXTENSION_NPM_NAME_PREFIX = !isBeta ? '@appworks/extension' : '@ali/ide-extensions';
const PACK_TEMPLATE_DIR = join(__dirname, 'template');
const OTHER_EXTENSIONS_DIRECTORY = join(__dirname, 'tmp');

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

function mergeCustomizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

async function mergeValues2PackJSON(values) {
  const extensionPackageJSON = await readJson(PACK_PACKAGE_JSON_PATH);
  mergeWith(extensionPackageJSON, values, mergeCustomizer);
  await writeJson(PACK_PACKAGE_JSON_PATH, extensionPackageJSON, { spaces: 2 });
}

async function publishExtensionsToNpm() {
  const publishedExtensions = [];
  const extensionNames = await scanDirectory(INNER_EXTENSIONS_DIRECTORY);
  await Promise.all(
    extensionNames.map(async (extensionName) => {
      const extensionFolderPath = join(INNER_EXTENSIONS_DIRECTORY, extensionName);
      const extensionPackagePath = join(extensionFolderPath, PACKAGE_JSON_NAME);
      const extensionPackageJSON = await readJson(extensionPackagePath);
      const { name, publisher, version } = extensionPackageJSON;
      const innerExtension4pack = innerExtensions4pack.find(({ packageName }) => packageName === `${publisher}.${name}`);
      if (innerExtension4pack) {
        const newPackageName = getExtensionNpmName(name);
        if (pushExtension2Npm) { // modify `pushExtension2Npm` param which is in `./config.ts` to true when publish to tnpm
          // compatible package.json
          let latestVersion = version;
          try {
            latestVersion = await getLatestVersion(newPackageName, npmRegistry);
          } catch (e) {
            // ignonre error
          }
          const nextVersion = padStart(String(parseInt(latestVersion.split('.').join('')) + 1), 3, '0').split('').join('.');
          mergeWith(
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
          ...innerExtension4pack,
          extensionName,
          packageName: newPackageName,
        });
      }
    }),
  );
  return publishedExtensions;
}

async function mergeExtensionsToPack(extensions) {
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
      mergeWith(nlsJSON, content);
      await writeJson(nlsPath, nlsJSON, { spaces: 2 });
    }
  }
  async function copyExtensionAssets2Pack() {
    let allAssetsFolders = [];
    extensions.forEach(({ assetsFolders }) => {
      allAssetsFolders = allAssetsFolders.concat(assetsFolders);
    });
    allAssetsFolders = unionBy(allAssetsFolders);
    for (let i = 0; i < allAssetsFolders.length; i++) {
      try { await remove(join(PACK_DIR, allAssetsFolders[i])); } catch (e) { /* ignore error */ }
    }

    for (let index = 0; index < extensions.length; index++) {
      const { extensionName, assetsFolders, isOther } = extensions[index];
      const extensionDir = isOther ? OTHER_EXTENSIONS_DIRECTORY : INNER_EXTENSIONS_DIRECTORY;
      const extensionFolderPath = join(extensionDir, extensionName);
      for (let i = 0; i < assetsFolders.length; i++) {
        const assetsFolderName = assetsFolders[i];
        const assetsFolderPath = join(extensionFolderPath, assetsFolderName);
        const packAssetsFolderPath = join(PACK_DIR, assetsFolderName);
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
      const { extensionName, isOther } = extensions[index];
      if (!isOther) {
        const extensionFolderPath = join(INNER_EXTENSIONS_DIRECTORY, extensionName);
        const assetsFolderPath = join(extensionFolderPath, buildFolderName);
        const assetsPathIsExists = await pathExists(assetsFolderPath);
        if (assetsPathIsExists) {
          await copy(assetsFolderPath, packBuildFolderPath, { overwrite: true });
        }
      }
    }
  }
  async function getExtensionsRelatedInfo() {
    let manifests: any = { contributes: { commands: [], views: { iceworksApp: [] } }, activationEvents: [], kaitianContributes: {} };
    let nlsContents = [];
    await Promise.all(extensions.map(async ({ extensionName, isOther }) => {
      const extensionDir = isOther ? OTHER_EXTENSIONS_DIRECTORY : INNER_EXTENSIONS_DIRECTORY;
      const extensionFolderPath = join(extensionDir, extensionName);
      const extensionPackageJSONPath = join(extensionFolderPath, PACKAGE_JSON_NAME);
      const extensionPackageJSON = await readJson(extensionPackageJSONPath);
      const {
        name,
        version,
        contributes = {},
        activationEvents = [],
        kaitianContributes = {},
      } = extensionPackageJSON;

      // Delete useless fields
      delete kaitianContributes.nodeMain;
      delete kaitianContributes.browserMain;
      delete kaitianContributes.workerMain;

      manifests = mergeWith(
        {},
        manifests,
        {
          contributes: mergeWith({}, manifests.contributes, contributes, mergeCustomizer),
          activationEvents: unionBy(manifests.activationEvents.concat(activationEvents)),
          kaitianContributes: mergeWith({}, manifests.kaitianContributes, kaitianContributes, mergeCustomizer),
          dependencies: { [(pushExtension2Npm || isOther) ? name : getExtensionNpmName(name)]: !isBeta ? version : '*' },
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
  await mergeValues2PackJSON(manifests);
  await mergeExtensionsNlsJSON2Pack(nlsContents);
  await copyExtensionAssets2Pack();
  await copyExtensionWebviewFiles2Pack();
}

async function customPackPackageJSON() {
  const extensionPackageJSON = await readJson(PACK_PACKAGE_JSON_PATH);
  const valuesAppendToPackPackageJSON = await readJson(join(PACK_TEMPLATE_DIR, 'package.json'));
  mergeWith(extensionPackageJSON, valuesAppendToPackPackageJSON);
  delete extensionPackageJSON.extensionPack;
  await writeJson(PACK_PACKAGE_JSON_PATH, extensionPackageJSON, { spaces: 2 });

  // copy tsconfig
  const tsconfigJsonName = 'tsconfig.json';
  await copy(join(PACK_TEMPLATE_DIR, tsconfigJsonName), join(PACK_DIR, tsconfigJsonName));
}

async function generalPackSource(extensions) {
  const sourceName = 'src';
  const templateSourcePath = join(PACK_TEMPLATE_DIR, sourceName);
  const packSourcePath = join(PACK_DIR, sourceName);

  await remove(packSourcePath);
  await copy(templateSourcePath, packSourcePath);

  const files = await glob('**', {
    cwd: packSourcePath,
    nodir: true,
  });
  const packages = extensions.map(({ packageName, isActiveNode, isActiveBrowser }) => {
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

async function getOtherExtensionsSource() {
  await remove(OTHER_EXTENSIONS_DIRECTORY);
  await mkdirp(OTHER_EXTENSIONS_DIRECTORY);
  await Promise.all(otherExtensions4pack.map(async ({ packageName, extensionName }) => {
    const packageData = await packageJSON(packageName, { version: 'latest', registryUrl: npmRegistry });
    // @ts-ignore
    const tarballURL = packageData.dist.tarball;
    const downloadPath = join(OTHER_EXTENSIONS_DIRECTORY, extensionName);
    await getAndExtractTarball(downloadPath, tarballURL);
  }));
}

async function generalPack() {
  await getOtherExtensionsSource();
  const publishedExtensions = await publishExtensionsToNpm();
  const allExtensions = [...publishedExtensions, ...otherExtensions4pack];
  await mergeExtensionsToPack(allExtensions);
  await generalPackSource(allExtensions);
  await customPackPackageJSON();
}

generalPack().catch((e) => {
  console.error(e);
});
