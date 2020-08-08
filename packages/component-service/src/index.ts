import * as vscode from 'vscode';
import * as path from 'path';
import { IMaterialComponent, IMaterialBase } from '@iceworks/material-utils';
import {
  getLastAcitveTextEditor,
  getTagTemplate,
  getImportInfos,
  CONFIGURATION_KEY_PCKAGE_MANAGER,
  getDataFromSettingJson,
  getIceworksTerminal,
} from '@iceworks/common-service';
import {
  jsxFileExtnames,
  projectPath,
  dependencyDir,
  packageJSONFilename,
  checkIsTemplate,
  getPackageJSON,
  componentsPath,
  getProjectLanguageType
} from '@iceworks/project-service';
import CodeGenerator, { IBasicSchema, IComponentsMapItem, IContainerNodeItem,IUtilItem, II18nMap } from '@ali/lowcode-code-generator';
import * as upperCamelCase from 'uppercamelcase';
import insertComponent from './utils/insertComponent';
import i18nService from './i18n';

const { window, Position } = vscode;

export async function addBizCode(dataSource: IMaterialComponent) {
  const templateError = i18nService.format('package.component-service.index.templateError', {
    jsxFileExtnames: jsxFileExtnames.join(','),
  });
  const { name, source } = dataSource;
  const { npm, version } = source;
  const activeTextEditor = getLastAcitveTextEditor();

  if (!activeTextEditor) {
    throw new Error(templateError);
  }

  const fsPath = activeTextEditor.document.uri.fsPath;
  const isTemplate = checkIsTemplate(fsPath);
  if (!isTemplate) {
    throw new Error(templateError);
  }

  // insert code
  await insertComponent(activeTextEditor, name, npm);

  // install dependencies
  const packageJSONPath = path.join(projectPath, dependencyDir, npm, packageJSONFilename);
  try {
    const packageJSON = await getPackageJSON(packageJSONPath);
    if (packageJSON.version === version) {
      return;
    }
  } catch {
    // ignore
  }

  const packageManager = getDataFromSettingJson(CONFIGURATION_KEY_PCKAGE_MANAGER);

  const terminal = getIceworksTerminal();
  terminal.show();
  terminal.sendText(`cd '${projectPath}'`, true); // the command, for example `cd 'd:\workspace'`, is to be compatible with Windows and Linux
  terminal.sendText(`${packageManager} install ${npm}@${version} --save`, true);
  // activate the textEditor
  window.showTextDocument(activeTextEditor.document, activeTextEditor.viewColumn);
}

export async function addBaseCode(dataSource: IMaterialBase) {
  const templateError = i18nService.format('package.component-service.index.templateError', {
    jsxFileExtnames: jsxFileExtnames.join(','),
  });
  const activeTextEditor = getLastAcitveTextEditor();

  if (!activeTextEditor) {
    throw new Error(templateError);
  }

  const { active } = activeTextEditor.selection;
  const fsPath = activeTextEditor.document.uri.fsPath;
  const isTemplate = checkIsTemplate(fsPath);
  if (!isTemplate) {
    throw new Error(templateError);
  }

  const { importStatement, name, source } = dataSource;
  const { npm } = source;
  const { position: importDeclarationPosition, declarations: importDeclarations } = await getImportInfos(
    activeTextEditor.document.getText()
  );
  const baseImportDeclaration = importDeclarations.find(({ source }) => {
    return source.value === npm;
  });

  const insertPosition = new Position(active.line, active.character);
  activeTextEditor.edit((editBuilder: vscode.TextEditorEdit) => {
    let existImportedName = '';
    if (!baseImportDeclaration) {
      editBuilder.insert(importDeclarationPosition, `${importStatement}\n`);
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
          `, ${name}`
        );
      }
    }

    editBuilder.insert(insertPosition, getTagTemplate(existImportedName || name));
  });
  // activate the textEditor
  window.showTextDocument(activeTextEditor.document, activeTextEditor.viewColumn);
}

export async function generateComponentCode(
  version: string, 
  componentsMap: IComponentsMapItem[], 
  utils: IUtilItem[] , 
  componentsTree: Array<IContainerNodeItem>,
  i18n: II18nMap
  ) {
  let componentName = await vscode.window.showInputBox({
    placeHolder: i18nService.format('package.component-service.index.inputComponentNamePlaceHolder'),
  });
  if (!componentName) {
    return;
  }
  componentName = upperCamelCase(componentName);
  if (componentsTree[0]) {
    componentsTree[0].fileName = componentName;
  }
  const schema: IBasicSchema = { version, componentsMap, utils, componentsTree, i18n }
  await generateCode(componentName, schema); 
}

async function generateCode(componentName: string, schema: IBasicSchema) {
  // const projectLanguageType = await getProjectLanguageType();
  const moduleBuilder = CodeGenerator.createModuleBuilder({
    plugins: [
      CodeGenerator.plugins.react.reactCommonDeps(),
      CodeGenerator.plugins.common.esmodule({
        // fileType: `${projectLanguageType}x`,
        fileType: 'jsx'
      }),
      CodeGenerator.plugins.react.containerClass(),
      CodeGenerator.plugins.react.containerInitState(),
      CodeGenerator.plugins.react.containerLifeCycle(),
      CodeGenerator.plugins.react.containerMethod(),
      CodeGenerator.plugins.react.jsx(),
      CodeGenerator.plugins.style.css(),
    ],
    postProcessors: [CodeGenerator.postprocessor.prettier()],
    mainFileName: 'index',
  });

  moduleBuilder.generateModuleCode(schema).then((result) => {
    writeResultToDisk(result, componentsPath, componentName);
  });
}

function writeResultToDisk(code, path, componentName) {
  const publisher = CodeGenerator.publishers.disk();

  return publisher.publish({
    project: code,
    outputPath: path,
    projectSlug: componentName
  });
}