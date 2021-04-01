import traverse from '@babel/traverse';
import checkHasResourcePath from '../utils/checkHasResourcePath';

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
  parsed.done = importSpecifiers.length === 0;
  options.importSpecifiers = importSpecifiers;
}

