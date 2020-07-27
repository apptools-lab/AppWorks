import TransformTypescript from '@babel/plugin-transform-typescript';

export default function () {
  return {
    name: 'transform-typescript',
    inherits: TransformTypescript,
    visitor: {},
  };
}
