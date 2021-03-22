import * as assert from 'assert';
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import { removeComponentCode } from '../../refactor';
import prettierFormat from '../../utils/prettierFormat';

const testPath = path.resolve(__dirname, '../../../', 'src/test');
const examplesPath = path.resolve(testPath, 'examples');
const expectsPath = path.resolve(testPath, 'expects');

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Remove component from function components', (done) => {
    const componentPath = path.join(examplesPath, 'components', 'Detail', 'index.tsx');
    const pagePath = path.join(examplesPath, 'pages', 'DetailPage', 'index.tsx');
    const code = removeComponentCode(pagePath, componentPath);
    const expectCode = fs.readFileSync(path.join(expectsPath, 'DetailPage.tsx'), { encoding: 'utf-8' });

    assert.strictEqual(code, prettierFormat(expectCode));
    done();
  });
});
