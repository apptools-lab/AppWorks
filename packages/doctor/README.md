# Iceworks Doctor

Analyse react/rax projects, troubleshooting and automatically fixing errors.

## Installation

```shell
$ npm i @iceworks/doctor --save-dev
```

or

```shell
$ npm install -g @iceworks/doctor
```

## Usage

```js
const { Doctor } = require('@iceworks/doctor');

const doctor = new Doctor(options);
doctor.scan('/yourProjectPath').then((result) => {
  console.log(result);
});

```

or

```shell
$ iceworks-doctor -s ./
```

### CLI

Help
```shell
iceworks-doctor -h
```

Scan
```shell
iceworks-doctor -s ./
```

Options
```shell
iceworks-doctor -s ./ --ignore types mock --supportExts css json
```

## Options

* ignore, string[] Ignore directories, example ['mock'] .
* supportExts, string[] Support file exts, example ['css'] .
* framework, string target project framework, default is `react` .
* languageType, 'js'|'ts' target project languageType, default is `js` .

## Result

### ESLint

Use [@iceworks/spec](https://www.npmjs.com/package/@iceworks/spec) check your project. 

`.eslintrc.js` customConfig will merge into ESLint config.

```js
// .eslintrc.js
const { getESLintConfig } = require('@iceworks/spec');
 
// getESLintConfig(rule: 'rax'|'react', customConfig?);
module.exports = getESLintConfig('react', {
  'no-unused-vars': 'off'
});
```
`.gitignore` and `.eslintignore` ignore config will merge into ESLint ignore.

### maintainability

Use [typhonjs-escomplex](https://www.npmjs.com/package/typhonjs-escomplex) calculate complexity reports.

### repeatability

Use [jscpd](https://www.npmjs.com/package/jscpd) calculate repeatability reports.
