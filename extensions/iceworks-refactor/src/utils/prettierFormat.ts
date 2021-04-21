import prettier from 'prettier';

function prettierFormat(code: string) {
  return prettier.format(code, {
    singleQuote: true,
    trailingComma: 'es5',
    parser: 'babel',
  });
}

export default prettierFormat;
