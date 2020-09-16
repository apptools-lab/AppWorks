import * as fs from 'fs';
import * as vscode from 'vscode';
import lineColumn from 'line-column';
import getFullModulePath from './getFullModulePath';

// $test: #000;
const VARIABLES_DECLARE_REG = /(\$[^:\s]+):([^;]+);/g;
// @import 'xxx';
const SASS_IMPORT_REG = /@import([^;]+);/g;

export interface IVariables {
  [key: string]: {
    value: string;
    // For DefinitionProvider locate sass variable
    filePath: string;
    position: vscode.Position;
  };
}

export default function findVariables(targetPath: string): IVariables {
  const variables = {};

  function findVariablesByFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      const code = fs.readFileSync(filePath, 'utf-8');

      // Process variable declare
      let variableMatched: RegExpExecArray | null;
      // eslint-disable-next-line
      while ((variableMatched = VARIABLES_DECLARE_REG.exec(code)) !== null) {
        const variable = variableMatched[1];
        // Variable coverage
        if (!variables[variable]) {
          const positionInfo = lineColumn(code).fromIndex(variableMatched.index);
          variables[variable] = {
            value: variableMatched[2] || '',
            filePath,
            position: new vscode.Position(
              // Example: "path": "|/detail",
              positionInfo.line - 1,
              positionInfo.col,
            ),
          };
        }
      }

      // Find import module
      const importModules: string[] = [];
      let importMatched: RegExpExecArray | null;
      // eslint-disable-next-line
      while ((importMatched = SASS_IMPORT_REG.exec(code)) !== null) {
        importModules.push(importMatched[1]);
      }

      // Process each imported module variables
      importModules.forEach((importModule) => {
        findVariablesByFile(getFullModulePath(importModule, filePath));
      });
    }
  }

  // Get variables
  findVariablesByFile(targetPath);
  return variables;
}
