import * as fs from 'fs';
import * as path from 'path';
import * as css from 'css';
import flatten from 'css-flatten';
import { IStyle } from './findStyle';
import { IStyleDependency } from './findStyleDependencies';

// Find styles selectors, ['.wrap', '.header' ....]
export default function findStyleSelectors(directory: string, styleDependencies: IStyleDependency[] = []): string[] {
  let selectors: string[] = [];

  for (let i = 0, l = styleDependencies.length; i < l; i++) {
    const file = path.join(directory, styleDependencies[i].source);

    const fileContent = fs.readFileSync(file, 'utf-8');
    let cssContent = fileContent;

    // Remove media and keyframes, it will cause css.parse error
    cssContent = cssContent.replace(/@[media|keyframes][^{]+\{([\s\S]+?})\s*}/g, '');

    if (
      // Flattens nested SASS LESS string
      /s(c|a)ss$|\.less$/.test(file)
    ) {
      // https://www.npmjs.com/package/css-flatten
      // Before:
      // .foo {
      //   color: red;
      //   .bar {
      //     color: blue;
      //   }
      // }
      // After:
      // .foo {
      //   color: red;
      // }
      // .foo .bar {
      //   color: blue;
      // }
      cssContent = flatten(cssContent);
    }

    const { stylesheet } = css.parse(cssContent);

    // eslint-disable-next-line
    stylesheet.rules.forEach((rule: IStyle) => {
      if (rule.selectors) {
        selectors = selectors.concat(rule.selectors.map((selector) => {
          // .foo .bar => .bar
          return selector.split(' ').pop() || '';
        }));
      }
    });
  }

  return selectors;
}
