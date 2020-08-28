# @iceworks/eslint-plugin-security-practices

Iceworks doctor security practices eslint plugin.

## Installation

Install [esLint](http://eslint.org), `@ice/spec` and `@iceworks/eslint-plugin-security-practices`:

```shell
$ npm install --save-dev eslint @ice/spec @iceworks/eslint-plugin-security-practices
```

## Usage

Add `security-practices` to the plugins section of your `.eslintrc` configuration file. 

```json
{
    "plugins": [
        "@iceworks/security-practices"
    ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
 		"plugins": [
        "@iceworks/security-practices"
    ],
    "rules": {
        "@iceworks/security-practices/rule-name": 2
    }
}
```

Or you can only use extends to set default rules config.

```json
{
    "extends": ["plugin:@iceworks/security-practices/recommended"]
};
```

## Supported Rules

* [`no-http-url`](./docs/rules/no-http-url.md) Recommended the http url switch to HTTPS.
* [`no-internal-url`](./docs/rules/no-internal-url.md) The group internal url is not recommended.
* [`no-patent-licenses`](./docs/rules/no-patent-licenses.md) Recommend using the dependency with Open-Source license.
* [`no-secret-info`](./docs/rules/no-secret-info.md) Don't show `password` `token` and `secret` in plain text.
* [`no-sensitive-word`](./docs/rules/no-sensitive-word.md) Don't use some sensitive word.





