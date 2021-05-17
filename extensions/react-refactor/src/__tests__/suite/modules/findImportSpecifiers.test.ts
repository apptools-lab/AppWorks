import { findImportSpecifiers } from '../../../refactor/modules/findImportSpecifiers';
import * as path from 'path';
import * as assert from 'assert';
import * as fse from 'fs-extra';
import parse from '../../../refactor/parser';

const sourcePath = path.resolve(__dirname, '../../../../src/__tests__/examples/Source.tsx');
const resourcePath = path.resolve(__dirname, '../../../../src/__tests__/examples/Resource.tsx');
const noSourcePath = path.resolve(__dirname, '../../../../src/__tests__/examples/NoSource.tsx');
const projectType = 'ts';

suite('Find Import Specifiers', () => {
  const sourceCode = fse.readFileSync(sourcePath, { encoding: 'utf-8' });
  const sourceAST = parse(sourceCode);

  test('should get the import specifiers', () => {
    const importSpecifiers = findImportSpecifiers(sourceAST, sourcePath, resourcePath, projectType);
    assert.deepStrictEqual(importSpecifiers, ['Source']);
  });

  test('should get empty import specifier', () => {
    const importSpecifiers = findImportSpecifiers(sourceAST, sourcePath, noSourcePath, projectType);
    assert.deepStrictEqual(importSpecifiers, []);
  });
});
