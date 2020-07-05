import * as upperCamelCase from 'uppercamelcase';

export default function generateComponentName(name: string): string {
  return upperCamelCase(name);
}
