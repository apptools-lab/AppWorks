import * as fse from 'fs-extra';
import * as path from 'path';
import formatFilename from './formatFilename';
import writeAbcJson from './writeAbcJson';
import ejsRenderDir from './ejsRenderDir';
import type { ExtraDependencies } from './addDependenciesToPkgJson';
import addDependencies from './addDependenciesToPkgJson';
import formatPkgJson from './formatPkgJson';

import glob = require('glob');

interface Options {
  extraDependencies?: ExtraDependencies;
  ejsOptions?: Record<string, any>;
}

export default async function formatScaffoldToProject(
  projectDir: string,
  {
    extraDependencies,
    ejsOptions = {},
  }: Options,
) {
  // format filename
  const files: string[] = await new Promise((resolve, reject) => {
    glob(
      '**/*',
      {
        cwd: projectDir,
        ignore: ['node_modules/**', 'build/**', '.ice/**', '.rax/**'],
      },
      (error, matches) => {
        if (error) {
          reject(error);
        }
        resolve(matches);
      },
    );
  });

  files.forEach((file) => {
    fse.renameSync(path.join(projectDir, file), path.join(projectDir, formatFilename(file)));
  });
  // Render ejs templates.
  await ejsRenderDir(projectDir, ejsOptions);
  // Format project.
  await writeAbcJson(projectDir);
  // Add dependencies to package.json.
  await addDependencies(projectDir, extraDependencies);

  await formatPkgJson(projectDir);
}
