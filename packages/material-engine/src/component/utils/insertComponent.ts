import * as vscode from 'vscode';
import { getImportTemplate, getTagTemplate, getImportInfos } from '@appworks/common-service';
import generateComponentName from './generateComponentName';

const { Position } = vscode;

export default async function insertComponent(activeTextEditor: vscode.TextEditor, name: string, npm: string) {
  const { position: importDeclarationPosition, declarations: importDeclarations } = await getImportInfos(
    activeTextEditor.document.getText(),
  );
  const componentImportDeclaration = importDeclarations.find(({ source }) => source.value === npm);
  let componentName = generateComponentName(name);
  if (componentImportDeclaration) {
    componentName = componentImportDeclaration.specifiers[0].local.name;
  }

  activeTextEditor.edit((editBuilder: vscode.TextEditorEdit) => {
    if (!componentImportDeclaration) {
      editBuilder.insert(importDeclarationPosition, getImportTemplate(componentName, npm));
    }

    const { selection } = activeTextEditor;
    if (selection && selection.active) {
      const insertPosition = new Position(selection.active.line, selection.active.character);
      editBuilder.insert(insertPosition, getTagTemplate(componentName));
    }
  });
}
