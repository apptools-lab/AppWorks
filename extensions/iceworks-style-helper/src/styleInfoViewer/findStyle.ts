import * as fs from 'fs';
import * as path from 'path';
import css from 'css';
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
export function findStyle(directory: string, className: string, styleDependencies: IStyleDependency[] = []): IStyle | undefined {
  let matched: IStyle | undefined;

  for (let i = 0, l = styleDependencies.length; i < l; i++) {
    const file = path.join(directory, styleDependencies[i].source);
    const stylesheet = css.parse(fs.readFileSync(file, 'utf-8')).stylesheet;
    
    matched = stylesheet.rules.find(rule => rule.selectors && rule.selectors.includes(`.${className}`));
    
    // Just find one matched stylesheet.
    if (matched) {
      matched.file = file;
      matched.code = css.stringify({
        type: 'stylesheet',
        stylesheet: { rules: [matched] }
      });
      break;
    }
  }

  return matched;
};
