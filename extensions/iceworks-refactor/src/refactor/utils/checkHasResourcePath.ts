import * as path from 'path';
import { jsxFileExtnames, projectPath } from '@iceworks/project-service';
import getProjectAliasEntries from './getProjectAliasEntries';

/**
 * Checking if has resource path in the source code
 *
 * @param sourcePath string of source path
 * @param resourcePath string of original file path
 * @param importSourceValue the source value in import declaration
 */
function checkHasResourcePath(
  sourcePath: string,
  resourcePath: string,
  importSourceValue: string,
  projectLanguageType: 'ts' | 'js',
) {
  let match = false;
  const fileDir = path.dirname(sourcePath);
  const importSourcePath: string = path.relative(fileDir, resourcePath);
  const importSourceDir: string = path.dirname(importSourcePath);
  const ext = jsxFileExtnames.find(jsxExt => {
    return importSourcePath.includes(jsxExt);
  });
  const basename: string = path.basename(importSourcePath, ext);

  if (/^\./.test(importSourceValue)) {
    // relative path
    const regexp = new RegExp(`${importSourceDir}(\\/${basename})?`);
    if (regexp.test(importSourceValue)) {
      match = true;
    }
  } else {
    const aliasEntries = getProjectAliasEntries(projectLanguageType);

    const aliasKey = Object.keys(aliasEntries).find(key => {
      const regexp = new RegExp(key);
      return regexp.test(importSourceValue);
    });
    if (aliasKey) {
      const entries = aliasEntries[aliasKey];
      if (Array.isArray(entries)) {
        for (const entry of entries) {
          // const entryRegExp = new RegExp(entry);
          // @/components/Logo
          const absoluteEntryPath = path.join(projectPath, entry, importSourceValue.replace(new RegExp(aliasKey), ''));
          console.log();
          const regexp = new RegExp(`${absoluteEntryPath}(\\/${basename})?`);
          if (regexp.test(resourcePath)) {
            match = true;
          }
        }
      }
    }

    console.log('aliasEntries', aliasEntries);
  }

  return match;
}

export default checkHasResourcePath;
