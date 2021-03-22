import generate from '@babel/generator';

export default (ast) => {
  return generate(ast).code;
};
