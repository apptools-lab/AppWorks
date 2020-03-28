# iceworks-next

<a href="/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license" /></a>
<a href="https://travis-ci.com/imsobear/iceworks-next"><img src="https://travis-ci.com/imsobear/iceworks-next.svg?branch=master" alt="Build Status" /></a>
<a href="https://codecov.io/gh/imsobear/iceworks-next"><img src="https://img.shields.io/codecov/c/github/imsobear/iceworks-next/master.svg" alt="Test Coverage" /></a>
<a href="https://gitter.im/imsobear/iceworks-next"><img src="https://badges.gitter.im/imsobear/iceworks-next.svg" alt="Gitter" /></a>

## Usage

### packages

- @iceworks/npm-utils：npm 相关方法
- @iceworks/config：管理配置
- @iceworks/project-generate：生成项目
- @iceworks/block-add：TODO，添加区块

### extensions

- iceworks engine: install/start/build
- iceworks exmaple: just example
- 添加页面
- 添加区块
- 依赖管理

## Develop

### command

```bash
# install all deps
$ yarn run install:deps
$ yarn run install:deps -- --registry=http://registry.npm.taobao.org

# build packages and run link
$ yarn run setup

# watch electron main & electron renderer
$ yarn run app:watch
# start electron app
$ yarn run app:start


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
├── app // Electron app
├── extensions // VS Code extensions
├── packages // Common packages
│   ├── add-block
│   └── config
└── scripts
```

### VS Code extensions

开发过程比较独立，不放在 yarn workspace 中，插件自己管理依赖即可。

```bash
$ npm i -g vsce
$ cd extensions/example
$ vsce publish
```

## TODO

- extensions 下 link packages