# deps-no-resolutions

It is not recommended to use resolutions to lock the version.

## Rule Details

Examples of **incorrect** code for this rule:

```json
{
  "resolutions": {
    "package-a": "1.0.0",
    "package-b": "2.0.0",
    "package-c": "3.5.2"
  }
}
```
