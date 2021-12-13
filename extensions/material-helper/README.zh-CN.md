简体中文 | [English](https://github.com/apptools-lab/appworks/blob/master/extensions/material-helper/README.md)

# 前端组件开发辅助插件

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-material-helper.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-material-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-material-helper)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

在 [JSX](https://zh-hans.reactjs.org/docs/introducing-jsx.html) 中更快更好地添加组件、编写组件属性、查找组件文档，对 React 和 [Rax](https://rax.js.org/) 应用友好。

## JS 项目组件属性自动补全

* React: 自动补全业务组件 props。

![img01](https://img.alicdn.com/imgextra/i4/O1CN01VVzQRF1NkVYGN3rrg_!!6000000001608-1-tps-900-513.gif)

* Rax: 自动补全业务组件 和 [rax-components](https://github.com/raxjs/rax-components/) 的 props。

![img02](https://img.alicdn.com/imgextra/i2/O1CN01D6Zb3r1b7wpFzjWyk_!!6000000003419-1-tps-900-513.gif)

## 页面和组件视窗

![示例](https://img.alicdn.com/imgextra/i2/O1CN01Ut9Fzk1fJB09qh8Xk_!!6000000003985-2-tps-2048-1536.png)

快速打开对应页面和组件源码文件：

1. 点击左侧面板中页面列表和组件列表中的选项
2. 打开所选项目所在的源码文件

激活添加页面和组件功能：

1. 点击页面列表标题栏的 `+` 进入生成页面界面；
2. 点击组件列表标题栏的 `+` 进入创建组件界面。

## 使用物料面板

> [什么是物料？](https://ice.work/docs/materials/about)

![使用示例](https://img.alicdn.com/imgextra/i2/O1CN01IMWBdS1qFvyDEQ4eV_!!6000000005467-1-tps-1446-877.gif)

1. 在资源面板中点击 src/pages/*/index.tsx 打开页面源码
2. 在命令面板输入 `AppWorks: 添加组件` 激活物料添加面板
3. 选择需要插入物料的代码位置
4. 搜索区块，点击需要使用的区块，物料代码将自动添加到相应的位置中
5. 搜索组件，点击需要使用的组件，物料代码将自动添加到相应的位置中

## 拼接区块组装页面

通过可视化操作，以区块拼装的方式快速生成页面。

![拼接区块组装页面](https://img.alicdn.com/imgextra/i2/O1CN01ankDUO1EsRsSPIv4h_!!6000000000407-1-tps-1446-877.gif)

1. 通过 `⇧⌘P` 或 `Ctrl+Shift+P` 快捷键唤醒命令面板；
2. 在命令面板中输入 `AppWorks: 使用区块组装页面` ，点击选中的项目或按下键盘回车键，激活页面生成插件。
3. 从右侧的区块列表中选择页面需要使用的区块，点击添加到左侧页面预览区；
4. 在左侧页面预览区可通过拖拽排序区块的顺序，或点击右上角的删除图标移除区块；
5. 点击“生成页面”按钮，输入页面名称和路由路径，点击"确认"按钮，生成页面代码，页面代码将生成到 `src/pages/` 目录下。
## 下载远程物料到本地

为 React 和 [Rax](https://rax.js.org/) 应用提供了海量的高质量物料，通过选择物料快速创建前端组件。

![下载远程物料到本地](https://img.alicdn.com/imgextra/i1/O1CN01FJU1ww1DFgkD8jyjn_!!6000000000187-1-tps-1446-877.gif)

1. 通过 `⇧⌘P` ( MacOS ) 或 `Ctrl+Shift+p` ( Windows ) 快捷键唤起命令面板；
2. 输入 `AppWorks: 下载物料到本地` ，点击选中的项目或按下键盘回车键，激活插件。
3. 填写组件名（同时也是组件所在文件夹的名称)；
4. 组件名输入框下方选择一个使用的区块；
5. 点击 `创建组件` 按钮，生成组件代码。

## 组件文档搜索

![使用说明](https://img.alicdn.com/imgextra/i4/O1CN012XEq3P1wwQPSlxhh5_!!6000000006372-1-tps-1446-877.gif)

1. 在 JSX 中通过鼠标右键激活
2. 搜索您需要查找文档的组件名
3. 点击组件名后，选择打开组件文档的方式
4. 浏览文档

> 您可以选择是否在 VS Code 浏览文档网页，这一功能依赖 [Browser Preview](https://marketplace.visualstudio.com/items?itemName=auchenberg.vscode-browser-preview) 插件进行实现。 如果您希望在 VS Code 内部浏览文档，请先安装此插件。

## 组件属性自动补全

在 JSX 文件中编辑组件的属性时将给予自动补全提醒：

![使用说明](https://user-images.githubusercontent.com/56879942/87399599-2dd25680-c5ea-11ea-9402-5e36ba7b8f98.gif)

1. 在 JSX 文件中使用组件（如 View ）
2. 在组件标签内输入属性的部分内容，将会激活自动补全提醒。

## 自动填充 React/Rax 代码片段到文件

在创建文件夹或文件时，识别创建组件的意图，自动创建 index.j[t]sx 文件并填充代码片段。

![示例](https://img.alicdn.com/imgextra/i4/O1CN01Dv69331TccQVHvwR1_!!6000000002403-1-tps-1446-877.gif)

## 更多

本插件由 [AppWorks Team](https://marketplace.visualstudio.com/publishers/iceworks-team) 开发，是 AppWorks 套件的一部分，访问 [AppWorks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) 获取更多功能。
