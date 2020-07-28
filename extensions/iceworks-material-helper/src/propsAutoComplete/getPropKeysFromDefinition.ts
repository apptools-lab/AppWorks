import * as fs from 'fs';
import * as path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import getBabelParserPlugins from './getBabelParserPlugins';

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
    if (fs.existsSync(componentTypesPath)) {
      const ast = parse(fs.readFileSync(componentTypesPath, 'utf-8'), {
        sourceType: 'module',
        plugins: getBabelParserPlugins('ts')
      });
      if (ast) {
        // https://babeljs.io/docs/en/babel-travers
        traverse(
          ast,
          {
            TSPropertySignature(filePath: any) {
              propKeys.push(filePath.node.key.name);
            }
          }
        );
      }
    };
  } catch (error) {
    // ignores
    console.log(error);
  }

  return propKeys;
};