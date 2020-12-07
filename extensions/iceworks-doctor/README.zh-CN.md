简体中文 | [English](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-doctor/README.md)

# Doctor

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-doctor.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-doctor)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-doctor.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-doctor)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-doctor.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-doctor)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

Doctor 是一个免费的安全和质量审核工具。借助基于集成多扫描仪 [@iceworks/doctor](https://www.npmjs.com/package/@iceworks/doctor) 的设计，Doctor 可以在一次扫描中快速检测到应用程序和基础库代码中的各种安全漏洞和质量问题，而无需访问任何远程服务！你可以一键修复所有报告的问题，或者导航到源代码逐条来修复。

![demo](https://img.alicdn.com/tfs/TB1XB6_UpY7gK0jSZKzXXaikpXa-1200-724.gif)

1. 通过 `⇧⌘P` 或 `Ctrl+Shift+P` 快捷键唤醒命令面板
2. 输入 `Iceworks: 打开仪表盘` 或 `Iceworks: 扫描代码` 激活插件

## 项目详情

展示项目详情信息，包含名称，版本，项目类型，构建及 Git 信息。

## 质量检测

对项目进行 3 个维度的检测，包含：`Ali ESLint`([@iceworks/spec](https://www.npmjs.com/package/@iceworks/spec))、`可维护性` 及 `代码重复度`。

## 文件保存时检测

文件保存时默认进行`安全实践检测`。

![demo](https://img.alicdn.com/tfs/TB1ySXAVHr1gK0jSZFDXXb9yVXa-1780-478.png)

## 设置

1. 点击设置，进入设置页面
2. 配置是否开启保存文件时进行`安全实践检测`

## 安全和隐私

**您的数据是私有的**：我们永远不会与任何人共享您的个人数据。Doctor 是开源的，你可以很容易地看到我们收集了什么数据。

## 更多

本插件由 [Iceworks Team](https://marketplace.visualstudio.com/publishers/iceworks-team) 开发，是 Iceworks 套件的一部分，访问 [Iceworks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) 获取更多功能。
