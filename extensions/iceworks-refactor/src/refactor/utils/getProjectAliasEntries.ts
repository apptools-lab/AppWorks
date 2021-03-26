import * as fse from 'fs-extra';
import { projectPath } from '@iceworks/project-service';
import { join } from 'path';

function getProjectAliasEntries(projectLanguageType: 'ts' | 'js') {
  let configJsonFile;
  if (projectLanguageType === 'js') {
    configJsonFile = 'jsconfig.json';
  } else {
    configJsonFile = 'tsconfig.json';
  }
  const aliasEntries = {};
  const content = fse.readJSONSync(join(projectPath, configJsonFile));
  const { compilerOptions } = content;
  if (compilerOptions && compilerOptions.paths && compilerOptions.paths instanceof Object) {
    return compilerOptions.paths;
  }
  return aliasEntries;
}

export default getProjectAliasEntries;
