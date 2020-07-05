import * as vscode from 'vscode';
import * as path from 'path';
import { IMaterialComponent, IMaterialBase } from '@iceworks/material-utils';
import {
  getLastAcitveTextEditor,
  getTagTemplate,
  getImportInfos,
  CONFIGURATION_KEY_PCKAGE_MANAGER,
  getDataFromSettingJson
} from '@iceworks/common-service';
import {
  templateExtnames,
  projectPath,
  dependencyDir,
  packageJSONFilename
} from '@iceworks/project-service';
import * as fsExtra from 'fs-extra';
import checkTemplate from './utils/checkTemplate';
import insertComponent from './utils/insertComponent';

const { window, Position } = vscode;

export async function addBizComponent(dataSource: IMaterialComponent, ...args) {
  const context = args[0];
  const templateError = `只能向 ${templateExtnames.join(',')} 文件添加组件代码`;
  const { name, source } = dataSource;
  const { npm, version } = source;
  const { activeTerminal } = window;
  const { globalState } = context;
  const activeTextEditor = getLastAcitveTextEditor(globalState);

  if (!activeTextEditor) {
    throw new Error(templateError);
  }

  const fsPath = activeTextEditor.document.uri.fsPath;
  const isTemplate = checkTemplate(fsPath);
  if (!isTemplate) {
    throw new Error(templateError);
  }

  // insert code
  await insertComponent(activeTextEditor, name, npm);

  // install dependencies
  const packageJSONPath = path.join(projectPath, dependencyDir, npm, packageJSONFilename);
  try {
    // todo
    const packageJSON = await fsExtra.readJSON(packageJSONPath);
    if (packageJSON.version === version) {
      return;
    }
  } catch {
    // ignore
  }

  let terminal;
  if (activeTerminal) {
    terminal = activeTerminal;
  } else {
    terminal = window.createTerminal();
  }

  const packageManager = getDataFromSettingJson(CONFIGURATION_KEY_PCKAGE_MANAGER);

  terminal.show();
  terminal.sendText(`cd ${projectPath}`, true);
  terminal.sendText(`${packageManager} install ${npm}@${version}`, true);
  // activate the textEditor
  window.showTextDocument(activeTextEditor.document, activeTextEditor.viewColumn);
}

export async function addBaseComponent(dataSource: IMaterialBase, ...args) {
  const context = args[0];
  const templateError = `只能向 ${templateExtnames.join(',')} 文件添加组件代码`;
  const { globalState } = context;
  const activeTextEditor = getLastAcitveTextEditor(globalState);

  if (!activeTextEditor) {
    throw new Error(templateError);
  }

  const { active } = activeTextEditor.selection;
  const fsPath = activeTextEditor.document.uri.fsPath;
  const isTemplate = checkTemplate(fsPath);
  if (!isTemplate) {
    throw new Error(templateError);
  }

  const { importStatement, name, source } = dataSource;
  const { npm } = source;
  const { position: importDeclarationPosition, declarations: importDeclarations } = await getImportInfos(activeTextEditor.document.getText());
  const baseImportDeclaration = importDeclarations.find(({ source }) => {
    return source.value === npm;
  });

  const insertPosition = new Position(active.line, active.character);
  activeTextEditor.edit((editBuilder: vscode.TextEditorEdit) => {
    let existImportedName = '';
    if (!baseImportDeclaration) {
      editBuilder.insert(
        importDeclarationPosition,
        `${importStatement}\n`
      );
    } else {
      const baseSpecifiers = baseImportDeclaration.specifiers;
      baseSpecifiers.forEach(({ imported, local }) => {
        if (imported.name === name) {
          existImportedName = local.name;
        }
      });

      if (!existImportedName) {
        const baseLastSpecifier = baseSpecifiers[baseSpecifiers.length - 1];
        const baseLastSpecifierPosition = baseLastSpecifier.loc.end;

        editBuilder.insert(
          new Position(baseLastSpecifierPosition.line - 1, baseLastSpecifierPosition.column),
          `, ${name}`,
        );
      }
    }

    editBuilder.insert(
      insertPosition,
      getTagTemplate(existImportedName || name)
    );
  });
  // activate the textEditor
  window.showTextDocument(activeTextEditor.document, activeTextEditor.viewColumn);
}
