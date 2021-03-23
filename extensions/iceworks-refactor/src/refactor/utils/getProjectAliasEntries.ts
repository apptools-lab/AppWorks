import * as fse from 'fs-extra';
import { join } from 'path';

const configJsonFiles = ['jsconfig.json', 'tsconfig.json'];

function getProjectAliasEntries(projectPath: string) {
  const aliasEntries = {};
  configJsonFiles.forEach(jsonFile => {
    const content = fse.readJSONSync(join(projectPath, jsonFile));
    const { compileOptions } = content;
    if (compileOptions && compileOptions.paths && compileOptions.paths instanceof Object) {
      Object.keys(compileOptions.paths).forEach(path => {
        aliasEntries[path] = compileOptions.paths[path][0];
      });
    }
  });
  return aliasEntries;
}

export default getProjectAliasEntries;
