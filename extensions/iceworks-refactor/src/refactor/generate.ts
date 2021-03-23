import generate from '@babel/generator';

function generateCode(ast) {
  return generate(ast).code;
}

export default generateCode;
