简体中文 | [English](https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks/README.md)

# Iceworks

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks)
[![Downloads](https://vsmarketplacebadge.apphb.com/downloads-short/iceworks-team.iceworks.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-star/iceworks-team.iceworks.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks&ssr=false#review-details)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ice-lab/iceworks/pulls)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

可视化智能开发助手，通过可视化编程和智能辅助手段，更快更好地构建多端应用，支持 Web 、HTML 5 和小程序应用。

## 核心特性

### 可视化开发

Iceworks 可视化开发提供两个基本功能：可视化搭建和可视化配置。

可视化搭建提供所见即所得的拖拽能力，助力快速完成前端页面的开发。该能力不与具体平台绑定、和具体框架无关，搭建完成后可以继续二次编码，它在极大降低前端开发的门槛和提升前端开发的效率同时，还兼顾了程序的可维护性和灵活性：

![可视化搭建](https://img.alicdn.com/tfs/TB13RgHVGL7gK0jSZFBXXXZZpXa-2880-1754.png_790x10000.jpg)

> 更多介绍，请参考[《可视化搭建》](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder)。

可视化配置旨在降低前端开发门槛、提升开发体验，提供了流程引导生成代码和表单操作生成代码的能力，该能力支持自定义模板或物料，为开发者提供个性化代码的生成能力：

![可视化配置](https://img.alicdn.com/tfs/TB1VzS_i8Bh1e4jSZFhXXcC9VXa-1024-768.png_790x10000.jpg)

> 更多介绍，请参考[《可视化配置》](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-config-helper)。

### 智能编程

Iceworks 智能编程当前提供了两个基本功能：代码自动补全和代码信息提示。

在开发者编写代码的过程中，智能引擎能够自动预测开发者的编程意图，连续向开发者推荐「即将书写的下一段代码」，开发者可以通过「一键补全」的方式，直接确认接下来要输入的代码，从而大大提升代码的编写效率。例如输入样式字段和值时，Iceworks 提供的代码自动补全效果如下：

![使用示例](https://user-images.githubusercontent.com/56879942/87412958-3895e700-c5fc-11ea-88e2-3e3e78a07f9e.gif)

Iceworks 的代码自动补全能力基于语言语义和源代码分析，完全本地执行，确保代码安全；毫秒级响应，流畅进行编码！

### 丰富的物料体系

Iceworks 内置 [Fusion Design](https://fusion.design/)、[Rax UI](https://rax.js.org/docs/components/introduce) 组件库，丰富的物料开箱即用：可通过物料创建应用、生成组件和组装页面、一键添加到代码……同时支持接入自定义物料，对物料开发的链路提供了全流程的支持，开发者可轻松定制业务专属的物料集合：

![物料示例](https://img.alicdn.com/tfs/TB1UjO9SET1gK0jSZFrXXcNCXXa-1000-750.png_790x10000.jpg)

## 快速开始

点击活动栏上的 Iceworks 图标，打开侧边栏和创建应用流程：

![使用示例](https://img.alicdn.com/tfs/TB1Qr7oi8Bh1e4jSZFhXXcC9VXa-1024-768.png_790x10000.jpg)

应用创建完成，在 Iceworks 侧边栏上进行 npm 脚本执行、创建组件、生成页面等操作：

![使用示例](https://img.alicdn.com/tfs/TB1knetjk9l0K4jSZFKXXXFjpXa-1024-768.png_790x10000.jpg)

## 插件列表

Iceworks 套件内包含以下插件：

插件 | 简介 | 徽标
--------- | ------- | ---------
[应用资源管理器](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app) | 从 UI 组织视角预览应用的组织，提供 Iceworks 快速操作入口 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-app.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[创建应用](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-project-creator) | 通过界面引导，使用模板创建多端应用 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-project-creator.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-project-creator.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-project-creator)
[可视化搭建](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder) | 通过可视化搭建操作生成用户界面 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-ui-builder.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-ui-builder.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-ui-builder)
[样式开发辅助](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper) | 提供在 JSX 内编写行内样式或使用 SASS/Less 等 CSS 预处理语言的代码编辑智能辅助 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-style-helper.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-style-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper)
[组件开发辅助](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper) | 更快更好地添加组件、编写组件属性 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-material-helper.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[应用配置开发辅助](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-config-helper) | 为应用的配置类文件（例如 *.json）提供可视化表单设置及代码编辑提醒、校验等功能 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-config-helper.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-config-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-config-helper)
[项目质量检测](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-doctor) | 安全和质量审核工具，快速检测到应用程序和基础库代码中的各种安全漏洞和质量问题 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.doctor.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.doctor.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.doctor)

## 获取帮助

- 加入[钉钉](https://www.dingtalk.com/)交流群

  ![二维码](https://img.alicdn.com/tfs/TB1oDJzTeL2gK0jSZFmXXc7iXXa-379-378.png_220x10000.jpg)
- 提交问题

  向 Iceworks 的 Github 仓库提交 [issue](https://github.com/ice-lab/iceworks/issues/new) ，我们会快速响应所提交的问题。
- 预约培训

  对于打算大规模使用的公司或团队，我们可以提供免费的培训，具体请咨询 @梧忌(wuji.xwt@alibabab-inc.com)
