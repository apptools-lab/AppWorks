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

* [`deps-no-ice-scripts`](./docs/rules/deps-no-ice-scripts.md) It is not recommended to use ice-scripts, the new version is ice.js.
* [`deps-no-resolutions`](./docs/rules/deps-no-resolutions.md) It is not recommended to use resolutions to lock the version.
* [`deps-no-router-library`](./docs/rules/deps-no-router-library.md) It is not recommended to directly rely on routing libraries, such as react-router-dom, react-router. 
* [`deps-recommend-update-rax`](./docs/rules/ddeps-recommend-update-rax.md) Rax version < 1.0 , recommend to update Rax.
* [`no-broad-semantic-versioning`](./docs/rules/no-broad-semantic-versioning.md) Recommended the semantic versioning include everything greater than a particular version in the same major range.
* [`no-js-in-ts-project`](./docs/rules/no-js-in-ts-project.md) It is not recommended to use js and ts files at the same time.
* [`no-lowercase-component-name`](./docs/rules/no-lowercase-component-name.md) It is not recommended to name components in lower case.
* [`no-multi-nested-page`](./docs/rules/no-multi-nested-page.md) Multiple nested pages are not recommended.
* [`recommend-functional-component`](./docs/rules/recommend-functional-component.md) It is not recommended to use class component.
