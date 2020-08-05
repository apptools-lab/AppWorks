# Internal url is not recommended (no-internal-url)

The group internal url is not recommended.


## Rule Details

Examples of **incorrect** code for this rule:

```js
request('yourSite.com');

```

### Options

Group internal url list。

```json
{
 "rules": {
    "@iceworks/security-practices/no-internal-url": ["warn", ["yourSite.com"]]
  },
}
```
