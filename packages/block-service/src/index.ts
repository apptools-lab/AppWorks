import * as path from 'path';
import * as vscode from 'vscode';
import * as fsExtra from 'fs-extra';
import * as glob from 'glob';
import * as readFiles from 'fs-readdir-recursive';
import * as transfromTsToJs from 'sylvanas';
import { getAndExtractTarball, readPackageJSON } from 'ice-npm-utils';
import { getTarballURLByMaterielSource, IMaterialBlock } from '@iceworks/material-utils';
import {
  projectPath,
  getProjectLanguageType,
  pagesPath,
  COMPONENT_DIR_NAME,
  templateExtnames,
  checkTemplate
} from '@iceworks/project-service';
import {
  createNpmCommand,
  getTagTemplate,
  getImportInfos,
  getLastAcitveTextEditor,
  getImportTemplate
} from '@iceworks/common-service';
import * as upperCamelCase from 'uppercamelcase';
import { generateBlockName } from './utils/generateBlockName';
import { downloadBlock } from './utils/downloadBlock';

const { window, Position } = vscode;

function getBlockType(blockSourceSrcPath) {
  const files = readFiles(blockSourceSrcPath);

  const index = files.findIndex(item => {
    return /\.ts(x)/.test(item);
  });

  return index >= 0 ? 'ts' : 'js';
}

/**
 * Generate block code
 */
export const bulkGenerate = async function (blocks: IMaterialBlock[], localPath: string) {
  await bulkDownload(blocks, localPath);
  await bulkInstallDependencies(blocks);
}

/**
 * Download blocks code to page
 */
export const bulkDownload = async function (blocks: IMaterialBlock[], localPath: string) {
  return await Promise.all(
    blocks.map(async (block: any) => {
      const blockSourceNpm = block.source.npm;

      await fsExtra.mkdirp(localPath);
      const blockName: string = upperCamelCase(block.name);

      let tarballURL: string;
      try {
        tarballURL = await getTarballURLByMaterielSource(block.source);
      } catch (error) {
        error.message = `从 ${blockSourceNpm} 获取压缩包链接失败，您可以尝试手动克隆 ${block.repository} 仓库`;
        throw error;
      }

      const blockDir = path.join(localPath, blockName);
      const blockTempDir = path.join(localPath, `.${blockName}.temp`);

      try {
        await getAndExtractTarball(blockTempDir, tarballURL);
      } catch (error) {
        error.message = `解压 ${blockName} 失败，压缩包链接地址是：${tarballURL}`;
        if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
          error.message = `解压 ${blockName} 超时，压缩包链接地址是：${tarballURL}`;
        }
        await fsExtra.remove(blockTempDir);
        throw error;
      }

      const blockSourceSrcPath = path.join(blockTempDir, 'src');
      const blockType = getBlockType(blockSourceSrcPath);
      const projectType = await getProjectLanguageType();

      console.log('blockType: ', blockType, 'projectType: ', projectType);

      // transfrom ts to js
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

      await fsExtra.move(blockSourceSrcPath, blockDir);
      await fsExtra.remove(blockTempDir);
      return blockDir;
    }),
  );
}

/**
 * Installation block dependencies
 */
export const bulkInstallDependencies = async function (blocks: IMaterialBlock[]) {
  const projectPackageJSON = await readPackageJSON(projectPath);
  const { activeTerminal } = vscode.window;

  // get all dependencies from blocks
  const blocksDependencies: { [packageName: string]: string } = {};
  blocks.forEach(({ dependencies }: any) => Object.assign(blocksDependencies, dependencies));

  // filter existing dependencies of project
  const filterDependencies: { [packageName: string]: string }[] = [];
  Object.keys(blocksDependencies).forEach(packageName => {
    if (!projectPackageJSON.dependencies.hasOwnProperty(packageName)) {
      filterDependencies.push({
        [packageName]: blocksDependencies[packageName],
      });
    }
  });

  if (filterDependencies.length > 0) {
    const deps = filterDependencies.map(dependency => {
      const [packageName, version]: [string, string] = Object.entries(dependency)[0];
      return `${packageName}@${version}`;
    });

    let terminal: vscode.Terminal;
    if (activeTerminal) {
      terminal = activeTerminal;
    } else {
      terminal = vscode.window.createTerminal();
    }

    terminal.show();
    terminal.sendText(`cd ${projectPath}`, true);
    terminal.sendText(createNpmCommand('install', deps.join(' '), '--save'), true);
  } else {
    return [];
  }
}

export async function addBlock(block: IMaterialBlock) {
  const templateError = `只能向 ${templateExtnames.join(',')} 文件添加区块代码`;
  const activeTextEditor = getLastAcitveTextEditor();
  console.log('addBlock....');
  if (!activeTextEditor) {
    throw new Error(templateError);
  }

  const fsPath = activeTextEditor.document.uri.fsPath;

  const isTemplate = checkTemplate(fsPath);
  if (!isTemplate) {
    throw new Error(templateError);
  }

  const pageName = path.basename(path.dirname(fsPath));
  const pagePath = path.join(
    pagesPath,
    pageName
  );
  const isPageFile = await fsExtra.pathExists(pagePath);
  if (!isPageFile) {
    throw new Error(`只能向 ${pagesPath} 下的页面文件添加区块代码`);
  }

  // insert code 
  const blockName: string = await generateBlockName(pageName, block.name);
  await insertBlock(activeTextEditor, blockName);

  // download block 
  const componentsPath = path.join(pagePath, COMPONENT_DIR_NAME);
  const materialOutputChannel = window.createOutputChannel('material');
  materialOutputChannel.show();
  materialOutputChannel.appendLine('> 开始获取区块代码');
  try {
    const downloadMethod = downloadBlock;
    const blockDir = await downloadMethod({ ...block, name: blockName }, componentsPath, (text) => {
      materialOutputChannel.appendLine(`> ${text}`);
    });
    materialOutputChannel.appendLine(`> 已将区块代码下载到：${blockDir}`);
  } catch (error) {
    materialOutputChannel.appendLine(`> Error: ${error.message}`);
  } finally {
    // activate the textEditor
    window.showTextDocument(activeTextEditor.document, activeTextEditor.viewColumn);
  }
}

export async function insertBlock(activeTextEditor: vscode.TextEditor, blockName: string) {
  const { position: importDeclarationPosition } = await getImportInfos(activeTextEditor.document.getText());
  activeTextEditor.edit((editBuilder: vscode.TextEditorEdit) => {
    editBuilder.insert(
      importDeclarationPosition,
      getImportTemplate(blockName, `./components/${blockName}`)
    );

    const { selection } = activeTextEditor;
    if (selection && selection.active) {
      const insertPosition = new Position(selection.active.line, selection.active.character);
      editBuilder.insert(
        insertPosition,
        getTagTemplate(blockName)
      );
    }
  });
}
