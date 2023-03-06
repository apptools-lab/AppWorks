import * as prettier from 'prettier';
import type { Options } from 'prettier';

export default function formatFileContent(text: string, options: Options = {}) {
  return prettier.format(text, {
    singleQuote: true,
    tabWidth: 2,
    parser: 'babel-ts' as any,
    ...options,
  });
}
