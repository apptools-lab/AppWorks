import * as path from 'path';
import * as vscode from 'vscode';
import * as fsExtra from 'fs-extra';
import * as glob from 'glob';
import { IMaterialBlock } from '@appworks/material-utils';
import {
  getProjectLanguageType,
  COMPONENT_DIR_NAME,
  jsxFileExtnames,
  checkIsTemplate,
  projectPath,
} from '@appworks/project-service';
import {
  getTagTemplate,
  getImportInfos,
  getLastAcitveTextEditor,
  getImportTemplate,
  getFolderLanguageType,
  bulkInstallMaterialsDependencies,
  bulkDownloadMaterials,
  findIndexFile,
} from '@appworks/common-service';
import * as upperCamelCase from 'uppercamelcase';
import * as transfromTsToJs from 'transform-ts-to-js';
import i18n from './i18n';
import { generateBlockName } from './utils/generateBlockName';
import { triggerHook } from '../utils/hookUtil';

const { window, Position } = vscode;

/**
 * Generate block code
 */
export const bulkGenerate = async function (blocks: IMaterialBlock[], localPath: string) {
  const blocksTempDir = path.join(localPath, '.temp-block');
  await bulkDownloadMaterials(blocks, blocksTempDir);
  const blockIndexPaths = await renderBlocks(blocks, blocksTempDir, localPath);
  await fsExtra.remove(blocksTempDir);
  await bulkInstallMaterialsDependencies(blocks, projectPath);
  return blockIndexPaths;
};

/**
 * Render blocks code to targetDir
 */
export const renderBlocks = async function (
  blocks: IMaterialBlock[],
  blockTempDir: string,
  targetDir: string,
  log?: (text: string) => void,
) {
  if (!log) {
    log = (text) => console.log(text);
  }

  const indexes = await Promise.all(
    blocks.map(async (block: any) => {
      const blockName = upperCamelCase(block.name);
      const blockSourceSrcPath = path.join(blockTempDir, blockName, 'src');
      const targetPath = path.join(targetDir, blockName);
      const blockType = getFolderLanguageType(blockSourceSrcPath);
      const projectType = await getProjectLanguageType();

      // fs 的异步版 exists 已经被弃用 http://nodejs.cn/api/fs.html#fs_fs_exists_path_callback
      const isTargetDirExists = fsExtra.existsSync(targetPath);
      if (isTargetDirExists) {
        throw new Error(i18n.format('package.block-service.targetDirExists', { targetPath }));
      }

      if (blockType === 'ts' && projectType === 'js') {
        const files = glob.sync('**/*.@(ts|tsx)', {
          cwd: blockSourceSrcPath,
        });

        console.log('transfrom ts to js', files.join(','));

        transfromTsToJs(files, {
          cwd: blockSourceSrcPath,
          outDir: blockSourceSrcPath,
          action: 'overwrite',
        });
      }

      await fsExtra.move(blockSourceSrcPath, targetPath);
      return findIndexFile(targetPath);
    }),
  );

  return indexes;
};

export async function addBlockCode(block: IMaterialBlock) {
  const templateError = i18n.format('package.block-service.templateError', {
    jsxFileExtnames: jsxFileExtnames.join(','),
  });
  const activeTextEditor = getLastAcitveTextEditor();
  console.log('addBlockCode....');
  if (!activeTextEditor) {
    throw new Error(templateError);
  }

  const { fsPath } = activeTextEditor.document.uri;

  // check the file type if it's js、jsx、tsx、vue
  const isTemplate = checkIsTemplate(fsPath);
  if (!isTemplate) {
    throw new Error(templateError);
  }

  const pagePath = path.dirname(fsPath);
  const pageName = path.basename(pagePath);

  // insert code
  const blockName: string = await generateBlockName(pageName, block.name);
  await insertBlock(activeTextEditor, blockName);

  // download block
  const componentsPath = path.join(pagePath, '.temp');
  const targetPath = path.join(pagePath, COMPONENT_DIR_NAME);
  await fsExtra.ensureDir(pagePath);

  const materialOutputChannel = window.createOutputChannel('material');
  materialOutputChannel.show();
  materialOutputChannel.appendLine(i18n.format('package.block-service.startObtainBlock'));
  try {
    await bulkDownloadMaterials([{ ...block, name: blockName }], componentsPath, (text) => {
      materialOutputChannel.appendLine(`> ${text}`);
    });
    materialOutputChannel.appendLine(i18n.format('package.block-service.obtainDone', { blockDir: targetPath }));
    await renderBlocks([{ ...block, name: blockName }], componentsPath, targetPath);
  } catch (error) {
    materialOutputChannel.appendLine(`> Error: ${error.message}`);
  } finally {
    // activate the textEditor
    await fsExtra.remove(componentsPath);
    window.showTextDocument(activeTextEditor.document, activeTextEditor.viewColumn);
  }

  // install block dependencies
  await bulkInstallMaterialsDependencies([block], projectPath);

  // triggerHook
  triggerHook('block.addBlockCode', block, { fsPath });
}

export async function insertBlock(activeTextEditor: vscode.TextEditor, blockName: string) {
  const { position: importDeclarationPosition } = await getImportInfos(activeTextEditor.document.getText());
  activeTextEditor.edit((editBuilder: vscode.TextEditorEdit) => {
    editBuilder.insert(importDeclarationPosition, getImportTemplate(blockName, `./components/${blockName}`));

    const { selection } = activeTextEditor;
    if (selection && selection.active) {
      const insertPosition = new Position(selection.active.line, selection.active.character);
      editBuilder.insert(insertPosition, getTagTemplate(blockName));
    }
  });
}
