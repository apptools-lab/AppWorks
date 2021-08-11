import * as fs from 'fs';
import * as path from 'path';
import { Uri } from 'vscode';
import * as glob from 'glob';
import * as cssbeautify from 'cssbeautify';
import recorder from '../recorder';
import getDarkModeStyle from './getDarkModeStyle';

const IGNORE_DIRS = ['node_modules', 'build', '.rax', '.ice'];
const SUPPORT_FILE_TYPES = ['css', 'less', 'sass', 'scss'];

function processCssFile(file: string) {
  const fileType = path.extname(file).replace('.', '');

  if (SUPPORT_FILE_TYPES.indexOf(fileType) === -1) {
    return false;
  }

  const css = fs.readFileSync(file, 'utf-8');
  const darkModeStyle = getDarkModeStyle(css, fileType);

  if (darkModeStyle) {
    fs.writeFileSync(
      file,
      `${css}\n\n${cssbeautify(`@media (prefers-color-scheme: dark) { ${darkModeStyle} }`, { indent: '  ' })}`,
    );
  }
}

export default function addDarkModeMediaQuery(uri: Uri) {
  recorder.record({
    module: 'generator',
    action: 'addDarkModeMediaQuery',
  });

  const { fsPath } = uri;

  const stat = fs.lstatSync(fsPath);

  if (stat.isDirectory()) {
    glob(`${fsPath}/**/*.{${SUPPORT_FILE_TYPES.join(',')}}`, {
      ignore: IGNORE_DIRS.map((dir) => `${fsPath}/**/${dir}/**`),
    }, (er, files) => {
      files.forEach((file) => {
        processCssFile(file);
      });
    });
  } else {
    processCssFile(fsPath);
  }
}
