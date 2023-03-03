import * as fse from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';
import formatFilename from './formatFilename';
import writeAbcJson from './writeAbcJson';
import ejsRenderDir from './ejsRenderDir';
import type { ExtraDependencies } from './addDependenciesToPkgJson';
import addDependencies from './addDependenciesToPkgJson';
import formatPkgJson from './formatPkgJson';

interface Options {
  projectName?: string;
  extraDependencies?: ExtraDependencies;
  ejsOptions?: Record<string, any>;
}

export default async function formatScaffoldToProject(
  projectDir: string,
  {
    projectName,
    extraDependencies,
    ejsOptions = {}
  }: Options
) {
  // format filename
  const files: string[] = await glob('**/*', { cwd: projectDir, ignore: ['node_modules/**', 'build/**', '.ice/**', '.rax/**'] });
  files.forEach((file) => {
    fse.renameSync(path.join(projectDir, file), path.join(projectDir, formatFilename(file)));
  });
  // Render ejs templates.
  await ejsRenderDir(projectDir, ejsOptions);
  // Format project.
  await writeAbcJson(projectDir);
  // Add dependencies to package.json.
  await addDependencies(extraDependencies, projectDir);

  await formatPkgJson(projectDir);
}
