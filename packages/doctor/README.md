# AppWorks Doctor

Analyse and running codemods over react/rax projects, troubleshooting and automatically fixing errors.  
## 1. Code Scanner

### Installation

```shell
$ npm i @appworks/doctor --save-dev
```

or

```shell
$ npm install -g @appworks/doctor
```

### Usage

```js
const { Doctor } = require('@appworks/doctor');

const doctor = new Doctor(options);
doctor.scan('/yourProjectPath').then((result) => {
  console.log(result);
});

```

### Usage(CLI)

Use `$ appworks-doctor -h` for help.

Scan
```shell
$ appworks-doctor -s ./
```

Options
```shell
$ appworks-doctor -s ./ --ignore types mock
```

### Options

#### new Doctor(options?);

* ignore?: string[], Ignore directories, example ['mock'] . `.gitignore` will work too.

#### scan('/yourProjectPath', options?);

* fix?: boolean, whether fix ESLint fixable problems.
* framework?: string, target project framework, default is `react`.
* transforms?: string[], you want to run code transform keys, from [@appworks/codemod](https://github.com/apptools-lab/codemod/)
* languageType?: 'js'|'ts', target project languageType, default is `js`.
* tempFileDir?: string, set temp reporters file directory, default is `node_modules/@appworks/doctor/tmp/`.
* disableESLint?: boolean, whether disable ESLint part reports.
* disableMaintainability?: boolean, whether disable maintainability part reports.
* disableRepeatability?: boolean, whether disable repeatability part reports.
* disableCodemod?: boolean, whether disable codemod part reports.
### Result

#### ESLint

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
`.eslintignore` ignore config will merge into ESLint ignore.

#### Maintainability

Use [typhonjs-escomplex](https://www.npmjs.com/package/typhonjs-escomplex) calculate complexity reports.

#### Repeatability

Use [jscpd](https://www.npmjs.com/package/jscpd) calculate repeatability reports.

#### Codemod

Use [@appworks/codemod](https://www.npmjs.com/package/@appworks/codemod) check and update Rax and React deprecated usages.

Enjoy!
