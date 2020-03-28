# iceworks-next

<a href="/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license" /></a>
<a href="https://travis-ci.com/ice-lab/iceworks-next"><img src="https://travis-ci.comice-labr/iceworks-next.svg?branch=master" alt="Build Status" /></a>
<a href="https://codecov.io/gh/ice-lab/iceworks-next"><img src="https://img.shields.io/codecov/c/github/ice-lab/iceworks-next/master.svg" alt="Test Coverage" /></a>
<a href="https://gitter.im/ice-lab/iceworks-next"><img src="https://badges.gitter.imice-labr/iceworks-next.svg" alt="Gitter" /></a>

## Usage

### packages

- @iceworks/npm-utils：npm 相关方法
- @iceworks/config：管理配置
- @iceworks/block-add：TODO，添加区块

### extensions

- `extensions/app`: 核心应用

## Develop

### command

```bash
# install deps and link packages
$ yarn run setup

# packages
$ yarn run packages:watch
$ yarn run packages:build

# publish packages
$ yarn run publish
$ yarn run publish:beta

# add dep to some package
$ yarn workspace @iceworks/app add <npmName>
# 如果全局指定了 yarn 的 registry，添加依赖时请使用官方源，避免污染 yarn.lock
$ yarn workspace @iceworks/app add <npmName> --registry https://registry.yarnpkg.com
```

### Directory

```md
.
├── extensions // VS Code extensions
├── packages // Common packages
│   ├── add-block
│   └── config
└── scripts
```

### extensions

开发比较独立，因此依赖独立安装，不跟 lerna 耦合：

```bash
$ cd extensions/app
$ yarn install // or cnpm install
$ npm start

# TODO: link packages
```

Then open vscode and debug extension. Docs:

- [官方英文教程](https://code.visualstudio.com/api)
- [VS Code 插件开发中文教程](https://liiked.github.io/VS-Code-Extension-Doc-ZH/#/api/README)