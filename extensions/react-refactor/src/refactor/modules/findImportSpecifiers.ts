import traverse from '@babel/traverse';
import checkHasResourcePath from '../utils/checkHasResourcePath';

/**
 * return the import specifiers which imported from the resourcePath
 *
 * e.g.:
 * sourcePath: /Users/src/pages/Home/index.tsx
 * resourcePath: /Users/src/pages/components/Detail/index.tsx
 * find the Detail Component specifiers in the sourcecode
 * import {UserDetail, TeacherDetail} from '../../components/Detail';
 * import {UserAbout, TeacherAbout} from '../../components/About';
 *
 * the function will returns ['UserDetail', 'TeacherDetail']
 */
export function findImportSpecifiers(ast, sourcePath, resourcePath, projectLanguageType) {
  const importSpecifiers: string[] = [];

  traverse(ast, {
    ImportDeclaration(path) {
      const { node } = path;
      const { source, specifiers } = node;
      if (!Array.isArray(specifiers)) return;

      const sourceValue = source.value;
      const hasResourcePath = checkHasResourcePath(sourcePath, resourcePath, sourceValue, projectLanguageType);
      if (hasResourcePath) {
        specifiers.forEach(specifier => {
          const localName = specifier.local.name;

          if (!importSpecifiers.includes(localName)) {
            importSpecifiers.push(localName);
          }
        });
      }
    },
  });

  return importSpecifiers;
}

export default function parse(parsed, options) {
  const { sourcePath, resourcePath, projectLanguageType } = options;
  const importSpecifiers = findImportSpecifiers(parsed.ast, sourcePath, resourcePath, projectLanguageType);
  parsed.skip = importSpecifiers.length === 0;
  parsed.importSpecifiers = importSpecifiers;
}

