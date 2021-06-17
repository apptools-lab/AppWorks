import * as fs from 'fs';
import * as babelParser from '@babel/parser';
import traverse from '@babel/traverse';

const supportFiles = ['css', 'scss', 'sass', 'less'];

// import styles from './xxx.css'; -> { source: './xxx.css', identifier: 'styles' }
// import './xxx.css'; -> { source: './xxx.css', identifier: null }
export interface IStyleDependency {
  source: string;
  identifier: string | null;
}

// Find style dependencies, like import style form './index.css';
export function findStyleDependencies(file: string) {
  const StyleDependencies: IStyleDependency[] = [];

  try {
    const ast = babelParser.parse(fs.readFileSync(file, 'utf-8'), {
      // Support JSX and TS
      plugins: ['typescript', 'jsx'],
      sourceType: 'module',
    });

    // @ts-ignore
    traverse(ast, {
      ImportDeclaration(path) {
        const { node } = path;
        // Example /\.css$|\.scss$|\.sass$/
        if (
          new RegExp(`${supportFiles.map((supportFile) => `\\.${supportFile}$`).join('|')}`, 'i').test(
            node.source.value,
          )
        ) {
          StyleDependencies.push({
            source: node.source.value,
            // Just return first identifier.
            identifier: node.specifiers[0] ? node.specifiers[0].local.name : null,
          });
        }
      },
    });
  } catch (e) {
    // ignore
  }

  return StyleDependencies;
}
