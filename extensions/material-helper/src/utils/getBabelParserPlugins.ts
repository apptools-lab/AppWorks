import { ParserPlugin } from '@babel/parser';

export default function getBabelParserPlugins(language: 'ts' | 'js'): ParserPlugin[] {
  const plugins: ParserPlugin[] = [
    'jsx',
    'doExpressions',
    'objectRestSpread',
    'decorators-legacy',
    'classProperties',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
  ];

  if (language === 'ts') {
    plugins.unshift('typescript');
  } else {
    plugins.unshift('flow');
  }

  return plugins;
}
