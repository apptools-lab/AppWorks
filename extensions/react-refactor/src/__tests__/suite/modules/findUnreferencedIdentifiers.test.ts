import { findUnreferencedIdentifiers } from '../../../refactor/modules/findUnreferencedIdentifiers';
import parse from '../../../refactor/parser';
import * as assert from 'assert';

suite('findUnreferencedIdentifiers Module', () => {
  test('find unreferenced import specifier', () => {
    const sourceCode = `
    import { Body, name } from "@/components/Logo";
    console.log(name);
    `;
    const ast = parse(sourceCode);
    const unreferencedIdentifiers = findUnreferencedIdentifiers(ast);
    assert.deepStrictEqual(unreferencedIdentifiers, ['Body']);
  });

  test('find unreferenced import specifier', () => {
    const sourceCode = `
    import Body, { name } from "@/components/Logo";
    console.log(1);
    `;
    const ast = parse(sourceCode);
    const unreferencedIdentifiers = findUnreferencedIdentifiers(ast);
    assert.deepStrictEqual(unreferencedIdentifiers, ['Body', 'name']);
  });

  test('find unreferenced import namespace specifier', () => {
    const sourceCode = `
    import * as Logo from "@/components/Logo";
    import * as Home from "@/components/Home";
    import * as Detail from "@/components/Detail";
    console.log(Detail);
    `;
    const ast = parse(sourceCode);
    const unreferencedIdentifiers = findUnreferencedIdentifiers(ast);
    assert.deepStrictEqual(unreferencedIdentifiers, ['Logo', 'Home']);
  });

  test('find unreferenced import default specifier', () => {
    const sourceCode = `
    import Body, { name } from "@/components/Logo";
    import Home from "@/components/Home";
    console.log(name);
    `;
    const ast = parse(sourceCode);
    const unreferencedIdentifiers = findUnreferencedIdentifiers(ast);
    assert.deepStrictEqual(unreferencedIdentifiers, ['Body', 'Home']);
  });
});
