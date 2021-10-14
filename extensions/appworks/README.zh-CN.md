简体中文 | [English](https://github.com/apptools-lab/appworks/blob/master/extensions/appworks/README.md)

# AppWorks

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks)
[![Downloads](https://vsmarketplacebadge.apphb.com/downloads-short/iceworks-team.iceworks.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-star/iceworks-team.iceworks.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks&ssr=false#review-details)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/apptools-lab/appworks/pulls)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

前端研发套件，通过可视化编程和编码辅助手段，更快更好地构建多端应用，支持 Web 、HTML 5 和小程序应用。

## 核心特性

### 编码辅助

AppWorks 编码辅助提供了代码自动补全、代码信息提示和代码重构等功能。

以代码自动补全为例，在开发者编写代码的过程中，自动预测开发者的编程意图，连续向开发者推荐「即将书写的下一段代码」，开发者可以通过「一键补全」的方式，直接确认接下来要输入的代码，从而大大提升代码的编写效率。例如输入样式字段和值时，AppWorks 提供的代码自动补全效果如下：

![使用示例](https://user-images.githubusercontent.com/56879942/87412958-3895e700-c5fc-11ea-88e2-3e3e78a07f9e.gif)

AppWorks 的代码自动补全能力基于语言语义和源代码分析，完全本地执行，确保代码安全；毫秒级响应，流畅进行编码！

### 可视化开发

AppWorks 提供海量的物料和可视化消费物料的方式提升多端应用的开发效率。

例如，你可以使用模板快速创建项目；可以使用物料面板，将一些精品物料添加到项目当中。

![使用示例](https://user-images.githubusercontent.com/56879942/88197928-b8aff280-cc75-11ea-816d-1c609bc90878.gif)

如果已有的物料不能满足你的需求，AppWorks 还提供了从生产到消费的自定义物料开发链路，完全打造业务专属的物料库。

### 编码质效

AppWorks 编码质效当前提供了两个基本功能：质量检查修复和编程时间管理。

我们基于大量的企业级项目实践，产出了质量评估模型，它能够为项目生成质量报告，并提供了修复相关质量问题的方法。
编程时间管理则是通过自动跟踪开发者的编码活动从而度量开发者编码效率的功能，它能够帮助开发者回顾自己的编码活动，生成编码效率报告并给予相关的提效建议。

![Doctor](https://img.alicdn.com/imgextra/i4/O1CN01FNcqIN1orpTya1lj8_!!6000000005279-2-tps-746-387.png)

## 快速开始

点击活动栏上的 AppWorks 图标，打开侧边栏和创建应用流程：

![使用示例](https://img.alicdn.com/imgextra/i1/O1CN010M4ptc1m2Poa9hcxi_!!6000000004896-2-tps-2880-1754.png)

应用创建完成，在 AppWorks 侧边栏上进行 npm 脚本执行、创建组件、生成页面等操作：

![使用示例](https://img.alicdn.com/imgextra/i3/O1CN01Jy7KnX1KzDQ8Ifxkk_!!6000000001234-2-tps-2880-1754.png)

## 插件列表

AppWorks 套件内包含以下自研插件：

插件 | 简介 | 徽标
--------- | ------- | ---------
[应用管理器](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app) | 从 UI 组织视角预览应用的组织，提供 AppWorks 快速操作入口 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-app.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-app.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-app)
[创建应用](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-project-creator) | 通过界面引导，使用模板创建多端应用 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-project-creator.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-project-creator.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-project-creator)
[样式开发辅助](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper) | 提供在 JSX 内编写行内样式或使用 SASS/Less 等 CSS 预处理语言的代码编辑智能辅助 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-style-helper.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-style-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper)
[组件开发辅助](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper) | 更快更好地添加组件、编写组件属性 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-material-helper.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[代码更新辅助](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-codemod) | 一个帮助您进行大规模代码库重构的工具，这些重构是自动化的，但也提供了人为监督和偶尔干预的方式。 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-codemod.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-codemod.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-codemod)
[质量检测](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-doctor) | 安全和质量审核工具，快速检测到应用程序和基础库代码中的各种安全漏洞和质量问题 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.doctor.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.doctor.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.doctor)
[时间管理](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-time-master) | 通过自动跟踪您的编码活动从而度量您的编码效率 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-time-master.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-time-master.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-time-master)
[代码重构](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-refactor) | 更简单地重构你的 React / Rax 组件 | ![Version](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-refactor.svg) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-refactor.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-refactor)

AppWorks 套件内包含以下推荐的三方插件：

- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens): 增强 VS Code 中内置的 Git 功能
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker): 英文拼写检查器
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): [ESLint](https://eslint.org/) 配套的检查器
- [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint): [stylelint](https://stylelint.io/) 配套的检查器
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): 代码格式化工具
- [Auto Complete Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-complete-tag): 自动闭合和重命名标签
- [JavaScript (ES6) code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets): ES6 语法的 JavaScript 代码片段
- [Simple React Snippets](https://marketplace.visualstudio.com/items?itemName=burkeholland.simple-react-snippets): React 代码片段
- [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner): 快速运行文件和代码片段，支持多种开发语言.
- [Bookmarks](https://marketplace.visualstudio.com/items?itemName=alefragnani.Bookmarks): 源码阅读神器

## 获取帮助

向 AppWorks 的 Github 仓库提交 [issue](https://github.com/apptools-lab/appworks/issues/new) ，我们会快速响应所提交的问题。
