import * as vscode from 'vscode';
import * as path from 'path';
import * as fsExtra from 'fs-extra';
import * as semver from 'semver';
import { IMaterialComponent } from '@appworks/material-utils';
import {
  getLastAcitveTextEditor,
  getTagTemplate,
  getImportInfos,
  getIceworksTerminal,
  checkPathExists,
  showTextDocument,
  getAddDependencyAction,
  createNpmCommand,
} from '@appworks/common-service';
import {
  jsxFileExtnames,
  projectPath,
  dependencyDir,
  packageJSONFilename,
  checkIsTemplate,
  componentsPath,
  getProjectLanguageType,
  getFolderPath,
  getProjectType,
} from '@appworks/project-service';
import CodeGenerator, {
  IBasicSchema,
  IContainerNodeItem,
  IUtilItem,
  II18nMap,
  IResultDir,
} from '@iceworks/code-generator';
import * as upperCamelCase from 'uppercamelcase';
import insertComponent from './utils/insertComponent';
import transformComponentsMap from './utils/transformComponentsMap';
import transformTextComponent from './utils/transformTextComponent';
import i18nService from './i18n';

const { window, Position } = vscode;

export async function addCode(dataSource: IMaterialComponent) {
  const templateError = i18nService.format('package.component-service.index.templateError', {
    jsxFileExtnames: jsxFileExtnames.join(','),
  });

  const { name, source, importStatement } = dataSource;
  const { npm, version } = source;
  const activeTextEditor = getLastAcitveTextEditor();

  if (!activeTextEditor) {
    throw new Error(templateError);
  }

  const { active } = activeTextEditor.selection;
  const { fsPath } = activeTextEditor.document.uri;
  const isTemplate = checkIsTemplate(fsPath);
  if (!isTemplate) {
    throw new Error(templateError);
  }

  if (importStatement) {
    // handle with base components
    const { position: importDeclarationPosition, declarations: importDeclarations } = await getImportInfos(
      activeTextEditor.document.getText(),
    );
    const baseImportDeclaration = importDeclarations.find(({ source: { value } }) => {
      return value === npm;
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
            `, ${name}`,
          );
        }
      }

      editBuilder.insert(insertPosition, getTagTemplate(existImportedName || name));
    });
  }

  // insert code
  await insertComponent(activeTextEditor, name, npm);

  // install dependencies
  const packageJSONPath = path.join(projectPath, dependencyDir, npm, packageJSONFilename);
  try {
    const packageJSON = await fsExtra.readJson(packageJSONPath);
    if (semver.satisfies(packageJSON.version, version)) {
      return;
    }
  } catch {
    // ignore
  }

  const addDependencyAction = getAddDependencyAction(); // `add` or `install`

  const terminal = getIceworksTerminal();
  terminal.show();
  terminal.sendText(`cd '${projectPath}'`, true); // the command, for example `cd 'd:\workspace'`, is to be compatible with Windows and Linux
  terminal.sendText(createNpmCommand(addDependencyAction, `${npm}@${version || 'latest'}`, '--save'), true);
  // activate the textEditor
  window.showTextDocument(activeTextEditor.document, activeTextEditor.viewColumn);
}

export async function generateComponentCode(
  version: string,
  componentsMap: any,
  componentsTree: IContainerNodeItem,
  utils: IUtilItem[],
  i18n: II18nMap,
) {
  let componentName = await vscode.window.showInputBox({
    placeHolder: i18nService.format('package.component-service.index.inputComponentNamePlaceHolder'),
    validateInput: async (value) => {
      try {
        const pathExists = await checkPathExists(componentsPath, upperCamelCase(value));
        if (pathExists) {
          return i18nService.format('package.component-service.index.componentNameExistError');
        } else {
          return '';
        }
      } catch {
        return '';
      }
    },
  });
  if (!componentName) {
    return;
  }
  componentName = upperCamelCase(componentName);
  if (componentsTree) {
    componentsTree.fileName = componentName;
  }
  componentsTree = transformTextComponent(componentsTree);

  componentsMap = transformComponentsMap(JSON.parse(componentsMap));

  const schema: IBasicSchema = { version, componentsMap, componentsTree: [componentsTree], i18n, utils };

  const projectType = await getProjectType();
  let outputPath = componentsPath;

  if (projectType === 'unknown') {
    // select folder path
    outputPath = await getFolderPath();
  }

  try {
    await generateCode(componentName, outputPath, schema);
  } catch (e) {
    vscode.window.showErrorMessage(e.message);
    throw e;
  }

  const projectLanguageType = await getProjectLanguageType();
  const fileType = `${projectLanguageType}x`;

  const componentPath = path.join(outputPath, componentName, `index.${fileType}`);
  const openFileAction = i18nService.format('package.component-service.index.openFile');
  const selectedAction = await vscode.window.showInformationMessage(
    i18nService.format('package.component-service.index.createComponentSuccess', {
      componentPath,
    }),
    openFileAction,
  );

  if (selectedAction === openFileAction) {
    showTextDocument(componentPath);
  }
}

async function generateCode(componentName: string, outputPath: string, schema: IBasicSchema) {
  const projectLanguageType = await getProjectLanguageType();
  const fileType = `${projectLanguageType}x`;
  const moduleBuilder = CodeGenerator.createModuleBuilder({
    plugins: [
      CodeGenerator.plugins.react.reactCommonDeps(),
      CodeGenerator.plugins.common.esmodule({
        fileType,
      }),
      CodeGenerator.plugins.react.containerClass(),
      CodeGenerator.plugins.react.containerInitState(),
      CodeGenerator.plugins.react.containerLifeCycle(),
      CodeGenerator.plugins.react.containerMethod(),
      CodeGenerator.plugins.react.jsx({
        fileType,
        nodeTypeMapping: {
          Block: 'div',
          Div: 'div',
          Text: 'span',
          A: 'a',
          Image: 'img',
        },
      }),
      CodeGenerator.plugins.style.css(),
    ],
    postProcessors: [CodeGenerator.postprocessor.prettier()],
    mainFileName: 'index',
  });
  const result = await moduleBuilder.generateModuleCode(schema);

  writeResultToDisk(result, outputPath, componentName);
}

function writeResultToDisk(code: IResultDir, outputPath: string, componentName: string) {
  const publisher = CodeGenerator.publishers.disk();

  return publisher.publish({
    project: code,
    outputPath,
    projectSlug: componentName,
  });
}
