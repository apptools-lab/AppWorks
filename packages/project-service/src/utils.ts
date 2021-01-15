import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { projectPath, packageJSONFilename } from './constant';
import i18n from './i18n';

export async function getProjectPackageJSON(): Promise<any> {
  const packagePath = path.join(projectPath, packageJSONFilename);
  const packagePathIsExist = await fsExtra.pathExists(packagePath);
  if (!packagePathIsExist) {
    throw new Error(i18n.format('package.projectService.index.packageNotFound'));
  }
  return await fsExtra.readJson(packagePath);
}
