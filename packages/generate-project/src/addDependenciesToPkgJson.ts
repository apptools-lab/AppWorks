import * as path from 'path';
import * as fse from 'fs-extra';

export interface ExtraDependencies {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export default async function addDependencies(extraDependencies: ExtraDependencies, projectDir: string) {
  const pkgJsonPath = path.join(projectDir, 'package.json');
  if (!await fse.pathExists(pkgJsonPath)) {
    throw new Error(`Path ${pkgJsonPath} does not exist.`)
  }
  const pkgJson = await fse.readJSON(path.join(projectDir, 'package.json'));
  Object.entries(extraDependencies).forEach(([depType, value]) => {
    if (!pkgJson[depType]) {
      pkgJson[depType] = {};
    }
    pkgJson[depType] = { ...value, ...pkgJson[depType] }
  });

  await fse.writeJSON(pkgJsonPath, pkgJson, { spaces: 2 });
}
