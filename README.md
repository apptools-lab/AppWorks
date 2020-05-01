# iceworks-next

<a href="/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license" /></a>
<a href="https://travis-ci.com/ice-lab/iceworks-next"><img src="https://travis-ci.comice-labr/iceworks-next.svg?branch=master" alt="Build Status" /></a>
<a href="https://codecov.io/gh/ice-lab/iceworks-next"><img src="https://img.shields.io/codecov/c/github/ice-lab/iceworks-next/master.svg" alt="Test Coverage" /></a>
<a href="https://gitter.im/ice-lab/iceworks-next"><img src="https://badges.gitter.imice-labr/iceworks-next.svg" alt="Gitter" /></a>

## Develop

### Directory

```md
.
├── extensions // VS Code extensions
├── packages // Common packages
│   ├── add-block
|   ├── ...
│   └── config
└── scripts
```

### extensions

- [/extensions/app](/extensions/app): 核心应用，[去开发](/extensions/app)。

### packages

- @iceworks/npm-utils：npm 相关方法
- @iceworks/config：管理配置
- @iceworks/block-add：TODO，添加区块到项目中

### scripts

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