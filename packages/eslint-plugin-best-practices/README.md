# @iceworks/eslint-plugin-best-practices

Iceworks doctor best practices eslint plugin.

## Installation

Install [esLint](http://eslint.org), `@ice/spec` and `@iceworks/eslint-plugin-best-practices`:

```shell
$ npm install --save-dev eslint @ice/spec @iceworks/eslint-plugin-best-practices
```

## Usage

Add `best-practices` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "@iceworks/best-practices"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "@iceworks/best-practices/rule-name": 2
    }
}
```

Or you can only use extends to set default rules config.

```json
{
    "extends": ["plugin:@iceworks/best-practices/recommended"]
};
```

## Supported Rules

* Fill in provided rules here





