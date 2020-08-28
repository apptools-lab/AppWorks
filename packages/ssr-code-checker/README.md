# SSR Code Checker

Check unsafe code in SSR project, such as global method usage and css unit.

## Usage

### Cli

install

```shell
$npm install @iceworks/ssr-code-checker -g
```

Scan

```
ssr-code-checker -s yourCodeDir
```

Help

```
ssr-code-checker -h
```

### node module

```
$npm install @iceworks/ssr-code-checker --save
```

demo

```js
import  { noUnitLessLineHeight, wrongGlobalVariableUsage } from '@iceworks/ssr-code-checker';
const code = `
.test{
  line-height: 20;
}
`
// noUnitLessLineHeight(code: string, uri: string): IProblem[];
// wrongGlobalVariableUsage(code: string, uri: string): IProblem[];
noUnitLessLineHeight(code, 'test.css');
```

Use in eslint rules

```js
import  { noUnitLessLineHeight, wrongGlobalVariableUsage } from '@iceworks/ssr-code-checker';

module.exports = {
  // ...your rule meta
  create(context) {
    const sourceCode = context.getSourceCode();
	  const sourceCodeText = sourceCode.getText();
    const uri = context.getFilename();
    
    noUnitLessLineHeight(sourceCodeText, uri).forEach((problem)=>{
      context.report({
        message: problem.rule,
        loc: {
          start: {
            line: problem.range.start.line,
            column: problem.range.start.col
          },
          end: {
            line: problem.range.end.line,
            column: problem.range.end.col
          },
        }
      });
    }); 
  }
}
```

## Interfaces

```typescript
interface IPosition {
  line: number;
  col: number;
}

interface IProblem {
  uri: string;
  rule: string;
  range: {
    start: IPosition;
    end: IPosition;
  };
  source: string;
}
```

## Result Example

```json
[
  {
    "uri": "./src/test.jsx",
    "rule": "wrong-global-variable-usage",
    "range": {
      "start": {
        "line": 8,
        "col": 10
      },
      "end": {
        "line": 8,
        "col": 18
      }
    },
    "source": "location"
  },
 {
    "uri": "./src/test.css",
    "rule": "no-unit-less-line-height",
    "range": {
      "start": {
        "line": 1,
        "col": 2
      },
      "end": {
        "line": 1,
        "col": 18
      }
    },
    "source": "line-height: 20;"
  }
]
```
