import * as parser from '@babel/parser';

function getASTByCode(code: string) {
  return parser.parse(code, {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    plugins: ['dynamicImport', 'jsx', 'typescript', 'decorators-legacy'],
  });
}

export default getASTByCode;
