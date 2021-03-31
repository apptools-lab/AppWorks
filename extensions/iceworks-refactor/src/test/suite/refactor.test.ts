import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { removeComponent } from '../../refactor';
import prettierFormat from '../../utils/prettierFormat';

const testPath = path.resolve(__dirname, '../../../', 'src/test');
const examplesPath = path.resolve(testPath, 'examples');
const expectsPath = path.resolve(testPath, 'expects');

suite('Refactor: remove component in page', () => {
  test('Remove component in function component', (done) => {
    const componentPath = path.join(examplesPath, 'components', 'Detail', 'index.tsx');
    const pagePath = path.join(examplesPath, 'pages', 'DetailPage', 'index.tsx');
    removeComponent(pagePath, componentPath, 'ts').then(code => {
      const expectCode = prettierFormat(fs.readFileSync(path.join(expectsPath, 'DetailPage.tsx'), { encoding: 'utf-8' }));
      assert.strictEqual(code, expectCode);
      assert.strictEqual(code, expectCode);
      done();
    });
  });

  test('Remove component in class component', async () => {
    const componentPath = path.join(examplesPath, 'components', 'Todo', 'index.tsx');
    const pagePath = path.join(examplesPath, 'pages', 'TodoPage', 'index.tsx');
    const code = await removeComponent(pagePath, componentPath, 'ts');
    const expectCode = prettierFormat(fs.readFileSync(path.join(expectsPath, 'TodoPage.tsx'), { encoding: 'utf-8' }));

    assert.strictEqual(code, expectCode);
  });
});
