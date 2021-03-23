import traverse from '@babel/traverse';
import isTargetResource from '../utils/isTargetResource';

function findImportSpecifiers(ast, sourcePath, resourcePath, aliasEntries = {}) {
  const importSpecifiers: string[] = [];

  traverse(ast, {
    ImportDeclaration(path) {
      const { node } = path;
      const { source, specifiers } = node;
      if (!Array.isArray(specifiers)) return;

      const sourceValue = source.value;
      const isTarget = isTargetResource(sourcePath, resourcePath, sourceValue, aliasEntries);
      if (isTarget) {
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

export default {
  parse(parsed, options) {
    const importSpecifiers = findImportSpecifiers(parsed.ast, options.sourcePath, options.resourcePath);
    parsed.done = importSpecifiers.length === 0;
    options.importSpecifiers = importSpecifiers;
  },
  // for test export
  _findImportSpecifiers: findImportSpecifiers,
};
