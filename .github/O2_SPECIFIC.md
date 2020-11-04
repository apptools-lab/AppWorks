# O2 SPECIFIC

O2 is a Ali internal editor, if you are a community developer, please ignore this document.

Iceworks converts VS Code Pack to O2 Pack, this document describes the development, debug, and release of the O2 Pack.

## Build O2 Pack 

Build O2 pack by following commands:

```bash
$ git clone git@github.com:ice-lab/iceworks.git
$ cd iceworks/
$ npm install
$ npm run o2:general
```

## Debug O2 Packs

```bash
$ tnpm install @ali/kaitian-cli -g
$ cd extensions/iceworks
$ tnpm install
$ npm run compile
$ kaitian dev
```

## Release O2 Pack

```bash
$ npm run o2:build
$ npm run o2:release
```
