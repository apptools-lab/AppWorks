import generate from '@babel/generator';

const options = {
  retainLines: true,
};

function generateCode(ast) {
  return generate(ast, options).code;
}

export default generateCode;
