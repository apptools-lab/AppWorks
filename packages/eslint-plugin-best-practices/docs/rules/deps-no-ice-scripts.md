# deps-no-ice-scripts

It is not recommended to use ice-scripts, the new version is ice.js. See [https://ice.work/](https://ice.work/)

## Rule Details

Examples of **incorrect** code for this rule:

```json
{
  "devDependencies": {
    "ice.js": "^1.0.0"
  }
}
```

Examples of **correct** code for this rule:

```json
{
  "devDependencies": {
    "ice-script": "^1.0.0"
  }
}
```
