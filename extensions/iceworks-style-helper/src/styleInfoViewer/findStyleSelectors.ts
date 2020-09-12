import * as fs from 'fs';
import * as path from 'path';
import css from 'css';
import { IStyle } from './findStyle';
import { IStyleDependency } from './findStyleDependencies';

// Find styles selectors, ['.wrap', '.header' ....]
export default function findStyleSelectors(directory: string, styleDependencies: IStyleDependency[] = []): string[] {
  let selectors: string[] = [];

  for (let i = 0, l = styleDependencies.length; i < l; i++) {
    const file = path.join(directory, styleDependencies[i].source);
    const { stylesheet } = css.parse(fs.readFileSync(file, 'utf-8'));

    // eslint-disable-next-line
    stylesheet.rules.forEach((rule: IStyle) => {
      if (rule.selectors) {
        selectors = selectors.concat(rule.selectors);
      }
    });
  }

  return selectors;
}
