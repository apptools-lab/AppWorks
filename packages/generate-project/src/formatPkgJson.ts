import * as path from 'path';
import * as fse from 'fs-extra';

export default async function formatPkgJson(projectDir: string) {
  const pkgJsonPath = path.join(projectDir, 'package.json');
  if (!await fse.pathExists(pkgJsonPath)) {
    throw new Error(`Path ${pkgJsonPath} does not exist.`);
  }

  let pkgJsonContent = await fse.readJSON(pkgJsonPath);
  pkgJsonContent = deleteFields(pkgJsonContent);

  await fse.writeJSON(pkgJsonPath, pkgJsonContent, { spaces: 2 });
}

function deleteFields(pkgJsonContent: Record<string, any>) {
  delete pkgJsonContent.files;
  delete pkgJsonContent.publishConfig;

  return pkgJsonContent;
}
