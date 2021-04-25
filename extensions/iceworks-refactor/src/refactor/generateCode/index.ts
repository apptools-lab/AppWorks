import generate, { GeneratorOptions } from '@babel/generator';

const defaultOptions: GeneratorOptions = {
  retainLines: true,
  jsescOption: {
    minimal: true, // To avoid Chinese characters escaped
  },
};

function generateCode(ast, options = defaultOptions) {
  return generate(ast, options).code;
}

export default generateCode;
