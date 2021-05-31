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
* languageType?: 'js'|'ts', target project languageType, default is `js`.
* tempFileDir?: string, set temp reporters file directory, default is `node_modules/@appworks/doctor/tmp/`.
* disableESLint?: boolean, whether disable ESLint part reports.
* disableMaintainability?: boolean, whether disable maintainability part reports.
* disableRepeatability?: boolean, whether disable repeatability part reports.

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

## 2. Codemod

This repository also contains a collection of codemod scripts that help update React([ICE](https://ice.work/)) and [Rax](https://rax.js.org/) APIs.

### Installation

Install [jscodeshift](https://www.npmjs.com/package/jscodeshift) and @appworks/doctor.

```shell
$ npm i -g jscodeshift @appworks/doctor 
```

### Usage (CLI)

`appworks-doctor -c <transform> <path?> [...options?]`

   * `transform` - name of transform, see available transforms below.
   * `path?` - files or directory to transform. 
   * `options?` - some rule's options.

This will start an interactive wizard, and then run the specified transform.

PS: You can also clone this repository then use [jscodeshift](https://www.npmjs.com/package/jscodeshift)'s CLI API.

### Included Transforms

#### `plugin-rax-component-to-component`

Update `plugin-rax-component` to `plugin-component`.
See: https://rax.js.org/docs/guide/com-migration

```shell
appworks-doctor -c plugin-rax-component-to-component ./
```

Enjoy!
