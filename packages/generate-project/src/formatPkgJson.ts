import * as path from 'path';
import * as fse from 'fs-extra';

export default async function formatPkgJson(projectDir: string) {
  const pkgJsonPath = path.join(projectDir, 'package.json');
  if (!await fse.pathExists(pkgJsonPath)) {
    throw new Error(`Path ${pkgJsonPath} does not exist.`)
  }

  let pkgJsonContent = await fse.readJSON(pkgJsonPath);
  pkgJsonContent = initVersion(pkgJsonContent);

  await fse.writeJSON(pkgJsonPath, pkgJsonContent, { spaces: 2 });
}

function initVersion(pkgJsonContent: Record<string, any>) {
  pkgJsonContent['version'] = '0.1.0';
  return pkgJsonContent;
}
