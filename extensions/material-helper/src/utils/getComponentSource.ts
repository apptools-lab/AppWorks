import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import { isImportDefaultSpecifier } from '@babel/types';
import getBabelParserPlugins from './getBabelParserPlugins';

function getComponentSource(
  documentText: string,
  tagName: string,
) {
  const ast = parser.parse(documentText, {
    sourceType: 'module',
    plugins: getBabelParserPlugins('ts'),
  });

  const result = { source: '', importedComponent: '' };

  traverse(ast, {
    ImportDeclaration(path) {
      const specifiers = path.get('specifiers');
      const targetSpecifier = specifiers.find((specifier) => specifier.node.local.name === tagName);
      if (targetSpecifier) {
        result.source = path.node.source.value;
        // @ts-ignore
        const { node: { local, imported } } = targetSpecifier;
        result.importedComponent = isImportDefaultSpecifier(targetSpecifier) ? local.name : imported.name;
        path.stop();
      }
    },
  });

  return result;
}

export default getComponentSource;
