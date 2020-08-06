# no-sensitive-word

Don't use some sensitive word.

## Rule Details

Examples of **incorrect** code for this rule:

```js

// stupid xxx
const jsx = <p>汇款</p>;

```

### Options

Sensitive word list。

```json
{
 "rules": {
    "@iceworks/security-practices/no-sensitive-word": ["warn", ["fuck", "汇款"]],
  },
}

