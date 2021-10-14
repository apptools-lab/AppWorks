简体中文 | [English](https://github.com/apptools-lab/appworks/blob/master/extensions/style-helper/README.md)

# React 样式开发辅助插件

[![Version for VS Code Extension](https://vsmarketplacebadge.apphb.com/version-short/iceworks-team.iceworks-style-helper.svg?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/iceworks-team.iceworks-style-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/iceworks-team.iceworks-style-helper.svg)](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks-style-helper)
[![The MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

方便您在 [JSX](https://zh-hans.reactjs.org/docs/introducing-jsx.html) 中更快速地编写内联样式，并对 CSS、LESS、SASS 等样式文件提供强大的辅助开发功能。对 React 和 [Rax](https://rax.js.org/) 应用友好。

支持：

* 自动补全
* 跳转至样式和变量定义位置
* 创建 JSX/TSX 的行内样式
* 预览样式及变量内容
* 自动 import CSS Modules 文件

## 示例

在 JSX/TSX 文件中编辑组件的 `className` 属性时给予自动补全提醒，值预览及定义跳转。

![demo](https://img.alicdn.com/imgextra/i2/O1CN01fiRbHN1gY7XQOSAlk_!!6000000004153-1-tps-750-545.gif)

行内样式自动补全，同时支持 SASS 变量的跳转及预览。

![demo](https://img.alicdn.com/imgextra/i1/O1CN01eK13T81wvy0wwt2v5_!!6000000006371-1-tps-750-546.gif)

自动 import CSS Modules 文件。

![demo](https://img.alicdn.com/imgextra/i1/O1CN01vdcFLc1Uw8xTHUfLx_!!6000000002581-1-tps-1712-666.gif)

## 使用

预览：鼠标停留在 `className` 或 SASS 变量上，出现悬浮部件显示该值对应的样式声明

跳转：通过 cmd + 左键点击（ Windows: ctrl + 左键点击 ）进行变量的定义代码跳转

## 更多

本插件由 [AppWorks Team](https://marketplace.visualstudio.com/publishers/iceworks-team) 开发，是 AppWorks 套件的一部分，访问 [AppWorks](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks) 获取更多功能。
