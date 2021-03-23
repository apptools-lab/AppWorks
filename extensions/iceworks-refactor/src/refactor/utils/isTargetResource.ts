import * as path from 'path';
import { jsxFileExtnames } from '@iceworks/project-service';

/**
 * Checking the target component depends on the import declaration source value
 *
 * @param sourcePath string of source path
 * @param resourcePath string of original file path
 * @param importSourceValue the source value in import declaration
 */
function isTargetResource(
  sourcePath: string,
  resourcePath: string,
  importSourceValue: string,
  aliasEntries = {},
) {
  let match = false;
  if (/^\./.test(importSourceValue)) {
    // relative path
    const fileDir = path.dirname(sourcePath);
    const importSourcePath: string = path.relative(fileDir, resourcePath);
    const importSourceDir: string = path.dirname(importSourcePath);
    const ext = jsxFileExtnames.find(jsxExt => {
      return importSourcePath.includes(jsxExt);
    });

    const basename: string = path.basename(importSourcePath, ext);

    const regexp = new RegExp(`${importSourceDir}(\\/${basename})?`);

    if (regexp.test(importSourceValue)) {
      match = true;
    }
  } else {
    // TODO alias path
    console.log('aliasEntries:', aliasEntries);
  }

  return match;
}

export default isTargetResource;
