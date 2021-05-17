import * as fs from 'fs';
import * as path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import getBabelParserPlugins from '../utils/getBabelParserPlugins';

// Get props keys from .d.ts file,
export default function getPropKeysFromDefinition(componentPath): string[] {
  const propKeys: string[] = [];

  try {
    let componentTypesPath = componentPath;
    if (!componentTypesPath.endsWith('d.ts')) {
      // Rax component project use types.ts
      // If this ts component project not contain d.ts or types.ts, Don‘t show propKeys.
      componentTypesPath = `${path.dirname(componentPath)}/types.ts`;
    }

    let definitionFileContent = '';

    if (fs.existsSync(componentTypesPath)) {
      definitionFileContent += fs.readFileSync(componentTypesPath, 'utf-8');
    }

    // For rax-components https://github.com/raxjs/rax-components/
    const raxComponentTypesPath = `${path.dirname(componentPath)}/types.d.ts`;
    if (fs.existsSync(raxComponentTypesPath)) {
      definitionFileContent += fs.readFileSync(raxComponentTypesPath, 'utf-8');
    }

    if (definitionFileContent) {
      const ast = parse(definitionFileContent, {
        sourceType: 'module',
        plugins: getBabelParserPlugins('ts'),
      });
      if (ast) {
        // https://babeljs.io/docs/en/babel-travers
        traverse(ast, {
          TSPropertySignature(filePath: any) {
            propKeys.push(filePath.node.key.name);
          },
        });
      }
    }
  } catch (error) {
    // ignores
    console.log(error);
  }

  return propKeys;
}
