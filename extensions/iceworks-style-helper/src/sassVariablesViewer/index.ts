import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { getFocusCodeInfo } from '../getFocusCodeInfo';
import getFullModulePath from './getFullModulePath';
import colorPreviewDisplay from './colorPreviewDisplay';
import findVariables, { IVariables } from './findVariables';

let FUSION_VARIABLES: IVariables = {};
const SUPPORT_LANGUAGES = ['scss', 'sass'];


// Cmd+Click jump to style definition
function provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
  const { word, fileName } = getFocusCodeInfo(document, position);

  if (!/^\$/.test(word)) return;

  const matchedVariable = findVariables(fileName)[word] || FUSION_VARIABLES[word];
  if (matchedVariable) {
    return new vscode.Location(
      vscode.Uri.file(matchedVariable.filePath),
      matchedVariable.position
    );
  }
}

// Show current variable on hover over
function provideHover(document: vscode.TextDocument, position: vscode.Position) {
  const { word, fileName } = getFocusCodeInfo(document, position);

  if (!/^\$/.test(word)) return;

  const matchedVariable = findVariables(fileName)[word] || FUSION_VARIABLES[word];

  if (matchedVariable) {
    return new vscode.Hover(`### Sass variable \n **${word}**: ${colorPreviewDisplay(matchedVariable.value)}${matchedVariable.value};`);
  }
}

function processFusionVariables() {
  const rootPath = vscode.workspace.rootPath || '';
  try {
    const buildConfig = JSON.parse(fs.readFileSync(path.join(rootPath, 'build.json'), 'utf-8'));
    const fusionConfig = buildConfig.plugins.find(plugin => Array.isArray(plugin) && plugin[0] === 'build-plugin-fusion');
    if (fusionConfig[1].themePackage) {
      FUSION_VARIABLES = findVariables(getFullModulePath(`~${fusionConfig[1].themePackage}`));
    }
  } catch (e) {
    // ignore
  }
}

export default function sassVariablesViewer(context: vscode.ExtensionContext): void {
  processFusionVariables();

  // Cmd+Click jump to style definition
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      SUPPORT_LANGUAGES,
      { provideDefinition }
    )
  );

  SUPPORT_LANGUAGES.forEach((language) => {
    // Set provideHover
    context.subscriptions.push(
      vscode.languages.registerHoverProvider(language, { provideHover })
    );
  })
}