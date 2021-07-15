import * as vscode from 'vscode';
import * as path from 'path';
import getCompletionItem from '../../getCompletionItem';
import getFilenameWithoutExtname from '../../getFilenameWithoutExtname';

interface IValidateRule {
  validateCallback: Function;
  args: any[];
}

function checkValidateOfIndexFile(importFileName: string): boolean {
  const indexFilename = 'index';
  const filenameWithoutExtname = path.basename(importFileName, path.extname(importFileName));
  return !(filenameWithoutExtname === indexFilename);
}

function checkValidateOfTsDeclarationFile(importFileName: string): boolean {
  return !importFileName.endsWith('.d.ts');
}

function checkValidateOfAlreadyImport(importFileName: string, alreadyImportSet: Set<string>): boolean {
  return !alreadyImportSet.has(importFileName);
}

function checkValidateOfCurrentFile(importFileName: string, currentFilename): boolean {
  return importFileName !== currentFilename;
}

const checkIsValidate = (validateRules: IValidateRule[]) => {
  return validateRules.every((validateRule) => {
    return validateRule.validateCallback(...validateRule.args);
  });
};


export default (
  currentFilename: string,
  importFilename: string,
  alreadyImportSet: Set<string>,
): vscode.CompletionItem[] => {
  const items: vscode.CompletionItem[] = [];
  const importSourceValue = `./${getFilenameWithoutExtname(importFilename)}`;
  const validateRules: IValidateRule[] = [
    {
      validateCallback: checkValidateOfIndexFile,
      args: [importFilename],
    },
    {
      validateCallback: checkValidateOfTsDeclarationFile,
      args: [importFilename],
    },
    {
      validateCallback: checkValidateOfAlreadyImport,
      args: [path.join(importSourceValue), alreadyImportSet],
    },
    {
      validateCallback: checkValidateOfCurrentFile,
      args: [importFilename, currentFilename],
    },
  ];
  if (checkIsValidate(validateRules)) {
    items.push(getCompletionItem(importSourceValue));
  }
  return items;
};
