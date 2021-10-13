import * as vscode from 'vscode';
import { recordCompletionItemProvider } from '@appworks/recorder';
import CSSData, { IProperty, IPropertyValue } from 'vscode-web-custom-data/data/browsers.css-data.json';
import { getFocusCodeInfo } from '../getFocusCodeInfo';
import getCompletionItem from '../getCompletionItem';
import isEditStyleKey from './isEditStyleKey';

const CSS_PROPERTIES = {};
// {
//   position: {
//     name: "position",
//     values: [
//       { name: "absolute", description: "xxx" },
//       { name: "fixed", description: "xxx" },
//       ...
//     ],
//     syntax: "static | relative | absolute | sticky | fixed",
//     references: [
//       { name: "MDN Reference", url: "https://developer.mozilla.org/docs/Web/CSS/position" }
//     ],
//     description: "The position CSS property sets how an element is positioned in a document. The top, right, bottom, and left properties determine the final location of positioned elements."
//   }
// }
try {
  // https://github.com/microsoft/vscode-custom-data
  CSSData.properties.forEach((property) => {
    // To camelCased property
    CSS_PROPERTIES[toCamel(property.name)] = property;
  });
} catch (e) {
  // ignore
  console.log(e);
}

const CSS_DOCS_URL = 'https://developer.mozilla.org/en-US/docs/Web/CSS';

// To camelCased property, margin-left to marginLeft
function toCamel(prop: string): string {
  return prop.replace(/-(\w|$)/g, ($, $1) => $1.toUpperCase());
}

// Compare first chars
function firstCharsEqual(str1: string, str2: string): boolean {
  return str1[0].toLowerCase() === str2[0].toLowerCase();
}

function isEndsWithComma(text: string): boolean {
  return /,\s*$/.test(text);
}

// Register completionItem provider
function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
  const completions: vscode.CompletionItem[] = [];
  const { line, word } = getFocusCodeInfo(document, position);

  const currentText = line.text;
  const previousText = currentText.substr(0, currentText.lastIndexOf(word)).trim();

  // The JSX style attribute accepts a JavaScript object.
  // If the active word is in an object, it seems like to completing style.
  if (isEditStyleKey(word, line)) {
    if (previousText.endsWith(':')) {
      processPropertyValue();
    } else {
      processPropertyName();
    }
  }

  // Completion property name
  function processPropertyName(): void {
    Object.keys(CSS_PROPERTIES).forEach((propertyName: string) => {
      const property: IProperty = CSS_PROPERTIES[propertyName];
      if (firstCharsEqual(word, propertyName)) {
        completions.push(
          getCompletionItem(
            propertyName,
            'Property',
            `${propertyName}: `, // EXP position:
            new vscode.MarkdownString(`**${property.description}** \n ${CSS_DOCS_URL}/${property.name}`), // Docs
          ),
        );
      }
    });
  }

  // Completion property value
  function processPropertyValue() {
    const matched = previousText.match(/\s*([a-zA-Z]+)\s*:$/);
    if (matched && matched[1]) {
      const property: IProperty = CSS_PROPERTIES[matched[1]];

      Array.from(property.values || []).forEach((value: IPropertyValue) => {
        if (firstCharsEqual(value.name, word)) {
          completions.push(
            getCompletionItem(
              value.name,
              'Value',
              `'${value.name}'${!isEndsWithComma(currentText) ? ',' : ''}`, // EXP 'relative',
              new vscode.MarkdownString(`**${value.description || ''}** \n ${CSS_DOCS_URL}/${property.name}#Values`), // Docs
            ),
          );
        }
      });
    }
  }

  if (completions.length) {
    recordCompletionItemProvider();
  }

  return completions;
}

// Set completion
export default function inlineStyleAutoComplete(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      [
        { scheme: 'file', language: 'javascript' },
        { scheme: 'file', language: 'javascriptreact' },
        { scheme: 'file', language: 'typescript' },
        { scheme: 'file', language: 'typescriptreact' },
      ],
      { provideCompletionItems },
    ),
  );
}
