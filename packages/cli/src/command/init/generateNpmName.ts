import * as decamelize from 'decamelize';

export default function (name: string, npmScope?: string): string {
  // WebkitTransform -> webkit-transform
  name = decamelize(name, '-');
  return npmScope ? `${npmScope}/${name}` : name;
}
