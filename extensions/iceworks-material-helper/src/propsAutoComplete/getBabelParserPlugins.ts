import { ParserPlugin } from '@babel/parser';

export default function getBabelParserPlugins(language: string): ParserPlugin[] {
  const plugins: ParserPlugin[] = [
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
    plugins.unshift('jsx');
  }

  return plugins;
}
