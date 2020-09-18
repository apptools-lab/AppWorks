import * as fs from 'fs';
import * as path from 'path';
import css from 'css';
import flatten from 'css-flatten';
import { IStyleDependency } from './findStyleDependencies';

// https://www.npmjs.com/package/css
export interface IStylePosition {
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  };
}

export interface IStyle {
  type: string;
  selectors: string[];
  position: IStylePosition;
  file: string;
  code: string;
}

// Find style property by className, in some CSS files.
export function findStyle(
  directory: string,
  className: string,
  styleDependencies: IStyleDependency[] = [],
): IStyle | undefined {
  let matched: IStyle | undefined;

  for (let i = 0, l = styleDependencies.length; i < l; i++) {
    const file = path.join(directory, styleDependencies[i].source);
    const fileContent = fs.readFileSync(file, 'utf-8');
    let cssContent = fileContent;

    if (
      // SASS file
      /s(c|a)ss$/.test(file) &&
      // Not contain media and keyframes
      fileContent.indexOf('@media') === -1 &&
      fileContent.indexOf(' @keyframes') === -1
    ) {
      // Flattens nested SASS string
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
      cssContent = flatten(fs.readFileSync(file, 'utf-8'));
    }

    const { stylesheet } = css.parse(cssContent);
    matched = stylesheet.rules.find(
      (rule) => rule.selectors &&
        // Selector endWith className. Example: '.bar' can match '.foo .bar'.
        rule.selectors.find((selector) => selector.endsWith(className)),
    );

    // Just find one matched stylesheet.
    if (matched) {
      matched.file = file;
      matched.code = css.stringify({
        type: 'stylesheet',
        stylesheet: { rules: [matched] },
      });
      break;
    }
  }

  return matched;
}
