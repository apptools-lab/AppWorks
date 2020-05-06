# iceworks

<a href="/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license" /></a>
<a href="https://travis-ci.com/ice-lab/iceworks"><img src="https://travis-ci.comice-labr/iceworks.svg?branch=master" alt="Build Status" /></a>
<a href="https://codecov.io/gh/ice-lab/iceworks"><img src="https://img.shields.io/codecov/c/github/ice-lab/iceworks/master.svg" alt="Test Coverage" /></a>

## Develop

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

- [/extensions/app](/extensions/app): 核心应用，[去开发](/extensions/app)。

### packages

- iceworks-cli: 命令行工具
- icenpm-utils：npm 相关方法
- config：管理配置

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
$ yarn workspace iceworks add <npmName>
# 如果全局指定了 yarn 的 registry，添加依赖时请使用官方源，避免污染 yarn.lock
$ yarn workspace iceworks add <npmName> --registry https://registry.yarnpkg.com
```