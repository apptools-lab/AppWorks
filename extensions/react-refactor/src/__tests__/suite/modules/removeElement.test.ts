import { removeElement } from '../../../refactor/modules/removeElement';
import parse from '../../../refactor/parser';
import generate from '../../../refactor/generateCode';
import * as assert from 'assert';

suite('removeJSXElement module', () => {
  suite('Normal', () => {
    const sourceCode = '<Detail><DetailPage name="1" /></Detail>';
    test('whole element', () => {
      const ast = parse(sourceCode);
      removeElement(ast, ['DetailPage']);
      assert.strictEqual(generate(ast), '<Detail></Detail>;');
    });

    test('children element', () => {
      const ast = parse(sourceCode);
      removeElement(ast, ['Detail']);
      assert.strictEqual(generate(ast), '');
    });
  });
  suite('Element in JSXExpressionContainer', () => {
    test('element as props', () => {
      const sourceCode = '<Detail comp={<DetailPage />}></Detail>';
      const ast = parse(sourceCode);
      removeElement(ast, ['DetailPage']);
      assert.strictEqual(generate(ast), '<Detail comp={null}></Detail>;');
    });
    test('element in conditional operator', () => {
      const sourceCode = '<Detail>{true ? <DetailPage name="1" /> : null}</Detail>';
      const ast = parse(sourceCode);
      removeElement(ast, ['DetailPage']);
      assert.strictEqual(generate(ast), '<Detail>{true ? null : null}</Detail>;');
    });
  });
});
