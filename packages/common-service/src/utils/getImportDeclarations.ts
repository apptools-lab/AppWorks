import * as babylon from '@babel/parser';
import traverse from '@babel/traverse';

export interface IPosition {
  line: number;
  column: number;
}

export interface ILoc {
  start: IPosition;
  end: IPosition;
  name: string;
}

export interface IImportDeclarations {
  source: {
    value: string;
  };
  specifiers: Array<{
    loc: ILoc;
    local: {
      name: string;
    };
    imported: {
      name: string;
    };
  }>;
  loc: ILoc;
}

export async function getImportDeclarations(content: string): Promise<IImportDeclarations[]> {
  const importDeclarations: IImportDeclarations[] = [];

  try {
    const ast = babylon.parse(content, {
      allowImportExportEverywhere: true,
      sourceType: 'module',
      plugins: ['jsx'],
    });
    // @ts-ignore
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        importDeclarations.push(node as any);
      },
    });
  } catch (error) {
    // ignore error
  }

  return importDeclarations;
}
