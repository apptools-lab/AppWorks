# Iceworks Doctor

Analyse react/rax projects, troubleshooting and automatically fixing errors.

## Installation

```shell
$ npm i @iceworks/doctor --save-dev
```

or

```shell
$ npm install -g jscpd
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

## Options

* ignoreDirs, string[] Ignore directories, example ['mock'] .
* supportExts, string[] Support file exts, example ['css'] .

## CLI

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
iceworks-doctor -s ./ --ignoreDir types mock --supportExts css json
```
