import prettier from 'prettier';

function prettierFormat(code: string) {
  return prettier.format(code, {
    singleQuote: true,
    trailingComma: 'es5',
    parser: 'typescript',
  });
}

export default prettierFormat;
