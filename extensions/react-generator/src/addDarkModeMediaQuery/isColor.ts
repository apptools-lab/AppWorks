import * as csscolors from 'css-color-names';

const colorRegDict = [
  '(#[0-9A-F]{6})',
  '(#[0-9A-F]{3})',
  '(rgb|hsl)a?([^)]*)',
];
const COLOR_REGEXP = new RegExp(colorRegDict.join('|'), 'i');

export default function isColor(value: string): boolean {
  return csscolors[value] || COLOR_REGEXP.test(value);
}
