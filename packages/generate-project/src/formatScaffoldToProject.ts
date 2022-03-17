import * as fse from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';
import formatFilename from './formatFilename';
import formatProject from './formatProject';
import ejsRenderDir from './ejsRenderDir';

export default async function formatScaffoldToProject(projectDir: string, projectName?: string, ejsOptions: any = {}) {
  // format filename
  const files = glob.sync('**/*', { cwd: projectDir, ignore: ['node_modules/**', 'build/**', '.ice/**', '.rax/**'] });
  files.forEach((file) => {
    fse.renameSync(path.join(projectDir, file), path.join(projectDir, formatFilename(file)));
  });
  // render ejs template
  await ejsRenderDir(projectDir, ejsOptions);
  // format project
  await formatProject(projectDir, projectName, ejsOptions);
}
