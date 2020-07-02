import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { getFocusCodeInfo } from '../getFocusCodeInfo';
import getFullModulePath from './getFullModulePath';
import colorPreviewDisplay from './colorPreviewDisplay';
import findVariables, { IVariables } from './findVariables';

const SUPPORT_LANGUAGES = ['scss', 'sass'];
const VARIABLE_REG = /^\$/; // Sass variable start with $
// Fusion sass variables. https://ice.work/docs/guide/advance/fusion
let FUSION_VARIABLES: IVariables = {};

// Markdown for key and value
function getMarkdownInfo(key: string, value: string): string {
  return `**Iceworks Style Helper** \n **${key}**: ${value}; \n `;
}

// Variable definition
function provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
  const { word, fileName } = getFocusCodeInfo(document, position);

  if (!VARIABLE_REG.test(word)) return;

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

  if (!VARIABLE_REG.test(word)) return;

  const matchedVariable = findVariables(fileName)[word] || FUSION_VARIABLES[word];

  if (matchedVariable) {
    return new vscode.Hover(
      getMarkdownInfo(
        word,
        // Show color preview display
        `${colorPreviewDisplay(matchedVariable.value)}${matchedVariable.value}`
      )
    );
  }
}

// Variables auto Complete
function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

  const { fileName } = getFocusCodeInfo(document, position);
  const variables = Object.assign({}, FUSION_VARIABLES, findVariables(fileName));

  return Object.keys(variables).map((variable) => {
    const variableValue = variables[variable].value;
    // Show color preview display
    const variableValueText = `${colorPreviewDisplay(variableValue)}${variableValue}`;

    const completionItem = new vscode.CompletionItem(variable, vscode.CompletionItemKind.Variable);

    completionItem.filterText = `${variable}: ${variableValue};`;
    completionItem.documentation = new vscode.MarkdownString(getMarkdownInfo(variable, variableValueText));

    return completionItem;
  });
}


// Process fusion component. https://ice.work/docs/guide/advance/fusion
function processFusionVariables() {
  try {
    const rootPath = vscode.workspace.rootPath || '';
    const buildConfig = JSON.parse(fs.readFileSync(path.join(rootPath, 'build.json'), 'utf-8'));
    const fusionConfig = buildConfig.plugins.find(plugin => Array.isArray(plugin) && plugin[0] === 'build-plugin-fusion');
    // Get themePackage config from build.json
    if (fusionConfig[1].themePackage) {
      FUSION_VARIABLES = findVariables(getFullModulePath(`~${fusionConfig[1].themePackage} `));
    }
  } catch (e) {
    // ignore
  }
}

export default function sassVariablesViewer(context: vscode.ExtensionContext): void {
  processFusionVariables();

  // Listen build.json change
  vscode.workspace.onDidChangeTextDocument((e) => {
    if (/build\.json$/.test(e.document.uri.fsPath)) {
      processFusionVariables();
    }
  }, null, context.subscriptions);

  // Set definitionProvider
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
    // Styles auto Complete
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        language, { provideCompletionItems }, '.'
      )
    );
  })
}