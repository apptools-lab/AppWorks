import { removeUselessReferences } from '../../../refactor/modules/removeUselessReferences';
import parse from '../../../refactor/parser';
import generateCode from '../../../refactor/generateCode';
import * as assert from 'assert';

function generate(ast) {
  return generateCode(ast, {});
}

suite('removeUselessReferences module', () => {
  suite('remove dead import specifiers', () => {
    test('import default specifier', () => {
      const sourceCode = `
      import Detail from "@/components/Detail";
      export default function Home() {
        return;
      }`;
      const ast = parse(sourceCode);
      removeUselessReferences(ast, []);
      assert.strictEqual(generate(ast), `export default function Home() {
  return;
}`);
    });
    test('import specifier', () => {
      const sourceCode = `
      import { Detail } from "@/components/Detail";
      export default function Home() {
        return;
      }`;
      const ast = parse(sourceCode);
      removeUselessReferences(ast, []);
      assert.strictEqual(generate(ast), `export default function Home() {
  return;
}`);
    });
    test('import namespace specifier', () => {
      const sourceCode = `
      import * as Detail from "@/components/Detail";
      export default function Home() {
        return;
      }`;
      const ast = parse(sourceCode);
      removeUselessReferences(ast, []);
      assert.strictEqual(generate(ast), `export default function Home() {
  return;
}`);
    });
    test('one more specifiers', () => {
      const sourceCode = `
      import Detail, { name } from "@/components/Detail";
      export default function Home() {
        console.log(name);
        return;
      }`;
      const ast = parse(sourceCode);
      removeUselessReferences(ast, []);
      assert.strictEqual(generate(ast), `import { name } from "@/components/Detail";
export default function Home() {
  console.log(name);
  return;
}`);
    });
  });

  suite('remove dead class declaration', () => {
    test('class declaration should be removed', () => {
      const sourceCode = 'class A {}';
      const ast = parse(sourceCode);
      removeUselessReferences(ast, []);
      assert.strictEqual(generate(ast), '');
    });
    test('class declaration should not be removed', () => {
      const sourceCode = `
        class A {}
        export default function Home() {
          return <A></A>;
        }`;
      const ast = parse(sourceCode);
      removeUselessReferences(ast, []);
      assert.strictEqual(generate(ast), `class A {}

export default function Home() {
  return <A></A>;
}`);
    });
  });

  suite('remove dead function declaration', () => {
    test('function declaration should be removed', () => {
      const sourceCode = 'function fn() {}';
      const ast = parse(sourceCode);
      removeUselessReferences(ast, []);
      assert.strictEqual(generate(ast), '');
    });
    test('function declaration should not be removed', () => {
      const sourceCode = `
        function Fn() {
          return <div>1</div>;
        }
        export default function Home() {
          return <Fn></Fn>;
        }`;
      const ast = parse(sourceCode);
      removeUselessReferences(ast, []);
      assert.strictEqual(generate(ast), `function Fn() {
  return <div>1</div>;
}

export default function Home() {
  return <Fn></Fn>;
}`);
    });
  });

  suite('remove variable declaration', () => {
    test('variable declaration should be removed', () => {
      const sourceCode = 'var a = 1;';
      const ast = parse(sourceCode);
      removeUselessReferences(ast, []);
      assert.strictEqual(generate(ast), '');
    });

    test('variable declaration should be removed', () => {
      const sourceCode = `
      var a = '1';
      export default function Home() {
        return <div key={a}></div>;
      }`;
      const ast = parse(sourceCode);
      removeUselessReferences(ast, []);
      assert.strictEqual(generate(ast), `var a = '1';
export default function Home() {
  return <div key={a}></div>;
}`);
    });
  });

  suite('complex case in function component', () => {
    test('specifiers and unreferenced identifiers should be removed', () => {
      const sourceCode = `
      import Text from 'rax-text';
      var a = '1';
      export default function Home() {
        return <div></div>;
      }`;
      const ast = parse(sourceCode);
      removeUselessReferences(ast, []);
      assert.strictEqual(generate(ast), `export default function Home() {
  return <div></div>;
}`);
    });

    test('unreferenced object and identifiers should be removed', () => {
      const sourceCode = `
      import Text from 'rax-text';
      const c = 2;
      const d = 2;
      const o = { a: 1, b: d+2 };
      function Logo() {
        console.log(o.a);
        return (
          <Text>{c}</Text>
        )
      }
      const a = 1;
      const b = a + 1;
      export default function Home() {
        return <div></div>;
      }`;
      const ast = parse(sourceCode);
      removeUselessReferences(ast, ['b']);
      assert.strictEqual(generate(ast), `const a = 1;
const b = a + 1;
export default function Home() {
  return <div></div>;
}`);
    });

    test('unreferenced fn and identifiers should be removed', () => {
      const sourceCode = `
      import Text from 'rax-text';
      const c = 2;
      function fn() {}
      function Logo() {
        fn();
        return (
          <Text>{c}</Text>
        )
      }
      const a = 1;
      const b = a + 1;
      export default function Home() {
        return <div></div>;
      }`;
      const ast = parse(sourceCode);
      removeUselessReferences(ast, ['b']);
      assert.strictEqual(generate(ast), `const a = 1;
const b = a + 1;
export default function Home() {
  return <div></div>;
}`);
    });
  });

  suite('complex case in class component', () => {
    test('unreferenced specifiers and identifiers should be removed', () => {
      const sourceCode = `
      import Text from 'rax-text';
      var a = '1';
      export default class Home extends React.Component {
        render() {
          return <div></div>;
        }
      }`;
      const ast = parse(sourceCode);
      removeUselessReferences(ast, []);
      assert.strictEqual(generate(ast), `export default class Home extends React.Component {
  render() {
    return <div></div>;
  }

}`);
    });

    test('unreferenced identifiers should be removed', () => {
      const sourceCode = `
      import Text from 'rax-text';
      export default class Home extends React.Component {
        constructor() {
          this.a = a;
        }
        render() {
          return <div></div>;
        }
      }`;
      const ast = parse(sourceCode);
      removeUselessReferences(ast, []);
      assert.strictEqual(generate(ast), `export default class Home extends React.Component {
  constructor() {
    this.a = a;
  }

  render() {
    return <div></div>;
  }

}`);
    });
  });
});
