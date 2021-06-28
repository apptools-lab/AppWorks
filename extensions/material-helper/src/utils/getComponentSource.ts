import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import getBabelParserPlugins from './getBabelParserPlugins';

function getComponentSource(
  documentText: string,
  tagName: string,
) {
  const ast = parser.parse(documentText, {
    sourceType: 'module',
    plugins: getBabelParserPlugins('jsx'),
  });

  let source = '';

  traverse(ast, {
    ImportDeclaration(path) {
      const specifiers = path.get('specifiers');
      const targetSpecifier = specifiers.find(specifier => specifier.node.local.name === tagName);
      if (targetSpecifier) {
        source = path.node.source.value;
        path.stop();
      }
    }
  })

  return source;
}

export default getComponentSource;
