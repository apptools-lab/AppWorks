
[English](./README.md) | 简体中文

<p align="center">
  <a href="https://ice.work">
    <img alt="Iceworks" src="https://img.alicdn.com/tfs/TB1kDZlXBBh1e4jSZFhXXcC9VXa-256-256.png" width="96">
  </a>
</p>

<h1 align="center">Iceworks</h1>

<p align="center">多端研发套件</p>

<p align="center">
  <a href="https://github.com/ice-lab/iceworks/actions"><img src="https://github.com/ice-lab/iceworks/workflows/ci/badge.svg" /></a>
  <a href="https://codecov.io/gh/ice-lab/iceworks"><img src="https://img.shields.io/codecov/c/github/ice-lab/iceworks/master.svg" alt="Test Coverage" /></a>
  <a href="https://github.com/alibaba/ice/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" /></a>
  <a href="/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license" /></a>
</p>

## 快速开始

### Iceworks 套件

使用 VS Code 套件快速开发多端项目。

![Iceworks](https://img.alicdn.com/tfs/TB12Z1jJFP7gK0jSZFjXXc5aXXa-2880-1754.png)

1. 打开 VS Code 套件市场中的 [Iceworks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) 页面；
2. 点击页面上的「安装」按钮；
3. 安装成功后，点击 VS Code 界面左侧活动栏上的「iceworks 图标」，开始使用。

### Iceworks CLI

使用 CLI 开发自定义物料集合。

- 安装工具：

  ```bash
  $ npm i -g iceworks
  ```
- 初始化物料集合：

  ```
  $ mkdir materials-example && cd materials-example
  $ iceworks init material
  ```

更多详细说明，请参考[《物料开发》](https://ice.work/docs/materials/about)。

## 参与贡献

欢迎通过 [issue](https://github.com/ice-lab/iceworks/issues/new) 反馈问题。

如果对 `Iceworks` 感兴趣，请参考 [CONTRIBUTING.md](./.github/CONTRIBUTING.md) 学习如何贡献代码。

## ICE 生态

|    Project         |    Version      |     Docs    |   Description       |
|----------------|------------------|--------------|-----------|
| [icejs] | [![icejs-status]][icejs-package] | [docs][icejs-docs] | 基于 React 的企业级研发框架 |
| [icestark] | [![icestark-status]][icestark-package] | [docs][icestark-docs] | 面向大型应用的微前端解决方案 |
| [icestore] | [![icestore-status]][icestore-package] | [docs][icestore-docs] | 简单友好的轻量级状态管理方案 |
| [formily] | [![formily-status]][formily-package] | [docs][formily-docs] | 能力完备性能出众的表单解决方案 |

[icejs]: https://github.com/alibaba/ice
[icestark]: https://github.com/ice-lab/icestark
[icestore]: https://github.com/ice-lab/icestore
[formily]: https://github.com/alibaba/formily

[icejs-status]: https://img.shields.io/npm/v/ice.js.svg
[icestark-status]: https://img.shields.io/npm/v/@ice/stark.svg
[icestore-status]: https://img.shields.io/npm/v/@ice/store.svg
[formily-status]: https://img.shields.io/npm/v/@formily/react.svg

[icejs-package]: https://npmjs.com/package/ice.js
[icestark-package]: https://npmjs.com/package/@ice/stark
[icestore-package]: https://npmjs.com/package/@ice/store
[formily-package]: https://npmjs.com/package/@formily/react

[icejs-docs]: https://ice.work/docs/guide/intro
[icestark-docs]: https://ice.work/docs/icestark/guide/about
[icestore-docs]: https://github.com/ice-lab/icestore#icestore
[formily-docs]: https://formilyjs.org/

## 社区

| 钉钉群	                             | GitHub issues |  Gitter |
|-------------------------------------|--------------|---------|
| <a href="https://ice.alicdn.com/assets/images/qrcode.png"><img src="https://ice.alicdn.com/assets/images/qrcode.png" width="150" /></a> | [issues]     | [gitter]|

[issues]: https://github.com/alibaba/ice/issues
[gitter]: https://gitter.im/alibaba/ice

## License

[MIT](LICENSE)
