import * as path from 'path';
import { jsxFileExtnames, projectPath } from '@appworks/project-service';
import getProjectAliasEntries from './getProjectAliasEntries';

/**
 * Checking if has resource path in the source code
 *
 * @param sourcePath source path
 * @param resourcePath original file path
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
    const regexp = new RegExp(`${importSourceDir}/(\\/${basename})${basename === 'index' ? '?' : ''}`);
    if (regexp.test(importSourceValue)) {
      match = true;
    }
  } else {
    // alias path
    const aliasEntries = getProjectAliasEntries(projectLanguageType);

    const aliasKey = Object.keys(aliasEntries).find(key => {
      const regexp = new RegExp(key);
      return regexp.test(importSourceValue);
    });
    if (aliasKey) {
      const entries = aliasEntries[aliasKey];
      if (Array.isArray(entries)) {
        for (const entry of entries) {
          const absoluteEntryPath = path.join(projectPath, entry, importSourceValue.replace(new RegExp(aliasKey), ''));
          const regexp = new RegExp(`${absoluteEntryPath}/(\\/${basename})${basename === 'index' ? '?' : ''}`);
          if (regexp.test(resourcePath)) {
            match = true;
            break;
          }
        }
      }
    }
  }

  return match;
}

export default checkHasResourcePath;
