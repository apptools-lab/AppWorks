import * as csscolors from 'css-color-names';

const colorRegDict = Object.keys(csscolors).concat([
  '(#[0-9A-F]{6})',
  '(#[0-9A-F]{3})',
  '(rgb|hsl)a?([^)]*)',
]);
const COLOR_REGEXP = new RegExp(colorRegDict.join('|'), 'i');

export default function isColor(vale: string): boolean {
  return COLOR_REGEXP.test(vale);
}
